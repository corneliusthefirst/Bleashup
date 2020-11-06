/* eslint-disable prettier/prettier */
import { observable, action } from 'mobx';
import {
  filter,
  uniqBy,
  orderBy,
  find,
  findIndex,
  reject,
  findLast,
  uniq,
  indexOf,
  forEach,
  dropWhile,
} from 'lodash';
import storage from './Storage';
import moment from 'moment';
import requestObject from '../services/requestObjects';
import tcpRequest from '../services/tcpRequestData';
import serverEventListener from '../services/severEventListener';
import request from '../services/requestObjects';
import stores from './index';
import GState from './globalState/index';
import EventListener from '../services/severEventListener';
import globalFunctions from '../components/globalFunctions';

export default class events {
  constructor() {
    this.inializeStore().then(Events => {
      this.saveInterval = setInterval(() => {
        this.previousTime !== this.currentTime ? this.saver() : null;
      }, this.saveTimer);
    });



  }

  @observable currentEvents = [];
  @observable pastEvents = [];
  @observable events = []
  @observable myReminds = [];
  storeAccessKey = {
    key: 'Events',
    autoSync: true,
  };
  saveKey = {
    key: 'Events',
    data: [],
  };
  saveInterval = null
  saveTimer = 2000
  inializeStore() {
    return new Promise((resolve, reject) => {
      storage.load(this.storeAccessKey)
        .then(events => {
          this.setProperties(events);
          resolve(events);
        })
        .catch(error => {
          this.setProperties([]);
          resolve();
        });
    });
  }
  @observable searchdata = [];
  @observable array = [];

  getAllEvents() {
    return new Promise((resolve, reject) => {
      let getEvents = request.None()
      const phone = stores.LoginStore.user.phone
      const id = phone + "_all_events"
      tcpRequest.getEvents(getEvents, id).then(JSONData => {
        EventListener.sendRequest(JSONData, id).then(data => {
          resolve(data.data)
        })
      })
    })
  }
  isMyActivity(activity) {
    const participant = activity.participant
    if (participant &&
      participant.length == 1 &&
      participant[0] &&
      participant[0].phone == activity.creator_phone &&
      activity.creator_phone !== stores.LoginStore.user.phone
    ) {
      return true
    } else {
      return false
    }
  }
  getAllCurrentEvents() {
    return new Promise((resolve, reject) => {
      let getEvents = request.None()
      const phone = stores.LoginStore.user.phone
      const id = phone + "_all_current_events"
      tcpRequest.collectCurrentEvents(getEvents, id).then(JSONData => {
        EventListener.sendRequest(JSONData, id).then(data => {
          this.setProperties(data.data)
          resolve(data.data)
        })
      })
    })
  }


  addEvent(NewEvent) {
    if (NewEvent == 'no_such_key') {
      resolve();
    } else {
      NewEvent.updated_at = moment().format();
      NewEvent.new = true;
      return new Promise((resolve, reject) => {
        this.readFromStore().then(Events => {
          if (Events.length !== 0) {
            Events.push(NewEvent);
            this.saveKey.data = Events;
          }
          else { this.saveKey.data = [NewEvent]; }
          this.saveKey.data = uniqBy(this.saveKey.data, 'id');
          this.setProperties(this.saveKey.data, true);
          resolve();
        });
      });
    }
  }

  delete(EventID) {
    return new Promise((resolve, rejec) => {
      this.readFromStore().then(Events => {
        Events = reject(Events, { id: EventID });
        //EventID === 'newEventId' ? Events.push(request.Event()) : null;
        this.saveKey.data = Events;
        this.setProperties(this.saveKey.data, false);
        resolve('ok');
      });
    });
  }

  @action hide(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        Events[index].hiden = true;
        this.saveKey.data = Events;
        this.setProperties(this.saveKey.data, false);
        resolve('ok');
      });
    });
  }
  canUpdate(index) {
    return index >= 0
  }
  isMaster(EventID, Phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          let Participants = Events[index].participant;
          let Masters = filter(Participants, { master: true });
          if (find(Masters, { phone: Phone })) { resolve(true); }
          else { resolve(false); }
        } else {
          resolve(false)
        }
      });
    });
  }
  @action markAsSeen(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Events) => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          Events[index].new = false;
          indexNew = findIndex(this.events, { id: EventID });
          this.saveKey.data = uniqBy(Events, 'id');
          this.setProperties(this.saveKey.data, false);
          resolve();
        } else {
          resolve()
        }
      });
    });
  }
  @action markAsCalendared(EventID, id, alarms) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Events) => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          Events[index].calendared = true;
          Events[index].calendar_id = id;
          Events[index].alarms = alarms;
          indexNew = findIndex(this.events, { id: EventID });
          this.saveKey.data = uniqBy(Events, 'id');
          this.setProperties(this.saveKey.data, false);
          resolve();
        } else {
          resolve()
        }
      });
    });
  }
  @action markAsConfigured(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Events) => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          Events[index].configured = true;
          indexNew = findIndex(this.events, { id: EventID });
          this.saveKey.data = uniqBy(Events, 'id');
          this.setProperties(this.saveKey.data, false);
          resolve();
        } else {
          resolve()
        }
      });
    });
  }
  isParticipant(EventID, phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { id: EventID });
        if (
          Event && find(Event.participant, {
            phone: phone,
          })
        ) { resolve(Event); }
        else { resolve(false); }
      });
    });
  }
  loadCurrentEventFromRemote(EventID) {
    return new Promise((resolve, reject) => {
      serverEventListener.GetData(EventID).then(event => {
        if (event === 'no_such_key') {
          resolve(request.Event());
        } else {
          resolve(event);
          this.addEvent(event)
        }
      }).catch(error => {
        resolve(request.Event());
      });
    });
  }
  @action loadCurrentEvent(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore()
        .then(Events => {
          let event = find(Events, { id: EventID });
          if (!event) {
            this.loadCurrentEventFromRemote(EventID).then((Event) => {
              resolve(Event);
            }).catch((error) => {
              reject(error);
            });
          } else {
            resolve(event);
          }
        });
    });
  }
  @action getPaticipants(eventID) {
    return new Promise((resolve, reject) => {
      this.loadCurrentEvent(eventID).then(event => {
        resolve(event.participant);
      });
    });
  }
  @action loadEvents() {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(events => {
        this.setProperties(events, true);
        resolve();
      });
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
        if (Events.length !== 0) {
          let index = findIndex(Events, { id: EventID });
          if (this.canUpdate(index)) {
            Events[index].past = true;
            Events[index].updated_at = moment().format();
            this.saveKey.data = Events;
            this.setProperties(this.saveKey.data, inform);
            resolve();
          } else {
            resolve()
          }
        }
      });
    });
  }
  @action RescheduleEvent(Reschedule) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        if (Events.length !== 0) {
          let index = findIndex(Events, {
            id: Reschedule.event_id,
          });
          if (this.canUpdate(index)) {
            Events[index].past = false;
            Events[index].period = {
              date: Reschedule.new_date,
              time: Reschedule.new_time,
            };
            Events[index].rescheduled = true;
            Events[index].updated_at = moment().format();
            this.saveKey.data = Events;
            this.setProperties(this.saveKey.data, inform);
            resolve();
          } else {
            resolve()
          }
        }
      });
    });
  }
  @action removeEvent(EventID, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then(Events => {
        let NewEvents = reject(Events, ['id', EventID]);
        this.saveKey.data = NewEvents;
        this.setProperties(this.saveKey.data, inform);
        resolve();
      });
    });
  }
  @action updateEventParticipant(EventID, newParticipant, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        let index = findIndex(Events[eventIndex].participant, {
          phone: newParticipant.phone,
        });
        if (this.canUpdate(eventIndex)) {
          Events[eventIndex].participant[index] = newParticipant;
          if (inform) {
            Events[eventIndex].participant_update = true;
            Events[eventIndex].updated = true;
          }
          Events[eventIndex].updated_at = moment().format();
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve(Events[eventIndex]);
        } else {
          resolve({})
        }
      });
    });
  }
  updateWhoCanManage(EventID, newVal, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        if (this.canUpdate(eventIndex)) {
          Events[eventIndex].who_can_update = newVal;
          if (inform) {
            Events[eventIndex].updated = true;
          }
          Events[eventIndex].updated_at = moment().format();
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve(Events[eventIndex]);
        } else {
          resolve({})
        }
      });
    });
  }
  @action addParticipant(EventID, Participant, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        if (this.canUpdate(eventIndex)) {
          Events[eventIndex].participant[Events[eventIndex].participant.length] = Participant;
          Events[eventIndex].participant = uniqBy(Events[eventIndex].participant, 'phone');
          if (inform) {
            Events[eventIndex].participant_added = true;
            Events[eventIndex].updated = true;
            Events[eventIndex].updated_at = moment().format();
            Events[eventIndex].joint = true;
          }
          else { Events[eventIndex].joint = true; }
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve(Events[eventIndex]);
        } else {
          serverEventListener.GetData(EventID).then(event => {
            if (inform) {
              event.participant_added = true;
              event.updated = true;
              event.updated_at = moment().format();
              event.joint = true;
            }
            else { event.joint = true; }
            this.addEvent(event).then(() => {
              resolve(event);
            });
          }).catch(error => {
            serverEventListener.socket.write = undefined;
            console.error(error, 'in load events');
            reject(error);
          });
        }
      });
    });
  }
  @action addParticipants(EventID, Participants, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        if (this.canUpdate(eventIndex)) {
          Events[eventIndex].participant = [...Events[eventIndex].participant, ...Participants];
          Events[eventIndex].participant = uniqBy(Events[eventIndex].participant, 'phone');
          if (inform) {
            Events[eventIndex].participant_added = true;
            Events[eventIndex].updated = true;
            Events[eventIndex].updated_at = moment().format();
            Events[eventIndex].joint = true;
          }
          else { Events[eventIndex].joint = true; }
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve(Events[eventIndex]);
        } else {
          serverEventListener.GetData(EventID).then(event => {
            if (inform) {
              event.participant_added = true;
              event.updated = true;
              event.updated_at = moment().format();
              event.joint = true;
            }
            else { event.joint = true; }
            this.addEvent(event).then(() => {
              resolve(event);
            });
          }).catch(error => {
            serverEventListener.socket.write = undefined;
            console.error(error, 'in load events');
            reject(error);
          });
        }
      });
    });
  }
  @action removeParticipant(EventID, Phone, inform) {
    return new Promise((resolve, rejec) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        if (this.canUpdate(eventIndex)) {
          Events[eventIndex].participant = reject(Events[eventIndex].participant,
            ele => findIndex(Phone, e => ele.phone === e) >= 0);
          if (inform) {
            Events[eventIndex].participant_removed = true;
            Events[eventIndex].updated = true;
          }
          else { Events[eventIndex].left = true; }
          Events[eventIndex].updated_at = moment().format();
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve(Events[eventIndex]);
        } else {
          resolve({})
        }
      });
    });
  }
  @action updatePeriod(EventID, NewPeriod, inform) {
    console.warn(NewPeriod);
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        if (this.canUpdate(eventIndex)) {
          let cid = JSON.stringify({ cal_id: Events[eventIndex].calendar_id });
          Events[eventIndex].period = NewPeriod;
          if (!NewPeriod || (NewPeriod && !NewPeriod.includes('T'))) { Events[eventIndex].calendared = false; }
          Events[eventIndex].calendar_id = null;
          if (inform) {
            Events[eventIndex].period_updated = true;
            Events[eventIndex].updated = true;
          }
          Events[eventIndex].updated_at = moment().format();
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve(Events[eventIndex], cid);
        } else {
          resolve({})
        }
      });
    });
  }
  @action updateLocation(EventID, NewLocation, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        if (this.canUpdate(eventIndex)) {
          Events[eventIndex].location = { string: NewLocation };
          if (inform) {
            Events[eventIndex].location_updated = true;
            Events[eventIndex].updated = true;
          }
          Events[eventIndex].updated_at = moment().format();
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve(Events[eventIndex]);
        } else {
          resolve({})
        }
      });
    });
  }
  @action updateBackground(EventID, NewBackground, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        if (this.canUpdate(eventIndex)) {
          Events[eventIndex].background = NewBackground;
          if (inform) {
            Events[eventIndex].background_updated = true;
            Events[eventIndex].updated = true;
          }
          Events[eventIndex].updated_at = moment().format();
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve();
        } else {
          resolve({})
        }
      });
    });
  }
  @action updateRecurrency(EventID, RecurrentUpdate, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          Events[index].recurrent = RecurrentUpdate.recurrent;
          Events[index].recurrence = RecurrentUpdate.recurrence;
          Events[index].frequency = RecurrentUpdate.frequency;
          Events[index].interval = RecurrentUpdate.interval;
          Events[index].days_of_week = RecurrentUpdate.days_of_week,
            Events[index].week_start = RecurrentUpdate.week_start;
          if (inform) {
            Events[index].title_updated = true;
            Events[index].updated = true;
          }
          Events[index].updated_at = moment().format();
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve(Events[index]);
        } else {
          resolve({})
        }
      });
    });
  }
  @action updateTitle(EventID, NewTitle, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        if (this.canUpdate(eventIndex)) {
          Events[eventIndex].about.title = NewTitle;
          if (inform) {
            Events[eventIndex].title_updated = true;
            Events[eventIndex].updated = true;
          }
          Events[eventIndex].updated_at = moment().format();
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve(Events[eventIndex]);
        } else {
          resolve({})
        }
      });
    });
  }
  @action openClose(EventID, NewState, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        if (this.canUpdate(eventIndex)) {
          Events[eventIndex].closed = NewState;
          if (inform) {
            Events[eventIndex].title_updated = true;
            Events[eventIndex].updated = true;
          }
          Events[eventIndex].updated_at = moment().format();
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve();
        } else {
          resolve()
        }
      });
    });
  }
  @action updateCalendarID(EventID, newID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        if (this.canUpdate(eventIndex)) {
          Events[eventIndex].calendar_id = newID ? newID : null;
          if (inform) {
            Events[eventIndex].updated = true;
          }
          Events[eventIndex].updated_at = moment().format();
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve();
        } else {
          resolve({})
        }
      });
    });
  }

  @action updateRecursiveFrequency(EventID, recursiveFrequency, inform) {
    console.warn(recursiveFrequency, 'recurfreq');
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { id: EventID });
        let eventIndex = findIndex(Events, { id: EventID });
        if (this.canUpdate(eventIndex)) {
          Event.recursiveFrequency = recursiveFrequency;
          if (inform) {
            Event.recursiveFrequency_updated = true;
            Event.updated = true;
          }

          Event.updated_at = moment().format();
          Events.splice(eventIndex, 1, Event);
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve();
        } else {
          resolve()
        }
      });
    });
  }

  @action updateDescription(EventID, NewDescription, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        if (this.canUpdate(eventIndex)) {
          Events[eventIndex].about.description = NewDescription;
          if (inform) {
            Events[eventIndex].description_updated = true;
            Events[eventIndex].updated = true;
          }
          Events[eventIndex].updated_at = moment().format();
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve(Events[eventIndex]);
        } else {
          resolve({})
        }
      });
    });
  }
  @action publishEvent(EventID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          Events[index].public = true;
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve();
        } else {
          resolve()
        }
      });
    });
  }

  @action unpublishEvent(EventID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          Events[index].public = false;
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve();
        } else {
          resolve()
        }
      });
    });
  }
  @action likeEvent(EventID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          Events[index].likes += 1;
          Events[index].updated_at = moment().format();
          if (inform) {
            Events[index].liked_updated = true;
            Events[index].updated = true;
          } else {
            Events[index].liked = true;
          }
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve();
        } else {
          resolve()
        }
      });
    });
  }

  @action unlikeEvent(EventID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          Events[index].likes -= 1;
          Events[index].liked = false;
          Events[index].updated_at = moment().format();
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve();
        } else {
          resolve()
        }
      });
    });
  }
  @action addMustToContribute(EventID, ContributionID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          Events[index].must_contribute = uniq(
            Events[index].must_contribute.concat([ContributionID])
          );
          if (inform) {
            Events[index].must_contribute_update = true;
            Events[index].updated = true;
          }
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve();
        } else {
          resolve()
        }
      });
    });
  }
  @action removeFromMustContribute(EventID, ContributionID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          Events[index].must_contribute = dropWhile(
            Events[index].must_contribute, element => element == ContributionID
          );
          Events[index].updated_at = moment().format();
          if (inform) {
            Events[index].must_contribute_update = true;
            Events[index].updated = true;
          }
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve();
        } else {
          resolve()
        }
      });
    });
  }
  @action addVote(EventID, VoteID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, {
          id: EventID,
        });
        if (this.canUpdate(index)) {
          if (Events[index].votes && Events[index].votes.length > 0) { Events[index].votes = uniq(Events[index].votes.concat([VoteID])); }
          else { Events[index].votes = [VoteID]; }
          Events[index].updated_at = moment().format();
          if (inform) {
            Events[index].vote_added = true;
            Events[index].updated = true;
          }
          this.saveKey.data = Events;
          storage.save(this.saveKey).then(() => {
            this.setProperties(this.saveKey.data, inform);
            resolve();
          });
        } else {
          let EID = requestObject.EventID();
          EID.event_id = EventID;
          tcpRequest.getCurrentEvent(EID, EventID).then(JSONData => {
            serverEventListener.GetData(JSONData).then(E => {
              this.addEvent(E).then(() => {
                this.addVote(EventID, VoteID, true).then(() => {
                  this.setProperties(this.saveKey.data, true);
                  resolve();
                });
              });
            });
          });
        }
      });
    });
  }
  @action removeVote(EventID, VoteID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          Events[index].votes = dropWhile(Event.votes, element => element == VoteID);
          Events[index].updated_at = moment().format();
          if (inform) {
            Events[index].vote_removed = true;
            Events[index].update = true;
          }
          this.saveKey.data = Events;
          storage.save(this.saveKey).then(() => {
            this.setProperties(this.saveKey.data, inform);
            resolve();
          });
        } else {
          resolve()
        }
      });
    });
  }
  @action addContribution(EventID, ContributionID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          if (Events[index].contributions.length !== 0) {
            Events[index].contributions = uniq(
              Events[index].contributions.concat([ContributionID])
            );
          }
          else { Events[index].contributions = [ContributionID]; }
          Events[index].updated_at = moment().format();
          if (inform) {
            Events[index].contribution_added = true;
            Events[index].updated = true;
          }
          this.saveKey.data = Events;
          storage.save(this.saveKey).then(() => {
            this.setProperties(this.saveKey.data, inform);
            resolve();
          });
        } else {
          let EID = requestObject.EventID();
          EID.event_id = EventID;
          tcpRequest.getCurrentEvent(EID, EventID).then(JSONData => {
            serverEventListener.GetData(JSONData).then(E => {
              this.addEvent(E).then(() => {
                this.addContribution(EventID, ContributionID, true).then(() => {
                  this.setProperties(this.saveKey.data, true);
                  resolve();
                });
              });
            });
          });
        }
      });
    });
  }
  @action removeContribution(EventID, ContributionID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          Events[index].contributions = dropWhile(
            Events[index].contributions,
            element => element == ContributionID
          );
          Events[index].updated_at = moment().format();
          if (inform) {
            Events[index].contribtion_removed = true;
            Events[index].updated = true;
          }
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve();
        } else {
          resolve()
        }
      });
    });
  }

  removeHighlight(EventID, HighlightID, inform) {
    return new Promise((resolve, rejectPromise) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          Events[index].highlights = dropWhile(
            Events[index].highlights,
            element => element == HighlightID
          );
          if (inform) {
            Events[index].highlight_removed = true;
            Events[index].updated = true;
          }
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve();
        } else {
          resolve()
        }
      });
    });
  }

  @action addHighlight(EventID, HighlightID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, {
          id: EventID,
        });
        if (this.canUpdate(index)) {
          if (Events[index].highlights && Events[index].highlights.length > 0) { Events[index].highlights.push(HighlightID); }
          else { Events[index].highlights = [HighlightID]; }
          if (inform) {
            Events[index].highlight_added = true;
            Events[index].updated = true;
            Events[index].updated_at = moment().format();
          }
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve();
        }
        else {
          let EID = requestObject.EventID();
          EID.event_id = EventID;
          tcpRequest.getCurrentEvent(EID, EventID).then(JSONData => {
            serverEventListener.get_data(JSONData).then(E => {
              if (E) {
                this.addEvent(E).then(() => {
                  this.addHighlight(EventID, HighlightID, true).then(() => {
                    this.setProperties(this.saveKey.data, true);
                    resolve();
                  });
                });
              } else {
                reject();
              }
            });
          });
        }
      });
    });
  }
  @action addRemind(EventID, RemindID, inform) {
    return new Promise((resolve, rejectPromise) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, {
          id: EventID,
        });
        if (this.canUpdate(index)) {
          if (Events[index].reminds && Events[index].reminds.length !== 0) { Events[index].reminds = uniq(Events[index].reminds.concat([RemindID])); }
          else { Events[index].reminds = [RemindID]; }
          if (inform) {
            Events[index].remind_added = true;
            Events[index].updated = true;
            Events[index].updated_at = moment().format();
          }
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve();
        } else {
          let EID = requestObject.EventID();
          EID.event_id = EventID;
          tcpRequest.getCurrentEvent(EID, EventID).then(JSONData => {
            serverEventListener.get_data(JSONData).then(E => {
              this.addEvent(E).then(() => {
                this.addRemind(EventID, RemindID, true).then(() => {
                  this.setProperties(this.saveKey.data, true);
                  resolve();
                });
              });
            });
          });
        }
      });
    });
  }

  @action removeRemind(EventID, RemindID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          Events[index].reminds = dropWhile(Events[index].reminds,
            element => element !== RemindID);
          if (inform) {
            Events[index].remind_removed = true;
            Events[index].updated = true;
            Events[index].updated_at = moment().format();
          }
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve();
        } else {
          resolve()
        }
      });
    });
  }
  @action joinEvent(EventID, phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          let participant = find(Events[index].participant, { phone: phone });
          if (participant) {
            Events[index].joint = true;
            this.saveKey.data = Events;
            this.setProperties(this.saveKey.data, false);
            resolve();
          } else {
            reject('not participant yet');
          }
        } else {
          reject()
        }
      });
    });
  }
  @action leaveEvent(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          Events[index].joint = false;
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, true);
          resolve();
        } else {
          resolve()
        }
      });
    });
  }
  changeUpdatedStatus(EventID, revert) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {

        let index = findIndex(Events, {
          id: EventID,
        });
        if (this.canUpdate(index)) {
          const previousUpdate = Events[index].previous_updated
          const currentUpdate = Events[index].updated_at
          Events[index].updated_at = revert ? previousUpdate : moment().format();
          Events[index].previous_updated = currentUpdate
          this.setProperties(Events, true);
          resolve();
        } else {
          resolve()
        }
      });
    });
  }
  readFromStore() {
    return new Promise((resolve, reject) => {
      resolve(this.events);
    });
  }
  currentTime = moment().format()
  previousTime = moment().format()
  setProperties(Events, inform) {
    Events = orderBy(Events, ['updated_at'], ['desc']);
    this.events = Events;
    this.currentTime = moment().format();
  }
  addEventCommitee(EventID, CommiteeID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          !Events[index].commitee || Events[index].commitee.length <= 0 ? Events[index].commitee = [CommiteeID] :
            Events[index].commitee.push(CommiteeID);
          Events[index].updated_at = moment().format();
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, true);
          resolve('ok');
        } else {
          resolve("ok")
        }
      });
    });
  }

  removeCommitee(EventID, ID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        if (this.canUpdate(index)) {
          Events[index].commitee = dropWhile(Events[index].commitee, (ele) => ele === ID);
          Events[index].updated_at = moment().format();
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, true);
          resolve('ok');
        } else {
          resolve()
        }
      });
    });
  }
  addNewMessage(EventID, message, committeeID) {
    return new Promise((resolve, reject) => {
      let newDate = moment().format();
      this.readFromStore().then(events => {
        let index = findIndex(events, { id: EventID });
        if (this.canUpdate(index)) {
          let newMessage = { message_id: message.id, commitee_id: committeeID };
          GState.currentCommitee !== committeeID && (!message.sender ||
            message.sender.phone.replace('+', '00') !== stores.LoginStore.user.phone) ? events[index].new_messages && events[index].new_messages.length > 0 ?
              events[index].new_messages.push(newMessage) :
              events[index].new_messages = [newMessage] : null;
          events[index].new_message_update_at = {
            message_id: message.id,
            previous_updated: events[index].updated_at,
            current_updated_at: newDate,
          };
          events[index].updated_at = newDate;
          this.setProperties(events);
          resolve();
        } else {
          resolve()
        }
      });
    });
  }
  removeNewMessage(EventID, messageID, commiteeID) {
    return new Promise((resolve, rejec) => {
      this.readFromStore().then(events => {
        let index = findIndex(events, { id: EventID });
        if (this.canUpdate(index)) {
          events[index].new_messages = reject(events[index].new_messages,
            { message_id: messageID });
          events[index].new_message_update_at &&
            events[index].new_message_update_at.message_id == messageID ?
            events[index].updated_at = events[index].new_message_update_at.previous_updated : null;
          this.setProperties(events);
          resolve();
        } else {
          resolve()
        }
      });
    });
  }
  saver() {
    if (this.events.length > 0) {
      this.saveKey.data = this.events;
      storage.save(this.saveKey).then(() => {
        this.previousTime = this.currentTime;
      });
    }
  }
  @action resetEvent(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { id: EventID });
        let eventIndex = findIndex(Events, { id: EventID });
        if (this.canUpdate(eventIndex)) {
          Event = request.Event();
          Event.id = EventID;

          Event.updated_at = moment().format();
          Events.splice(eventIndex, 1, Event);
          this.saveKey.data = Events;
          this.setProperties(this.saveKey.data, inform);
          resolve();
        } else {
          resolve()
        }
      });
    });

  }

}





























































/**
 *
  @action  setSearchData(array) {
    return new Promise((resolve, reject) => {
      //console.warn("here1",newArray)
      storage
        .save({
          key: "searchdata",
          data: array
        })
        .then(() => {
          this.searchdata = array;
          resolve(array);
        })
        .catch(error => {
          reject(error);
        });
    });
  }



  @action async updateSearchData(newarray) {
    return new Promise((resolve, reject) => {
      storage
        .load({
          key: "searchdata",
          autoSync: true
        })
        .then(data => {
              storage
                .save({
                  key: "searchdata",
                  data: newArray
                })
                .then(() => {
                  this.searchdata = data;
                  resolve();
                });
        })
        .catch(error => {
          reject(error);
        });
    });
  }


  @action getSearchData() {
     return new Promise((resolve, reject) => {

        storage
          .load({
            key:"searchdata",
            autoSync: true
          })
          .then(data => {
                 resolve(data);
          })
          .catch(error => {
            this.setSearchData(this.searchdata).then((newArray)=>{
              resolve(newArray);
            })
       });
  })
}

 */
