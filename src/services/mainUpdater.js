import stores from "../stores";
import uuid from "react-native-uuid";
import CalendarServe from "./CalendarService";
import toTitleCase from './toTitle';
import { shared_post, shared_remind } from '../components/myscreens/settings/privacy/Requester';
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
    blocked(updater) {
        return new Promise((resolve, reject) => {
            stores.Privacy.blockMe(updater).then(() => {
                resolve()
            })
        })
    }
    unBlocked(updater) {
        return stores.Privacy.unblockMe(updater)
    }
    muted(updater) {
        return stores.Privacy.muteMe(updater)
    }
    unMuted(updater) {
        return stores.Privacy.unmuteMe(updater)
    }
    choseShareTitle(type) {
        if (type === shared_post) {
            return 'Post'
        } else if (type === shared_remind) {
            return 'Remind'
        } else {
            'Vote'
        }
    }
    returnItemTitle(type, itemID, eventID) {
        return new Promise((resolve, reject) => {
            stores.Events.loadCurrentEvent(eventID).then(event => {
                if (type == shared_remind) {
                    stores.Reminds.loadRemind(itemID).then((remind) => {
                        resolve({ item_title: remind && remind.title, activity_name: event && event.about && event.about.title });
                    })
                } else if (type === shared_post) {
                    stores.Highlights.loadHighlight(itemID).then(post => {
                        resolve({ item_title: post && post.title, activity_name: event && event.about && event.about.title })
                    })
                } else {
                    stores.Votes.loadVote(itemID).then(vote => {
                        console.warn(vote,itemID)
                        resolve({ item_title: vote && vote.title, activity_name: event && event.about && event.about.title })
                    })
                }
            })
        })
    }

    saveShares(eventID, share, updater, date) {
        return new Promise((resolve, reject) => {
            this.returnItemTitle(share.type, share.item_id, share.activity_id).then((title) => {
                console.warn(title,share)
                let shareTitle = this.choseShareTitle(share.type)
                let change = {
                    id: uuid.v1(),
                    date: date,
                    updated: share.type,
                    updater :updater,
                    title: 'Updates on Main Activity',
                    event_id: eventID,
                    changed: 'Shared ' + toTitleCase(title.item_title) + ' (' +
                        shareTitle + ') to his ' +
                        toTitleCase(share.scope).toLowerCase() === 'some' ? 'Contacts' : toTitleCase(share.scope),
                    new_value:{data:share.id,new_value:title.item_title}
                }
                stores.Events.addEvent(share).then(() => {
                    resolve(change)
                    stores.ChangeLogs.addChanges(change)
                })
            })
        })
    }
}

const MainUpdater = new mainUpdater();
export default MainUpdater;
