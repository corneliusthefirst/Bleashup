import storage from "./Storage"
import {
    filter,
    uniqBy
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
                if(Changes.length == 0) Changes = [Newchange]
                else Changes = uniqBy(Changes.concat([Newchange]),"id")
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
