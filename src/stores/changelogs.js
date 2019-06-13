import storage from "./BigStorage"
import {
    filter
} from "lodash"
export default class changelogs {
    changes = []
    saveKey = {
        key: "changes",
        data: []
    }
    addChanges(Newchange) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Changes => {
                Changes = Changes.concat([Newchange])
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
