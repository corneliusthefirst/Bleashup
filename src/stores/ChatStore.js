import storage from "./Storage";
import { orderBy, filter, reject, findIndex, uniqBy } from "lodash";
import moment from "moment";
import { observable, action } from "mobx";
import emitter from '../services/eventEmiter';
import request from '../services/requestObjects';
import message_types from '../components/myscreens/eventChat/message_types';
import stores from ".";
import messagePreparer from '../components/myscreens/eventChat/messagePreparer';
import Texts from '../meta/text';

class ChatStore {
    constructor() {
        //storage.remove({key:this.key})
        this.initializeStore();
        this.startSaver()
    }
    startSaver() {
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
        newMessage.committee_id = roomID
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
    addNewSeparator(roomID, sender) {
        let newMessages = stores.States.getNewMessagesCount(roomID)
        if (newMessages) {
            this.messages[roomID] = this.messages[roomID] ?
                reject(this.messages[roomID], { id: Texts.new_messages }) :
                this.messages[roomID]
            this.messages[roomID] &&
                this.messages[roomID].splice &&
                this.messages[roomID].
                    splice(newMessages, 0, {
                        ...request.Message(),
                        id: Texts.new_messages,
                        type: message_types.new_separator,
                        created_at: moment().format(),
                    })
        }
    }
    removeNewIndicator(roomID) {
        this.messages[roomID] = this.messages[roomID] ?
            reject(this.messages[roomID], { id: Texts.new_messages }) :
            this.messages[roomID]
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
    insetDateSeparator(roomID, newMessage) {
        return new Promise((resolve, reject) => {
            let separator = {
                ...request.Message(),
                id: moment(newMessage.created_at).format("YYYY/MM/DD"),
                type: message_types.date_separator,
            };
            let index = findIndex(this.messages[roomID], { id: separator.id });
            this.messages[roomID] =
                index && index >= 0
                    ? this.messages[roomID]
                    : [separator].concat(this.messages[roomID] || []);
            resolve(this.messages);
        });
    }
    receiveMessage(roomID, receiver, messageID) {
        return new promise((resolve, reject) => {
            this.readFromStore().then((messages) => {
                let index = findIndex(messages[roomID], { id: messageID });
                messages[roomID][index].receive ? messages[roomID][index].recieve.unshift(receiver) :
                    messages[roomID][index].receive = [receiver];
                messages[roomID][index].updated_at = moment().format()
                messages[roomID][index].receive = uniqBy(messages[roomID][index].receive, "phone")
                messages[roomID][index] = this.add_updated_at(messages[roomID][index])
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
                messages[roomID][index].updated_at = moment().format()
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
                messages[roomID][index].updated_at = moment().format()
                messages[roomID][index].played = uniqBy(messages[roomID][index].played, "phone")
                messages[roomID][index] = this.add_updated_at(messages[roomID][index])
                this.addToStore(messages);
                resolve();
            });
        });
    }
    seenMessage(roomID, messageID, seer) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(messages => {
                let index = findIndex(messages[roomID], { id: messageID });
                messages[roomID][index].seen
                    ? messages[roomID][index].seen.unshift(seer)
                    : (messages[roomID][index].seen = [seer]);
                messages[roomID][index].updated_at = moment().format()
                messages[roomID][index].seen = uniqBy(messages[roomID][index].seen, "phone")
                messages[roomID][index] = this.add_updated_at(messages[roomID][index])
                this.addToStore(messages);
                resolve();
            })
        });
    }
    haveIseen(message, phone) {
        return message.seen &&
            message.seen.findIndex(ele => ele && ele.phone === phone) >= 0 ?
            true : false
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
                this.addToStore(messages)
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
            this.insetDateSeparator(roomID, newMessage).then((data) => {
                let index = findIndex(this.messages[roomID], { id: newMessage.id });
                if (index >= 0) {
                    this.messages[roomID][index] = {
                        ...this.messages[roomID][index],
                        receive: newMessage.receive,
                        key: newMessage.key,
                        sent: newMessage.sent,
                        type: newMessage.type,
                    };
                    this.addToStore(this.messages);
                    resolve(this.messages);
                } else {
                    newMessage = { ...newMessage };
                    this.messages[roomID]
                        ? this.messages[roomID].unshift(newMessage)
                        : (this.messages[roomID] = [newMessage]);
                    this.addToStore(this.messages);
                    resolve(this.messages);
                }
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
                const mess = data[roomID][index]
                if (index <= 0 && data[roomID][index + 1].type === message_types.date_separator) {
                    let otherID = data[roomID][index + 1].id;
                    data[roomID] = reject(data[roomID],
                        (ele) => ele.id == messageID || ele.id == otherID);
                    this.addToStore(data);
                    resolve(data);
                } else if (data[roomID][index + 1].type === message_types.date_separator &&
                    data[roomID][index + -1] &&
                    data[roomID][index - 1].type === message_types.date_separator) {
                    let otherID = data[roomID][index - 1].id;
                    data[roomID] = reject(data[roomID],
                        (ele) => ele.id == messageID || ele.id == otherID);
                } else {
                    data[roomID] = reject(data[roomID], { id: messageID });
                    this.addToStore(data);
                    resolve(mess);
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
        setTimeout(() => {
            storage
                .load({ key: this.key })
                .then((chats) => {
                    chats ? (this.messages = chats) : (this.messages = {});
                })
                .catch((error) => {
                    this.messages = {};
                });
        })
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
                    data[roomID][index].updated_at = moment().format()
                    this.addToStore(data);
                    resolve("ok");
                } else {
                    resolve("not found");
                }
            });
        });
    }
    addVideoProperties(roomID, id, path, total, received,origin) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then((data) => {
                let index = findIndex(data[roomID], { id: id });
                if (data[roomID][index]) {
                    data[roomID][index].total = total;
                    data[roomID][index].updated_at = moment().format()
                    data[roomID][index].temp = origin
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
                    data[roomID][index].updated_at = moment().format()
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
                    data[roomID][index].updated_at = moment().format()
                    this.addToStore(data);
                    this.setProperties(data);
                    resolve("ok");
                } else {
                    resolve("not found");
                }
            });
        });
    }
    updateRemindInfoInMessage(roomID, id, remind) {
        return new Promise((resolve, reject) => {
            let newMessage = messagePreparer.formMessageFromRemind(remind)
            this.readFromStore().then(messages => {
                const index = findIndex(messages[roomID], { id })
                if (index >= 0) {
                    if (messages[roomID][index]) {
                        messages[roomID][index].text = newMessage.text
                        messages[roomID][index].remind_date = newMessage.remind_date
                        messages[roomID][index].end_date = newMessage.end_date
                        messages[roomID][index].updated_at = moment().format()
                        messages[roomID][index].tags = newMessage.tags
                    }
                }
                this.addToStore(messages)
            })
        })

    }
    updateStarMessageInfoMessage(roomID, id, star) {
        return new Promise((resolve, reject) => {
            star = messagePreparer.formMessagefromStar(star)
            return new Promise((resolve, reject) => {
                this.readFromStore().then(messages => {
                    const index = findIndex(messages[roomID], { id })
                    if (index >= 0) {
                        if (messages[roomID][index]) {
                            messages[roomID][index].text = newMessage.text
                            messages[roomID][index].updated_at = moment().format()
                            messages[roomID][index].tags = newMessage.tags
                        }
                    }
                    this.addToStore(messages)
                })
            })
        })
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
                    data[roomID][index].updated_at = moment().format()
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
    add_updated_at(data) {
        return { ...data, updated_at: moment().format() }
    }
}

export default ChatStore;
