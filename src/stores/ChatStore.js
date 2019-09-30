import { observable } from 'mobx'
import storage from './Storage'
import { orderBy, filter } from "lodash"
class ChatStore {
    constructor() {
        this.readFromStore().then(data => {
            this.setProperties(data)
        })
    }
    storeAccessKey = {
        key: "Chats",
        autoSync: true
    };
    saveKey = {
        key: "Chats",
        data: []
    };
    @observable Chats = [
        {
            _id: 1,
            text: 'Hello developer',
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
            },
        },
    ]
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
        chats = orderBy(chats, ["updated_at"], ["desc"]);
        this.Chats = filter(chats, chat => !chat.hidden && !chat.deleted);
    }
    addDuration(duration, chatID) {
        return new Promise((resolve, reject) => {
            console.warn("setting voice note duration")
            resolve("ok")
        })
    }
    addVideoProperties(path,totalSize,receivedSize){
        return new Promise((resolve,reject) => {
            resolve()
        })
    }
    addVideoSizeProperties(total,recieved){
        return new Promise((resolve,reject)=>{
            resolve()
        })
    }
    AddAudioSizePropperties(total,recieved){
        return new Promise((resolve,reject) =>{
            resolve()
        })
    }
    addStaticFilePath(url, chatID) {
        return new Promise((resolve, reject) => {
            console.warn("setting message static resource");
            resolve("ok");
        })
    }
}

export default ChatStore;
