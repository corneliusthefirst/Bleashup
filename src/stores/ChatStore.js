import storage from "./Storage";
import { orderBy, filter, reject, findIndex, uniqBy } from "lodash";
import moment from "moment";
import { observable, action } from "mobx";
import emitter from '../services/eventEmiter';
import request from '../services/requestObjects';
import message_types from '../components/myscreens/eventChat/message_types';

class ChatStore {
    constructor() {
        //storage.remove({key:this.key})
        this.initializeStore();
        this.saveInterval = setInterval(() => {
            this.previousModif !== this.currentModif ? this.saver() : null;
        }, this.timer);
    }
    previousModif = moment().format();
    currentModif = moment().format();
    timer = 2000;
    saveInterval = null;
    commenting = false;
    addToStore(data, message_id) {
        this.setProperties(data);
        this.currentModif = moment().format();
        if (message_id) {
            console.warn("emitting message update")
            emitter.emit("updated" + message_id)
        }
    }
    saver() {
        if (Object.keys(this.messages).length > 0) {
            this.saveKey.data = this.messages;
            storage.save(this.saveKey).then(() => {
                this.previousModif = this.currentModif;
                console.warn("saving current messages state");
            });
        }
    }
    loadLatestMessage(roomID, key) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then((messages) => {
                resolve(messages[roomID] ? messages[roomID][0] : []);
            });
        });
    }
    addMessageToStore(roomID, newMessage) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then((olddata) => {
                this.insetDateSeparator(
                    roomID,
                    this.commenting ? this.messages : olddata,
                    newMessage
                ).then((data) => {
                    data[roomID]
                        ? data[roomID].unshift(newMessage)
                        : (data[roomID] = [newMessage]);
                    this.addToStore(data);
                    resolve(data);
                });
            });
        });
    }
    setMessageDimessions(roomID, id, dim) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then((messages) => {
                let index = findIndex(messages[roomID], { id: id });
                messages[roomID][index].dimenssions = dim;
                this.addToStore(messages);
                resolve(messages);
            });
        });
    }
    insetDateSeparator(roomID, messages, newMessage) {
        return new Promise((resolve, reject) => {
            let separator = {
                ...newMessage,
                id: moment(newMessage.created_at).format("YYYY/MM/DD"),
                type: "date_separator",
            };
            index = findIndex(messages[roomID], { id: separator.id });
            let result = messages;
            result[roomID] =
                index && index >= 0
                    ? messages[roomID]
                    : [separator].concat(messages[roomID] || []);
            resolve(result);
        });
    }
    receiveMessage(roomID, receiver, messageID) {
        return new promise((resolve, reject) => {
            this.readFromStore().then((messages) => {
                let index = findIndex(messages[roomID], { id: messageID });
                messages[roomID][index].receive? messages[roomID][index].recieve.unshift(receiver):
                    messages[roomID][index].receive = [receiver];
                this.addToStore(messages);
                resolve();
            });
        });
    }
    deleteMessage(roomID, messageID) {
        return new Promise((resolve, rejec) => {
            this.readFromStore().then((messages) => {
                messages[roomID] = reject(messages[roomID], { id: messageID });
                this.addToStore(messages);
                resolve();
            });
        });
    }
    updateMessageText(roomID, messageID, newText) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then((messages) => {
                let index = findIndex(messages[roomID], { id: messageID });
                messages[roomID][index].text = newText;
                this.addToStore(messages);
                resolve();
            });
        });
    }
    playedMessage(roomID, messageID, player) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then((messages) => {
                let index = findIndex(messages[roomID], { id: messageID });
                messages[roomID][index].played
                    ? messages[roomID][index].played.unshift(player)
                    : (messages[roomID][index].played = [player]);
                this.addToStore(messages);
                resolve();
            });
        });
    }
    seenMessage(roomID, messageID, seer) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(messages => {
                let index = findIndex(messages[roomID], { id: messageID });
                messages[roomID][index].seer
                    ? messages[roomID][index].seer.unshift(seer)
                    : (messages[roomID][index].seer = [seer]);
                messages[roomID][index] = this.add_updated_at(messages[roomID][index])
                this.addToStore(messages);
                resolve();
            })
        });
    }
    @action reactToMessage(roomID, messageID, reaction) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(messages => {
                let index = findIndex(messages[roomID], { id: messageID });
                if (messages[roomID][index].reaction) {
                    let reactionIndex = findIndex(messages[roomID][index].reaction, {
                        reaction: reaction.reaction,
                    });
                    if (reactionIndex >= 0) {
                        messages[roomID][index].reaction[reactionIndex].reacters.push(
                            reaction.reacter
                        );
                        messages[roomID][index].reaction[reactionIndex].count = messages[
                            roomID
                        ][index].reaction[reactionIndex].reacters.length;
                    } else {
                        let newReaction = { reaction: reaction.reaction, reacters: [reaction.reacter], count: 1 }
                        messages[roomID][index].reaction.push(newReaction)
                    }
                } else {
                    messages[roomID][index].reaction =
                        [{ reaction: reaction.reaction, reacters: [reaction.reacter], count: 1 }]
                }
                messages[roomID][index].updated_at = moment().format()
                this.addToStore(messages, messageID)
            })
        });
    }
    saveMessageKey(roomID, messageID, key) {
        return new Promise((resolve, reject) => {
            let index = findIndex(messages[roomID], { id: messageID });
            messages[roomID][index].key = key;
            this.addToStore(messages);
            resolve();
        });
    }
    persistMessageDimenssions(dims, index, roomID) {
        this.messages[roomID][index].dimensions = dims
        this.currentModif = moment().format()
    }
    addNewMessage(roomID, newMessage) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then((olddata) => {
                this.insetDateSeparator(roomID, olddata, newMessage).then((data) => {
                    let index = findIndex(data[roomID], { id: newMessage.id });
                    if (index >= 0) {
                        data[roomID][index] = {
                            ...data[roomID][index],
                            receive: newMessage.receive,
                            key: newMessage.key,
                            sent: newMessage.sent,
                            type: newMessage.type,
                        };
                        this.addToStore(data);
                        resolve(data);
                    } else {
                        newMessage = { ...newMessage };
                        data[roomID]
                            ? data[roomID].unshift(newMessage)
                            : (data[roomID] = [newMessage]);
                        this.addToStore(data);
                        resolve(data);
                    }
                });
            });
        });
    }
    addAndReadFromStore(value) {
        return new Promise((resolve, rejec) => {
            let tempKey = { ...this.saveKey, key: "temp", data: value };
            storage.save(tempKey).then(() => {
                tempKey = { ...this.storeAccessKey, key: "temp" };
                storage.load(tempKey).then((data) => {
                    resolve(data);
                });
            });
        });
    }
    removeMessage(roomID, messageID) {
        return new Promise((resolve, reje) => {
            this.readFromStore().then((data) => {
                let index = findIndex(data[roomID], { id: messageID });
                if (index <= 0 && data[roomID][index + 1].type === message_types.date_separator) {
                    let otherID = data[roomID][index + 1].id;
                    data[roomID] = reject(data[roomID], { id: messageID });
                    data[roomID] = reject(data[roomID], { id: otherID });
                    this.addToStore(data);
                    resolve(data);
                } else if (data[roomID][index + 1].type === message_types.date_separator && 
                    data[roomID][index + -1] && 
                    data[roomID][index - 1].type === message_types.date_separator){
                    let otherID = data[roomID][index - 1].id;
                    data[roomID] = reject(data[roomID], { id: messageID });
                    data[roomID] = reject(data[roomID], { id: otherID });
                    } else {
                    data[roomID] = reject(data[roomID], { id: messageID });
                    this.addToStore(data);
                    resolve();
                }
            });
        });
    }
    replaceNewMessage(roomID, newMessage) {
        return new Promise((resolve, rejec) => {
            this.readFromStore().then((data) => {
                data[roomID] = reject(data[roomID], { id: newMessage.id });
                data[roomID].unshift(newMessage);
                this.addToStore(data);
                resolve("ok");
            });
        });
    }
    replaceMessage(roomID, newMessage) {
        return new Promise((resolve, rejec) => {
            this.readFromStore().then((data) => {
                index = findIndex(data[roomID], { id: newMessage.id });
                if (index < 0) {
                    resolve(request.Message())
                } else {
                    data[roomID][index] = newMessage;
                    this.addToStore(data);
                    resolve(data);
                }
            });
        });
    }
    @observable messages = {};
    storeAccessKey = {
        key: this.key,
        autoSync: true,
    };
    key = "messages";
    saveKey = {
        key: this.key,
        data: {},
    };
    initializeStore() {
        storage
            .load({ key: this.key })
            .then((chats) => {
                chats ? (this.messages = chats) : (this.messages = {});
            })
            .catch((error) => {
                this.messages = {};
            });
    }
    readFromStore() {
        return new Promise((resolve, reject) => {
            resolve(this.messages);
        });
    }
    setProperties(chats) {
        this.messages = chats;
    }
    insertBulkMessages(roomID, messages) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then((data) => {
                data[roomID] = data[roomID] ? messages.concat(data[roomID]) : messages;
                data[roomID] = uniqBy(data[roomID], "id");
                this.addToStore(data);
                resolve();
            });
        });
    }
    addDuration(roomID, duration, id) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then((data) => {
                let index = findIndex(data[roomID], { id: id });
                if (data[roomID][index]) {
                    data[roomID][index].duration = duration;
                    this.addToStore(data);
                    resolve("ok");
                } else {
                    resolve("not found");
                }
            });
        });
    }
    addVideoProperties(roomID, id, path, total, received) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then((data) => {
                let index = findIndex(data[roomID], { id: id });
                if (data[roomID][index]) {
                    data[roomID][index].total = total;
                    data[roomID][index].received = received;
                    data[roomID][index].source = path;
                    this.addToStore(data);
                    resolve("ok");
                } else {
                    resolve("not found");
                }
            });
        });
    }
    addMessage(roomID, message) {
        return new Promise((resolve, reject) => {
            this.messages[roomID].unshift(message);
            resolve();
        });
    }
    @action addVideoSizeProperties(roomID, id, total, recieved) {
        return this.addAudioSizeProperties(roomID, id, total, recieved);
    }
    AddAudioSizePropperties(total, recieved) {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    addAudioSizeProperties(roomID, id, total, recieved, duration) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then((data) => {
                let index = findIndex(data[roomID], { id: id });
                if (data[roomID][index]) {
                    data[roomID][index].total = total;
                    data[roomID][index].received = recieved;
                    data[roomID][index].duration = duration;
                    this.addToStore(data);
                    this.setProperties(data);
                    resolve("ok");
                } else {
                    resolve("not found");
                }
            });
        });
    }
    SetCancledState(roomID, id) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then((data) => {
                let index = findIndex(data[roomID], { id: id });
                if (data[roomID][index]) {
                    data[roomID][index].cancled = true;
                    this.addToStore(data);
                    this.setProperties(data);
                    resolve("ok");
                } else {
                    resolve("not found");
                }
            });
        });
    }
    deleteNewMessageIndicator(roomID) {
        return new Promise((resolve, rejec) => {
            this.readFromStore().then((data) => {
                data[roomID] = reject(data[roomID], { type: "new_separator" });
                this.addToStore(data);
                resolve("ok");
            });
        });
    }
    addStaticFilePath(roomID, url, id) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then((data) => {
                let index = findIndex(data[roomID], { id: id });
                if (data[roomID][index]) {
                    data[roomID][index].source = url;
                    data[roomID][index] = this.add_updated_at(data[roomID][index])
                    this.addToStore(data);
                    this.setProperties(data);
                    resolve("ok");
                } else {
                    resolve("not found");
                }
            });
        });
    }
    add_updated_at(data){
        return {...data,updated_at:moment().format()}
    }
}

export default ChatStore;
