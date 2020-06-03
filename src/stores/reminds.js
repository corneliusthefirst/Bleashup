import { observable, action } from "mobx";
import { find, findIndex, uniqBy, reject } from "lodash";
import storage from "./Storage";
import stores from './index';
import moment from "moment";
import GState from "./globalState";
import request from '../services/requestObjects';
import tcpRequest from '../services/tcpRequestData';
import EventListener from '../services/severEventListener';
import { getcurrentDateIntervalsNoneAsync, getCurrentDateIntervalNonAsync } from "../services/getCurrentDateInterval";
import { format } from "../services/recurrenceConfigs";
//import { mapper } from '../services/mapper';
export default class Reminds {
  constructor() {
    this.initilizeReminds()
    this.saveInterval = setInterval(() => {
        this.previousSaveTime !== this.currentSaveTime ?
            this.saver() : null
    }, this.saveInterval)

}

saveInterval = 2000
saverInterval = null
currentSaveTime = moment().format()
previousSaveTime = moment().format()
initilizeReminds() {
    console.warn("initializing reminds")
    storage.load(this.readKey).then(data => {
        this.Reminds = data
    }).catch(() => {
        this.Reminds = {}
    })
} 

@observable Reminds = {};

saver() {
    if (Object.keys(this.Reminds > 0)) {
        console.warn("persisiting reminds")
        this.saveKey.data = this.Reminds
        storage.save(this.saveKey).then(() => {
            this.previousSaveTime = this.currentSaveTime
        })
    }
}
saveKey = {
    key: "Reminds",
    data: {}
};
extraReminds = {}

setProperty(reminds) {
  this.Reminds = reminds
  GState.eventUpdated = true;
  this.currentSaveTime = moment().format()
}



loadRemindFromRemote(remindID, simple) {
  return new Promise((resolve, reject) => {
      //if (this.extraReminds[remindID]) {
      //    resolve(this.extraReminds[remindID])
      //} else {
          let RID = request.RemindID()
          RID.remind_id = remindID
          tcpRequest.getReminds(RID, remindID + '_get_reminds').then(JSONData => {
            EventListener.sendRequest(JSONData, RID.event_id + "_get_reminds").then(remind => {
                  if (remind.data === 'empty' || !remind.data) {
                      resolve(request.Remind())
                  } else {
                      this.extraReminds[remindID] = remind.data
                      simple ? resolve(remind.data) : this.addRemind(EventID, remind.data).then(() => {
                          resolve(remind.data)
                      })
                  }
              }).catch(() => {
                  resolve(request.Remind())
              })
          })
    //  }
  })
}




loadRemind(EventID, remindID) {
    return new Promise((resolve, reject) => {
        this.readFromStore().then(Reminds => {
            if (Reminds[EventID] && Reminds[EventID].length > 0) {
                let remind = find(Reminds[EventID], { id: remindID })
                if (remind) {
                    resolve(remind)
                } else {
                    if (remindID === request.Remind().id) {
                        this.addReminds(EventID, request.Remind()).then(() => {
                            resolve(request.Remind())
                        })
                    } else {
                        this.loadRemindFromRemote(remindID).then((remoteRemind) => {
                            console.warn("reminds fetched from remote", remoteRemind)
                            resolve(remoteRemind)
                        })
                    }
                }
            } else {
                if (remindID === request.Remind().id) {
                    this.addReminds(EventID, request.Remind()).then(() => {
                        resolve(request.Remind())
                    })
                } else {
                    this.loadRemindFromRemote(remindID).then((remoteRemind) => {
                        console.warn("reminds fetched from remote", remoteRemind)
                        resolve(remoteRemind)
                    })
                }
            }
        })
    })
}


loadRemindsFromRemote(EventID) {
  return new Promise((resolve, reject) => {
          let EID = request.EventID();
          EID.event_id = EventID;
          console.warn('here 2');
          tcpRequest.getReminds(EID, EventID + '_get_reminds').then(JSONData => {
            console.warn('here 3');
            EventListener.sendRequest(JSONData, EID.event_id + "_get_reminds").then(reminds => {
                  console.warn('here 4');
                  if (reminds.data === 'empty' || !reminds.data) {
                      console.warn('here 5');
                      resolve([request.Remind()]);
                  } else {
                      console.warn('here 6');
                      resolve(reminds.data)
                  }
              }).catch(() => {
                  resolve([request.Remind()])
              })
          })
  })
}

loadReminds(EventID) {
  return new Promise((resolve, reject) => {
      this.readFromStore().then(Reminds => {
        if (Reminds[EventID] && Reminds[EventID].length > 0) {
         resolve(Reminds[EventID]);
        }
        else {
          console.warn('here 1');
          this.loadRemindsFromRemote(EventID).then((remoteReminds) => {
            console.warn("reminds fetched from remote", remoteReminds)
            resolve(remoteReminds)
          })
        }
      })
  })
}


addReminds(EventID, Remind) {
    return new Promise((resolve, rejectPromise) => {
        this.readFromStore().then(Reminds => {
            Reminds[EventID] = reject(Reminds[EventID], { id: Remind.id })
            if (Reminds[EventID] && Reminds[EventID].length > 0) {
                Reminds[EventID][Reminds[EventID].length] = {
                    ...Remind,
                    index: Reminds[EventID].length
                }
                this.setProperty(Reminds)
                resolve()
            }
            else {
                Reminds[EventID] = [{ ...Remind, index: 0 }]

                this.setProperty(Reminds)
                resolve()
            }

        });
    });
}

removeRemind(EventID, RemindID) {
    return new Promise((resolve, rejectPromise) => {
        this.readFromStore().then(Reminds => {
            let remind = find(Reminds[EventID], { id: RemindID })
            Reminds[EventID] = reject(Reminds[EventID], { id: RemindID });
            RemindID === "newRemindId" ? Reminds[EventID].unshift(request.Remind()) : null

            this.setProperty(Reminds)
            resolve(remind);
        });
    });
}



updateTitle(EventID, NewRemind, inform) {
    return new Promise((resolve, reject) => {
        this.readFromStore().then(Reminds => {
            let index = findIndex(Reminds[EventID], { id: NewRemind.remind_id })
            Reminds[EventID][index].title = NewRemind.new_title

            inform ? Reminds[EventID][index].updated_at = moment().format() : null
            Reminds[EventID][index].updated = inform

            this.setProperty(Reminds)
            resolve(Reminds[EventID][index]);
        });
    });
}
updateDescription(EventID, NewRemind, inform) {
    return new Promise((resolve, reject) => {
        this.readFromStore().then(Reminds => {
            let index = findIndex(Reminds[EventID], { id: NewRemind.remind_id })
            Reminds[EventID][index].description = NewRemind.new_description

            inform ? Reminds[EventID][index].updated_at = moment().format() : null
            Reminds[EventID][index].updated = inform

            this.setProperty(Reminds)
            resolve(Reminds[EventID][index]);
        });
    });
}

updatePeriod(EventID, NewRemind, inform) {
    return new Promise((resolve, reject) => {
        this.readFromStore().then(Reminds => {
            let index = findIndex(Reminds[EventID], { id: NewRemind.remind_id })
            let previousRemind = Reminds[EventID][index]
            Reminds[EventID][index].period = NewRemind.period

            inform ? Reminds[EventID][index].updated_at = moment().format() : null
            Reminds[EventID][index].updated = inform

            this.setProperty(Reminds)
            resolve(previousRemind)
        });
    });
}

updateMembers(EventID, NewRemind, inform) {
  return new Promise((resolve, reject) => {
      this.readFromStore().then(Reminds => {
          let index = findIndex(Reminds[EventID], { id: NewRemind.remind_id })
          let previousRemind = Reminds[EventID][index]
          Reminds[EventID][index].members = NewRemind.members

          inform ? Reminds[EventID][index].updated_at = moment().format() : null
          Reminds[EventID][index].updated = inform

          this.setProperty(Reminds)
          resolve(previousRemind)
      });
  });
}

updateCalendarID(EventID, NewRemind,alarms, inform) {
  return new Promise((resolve, reject) => {
      this.readFromStore().then(Reminds => {
          let index = findIndex(Reminds[EventID], { id: NewRemind.remind_id })
          let previousRemind = Reminds[EventID][index]
          Reminds[EventID][RemindIndex].calendar_id = !NewRemind.calendar_id ? null : NewRemind.calendar_id;
          Reminds[EventID][RemindIndex].alarms = Reminds[EventID][RemindIndex].alarms ? Reminds[EventID][RemindIndex].alarms : alarms

          inform ? Reminds[EventID][index].updated_at = moment().format() : null
          Reminds[EventID][index].updated = inform

          this.setProperty(Reminds)
          resolve(previousRemind)
      });
  });
}


updateIsDoneState(EventID, NewRemind, inform) {
  return new Promise((resolve, reject) => {
      this.readFromStore().then(Reminds => {
          let index = findIndex(Reminds[EventID], { id: NewRemind.remind_id })
          let previousRemind = Reminds[EventID][index]
          Reminds[EventID][index].isDone = NewRemind.isDone

          inform ? Reminds[EventID][index].updated_at = moment().format() : null
          Reminds[EventID][index].updated = inform

          this.setProperty(Reminds)
          resolve(previousRemind)
      });
  });
}

updateAll(EventID, NewRemind, inform) {
  return new Promise((resolve, reject) => {
      this.readFromStore().then(Reminds => {
          let index = findIndex(Reminds[EventID], { id: NewRemind.remind_id })
          let previousRemind = Reminds[EventID][index]
          Reminds[EventID][index].title = NewRemind.title;
          Reminds[EventID][index].description = NewRemind.description;
          Reminds[EventID][index].recursive_frequency = NewRemind.recursive_frequency;
          Reminds[EventID][index].period = NewRemind.period;
          Reminds[EventID][index].status = NewRemind.status;
          Reminds[EventID][index].members = NewRemind.members;

          inform ? Reminds[EventID][index].updated_at = moment().format() : null
          Reminds[EventID][index].updated = inform

          this.setProperty(Reminds)
          resolve(previousRemind)
      });
  });
}

addMembers(EventID, Remind) {
  return new Promise((resolve, rejectPromise) => {
      this.readFromStore().then(Reminds => {
          let index = findIndex(Reminds[EventID], { id: NewRemind.remind_id })
          //Reminds = Reminds[EventID][index];

          if (Reminds[EventID] && Reminds[EventID][index] && Reminds[EventID][index].length > 0) {
              Reminds[EventID][index].members = Remind.members.concat(Reminds[EventID][index].members)

              inform ? Reminds[EventID][index].updated_at = moment().format() : null
              Reminds[EventID][index].updated = inform

              this.setProperty(Reminds)
              resolve()
          }
          else {
              Reminds[EventID][index].members  = [{ ...Remind, index: 0 }]

              inform ? Reminds[EventID][index].updated_at = moment().format() : null
              Reminds[EventID][index].updated = inform

              this.setProperty(Reminds)
              resolve()
          }

      });
  });
}

updateRequestReportOnComplete(EventID, NewRemind, inform) {
  return new Promise((resolve, reject) => {
      this.readFromStore().then(Reminds => {
          let index = findIndex(Reminds[EventID], { id: NewRemind.remind_id })
          let previousRemind = Reminds[EventID][index]
          Reminds[EventID][index].must_report = NewRemind.must_report

          inform ? Reminds[EventID][index].updated_at = moment().format() : null
          Reminds[EventID][index].updated = inform

          this.setProperty(Reminds)
          resolve(previousRemind)
      });
  });
}

removeMember(EventID,RemindUpdate) {
  return new Promise((resolve, rejectPromise) => {
      this.readFromStore().then(Reminds => {
          let index = find(Reminds[EventID], { id: RemindUpdate.remind_id })

          Reminds[EventID][index].members = Reminds[EventID][index].members.filter(ele => Array.isArray(remindUpdate.members) ?
          remindUpdate.members.indexOf(ele.phone) < 0 : ele.phone !== remindUpdate.members);
          
          inform ? Reminds[EventID][index].updated_at = moment().format() : null
          Reminds[EventID][index].updated = inform

          this.setProperty(Reminds)
          resolve(Reminds[EventID][index]);
      });
  });
}

makeAsDone(EventID,Remind, inform) {
  return new Promise((resolve, reject) => {
    this.readFromStore().then(Reminds => {
      let index = findIndex(Reminds[EventID], { id: Remind.remind_id })
      Reminds[EventID][index].donners && Reminds[EventID][index].donners.length > 0 ?
        Reminds[EventID][index].donners = Array.isArray(Remind.donners) ?
          Remind.donners.concat(Reminds[EventID][index].donners) :
          [Remind.donners].concat(Reminds[EventID][index].donners) :
        Reminds[EventID][index].donners = Array.isArray(Remind.donners) ?
          Remind.donners : [Remind.donners]
      inform ? Reminds[EventID][index].updated_at = moment().format() : null
      Reminds[EventID][index].updated = true
      this.setProperty(Reminds)
      resolve(Reminds[EventID][index]);
    })
  })
}

confirm(EventID,Remind, inform) {
  return new Promise((resolve, reject) => {
    this.readFromStore().then(Reminds => {
      let index = findIndex(Reminds[EventID], { id: Remind.remind_id })
      Reminds[EventID][index].confirmed && Reminds[EventID][index].confirmed.length > 0 ?
        Reminds[EventID][index].confirmed =
        Array.isArray(Remind.confirmed) ?
          [...Remind.confirmed, ...Reminds[EventID][index].confirmed] :
          [...[Remind.confirmed], ...Reminds[EventID][index].confirmed] :
        Reminds[EventID][index].confirmed = Array.isArray(Remind.confirmed) ?
          Remind.confirmed : [Remind.confirmed]
      inform ? Reminds[EventID][index].updated_at = moment().format() : null
      Reminds[EventID][index].updated = true
      this.setProperty(Reminds)
      resolve(Reminds[EventID][index]);
    })
  })
}

updateRecursiveFrequency(EventID, NewRemind, inform) {
  return new Promise((resolve, reject) => {
      this.readFromStore().then(Reminds => {
          let index = findIndex(Reminds[EventID], { id: NewRemind.remind_id })
          let previousRemind = Reminds[EventID][index]
          Reminds[EventID][index].recursive_frequency = NewRemind.recursive_frequency;

          inform ? Reminds[EventID][index].updated_at = moment().format() : null
          Reminds[EventID][index].updated = inform

          this.setProperty(Reminds)
          resolve(previousRemind)
      });
  });
}
updateLocation(EventID, NewRemind, inform) {
  return new Promise((resolve, reject) => {
      this.readFromStore().then(Reminds => {
          let index = findIndex(Reminds[EventID], { id: NewRemind.remind_id })
          let previousRemind = Reminds[EventID][index]
          Reminds[EventID][index].location = NewRemind.location ;

          inform ? Reminds[EventID][index].updated_at = moment().format() : null
          Reminds[EventID][index].updated = inform

          this.setProperty(Reminds)
          resolve(previousRemind)
      });
  });
}

updateURL(EventID, NewRemind, inform) {
  return new Promise((resolve, reject) => {
      this.readFromStore().then(Reminds => {
          let index = findIndex(Reminds[EventID], { id: NewRemind.remind_id })
          let previousRemind = Reminds[EventID][index]
          Reminds[EventID][index].url = NewRemind.url ;

          inform ? Reminds[EventID][index].updated_at = moment().format() : null
          Reminds[EventID][index].updated = inform

          this.setProperty(Reminds)
          resolve(previousRemind)
      });
  });
}



readKey = {
  key: "reminds",
  autoSync: true
}
readFromStore() {
  return new Promise((resolve, reject) => {
      resolve(this.Reminds)
  });
}




}











/** 
  @observable Reminds = {
    id: '',
    event_id: "",
    remind_id: "",
    title: "",
    updated_at: "",
    created_at: "",
    creator: '',
    description: "",
    period: "",
    recursive_frequency: "none",
    recurrence: 1000,
    status: "public",
    members: [],
    isDone: false
  };

  keyData = {
    key: "reminds",
    data: []
  };
  
    @action addReminds(NewRemind) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then(Reminds => {
        if (Array.isArray(NewRemind) && NewRemind.length == 1) {
          Reminds = reject(Reminds, { id: NewRemind[0].id })
        } else {
          Reminds = reject(Reminds, { id: NewRemind.id })
        }
        if (Reminds && Reminds.length > 0) Reminds = uniqBy(Array.isArray(NewRemind) ?
          NewRemind.concat(Reminds) :
          [NewRemind].concat(Reminds), "id");
        else Reminds = [NewRemind];
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          this.Reminds = this.keyData.data;
          resolve();
        });
      });
    });
  }
 */