import { observable } from 'mobx'
import storage from './Storage'
import { orderBy, filter, reject, findIndex,uniqBy } from "lodash"
import autobind from 'autobind-decorator'
import moment, { months } from "moment";
class ChatStore {
    constructor(key) {

        this.storeAccessKey.key = key
        this.saveKey.key = key
       // storage.remove({key:key}).then(()=>{
            
        //})
        this.readFromStore().then(value => {
            this.setProperties(value)
     })

    }
    addToStore(data) {
        this.saveKey.data = data;
        return storage.save(this.saveKey)
    }
    loadLatestMessage(key){
        return new Promise((resolve,reject) =>{
            this.readFromStore().then(messages => {
                resolve(messages[0])
            })
        })
    }
    addMessageToStore(newMessage) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(olddata => {
                this.insetDateSeparator(olddata, newMessage).then(data => {
                    //console.warn(data,"....")
                    data.unshift(newMessage)
                    return this.addToStore(data).then(() => {
                        this.messages = data
                        resolve(data)
                    })
                })
            })
        })
    }
    insetDateSeparator(messages, newMessage) {
        return new Promise((resolve, reject) => {
            let separator = { ...newMessage, id: moment(newMessage.created_at).format("YYYY/MM/DD"), type: "date_separator" }
            index = findIndex(messages, { id: separator.id })
            let result = index >= 0 ? messages : [separator].concat(messages)
            resolve(result)
        })
    }
    addNewMessage(newMessage, newKey, type, sent, newing) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(olddata => {
                this.insetDateSeparator(olddata, newMessage).then(data => {
                    let index = findIndex(data, { id: newMessage.id });
                    if (index >= 0) {
                        data[index] = { ...data[index], received: newMessage.received, key: newKey, sent: sent, type: type };
                        this.addToStore(data).then(() => {
                            this.messages = data
                            resolve(data)
                        })
                        newing ? this.messages = data : null
                    } else {
                        data.unshift({ ...newMessage, key: newKey, sent: sent, type: type, received: newMessage.received })
                        newing ? this.messages = data : null
                        this.addToStore(data).then(() => {
                            this.messages = data
                            resolve(data)
                        })
                    }
                })
            })
        })
    }
    addAndReadFromStore(value) {
        return new Promise((resolve, rejec) => {
            let tempKey = { ...this.saveKey, key: "temp", data: value }
            storage.save(tempKey).then(() => {
                tempKey = { ...this.storeAccessKey, key: "temp" }
                storage.load(tempKey).then(data => {
                    resolve(data)
                })
            })
        })
    }
    removeMessage(messageID) {
        return new Promise((resolve, reje) => {
            this.readFromStore().then(data => {
                data = reject(data, { id: messageID })
                this.addToStore(data).then(() => {
                    resolve()
                })
            })
        })
    }
    replaceNewMessage(newMessage) {
        return new Promise((resolve, rejec) => {
            this.readFromStore().then(data => {
                data = reject(data, { id: newMessage.id })
                data.unshift(newMessage)
                this.addToStore(data).then(() => {
                    resolve("ok")
                })
            })
        })
    }
    replaceMessage(newMessage) {
        return new Promise((resolve, rejec) => {
            this.readFromStore().then(data => {
                index = findIndex(data, { id: newMessage.id })
                data[index] = newMessage
                this.addToStore(data).then(() => {
                    resolve("ok")
                })
            })
        })
    }
    /*@observable*/ messages = [/*{
        id: '0',
        source: 'http://192.168.43.32:8555/sound/get/p2.mp3',
        file_name: 'p2.mp3',
        total: 0,
        received: 0,
        user: 2,
        creator: 2,
        type: 'audio',
        sender: {
            phone: 3,
            nickname: "Sokeng Kamga"
        },
        duration: Math.floor(0),
        created_at: "2014-03-30 12:32",
    }, {
        id: '1',
        //source: 'http://192.168.43.32:8555/sound/get/p2.mp3',
        file_name: 'p2.mp3',
        total: 0,
        received: 0,
        user: 1,
        creator: 2,
        type: 'text',
        text: `hello`,
        sender: {
            phone: 3,
            nickname: "Sokeng Kamga"
        },
        duration: Math.floor(0),
        created_at: "2014-03-30 12:32",
    }, {
        id: '2',
        sender: {
            phone: 2,
            nickname: "Sokeng Kamga"
        },
        user: 1,
        reply: {
            id: 3,
            user: 2,
            text: `Hello!  Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>`,
            video: true,
            replyer_name: "Santers Gipson",
            source: "http://192.168.43.32:8555/sound/get/bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg"
        },
        creator: 3,
        type: "photo",
        photo: "http://192.168.43.32:8555/sound/get/bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg",
        file_name: 'bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg',
        created_at: "2014-03-30 12:32",
        text: `Hello!`
    }, {
        id: '3',
        source: 'http://192.168.43.32:8555/video/get/bma9auo13ult3nh5n690_bma9auo13ult3nh5n69g_bma9auo13ult3nh5n6a0.mp4',
        file_name: 'bma9auo13ult3nh5n690_bma9auo13ult3nh5n69g_bma9auo13ult3nh5n6a0_thumbnail.jpeg',
        thumbnailSource: 'http://192.168.43.32:8555/video/thumbnail/get/bma9auo13ult3nh5n690_bma9auo13ult3nh5n69g_bma9auo13ult3nh5n6a0_thumbnail.jpeg',
        sender: {
            phone: 3,
            nickname: "Sokeng Kamga"
        },
        user: 2,
        creator: 3,
        type: "video",
        received: 0,
        total: 0,
        reply: {
            id: 2,
            user: 3,
            text: `Hello!  Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>`,
            video: true,
            replyer_name: "Santers Gipson",
            source: "http://192.168.43.32:8555/sound/get/bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg"
        },
        text: `Hello!
        Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>
You can of course use any editor you like to write Erlang programs, but if you use Emacs there exists editing support such as indentation, syntax highlighting, electric commands, module name verification, comment support including paragraph filling, skeletons, tags support and more. See the Tools application for details.
There are also Erlang plugins for other code editors Vim (vim-erlang) , Atom , Eclipse (ErlIDE) and IntelliJ IDEA.`,
        duration: Math.floor(0),
        created_at: "2014-03-30 12:32",
    }, {
        id: '4',
        source: 'http://192.168.43.32:8555/video/get/bm6lgk013ult9gc75vmg_bm6lgk013ult9gc75vn0_bm6lgk013ult9gc75vng.mp4',
        file_name: 'Black M - Le prince Aladin (Clip officiel) ft. Kev Adams.mp4',
        thumbnailSource: 'http://192.168.43.32:8555/video/thumbnail/get/bm7sd5813ulrbjp7u1sg_bm7sd5813ulrbjp7u1t0_bm7sd5813ulrbjp7u1tg_thumbnail.jpeg',
        sender: {
            phone: 3,
            nickname: "Sokeng Kamga"
        },
        user: 2,
        creator: 2,
        type: "attachement",
        received: 0,
        total: 0,
        text: `Hello!
        Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>
You can of course use any editor you like to write Erlang programs, but if you use Emacs there exists editing support such as indentation, syntax highlighting, electric commands, module name verification, comment support including paragraph filling, skeletons, tags support and more. See the Tools application for details.
There are also Erlang plugins for other code editors Vim (vim-erlang) , Atom , Eclipse (ErlIDE) and IntelliJ IDEA.

`,
        duration: Math.floor(0),
        created_at: "2014-03-30 12:32",
    },
        , {
        id: '5',
        source: 'http://192.168.43.32:8555/video/get/Black M - Le prince Aladin (Clip officiel) ft. Kev Adams.mp4',
        file_name: 'bm6lgk013ult9gc75vmg_bm6lgk013ult9gc75vn0_bm6lgk013ult9gc75vng.mp4',
        thumbnailSource: 'http://192.168.43.32:8555/video/thumbnail/get/bm7sd5813ulrbjp7u1sg_bm7sd5813ulrbjp7u1t0_bm7sd5813ulrbjp7u1tg_thumbnail.jpeg',
        sender: {
            phone: 3,
            nickname: "Sokeng Kamga"
        },
        type: "video",
        user: 3,
        creator: 2,
        received: 0,
        total: 0,
        text: `Hello!
        Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>
You can of course use any editor you like to write Erlang programs, but if you use Emacs there exists editing support such as indentation, syntax highlighting, electric commands, module name verification, comment support including paragraph filling, skeletons, tags support and more. See the Tools application for details.
There are also Erlang plugins for other code editors Vim (vim-erlang) , Atom , Eclipse (ErlIDE) and IntelliJ IDEA.

`,
        duration: Math.floor(0),
        created_at: "2014-0s3-30 12:32",
    }*/]
    storeAccessKey = {
        key: "Chats",
        autoSync: true
    };
    saveKey = {
        key: "Chats",
        data: []
    };
    readFromStore() {
        return new Promise((resolve, reject) => {
            storage
                .load(this.storeAccessKey)
                .then(chats => {
                    resolve(chats);
                })
                .catch(error => {
                    resolve([]);
                });
        });
    }
    setProperties(chats) {
        //chats = chain(chats).groupBy(element => moment(element.created_at).format("YYYY/MM/DD")).map((value,key)  => {return {created_at:key, data: orderBy(value, ["created_at"], ["desc"])}})
        //chats = orderBy(chats, ["created_at"], ["desc"])
        this.messages = chats //= filter(chats, chat => !chat.hidden && !chat.deleted);
    }
    insertBulkMessages(messages) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(data => {
                let newData = messages.concat(data);
                newData = uniqBy(newData,"id")
                this.addToStore(newData).then(() => {
                    //this.messages = newData;
                    resolve()
                })
            })
        })
    }
    addDuration(duration, id) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(data => {
                let index = findIndex(data, { id: id })
                if (data[index]) {
                    data[index].duration = duration;
                    this.addToStore(data).then(() => {
                        resolve("ok")
                    })
                } else {
                    resolve("not found")
                }
            })
        })
    }
    addVideoProperties(id, path, total, received) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(data => {
                let index = findIndex(data, { id: id })
                if (data[index]) {
                    data[index].total = total;
                    data[index].received = received
                    data[index].source = path
                    this.addToStore(data).then(() => {
                        resolve("ok")
                    })
                } else {
                    resolve("not found")
                }
            })
        })
    }
    @autobind addMessage(message) {
        return new Promise((resolve, reject) => {
            this.messages.unshift(message)
            resolve()
        })
    }
    addVideoSizeProperties(id, total, recieved) {
        return this.addAudioSizeProperties(id, total, recieved)
    }
    AddAudioSizePropperties(total, recieved) {
        return new Promise((resolve, reject) => {
            resolve()
        })
    }
    addAudioSizeProperties(id, total, recieved,duration) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(data => {
                let index = findIndex(data, { id: id })
                if (data[index]) {
                    data[index].total = total;
                    data[index].received = recieved
                    data[index].duration = duration
                    this.addToStore(data).then(() => {
                        resolve("ok")
                    })
                } else {
                    resolve("not found")
                }
            })
        })
    }
    SetCancledState(id) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(data => {
                let index = findIndex(data, { id: id })
                if (data[index]) {
                    data[index].cancled = true;
                    this.addToStore(data).then(() => {
                        resolve("ok")
                    })
                } else {
                    resolve("not found")
                }
            })
        })
    }
    addStaticFilePath(url, id) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(data => {
                let index = findIndex(data, { id: id })
                if (data[index]) {
                    data[index].source = url;
                    this.addToStore(data).then(() => {
                        resolve("ok")
                    })
                } else {
                    resolve("not found")
                }
            })
        })
    }
}

export default ChatStore;
