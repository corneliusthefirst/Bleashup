/* eslint-disable quotes */
import { observable, action, keys } from "mobx";
import { find, findIndex, uniqBy, reject, isEmpty } from "lodash";
import storage from "./Storage";
import moment from "moment";
import GState from "./globalState";
import request from "../services/requestObjects";
import tcpRequest from "../services/tcpRequestData";
import EventListener from "../services/severEventListener";
import {
  getcurrentDateIntervalsNoneAsync,
  getCurrentDateIntervalNonAsync,
  getCurrentDateInterval,
} from "../services/getCurrentDateInterval";
import { format } from "../services/recurrenceConfigs";
//import { mapper } from '../services/mapper';
import { getcurrentDateIntervals } from "../services/getCurrentDateInterval";
import globalFunctions from '../components/globalFunctions';

export default class Reminds {
  constructor() {
    /*storage.remove(this.saveKey).then(() => {
      console.warn("removed");
    });*/
    this.initializeReminds();
    this.timer();
    this.initializeRemindsIntervals();
    this.intervalsSavetimer();
  }
  saveInterval = 2000;
  @observable allReminds = []
  currentSaveTime = moment().format();
  previousSaveTime = moment().format();
  initializeReminds() {
    storage
      .load(this.readKey)
      .then((data) => {
        this.Reminds = data;
        this.initallReminds()
      })
      .catch(() => {
        this.Reminds = {};
      });
  }
  initallReminds(justAll) {
    if (this.initTimeout) clearTimeout(this.initTimeout)
    this.initTimeout = setTimeout(() => {
      const vals = Object.keys(this.Reminds)
      let res = []
      vals.forEach(ele => {
        this.Reminds[ele] = globalFunctions.sortReminds(this.Reminds[ele])
        res = [...res, ...this.Reminds[ele]]
      })
      console.warn("initing all reminds ")
      this.allReminds = globalFunctions.sortReminds(res)
      clearTimeout(this.initTimeout)
      this.initTimeout = null
    }, justAll ? 1000 : 0)
  }
  initializeRemindsIntervals() {
    storage
      .load(this.saveIntervalsKeys)
      .then((data) => {
        this.remindsIntervals = data;
      })
      .catch((err) => {
        this.remindsIntervals = {};
      });
  }
  timer = () => {
    setInterval(() => {
      this.previousSaveTime !== this.currentSaveTime ? this.saver() : null;
    }, this.saveInterval);
  };
  intervalsSavetimer() {
    setInterval(() => {
      this.previousIntervalsSaveTime !== this.currentIntervalsSaveTime
        ? this.invervalsSaver()
        : null;
    }, this.saveInterval);
  }
  intervalKeys = "intervals";
  readIntervalsKey = {
    key: this.intervalKeys,
    autoSync: true,
  };
  saveIntervalsKeys = {
    key: this.intervalKeys,
    data: {},
  };
  @observable remindsIntervals = {};
  @observable Reminds = {};
  extraVotes = {};
  invervalsSaver() {
    if (Object.keys(this.remindsIntervals).length > 0) {
      console.warn("persisiting reminds intervals");
      this.saveIntervalsKeys.data = this.remindsIntervals;
      storage.save(this.saveIntervalsKeys).then(() => {
        this.previousIntervalsSaveTime = this.currentIntervalsSaveTime;
      });
    }
  }
  previousIntervalsSaveTime = moment().format();
  currentIntervalsSaveTime = moment().format();
  saver() {
    if (Object.keys(this.Reminds).length > 0) {
      console.warn("persisiting reminds");
      this.saveKey.data = this.Reminds;
      storage.save(this.saveKey).then(() => {
        this.previousSaveTime = this.currentSaveTime;
      });
    }
  }
  setIntervalProperties(data) {
    this.remindsIntervals = data;
    this.currentIntervalsSaveTime = moment().format();
    this.initallReminds(true)
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

  issetRemindIntervals(remind) {
    const firstEndate = this.issetRemindInterval(remind) &&
      this.remindsIntervals[remind.event_id][remind.id].currentDateIntervals
    return firstEndate && true
  }
  issetRemindInterval(remind) {
    return this.remindsIntervals[remind.event_id] &&
      this.remindsIntervals[remind.event_id][remind.id]
  }
  getRemindsIntervals(remind, fresh) {
    return new Promise((resolve, reject) => {
      if (!this.issetRemindIntervals(remind) || fresh) {
        this.computeRemindIntervals(remind).then((vals) => {
          resolve(vals);
        });
      } else {
        resolve(this.remindsIntervals[remind.event_id][remind.id]);
        setTimeout(() => {
          if (this.remindsIntervals[remind.event_id][remind.id].correspondingDateInterval) {
            this.getCurrentInterval(remind,
              this.remindsIntervals[remind.event_id][remind.id].currentDateIntervals)
          }
        })
      }
    });
  }

  setPropertyCleanForIntervals(remind, prop) {
    let canUpdate = !this.issetRemindInterval(remind) ||
      !this.remindsIntervals[remind.event_id][remind.id].correspondingDateInterval ||
      !prop.correspondingDateInterval ||
      (this.remindsIntervals[remind.event_id][remind.id].correspondingDateInterval.start
        !== prop.correspondingDateInterval.start)
    if (this.remindsIntervals[remind.event_id]) {
      this.remindsIntervals[remind.event_id][remind.id] = {
        ...this.remindsIntervals[remind.event_id][remind.id],
        ...prop,
        updated_at: canUpdate ? moment().format() :
          this.remindsIntervals[remind.event_id][remind.id].updated_at,
      };

    } else {
      this.remindsIntervals[remind.event_id] = {
        [remind.id]: {
          ...prop,
          updated_at: moment().format(),
        },
      };
    }
    this.setIntervalProperties(this.remindsIntervals);
  }
  getCurrentInterval(remind, currentDateIntervals) {
    return new Promise((resolve, reject) => {
      getCurrentDateInterval(currentDateIntervals,
        moment().format(format)).then((correspondingDateInterval) => {
          this.setPropertyCleanForIntervals(remind, { correspondingDateInterval })
          resolve({ correspondingDateInterval })
        })
    })
  }
  computeRemindIntervals(remind) {
    let remindPeriod = {
      start: moment(remind.period).format(format),
      end: moment(remind.recursive_frequency.recurrence).format(format),
    };
    const interval = remind.recursive_frequency.interval;
    const frequency = remind.recursive_frequency.frequency;
    const daysOfWeeek = remind.recursive_frequency.days_of_week;
    return new Promise((resolve, reject) => {
      getcurrentDateIntervals(
        remindPeriod,
        interval,
        frequency,
        daysOfWeeek
      ).then((currentDateIntervals) => {
        this.setPropertyCleanForIntervals(remind, { currentDateIntervals })
        this.getCurrentInterval(remind, currentDateIntervals)
        resolve({ currentDateIntervals });
      });
    });
  }
  @action addReminds(EventID, NewRemind) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        if (Reminds[EventID] && Reminds[EventID].length > 0) {
          if (Array.isArray(NewRemind)) {
            if (NewRemind.length === 1) {
              let RIndex = findIndex(Reminds[EventID], {
                id: NewRemind[0].id,
              });
              if (RIndex >= 0) {
                Reminds[EventID][RIndex] = NewRemind[0]
              } else {
                Reminds[EventID] = NewRemind.concat(Reminds[EventID]);
              }
            } else {
              Reminds[EventID] = uniqBy(
                NewRemind.concat(Reminds[EventID]),
                "id"
              );
            }
          } else {
            let RIndex = findIndex(Reminds[EventID], { id: NewRemind.id })
            if (RIndex >= 0) {
              Reminds[EventID][RIndex] = NewRemind
            } else {
              Reminds[EventID] = [NewRemind].concat(Reminds[EventID]);
            }
          }
        } else {
          Reminds[EventID] = Array.isArray(NewRemind) ? NewRemind : [NewRemind];
        }
        this.setProperty(Reminds);
        resolve();
      });
    });
  }

  loadReminds(EventID, fresh) {
    let sorter = (a, b) =>
      moment(a.created_at).format("x") > moment(b.created_at).format("x")
        ? -1
        : moment(a.created_at).format("x") < moment(b.created_at).format("x")
          ? 1
          : 0;
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Reminds) => {
        let ActReminds = Reminds[EventID];
        if (ActReminds && ActReminds.length > 1) {
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
              EventListener.sendRequest(JSONData, EventID + "get_reminds")
                .then((response) => {
                  if (
                    !response.data ||
                    response.data === "empty" ||
                    response.data === "no_such_value"
                  ) {
                    resolve(fresh ? JSON.stringify([]) : []);
                  } else {
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
  canUpdate(index) {
    return index >= 0
  }
  @action updateDescription(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let Remind = find(Reminds[EventID], { id: NewRemind.remind_id });
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        if (this.canUpdate(RemindIndex)) {
          console.warn(RemindIndex, NewRemind);
          Reminds[EventID][RemindIndex].description = NewRemind.description;
          Reminds[EventID][RemindIndex].updated_at = moment().format();
          Reminds[EventID][RemindIndex].description_updated = inform;
          Reminds[EventID][RemindIndex].updated = inform;
          this.setProperty(Reminds);
          resolve(Reminds[EventID][RemindIndex]);
        } else {
          resolve({})
        }
      });
    });
  }
  @action updateCalendarID(EventID, NewRemind, alarms, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        if (this.canUpdate(RemindIndex)) {
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
          this.setProperty(Reminds);
          resolve(Reminds[EventID][RemindIndex]);
        } else {
          resolve({})
        }
      });
    });
  }
  @action updateTitle(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        if (this.canUpdate(RemindIndex)) {
          const oldRem = JSON.stringify(Reminds[EventID][RemindIndex]);
          Reminds[EventID][RemindIndex].title = NewRemind.title;
          Reminds[EventID][RemindIndex].updated_at = moment().format();
          Reminds[EventID][RemindIndex].description_updated = inform;
          Reminds[EventID][RemindIndex].updated = inform;
          this.setProperty(Reminds);
          GState.eventUpdated = true;
          resolve(JSON.parse(oldRem));
        } else {
          resolve({})
        }
      });
    });
  }

  @action updateStatus(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        if (this.canUpdate(RemindIndex)) {
          Reminds[EventID][RemindIndex].status = NewRemind.status;
          Reminds[EventID][RemindIndex].updated_at = moment().format();
          Reminds[EventID][RemindIndex].description_updated = inform;
          Reminds[EventID][RemindIndex].updated = inform;
          //Reminds[EventID].splice(RemindIndex, 1, Reminds[EventID][RemindIndex]);

          this.setProperty(Reminds);
          GState.eventUpdated = true;
          resolve(Reminds[EventID][RemindIndex]);
        } else {
          resolve({})
        }
      });
    });
  }

  @action updateIsDoneState(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        if (this.canUpdate(RemindIndex)) {
          Reminds[EventID][RemindIndex].isDone = NewRemind.isDone;
          Reminds[EventID][RemindIndex].updated_at = moment().format();
          Reminds[EventID][RemindIndex].description_updated = inform;
          Reminds[EventID][RemindIndex].updated = inform;
          this.setProperty(Reminds);
          GState.eventUpdated = true;
          resolve(Reminds[EventID][RemindIndex]);
        } else {
          resolve({})
        }
      });
    });
  }

  @action updateRecursiveFrequency(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        if (this.canUpdate(RemindIndex)) {
          Reminds[EventID][RemindIndex].recursive_frequency =
            NewRemind.recursive_frequency;
          Reminds[EventID][RemindIndex].updated_at = moment().format();
          Reminds[EventID][RemindIndex].updated = inform;
          // Reminds[EventID].splice(RemindIndex, 1, Reminds[EventID][RemindIndex]);
          this.computeRemindIntervals(Reminds[EventID][RemindIndex]);
          this.setProperty(Reminds);
          GState.eventUpdated = true;
          resolve(Reminds[EventID][RemindIndex]);
        } else {
          resolve({})
        }
      });
    });
  }

  @action updateLocation(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        if (this.canUpdate(RemindIndex)) {
          Reminds[EventID][RemindIndex].location = NewRemind.location;
          Reminds[EventID][RemindIndex].updated_at = moment().format();
          Reminds[EventID][RemindIndex].description_updated = inform;
          Reminds[EventID][RemindIndex].updated = inform;
          this.setProperty(Reminds);
          GState.eventUpdated = true;
          resolve(Reminds[EventID][RemindIndex]);
        } else {
          resolve({})
        }
      });
    });
  }

  @action updateURL(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        if (this.canUpdate(RemindIndex)) {
          Reminds[EventID][RemindIndex].remind_url = NewRemind.url;
          Reminds[EventID][RemindIndex].updated_at = moment().format();
          Reminds[EventID][RemindIndex].description_updated = inform;
          Reminds[EventID][RemindIndex].updated = inform;
          this.setProperty(Reminds);
          GState.eventUpdated = true;
          resolve(Reminds[EventID][RemindIndex]);
        } else {
          resolve({})
        }
      });
    });
  }

  @action updatePeriod(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        if (this.canUpdate(RemindIndex)) {
          Reminds[EventID][RemindIndex].period = NewRemind.period;
          Reminds[EventID][RemindIndex].updated_at = moment().format();
          Reminds[EventID][RemindIndex].description_updated = inform;
          Reminds[EventID][RemindIndex].updated = inform;
          this.setProperty(Reminds);
          GState.eventUpdated = true;
          this.computeRemindIntervals(Reminds[EventID][RemindIndex]);
          resolve(Reminds[EventID][RemindIndex]);
        } else {
          resolve({})
        }
      });
    });
  }
  @action updateMembers(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        if (this.canUpdate(RemindIndex)) {
          Reminds[EventID][RemindIndex].members = NewRemind.members;
          Reminds[EventID][RemindIndex].updated_at = moment().format();
          Reminds[EventID][RemindIndex].description_updated = inform;
          Reminds[EventID][RemindIndex].updated = inform;
          this.setProperty(Reminds);
          GState.eventUpdated = true;
          resolve(Reminds[EventID][RemindIndex]);
        } else {
          resolve({})
        }
      });
    });
  }

  @action updateAll(EventID, NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Reminds) => {
        let RemindIndex = findIndex(Reminds[EventID], {
          id: NewRemind.remind_id,
        });
        if (this.canUpdate(RemindIndex)) {
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
          this.setProperty(Reminds);
          GState.eventUpdated = true;
          resolve(Reminds[EventID][RemindIndex]);
        } else {
          resolve({})
        }
      });
    });
  }

  addMembers(EventID, Remind, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Reminds) => {
        let index = findIndex(Reminds[EventID], { id: Remind.remind_id });
        if (this.canUpdate(index)) {
          Reminds[EventID][index].members &&
            Reminds[EventID][index].members.length > 0
            ? (Reminds[EventID][index].members = Array.isArray(Remind.members)
              ? Remind.members.concat(Reminds[EventID][index].members)
              : [Remind.members].concat(Reminds[EventID][index].members))
            : (Reminds[EventID][index].members = Array.isArray(Remind.members)
              ? Remind.members
              : [Remind.members]);
          Reminds[EventID][index].updated_at = moment().format();
          Reminds[EventID][index].updated = true;
          this.setProperty(Reminds);
          GState.eventUpdated = true;
          resolve(Reminds[EventID][index]);
        } else {
          resolve({})
        }
      });
    });
  }

  updateRequestReportOnComplete(EventID, Remind, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Reminds) => {
        let index = findIndex(Reminds[EventID], { id: Remind.remind_id });
        if (this.canUpdate(index)) {
          Reminds[EventID][index].must_report = Remind.must_report;
          Reminds[EventID][index].updated_at = moment().format();
          this.setProperty(Reminds);
          GState.eventUpdated = true;
          resolve(Reminds[EventID][index]);
        } else {
          resolve({})
        }
      });
    });
  }

  removeMember(EventID, remindUpdate, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Reminds) => {
        let index = findIndex(Reminds[EventID], { id: remindUpdate.remind_id });
        if (this.canUpdate(index)) {
          const oldMembers = Reminds[EventID][index].members
          Reminds[EventID][index].members = Reminds[EventID][
            index
          ].members.filter((ele) => ele &&
            Array.isArray(remindUpdate.members)
            ? remindUpdate.members.indexOf(ele.phone) < 0
            : ele.phone !== remindUpdate.members
          );
          Reminds[EventID][index].updated_at = moment().format();
          Reminds[EventID][index].updated = inform;
          this.setProperty(Reminds);
          GState.eventUpdated = true;
          resolve({ ...Reminds[EventID][index], members: oldMembers });
        } else {
          resolve({})
        }
      });
    });
  }

  makeAsDone(EventID, Remind, inform) {
    Remind.donners = Array.isArray(Remind.donners) ? Remind.donners : [Remind.donners]
    return new Promise((resolve, rejec) => {
      this.readFromStore().then((Reminds) => {
        let index = findIndex(Reminds[EventID], { id: Remind.remind_id });
        if (this.canUpdate(index)) {
          if (Reminds[EventID][index].donners &&
            Reminds[EventID][index].donners.length > 0) {
            Reminds[EventID][index].donners = reject(Reminds[EventID][index].donners,
              ele => ele && ele.phone == Remind.donners[0].phone && ele.status &&
                ele.status.date == Remind.donners[0].status.date)
            Reminds[EventID][index].donners =
              Remind.donners.concat(Reminds[EventID][index].donners)
          } else {
            Reminds[EventID][index].donners = Remind.donners
          }
          Reminds[EventID][index].updated_at = moment().format();
          Reminds[EventID][index].updated = true;
          this.setProperty(Reminds);
          GState.eventUpdated = true;
          resolve(Reminds[EventID][index]);
        } else {
          resolve({})
        }
      });
    });
  }

  confirm(EventID, Remind, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Reminds) => {
        let index = findIndex(Reminds[EventID], { id: Remind.remind_id });
        if (this.canUpdate(index)) {
          Reminds[EventID][index].confirmed &&
            Reminds[EventID][index].confirmed.length > 0
            ? (Reminds[EventID][index].confirmed = Array.isArray(Remind.confirmed)
              ? [...Remind.confirmed, ...Reminds[EventID][index].confirmed]
              : [...[Remind.confirmed], ...Reminds[EventID][index].confirmed])
            : (Reminds[EventID][index].confirmed = Array.isArray(Remind.confirmed)
              ? Remind.confirmed
              : [Remind.confirmed]);
          Reminds[EventID][index].updated_at = moment().format();
          Reminds[EventID][index].updated = true;
          this.setProperty(Reminds);
          GState.eventUpdated = true;
          resolve(Reminds[EventID][index]);
        } else {
          resolve({})
        }
      });
    });
  }

  @action removeRemind(EventID, RemindId) {
    return new Promise((resolve, RejectPromise) => {
      this.readFromStore().then((Reminds) => {
        let index = findIndex(Reminds[EventID], { id: RemindId });
        if (this.canUpdate(index)) {
          const oldRem = Reminds[EventID][index];
          Reminds[EventID] = reject(Reminds[EventID], { id: RemindId });
          RemindId === request.Remind().id
            ? Reminds[EventID].unshift(request.Remind())
            : null;
          this.setProperty(Reminds);
          GState.eventUpdated = true;
          resolve(oldRem);
        } else {
          resolve({})
        }
      });
    });
  }
  updateAlarmPatern(EventID, remindId, newAlarm, newDate) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((reminds) => {
        let index = findIndex(reminds[EventID], { id: remindId });
        if (this.canUpdate(index)) {
          const oldRemind = reminds[EventID][index];
          reminds[EventID][index].extra = {
            ...reminds[EventID][index].extra,
            alarms: newAlarm,
            date: newDate,
          };
          reminds[EventID][index].updated_at = moment().format();
          this.setProperty(reminds);
          GState.eventUpdated = true;
          resolve(oldRemind);
        } else {
          resolve({})
        }
      });
    });
  }

  loadRemindFromRemote(EventID, id) {
    return new Promise((resolve, reject) => {
      let RemindID = request.RemindID();
      RemindID.remind_id = id;
      tcpRequest.getRemind(RemindID, id + "_get_remind").then((JSONData) => {
        EventListener.sendRequest(JSONData, id + "_get_remind")
          .then((Remind) => {
            if (Remind.data !== "empty") {
              resolve(Remind.data);
            } else {
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      });
    });
  }

  loadRemind(EventID, id) {
    return new Promise((resolve, reject) => {
      if (typeof id == "object" && id.id) {
        resolve(id)
      } else {
        this.readFromStore().then((Rems) => {
          let rem = find(Rems[EventID], { id: id });
          if (rem) {
            resolve(rem);
          } else {
            this.loadRemindFromRemote(EventID, id)
              .then((Remind) => {
                console.warn("loaded remind from remote ", id);
                this.addReminds(EventID, Remind)
                  .then(() => {
                    Remind = Array.isArray(Remind) ? Remind[0] : Remind
                    resolve(Remind);
                  })
                  .catch(() => {
                    reject();
                  });
              })
              .catch((error) => {
                if (id === request.Remind().id) {
                  this.addReminds(EventID, request.Remind())
                    .then(() => {
                      resolve(request.Remind());
                    })
                    .catch(() => {
                      resolve(request.Remind());
                    });
                } else {
                  reject();
                }
              });
          }
        });
      }
    });
  }
  persistDimenssion(index, eventID, layout) {
    this.Reminds[eventID][index].dimensions = layout;
    this.setProperty(this.Reminds);
  }
  readFromStore() {
    return new Promise((resolve, rejectpromise) => {
      resolve(this.Reminds);
    });
  }
}
