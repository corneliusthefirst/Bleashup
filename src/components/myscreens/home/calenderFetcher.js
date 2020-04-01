import CalendarServe from '../../../services/CalendarService';
import Requester from '../event/Requester';
import storage from '../../../stores/Storage';
import {
    groupBy,
    map,
    findIndex,
    reject,
    find,
    forEach
} from "lodash"
export default function calendarFetcher(){
return new Promise((resolve,rejec) => {
     CalendarService.fetchAllCalendarEvents().then(calendar => {
         let calen = groupBy(calendar, 'title')
         let idsMapper = map(calen, (value, key) => {
             return {
                 title: key,
                 ids: map(value, ele => ele.id)
             }
         })
         calen = map(calen, (value, key) => {
             return {
                 ...value[0],
                 key: key
             }
         })
         calen = reject(calen, ele => findIndex(stores.Events.events, e => e.about && ele.title === e.about.title) >= 0 || ele.title.includes('reminder'))
         if (calen.length > 0) {
             let i = 0
             forEach(calen, element => {
                 idsmap = find(idsMapper, {
                     title: element.key
                 })
                 let event = find(storage.Events.events, ele => idsmap.ids.indexOf(ele.calendar_id) >= 0)
                 if (event) {
                     Requester.updateTitle(event, element.key).then((state) => {
                         if (i === calen.length - 1) {
                            resolve(calen)
                         }
                         i = i + 1
                     })
                 } else {
                     this.realNew.unshift(element)
                     if (i === calen.length - 1) {
                         resolve(calen)
                     }
                     i = i + 1
                 }
             })
             /**/
         }
     })
})
}
