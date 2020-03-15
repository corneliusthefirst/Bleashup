import storage from './Storage';
import { observable } from 'mobx';
import { reject, findIndex, uniqBy, unionBy,find } from "lodash"
import moment from 'moment';
import request from '../services/requestObjects';
import tcpRequest from '../services/tcpRequestData';
import serverEventListener from "../services/severEventListener"
export default class commitee {
    constructor() {
        /* storage.remove({key:"commitees"}).then(()=>{
 
         })*/
        this.readFromStore().then(data => {
            this.commitees = data;
        })
    }
    @observable commitees = []
    storeAccessKey = {
        key: "commitees",
        autoSync: true
    };
    saveKey = {
        key: "commitees",
        data: []
    };
    addCommitee(newCommitee) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                commitees.unshift(newCommitee)
                this.addToStore(commitees).then(() => {
                    resolve("ok");
                })
            })
        })
    }
    getCommitee(id) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees, { id: id });
                if (index >= 0) {
                    resolve(commitees[index])
                } else {
                    let getCommitee = request.get_commitee()
                    getCommitee.id = id;
                    tcpRequest.get_commitee(getCommitee, id).then(JSONData => {
                        serverEventListener.sendRequest(JSONData, id).then(data => {
                            console.warn(data)
                            this.addCommitee(data).then(() => {
                                resolve(data)
                            })
                        })
                    })
                }
            })
        })
    }
    replaceCommiteeParticipant(ID, participant) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                let commiteeIndex = findIndex(commitees, { id: ID })
                let index = findIndex(commitees[commiteeIndex].member, { phone: participant.phone })
                if (index >= 0) {
                    commitees[commiteeIndex].member[index] = participant
                    this.addToStore(commitees).then(() => {
                        resolve(commitees[commiteeIndex])
                    })
                } else {
                    resolve()
                }
            })
        })
    }
    imIInThisCommttee(phone, committeeID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Committees => {
                let committee = find(Committees, { id: committeeID })
                if (findIndex(committee.member, { phone: phone }) >= 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })
    }
    removeCommitee(ID) {
        return new Promise((resolve, rejec) => {
            this.readFromStore().then(commitees => {
                commitees = reject(commitees, { id: ID })
                this.addToStore(commitees).then(() => {
                    this.setProperties(commitees)
                    resolve(findIndex(commitees, { id: ID }))
                })
            })
        })
    }
    addMembers(ID, member) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees, { id: ID })
                commitees[index].updated_at = moment().format()
                commitees[index].member = unionBy(commitees[index].member, member, "phone")
                this.addToStore(commitees).then(() => {
                    this.setProperties(commitees)
                    resolve(commitees[index])
                })
            })
        })
    }
    removeMember(ID, phones) {
        return new Promise((resolve, rejec) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees, { id: ID })
                commitees[index].updated_at = moment().format()
                commitees[index].member = reject(commitees[index].member,
                    (ele) => findIndex(phones, (phone) => phone === ele.phone) >= 0);
                this.addToStore(commitees).then(() => {
                    this.setProperties()
                    resolve(commitees[index])
                })
            })
        })
    }

    addMaster(ID, phone) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees, { id: ID })
                commitees[index].updated_at = moment().format()
                let indexSub = findIndex(commitees[index].members, { phone: phone })
                commitees[index].members[indexSub].master = true
                this.addToStore(commitees).then(() => {
                    this.setProperties()
                    resolve()
                })
            })
        })
    }
    changeCommiteeOpenedState(ID, newState) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees, { id: ID })
                commitees[index].opened = newState
                this.addToStore(commitees).then(() => {
                    this.setProperties(commitees)
                    resolve(commitees[index]);
                })
            })
        })
    }
    removeMaster(ID, phone) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees, { id: ID })
                commitees[index].updated_at = moment().format()
                let indexSub = findIndex(commitees[index].members, { phone: phone })
                commitees[index].members[indexSub].master = false
                this.addToStore(commitees).then(() => {
                    this.setProperties()
                    resolve()
                })
            })
        })
    }
    updateCommiteeName(ID, name) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees, { id: ID })
                commitees[index].name = name
                commitees[index].updated_at = moment().format()
                this.addToStore(commitees).then(() => {
                    this.setProperties()
                    resolve(commitees[index])
                })
            })
        })
    }
    updateCommiteeState(ID, state) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees, { id: ID })
                commitees[index].public_state = state
                commitees[index].updated_at = moment().format()
                this.addToStore(commitees).then(() => {
                    this.setProperties()
                    resolve(commitees[index])
                })
            })
        })
    }
    setProperties(data) {
        this.commitees = data
    }
    addToStore(data) {
        this.saveKey.data = data;
        return storage.save(this.saveKey)
    }
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
        })
    }
}