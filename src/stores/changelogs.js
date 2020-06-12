import storage from "./Storage"
import {
    filter,
    uniqBy,
    groupBy,
    concat,
    find,
    findIndex
} from "lodash"
import moment from "moment"
import stores from "."
export default class changelogs {
    constructor() {
        this.initializeStore()
        this.time()
    }
    time(){
        this.saveIntervaler = setInterval(() => {
            this.previousUpdateTime !== this.currentUpdateTime && this.saver()
        }, this.saveTimeout)
    }
    saveIntervaler = null 
    saveTimeout = 3000
    changes = {}
    saveKey = {
        key: "changes",
        data: []
    }
    readKey = {
        key: "changes",
        autoSync: true
    }
    initializeStore(){
        storage.load(this.readKey).then((changes) => {
            if(Array.isArray(changes)){
                console.warn("changes is an array")
                changes = groupBy(changes, "event_id")
                this.setProperty(changes)
            }
            this.changes = changes
        }).catch(() => {
            this.changes = {}
        })
    }
    saver(){
      if(Object.keys(this.changes).length > 0){
          console.warn("saving changes")
          this.saveKey.data = this.changes
          storage.save(this.saveKey).then(() => {
              this.previousUpdateTime = this.currentUpdateTime
          })
      }
    }
    storeLayouts(eventID,layout,index){
        this.changes[eventID][index].dimensions = layout
        this.setProperty(this.changes) 
    }
    currentUpdateTime = moment().format()
    previousUpdateTime = moment().format()
    addChanges(Newchange) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Changes => {
                Changes[Newchange.event_id] = Changes && 
                Changes[Newchange.event_id] && 
                Changes[Newchange.event_id].length == 0 ? [] : Changes[Newchange.event_id]
                let date = moment(Newchange.date).format("YYYY/MM/DD");
                let index = findIndex(Changes[Newchange.event_id], { id: date, event_id: Newchange.event_id })
                if (index < 0) {
                    Changes[Newchange.event_id].unshift({ ...Newchange, id: date, type: "date_separator" })
                }
                Changes[Newchange.event_id].unshift(Newchange)
                this.setProperty(Changes)
                stores.Events.changeUpdatedStatus(Newchange.event_id).then(() => {
                        resolve()
                })
                
            })
        })
    }
    setProperty(changes){
        this.changes = changes 
        this.currentUpdateTime = moment().format()
    }
    fetchchanges(EventID) {
        return new Promise((resolve, reject) => {
            this.readFromStore(this.readKey).then(Changes => {
                if (Changes) {
                    resolve(Changes[EventID])
                }
            })
        })
    }
    readFromStore() {
        return new Promise((resolve, reject) => {
            resolve(this.changes)
        })
    }
}
