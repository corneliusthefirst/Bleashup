import stores from '../stores';
import uuid from 'react-native-uuid';
class mainUpdater {
    addParticipants(eventID, participants, updater, updated, date) {
        return new Promise((resolve, reject) => {
            stores.Events.addParticipants(eventID, participants, true).then((Event) => {
                let Change = {
                    id: uuid.v1(),
                    updater: updater,
                    updated: updated,
                    event_id: eventID,
                    title: 'Updates on Main Activity',
                    changed: "Added new members to the activity",
                    new_value: { data: null, new_value: participants },
                    date: date
                }
                stores.ChangeLogs.addChanges(Change).then(() => {
                    resolve(Change)
                })
            })
        })
    }
}
const MainUpdater = new mainUpdater()
export default MainUpdater