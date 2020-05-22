import storage from './Storage';
import { observable } from 'mobx';
import { reject, findIndex, uniqBy, unionBy, find } from "lodash"
import moment from 'moment';
import request from '../services/requestObjects';
import tcpRequest from '../services/tcpRequestData';
import serverEventListener from "../services/severEventListener"
export default class commitee {
    constructor() {
        /* storage.remove({key:"commitees"}).then(()=>{
 
         })*/
        this.initializeCommittees().then((data) => {
            this.commitees = data
        })
        this.saverInterval = setInterval(() => {
            this.currentSavedTime !== this.previousSavedTime ? this.saver() : null
        }, this.saverTime)
    }
    currentSavedTime = moment().format()
    previousSavedTime = moment().format()
    saverInterval = null
    saverTime = 2000
    @observable commitees = {}
    storeAccessKey = {
        key: "commitees",
        autoSync: true
    };
    saveKey = {
        key: "commitees",
        data: {}
    };
    addCommitee(eventID, newCommitee) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                commitees[eventID] && commitees[eventID].length > 0 ?
                    commitees[eventID].unshift(newCommitee) :
                    commitees[eventID] = [newCommitee]
                this.addToStore(commitees).then(() => {
                    resolve("ok");
                })
            })
        })
    }
    getCommitee(eventID, id) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees[eventID], { id: id });
                if (index >= 0) {
                    resolve(commitees[eventID][index])
                } else {
                    let getCommitee = request.get_commitee()
                    getCommitee.id = id;
                    tcpRequest.get_commitee(getCommitee, id).then(JSONData => {
                        serverEventListener.sendRequest(JSONData, id).then(data => {
                            this.addCommitee(data.data[0]).then(() => {
                                resolve(data.data[0])
                            })
                        })
                    })
                }
            })
        })
    }
    replaceCommiteeParticipant(eventID, ID, participant) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                let commiteeIndex = findIndex(commitees[eventID], { id: ID })
                let index = findIndex(commitees[eventID][commiteeIndex].member, { phone: participant.phone })
                if (index >= 0) {
                    commitees[eventID][commiteeIndex].member[index] = participant
                    this.addToStore(commitees).then(() => {
                        resolve(commitees[eventID][commiteeIndex])
                    })
                } else {
                    resolve()
                }
            })
        })
    }
    imIInThisCommttee(eventID, phone, committeeID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Committees => {
                let committee = find(Committees[eventID], { id: committeeID })
                if (findIndex(committee.member, { phone: phone }) >= 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })
    }
    removeCommitee(eventID, ID) {
        return new Promise((resolve, rejec) => {
            this.readFromStore().then(commitees => {
                commitees = reject(commitees[eventID], { id: ID })
                this.addToStore(commitees).then(() => {
                    resolve(findIndex(commitees[eventID], { id: ID }))
                })
            })
        })
    }
    addMembers(eventID, ID, member) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees[eventID], { id: ID })
                commitees[eventID][index].updated_at = moment().format()
                commitees[eventID][index].member = unionBy(commitees[eventID][index].member, member, "phone")
                this.addToStore(commitees).then(() => {
                    resolve(commitees[eventID][index])
                })
            })
        })
    }
    removeMember(eventID, ID, phones) {
        return new Promise((resolve, rejec) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees[eventID], { id: ID })
                commitees[eventID][index].updated_at = moment().format()
                commitees[eventID][index].member = reject(commitees[eventID][index].member,
                    (ele) => findIndex(phones, (phone) => phone === ele.phone) >= 0);
                this.addToStore(commitees).then(() => {
                    resolve(commitees[eventID][index])
                })
            })
        })
    }

    addMaster(eventID, ID, phone) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees[eventID], { id: ID })
                commitees[eventID][index].updated_at = moment().format()
                let indexSub = findIndex(commitees[eventID][index].members, { phone: phone })
                commitees[eventID][index].members[indexSub].master = true
                this.addToStore(commitees).then(() => {
                    resolve()
                })
            })
        })
    }
    changeCommiteeOpenedState(eventID, ID, newState) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees[eventID], { id: ID })
                commitees[eventID][index].opened = newState
                this.addToStore(commitees).then(() => {
                    this.setProperties(commitees)
                    resolve(commitees[eventID][index]);
                })
            })
        })
    }
    removeMaster(eventID, ID, phone) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees[eventID], { id: ID })
                commitees[eventID][index].updated_at = moment().format()
                let indexSub = findIndex(commitees[eventID][index].members, { phone: phone })
                commitees[eventID][index].members[indexSub].master = false
                this.addToStore(commitees).then(() => {
                    resolve()
                })
            })
        })
    }
    updateCommiteeName(eventID, ID, name) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees[eventID], { id: ID })
                let previousCommittee = JSON.stringify(commitees[eventID][index])
                commitees[eventID][index].name = name
                commitees[eventID][index].updated_at = moment().format()
                this.addToStore(commitees).then(() => {
                    resolve(JSON.parse(previousCommittee))
                })
            })
        })
    }
    updateCommiteeState(eventID, ID, state) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees[eventID], { id: ID })
                commitees[eventID][index].public_state = state
                commitees[eventID][index].updated_at = moment().format()
                this.addToStore(commitees).then(() => {
                    resolve(commitees[eventID][index])
                })
            })
        })
    }
    setProperties(data) {
        this.commitees = data
    }
    saver() {
        this.saveKey.data = this.commitees
        storage.save(this.saveKey).then(() => {
            this.previousSavedTime = this.currentSavedTime
            console.warn("saving committees", this.saveKey.data)
        })
    }
    addToStore(data) {
        this.currentSavedTime = moment().format()
        return new Promise((resolve, reject) => {
            this.commitees = data
            resolve()
        })
    }
    initializeCommittees() {
        return new Promise((resolve, reject) => {
            storage
                .load(this.storeAccessKey)
                .then(chats => {
                    console.warn("commitee",chats)
                    resolve(chats);
                })
                .catch(error => {
                    resolve({});
                });
        })
    }
    readFromStore() {
        return new Promise((resolve, reject) => {
            resolve(this.commitees)
        })
    }
}