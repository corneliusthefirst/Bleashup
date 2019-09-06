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
  forEach,
  dropWhile
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
      let i = 0
      forEach(Events,(Event) =>{
        Events[i].hiden = false
        if(i == Events.length -1){
          if (Events) {
            this.setProperties(Events, true);
          }
        }
        i++
      })
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
        Events = dropWhile(Events, element => element.id == EventID)
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
            }).catch(error => {
              serverEventListener.socket.write = undefined
              console.error(error,"in load events")
              reject(error)
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
              }).catch(error => {
                serverEventListener.socket.write = undefined
                console.error(error, "in load events")
                reject(error)
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
        if (Events.length !== 0) {
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
        if (Events.length !== 0) {
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
        if(eventIndex){
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
        }else{
          let Event = find(this.events, { id: EventID })
          if (!Event) {
            serverEventListener.GetData(EventID).then(event => {
              this.addEvent(event).then(() => {
                resolve(event)
              })
            }).catch(error => {
              serverEventListener.socket.write = undefined
              console.error(error, "in load events")
              reject(error)
            })
          } else {
            resolve(Event)
          }
        }
      });
    });
  }
  @action removeParticipant(EventID, Phone, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        Events[eventIndex].participant = reject(Event.participant, ["phone", Phone]);
        if (inform) {
          Events[eventIndex].participant_removed = true;
          Events[eventIndex].updated = true
        }
        else Events[eventIndex].left = true;
        Events[eventIndex].updated_at = moment().format("YYY-MM-DD HH-mm");
        Events.splice(eventIndex, 1, Event);
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
        let eventIndex = findIndex(Events, { id: EventID });
        Events[eventIndex].period = NewPeriod;
        if (inform) {
          Events[eventIndex].period_updated = true;
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
  @action updateLocation(EventID, NewLocation, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        Events[eventIndex].location = NewLocation;
        if (inform) {
          Events[eventIndex].location_updated = true;
          Events[eventIndex].updated = true
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
  @action updateBackground(EventID, NewBackground, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        Events[eventIndex].background = NewBackground;
        if (inform) {
          Events[eventIndex].background_updated = true;
          Event[eventIndex].updated = true;
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
  @action updateTitle(EventID, NewTitle, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        Events[eventIndex].about.title = NewTitle;
        if (inform) {
          Events[eventIndex].title_updated = true;
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
  @action updateDescription(EventID, NewDescription, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        Events[eventIndex].about.description = NewDescription;
        if (inform) {
          Events[eventIndex].description_updated = true;
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
  @action publishEvent(EventID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        Events[index].public = true;
        if (inform) Events[index].updated = true
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
        let index = findIndex(Events, { id: EventID });
        Events[index].public = false;
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
        let index = findIndex(Events, { id: EventID });
        Events[index].likes += 1;
        if (inform) {
          Events[index].liked_updated = true;
          Events[index].updated = true;
        } else {
          Events[index].liked = true
        }
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
        let index = findIndex(Events, { id: EventID });
        Events[index].likes -= 1;
        Events[index].liked = false
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
        let index = findIndex(Events, { id: EventID });
        Events[index].must_contribute = uniq(
          Events[index].must_contribute.concat([ContributionID])
        );
        if (inform) {
          Events[index].must_contribute_update = true;
          Events[index].updated = true
        }
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
        let index = findIndex(Events, { id: EventID });
        Events[index].must_contribute = dropWhile(
          Events[index].must_contribute,element => element == ContributionID
        );
        if (inform) {
          Events[index].must_contribute_update = true;
          Events[index].updated = true
        }
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
        let index = findIndex(Events, {
          id: EventID
        });
        if (index >= 0) { 
          if (Events[index].votes.length !== 0)
            Events[index].votes = uniq(Events[index].votes.concat([VoteID]));
          else Events[index].votes = [VoteID]
          if (inform) {
            Events[index].vote_added = true;
            Events[index].updated = true
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
        let index = findIndex(Events, { id: EventID });
        Events[index].votes = dropWhile(Event.votes, element => element == VoteID);
        if (inform) {
          Events[index].vote_removed = true;
          Events[index].update = true;
        }
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
        let index = findIndex(Events, { id: EventID });
        if (index >= 0) {
          if (Events[index].contributions.length !== 0)
            Events[index].contributions = uniq(
              Events[index].contributions.concat([ContributionID])
            );
          else Events[index].contributions = [ContributionID]
          if (inform) {
            Events[index].contribution_added = true;
            Events[index].updated = true
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
        let index = findIndex(Events, { id: EventID });
        Events[index].contributions = dropWhile(
          Events[index].contributions,
          element => element == ContributionID
        );
        if (inform) {
          Events[index].contribtion_removed = true;
          Events[index].updated = true
        }
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
        let index = findIndex(Events, { id: EventID });
        Events[index].highlights = dropWhile(
          Events[index].highlights,
         element => element == HighlightID
        );
        if (inform) {
          Events[index].highlight_removed = true;
          Events[index].updated = true
        }
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
        let index = findIndex(Events, {
          id: EventID
        });
        if (index >= 0) {
          if (Events[index].highlights.length !== 0)
            Events[index].highlights = uniq(Events[index].highlights.unshift(HighlightID));
          else Events[index].highlights = [HighlightID]
          if (inform) {
            Events[index].highlight_added = true;
            Events[index].updated = true
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
        let index = findIndex(Events, {
          id: EventID
        });
        if (index >= 0) {
          if (Events[index].reminds.length !== 0)
            Events[index].reminds = uniq(Event.reminds.concat([RemindID]));
          else Events[index].reminds = [RemindID];
          if (inform) {
            Events[index].remind_added = true;
            Events[index].updated = true
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
        let index = findIndex(Events, { id: EventID });
        Events[index].reminds = dropWhile(Event.reminds, element => element !== RemindID);
        if (inform) {
          Events[index].remind_removed = true;
          Events[index].updated = true;
        }
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  @action joinEvent(EventID,phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        let participant = find(Events[index].participant,{phone:phone})
        if(participant){
          Events[index].joint = true;
          this.saveKey.data = Events;
          storage.save(this.saveKey).then(() => {
            this.setProperties(this.saveKey.data, false);
            resolve();
          });
        }else{
          reject("not participant yet")
        }
      });
    });
  }
  @action leaveEvent(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        Events[index].joint = false;
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
      
        let index = findIndex(Events, {
          id: EventID
        });
        Events[index][statusKey] = newStatus;
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
    this.events = filter(Events,event => (event.joint || event.public) && !event.hiden);
    this.newEvent = [Events[2]]
    this.currentEvents = filter(Events, { past: false });
    this.PastEvents = filter(Events, { past: true });
    this.myReminds = filter(Events, { reminds: true });
  }
}
