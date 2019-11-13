import storage from './Storage';
import { observable } from 'mobx';
import { reject, findIndex } from "lodash"
import moment from 'moment';
export default class commitee {
    constructor() {
        this.readFromStore().then(data => {

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
    removeCommitee(ID) {
        return new Promise((resolve, rejec) => {
            this.readFromStore().then(commitees => {
                commitees = reject(commitees, { id: ID })
                this.addToStore(commitees).then(() => {
                    this.setProperties(commitees)
                    resolve()
                })
            })
        })
    }
    addMembers(ID, member) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees, { id: ID })
                commitees[index].updated_at = moment().format()
                commitees[index].members.unshift(member)
                this.addToStore(commitees).then(() => {
                    this.setProperties(commitees)
                    resolve()
                })
            })
        })
    }
    removeMember(ID, phone) {
        return new Promise((resolve, rejec) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees, { id: ID })
                commitees[index].updated_at = moment().format()
                commitees[index].members = reject(commitees[index].members, (ele) => ele.phone === phone);
                this.addToStore(commitees).then(() => {
                    this.setProperties()
                    resolve()
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
    updateCommiteeName(ID, phone) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(commitees => {
                let index = findIndex(commitees, { id: ID })
                commitees[index].name = name
                commitees[index].updated_at = moment().format()
                this.addToStore(commitees).then(() => {
                    this.setProperties()
                    resolve()
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