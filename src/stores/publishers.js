import { observable, action } from "mobx";
import {
    filter,
    uniqBy,
    sortBy,
    find,
    findIndex,
    reject,
    uniq,
    indexOf,
    drop
} from "lodash";
import storage from "./Storage";
import moment from "moment";
import requestObject from "../services/requestObjects";
import tcpRequest from "../services/tcpRequestData";
import serverEventListener from "../services/severEventListener"

class Publishers {
    constructor() {
        this.loadPublishers().then((Publishers) => {
            this.Publishers = Publishers
        })
    }
    @observable Publishers = []
    saveKey = {
        key: "Publishers",
        data: []
    };
    storeAccessKey = {
        key: "Publishers",
        autoSync: true
    };
    loadPublishers() {
        return new Promise((resolve, reject) => {
            this.readFromStore().then((Publishers) => {
                resolve(Publishers)
            })
        })
    }
    process(Publishers, EventID) {
        return new Promise((resolve, reject) => {
            let Res = find(Publishers, { event_id: EventID });
            if (Res) resolve(Res.publishers)
            else {
                let eventID = requestObject.EventID()
                eventID.event_id = EventID;
                tcpRequest.getPublishers(eventID, EventID + "publishers").then(JSONData => {
                    serverEventListener.sendRequest(JSONData, EventID + "publishers").then(Data => {
                        this.addPublishers(EventID, Data).then(() => {
                            resolve(Data);
                        })
                    })
                })
            }
        })
    }
    getPublishers(EventID) {
        return new Promise((resolve, reject) => {
            if (this.Publishers.length !== 0) {
                this.process(this.Publishers, EventID).then(Data => {
                    resolve(Data)
                })
            } else {
                this.readFromStore().then(Publishers => {
                    this.process(Publishers, EventID).then(data => {
                        resolve(data)
                    })
                })
            }
        })
    }
    addPublisher(EventID, Publisher) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Publishers => {
                let index = findIndex(Publishers, { event_id: EventID });
                Publishers[index].publishers.unshift(Publisher);
                Publishers[index].publishers = uniqBy(Publishers[index].publishers, "phone")
                this.saveKey.data = Publishers;
                storage.save(this.saveKey).then(() => {
                    this.setProperties(this.saveKey.data)
                    resolve()
                })
            })
        })
    }
    addPublishers(EventID, Publishers) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Publishers => {
                Publishers.unshift({ event_id: EventID, publishers: Publishers });
                this.saveKey.data = Publishers
                storage.save(this.saveKey).then(() => {
                    this.setProperties(this.saveKey.data)
                    resolve()
                })
            })
        })
    }

    setProperties(newData) {
        this.Publishers = newData
    }
    readFromStore() {
        return new Promise((resolve, reject) => {
            storage
                .load(this.storeAccessKey)
                .then(events => {
                    resolve(events);
                })
                .catch(error => {
                    resolve([]);
                });
        });
    }
}
export default Publishers    