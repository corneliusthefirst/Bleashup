
import storage from './Storage';
import { observable } from 'mobx';
import moment from 'moment';
import GState from './globalState';
export default class States {
    constructor() {
        this.initializeStore()
        this.startSaver()
    }

    key = "states-store"
    storeAccessKey = {
        key: this.key,
        autoSync: true,
    };
    saveKey = {
        key: this.key,
        data: {},
    };
    readFromStore() {
        return new Promise((resolve, reject) => {
            resolve(this.states);
        });
    }
    startSaver() {
        this.saveInterval = setInterval(() => {
            this.previousModif !== this.currentModif ? this.saver() : null;
        }, this.timer);
    }
    saver() {

        if (this.states && Object.keys(this.states).length > 0) {
            this.saveKey.data = this.states;
            storage.save(this.saveKey).then(() => {
                this.previousModif = this.currentModif;
                console.warn("saving current state");
            });
        }
    }
    previousModif = moment().format();
    currentModif = moment().format();
    timer = 2000;
    saveInterval = null;
    setProperties(states) {
        this.states = states;
        this.currentModif = moment().format();
    }
    initBackgroundImage() {
        GState.backgroundImage = (this.states && this.states.app_background) ||
            GState.defaultBackground
    }
    persistNewBackground(path) {
        this.states.app_background = { uri: 'file://' + path }
        this.initBackgroundImage()
        this.setProperties(this.states)
    }
    removeBackground(){
        this.states.app_background = null 
        this.initBackgroundImage()
        this.setProperties(this.states)
    }
    requestExists(id) {
        if (this.states.requests && this.states.requests[id]) {
            return true
        } else {
            return false
        }
    }
    getRequest(id) {
        return this.states.requests && this.states.requests[id]
    }
    getUnsentMessage(id) {
        return this.states.unsentMessage && this.states.unsentMessage[id]
    }
    setMostRecentMessage(committee_id, message) {
        if (this.states.recentMessages && this.states.recentMessages[committee_id]) {
            this.states.recentMessages[committee_id] = message
        } else {
            this.states.recentMessages = {
                ...this.states.recentMessages,
                [committee_id]: message
            }
        }
        this.setProperties(this.states)
    }
    getMostRecentMessage(committee_id) {
        return this.states.recentMessages && this.states.recentMessages[committee_id]
    }
    setRoomLatestIndex(committee_id, id) {
        if (this.states.recentIndex && this.states.recentIndex[committee_id]) {
            this.states.recentIndex[committee_id] = id
        } else {
            this.states.recentIndex = {
                ...this.states.recentIndex,
                [committee_id]: id
            }
        }
        this.setProperties()
    }
    getNewMessagesCount(id) {
        if (id) {
            return this.states && this.states.newMessages &&
                this.states.newMessages[id] && this.states.newMessages[id].length
        } else {
            return this.states && this.states.newMessages &&
                Object.keys(this.states.newMessages).length
        }
    }
    getNewRemindsCount() {
        return this.states && this.states.newReminds &&
            Object.values(this.states.newReminds).reduce((a, b) => a + b.length, 0)
    }
    setAppLanguage(lan) {
        this.states.lan = lan
        this.setProperties()
    }
    setAppThemMode(mode) {
        this.states.mode = mode
        this.setProperties()
    }
    setBackground(url) {
        this.states.background = url
        this.setProperties()
    }
    addNewMessage(committee_id, mid) {
        if (this.states.newMessages && this.states.newMessages[committee_id] &&
            this.states.newMessages[committee_id].length) {
            this.states.newMessages[committee_id].push(mid)
        } else {
            this.states.newMessages = {
                ...this.states.newMessages,
                [committee_id]: [mid]
            }
        }
        this.setProperties(this.states)
    }
    addNewReminds(committee_id, mid) {
        if (this.states.newReminds && this.states.newReminds[committee_id] &&
            this.states.newReminds[committee_id].length) {
            this.states.newReminds[committee_id].push(mid)
        } else {
            this.states.newReminds = {
                ...this.states.newReminds,
                [committee_id]: [mid]
            }
        }
        this.setProperties(this.states)
    }
    removeNewReminds() {
        delete this.states.newReminds
        this.setProperties(this.states)
    }
    removeNewMessage(committee_id, id) {
        if (id) {
            this.states.newMessages[committee_id] =
                this.states.newMessages && this.states.newMessages[committee_id] ?
                    this.states.newMessages[committee_id].filter(ele => ele !== id) : []
        } else {
            delete this.states.newMessages[committee_id]
        }
        this.setProperties(this.states)
    }
    getUnsentMessages() {
        return this.states.unsentMessage
    }
    requestsExists() {
        if (this.states && this.states.requests) {
            const keys = Object.keys(this.states.requests)
            if (keys && keys.length) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    unsentMessagesExist() {
        if (this.states && this.states.unsentMessage) {
            const keys = Object.keys(this.states.unsentMessage)
            if (keys && keys.length) {
                return keys
            } else {
                return false
            }
        } else {
            return false
        }
    }
    @observable states = {}
    initializeStore() {
        storage
            .load({ key: this.key })
            .then((states) => {
                states ? (this.states = states) : (this.states = {});
                this.initBackgroundImage()
            })
            .catch((error) => {
                this.states = {};
            });
    }
    persistMessageSending(id, data) {
        if (this.states.unsentMessage) {
            this.states.unsentMessage[id] = data
        } else {
            this.states.unsentMessage = {
                [id]: data
            }
        }
        this.setProperties(this.states)
    }
    unPersistRequestUnsentMessage(id) {
        if (this.states.unsentMessage && this.states.unsentMessage[id]) {
            delete this.states.unsentMessage[id]
        }
        this.setProperties(this.states)
    }
    PersistRequest(request, id) {
        console.warn("persisting request with id: ", id)
        if (this.states.requests) {
            this.states.requests[id] = request
        } else {
            this.states = {
                ...this.states,
                requests: { [id]: request }
            }
        }
        this.setProperties(this.states)

    }
    unPersistRequest(id) {
        console.warn("unpersisting request: ", id)
        if (this.states.requests && this.states.requests[id]) {
            delete this.states.requests[id]
        }
        this.setProperties(this.states)
    }
}