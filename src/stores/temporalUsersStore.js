import storage from "./Storage";
import { uniqBy, find, forEach } from "lodash"
import userHttpServices from "../services/userHttpServices"
import moment from 'moment';
import GState from './globalState/index';
import stores from ".";

export const check_user_error_1 = "unknown_user"
export const check_user_error_2 = "wrong server_key"
export default class TemporalUsersStore {
    constructor() {
        this.initializeStore()
        this.saveTimer = setInterval(() => {
            this.saver()
        }, this.saveInterval)
        //storage.remove(this.saveKey)
    }

    saver() {
        this.currentTime !== this.previousTime ? this.saveToStore() : null
    }
    saveToStore() {
        this.saveKey.data = this.Users
        return storage.save(this.saveKey).then(() => {
            this.previousTime = this.currentTime
            console.warn("temporal user store persisted")
        })
    }
    initializeStore() {
        return new Promise((resolve, reject) => {
            storage.load(this.readKey).then(Users => {
                Users ?
                    this.Users = Users : null
                resolve(this.Users)
            }).catch(() => {
                this.Users = {}
                resolve({})
            })
        })
    }
    saveInterval = 2000
    currentTime = moment().format()
    previousTime = moment().format()
    Users = {}
    saveKey = {
        key: "temporalUsers",
        data: {}
    }
    readKey = { key: 'temporalUsers', autoSync: true }
    addUser(user) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(users => {
                users[user.phone] = [user]
                this.saveKey.data = users;
                this.setPropterties(users)
            })
        })
    }

    addUsers(newUsers) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(users => {
                newUsers.forEach(ele => {
                    users[ele.phone] = elel
                })
                this.setPropterties(users)
            })
        })
    }
    towDayMillisec() {
        return 1000 * 60 * 60 * 24 * 2
    }
    getUser(phone) {
        return new Promise((resolve, reject) => {
            if (this.Users[phone] && (!this.Users[phone].updated_at ||
                (moment().format("X") - moment(this.Users[phone].updated_at).format("X")) <
                this.towDayMillisec())) {
                resolve(this.Users[phone])
            } else {
                userHttpServices.checkUser(phone).then(profile => {
                    if (profile.message || profile.response) {
                        resolve(profile)
                    } else {
                        this.Users[phone] = { ...profile, updated_at: moment().format() }
                        this.setPropterties(this.Users);
                        resolve(profile)
                    }
                })
            }
        })
    }
    getUsers(phones, result) {
        if (phones.length !== result.length) {
            this.getUser(phones[result.length]).then(user => {
                result.push(user)
                this.getUsers(phones, result)
            })
        } else {
            GState.searchableMembers = result.filter(ele => !ele.response &&
                ele.phone !== stores.LoginStore.user.phone)
        }
    }
    /*getUsers(phones) {
        return new Promise((resolve, reject) => {
            let result = []
            let lacking = []
            let i = 0
            phones.map(phone => {
                if (this.Users[phone]) {
                    result[result.length] = this.Users[phone]
                } else {
                    userHttpServices.checkUser(phone).then((profile) => {
                        if (!profile.message && !profile.response) {
                            console.warn(profile)
                            result[result.length] = profile
                        }
                    })
                }
                console.warn(i,phones.length,result.length)
                if (result.length >= phones.length) {
                    resolve(result)
                }
            })
        })
    }*/
    setPropterties(NewUsers) {
        this.Users = NewUsers;
        this.currentTime = moment().format()
    }
    readFromStore() {
        return new Promise((resolve, reject) => {
            resolve(this.Users)
        })
    }
}
