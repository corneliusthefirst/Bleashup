import storage from "./Storage"
import {
    filter,
    uniqBy,
    concat,
    find,
    findIndex
} from "lodash"
import moment from "moment"
export default class changelogs {
    constructor() {
        //storage.remove({key:"changes"})
    }
    changes = []
    saveKey = {
        key: "changes",
        data: []
    }
    addChanges(Newchange) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Changes => {
                Changes = Changes.length == 0 ? [] : Changes
                let date = moment(Newchange.date).format("YYYY/MM/DD");
                let index = findIndex(Changes, { id: date })
                if (index < 0){
                    Changes.unshift({...Newchange,id:date,type:"date_separator"})
                }
                Changes.unshift(Newchange)
                this.saveKey.data = Changes
                storage.save(this.saveKey).then(() => {
                    resolve()
                })
            })
        })
    }
    fetchchanges(EventID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Changes => {
                if (Changes) {
                    resolve(filter(Changes, {
                        event_id: EventID
                    }))
                }
            })
        })
    }
    readFromStore() {
        return new Promise((resolve, reject) => {
            storage.load({
                key: "changes",
                autoSync: true
            }).then(Changes => {
                resolve(Changes)
            }).catch(error => {
                resolve([])
            })
        })
    }
}
