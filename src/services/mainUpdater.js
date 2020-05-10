import stores from "../stores";
import uuid from "react-native-uuid";
import CalendarServe from "./CalendarService";
class mainUpdater {
    addParticipants(eventID, participants, updater, updated, date) {
        return new Promise((resolve, reject) => {
            stores.Events.addParticipants(eventID, participants, true).then(
                (Event) => {
                    let Change = {
                        id: uuid.v1(),
                        updater: updater,
                        updated: updated,
                        event_id: eventID,
                        title: "Updates on Main Activity",
                        changed: "Added new members to the activity",
                        new_value: { data: null, new_value: participants },
                        date: date,
                    };
                    stores.ChangeLogs.addChanges(Change).then(() => {
                        resolve(Change);
                    });
                }
            );
        });
    }
    updateRemindLocation(eventID, remindID, newLocation, date, updater) {
        return new Promise((resolve, reject) => {
            stores.Reminds.updateLocation(
                { remind_id: remindID, location: newLocation },
                true
            ).then((oldRemind) => {
                let Change = {
                    id: uuid.v1(),
                    title: `Updates On ${oldRemind.title} Remind`,
                    updated: `remind_location`,
                    updater: updater,
                    event_id: eventID,
                    changed: "Changed the venue Of The Program To ",
                    new_value: { data: remindID, new_value: newLocation },
                    date: date,
                    time: null,
                };
                oldRemind.calendar_id
                    ? CalendarServe.saveEvent(
                        { ...oldRemind, location: newLocation },
                        oldRemind.alams,
                        "reminds"
                    ).then(() => { })
                    : null;
                resolve(Change);
                stores.ChangeLogs.addChanges(Change).then(() => { });
            });
        });
    }
    updateRemindURL(eventID, remindID, newURL, date, updater) {
        return new Promise((resolve, reject) => {
            stores.Reminds.updateURL(
                { remind_id: remindID, url: newURL },
                true
            ).then((oldRemind) => {
                let Change = {
                    id: uuid.v1(),
                    title: `Updates On ${oldRemind.title} Remind`,
                    updated: `remind_url`,
                    updater: updater,
                    event_id: eventID,
                    changed: "Changed the media specification  " + (newURL.video ? "video" : "photo"),
                    new_value: { data: remindID, new_value: newURL },
                    date: date,
                    time: null,
                };
                resolve(Change);
                stores.ChangeLogs.addChanges(Change).then(() => { });
            });
        });
    }
    blocked(updater){
        return new Promise((resolve,reject) => {
            stores.Privacy.blockMe(updater).then(() => {
                resolve()
            })
        })
    }
    unBlocked(updater){
        return stores.Privacy.unblockMe(updater)
    }
    muted(updater){
        return stores.Privacy.muteMe(updater)
    }
    unMuted(updater){
        return stores.Privacy.unmuteMe(updater)
    }
}

const MainUpdater = new mainUpdater();
export default MainUpdater;
