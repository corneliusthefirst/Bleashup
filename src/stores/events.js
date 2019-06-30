import { observable, action } from "mobx";
import {
  filter,
  uniqBy,
  sortBy,
  find,
  findIndex,
  dropWhile,
  uniq,
  indexOf,
  drop
} from "lodash";
import storage from "./Storage";
import moment from "moment";
import requestObject from "../services/requestObjects";
export default class events {
  constructor() {
    this.readFromStore().then(Events => {
      if (Events) {
        this.setProperties(Events, true);
      }
    });
  }
  @observable currentEvents = [];
  @observable pastEvents = [];
  @observable myReminds = [];
  storeAccessKey = {
    key: "Events",
    autoSync: true
  };
  saveKey = {
    key: "Events",
    data: []
  };
  @action addEvent(NewEvent) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        this.saveKey.data = Events.concat([NewEvent]);
        this.saveKey.data = uniqBy(this.saveKey.data, "event_id");
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, true);
          resolve();
        });
      });
    });
  }
  isParticipant(EventID, phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        if (
          find(Event.participants, {
            phone: phone
          })
        )
          resolve(true);
        else resolve(false);
      });
    });
  }
  @action loadCurrentEvent(EventID) {
    return new Promise((resovle, reject) => {
      if (this.currentEvents || this.pastEvents) {
        if (this.currentEvents) {
          let Event = find(this.currentEvents, {
            event_id: EventID
          });
          if (Event) resolve(EventID);
        }
        if (this.pastEvents) {
          let Event = find(this.pastEvents, {
            event_id: EventID
          });
          if (Event) resovle(Event);
        }
      } else {
        this.readFromStore()
          .then(Events => {
            Event = find(Events, { event_id: EventID });
            resovle(EventID);
          })
          .catch(error => {
            console.warn(error);
          });
      }
    });
  }
  @action loadCurrentEvents() {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let CurrentEvent = filter(Events, { past: false });
        resolve(CurrentEvent);
      });
    });
  }
  @action loadPastEvents() {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let PastEvents = filter(Events, { past: true });
        resolve(PastEvents);
      });
    });
  }
  @action changToPastEvent(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        if (Events) {
          let Event = find(Events, { event_id: EventID });
          let index = findIndex(Events, { event_id: EventID });
          Event.past = true;
          Event.updated_at = moment().format("YYYY-MM-DD HH:mm");
          Events.splice(index, 1, Event);
          this.saveKey.data = Events;
          storage.save(this.saveKey).then(() => {
            this.setProperties(this.saveKey.data, inform);
            resolve();
          });
        }
      });
    });
  }
  @action RescheduleEvent(Reschedule) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        if (Events) {
          let Event = find(Events, {
            event_id: Reschedule.event_id
          });
          let index = findIndex(Events, {
            event_id: Reschedule.event_id
          });
          Event.past = false;
          (Event.period = {
            date: Reschedule.new_date,
            time: Reschedule.new_time
          }),
            (Event.rescheduled = true);
          Event.updated_at = moment().format("YYYY-MM-DD HH:mm");
          Events.splice(index, 1, Event);
          this.saveKey.data = Events;
          storage.save(this.saveKey).then(() => {
            this.setProperties(this.saveKey.data, inform);
            resolve();
          });
        }
      });
    });
  }
  @action removeEvent(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let NewEvents = dropWhile(Events, ["event_id", EventID]);
        this.saveKey.data = NewEvents;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action updateEventParticipant(EventID, newParticipant, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let eventIndex = findIndex(Events, { event_id: EventID });
        let index = findIndex(Event.participants, {
          phone: newParticipant.phone
        });
        Event.participants.splice(index, 1, newParticipant);
        if (inform) Event.participant_update = true;
        Event.updated_at = moment().format("YYYY-MM-DD HH:mm");
        Events.splice(eventIndex, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action addParticipant(EventID, Participant, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let eventIndex = findIndex(Events, { event_id: EventID });
        Event.participants = Event.participants.concat([Participant]);
        if (inform) Event.participant_added = true;
        else Event.joint = true;
        Event.updated_at = moment().format("YYYY-MM-DD HH:mm");
        Events.splice(eventIndex, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action removeParticipant(EventID, Phone, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let eventIndex = findIndex(Events, { event_id: EventID });
        Event.participants = dropWhile(Event.participants, ["phone", Phone]);
        if (inform) Event.participant_removed = true;
        else Event.left = true;
        Event.updated_at = moment().format("YYY-MM-DD HH-mm");
        Events.splice(eventIndex, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action updatePeriod(EventID, NewPeriod, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let eventIndex = findIndex(Events, { event_id: EventID });
        Event.period = NewPeriod;
        if (inform) Event.period_updated = true;
        Event.updated_at = moment().format("YYYY-MM-DD HH:mm");
        Events.splice(eventIndex, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action updateLocation(EventID, NewLocation, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let eventIndex = findIndex(Events, { event_id: EventID });
        Event.location = NewLocation;
        if (inform) Event.location_updated = true;
        Event.updated_at = moment().format("YYYY-MM-DD HH:mm");
        Events.splice(eventIndex, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action updateBackground(EventID, NewBackground, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let eventIndex = findIndex(Events, { event_id: EventID });
        Event.background = NewBackground;
        if (inform) Event.background_updated = true;
        Event.updated_at = moment().format("YYYY-MM-DD HH:mm");
        Events.splice(eventIndex, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action updateTitle(EventID, NewTitle, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let eventIndex = findIndex(Events, { event_id: EventID });
        Event.about.title = NewTitle;
        if (inform) Event.title_updated = true;
        Event.updated_at = moment().format("YYYY-MM-DD HH:mm");
        Events.splice(eventIndex, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action updateDescription(EventID, NewDescription, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let eventIndex = findIndex(Events, { event_id: EventID });
        Event.about.description = NewDescription;
        if (inform) Event.description_updated = true;
        Event.updated_at = moment().format("YYYY-MM-DD HH:mm");
        Events.splice(eventIndex, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action publishEvent(EventID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let index = findIndex(Events, { event_id: EventID });
        Event.public = true;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }

  @action unpublishEvent(EventID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let index = findIndex(Events, { event_id: EventID });
        Event.public = false;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action likeEvent(EventID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let index = findIndex(Events, { event_id: EventID });
        Event.likes += 1;
        if (inform) Event.liked_updated = true;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }

  @action unlikeEvent(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let index = findIndex(Events, { event_id: EventID });
        Event.likes -= 1;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action addMustToContribute(EventID, ContributionID, inform) {
    return new Promise((resovle, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let index = findIndex(Events, { event_id: EventID });
        Event.must_contribute = uniq(
          Event.must_contribute.concat([ContributionID])
        );
        if (inform) Event.must_contribute_update = true;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resovle();
        });
      });
    });
  }
  @action removeFromMustContribute(EventID, ContributionID) {
    return new Promise((resovle, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let index = findIndex(Events, { event_id: EventID });
        Event.must_contribute = drop(
          Event.must_contribute,
          indexOf(Event.must_contribute, ContributionID)
        );
        if (inform) Event.must_contribute_update = true;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resovle();
        });
      });
    });
  }
  @action addVote(EventID, VoteID, inform) {
    return new Promise((resovle, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let index = findIndex(Events, { event_id: EventID });
        Event.votes = uniq(Event.votes.concat([VoteID]));
        if (inform) Event.vote_added = true;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resovle();
        });
      });
    });
  }
  @action removeVote(EventID, VoteID, inform) {
    return new Promise((resovle, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let index = findIndex(Events, { event_id: EventID });
        Event.votes = drop(Event.votes, indexOf(Event.votes, VoteID));
        if (inform) Event.vote_removed = true;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resovle();
        });
      });
    });
  }
  @action addContribution(EventID, ContributionID, inform) {
    return new Promise((resovle, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let index = findIndex(Events, { event_id: EventID });
        Event.contributions = uniq(
          Event.contributions.concat([ContributionID])
        );
        if (inform) Event.contribution_added = true;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resovle();
        });
      });
    });
  }
  @action removeContribution(EventID, ContributionID, inform) {
    return new Promise((resovle, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let index = findIndex(Events, { event_id: EventID });
        Event.contributions = drop(
          Event.contributions,
          indexOf(Event.contributions, ContributionID)
        );
        if (inform) Event.contribtion_removed = true;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resovle();
        });
      });
    });
  }
  @action removeHighlights(EventID, HighlightID, inform) {
    return new Promise((resovle, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let index = findIndex(Events, { event_id: EventID });
        Event.highlights = drop(
          Event.highlights,
          indexOf(Event.highlights, HighlightID)
        );
        if (inform) Event.highlight_removed = true;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resovle();
        });
      });
    });
  }
  @action addHighlight(EventID, HighlightID, inform) {
    return new Promise((resovle, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let index = findIndex(Events, { event_id: EventID });
        Event.highlights = uniq(Event.highlights.concat([HighlightID]));
        if (inform) Event.highlight_added = true;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resovle();
        });
      });
    });
  }
  @action addRemind(EventID, RemindID, inform) {
    return new Promise((resovle, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, {
          event_id: EventID
        });
        let index = findIndex(Events, {
          event_id: EventID
        });
        Event.reminds = uniq(Event.reminds.concat([RemindID]));
        if (inform) Event.remind_added = true;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resovle();
        });
      });
    });
  }

  @action removeRemind(EventID, RemindID, inform) {
    return new Promise((resovle, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let index = findIndex(Events, { event_id: EventID });
        Event.reminds = drop(Event.reminds, indexOf(Event.reminds, RemindID));
        if (inform) Event.remind_removed = true;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resovle();
        });
      });
    });
  }
  @action joinEvent(EventID) {
    return new Promise((resovle, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let index = findIndex(Events, { event_id: EventID });
        Event.joint = true;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, true);
          resovle();
        });
      });
    });
  }
  @action leaveEvent(EventID) {
    return new Promise((resovle, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { event_id: EventID });
        let index = findIndex(Events, { event_id: EventID });
        Event.joint = false;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, true);
          resovle();
        });
      });
    });
  }
  readFromStore() {
    return new Promise((resolve, reject) => {
      storage
        .load(this.storeAccessKey)
        .then(events => {
          resolve(events);
        })
        .catch(error => {
          resolve([]);
        });
    });
  }
  setProperties(Events, inform) {
    if (inform) Events = sortBy(Events, ["updated_at"]);
    this.currentEvents = filter(Events, { past: false });
    this.PastEvents = filter(Events, { past: true });
    this.myReminds = filter(Events, { reminds: true });
  }
}
