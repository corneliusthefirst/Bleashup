import { observable, action } from "mobx";
import {
  filter,
  uniqBy,
  orderBy,
  find,
  findIndex,
  reject,
  uniq,
  indexOf,
  drop
} from "lodash";
import storage from "./Storage";
import moment from "moment";
import requestObject from "../services/requestObjects";
import tcpRequest from "../services/tcpRequestData";
import serverEventListener from "../services/severEventListener"
export default class events {
  constructor() {
    /*storage.remove({
      key: 'Events'
    });*/
    console.warn("constructor called")

    this.readFromStore().then(Events => {
      if (Events) {
        this.setProperties(Events, true);
      }
    });
  }
  @observable currentEvents = [];
  @observable pastEvents = [];
  @observable events = []
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
    NewEvent.updated_at = moment().format("YYYY-MM-DD HH:mm")
    NewEvent.new = true
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        if (Events.length !== 0) {
          Events.unshift(NewEvent)
          this.saveKey.data = Events;
        }
        else this.saveKey.data = [NewEvent];
        this.saveKey.data = uniqBy(this.saveKey.data, 'id');
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, true);
          resolve();
        });
      });
    });
  }
  @action delete(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        Events = drop(Events, indexOf(EventID, EventID) + 1)
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, false);
          resolve("ok")
        })

      })
    })
  }
  @action hide(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID })
        Events[index].hiden = true;
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, false);
          resolve("ok")
        })
      })
    })
  }
  isMaster(EventID, Phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        let Participants = Events[index].participant
        let Masters = filter(Participants, { master: true });
        if (find(Masters, { phone: Phone })) resolve(true)
        else resolve(false)
      })
    })
  }
  @action markAsSeen(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Events) => {
        let index = findIndex(Events, { id: EventID });
        Events[index].new = false
        indexNew = findIndex(this.events, { id: EventID });
        this.saveKey.data = uniqBy(Events, "id")
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, false)
          //this.events[indexNew].new = false
          resolve()
        })
      })
    })
  }
  isParticipant(EventID, phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { id: EventID });
        if (
          find(Event.participant, {
            phone: phone
          })
        )
          resolve(true);
        else resolve(false);
      });
    });
  }
  @action loadCurrentEvent(EventID) {
    return new Promise((resolve, reject) => {
      if (this.currentEvents.length !== 0 || this.pastEvents.length !== 0 || this.events.length !== 0) {
        if (this.currentEvents.length !== 0) {
          let Event = find(this.currentEvents, {
            id: EventID
          });
          resolve(Event);
        }
        if (this.pastEvents.length !== 0) {
          let Event = find(this.pastEvents, {
            id: EventID
          });
          resolve(Event);
        }
        if (this.events.length !== 0) {
          let Event = find(this.events, { id: EventID })
          if (!Event) {
            serverEventListener.GetData(EventID).then(event => {
              this.addEvent(event).then(() => {
                resolve(event)
              })
            })
          } else {
            resolve(Event)
          }
        }
      } else {
        this.readFromStore()
          .then(Events => {
            Event = find(Events, { id: EventID });
            if (!Event) {
              serverEventListener.GetData(EventID).then(event => {
                this.addEvent(event).then(() => {

                  resolve(event)
                })
              })
            } else {
              resolve(Event)
            }
            ;
          })
          .catch(error => {
            console.warn(error);
          });
      }
    });
  }
  @action loadEvents() {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(events => {
        this.setProperties(events, true);
        resolve()
      })
    })
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
          let index = findIndex(Events, { id: EventID });
          Events[index].past = true;
          Events[index].updated_at = moment().format("YYYY-MM-DD HH:mm");
          this.saveKey.data = Events;
          storage.save(this.saveKey).then(() => {
            //this.events[index].past = true
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
          let index = findIndex(Events, {
            id: Reschedule.event_id
          });
          Events[index].past = false;
          Events[index].period = {
            date: Reschedule.new_date,
            time: Reschedule.new_time
          }
          Events[index].rescheduled = true;
          Events[index].updated_at = moment().format("YYYY-MM-DD HH:mm");
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
        let NewEvents = reject(Events, ["id", EventID]);
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
        let eventIndex = findIndex(Events, { id: EventID });
        let index = findIndex(Event.participant, {
          phone: newParticipant.phone
        });
        Events[eventIndex].participant[index] = newParticipant;
        if (inform) {
          Events[eventIndex].participant_update = true;
          Events[eventIndex].updated = true;
        }
        Events[eventIndex].updated_at = moment().format("YYYY-MM-DD HH:mm");
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
        let eventIndex = findIndex(Events, { id: EventID });
        Events[eventIndex].participant = uniqBy(Events[eventIndex].participant.concat([Participant]), "phone");
        if (inform) {
          Events[eventIndex].participant_added = true;
          Events[eventIndex].updated = true;
        }
        else Events[eventIndex].joint = true;
        if (inform)
          Events[eventIndex].updated_at = moment().format("YYYY-MM-DD HH:mm");
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          if (indexOf)
            this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action removeParticipant(EventID, Phone, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { id: EventID });
        let eventIndex = findIndex(Events, { id: EventID });
        Event.participant = reject(Event.participant, ["phone", Phone]);
        if (inform) {
          Event.participant_removed = true;
          Event.updated = true
        }
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
        let Event = find(Events, { id: EventID });
        let eventIndex = findIndex(Events, { id: EventID });
        Event.period = NewPeriod;
        if (inform) {
          Event.period_updated = true;
          Event.updated = true;
        }
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
        let Event = find(Events, { id: EventID });
        let eventIndex = findIndex(Events, { id: EventID });
        Event.location = NewLocation;
        if (inform) {
          Event.location_updated = true;
          Event.updated = true
        }
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
        let Event = find(Events, { id: EventID });
        let eventIndex = findIndex(Events, { id: EventID });
        Event.background = NewBackground;
        if (inform) {
          Event.background_updated = true;
          Event.updated = true;
        }
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
        let Event = find(Events, { id: EventID });
        let eventIndex = findIndex(Events, { id: EventID });
        Event.about.title = NewTitle;
        if (inform) {
          Event.title_updated = true;
          Event.updated = true;
        }
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
        let Event = find(Events, { id: EventID });
        let eventIndex = findIndex(Events, { id: EventID });
        Event.about.description = NewDescription;
        if (inform) {
          Event.description_updated = true;
          Event.updated = true;
        }
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
        let Event = find(Events, { id: EventID });
        let index = findIndex(Events, { id: EventID });
        Event.public = true;
        if (inform) Event.updated = true
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          if (inform)
            this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }

  @action unpublishEvent(EventID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { id: EventID });
        let index = findIndex(Events, { id: EventID });
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
        let Event = find(Events, { id: EventID });
        let index = findIndex(Events, { id: EventID });
        Event.likes += 1;
        if (inform) {
          Event.liked_updated = true;
          Event.updated = true;
        } else {
          Event.liked = true
        }
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }

  @action unlikeEvent(EventID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { id: EventID });
        let index = findIndex(Events, { id: EventID });
        Event.likes -= 1;
        Event.liked = false
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
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { id: EventID });
        let index = findIndex(Events, { id: EventID });
        Event.must_contribute = uniq(
          Event.must_contribute.concat([ContributionID])
        );
        if (inform) {
          Event.must_contribute_update = true;
          Event.updated = true
        }
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action removeFromMustContribute(EventID, ContributionID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { id: EventID });
        let index = findIndex(Events, { id: EventID });
        Event.must_contribute = drop(
          Event.must_contribute,
          indexOf(Event.must_contribute, ContributionID) + 1
        );
        if (inform) {
          Event.must_contribute_update = true;
          Event.updated = true
        }
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action addVote(EventID, VoteID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { id: EventID });
        if (Event) {
          let index = findIndex(Events, {
            id: EventID
          });
          if (Event.votes)
            Event.votes = uniq(Event.votes.concat([VoteID]));
          else Event.votes = [VoteID]
          if (inform) {
            Event.vote_added = true;
            Event.updated = true
          }
          Events.splice(index, 1, Event);
          this.saveKey.data = Events;
          storage.save(this.saveKey).then(() => {
            this.setProperties(this.saveKey.data, inform);
            resolve();
          });
        } else {
          let EID = requestObject.EventID();
          EID.event_id = EventID;
          tcpRequest.getCurrentEvent(EID, EventID).then(JSONData => {
            serverEventListener.get_data(JSONData).then(E => {
              this.addEvent(E).then(() => {
                this.addVote(EventID, VoteID, true).then(() => {
                  resolve()
                })
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
        let Event = find(Events, { id: EventID });
        let index = findIndex(Events, { id: EventID });
        Event.votes = drop(Event.votes, indexOf(Event.votes, VoteID));
        if (inform) {
          Event.vote_removed = true;
          Event.update = true;
        }
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action addContribution(EventID, ContributionID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { id: EventID });
        if (Event) {
          let index = findIndex(Events, { id: EventID });
          if (Event.contributions)
            Event.contributions = uniq(
              Event.contributions.concat([ContributionID])
            );
          else Event.contributions = [ContributionID]
          if (inform) {
            Event.contribution_added = true;
            Event.updated = true
          }
          Events.splice(index, 1, Event);
          this.saveKey.data = Events;
          storage.save(this.saveKey).then(() => {
            this.setProperties(this.saveKey.data, inform);
            resolve();
          });
        } else {
          let EID = requestObject.EventID();
          EID.event_id = EventID;
          tcpRequest.getCurrentEvent(EID, EventID).then(JSONData => {
            serverEventListener.get_data(JSONData).then(E => {
              this.addEvent(E).then(() => {
                this.addContribution(EventID, ContributionID, true).then(() => {
                  resolve()
                })
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
        let Event = find(Events, { id: EventID });
        let index = findIndex(Events, { id: EventID });
        Event.contributions = drop(
          Event.contributions,
          indexOf(Event.contributions, ContributionID) + 1
        );
        if (inform) {
          Event.contribtion_removed = true;
          Event.updated = true
        }
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action removeHighlights(EventID, HighlightID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { id: EventID });
        let index = findIndex(Events, { id: EventID });
        Event.highlights = drop(
          Event.highlights,
          indexOf(Event.highlights, HighlightID) + 1
        );
        if (inform) {
          Event.highlight_removed = true;
          Event.updated = true
        }
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action addHighlight(EventID, HighlightID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { id: EventID });
        if (Event) {
          let index = findIndex(Events, {
            id: EventID
          });
          if (Event.highlights)
            Event.highlights = uniq(Event.highlights.concat([HighlightID]));
          else Event.highlights = [HighlightID]
          if (inform) {
            Event.highlight_added = true;
            Event.updated = true
          }
          Events.splice(index, 1, Event);
          this.saveKey.data = Events;
          storage.save(this.saveKey).then(() => {
            this.setProperties(this.saveKey.data, inform);
            resolve();
          });
        } else {
          let EID = requestObject.EventID();
          EID.event_id = EventID;
          tcpRequest.getCurrentEvent(EID, EventID).then(JSONData => {
            serverEventListener.get_data(JSONData).then(E => {
              this.addEvent(E).then(() => {
                this.addHighlight(EventID, HighlightID, true).then(() => {
                  resolve()
                })
              });
            });
          });
        }
      });
    });
  }
  @action addRemind(EventID, RemindID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, {
          id: EventID
        });
        if (Event) {
          let index = findIndex(Events, {
            id: EventID
          });
          if (Event.reminds)
            Event.reminds = uniq(Event.reminds.concat([RemindID]));
          else Event.reminds = [RemindID];
          if (inform) {
            Event.remind_added = true;
            Event.updated = true
          }
          Events.splice(index, 1, Event);
          this.saveKey.data = Events;
          storage.save(this.saveKey).then(() => {
            this.setProperties(this.saveKey.data, inform);
            resolve();
          });
        } else {
          let EID = requestObject.EventID();
          EID.event_id = EventID;
          tcpRequest.getCurrentEvent(EID, EventID).then(JSONData => {
            serverEventListener.get_data(JSONData).then(E => {
              this.addEvent(E).then(() => {
                this.addRemind(EventID, RemindID, true).then(() => {
                  resolve()
                })
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
        let Event = find(Events, { id: EventID });
        let index = findIndex(Events, { id: EventID });
        Event.reminds = drop(Event.reminds, indexOf(Event.reminds, RemindID) + 1);
        if (inform) {
          Event.remind_removed = true;
          Event.updated = true;
        }
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action joinEvent(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { id: EventID });
        let index = findIndex(Events, { id: EventID });
        Event.joint = true;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          //this.setProperties(this.saveKey.data, true);
          resolve();
        });
      });
    });
  }
  @action leaveEvent(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { id: EventID });
        let index = findIndex(Events, { id: EventID });
        Event.joint = false;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, true);
          resolve();
        });
      });
    });
  }
  changeUpdatedStatus(EventID, statusKey, newStatus) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, {
          id: EventID
        });
        let index = findIndex(Events, {
          id: EventID
        });
        Event[statusKey] = newStatus;
        Events.splice(index, 1, Event);
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, true);
          resolve();
        });
      });
    })
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
    if (inform) Events = orderBy(Events, ["updated_at"], ["desc"]);
    this.events = Events;
    this.newEvent = [Events[2]]
    this.currentEvents = filter(Events, { past: false });
    this.PastEvents = filter(Events, { past: true });
    this.myReminds = filter(Events, { reminds: true });
  }
}
