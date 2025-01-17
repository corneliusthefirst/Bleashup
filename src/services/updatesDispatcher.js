import stores from "../stores";
import GState from "../stores/globalState";
import Getter from "./Getter"
import requestObjects from "./requestObjects";
import tcpRequestData from "./tcpRequestData";
import emitter from "./eventEmiter";
import serverEventListener from "./severEventListener"
import { find, findIndex, drop, reject, forEach } from "lodash";
class UpdatesDispatcher {
  constructor() { }
  dispatchUpdates(updates) {
    forEach(updates, update => {
      this.dispatchUpdate(update).then(() => { });
    });
  }
  dispatchUpdate(update) {
    return this.UpdatePossibilities[update.update](update);
  }
  UpdatePossibilities = {
    title: update => {
      return new Promise((resolve, reject) => {
        stores.Events.loadCurrentEvent(update.event_id).then(Event => {
          let Change = {
            event_id: update.event_id,
            changed: "New Event Title",
            old_value: Event.about.title,
            updater: update.updater,
            new_value: update.new_value,
            date: update.date,
            time: update.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.updateTitle(
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

    background: update => {
      return new Promise((resolve, reject) => {
        stores.Events.loadCurrentEvent(update.event_id).then(Event => {
          let Change = {
            event_id: update.event_id,
            changed: "New Event Background Image",
            updater: update.updater,
            old_value: Event.background,
            new_value: update.new_value,
            date: update.date,
            time: update.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.updateBackground(
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
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    period: update => {
      return new Promise((resolve, reject) => {
        stores.Events.loadCurrentEvent(update.event_id).then(Event => {
          let Change = {
            event_id: update.event_id,
            changed: "New Event Period",
            old_value: Event.period,
            updater: update.updater,
            date: update.date,
            time: update.time
          };
          stores.ChangeLogs(Change).then(() => {
            stores.Events.updatePeriod(
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
    published: update => {
      return new Promise((resolve, reject) => {
        stores.Session.getSession().then(session => {
          stores.Events.isParticipant(update.event_id, session.phone).then(
            status => {
              let EventID = requestObjects.EventID();
              EventID.event_id = update.event_id;
              stores.Events.loadCurrentEvent(update.event_id).then(event => {
                if (event) {
                  let Change = {
                    event_id: update.event_id,
                    changed: "Published",
                    updater: update.updater,
                    old_value: false,
                    new_value: true,
                    date: update.date,
                    time: update.time
                  };
                  stores.ChangeLogs.addChanges(Change).then(() => {
                    stores.Events.publishEvent(update.event_id, true).then(() => {
                      let publisher = {
                        period: {
                          date: update.date,
                          time: update.time
                        },
                        phone: update.updater
                      }
                      stores.Publishers.addPublisher(update.event_id, publisher).then(() => {
                        GState.eventUpdated = true;
                        resolve();
                      })
                    });
                  });
                } else {
                  tcpRequestData.getCurrentEvent(EventID).then(JSONData => {
                    serverEventListener.GetData(EventID).then((Event) => {
                      stores.Events.addEvent(Event).then(() => {
                        let Change = {
                          event_id: update.event_id,
                          changed: "Published",
                          updater: update.updater,
                          old_value: false,
                          new_value: true,
                          date: update.date,
                          time: update.time
                        };
                        stores.ChangeLogs.addChanges(Change).then(() => {
                          stores.Events.publishEvent(update.event_id, true).then(() => {
                            let publisher = {
                              period: {
                                date: update.date,
                                time: update.time
                              },
                              phone: update.updater
                            }
                            stores.Publishers.addPublisher(update.event_id, publisher).then(() => {
                              GState.eventUpdated = true;
                              resolve();
                            })
                          });
                        });
                      });
                    })
                  });
                }
              })
            }
          );
        });
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
                  event_id: update.event_id,
                  changed: "UnPublished",
                  updater: update.updater,
                  old_value: true,
                  new_value: false,
                  date: update.date,
                  time: update.time
                };
                stores.ChangeLogs.addChanges(Change).then(() => {
                  stores.Events.unpublishEvent(update.event_id, true).then(
                    () => {
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
          let Participant = find(Event.participants, {
            phone: update.addedphone
          });
          let Change = {
            event_id: update.event_id,
            changed: "New Event Master Status",
            updater: update.updater,
            old_value: Participant.master,
            new_value: update.new_value,
            date: update.date,
            time: update.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            Participant.master = update.new_value;
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
      });
    },
    removed: update => {
      return new Promise((resolve, reject) => {
        stores.Events.loadCurrentEvent(update.event_id).then(Event => {
          let Participant = find(Event.participants, {
            phone: update.addedphone
          });
          let Change = {
            event_id: update.event_id,
            changed: "Event Left",
            updater: update.updater,
            old_value: Participant.phone,
            new_value: null,
            date: update.date,
            time: update.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.removeParticipant(
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
    likes: update => {
      return new Promise((resolve, reject) => {
        switch (update.addedphone) {
          case "like":
            stores.Likes.like(update.event_id, update.updater,true).then(() => {
              stores.Events.likeEvent(update.event_id, true).then(() => {
                GState.eventUpdated = true;
                resolve();
              });
            });
            break;
          case "like_vote":
            stores.Likes.like(updated.new_value, update.updater,true).then(() => {
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
            stores.Likes.unlike(update.new_value, update.updater,true).then(() => {
              stores.Events.unlikeEvent(update.event_id).then(() => {
                GState.eventUpdated = true;
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
        let Change = {
          event_id: update.event_id,
          changed: "New Highlight",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          let RequestObject = requestObjects.HID();
          RequestObject.h_id = update.new_value;
          tcpRequestData.getHighlight(RequestObject, update.new_value + "highlight").then(JSONData => {
            serverEventListener.sendRequest(JSONData, update.new_value + "highlight").then(Highlight => {
              stores.Highlights.addHighlight(Highlight).then(() => {
                stores.Events.addHighlight(
                  Highlight.event_id,
                  Highlight.id
                ).then(() => {
                  GState.newHightlight = true;
                  stores.Events.changeUpdatedStatus(
                    update.event_id,
                    "highlight_updated",
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
    },

    highlight_update_description: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "New Highlight Description",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Highlights.updateHighlightDescription(
            {
              id: update.new_value.highlight_id,
              description: update.new_value.new_desciption
            },
            true
          ).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "highlight_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },

    highlight_update_title: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "New Highlight Title",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Highlights.updateHighlightTitle(
            {
              id: update.new_value.highlight_id,
              description: update.new_value.new_title
            },
            true
          ).then(() => {
            stores.Events.changeUpdatedStatus(
              update.event_id,
              "highlight_updated",
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    highlight_deleted: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "New Highlight Title",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Highlights.removeHighlight(update.new_value).then(() => {
            stores.Events.removeHighlights(
              update.event_id,
              update.new_value
            ).then(() => {
              stores.Events.changeUpdatedStatus(
                update.event_id,
                "highlight_updated",
                true
              ).then(() => {
                GState.eventUpdated = true;
                resolve();
              });
            });
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
      return new Promise((resolve,reject) =>{
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
          changed: "New Participant by Joining",
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
          event_id: update.event_id,
          changed: "Remind Title Updated",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
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
    }
  };
}

const UpdatesDispatch = new UpdatesDispatcher();
export default UpdatesDispatch;
