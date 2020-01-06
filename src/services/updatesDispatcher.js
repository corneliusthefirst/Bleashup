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
class UpdatesDispatcher {
  constructor() { }
  dispatchUpdates(updates) {
    if (updates.length <= 0) {
      console.warn("finishing ...")
      return "ok";
    } else {
      let update = updates.pop()
      this.dispatchUpdate(update).then(() => { this.dispatchUpdates(updates) });
    }

  }
  dispatchUpdate(update) {
    return this.UpdatePossibilities[update.update](update);
  }
  infomCurrentRoom(Change, commitee, event_id) {
    emitter.emit(`event_updated_${event_id}`, Change, commitee)
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
          stores.ChangeLogs.addChanges(Change).then(() => {
            Eve.calendar_id ? CalendarServe.saveEvent(Eve, Eve.alarms).then(() => {

            }) : null
            GState.eventUpdated = true;
            this.infomCurrentRoom(Change, Eve, update.event_id)
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
            changed: "Changed The Background Photo Of The Main Activity",
            new_value: { data: null, new_value: update.new_value },
            date: update.date,
            time: update.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            this.infomCurrentRoom(Change, Change, update.event_id)
            GState.eventUpdated = true;
            resolve();
          });
        });
      });
    },

    description: update => {
      return new Promise((resolve, reject) => {
        stores.Events.loadCurrentEvent(update.event_id).then(Event => {
          let Change = {
            event_id: update.event_id,
            changed: "New Event Description",
            updater: update.updater,
            old_value: Event.about.description,
            date: update.data,
            time: update.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.updateDescription(
              update.event_id,
              update.new_value,
              true
            ).then((Eve) => {
              Eve.calendar_id ? CalendarServe.saveEvent(Eve, Eve.alarms).then(() => {

              }) : null
              GState.eventUpdated = true;
              this.infomCurrentRoom(Change, Eve, update.event_id)
              resolve();
            });
          });
        });
      });
    },
    period: update => {
      return new Promise((resolve, reject) => {
        stores.Events.updatePeriod(update.event_id, update.new_value, true).then((Eve) => {
          let Change = {
            id: uuid.v1(),
            title: "Updates On Main Activity",
            updated: "period",
            updater: update.updater,
            event_id: update.event_id,
            changed: "Changed The Scheduled Time Of The Activity To: ",
            new_value: { data: null, new_value: moment(update.new_value).format("dddd, MMMM Do YYYY, h:mm:ss a") },
            date: update.date,
            time: null
          }
          stores.ChangeLogs.addChanges(Change).then(() => {
            Eve.calendar_id ? CalendarServe.saveEvent(Eve, Eve.alarms).then(() => {

            }) : null
            GState.eventUpdated = true;
            this.infomCurrentRoom(Change, Eve, update.event_id)
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
          stores.ChangeLogs.addChanges(Change).then(() => {
            GState.eventUpdated = true
            this.infomCurrentRoom(Change, Change, update.event_id)
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
          stores.ChangeLogs.addChanges(Change).then(() => {
            Eve.calendar_id ? CalendarServe.saveEvent(Eve, Eve.alarms).then(() => {

            }) : null
            this.infomCurrentRoom(Change, Eve, update.event_id)
            GState.eventUpdated = true
            resolve('ok')
          })
        })
      })
    },
    string: update => {
      return new Promise((resolve, reject) => {
        stores.Events.loadCurrentEvent(update.event_id).then(Event => {
          let Change = {
            event_id: update.event_id,
            changed: "New Event Location",
            updater: update.updater,
            old_value: Event.location,
            new_value: {
              string: update.new_value,
              url: Event.location.url
            },
            date: update.date,
            time: update.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.updateLocation(
              update.event_id,
              {
                string: update.new_value,
                url: Event.location.url
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
          stores.ChangeLogs.addChanges(Change).then(() => {
            this.infomCurrentRoom(Change, Change, update.event_id)
            GState.eventUpdated = true
            resolve("ok")
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
          stores.ChangeLogs.addChanges(Change).then(() => {
            Eve.calendar_id ? CalendarServe.saveEvent(Eve, Eve.alarms).then(() => {

            }) : null
            this.infomCurrentRoom(Change, Eve, update.event_id)
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
                  stores.ChangeLogs.addChanges(Change).then(() => {
                    GState.eventUpdated = true;
                    this.infomCurrentRoom(Change, update.event_id, update.event_id)
                    resolve();
                  });
                })
              });
            })
          }
        );
      });
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
                stores.ChangeLogs.addChanges(Change).then(() => {
                  stores.Events.unpublishEvent(update.event_id, true).then(
                    () => {
                      this.infomCurrentRoom(Change, Change, update.event_id)
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
              stores.ChangeLogs.addChanges(Change).then(() => {
                GState.eventUpdated = true;
                // console.warn(e.commitee)
                this.infomCurrentRoom(Change, newEvent, update.event_id)
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
            changed: "Removed Participant(s) From Main Activity",
            updater: update.updater,
            new_value: { data: null, new_value: update.new_value },
            date: update.date,
            time: update.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            GState.eventUpdated = true;
            this.infomCurrentRoom(Change, Event, update.event_id)
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
                  date: moment().format(),
                  time: null
                }
                stores.ChangeLogs.addChanges(Change).then(res => {
                  GState.newHightlight = true;
                  GState.eventUpdated = true;
                  this.infomCurrentRoom(Change, Highlight, update.event_id)
                  resolve("ok")
                })
              });
            });
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
            changed: `Changed The Content of ${Highlight.title} Post To`,
            new_value: { data: null, new_value: update.new_value.new_description },
            date: moment().format(),
            time: null
          }
          stores.ChangeLogs.addChanges(Change).then(res => {
            this.infomCurrentRoom(Change, Highlight, update.event_id)
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
            date: moment().format(),
            time: null
          }
          stores.ChangeLogs.addChanges(Change).then(res => {
            this.infomCurrentRoom(Change, Highlight, update.event_id)
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
            changed: `Changed The Title of ${Highlight.title} Post to ...`,
            new_value: { data: null, new_value: update.new_value.new_title },
            date: moment().format(),
            time: null
          }
          stores.ChangeLogs.addChanges(Change).then(res => {
            this.infomCurrentRoom(Change, Highlight, update.event_id)
            GState.eventUpdated = true;
            resolve("ok")
          })
        });
      });
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
                date: moment().format(),
                time: null
              }
              stores.ChangeLogs.addChanges(Change).then(res => {
                this.infomCurrentRoom(Change, Highlight, update.event_id)
                GState.eventUpdated = true;
                resolve("ok")
              })
            });
        });
      });
    },
    vote_added: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "New Vote",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        let VoteID = requestObjects.VID();
        VoteID.vote_id = update.new_value;
        tcpRequestData.getVote(VoteID).then(JSONData => {
          Getter.get_data(JSONData).then(Vote => {
            stores.Votes.addVote(Vote).then(() => {
              stores.Events.addVote(Vote.event_id, Vote.id).then(() => {
                GState.newVote = true;
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
        });
      });
    },
    vote_deleted: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Vote Deleted",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Changed).then(() => {
          stores.Votes.removeVote(update.new_value).then(() => {
            stores.Events.removeVote(update.event_id, update.new_value).then(
              () => {
                stores.Events.changeUpdatedStatus(
                  update.event_id,
                  "vote_updated",
                  true
                ).then(() => {
                  GState.eventUpdated = true;
                  resolve();
                });
              }
            );
          });
        });
      });
    },
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
    vote_period_changed: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "New Vote Period",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Votes.UpdateEventVotes(
            {
              id: update.new_value.vote_id,
              period: update.new_value.new_period
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
        Participant.master = update.new_value.master;
        Participant.host = update.new_value.host;
        Participant.status = update.new_value.status;
        let Change = {
          event_id: update.event_id,
          changed: "Joint The Activity",
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
      });
    },
    remind_added: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "New Remind Created",
          updater: update.updater,
          new_value: update.new_value,
          title: "Update On Reminds",
          id: uuid.v1(),
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          let RemindID = requestObjects.RemindID();
          RemindID.remind_id = update.new_value;
          tcpRequestData.getRemind(RemindID).then(JSONData => {
            Getter.get_data(JSONData).then(Remind => {
              stores.Reminds.addReminds(Remind).then(() => {
                stores.Events.addRemind(update.event_id, Remind.id).then(() => {
                  stores.Events.changeUpdatedStatus(
                    update.event_id,
                    "remind_updated",
                    true
                  ).then(() => {
                    GState.newRemind = true;
                    GState.eventUpdated = true;
                    resolve();
                  });
                });
              });
            });
          });
        });
      });
    },
    remind_period_updated: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Remind Period Updated",
          updater: update.updater,
          new_value: update.new_value,
          title: "Update On Reminds",
          id: uuid.v1(),
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Reminds.updatePeriod(update.new_value, true).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "remind_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    remind_description_updated: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Remind Description Updated",
          updater: update.updater,
          title: "Update On Reminds",
          id: uuid.v1(),
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Reminds.updateDescription(update.new_value, true).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "remind_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    remind_title_updated: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Remind Title Updated",
          title: "Update On Reminds",
          id: uuid.v1(),
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Reminds.updateTitle(update.new_value, true).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "remind_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    remind_deleted: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          updated: update.updated,
          title: "Update On Reminds",
          id: uuid.v1(),
          event_id: update.event_id,
          changed: "Remind Title Updated",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          //time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Reminds.removeRemind(update.new_value).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "remind_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    new_commitee: update => {
      return new Promise((resolve, reject) => {
        stores.CommiteeStore.getCommitee(update.new_value).then(commitee => {
          stores.Events.addEventCommitee(update.event_id, update.new_value).then(() => {
            let Change = {
              id: uuid.v1(),
              updated: update.updated,
              title: "Update On Commitees",
              event_id: update.event_id,
              changed: `Created ${commitee.name} Commitee`,
              updater: update.updater,
              new_value: { data: commitee.id, new_value: update.new_value },
              date: update.date,
              time: update.time,
            };
            stores.ChangeLogs.addChanges(Change).then(() => {
              this.infomCurrentRoom(Change, commitee, update.event_id)
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
              title: "Update On Commitees",
              event_id: update.event_id,
              changed: `Reopened ${commitee.name} Commitee`,
              updater: update.updater,
              new_value: { data: commitee.id, new_value: null },
              date: update.date,
              time: update.time,
            }
            stores.ChangeLogs.addChanges(Change).then(() => {
              this.infomCurrentRoom(Change, commitee, update.event_id)
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
              title: "Update On Commitees",
              event_id: update.event_id,
              changed: `Closed ${commitee.name} Commitee`,
              updater: update.updater,
              new_value: { data: commitee.id, new_value: null },
              date: update.date,
            }
            stores.ChangeLogs.addChanges(Change).then(() => {
              this.infomCurrentRoom(Change, commitee, update.event_id)
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
              title: "Update On Commitees",
              event_id: update.event_id,
              changed: "Commitee Deleted",
              updater: update.updater,
              new_value: commitee,
              date: update.date,
              time: update.time,
            }
            stores.ChangeLogs.addChanges(Change).then(() => {
              this.infomCurrentRoom(Change, commitee, update.event_id)
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
            title: "Update On Commitees",
            event_id: update.event_id,
            changed: `Added A New Memeber(s) To ${commitee.name} Commitee`,
            updater: update.updater,
            new_value: { data: commitee.id, new_value: update.new_value.member },
            date: update.date,
            time: update.time,
          }
          stores.ChangeLogs.addChanges(Change).then(() => {
            this.infomCurrentRoom(Change, commitee, update.event_id)
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
            title: "Update On Commitees",
            event_id: update.event_id,
            changed: `Removed A Member(s) From ${commitee.name}`,
            updater: update.updater,
            new_value: { data: commitee.id, new_value: update.new_value.phone },
            date: update.date,
            time: update.time,
          }
          stores.ChangeLogs.addChanges(Change).then(() => {
            this.infomCurrentRoom(Change, commitee, update.event_id)
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
              title: "Update On Commitees",
              event_id: update.event_id,
              changed: `Changed The Name Of ${oldCommitee.name} Commitee To: `,
              updater: update.updater,
              new_value: { data: commitee.id, new_value: update.new_value.name },
              date: update.date,
              time: update.time,
            }
            stores.ChangeLogs.addChanges(Change).then(() => {
              this.infomCurrentRoom(Change, commitee, update.event_id)
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
            title: "Update On Commitees",
            updated: update.updated,
            event_id: update.event_id,
            changed: update.new_value.state === true ? `Published ${commitee.name} Commitee` : `Unpublished ${commitee.name} Commitee`,
            updater: update.updater,
            new_value: { data: commitee.id, new_value: update.new_value.state },
            date: update.date,
            time: update.time,
          }
          stores.ChangeLogs.addChanges(Change).then(() => {
            this.infomCurrentRoom(Change, commitee, update.event_id)
            resolve()
          })

        })
      })
    }

  };
}

const UpdatesDispatch = new UpdatesDispatcher();
export default UpdatesDispatch;
