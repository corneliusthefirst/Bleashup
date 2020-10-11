import stores from "../stores";
import CalendarServe from "./CalendarService";
import toTitleCase from './toTitle';
import IDMaker from './IdMaker';
import {
  shared_post,
  shared_remind,
} from '../components/myscreens/settings/privacy/Requester';
import Requester from "../components/myscreens/eventChat/Requester";
import emitter from './eventEmiter';
import { typing } from "../meta/events";
class mainUpdater {
  addParticipants(eventID, participants, updater, updated, date) {
    return new Promise((resolve, reject) => {
      stores.Events.addParticipants(eventID, participants, true).then(
        (Event) => {
          let Change = {
            id: IDMaker.make(),
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
        eventID,
        { remind_id: remindID, location: newLocation },
        true
      ).then((oldRemind) => {
        let Change = {
          id: IDMaker.make(),
          title: `Updates On ${oldRemind.title} Remind`,
          updated: "remind_location",
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
            'reminds'
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
        eventID,
        { remind_id: remindID, url: newURL },
        true
      ).then((oldRemind) => {
        let Change = {
          id: IDMaker.make(),
          title: `Updates On ${oldRemind.title} Remind`,
          updated: "remind_url",
          updater: updater,
          event_id: eventID,
          changed:
            'Changed the media specification  ' +
            (newURL.video ? "video" : "photo"),
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
        resolve();
      });
    });
  }
  unBlocked(updater) {
    return stores.Privacy.unblockMe(updater);
  }
  muted(updater) {
    return stores.Privacy.muteMe(updater);
  }
  unMuted(updater) {
    return stores.Privacy.unmuteMe(updater);
  }
  choseShareTitle(type) {
    if (type === shared_post) {
      return 'Post';
    } else if (type === shared_remind) {
      return 'Remind';
    } else {
      ('Vote');
    }
  }
  returnItemTitle(type, itemID, eventID) {
    return new Promise((resolve, reject) => {
      stores.Events.loadCurrentEvent(eventID).then((event) => {
        if (type == shared_remind) {
          stores.Reminds.loadRemind(eventID, itemID).then((remind) => {
            resolve({
              item_title: remind && remind.title,
              activity_name: event && event.about && event.about.title,
            });
          });
        } else if (type === shared_post) {
          stores.Highlights.loadHighlight(this.props.event_id, itemID).then((post) => {
            resolve({
              item_title: post && post.title,
              activity_name: event && event.about && event.about.title,
            });
          });
        } else {
          stores.Votes.loadVote(itemID).then((vote) => {
            console.warn(vote, itemID);
            resolve({
              item_title: vote && vote.title,
              activity_name: event && event.about && event.about.title,
            });
          });
        }
      });
    });
  }

  saveShares(eventID, share, updater, date) {
    return new Promise((resolve, reject) => {
      this.returnItemTitle(share.type, share.item_id, share.activity_id).then(
        (title) => {
          console.warn(title, share);
          let shareTitle = this.choseShareTitle(share.type);
          let scope = toTitleCase(share.scope);
          let change = {
            id: IDMaker.make(),
            date: date,
            updated: share.type,
            updater: updater,
            title: 'Updates on Main Activity',
            event_id: eventID,
            changed:
              'Shared ' +
              toTitleCase(title.item_title) +
              ' (' +
              shareTitle +
              ') to his ' +
              (scope === 'Some' ? 'Contacts' : scope),
            new_value: { data: share.id, new_value: title.item_title },
          };
          stores.Events.addEvent(share).then(() => {
            resolve(change);
            stores.ChangeLogs.addChanges(change);
          });
        }
      );
    });
  }
  saveMessage(message, eventID, committeeID, me) {
    return new Promise((resolve, reject) => {
      !me ? stores.Messages.addNewMessage(committeeID, message) : null;
      !me && Requester.seenMessage(message.id, committeeID, eventID).then(() => { })
      this.informCommitteeAndEvent(message, committeeID, eventID).then(() => {
        resolve();
      });
    });
  }
  receiveMessage(messageID, commiteeID, receiver) {
    return stores.Messages.receiveMessage(commiteeID, receiver, messageID);
  }
  updateMessage(messageID, commiteeID, eventID, text) {
    return new Promise((resolve, reject) => {
      stores.Messages.updateMessageText(commiteeID, messageID, text).then(
        () => {
          /*stores.CommiteeStore.updateLatestMessageText(
            messageID,
            text,
            commiteeID,
            eventID
          ).then(() => {
            resolve();
          });*/
        }
      );
    });
  }
  playedMessage(messageID, committeeID, eventID, player) {
    return stores.Messages.playedMessage(committeeID, messageID, player);
  }
  seenMessage(messageID, committeeID, eventID, seer) {
    return stores.Messages.seenMessage(committeeID, messageID, seer);
  }
  reactToMessage(messageID, commiteeID, eventID, reaction) {
    return stores.Messages.reactToMessage(commiteeID, messageID, reaction);
  }
  deleteMessage(messageID, commiteeID, eventID) {
    return new Promise((resolve, reject) => {
      stores.Messages.removeMessage(commiteeID, messageID).then(() => {
       /* stores.CommiteeStore.removeNewMessage(
          messageID,
          eventID,
          commiteeID
        ).then(() => {*/
          stores.Events.removeNewMessage(eventID, messageID, commiteeID).then(
            () => {
              resolve();
            }
          );
       // });
      });
    });
  }
  sayTyping(commiteeID, typer, dontEmit) {
    return new Promise((resolve, reject) => {
      emitter.emit(typing(commiteeID), typer)
      resolve();
    });
  }
  informCommitteeAndEvent(message, committeeID, eventID) {
    return new Promise((resolve, reject) => {
      //stores.CommiteeStore.addNewMessage(message, eventID, committeeID).then(
      //  () => {
      stores.Events.addNewMessage(eventID, message, committeeID).then(
        () => {
          resolve();
        }
      );
      //  }
      //);
    });
  }
  updateRemindAlarms(eventID, remindID, newAlarms, date, updater) {
    return new Promise((resolve, reject) => {
      stores.Reminds.updateAlarmPatern(eventID,
        remindID,
        newAlarms.alarms,
        newAlarms.date).
        then((oldRemind) => {
          let change = {
            id: IDMaker.make(),
            date: date,
            updated: "remind_alarms",
            updater: updater,
            title: `Updates on ${oldRemind.title} Program`,
            event_id: eventID,
            changed: "Changed the default alarms definition of the propgram",
            new_value: { data: null, new_value: newAlarms },
          };
          stores.ChangeLogs.addChanges(change).then(() => {
            resolve()
          })
        })
    })
  }
}

const MainUpdater = new mainUpdater();
export default MainUpdater;
