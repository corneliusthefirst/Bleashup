/* eslint-disable quotes */
import { observable, action } from "mobx";
import { find, findIndex, uniqBy, reject } from "lodash";
import storage from "./Storage";
import moment from "moment";
import GState from "./globalState";
import request from "../services/requestObjects";
import tcpRequest from "../services/tcpRequestData";
import EventListener from "../services/severEventListener";
import {
  getcurrentDateIntervalsNoneAsync,
  getCurrentDateIntervalNonAsync,
} from "../services/getCurrentDateInterval";
import { format } from "../services/recurrenceConfigs";
//import { mapper } from '../services/mapper';

export default class Reminds {
  constructor() {
    //storage.remove(this.saveKey).then(() => {})
    this.initializeReminds();
    this.saveInterval = setInterval(() => {
      this.previousSaveTime !== this.currentSaveTime ? this.saver() : null;
    }, this.saveInterval);
  }
  saveInterval = 2000;
  saverInterval = null;
  currentSaveTime = moment().format();
  previousSaveTime = moment().format();
  initializeReminds() {
    console.warn("initializing Reminds");
    storage
      .load(this.readKey)
      .then((data) => {
        this.Reminds = data;
      })
      .catch(() => {
        this.Reminds = {};
      });
  }
  @observable Reminds = {};
  extraVotes = {};
  saver() {
    if (Object.keys(this.Reminds) > 0) {
      console.warn("persisiting reminds");
      this.saveKey.data = this.Reminds;
      storage.save(this.saveKey).then(() => {
        this.previousSaveTime = this.currentSaveTime;
      });
    }
  }
  setProperty(Reminds) {
    this.Reminds = Reminds;
    this.currentSaveTime = moment().format();
  }
  saveKey = {
    key: "reminds",
    data: {},
  };
  readKey = {
    key: "reminds",
    autoSync: true,
  };

  @action addReminds(EventID, NewRemind) {
    console.warn("new remind is ", NewRemind);
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        if (Reminds[EventID] && Reminds[EventID].length > 0) {
          if (Array.isArray(NewRemind)) {
            if (NewRemind.length === 1) {
              Reminds[EventID] = reject(Reminds[EventID], {
                id: NewRemind[0].id,
              });
              Reminds[EventID] = NewRemind.concat(Reminds[EventID]);
            } else {
              Reminds[EventID] = uniqBy(
                NewRemind.concat(Reminds[EventID]),
                "id"
              );
            }
          } else {
            Reminds[EventID] = reject(Reminds[EventID], { id: NewRemind.id });
            Reminds[EventID] = [NewRemind].concat(Reminds[EventID]);
          }
        } else {
          Reminds[EventID] = Array.isArray(NewRemind) ? NewRemind : [NewRemind];
        }

        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          console.warn("Remind added here", this.keyData.data);
          this.Reminds = this.keyData.data;
          resolve();
        });
      });
    });
  }

  loadReminds(EventID, fresh) {
    let sorter = (a, b) =>
      a.created_at > b.created_at ? -1 : a.created_at < b.created_at ? 1 : 0;
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Reminds) => {
        let ActReminds = Reminds[EventID];
        if (ActReminds && ActReminds.length > 0) {
          resolve(
            fresh
              ? JSON.stringify(ActReminds.sort(sorter))
              : ActReminds.sort(sorter)
          );
        } else {
          let getRemind = request.EventID();
          getRemind.event_id = EventID;
          tcpRequest
            .getReminds(getRemind, EventID + "get_reminds")
            .then((JSONData) => {
              console.warn("here they are ", JSONData);
              EventListener.sendRequest(JSONData, EventID + "get_reminds")
                .then((response) => {
                  console.warn("here is the response", response);
                  if (
                    !response.data ||
                    response.data === "empty" ||
                    response.data === "no_such_value"
                  ) {
                    resolve(fresh ? JSON.stringify([]) : []);
                  } else {
                    console.warn("response is ", response.data);
                    this.addReminds(EventID, response.data).then(() => {
                      resolve(
                        fresh
                          ? JSON.stringify(response.data.sort(sorter))
                          : (response.data && response.data.sort(sorter)) || []
                      );
                    });
                  }
                })
                .catch(() => {
                  resolve(fresh ? JSON.stringify([]) : []);
                });
            });
        }
      });
    });
  }

  @action updateDescription(NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let Remind = find(Reminds, { id: NewRemind.remind_id });
        RemindIndex = findIndex(Reminds, { id: NewRemind.remind_id });
        Remind.description = NewRemind.description;
        Remind.updated_at = moment().format();
        Remind.description_updated = inform;
        Remind.updated = inform;
        Reminds.splice(RemindIndex, 1, Remind);
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Remind);
        });
      });
    });
  }
  @action updateCalendarID(NewRemind, alarms, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        RemindIndex = findIndex(Reminds, { id: NewRemind.remind_id });
        Reminds[RemindIndex].calendar_id = !NewRemind.calendar_id
          ? null
          : NewRemind.calendar_id;
        Reminds[RemindIndex].alarms = Reminds[RemindIndex].alarms
          ? Reminds[RemindIndex].alarms
          : alarms;
        Reminds[RemindIndex].updated_at = moment().format();
        Reminds[RemindIndex].description_updated = inform;
        Reminds[RemindIndex].updated = inform;
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Reminds[RemindIndex]);
        });
      });
    });
  }
  @action updateTitle(NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let Remind = find(Reminds, { id: NewRemind.remind_id });
        RemindIndex = findIndex(Reminds, { id: NewRemind.remind_id });
        Remind.title = NewRemind.title;
        Remind.updated_at = moment().format();
        Remind.description_updated = inform;
        Remind.updated = inform;
        Reminds.splice(RemindIndex, 1, Remind);
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Remind);
        });
      });
    });
  }
  @action updateStatus(NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let Remind = find(Reminds, { id: NewRemind.remind_id });
        RemindIndex = findIndex(Reminds, { id: NewRemind.remind_id });
        Remind.status = NewRemind.status;
        Remind.updated_at = moment().format();
        Remind.description_updated = inform;
        Remind.updated = inform;
        Reminds.splice(RemindIndex, 1, Remind);
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Remind);
        });
      });
    });
  }

  @action updateIsDoneState(NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let Remind = find(Reminds, { id: NewRemind.remind_id });
        RemindIndex = findIndex(Reminds, { id: NewRemind.remind_id });
        Remind.isDone = NewRemind.isDone;
        Remind.updated_at = moment().format();
        Remind.description_updated = inform;
        Remind.updated = inform;
        Reminds.splice(RemindIndex, 1, Remind);
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve();
        });
      });
    });
  }

  @action updateAll(NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let Remind = find(Reminds, { id: NewRemind.remind_id });
        RemindIndex = findIndex(Reminds, { id: NewRemind.remind_id });
        Remind.title = NewRemind.title;
        Remind.description = NewRemind.description;
        Remind.recursive_frequency = NewRemind.recursive_frequency;
        Remind.period = NewRemind.period;
        Remind.status = NewRemind.status;
        Remind.members = NewRemind.members;
        Remind.updated_at = moment().format();
        Remind.description_updated = inform;
        Remind.updated = inform;
        Reminds.splice(RemindIndex, 1, Remind);
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve();
        });
      });
    });
  }
  addMembers(Remind, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Reminds) => {
        let index = findIndex(Reminds, { id: Remind.remind_id });
        ///console.warn(Reminds[index].members.length, Remind.members)
        Reminds[index].members && Reminds[index].members.length > 0
          ? (Reminds[index].members = Array.isArray(Remind.members)
              ? Remind.members.concat(Reminds[index].members)
              : [Remind.members].concat(Reminds[index].members))
          : (Reminds[index].members = Array.isArray(Remind.members)
              ? Remind.members
              : [Remind.members]);
        inform ? (Reminds[index].updated_at = moment().format()) : null;
        Reminds[index].updated = true;
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Reminds[index]);
        });
      });
    });
  }
  updateRequestReportOnComplete(Remind, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Reminds) => {
        let index = findIndex(Reminds, { id: Remind.remind_id });
        Reminds[index].must_report = Remind.must_report;
        if (inform) {
          Reminds[index].updated_at = moment().format();
        }
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          resolve(Reminds[index]);
        });
      });
    });
  }
  removeMember(remindUpdate, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Reminds) => {
        let index = findIndex(Reminds, { id: remindUpdate.remind_id });
        Reminds[index].members = Reminds[index].members.filter((ele) =>
          Array.isArray(remindUpdate.members)
            ? remindUpdate.members.indexOf(ele.phone) < 0
            : ele.phone !== remindUpdate.members
        );
        inform ? (Reminds[index].updated_at = moment().format()) : null;
        Reminds[index].updated = inform;
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Reminds[index]);
        });
      });
    });
  }
  makeAsDone(Remind, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Reminds) => {
        let index = findIndex(Reminds, { id: Remind.remind_id });
        Reminds[index].donners && Reminds[index].donners.length > 0
          ? (Reminds[index].donners = Array.isArray(Remind.donners)
              ? Remind.donners.concat(Reminds[index].donners)
              : [Remind.donners].concat(Reminds[index].donners))
          : (Reminds[index].donners = Array.isArray(Remind.donners)
              ? Remind.donners
              : [Remind.donners]);
        inform ? (Reminds[index].updated_at = moment().format()) : null;
        Reminds[index].updated = true;
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Reminds[index]);
        });
      });
    });
  }
  confirm(Remind, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Reminds) => {
        let index = findIndex(Reminds, { id: Remind.remind_id });
        Reminds[index].confirmed && Reminds[index].confirmed.length > 0
          ? (Reminds[index].confirmed = Array.isArray(Remind.confirmed)
              ? [...Remind.confirmed, ...Reminds[index].confirmed]
              : [...[Remind.confirmed], ...Reminds[index].confirmed])
          : (Reminds[index].confirmed = Array.isArray(Remind.confirmed)
              ? Remind.confirmed
              : [Remind.confirmed]);
        inform ? (Reminds[index].updated_at = moment().format()) : null;
        Reminds[index].updated = true;
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Reminds[index]);
        });
      });
    });
  }
  @action updateRecursiveFrequency(rem, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds, { id: rem.remind_id });
        Reminds[RemindIndex].recursive_frequency = rem.recursive_frequency;
        Reminds[RemindIndex].updated_at = moment().format();
        Reminds[RemindIndex].updated = inform;
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Reminds[RemindIndex]);
        });
      });
    });
  }
  @action updateLocation(rem, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds, { id: rem.remind_id });
        Reminds[RemindIndex].location = rem.location;
        Reminds[RemindIndex].updated_at = moment().format();
        Reminds[RemindIndex].updated = inform;
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Reminds[RemindIndex]);
        });
      });
    });
  }
  @action updateURL(rem, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds, { id: rem.remind_id });
        Reminds[RemindIndex].remind_url = rem.url;
        Reminds[RemindIndex].updated_at = moment().format();
        Reminds[RemindIndex].updated = inform;
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Reminds[RemindIndex]);
        });
      });
    });
  }

  @action updateRecurrence(NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let Remind = find(Reminds, { id: NewRemind.remind_id });
        RemindIndex = findIndex(Reminds, { id: NewRemind.remind_id });
        console.warn(NewRemind.recurrence, "pppp");
        Remind.recursive_frequency = NewRemind.recurrence;
        Remind.updated_at = moment().format();
        Remind.description_updated = inform;
        Remind.updated = inform;
        Remind = [Remind][0];
        Reminds.splice(RemindIndex, 1, Remind);
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Remind);
        });
      });
    });
  }

  @action updatePeriod(NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let Remind = find(Reminds, { id: NewRemind.remind_id });
        RemindIndex = findIndex(Reminds, { id: NewRemind.remind_id });
        Remind.period = NewRemind.period;
        Remind.updated_at = moment().format();
        Remind.description_updated = inform;
        Remind = [Remind][0];
        Remind.updated = inform;
        Reminds.splice(RemindIndex, 1, Remind);
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Remind);
        });
      });
    });
  }

  @action updateMembers(NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let Remind = find(Reminds, { id: NewRemind.remind_id });
        RemindIndex = findIndex(Reminds, { id: NewRemind.remind_id });
        Remind.members = NewRemind.members;
        Remind.updated_at = moment().format();
        Remind.members_updated = inform;
        Remind.updated = inform;
        Reminds.splice(RemindIndex, 1, Remind);
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve();
        });
      });
    });
  }

  @action removeRemind(RemindId) {
    console.warn("removing remind", RemindId);
    return new Promise((resolve, RejectPromise) => {
      this.readFromStore().then((Reminds) => {
        let OldRemind = find(Reminds, { id: RemindId });
        Reminds = reject(Reminds, ["id", RemindId]);
        RemindId === "newRemindId" ? Reminds.unshift(request.Remind()) : null;
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          this.Reminds = this.keyData.data;
          resolve(OldRemind);
        });
      });
    });
  }
  loadRemindFromRemote(id) {
    return new Promise((resolve, reject) => {
      let RemindID = request.RemindID();
      RemindID.remind_id = id;
      tcpRequest.getRemind(RemindID, id + "_get_remind").then((JSONData) => {
        EventListener.sendRequest(JSONData, id + "_get_remind").then(
          (Remind) => {
            console.warn(Remind);
            if (Remind.data !== "empty") {
              resolve(Remind.data);
            } else {
              reject();
            }
          }
        );
      });
    });
  }
  loadRemind(id) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Rems) => {
        let rem = find(Rems, { id: id });
        if (rem) {
          resolve(rem);
        } else {
          this.loadRemindFromRemote(id)
            .then((remind) => {
              this.addReminds(remind)
                .then(() => {
                  resolve(Remind.data);
                })
                .catch(() => {
                  resolve();
                });
            })
            .catch(() => {
              resolve();
            });
        }
      });
    });
  }
  readFromStore() {
    return new Promise((resolve, rejevt) => {
      storage
        .load({
          key: "reminds",
          autoSync: true,
        })
        .then((Contacts) => {
          resolve(Contacts);
        })
        .catch((error) => {
          resolve([]);
        });
    });
  }
}
