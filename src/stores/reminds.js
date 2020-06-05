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
    //storage.remove(this.saveKey).then(() => {});
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
    if (Object.keys(this.Reminds).length > 0) {
      console.warn("persisiting reminds foolish", this.Reminds);
      this.saveKey.data = this.Reminds;
      storage.save(this.saveKey).then(() => {
        this.previousSaveTime = this.currentSaveTime;
      });
    }
  }
  setProperty(Reminds) {
    this.Reminds = Reminds;
    console.warn("here foolish", this.Reminds);
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
        console.warn("from readFrom store", Reminds);
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
        console.warn("here is the remind", Reminds);
        this.setProperty(Reminds);
        resolve();
      });
    });
  }

  loadReminds(EventID, fresh) {
    console.warn("am in");
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

  @action updateDescription(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let Remind = find(Reminds[EventID], { id: NewRemind.remind_id });
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        Remind.description = NewRemind.description;
        Remind.updated_at = moment().format();
        Remind.description_updated = inform;
        Remind.updated = inform;
        Reminds[EventID].splice(RemindIndex, 1, Remind);
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Remind);
        });
      });
    });
  }
  @action updateCalendarID(EventID, NewRemind, alarms, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        Reminds[EventID][RemindIndex].calendar_id = !NewRemind.calendar_id
          ? null
          : NewRemind.calendar_id;
        Reminds[EventID][RemindIndex].alarms = Reminds[EventID][RemindIndex]
          .alarms
          ? Reminds[EventID][RemindIndex].alarms
          : alarms;
        Reminds[EventID][RemindIndex].updated_at = moment().format();
        Reminds[EventID][RemindIndex].description_updated = inform;
        Reminds[EventID][RemindIndex].updated = inform;
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Reminds[EventID][RemindIndex]);
        });
      });
    });
  }
  @action updateTitle(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        Reminds[EventID][RemindIndex].title = NewRemind.title;
        Reminds[EventID][RemindIndex].updated_at = moment().format();
        Reminds[EventID][RemindIndex].description_updated = inform;
        Reminds[EventID][RemindIndex].updated = inform;
        Reminds[EventID].splice(RemindIndex, 1, Reminds[EventID][RemindIndex]);

        this.setProperty(Reminds);
        GState.eventUpdated = true;
        resolve(Reminds[EventID][RemindIndex]);
      });
    });
  }

  @action updateStatus(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        Reminds[EventID][RemindIndex].status = NewRemind.status;
        Reminds[EventID][RemindIndex].updated_at = moment().format();
        Reminds[EventID][RemindIndex].description_updated = inform;
        Reminds[EventID][RemindIndex].updated = inform;
        Reminds[EventID].splice(RemindIndex, 1, Reminds[EventID][RemindIndex]);

        this.setProperty(Reminds);
        GState.eventUpdated = true;
        resolve(Reminds[EventID][RemindIndex]);
      });
    });
  }

  @action updateIsDoneState(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        Reminds[EventID][RemindIndex].isDone = NewRemind.isDone;
        Reminds[EventID][RemindIndex].updated_at = moment().format();
        Reminds[EventID][RemindIndex].description_updated = inform;
        Reminds[EventID][RemindIndex].updated = inform;
        Reminds[EventID].splice(RemindIndex, 1, Reminds[EventID][RemindIndex]);

        this.setProperty(Reminds);
        GState.eventUpdated = true;
        resolve(Reminds[EventID][RemindIndex]);
      });
    });
  }

  @action updateRecursiveFrequency(EventID, NewRemind, inform) {
    console.warn("entered  updateRecursiveFrequenc ");
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        Reminds[EventID][RemindIndex].recursive_frequency =
          NewRemind.recursive_frequency;
        Reminds[EventID][RemindIndex].updated_at = moment().format();
        Reminds[EventID][RemindIndex].description_updated = inform;
        Reminds[EventID][RemindIndex].updated = inform;
        Reminds[EventID].splice(RemindIndex, 1, Reminds[EventID][RemindIndex]);

        this.setProperty(Reminds);
        GState.eventUpdated = true;
        resolve(Reminds[EventID][RemindIndex]);
      });
    });
  }

  @action updateLocation(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        Reminds[EventID][RemindIndex].location = NewRemind.location;
        Reminds[EventID][RemindIndex].updated_at = moment().format();
        Reminds[EventID][RemindIndex].description_updated = inform;
        Reminds[EventID][RemindIndex].updated = inform;
        Reminds[EventID].splice(RemindIndex, 1, Reminds[EventID][RemindIndex]);

        this.setProperty(Reminds);
        GState.eventUpdated = true;
        resolve(Reminds[EventID][RemindIndex]);
      });
    });
  }

  @action updateURL(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        Reminds[EventID][RemindIndex].remind_url = NewRemind.url;
        Reminds[EventID][RemindIndex].updated_at = moment().format();
        Reminds[EventID][RemindIndex].description_updated = inform;
        Reminds[EventID][RemindIndex].updated = inform;
        Reminds[EventID].splice(RemindIndex, 1, Reminds[EventID][RemindIndex]);

        this.setProperty(Reminds);
        GState.eventUpdated = true;
        resolve(Reminds[EventID][RemindIndex]);
      });
    });
  }

  @action updatePeriod(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        Reminds[EventID][RemindIndex].period = NewRemind.period;
        Reminds[EventID][RemindIndex].updated_at = moment().format();
        Reminds[EventID][RemindIndex].description_updated = inform;
        Reminds[EventID][RemindIndex].updated = inform;
        Reminds[EventID].splice(RemindIndex, 1, Reminds[EventID][RemindIndex]);

        this.setProperty(Reminds);
        GState.eventUpdated = true;
        resolve(Reminds[EventID][RemindIndex]);
      });
    });
  }
  @action updateMembers(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        Reminds[EventID][RemindIndex].members = NewRemind.members;
        Reminds[EventID][RemindIndex].updated_at = moment().format();
        Reminds[EventID][RemindIndex].description_updated = inform;
        Reminds[EventID][RemindIndex].updated = inform;
        Reminds[EventID].splice(RemindIndex, 1, Reminds[EventID][RemindIndex]);

        this.setProperty(Reminds);
        GState.eventUpdated = true;
        resolve(Reminds[EventID][RemindIndex]);
      });
    });
  }

  @action updateAll(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        Reminds[EventID][RemindIndex].title = NewRemind.title;
        Reminds[EventID][RemindIndex].description = NewRemind.description;
        Reminds[EventID][RemindIndex].recursive_frequency =
          NewRemind.recursive_frequency;
        Reminds[EventID][RemindIndex].period = NewRemind.period;
        Reminds[EventID][RemindIndex].status = NewRemind.status;
        Reminds[EventID][RemindIndex].members = NewRemind.members;
        Reminds[EventID][RemindIndex].updated_at = moment().format();
        Reminds[EventID][RemindIndex].description_updated = inform;
        Reminds[EventID][RemindIndex].updated = inform;
        Reminds[EventID].splice(RemindIndex, 1, Reminds[EventID][RemindIndex]);

        this.setProperty(Reminds);
        GState.eventUpdated = true;
        resolve(Reminds[EventID][RemindIndex]);
      });
    });
  }

  addMembers(EventID, Remind, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Reminds) => {
        let index = findIndex(Reminds[EventID], { id: Remind.remind_id });
        Reminds[EventID][index].members &&
        Reminds[EventID][index].members.length > 0
          ? (Reminds[EventID][index].members = Array.isArray(Remind.members)
              ? Remind.members.concat(Reminds[EventID][index].members)
              : [Remind.members].concat(Reminds[EventID][index].members))
          : (Reminds[EventID][index].members = Array.isArray(Remind.members)
              ? Remind.members
              : [Remind.members]);
        inform
          ? (Reminds[EventID][index].updated_at = moment().format())
          : null;
        Reminds[EventID][index].updated = true;
        this.setProperty(Reminds);
        GState.eventUpdated = true;
        resolve(Reminds[EventID][index]);
      });
    });
  }

  updateRequestReportOnComplete(EventID, Remind, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Reminds) => {
        let index = findIndex(Reminds[EventID], { id: Remind.remind_id });
        Reminds[EventID][index].must_report = Remind.must_report;
        if (inform) {
          Reminds[EventID][index].updated_at = moment().format();
        }
        this.setProperty(Reminds);
        GState.eventUpdated = true;
        resolve(Reminds[EventID][index]);
      });
    });
  }

  removeMember(EventID, remindUpdate, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Reminds) => {
        let index = findIndex(Reminds[EventID], { id: remindUpdate.remind_id });
        Reminds[EventID][index].members = Reminds[EventID][
          index
        ].members.filter((ele) =>
          Array.isArray(remindUpdate.members)
            ? remindUpdate.members.indexOf(ele.phone) < 0
            : ele.phone !== remindUpdate.members
        );
        inform
          ? (Reminds[EventID][index].updated_at = moment().format())
          : null;
        Reminds[EventID][index].updated = inform;
        this.setProperty(Reminds);
        GState.eventUpdated = true;
        resolve(Reminds[EventID][index]);
      });
    });
  }

  makeAsDone(EventID, Remind, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Reminds) => {
        let index = findIndex(Reminds[EventID], { id: Remind.remind_id });
        Reminds[EventID][index].donners &&
        Reminds[EventID][index].donners.length > 0
          ? (Reminds[EventID][index].donners = Array.isArray(Remind.donners)
              ? Remind.donners.concat(Reminds[EventID][index].donners)
              : [Remind.donners].concat(Reminds[EventID][index].donners))
          : (Reminds[index].donners = Array.isArray(Remind.donners)
              ? Remind.donners
              : [Remind.donners]);
        inform
          ? (Reminds[EventID][index].updated_at = moment().format())
          : null;
        Reminds[EventID][index].updated = true;
        this.setProperty(Reminds);
        GState.eventUpdated = true;
        resolve(Reminds[EventID][index]);
      });
    });
  }

  confirm(EventID, Remind, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Reminds) => {
        let index = findIndex(Reminds[EventID], { id: Remind.remind_id });
        Reminds[EventID][index].confirmed &&
        Reminds[EventID][index].confirmed.length > 0
          ? (Reminds[EventID][index].confirmed = Array.isArray(Remind.confirmed)
              ? [...Remind.confirmed, ...Reminds[EventID][index].confirmed]
              : [...[Remind.confirmed], ...Reminds[EventID][index].confirmed])
          : (Reminds[EventID][index].confirmed = Array.isArray(Remind.confirmed)
              ? Remind.confirmed
              : [Remind.confirmed]);
        inform
          ? (Reminds[EventID][index].updated_at = moment().format())
          : null;
        Reminds[EventID][index].updated = true;
        this.setProperty(Reminds);
        GState.eventUpdated = true;
        resolve(Reminds[EventID][index]);
      });
    });
  }

  @action removeRemind(EventID, RemindId) {
    console.warn("removing remind", RemindId);
    return new Promise((resolve, RejectPromise) => {
      this.readFromStore().then((Reminds) => {
        let index = find(Reminds[EventID], { id: RemindId });
        Reminds[EventID] = reject(Reminds[EventID], ["id", RemindId]);
        RemindId === "newRemindId"
          ? Reminds[EventID].unshift(request.Remind())
          : null;
        this.setProperty(Reminds);
        GState.eventUpdated = true;
        resolve(Reminds[EventID][index]);
      });
    });
  }

  loadRemindFromRemote(EventID, id) {
    console.warn("here is the request 1", EventID, id);
    return new Promise((resolve, reject) => {
      let RemindID = request.RemindID();
      RemindID.remind_id = id;
      tcpRequest.getRemind(RemindID, id + "_get_remind").then((JSONData) => {
        console.warn("here is the request 2", RemindID, id, JSONData);
        EventListener.sendRequest(JSONData, id + "_get_remind").then(
          (Remind) => {
            console.warn("here is the request 3", Remind);
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

  loadRemind(EventID, id) {
    console.warn("after remote", EventID, id);
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Rems) => {
        let rem = find(Rems[EventID], { id: id });
        if (rem) {
          resolve(rem);
        } else {
          this.loadRemindFromRemote(EventID, id)
            .then((Remind) => {
              console.warn("after remote 2", Remind);
              this.addReminds(EventID, Remind)
                .then(() => {
                  resolve(Remind.data);
                })
                .catch(() => {
                  resolve();
                });
            })
            .catch((error) => {
              if (id === request.Remind().id) {
                this.addReminds(EventID, request.Remind())
                  .then(() => {
                    console.warn("added boy");
                    resolve();
                  })
                  .catch(() => {
                    resolve();
                  });
              }
              resolve({});
            });
        }
      });
    });
  }
  readFromStore() {
    return new Promise((resolve, rejectpromise) => {
      resolve(this.Reminds);
    });
  }
}
