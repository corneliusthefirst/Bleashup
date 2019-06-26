import stores from "../stores";
import GState from "../stores/globalState";
import requestObjects from "./requestObjects";
import tcpRequestData from "./tcpRequestData";
import emitter from "./eventEmiter";
import { find, findIndex, drop, dropWhile } from "lodash";
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
    switch (updates.updated) {
      case "title":
        stores.Events.loadCurrentEvent(updates.event_id).then(Event => {
          let Change = {
            event_id: EventID,
            changed: updates.updated,
            old_value: Event.about.title,
            updater: updates.updater,
            new_value: updates.new_data,
            date: updates.date,
            time: updates.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.updateTitle(
              updates.event_id,
              updates.new_data,
              true
            ).then(() => {
              GState.eventUpdated = true;
            });
          });
        });
        break;
      case "background":
        stores.Events.loadCurrentEvent(updates.event_id).then(Event => {
          let Change = {
            event_id: updates.event_id,
            changed: updates.updated,
            updater: updates.updater,
            old_value: Event.background,
            new_value: updates.new_data,
            date: updates.date,
            time: updates.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.updateBackground(
              updates.event_id,
              updates.new_data,
              true
            ).then(() => {
              GState.eventUpdated = true;
            });
          });
        });
        break;
      case "description":
        stores.Events.loadCurrentEvent(updates.event_id).then(Event => {
          let Change = {
            event_id: updates.event_id,
            changed: updates.updated,
            updater: updates.updater,
            old_value: Event.about.description,
            date: updates.data,
            time: updates.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.updateDescription(
              updates.event_id,
              updates.new_data,
              true
            ).then(() => {
              GState.eventUpdated = true;
            });
          });
        });
        break;
      case "period":
        stores.Events.loadCurrentEvent(updates.event_id).then(Event => {
          let Change = {
            event_id: updates.event_id,
            changed: updates.updated,
            old_value: Event.period,
            updater: updates.updater,
            date: updates.date,
            time: updates.time
          };
          stores.ChangeLogs(Change).then(() => {
            stores.Events.updatePeriod(
              updates.event_id,
              updates.new_data,
              true
            ).then(() => {
              GState.eventUpdated = true;
            });
          });
        });
        break;
      case "string":
        stores.Events.loadCurrentEvent(updates.event_id).then(Event => {
          let Change = {
            event_id: updates.event_id,
            changed: "Event Location",
            updater: updates.updater,
            old_value: Event.location,
            new_value: {
              string: updates.new_data,
              url: Event.location.url
            },
            date: updates.date,
            time: updates.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.updateLocation(
              updates.event_id,
              {
                string: updates.new_data,
                url: Event.location.url
              },
              true
            ).then(() => {
              GState.eventUpdated = true;
            });
          });
        });
        break;
      case "url":
        stores.Events.loadCurrentEvent(updates.event_id).then(Event => {
          let Change = {
            event_id: updates.event_id,
            changed: "Event Location",
            updater: updates.updater,
            old_value: Event.location,
            new_value: {
              string: Event.location.string,
              url: updates.new_data
            },
            date: updates.date,
            time: updates.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.updateLocation(
              updates.event_id,
              {
                string: Event.location.string,
                url: updates.new_data
              },
              true
            ).then(() => {
              GState.eventUpdated = true;
            });
          });
        });
        break;
      case "host":
        stores.Events.loadCurrentEvent(updates.event_id).then(Event => {
          let Participant = find(Event.participants, {
            phone: updates.addedphone
          });
          Participant.host = updates.new_data;
          stores.Events.updateEventParticipant(
            updates.event_id,
            Participant,
            true
          ).then(() => {
            GState.eventUpdated = true;
          });
        });
        break;
      case "master":
        stores.Events.loadCurrentEvent(updates.event_id).then(Event => {
          let Participant = find(Event.participants, {
            phone: updates.addedphone
          });
          let Change = {
            event_id: updates.event_id,
            changed: "Master changed",
            updater: updates.updater,
            old_value: Participant.master,
            new_value: updates.new_data,
            date: updates.date,
            time: updates.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            Participant.master = updates.new_data;
            stores.Events.updateEventParticipant(
              updates.event_id,
              Participant,
              true
            ).then(() => {
              GState.eventUpdated = true;
            });
          });
        });
        break;
      case "remove":
        stores.Events.loadCurrentEvent(updates.event_id).then(Event => {
          let Participant = find(Event.participants, {
            phone: updates.addedphone
          });
          let Change = {
            event_id: updates.event_id,
            changed: "Event Left",
            updater: updates.updater,
            old_value: Participant.phone,
            new_value: null,
            date: updates.date,
            time: updates.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.removeParticipant(
              updates.event_id,
              updates.new_data,
              true
            ).then(() => {
              GState.eventUpdated = true;
            });
          });
        });
        break;
      case "likes":
        switch (updates.addedphone) {
          case "like":
            stores.Likes.like(updates.event_id, updates.updater).then(() => {
              stores.Events.likeEvent(updates.event_id, true).then(() => {
                GState.eventUpdated = true;
              });
            });
            break;
          case "like_vote":
            stores.Likes.like(updated.new_data, updates.updater).then(() => {
              stores.Votes.likeVote(updates.new_data, true).then(() => {
                GState.eventUpdated = true;
              });
            });
            break;
          case "like_contribution":
            stores.Likes.like(updates.new_data, updates.updater).then(() => {
              stores.Contributions.like(updates.new_data, true).then(() => {
                GState.eventUpdated = true;
              });
            });
            break;
        }
        break;
      case "unlike":
        switch (updates.addedphone) {
          case "unlike":
            stores.Likes.unlike(updates.new_data, updates.updater).then(() => {
              stores.Events.unlikeEvent(updates.event_id).then(() => {
                GState.eventUpdated = true;
              });
            });
            break;
          case "unlike_vote":
            stores.Likes.unlike(updates.new_data, updates.updater).then(() => {
              stores.Votes.unlikeVote(updates.new_data).then(() => {
                GState.eventUpdated = true;
              });
            });
            break;
          case "unlike_contribution":
            stores.Likes.unlike(updates.new_data, updates.updater).then(() => {
              stores.Contributions.unlike(updates.new_data).then(() => {
                GState.eventUpdated = true;
              });
            });
            break;
        }
        break;
      case "must_contribute_update":
        stores.Events.loadCurrentEvent(updates.event_id).then(Event => {
          let Change = {
            event_id: updates.event_id,
            changed: "Must Contribute",
            updater: updates.updater,
            old_value: Event.must_contribute,
            new_value: updates.new_data,
            date: updates.date,
            time: updates.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.addMustToContribute(
              updates.event_id,
              updates.new_data,
              true
            ).then(() => {
              GState.eventUpdated = true;
            });
          });
        });
        break;
      case "new_contribution":
        let Change = {
          event_id: updates.event_id,
          changed: "New Contriburion",
          updater: updates.updater,
          new_value: updates.new_data,
          date: updates.date,
          time: updates.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          let requestObject = requestObjects.CID();
          requestObject.contribution_id = updates.new_data;
          let requestData = tcpRequestData
            .getContribution(requestObject)
            .then(JSONData => {
              this.get_data(JSONData).then(Contribution => {
                stores.Contributions.addContribution(Contribution).then(() => {
                  GState.eventUpdated = true;
                  GState.newContribution = true;
                });
              });
            });
        });
        break;
    }
  }
  get_data(data) {
    return new Promise((resolve, reject) => {
      stores.Session.getSession().then(session => {
        if (GState.writing) {
          emitter.once("writing", State => {
            if (State == false) {
              GState.writing = true;
              console.warn("writing....");
              session.socket.write(data);
            }
          });
        } else {
          GState.writing = true;
          session.socket.write(data);
        }
      });
      emitter.on("successful", (response, dataResponse) => {
        emitter.emit("writing", false);
        resolve(dataResponse);
      });
      emitter.on("unsuccessful", (response, dataError) => {
        emitter.emit("writing", false);
        reject(dataError);
      });
    });
  }
}

const UpdatesDispatch = new UpdatesDispatcher();
export default UpdatesDispatch;
