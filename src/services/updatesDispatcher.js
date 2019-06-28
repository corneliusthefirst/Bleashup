import stores from "../stores";
import GState from "../stores/globalState";
import requestObjects from "./requestObjects";
import tcpRequestData from "./tcpRequestData";
import emitter from "./eventEmiter";
import { find, findIndex, drop, dropWhile, forEach } from "lodash";
class UpdatesDispatcher {
  constructor() {}
  /* prepare_updated(EventID, Updated, Updater, AddPhone,
        NewData) ->
            { Date, Time } = calendar: universal_time(),
#updated{
event_id = EventID, updater = Updater,
    update = binary_or_atom(Updated),
    time = to_bleashup_time(Time),
    date = to_bleashup_date(Date), new_value = NewData,
    addedphone = AddPhone
}*/
  dispatchUpdates(updates) {
    forEach(updates, update => {
      this.dispatchUpdate(update).then(() => {});
    });
  }
  dispatchUpdate(update) {
    return this.UpdatePossibilities[update.updated](update);
  }
  UpdatePossibilities = {
    title: update => {
      return new Promise((resolve, reject) => {
        stores.Events.loadCurrentEvent(update.event_id).then(Event => {
          let Change = {
            event_id: EventID,
            changed: "New Event Title",
            old_value: Event.about.title,
            updater: update.updater,
            new_value: update.new_data,
            date: update.date,
            time: update.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.updateTitle(
              update.event_id,
              update.new_data,
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
            new_value: update.new_data,
            date: update.date,
            time: update.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.updateBackground(
              update.event_id,
              update.new_data,
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
              update.new_data,
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
              update.new_data,
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
              string: update.new_data,
              url: Event.location.url
            },
            date: update.date,
            time: update.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.updateLocation(
              update.event_id,
              {
                string: update.new_data,
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
              if (status == false) {
                let EventID = requestObjects.EventID();
                EventID.event_id = update.event_id;
                tcpRequestData.getCurrentEvent(EventID).then(Event => {
                  stores.Events.addEvent(Event).then(() => {
                    GState.newEvent = true;
                    resolve();
                  });
                });
              } else {
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
                    GState.eventUpdated = true;
                    resolve();
                  });
                });
              }
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
              url: update.new_data
            },
            date: update.date,
            time: update.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.updateLocation(
              update.event_id,
              {
                string: Event.location.string,
                url: update.new_data
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
          Participant.host = update.new_data;
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
            new_value: update.new_data,
            date: update.date,
            time: update.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            Participant.master = update.new_data;
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
              update.new_data,
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
            stores.Likes.like(update.event_id, update.updater).then(() => {
              stores.Events.likeEvent(update.event_id, true).then(() => {
                GState.eventUpdated = true;
                resolve();
              });
            });
            break;
          case "like_vote":
            stores.Likes.like(updated.new_data, update.updater).then(() => {
              stores.Votes.likeVote(update.new_data, true).then(() => {
                GState.eventUpdated = true;
                resolve();
              });
            });
            break;
          case "like_contribution":
            stores.Likes.like(update.new_data, update.updater).then(() => {
              stores.Contributions.like(update.new_data, true).then(() => {
                GState.eventUpdated = true;
                resolve();
              });
            });
            break;
        }
      });
    },
    unlike: update => {
      return new Promise((resolve, reject) => {
        switch (update.addedphone) {
          case "unlike":
            stores.Likes.unlike(update.new_data, update.updater).then(() => {
              stores.Events.unlikeEvent(update.event_id).then(() => {
                GState.eventUpdated = true;
                resolve();
              });
            });
            break;
          case "unlike_vote":
            stores.Likes.unlike(update.new_data, update.updater).then(() => {
              stores.Votes.unlikeVote(update.new_data).then(() => {
                GState.eventUpdated = true;
                resolve();
              });
            });
            break;
          case "unlike_contribution":
            stores.Likes.unlike(update.new_data, update.updater).then(() => {
              stores.Contributions.unlike(update.new_data).then(() => {
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
            new_value: update.new_data,
            date: update.date,
            time: update.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.addMustToContribute(
              update.event_id,
              update.new_data,
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
          new_value: update.new_data,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          let requestObject = requestObjects.CID();
          requestObject.contribution_id = update.new_data;
          let requestData = tcpRequestData
            .getContribution(requestObject)
            .then(JSONData => {
              this.get_data(JSONData).then(Contribution => {
                stores.Contributions.addContribution(Contribution).then(() => {
                  GState.eventUpdated = true;
                  GState.newContribution = true;
                  resolve();
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
          new_value: update.new_data,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          switch (update.new_data.new_state) {
            case "open":
              stores.Contributions.openContribution(
                update.new_data.contribution_id,
                true
              ).then(() => {
                GState.eventUpdated = true;
                resolve();
              });
              break;
            case "closed":
              stores.Contributions.closeContribution(
                update.new_data.contribution_id
              ).then(() => {
                GState.eventUpdated = true;
                resolve();
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
          new_value: update.new_data,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Contributions.updateContributionPeriod(
            {
              id: update.new_data.contribution_id,
              period: update.new_data.new_period
            },
            true
          ).then(() => {
            GState.eventUpdated = true;
            resolve();
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
          new_value: update.new_data,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Contributions.publishContribution(update.new_data).then(() => {
            GState.eventUpdated = true;
            resolve();
          });
        });
      });
    },

    contribution_title_updated: update => {
      return new Promise((resolve, reject) => {});
    },

    contribution_description_updated: update => {
      return new Promise((resolve, reject) => {});
    },

    contribution_added_contribution_mean: update => {
      return new Promise((resolve, reject) => {});
    },
    contribution_remove_contribution_mean: update => {
      return new Promise((resolve, reject) => {});
    },
    update_contribution_amount: update => {
      return new Promise((resolve, reject) => {});
    },
    update_contribution_mean_name: update => {
      return new Promise((resolve, reject) => {});
    },

    update_contribution_mean_credential: update => {
      return new Promise((resolve, reject) => {});
    },
    new_highlight: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "New Highlight",
          updater: update.updater,
          new_value: update.new_data,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          let RequestObject = requestObjects.HID();
          RequestObject.h_id = update.new_data;
          tcpRequestData.getHighlight(RequestObject).then(JSONData => {
            this.get_data(JSONData).then(Highlight => {
              stores.Highlights.addHighlights(Highlight).then(() => {
                GState.newHightlight = true;
                GState.eventUpdated = true;
                resolve();
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
          new_value: update.new_data,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Highlights.updateHighlightDescription(
            {
              id: update.new_data.highlight_id,
              description: update.new_data.new_desciption
            },
            true
          ).then(() => {
            GState.eventUpdated = true;
            resolve();
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
          new_value: update.new_data,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Highlights.updateHighlightTitle(
            {
              id: update.new_data.highlight_id,
              description: update.new_data.new_title
            },
            true
          ).then(() => {
            GState.eventUpdated = true;
            resolve();
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
          new_value: update.new_data,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Highlights.removeHighlight(update.new_data).then(() => {
            GState.eventUpdated = true;
            resolve();
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
          new_value: update.new_data,
          date: update.date,
          time: update.time
        };
        let VoteID = requestObjects.VID();
        VoteID.vote_id = update.new_data;
        tcpRequestData.getVote(VoteID).then(JSONData => {
          this.get_data(JSONData).then(Vote => {
            stores.Votes.addVote(Vote).then(() => {
              GState.newVote = true;
              GState.eventUpdated = true;
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
          new_value: update.new_data,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Changed).then(() => {
          stores.Votes.removeVote(update.new_data).then(() => {
            GState.eventUpdated = true;
            resolve();
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
          new_value: update.new_data,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Votes.PublishVote(update.new_data).then(() => {
            GState.eventUpdated = true;
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
          new_value: update.new_data,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Votes.UpdateEventVotes(
            { id: update.new_data.vote_id, period: update.new_data.new_period },
            true
          ).then(() => {
            GState.eventUpdated = true;
            resolve();
          });
        });
      });
    },
    vote_description_updated: update => {
      return new Promise((resolve, reject) => {});
    },
    vote_title_updated: update => {
      return new Promise((resolve, reject) => {});
    },
    added_vote_option: update => {
      return new Promise((resolve, reject) => {});
    },
    remove_option_option: update => {
      return new Promise((resolve, reject) => {});
    },
    vote_option_name_updated: update => {
      return new Promise((resolve, reject) => {});
    },
    added: update => {
      let Participant = requestObjects.Participant();
      Participant.phone = update.updater;
      Participant.master = update.new_data.master;
      Participant.host = update.new_data.host;
      Participant.status = update.new_data.status;
      let Change = {
        event_id: update.event_id,
        changed: "New Participant",
        updater: update.new_data.inviter,
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
    },
    joint: update => {
      return new Promise((resolve, reject) => {
        let Participant = requestObjects.Participant();
        Participant.phone = update.updater;
        Participant.master = update.new_data.master;
        Participant.host = update.new_data.host;
        Participant.status = update.new_data.status;
        let Change = {
          event_id: update.event_id,
          changed: "New Participant by Joining",
          updater: update.new_data.inviter,
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
      return new Promise((resolve, reject) => {});
    },
    remind_period_updated: update => {
      return new Promise((resolve, reject) => {});
    },
    remind_description_update: update => {
      return new Promise((resolve, reject) => {});
    },
    remind_title_update: update => {
      return new Promise((resolve, reject) => {});
    },
    remind_deleted: update => {
      return new Promise((resolve, reject) => {});
    }
  };

  get_data(data) {
    return new Promise((resolve, reject) => {
      console.warn("getting data...");
      emitter.once("successful", (response, dataResponse) => {
        resolve(dataResponse);
      });
      emitter.once("unsuccessful", (response, dataError) => {
        reject(dataError);
      });
      stores.Session.getSession().then(session => {
        session.socket.write(data);
      });
    });
  }
}

const UpdatesDispatch = new UpdatesDispatcher();
export default UpdatesDispatch;
