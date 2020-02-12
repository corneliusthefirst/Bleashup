//import { observable, action } from "mobx";
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
import request from "../services/requestObjects";

export default class events {
  constructor() {
    /*storage.remove({
      key: 'Events'
    });*/
    console.warn("constructor called")

    this.readFromStore().then(Events => {
      let i = 0
      forEach(Events, (Event) => {
        Events[i].hiden = false
        if (i == Events.length - 1) {
          if (Events) {
            this.setProperties(Events, true);
          }
        }
        i++
      })
    });
  }
  /*@observable*/ currentEvents = [];
  /*@observable*/ pastEvents = [];
  /*@observable*/ events = []
  /*@observable*/ myReminds = [];
  storeAccessKey = {
    key: "Events",
    autoSync: true
  };
  saveKey = {
    key: "Events",
    data: []
  };
  /*@action*/ addEvent(NewEvent) {
    if (NewEvent == 'no_such_key') {
      resolve()
    } else {
      NewEvent.updated_at = moment().format()
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
  }
  /*@action*/ delete(EventID) {
    return new Promise((resolve, rejec) => {
      this.readFromStore().then(Events => {
        Events = reject(Events, { id: EventID })
        EventID === "newEventId" ? Events.unshift(request.Event()) : null
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, false);
          resolve("ok")
        })

      })
    })
  }
  /*@action*/ hide(EventID) {
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
  /*@action*/ updateNotes(eventID, Notes) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: eventID })
        Events[index].notes = Notes
        Events[index].updated_at = moment().format();
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, false)
          resolve(Events[index]);
        })
      })
    })
  }
  /*@action*/ markAsSeen(EventID) {
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
  /*@action*/ markAsCalendared(EventID, id, alarms) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Events) => {
        let index = findIndex(Events, { id: EventID });
        Events[index].calendared = true
        Events[index].calendar_id = id
        Events[index].alarms = alarms
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
  /*@action*/ markAsConfigured(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Events) => {
        let index = findIndex(Events, { id: EventID });
        Events[index].configured = true
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
  /*@action*/ loadCurrentEvent(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore()
        .then(Events => {
          let event = find(Events, { id: EventID });
          if (!event) {
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
            resolve(event)
          }
        })
    });
  }
  /*@action*/ getPaticipants(eventID) {
    return new Promise((resolve, reject) => {
      this.loadCurrentEvent(eventID).then(event => {
        resolve(event.participant)
      })
    })
  }
  /*@action*/ loadEvents() {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(events => {
        this.setProperties(events, true);
        resolve()
      })
    })
  }
  /*@action*/ loadCurrentEvents() {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let CurrentEvent = filter(Events, { past: false });
        resolve(CurrentEvent);
      });
    });
  }
  /*@action*/ loadPastEvents() {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let PastEvents = filter(Events, { past: true });
        resolve(PastEvents);
      });
    });
  }
  /*@action*/ changToPastEvent(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        if (Events.length !== 0) {
          let index = findIndex(Events, { id: EventID });
          Events[index].past = true;
          Events[index].updated_at = moment().format();
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
  /*@action*/ RescheduleEvent(Reschedule) {
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
          Events[index].updated_at = moment().format();
          this.saveKey.data = Events;
          storage.save(this.saveKey).then(() => {
            this.setProperties(this.saveKey.data, inform);
            resolve();
          });
        }
      });
    });
  }
  /*@action*/ removeEvent(EventID, inform) {
    return new Promise((resolve, Reject) => {
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
  /*@action*/ updateEventParticipant(EventID, newParticipant, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        let index = findIndex(Events[eventIndex].participant, {
          phone: newParticipant.phone
        });
        Events[eventIndex].participant[index] = newParticipant;
        if (inform) {
          Events[eventIndex].participant_update = true;
          Events[eventIndex].updated = true;
        }
        Events[eventIndex].updated_at = moment().format();
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve(Events[eventIndex]);
        });
      });
    });
  }
  /*@action*/ addParticipant(EventID, Participant, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        if (eventIndex >= 0) {
          Events[eventIndex].participant[Events[eventIndex].participant.length] = Participant;
          Events[eventIndex].participant = uniqBy(Events[eventIndex].participant, "phone")
          if (inform) {
            Events[eventIndex].participant_added = true;
            Events[eventIndex].updated = true;
            Events[eventIndex].updated_at = moment().format();
            Events[eventIndex].joint = true
          }
          else Events[eventIndex].joint = true;
          this.saveKey.data = Events;
          storage.save(this.saveKey).then(() => {
            this.setProperties(this.saveKey.data, inform);
            resolve();
          });
        } else {
          serverEventListener.GetData(EventID).then(event => {
            event.participant[event.participant.length] = Participant;
            event.participant = uniqBy(event.participant, "phone")
            if (inform) {
              event.participant_added = true;
              event.updated = true;
              event.updated_at = moment().format();
              event.joint = true
            }
            else event.joint = true;
            this.addEvent(event).then(() => {
              resolve(event)
            })
          }).catch(error => {
            serverEventListener.socket.write = undefined
            console.error(error, "in load events")
            reject(error)
          })
        }
      });
    });
  }
  /*@action*/ removeParticipant(EventID, Phone, inform) {
    return new Promise((resolve, rejec) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        Events[eventIndex].participant = reject(Events[eventIndex].participant,
          ele => findIndex(Phone, e => ele.phone === e) >= 0);
        if (inform) {
          Events[eventIndex].participant_removed = true;
          Events[eventIndex].updated = true
        }
        else Events[eventIndex].left = true;
        Events[eventIndex].updated_at = moment().format();
        this.saveKey.data = Events
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve(Events[eventIndex]);
        });
      });
    });
  }
  /*@action*/ updatePeriod(EventID, NewPeriod, inform) {
    console.warn(NewPeriod)
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        let cid = JSON.stringify({ cal_id:Events[eventIndex].calendar_id})
        Events[eventIndex].period = NewPeriod;
        if (!NewPeriod || (NewPeriod && !NewPeriod.includes("T")))
          Events[eventIndex].calendared = false
          Events[eventIndex].calendar_id = null
        if (inform) {
          Events[eventIndex].period_updated = true;
          Events[eventIndex].updated = true;
        }
        Events[eventIndex].updated_at = moment().format();
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve(Events[eventIndex],cid);
        });
      });
    });
  }
  /*@action*/ updateLocation(EventID, NewLocation, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        Events[eventIndex].location = { string: NewLocation };
        if (inform) {
          Events[eventIndex].location_updated = true;
          Events[eventIndex].updated = true
        }
        Events[eventIndex].updated_at = moment().format();
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve(Events[eventIndex]);
        });
      });
    });
  }
  /*@action*/ updateBackground(EventID, NewBackground, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        Events[eventIndex].background = NewBackground;
        if (inform) {
          Events[eventIndex].background_updated = true;
          Events[eventIndex].updated = true;
        }
        Events[eventIndex].updated_at = moment().format();
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  /*@action*/ updateRecurrency(EventID, RecurrentUpdate, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID })
        Events[index].recurrent = RecurrentUpdate.recurrent
        Events[index].recurrence = RecurrentUpdate.recurrence
        Events[index].frequency = RecurrentUpdate.frequency
        Events[index].interval = RecurrentUpdate.interval
        if (inform) {
          Events[index].title_updated = true;
          Events[index].updated = true;
        }
        Events[index].updated_at = moment().format();
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve(Events[index]);
        });
      })
    })
  }
  /*@action*/ updateTitle(EventID, NewTitle, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        Events[eventIndex].about.title = NewTitle;
        if (inform) {
          Events[eventIndex].title_updated = true;
          Events[eventIndex].updated = true;
        }
        Events[eventIndex].updated_at = moment().format();
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve(Events[eventIndex]);
        });
      });
    });
  }
  /*@action*/ openClose(EventID, NewState, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        Events[eventIndex].closed = NewState;
        if (inform) {
          Events[eventIndex].title_updated = true;
          Events[eventIndex].updated = true;
        }
        Events[eventIndex].updated_at = moment().format();
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  /*@action*/ updateCalendarID(EventID, newID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        Events[eventIndex].calendar_id = newID ? newID : null;
        if (inform) {
          Events[eventIndex].updated = true;
        }
        Events[eventIndex].updated_at = moment().format();
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }

  /*@action*/ updateRecursiveFrequency(EventID, recursiveFrequency, inform) {
    console.warn(recursiveFrequency, "recurfreq");
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { id: EventID });
        let eventIndex = findIndex(Events, { id: EventID });
        console.warn(Event, "Event");
        Event.recursiveFrequency = recursiveFrequency;
        if (inform) {
          Event.recursiveFrequency_updated = true;
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

  /*@action*/ updateDescription(EventID, NewDescription, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let eventIndex = findIndex(Events, { id: EventID });
        Events[eventIndex].about.description = NewDescription;
        if (inform) {
          Events[eventIndex].description_updated = true;
          Events[eventIndex].updated = true;
        }
        Events[eventIndex].updated_at = moment().format();
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve(Events[eventIndex]);
        });
      });
    });
  }
  /*@action*/ publishEvent(EventID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        Events[index].public = true;
        //Events[index].updated_at = moment().format();
        // if (inform) Events[index].updated = true
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }

  /*@action*/ unpublishEvent(EventID, inform) {
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
  /*@action*/ likeEvent(EventID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        Events[index].likes += 1;
        Events[index].updated_at = moment().format();
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

  /*@action*/ unlikeEvent(EventID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        Events[index].likes -= 1;
        Events[index].liked = false
        Events[index].updated_at = moment().format();
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  /*@action*/ addMustToContribute(EventID, ContributionID, inform) {
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
  /*@action*/ removeFromMustContribute(EventID, ContributionID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        Events[index].must_contribute = dropWhile(
          Events[index].must_contribute, element => element == ContributionID
        );
        Events[index].updated_at = moment().format();
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
  /*@action*/ addVote(EventID, VoteID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, {
          id: EventID
        });
        if (index >= 0) {
          if (Events[index].votes.length !== 0)
            Events[index].votes = uniq(Events[index].votes.concat([VoteID]));
          else Events[index].votes = [VoteID]
          Events[index].updated_at = moment().format();
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
  /*@action*/ removeVote(EventID, VoteID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
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
      });
    });
  }
  /*@action*/ addContribution(EventID, ContributionID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        if (index >= 0) {
          if (Events[index].contributions.length !== 0)
            Events[index].contributions = uniq(
              Events[index].contributions.concat([ContributionID])
            );
          else Events[index].contributions = [ContributionID]
          Events[index].updated_at = moment().format();
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
  /*@action*/ removeContribution(EventID, ContributionID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        Events[index].contributions = dropWhile(
          Events[index].contributions,
          element => element == ContributionID
        );
        Events[index].updated_at = moment().format();
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

  removeHighlight(EventID, HighlightID, inform) {
    console.warn(HighlightID, "remove highlight 1");
    return new Promise((resolve, rejectPromise) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        console.warn(index, "index1");
        Events[index].highlights = dropWhile(
          Events[index].highlights,
          element => element == HighlightID
        );
        console.warn(Events, "event with deleted object 1");
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

  /*@action*/ addHighlight(EventID, HighlightID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, {
          id: EventID
        });
        if (index >= 0) {
          if (Events[index].highlights && Events[index].highlights.length > 0)
            Events[index].highlights.unshift(HighlightID);
          else Events[index].highlights = [HighlightID]
          if (inform) {
            Events[index].highlight_added = true;
            Events[index].updated = true
            Events[index].updated_at = moment().format();
          }
          this.saveKey.data = Events;
          storage.save(this.saveKey).then(() => {
            this.setProperties(this.saveKey.data, inform);
            resolve();
          });
        }
        else {
          let EID = requestObject.EventID();
          EID.event_id = EventID;
          tcpRequest.getCurrentEvent(EID, EventID).then(JSONData => {
            serverEventListener.get_data(JSONData).then(E => {
              if (E) {
                this.addEvent(E).then(() => {
                  this.addHighlight(EventID, HighlightID, true).then(() => {
                    resolve()
                  })
                });
              } else {
                reject()
              }
            });
          });
        }
      });
    });
  }
  /*@action*/ addRemind(EventID, RemindID, inform) {
    return new Promise((resolve, rejectPromise) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, {
          id: EventID
        });
        if (index >= 0) {
          if (Events[index].reminds && Events[index].reminds.length !== 0)
            Events[index].reminds = uniq(Events[index].reminds.concat([RemindID]));
          else Events[index].reminds = [RemindID];
          if (inform) {
            Events[index].remind_added = true;
            Events[index].updated = true
            Events[index].updated_at = moment().format();
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

  /*@action*/ removeRemind(EventID, RemindID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        Events[index].reminds = dropWhile(Events[index].reminds,
           element => element !== RemindID);
        if (inform) {
          Events[index].remind_removed = true;
          Events[index].updated = true;
          Events[index].updated_at = moment().format();
        }
        this.saveKey.data = Events;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  /*@action*/ joinEvent(EventID, phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID });
        let participant = find(Events[index].participant, { phone: phone })
        if (participant) {
          Events[index].joint = true;
          this.saveKey.data = Events;
          storage.save(this.saveKey).then(() => {
            this.setProperties(this.saveKey.data, false);
            resolve();
          });
        } else {
          reject("not participant yet")
        }
      });
    });
  }
  /*@action*/ leaveEvent(EventID) {
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
        //Events[index].updated_at = moment().format();
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
  addEventCommitee(EventID, CommiteeID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID })
        !Events[index].commitee || Events[index].commitee.length <= 0 ? Events[index].commitee = [CommiteeID] :
          Events[index].commitee.unshift(CommiteeID)
        Events[index].updated_at = moment().format();
        this.saveKey.data = Events
        storage.save(this.saveKey).then(() => {
          resolve("ok")
        })
      })
    })
  }

  removeCommitee(EventID, ID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let index = findIndex(Events, { id: EventID })
        Events[index].commitee = dropWhile(Events[index].commitee, (ele) => ele === ID)
        Events[index].updated_at = moment().format();
        this.saveKey.data = Events
        storage.save(this.saveKey).then(() => {
          resolve("ok")
        })
      })
    })
  }

  /*@action*/ resetEvent(EventID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Events => {
        let Event = find(Events, { id: EventID });
        let eventIndex = findIndex(Events, { id: EventID });
        Event = request.Event();
        Event.id = EventID;

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














  /*@observable*/ highlightData = [
    {
      id: "1",
      creator: "",
      event_id: "",
      created_at: "",
      updated_at: "",
      title: "maitre gims",
      description: "ajjsg agsgsagj sahaskkh akdajaj asjaslfjal ashs",
      url: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Cornish_cream_tea_2.jpg"
    },
    {
      id: "2",
      creator: "",
      event_id: "",
      created_at: "",
      updated_at: "",
      title: "cornelius",
      description: "ajjsg agsgsagj sahaskkh akdajaj asjaslfjal ashs",
      url: "https://cdn.stocksnap.io/img-thumbs/960w/KUGIZHT2VX.jpg"
    },
    {
      id: "3",
      creator: "",
      event_id: "",
      created_at: "",
      updated_at: "",
      title: "giles",
      description: "ajjsg agsgsagj sahaskkh akdajaj asjaslfjal ashs",
      url: "https://cdn.stocksnap.io/img-thumbs/960w/KUGIZHT2VX.jpg"

    },
    {
      id: "4",
      creator: "",
      event_id: "",
      created_at: "",
      updated_at: "",
      title: "Jugal",
      description: "ajjsg agsgsagj sahaskkh akdajaj asjaslfjal ashs",
      url: "https://cdn.stocksnap.io/img-thumbs/960w/KUGIZHT2VX.jpg"
    },
    {
      id: "5",
      creator: "",
      event_id: "",
      created_at: "",
      updated_at: "",
      title: "Santers",
      description: "ajjsg agsgsagj sahaskkh akdajaj asjaslfjal ashs",
      url: "https://cdn.stocksnap.io/img-thumbs/960w/KUGIZHT2VX.jpg"
    },
    {
      id: "6",
      creator: "",
      event_id: "",
      created_at: "",
      updated_at: "",
      title: "Hken",
      description: "ajjsg agsgsagj sahaskkh akdajaj asjaslfjal ashs",
      url: "https://cdn.stocksnap.io/img-thumbs/960w/KUGIZHT2VX.jpg"

    }

  ]

  /*@observable*/ NewHighlightData = []



}
