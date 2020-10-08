
import storage from './Storage';
import { observable } from 'mobx';
import  moment  from 'moment';
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

        if (Object.keys(this.states).length > 0) {
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
    requestExists(id) {
        if (this.states.requests && this.states.requests[id]) {
            return true
        } else {
            return false
        }
    }
    getRequest(id){
        return this.states.requests[id]
    }
    requestsExists() {
        if (this.states && this.states.requests){
            const keys = Object.keys(this.states.requests)
            if (keys && keys.length) {
                return true
            } else {
                return false
            }
        }else{
            return false
        }
    }
    @observable states = {}
    initializeStore() {
        storage
            .load({ key: this.key })
            .then((states) => {
                states ? (this.states = states) : (this.states = {});
            })
            .catch((error) => {
                this.states = {};
            });
    }
    PersistRequest(request, id) {
        return new Promise((resolve, reject) => {
            console.warn("persisting request with id: ",id)
            this.readFromStore().then(states => {
                if (states.requests) {
                    states.requests[id] = request
                } else {
                    states = {
                        ...states,
                        requests: { [id]: request }
                    }
                }
                this.setProperties(states)
            })
        })
    }
    unPersistRequest(id) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(states => {
                if (states.requests && states.requests[id]) {
                    delete states.requests[id]
                }
                this.setProperties(states)
            })
        })
    }
}