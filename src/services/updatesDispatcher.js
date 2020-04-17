import stores from "../stores";
import GState from "../stores/globalState";
import Getter from "./Getter"
import requestObjects from "./requestObjects";
import tcpRequestData from "./tcpRequestData";
import emitter from "./eventEmiter";
import serverEventListener from "./severEventListener"
import { find, findIndex, drop, reject, forEach } from "lodash";
import moment from "moment"
import uuid from 'react-native-uuid';
import CalendarServe from './CalendarService';
import { format } from './recurrenceConfigs';
import request from "./requestObjects";
import MainUpdater from './mainUpdater';
class UpdatesDispatcher {
  constructor() { }
  dispatchUpdates(updates) {
    if (updates.length <= 0) {
      console.warn("finishing ...")
      return "ok";
    } else {
      let update = updates.pop()
      this.dispatchUpdate(update).then(() => { 
        console.warn("dipatching ", update)
        this.dispatchUpdates(updates) 
      });
    }

  }
  dispatchUpdate(update) {
    return this.UpdatePossibilities[update.update](update);
  }
  infomCurrentRoom(Change, commitee, event_id) {
    emitter.emit(`event_updated_${event_id}`, Change, commitee)
    if (Change.changed.toLowerCase().includes('post')) {
      emitter.emit(`refresh-highlights_${event_id}`)
    }
  }
  applyToAllCommitees(ids, participant, e) {
    if (ids.length <= 0) {
      return "done"
    } else {
      let id = ids.pop()
      stores.CommiteeStore.replaceCommiteeParticipant(id, participant).then((c) => {
        this.applyToAllCommitees(ids, participant, e)
      })
    }
  }
  UpdatePossibilities = {
    title: update => {
      return new Promise((resolve, reject) => {
        stores.Events.updateTitle(update.event_id, update.new_value, true).then((Eve) => {
          let Change = {
            id: uuid.v1(),
            updated: "title",
            event_id: update.event_id,
            updater: update.updater,
            title: "Updates On Main Activity",
            changed: "Changed The Title Of The Activity to: ",
            new_value: { data: null, new_value: update.new_value },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Eve, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            Eve.calendar_id ? CalendarServe.saveEvent(Eve, Eve.alarms).then(() => {

            }) : null
            GState.eventUpdated = true;
            resolve();
          });
        })
      });
    },

    background: update => {
      return new Promise((resolve, reject) => {
        stores.Events.updateBackground(update.event_id, update.new_value, true).then(() => {
          let Change = {
            id: uuid.v1(),
            title: "Updates On Main Activity",
            updated: "background",
            event_id: update.event_id,
            updater: update.updater,
            changed: update.new_value ? "Changed The Background Photo Of The Main Activity" :
              "Removed The Activity Background Photo",
            new_value: { data: null, new_value: update.new_value },
            date: update.date,
            time: update.time
          };
          this.infomCurrentRoom(Change, Change, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            GState.eventUpdated = true;
            resolve();
          });
        });
      });
    },

    description: update => {
      return new Promise((resolve, reject) => {
        stores.Events.updateDescription(
          update.event_id,
          update.new_value,
          true
        ).then((Eve) => {
          let Change = {
            id: uuid.v1(),
            title: "Updates On Main Activity",
            updated: "description",
            updater: update.updater,
            event_id: update.event_id,
            changed: update.new_value ? "Changed The Description Of The Activity To: " : "Removed The Description Of The Activity",
            new_value: { data: null, new_value: update.new_value },
            date: update.data,
            time: null
          }
          this.infomCurrentRoom(Change, Eve, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            GState.eventUpdated = true;
            resolve('ok')
          })
        });
      });
    },
    period: update => {
      return new Promise((resolve, reject) => {
        stores.Events.updatePeriod(update.event_id, update.new_value, true).then((Eve, calID) => {
          let Change = {
            id: uuid.v1(),
            title: "Updates On Main Activity",
            updated: "period",
            updater: update.updater,
            event_id: update.event_id,
            changed: update.new_value ? "Changed The Scheduled Time Of The Activity To: " : "Removed The Date Of The Activity",
            new_value: { data: null, new_value: update.new_value ? moment(update.new_value).format("dddd, MMMM Do YYYY, h:mm:ss a") : null },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Eve, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            Eve.calendar_id ? CalendarServe.saveEvent({ ...Eve, calendar_id: JSON.parse(calID).cal_id }, Eve.alarms).then(() => {

            }) : null
            GState.eventUpdated = true;
            resolve();
          });
        })
      });

    },
    closed: update => {
      return new Promise((resolve, reject) => {
        stores.Events.openClose(update.event_id, update.new_value, true).then(() => {
          let Change = {
            id: uuid.v1(),
            title: "Updates On Main Activity",
            updated: "close",
            event_id: update.event_id,
            updater: update.updater,
            changed: update.new_value == false ? 'Opened' + " The Main Activity" : 'Closed' + " The Main Activity",
            new_value: { data: null, new_value: null },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Change, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            GState.eventUpdated = true
            resolve("ok")
          })
        })
      })
    },
    notes: update => {
      return new Promise((resolve, reject) => {
        stores.Events.updateNotes(update.event_id, update.new_value).then((Eve) => {
          let Change = {
            id: uuid.v1(),
            title: "Updates on Main Activity",
            updated: "notes",
            event_id: update.event_id,
            changed: "Changed The Notes of the Activity",
            updater: update.updater,
            new_value: { data: null, new_value: update.new_value },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Eve, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            Eve.calendar_id ? CalendarServe.saveEvent(Eve, Eve.alarms).then(() => {

            }) : null
            GState.eventUpdated = true
            resolve('ok')
          })
        })
      })
    },
    string: update => {
      return new Promise((resolve, reject) => {
        stores.Events.updateLocation(
          update.event_id,
          update.new_value,
          true
        ).then((Eve) => {
          let Change = {
            id: uuid.v1(),
            title: "Updates On Main Activity",
            updated: "location",
            updater: update.updater,
            event_id: update.event_id,
            changed: update.new_value ? "Changed The Location Of The Activity To: " : "Removed The Location Of The Activity",
            new_value: { data: null, new_value: update.new_value },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Eve, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            GState.eventUpdated = true;
            resolve('ok')
          })
        });
      });
    },
    calendar_id: update => {
      return new Promise((resolve, reject) => {
        stores.Events.updateCalendarID(update.event_id, update.new_value, true).then(() => {
          let Change = {
            id: uuid.v1(),
            title: "Updates On Main Activity",
            updated: "calendar_id",
            updater: update.updater,
            event_id: update.event_id,
            changed: "Changed The Calendar The Main Activity To",
            new_value: { data: null, new_value: update.new_value },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Change, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            GState.eventUpdated = true
            resolve("ok")
          })
        })
      })
    },
    who_can_manage: update => {
      return new Promise((resolve, reject) => {
        stores.Events.updateWhoCanManage(update.event_id, update.new_value, true).then(Eve => {
          let Change = {
            id: uuid.v1(),
            title: "Updates On Main Activity",
            updated: "who_can_update",
            event_id: update.event_id,
            updater: update.updater,
            changed: "Changed The Manage Priviledges of The Activity To ...",
            new_value: { data: null, new_value: update.new_value },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Eve, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            resolve()
          })
        })
      })
    },
    recurrency_config: update => {
      return new Promise((resolve, reject) => {
        stores.Events.updateRecurrency(update.event_id, update.new_value, true).then((Eve) => {
          let Change = {
            id: uuid.v1(),
            title: "Updates On Main Activity",
            updated: "recurrency",
            event_id: update.event_id,
            updater: update.updater,
            changed: "Changed The Recurrency Configuration of the Activity",
            new_value: { data: null, new_value: update.new_value },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Eve, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            Eve.calendar_id ? CalendarServe.saveEvent(Eve, Eve.alarms).then(() => {

            }) : null
            GState.eventUpdated = true
            resolve("ok")
          })
        })
      })
    },
    published: update => {
      return new Promise((resolve, reject) => {
        stores.Events.isParticipant(update.event_id, stores.LoginStore.user.phone).then(
          status => {
            let EventID = requestObjects.EventID();
            EventID.event_id = update.event_id;
            stores.Events.loadCurrentEvent(update.event_id).then(event => {
              stores.Events.publishEvent(update.event_id, true).then(() => {
                let publisher = {
                  period: {
                    date: update.date,
                    time: update.time
                  },
                  phone: update.updater
                }
                stores.Publishers.addPublisher(update.event_id, publisher).then(() => {
                  let Change = {
                    title: "Change On Main Activity",
                    event_id: update.event_id,
                    changed: "Published The Activity To His/Her Contacts",
                    updater: update.updater,
                    new_value: { data: null, new_value: [update.updater] },
                    date: update.date,
                    time: update.time
                  };
                  this.infomCurrentRoom(Change, update.event_id, update.event_id)
                  stores.ChangeLogs.addChanges(Change).then(() => {
                    GState.eventUpdated = true;
                    resolve();
                  });
                })
              });
            })
          }
        );
      });
    },
    adds : update => {
      return new  Promise((resolve,reject) => {
        MainUpdater.addParticipants(update.event_id,
          update.new_value,
          update.updater,update.updated,
          update.date).then(Change => {
            this.infomCurrentRoom(Change,update.event_id,update.event_id)
            resolve()
        })
      })
    },
    unpublished: update => {
      return new Promise((resolve, reject) => {
        stores.Session.getSession().then(session => {
          stores.Events.isParticipant(update.event_id, session.phone).then(
            stat => {
              if ((state = false)) {
                stores.Events.removeEvent(update.event_id).then(() => {
                  resolve();
                });
              } else {
                let Change = {
                  title: "Update On Main Activity",
                  event_id: update.event_id,
                  changed: "UnPublished The Activity",
                  updater: update.updater,
                  id: uuid.v1(),
                  new_value: { data, new_value: null },
                  date: update.date,
                  time: update.time
                };
                stores.Events.unpublishEvent(update.event_id, true).then(
                  () => {
                    this.infomCurrentRoom(Change, Change, update.event_id)
                    stores.ChangeLogs.addChanges(Change).then(() => {
                      GState.eventUpdated = true;
                      resolve();
                    }
                    );
                  });
              }
            }
          );
        });
      });
    },
    url: update => {
      return new Promise((resolve, reject) => {
        stores.Events.loadCurrentEvent(update.event_id).then(Event => {
          let Change = {
            event_id: update.event_id,
            changed: "New Event Location",
            updater: update.updater,
            old_value: Event.location,
            new_value: {
              string: Event.location.string,
              url: update.new_value
            },
            date: update.date,
            time: update.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.updateLocation(
              update.event_id,
              {
                string: Event.location.string,
                url: update.new_value
              },
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    host: update => {
      return new Promise((resolve, reject) => {
        stores.Events.loadCurrentEvent(update.event_id).then(Event => {
          let Participant = find(Event.participants, {
            phone: update.addedphone
          });
          Participant.host = update.new_value;
          stores.Events.updateEventParticipant(
            update.event_id,
            Participant,
            true
          ).then(() => {
            GState.eventUpdated = true;
            resolve();
          });
        });
      });
    },
    master: update => {
      return new Promise((resolve, reject) => {
        stores.Events.loadCurrentEvent(update.event_id).then(Event => {
          let Participant = find(Event.participant, {
            phone: update.addedphone
          });
          if (Participant) {
            let newParti = { ...Participant, master: update.new_value }
            stores.Events.updateEventParticipant(
              update.event_id,
              Participant,
              true
            ).then((newEvent) => {
              //console.warn(newEvent.commitee)
              this.applyToAllCommitees(newEvent.commitee, newParti, newEvent)
              let Change = {
                title: "Updates On Main Activity",
                event_id: update.event_id,
                changed: "Changed Participant(s) Master Status",
                updater: update.updater,
                old_value: Participant.master,
                new_value: { data: null, new_value: [newParti] },
                date: update.date,
                time: update.time
              };
              this.infomCurrentRoom(Change, newEvent, update.event_id)
              stores.ChangeLogs.addChanges(Change).then(() => {
                GState.eventUpdated = true;
                // console.warn(e.commitee)
                resolve();
              });
            });
          } else {
            console.warn('participant does not exists');
            reject()
          }
        })
      });
    },
    removed: update => {
      return new Promise((resolve, reject) => {
        stores.Events.removeParticipant(
          update.event_id,
          update.new_value,
          true
        ).then((Event) => {
          let Change = {
            title: "Updates on Main Activity",
            event_id: update.event_id,
            changed: update.updater === update.new_value ? "Left The Activity" : "Removed Participant(s) From Main Activity",
            updater: update.updater,
            new_value: { data: null, new_value: Array.isArray(update.new_value) ? update.new_value : [update.new_value] },
            date: update.date,
            time: update.time
          };
          this.infomCurrentRoom(Change, Event, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            GState.eventUpdated = true;
            resolve();
          });
        });
      });
    },
    likes: update => {
      return new Promise((resolve, reject) => {
        switch (update.addedphone) {
          case "like":
            stores.Likes.like(update.event_id, update.updater, true).then(() => {
              stores.Events.likeEvent(update.event_id, true).then(() => {
                GState.eventUpdated = true;
                emitter.emit(`liked_${update.event_id}`) //TODO this signal is beign listen to in the Module current_events>public_event>likes
                resolve();
              });
            });
            break;
          case "like_vote":
            stores.Likes.like(updated.new_value, update.updater, true).then(() => {
              stores.Votes.likeVote(update.new_value, true).then(() => {
                GState.eventUpdated = true;
                resolve();
              });
            });
            break;
          case "like_contribution":
            stores.Likes.like(update.new_value, update.updater).then(() => {
              stores.Contributions.like(update.new_value, true).then(() => {
                GState.eventUpdated = true;
                resolve();
              });
            });
            break;
        }
      });
    },
    unlikes: update => {
      return new Promise((resolve, reject) => {
        switch (update.addedphone) {
          case "unlike":
            stores.Likes.unlike(update.new_value, update.updater, true).then(() => {
              stores.Events.unlikeEvent(update.event_id).then(() => {
                GState.eventUpdated = true;
                emitter.emit(`liked_${update.event_id}`) //TODO this signal is beign listen to in the Module current_events>public_event>likes
                resolve();
              });
            });
            break;
          case "unlike_vote":
            stores.Likes.unlike(update.new_value, update.updater).then(() => {
              stores.Votes.unlikeVote(update.new_value).then(() => {
                GState.eventUpdated = true;
                resolve();
              });
            });
            break;
          case "unlike_contribution":
            stores.Likes.unlike(update.new_value, update.updater).then(() => {
              stores.Contributions.unlike(update.new_value).then(() => {
                GState.eventUpdated = true;
                resolve();
              });
            });
            break;
        }
      });
    },

    must_contribute_update: update => {
      return new Promise((resolve, reject) => {
        stores.Events.loadCurrentEvent(update.event_id).then(Event => {
          let Change = {
            event_id: update.event_id,
            changed: "New Must Contribute Amount",
            updater: update.updater,
            old_value: Event.must_contribute,
            new_value: update.new_value,
            date: update.date,
            time: update.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.addMustToContribute(
              update.event_id,
              update.new_value,
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    new_contribution: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "New Contriburion",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          let requestObject = requestObjects.CID();
          requestObject.contribution_id = update.new_value;
          let requestData = tcpRequestData
            .getContribution(requestObject)
            .then(JSONData => {
              Getter.get_data(JSONData).then(Contribution => {
                stores.Contributions.addContribution(Contribution).then(() => {
                  stores.Events.addContribution(
                    Contribution.event_id,
                    Contribution.id,
                    true
                  ).then(() => {
                    stores.Contributions.readFromStore().then(Contributions => {
                      GState.eventUpdated = true;
                      stores.Events.changeUpdatedStatus(
                        update.event_id,
                        "contribution_updated",
                        true
                      ).then(() => {
                        GState.eventUpdated = true;
                        resolve();
                      });
                    });
                  });
                });
              });
            });
        });
      });
    },

    contribution_state: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "New Contribution State",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          switch (update.new_value.new_state) {
            case "open":
              stores.Contributions.openContribution(
                update.new_value.contribution_id,
                true
              ).then(() => {
                GState.eventUpdated = true;
                resolve();
              });
              break;
            case "closed":
              stores.Contributions.closeContribution(
                update.new_value.contribution_id
              ).then(() => {
                stores.Events.changeUpdatedStatus(
                  update.event_id,
                  "contribution_updated",
                  true
                ).then(() => {
                  GState.eventUpdated = true;
                  resolve();
                });
              });
          }
        });
      });
    },
    contribution_period: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "New Contribution Period",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Contributions.updateContributionPeriod(
            {
              id: update.new_value.contribution_id,
              period: update.new_value.new_period
            },
            true
          ).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "contribution_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    contribution_published: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Contribution Published",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Contributions.publishContribution(update.new_value).then(
            () => {
              stores.Events.changeUpdatedStatus(
                update.event_id,
                "contribution_updated",
                true
              ).then(() => {
                GState.eventUpdated = true;
                resolve();
              });
            }
          );
        });
      });
    },

    contribution_title_updated: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Contribution Title Updated",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Contributions.updateContributionTitle(
            {
              id: update.new_value.contribution_id,
              title: update.new_value.title
            },
            true
          ).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "contribution_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    contribution_description_updated: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Contribution Description Changed",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.Contributions.updateDescription(
          {
            id: update.new_value.contribution_id,
            description: update.new_value.description
          },
          true
        ).then(() => {
          stores.Events.changeUpdatedStatus(
            update.event_id,
            "contribution_updated",
            true
          ).then(() => {
            GState.eventUpdated = true;
            resolve();
          });
        });
      });
    },

    added_contribution_mean: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "New Contribution Mean",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Contributions.AddContributionMean(
            update.new_value.contribution_id,
            update.new_value.new_mean,
            true
          ).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "contribution_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    contribution_mean_removed: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Removed Contribution Mean",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Contributions.removeContributionMean(
            update.new_value.contribution_id,
            update.new_value.mean_name,
            true
          ).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "contribution_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    contribution_amount_updated: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Contribution Amount Changed",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Contributions.updateContributionAmount(
            {
              id: update.new_value.contribution_id,
              amount: update.new_value.amount
            },
            true
          ).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "contribution_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    contribution_mean_name_updated: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Contribution Mean Name Changed",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Contributions.updateContributionMeanName(
            update.new_value.contribution_id,
            update.new_value.mean_name,
            update.new_value.new_name,
            true
          ).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "contribution_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },

    contribution_mean_credentials_updated: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Contribution Mean Credential changed",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Contributions.updateContributionMeanCredential(
            update.new_value.contribution_id,
            update.new_value.mean_name,
            update.new_value.new_credential,
            true
          ).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "contribution_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    new_highlight: update => {
      return new Promise((resolve, reject) => {
        let RequestObject = requestObjects.HID();
        RequestObject.h_id = update.new_value;
        tcpRequestData.getHighlight(RequestObject, update.new_value + "highlight").then(JSONData => {
          serverEventListener.sendRequest(JSONData, update.new_value + "highlight").then(Highlight => {
            if (Highlight.data !== 'empty' && Highlight.data.length > 0) {
              Highlight.data = Array.isArray(Highlight.data) ? Highlight.data[0] : Highlight.data
              stores.Highlights.addHighlight(Highlight.data).then(() => {
                stores.Events.addHighlight(
                  Highlight.data.event_id,
                  Highlight.data.id
                ).then(() => {
                  let Change = {
                    id: uuid.v1(),
                    title: "Updates On Main Activity",
                    updated: "add_highlight",
                    event_id: update.event_id,
                    updater: update.updater,
                    changed: "Added A New Post To The Activity",
                    new_value: { data: null, new_value: Highlight.data },
                    date: update.date,
                    time: null
                  }
                  this.infomCurrentRoom(Change, Highlight, update.event_id)
                  stores.ChangeLogs.addChanges(Change).then(res => {
                    GState.newHightlight = true;
                    GState.eventUpdated = true;
                    console.warn('resolving add highlight', res);
                    resolve("ok")
                  })
                });
              });
            } else {
              //!! heyyy case that highlight doesn't exists please think of handling this.
              //!! a case where this scenario can occur is when the user add a highlight and imediately deletes it 
              //!! such that when offline users will received their updates,they will be receiving of and 
              //!! that doesn't exists. 
            }
          });
        });
      });
    },

    highlight_update_description: update => {
      return new Promise((resolve, reject) => {
        stores.Highlights.updateHighlightDescription(
          {
            id: update.new_value.highlight_id,
            description: update.new_value.new_description
          },
          true
        ).then((Highlight) => {
          let Change = {
            id: uuid.v1(),
            title: `Update On ${Highlight.title} Post`,
            updated: "highlight_decription",
            event_id: update.event_id,
            updater: update.updater,
            changed: update.new_value.new_description ? `Changed The Content of ${Highlight.title} Post` :
              `Removed The Content of ${Highlight.title}`,
            new_value: { data: null, new_value: update.new_value.new_description },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Highlight, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(res => {
            GState.eventUpdated = true;
            resolve("ok")
          })
          /* stores.Events.changeUpdatedStatus(
             update.event_id,
             "highlight_updated",
             true
           ).then(() => {*/
        });
        //});
      });
    },
    highlight_update_url: update => {
      return new Promise((resolve, reject) => {
        stores.Highlights.updateHighlightUrl(
          {
            id: update.new_value.highlight_id,
            url: update.new_value.new_url
          },
          true
        ).then((Highlight) => {
          let Change = {
            id: uuid.v1(),
            title: `Update On ${Highlight.title} Post`,
            updated: "highlight_url",
            event_id: update.event_id,
            updater: update.updater,
            changed: `Changed The Media specifications of ${Highlight.title} Post`,
            new_value: { data: null, new_value: update.new_value.new_url },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Highlight, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(res => {
            GState.eventUpdated = true;
            resolve("ok")
          })
        });
      });
    },
    highlight_update_title: update => {
      return new Promise((resolve, reject) => {
        stores.Highlights.updateHighlightTitle(
          {
            id: update.new_value.highlight_id,
            title: update.new_value.new_title
          },
          true
        ).then((HighlightJS) => {
          Highlight = JSON.parse(HighlightJS)
          let Change = {
            id: uuid.v1(),
            title: `Update On ${Highlight.title} Post`,
            updated: "highlight_title",
            event_id: update.event_id,
            updater: update.updater,
            changed: update.new_value.new_title ? `Changed The Title of ${Highlight.title} Post to ...` : `Removed The Title of ${Highlight.title} Post`,
            new_value: { data: null, new_value: update.new_value.new_title },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Highlight, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(res => {
            GState.eventUpdated = true;
            resolve("ok")
          })
        });
      });
    },
    highlight_public_state: update => {
      return new Promise((resolve, reject) => {
        stores.Highlights.updateHighlightPublicState(update.new_value).then((highlight) => {
          let Change = {
            id: uuid.v1(),
            title: `Update On ${highlight.title} Post`,
            updated: "highlight_public_state",
            event_id: update.event_id,
            updater: update.updater,
            changed: `Changed The Privacy Level Of ${highlight.title} Post to`,
            new_value: {
              data: null,
              new_value: update.new_value.public_State
            },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, highlight, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            GState.eventUpdated = true
            resolve("ok")
          })
        })
      })
    },
    highlight_deleted: update => {
      return new Promise((resolve, reject) => {
        stores.Highlights.removeHighlight(update.new_value).then((Highlight) => {
          stores.Events.removeHighlight(
            update.event_id,
            update.new_value
          ).then(() => {
            let Change = {
              id: uuid.v1(),
              title: `Update On Main Activity`,
              updated: "highlight_delete",
              event_id: update.event_id,
              updater: update.updater,
              changed: `Deleted ${Highlight.title} Post`,
              new_value: { data: null, new_value: Highlight },
              date: update.date,
              time: null
            }
            this.infomCurrentRoom(Change, Highlight, update.event_id)
            stores.ChangeLogs.addChanges(Change).then(res => {
              GState.eventUpdated = true;
              resolve("ok")
            })
          });
        });
      });
    },
    restored_highlight: update => {
      return new Promise((resolve, reject) => {
        stores.Highlights.addHighlight(update.new_value).then(() => {
          stores.Events.addHighlight(update.event_id, update.new_value.id).then(() => {
            let Change = {
              id: uuid.v1(),
              title: `Update On Main Activity`,
              updated: "highlight_restored",
              event_id: update.event_id,
              updater: update.updater,
              changed: `Restored ${update.new_value.title} Post`,
              new_value: { data: null, new_value: update.new_value },
              date: update.date,
              time: null
            }
            this.infomCurrentRoom(Change, update.new_value, update.event_id)
            stores.ChangeLogs.addChanges(Change).then(res => {
              GState.eventUpdated = true;
              resolve("ok")
            })
          })
        })
      })
    },
    vote_added: update => {
      return new Promise((resolve, reject) => {
        let VoteID = requestObjects.VID();
        VoteID.vote_id = update.new_value;
        tcpRequestData.getVote(VoteID, update.new_value + "_get").then(JSONData => {
          serverEventListener.sendRequest(JSONData, update.new_value + '_get').then(Vote => {
            if (Vote.data && Vote.data !== 'empty') {
              let vote = Array.isArray(Vote.data) ? Vote.data[0] : Vote.data
              console.warn(vote)
              stores.Votes.addVote(vote).then(() => {
                stores.Events.addVote(vote.event_id, vote.id).then(() => {
                  stores.CommiteeStore.imIInThisCommttee(stores.LoginStore.user.phone,
                    vote.committee_id).then((state) => {
                      console.warn(state)
                      if (state || vote.published === 'public') {
                        let Change = {
                          id: uuid.v1(),
                          event_id: update.event_id,
                          updated: 'new_vote',
                          changed: `Added ${vote.title} Vote`,
                          title: `Update On Main Activity`,
                          updater: update.updater,
                          new_value: { data: null, new_value: vote.title },
                          date: update.date,
                          time: null
                        };
                        stores.ChangeLogs.addChanges(Change).then(() => {
                          this.infomCurrentRoom(Change, vote, update.event_id)
                          resolve()
                        })
                      } else {
                        resolve()
                      }
                    })
                  GState.newVote = true;
                  GState.eventUpdated = true;
                  resolve();
                });
              });
            } else {
              let vote = { ...request.Vote(), title: 'Deleted Vote', event_id: update.event_id, id: update.new_value }
              stores.Votes.addVote(vote).then(() => {
                stores.Events.addVote(vote.event_id, Vote.id).then(() => {
                })
              })
            }
          });
        });
      });
    },
    vote_deleted: update => {
      return new Promise((resolve, reject) => {
        stores.Votes.removeVote(update.new_value).then((vote) => {
          stores.Events.removeVote(update.event_id, update.new_value).then(
            () => {
              stores.CommiteeStore.imIInThisCommttee(stores.LoginStore.user.phone,
                vote.committee_id).then((state) => {
                  if (state || vote.published === 'public') {
                    let Change = {
                      id: uuid.v1(),
                      event_id: update.event_id,
                      updated: 'vote_deleted',
                      title: `Update On Main Activity`,
                      changed: `Deleted ${vote.title} vote`,
                      updater: update.updater,
                      new_value: { data: null, new_value: vote },
                      date: update.date,
                      time: null
                    };
                    stores.ChangeLogs.addChanges(Change).then(() => {
                      this.infomCurrentRoom(Change, vote, update.event_id)
                      resolve()
                    })
                  } else {
                    resolve()
                  }
                })
            }
          );
        });
      });
    },
    restored_vote: update => new Promise((resolve, reject) => {
      stores.Votes.addVote(update.new_value).then(() => {
        stores.Events.addVote(update.event_id, update.new_value.id).then(() => {
          stores.CommiteeStore.imIInThisCommttee(stores.LoginStore.user.phone, update.new_value.committee_id).then((state) => {
            if (update.published === 'public' || state) {
              let Change = {
                id: uuid.v1(),
                event_id: update.event_id,
                updated: 'vote_restored',
                title: `Update on ${update.new_value.title} vote`,
                changed: `Restored ${update.new_value.title} vote`,
                updater: update.updater,
                new_value: { data: null, new_value: update.new_value.id },
                date: update.date,
                time: null
              };
              stores.ChangeLogs.addChanges(Change).then(() => {
                this.infomCurrentRoom(Change, update.new_value, update.event_id);
                resolve();
              });
            }
            else {
              resolve();
            }
          });
        });
      });
    }),
    vote_published: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Vote Published",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Votes.PublishVote(update.new_value).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "vote_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    vote: update => {
      return new Promise((resolve, reject) => {
        stores.Votes.vote(update.new_value).then((vote) => {
          stores.CommiteeStore.imIInThisCommttee(stores.LoginStore.user.phone,
            vote.committee_id).then((state) => {
              console.warn(state,"--")
              if (state || vote.published === 'public') {
                let Change = {
                  id: uuid.v1(),
                  event_id: update.event_id,
                  updated: 'voted',
                  title: `Update on ${vote.title} vote`,
                  changed: `Voted ${vote.title} vote`,
                  updater: update.updater,
                  new_value: { data: null, new_value: null },
                  date: update.date,
                  time: null
                };
                this.infomCurrentRoom(Change, vote, update.event_id)
              }
            })
          resolve()
        })
      })
    },
    vote_period_updated: update => {
      return new Promise((resolve, reject) => {
        stores.Votes.UpdateVotePeriod(update.new_value).then((vote) => {
          stores.CommiteeStore.imIInThisCommttee(stores.LoginStore.user.phone,
            vote.committee_id).then((state) => {
              if (state || votes.published === 'public') {
                let Change = {
                  id: uuid.v1(),
                  event_id: update.event_id,
                  updated: 'vote_period',
                  title: `Update on ${vote.title} vote`,
                  changed: update.new_value.new_period && vote.period ? `Changed Voting End Date of ${vote.title} Vote To: ` :
                    update.new_value.new_period && !vote.period ? `Added Voting End Date To ${vote.title} Vote : ` :
                      `Remove Voting End Date From ${vote.title} Vote`,
                  updater: update.updater,
                  new_value: {
                    data: null,
                    new_value: update.new_value.period ? moment(update.new_value.period).format(format) : null
                  },
                  date: update.date,
                  time: null
                };
                stores.ChangeLogs.addChanges(Change).then(() => {
                  this.infomCurrentRoom(Change, vote, update.event_id)
                  resolve()
                })
              } else {
                resolve()
              }
            })
        })
      });
    },
    vote_description_updated: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Vote Description Changed",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Votes.UpdateVoteDescription(
            {
              id: update.new_value.vote_id,
              description: update.new_value.description
            },
            true
          ).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "vote_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    vote_title_updated: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Vote Title Updated",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Votes.updateVoteTitle(
            { id: update.new_value.vote_id, title: update.new_value.title },
            true
          ).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "vote_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    added_vote_option: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "New Vote Option",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Votes.addVoteOption(
            { id: update.new_value.vote_id, option: update.new_value.option },
            true
          ).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "vote_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    removed_vote_option: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Removed Vote Option",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Votes.removeVoteOption(
            update.new_value.vote_id,
            update.new_value.vote_option_name_updated,
            true
          ).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "vote_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    vote_option_name_updated: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Vote Option Name Changed",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Votes.UpdateVoteOptionName(
            update.new_value.vote_id,
            update.new_value.option_name,
            update.new_value.new_name,
            true
          ).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "vote_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    added: update => {
      return new Promise((resolve, reject) => {
        let Participant = requestObjects.Participant();
        Participant.phone = update.updater;
        Participant.master = update.new_value.master;
        Participant.host = update.new_value.host;
        Participant.status = update.new_value.status;
        let Change = {
          event_id: update.event_id,
          changed: "New Participant",
          updater: update.new_value.inviter,
          new_value: Participant,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Events.addParticipant(update.event_id, Participant, true).then(
            () => {
              GState.eventUpdated = true;
              resolve();
            }
          );
        });
      })

    },
    joint: update => {
      return new Promise((resolve, reject) => {
        let Participant = requestObjects.Participant();
        Participant.phone = update.updater;
        Participant.host = update.new_value.host;
        Participant.status = update.new_value.status;
        let Change = {
          id: uuid.v1(),
          title: 'Update On Main Activity',
          event_id: update.event_id,
          updated: 'joint',
          changed: "Joint The Activity",
          updater: update.new_value.inviter,
          new_value: { data: null, new_value: [Participant] },
          date: update.date,
          time: update.time
        };
        stores.Events.addParticipant(update.event_id, Participant, true).then(
          (event) => {
            this.infomCurrentRoom(Change, event, update.event_id)
            stores.ChangeLogs.addChanges(Change).then(() => {
              resolve();
            }
            );
          });
      });
    },
    remind_added: update => {
      return new Promise((resolve, reject) => {
        let RemindID = requestObjects.RemindID();
        RemindID.remind_id = update.new_value;
        tcpRequestData.getRemind(RemindID, update.new_value + "reminder").then(JSONData => {
          serverEventListener.sendRequest(JSONData, update.new_value + "reminder").then(Remind => {
            if (Remind.data && Remind.data !== 'empty') {
              stores.Reminds.addReminds(Remind.data).then(() => {
                stores.Events.addRemind(update.event_id, Remind.id).then(() => {
                  let Change = {
                    id: uuid.v1(),
                    title: "Updates On Main Activity",
                    updated: "added_remind",
                    updater: update.updater,
                    event_id: update.event_id,
                    changed: "Added A New Remind ",
                    new_value: { data: update.new_value, new_value: Remind.data.title },
                    date: update.date,
                    time: null
                  }
                  this.infomCurrentRoom(Change, Remind.data, update.event_id)
                  stores.ChangeLogs.addChanges(Change).then(() => {
                    GState.newRemind = true;
                    GState.eventUpdated = true;
                    resolve('ok')
                  })
                });
              });
            } else {
              //!! heyyy case that remind doesn't exists please think of handling this.
              //!! a case where this scenario can occur is when the user add a remind and imediately deletes it 
              //!! such that when offline users will received their updates,they will be receiving of and 
              //!! that doesn't exists. 
            }
          });
        });
      });
    },
    remind_period_updated: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.updatePeriod(update.new_value, true).then((oldRemind) => {
          let Change = {
            id: uuid.v1(),
            title: `Updates On ${oldRemind.title} Remind`,
            updated: `remind_period_updated`,
            updater: update.updater,
            event_id: update.event_id,
            changed: "Changed Date/Time Of The Remind To ",
            new_value: { data: update.new_value.remind_id, new_value: update.new_value.period },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, oldRemind, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            oldRemind.calendar_id ? CalendarServe.saveEvent({
              ...oldRemind, period:
                update.new_value.period
            },
              oldRemind.alams, 'reminds').then(() => {

              }) : null
            GState.eventUpdated = true;
            resolve('ok')
          })
        });
      });
    },
    remind_description_updated: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.updateDescription(update.new_value, true).then((oldRemind) => {
          let Change = {
            id: uuid.v1(),
            title: `Updates On ${oldRemind.title} Remind`,
            updated: `remind_description_updated`,
            updater: update.updater,
            event_id: update.event_id,
            changed: "Changed The Description To ",
            new_value: {
              data: update.new_value.remind_id,
              new_value: update.new_value.description
            },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, oldRemind, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            GState.eventUpdated = true;
            resolve('ok')
          })
        });
      });
    },
    remind_title_updated: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.updateTitle(update.new_value, true).then((oldRemind) => {
          let Change = {
            id: uuid.v1(),
            title: `Updates On ${oldRemind.title} Remind`,
            updated: `remind_title_updated`,
            updater: update.updater,
            event_id: update.event_id,
            changed: "Changed The Title To ",
            new_value: {
              data: update.new_value.remind_id,
              new_value: update.new_value.title
            },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, oldRemind, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            GState.eventUpdated = true;
            resolve('ok')
          })
        });
      });
    },
    remind_deleted: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.removeRemind(update.new_value, true).then((oldRemind) => {
          let Change = {
            id: uuid.v1(),
            title: `Updates On ${oldRemind.title} Remind`,
            updated: `delete_remind`,
            updater: update.updater,
            event_id: update.event_id,
            changed: "Removed The Remind ",
            new_value: { data: update.new_value, new_value: oldRemind },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, oldRemind, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            if (oldRemind.calendar_id && findIndex(oldRemind.members,
              { phone: stores.LoginStore.user.phone }) >= 0) {
              CalendarServe.saveEvent({ ...oldRemind, period: null }, null, 'reminds').then(() => {
                stores.Reminds.updateCalendarID({ remind_id: oldRemind.id, calendar_id: undefined }).then(() => {
                  console.warn("calendar_id successfully removed")
                  resolve('ok')
                })
              })
            }
            GState.eventUpdated = true;
            resolve('ok')
          })
        });
      });
    },
    restored_remind: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.addReminds(update.new_value.remind).then(() => {
          stores.Events.addRemind(update.new_value.remind.id,
            update.new_value.remind.event_id, true).then(() => {
              let Change = {
                id: uuid.v1(),
                title: `Updates On ${update.new_value.remind.title} Remind`,
                updated: `restored_remind`,
                updater: update.updater,
                event_id: update.event_id,
                changed: "Restored The Remind ",
                new_value: { data: update.new_value.remind.id, new_value: null },
                date: update.date,
                time: null
              }
              this.infomCurrentRoom(Change, update.new_value.remind,
                update.event_id)
              stores.ChangeLogs.addChanges(Change).then(() => {
                if (findIndex(update.new_value.remind.members,
                  { phone: stores.LoginStore.user.phone }) >= 0) {
                  CalendarServe.saveEvent(remind, null, 'reminds').then(calendar_id => {
                    stores.Reminds.updateCalendarID({
                      remind_id: update.new_value.remind.id,
                      calendar_id: calendar_id
                    }, null).then(() => {
                      resolve()
                    })
                  })
                }
              })
            })
        })
      })
    },
    remind_public_state: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.updateStatus(update.new_value, true).then((oldRemind) => {
          let Change = {
            id: uuid.v1(),
            title: `Updates On ${oldRemind.title} Remind`,
            updated: `remind_public_state_updated`,
            updater: update.updater,
            event_id: update.event_id,
            changed: "Changed Privacy Level Of The Remind To",
            new_value: {
              data: update.new_value.remind_id,
              new_value: update.new_value.status
            },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, oldRemind, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            GState.eventUpdated = true;
            resolve('ok')
          })
        });
      });
    },
    remind_recurrence: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.updateRecursiveFrequency(update.new_value, true).then((oldRemind) => {
          let Change = {
            id: uuid.v1(),
            title: `Updates On ${oldRemind.title} Remind`,
            updated: `remind_reurrence_config_updated`,
            updater: update.updater,
            event_id: update.event_id,
            changed: "Changed The Recurrency configuration",
            new_value: {
              data: update.new_value.remind_id,
              new_value: update.new_value.recurrence
            },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, oldRemind, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            oldRemind.calendar_id ? CalendarServe.saveEvent({
              ...oldRemind,
              recursive_frequency: update.new_value.recurrence
            },
              oldRemind.alams, 'reminds').then(() => {
                GState.eventUpdated = true;
                resolve('ok')
              }) : null
          });
        });
      });
    },
    members_added_to_remind: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.addMembers(update.new_value, true).then(oldRemind => {
          let Change = {
            id: uuid.v1(),
            title: `Updates On ${oldRemind.title} Remind`,
            updated: `remind_member_added`,
            updater: update.updater,
            event_id: update.event_id,
            changed: "Assigned The Remind To ",
            new_value: {
              data: update.new_value.remind_id,
              new_value: update.new_value.members
            },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, oldRemind, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            if (findIndex(update.new_value.members, { phone: stores.LoginStore.user.phone }) >= 0) {
              CalendarServe.saveEvent(oldRemind, null, 'reminds').then(calendar_id => {
                stores.Reminds.updateCalendarID({ remind_id: oldRemind.id, calendar_id: calendar_id }, null).then(() => {
                  GState.eventUpdated = true;
                  resolve('ok')
                })
              })
            }
          });
        });
      });
    },
    members_removed_from_remind: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.removeMember(update.new_value, true).then(oldRemind => {
          let Change = {
            id: uuid.v1(),
            title: `Updates On ${oldRemind.title} Remind`,
            updated: `remind_member_removed`,
            updater: update.updater,
            event_id: update.event_id,
            changed: "Unassigned This Task / Remind From ",
            new_value: {
              data: update.new_value.remind_id, new_value:
                update.new_value.members.map(ele => { return { phone: ele } })
            },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, oldRemind, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            if (findIndex(update.new_value.members,
              rlr => rlr === stores.LoginStore.user.phone) >= 0 && oldRemind.calendar_id) {
              CalendarServe.saveEvent({ ...oldRemind, period: null }, null, 'reminds').then(() => {
                stores.Reminds.updateCalendarID({ remind_id: oldRemind.id, calendar_id: undefined }).then(() => {
                  GState.eventUpdated = true;
                  resolve('ok')
                })
              })
            }
          })
        })
      })
    },
    mark_as_done: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.makeAsDone(update.new_value, true).then(oldRemind => {
          let Change = {
            id: uuid.v1(),
            title: `Updates On ${oldRemind.title} Remind`,
            updated: `remind_marked_as_done`,
            updater: update.updater,
            event_id: update.event_id,
            changed: "Mark The Remind As Done",
            new_value: {
              data: update.new_value.remind_id,
              new_value: update.new_value.donners
            },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, oldRemind, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            GState.eventUpdated = true;
            resolve('ok')
          })
        })
      })
    },
    confirm: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.confirm(update.new_value, true).then(oldRemind => {
          let Change = {
            id: uuid.v1(),
            title: `Updates On ${oldRemind.title} Remind`,
            updated: `remind_confirmed`,
            updater: update.updater,
            event_id: update.event_id,
            changed: "Confirmed The Task Completion Of ",
            new_value: {
              data: update.new_value.remind_id,
              new_value: update.new_value.confirmed
            },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, oldRemind, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            GState.eventUpdated = true;
            resolve('ok')
          })
        })
      })
    },
    must_report: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.updateRequestReportOnComplete(update.new_value, true).then(oldRemind => {
          let Change = {
            id: uuid.v1(),
            title: `Updates On ${oldRemind.title} Remind`,
            updated: `remind_confirmed`,
            updater: update.updater,
            event_id: update.event_id,
            changed: "Changed The Must Report Status Of The Remind ",
            new_value: {
              data: update.new_value.remind_id,
              new_value: update.new_value.must_report
            },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, oldRemind, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            GState.eventUpdated = true;
            resolve('ok')
          })
        })
      })
    },
    new_commitee: update => {
      return new Promise((resolve, reject) => {
        stores.CommiteeStore.getCommitee(update.new_value).then(commitee => {
          stores.Events.addEventCommitee(update.event_id, update.new_value).then(() => {
            let Change = {
              id: uuid.v1(),
              updated: update.updated,
              title: "Update On Committees",
              event_id: update.event_id,
              changed: `Created ${commitee.name} Committee`,
              updater: update.updater,
              new_value: { data: commitee.id, new_value: commitee.name },
              date: update.date,
              time: update.time,
            };
            this.infomCurrentRoom(Change, commitee, update.event_id)
            stores.ChangeLogs.addChanges(Change).then(() => {
              resolve()
            })
          })
        })
      })
    },
    commitee_opened: update => {
      return new Promise((resolve, reject) => {
        return new Promise((resolve, reject) => {
          stores.CommiteeStore.changeCommiteeOpenedState(update.new_value, true).then(commitee => {
            let Change = {
              id: uuid.v1(),
              updated: update.updated,
              title: "Update On Committees",
              event_id: update.event_id,
              changed: `Reopened ${commitee.name} Committee`,
              updater: update.updater,
              new_value: { data: commitee.id, new_value: null },
              date: update.date,
              time: update.time,
            }
            this.infomCurrentRoom(Change, commitee, update.event_id)
            stores.ChangeLogs.addChanges(Change).then(() => {
              resolve()
            })
          })
        })
      })
    },
    commitee_closed: update => {
      return new Promise((resolve, reject) => {
        return new Promise((resolve, reject) => {
          stores.CommiteeStore.changeCommiteeOpenedState(update.new_value, false).then(commitee => {
            let Change = {
              id: uuid.v1(),
              updated: update.updated,
              title: "Update On Committees",
              event_id: update.event_id,
              changed: `Closed ${commitee.name} Committee`,
              updater: update.updater,
              new_value: { data: commitee.id, new_value: null },
              date: update.date,
            }
            this.infomCurrentRoom(Change, commitee, update.event_id)
            stores.ChangeLogs.addChanges(Change).then(() => {
              resolve()
            })
          })
        })
      })
    },
    removed_commitee: update => {
      return new Promise((resolve, reject) => {
        stores.CommiteeStore.removeCommitee(update.new_value).then(commitee => {
          stores.Events.removeCommitee(update.event_id, update.new_value).then(() => {
            let Change = {
              id: uuid.v1(),
              updated: update.updated,
              title: "Update On Committees",
              event_id: update.event_id,
              changed: "Committee Deleted",
              updater: update.updater,
              new_value: commitee,
              date: update.date,
              time: update.time,
            }
            this.infomCurrentRoom(Change, commitee, update.event_id)
            stores.ChangeLogs.addChanges(Change).then(() => {
              resolve()
            })
          })

        })
      })
    },
    added_commitee_member: update => {
      return new Promise((resolve, reject) => {
        stores.CommiteeStore.addMembers(update.new_value.id, update.new_value.member).then((commitee) => {
          let Change = {
            id: uuid.v1(),
            updated: update.updated,
            title: "Update On Committees",
            event_id: update.event_id,
            changed: `Added A New Memeber(s) To ${commitee.name} Committee`,
            updater: update.updater,
            new_value: { data: commitee.id, new_value: update.new_value.member },
            date: update.date,
            time: update.time,
          }
          this.infomCurrentRoom(Change, commitee, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            resolve()
          })
        })
      })
    },
    removed_commitee_member: update => {
      return new Promise((resolve, reject) => {
        stores.CommiteeStore.removeMember(update.new_value.id, update.new_value.phone).then((commitee) => {
          let Change = {
            id: uuid.v1(),
            updated: update.updated,
            title: "Update On Committees",
            event_id: update.event_id,
            changed: `Removed A Member(s) From ${commitee.name}`,
            updater: update.updater,
            new_value: { data: commitee.id, new_value: update.new_value.phone },
            date: update.date,
            time: update.time,
          }
          this.infomCurrentRoom(Change, commitee, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            resolve()
          })
        })
      })
    },
    commitee_name_updated: update => {
      return new Promise((resolve, reject) => {
        stores.CommiteeStore.getCommitee(update.new_value.id).then(oldCommitee => {
          stores.CommiteeStore.updateCommiteeName(update.new_value.id, update.new_value.name).then(commitee => {
            let Change = {
              id: uuid.v1(),
              updated: update.updated,
              title: "Update On Committees",
              event_id: update.event_id,
              changed: `Changed The Name Of ${oldCommitee.name} Committee To: `,
              updater: update.updater,
              new_value: { data: commitee.id, new_value: update.new_value.name },
              date: update.date,
              time: update.time,
            }
            this.infomCurrentRoom(Change, commitee, update.event_id)
            stores.ChangeLogs.addChanges(Change).then(() => {
              resolve()
            })
          })
        })
      })
    },
    updated_commitee_public_status: update => {
      return new Promise((resolve, reject) => {
        stores.CommiteeStore.updateCommiteeState(update.new_value.id, update.new_value.state).then((commitee) => {
          //console.warn(update.updater)
          let Change = {
            id: uuid.v1(),
            title: "Update On Committees",
            updated: update.updated,
            event_id: update.event_id,
            changed: update.new_value.state === true ? `Published ${commitee.name} Committee` : `Unpublished ${commitee.name} Committee`,
            updater: update.updater,
            new_value: { data: commitee.id, new_value: update.new_value.state },
            date: update.date,
            time: update.time,
          }
          this.infomCurrentRoom(Change, commitee, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            resolve()
          })

        })
      })
    }

  };
}

const UpdatesDispatch = new UpdatesDispatcher();
export default UpdatesDispatch;
