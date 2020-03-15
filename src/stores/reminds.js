import { observable, action } from "mobx";
import { find, findIndex, uniqBy, reject } from "lodash";
import storage from "./Storage";
import moment from "moment";
import GState from "./globalState";
import request from '../services/requestObjects';
import tcpRequest from '../services/tcpRequestData';
import EventListener from '../services/severEventListener';
import { getcurrentDateIntervalsNoneAsync, getCurrentDateIntervalNonAsync } from "../services/getCurrentDateInterval";
import { format } from "../services/recurrenceConfigs";
//import { mapper } from '../services/mapper';
export default class Reminds {
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
        if(Array.isArray(NewRemind) && NewRemind.length == 1){
          Reminds = reject(Reminds,{id:NewRemind[0].id})
        }else{
          Reminds = reject(Reminds,{id:NewRemind.id})
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
  loadReminds(event_id, fresh) {
    let sorter = (a, b) => (a.created_at > b.created_at ? -1 :
      a.created_at < b.created_at ? 1 : 0)
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Reminds => {
        ActReminds = Reminds.filter(ele => ele.event_id === event_id)
        if (ActReminds && ActReminds.length > 0) {
          resolve(fresh ? JSON.stringify(ActReminds.sort(sorter)) : ActReminds.sort(sorter))
        } else {
          let getRemind = request.EventID()
          getRemind.event_id = event_id
          tcpRequest.getReminds(getRemind, event_id + '_get_reminds').then(JSONData => {
            EventListener.sendRequest(JSONData, event_id + "_get_reminds").then(response => {
              if (!response.data || response.data === 'empty' || response.data === 'no_such_value') {
                resolve(fresh ? JSON.stringify([]) : [])
              }
              this.addReminds(response.data).then(() => {
                resolve(fresh ? JSON.stringify(response.data.sort(sorter)) : response.data.sort(sorter))
              })
            }).catch(() => {
              resolve(fresh ? JSON.stringify([]) : [])
            })
          })
        }
      })
    })
  }
  @action updateDescription(NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then(Reminds => {
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
          resolve(
            Remind
          );
        });
      });
    });
  }
  @action updateCalendarID(NewRemind, alarms, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then(Reminds => {
        RemindIndex = findIndex(Reminds, { id: NewRemind.remind_id });
        Reminds[RemindIndex].calendar_id = !NewRemind.calendar_id ? null : NewRemind.calendar_id;
        Reminds[RemindIndex].alarms = Reminds[RemindIndex].alarms ? Reminds[RemindIndex].alarms : alarms
        Reminds[RemindIndex].updated_at = moment().format();
        Reminds[RemindIndex].description_updated = inform;
        Reminds[RemindIndex].updated = inform;
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(
            Reminds[RemindIndex]
          );
        });
      });
    });
  }
  @action updateTitle(NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then(Reminds => {
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
      this.readFromStore().then(Reminds => {
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
      this.readFromStore().then(Reminds => {
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
      this.readFromStore().then(Reminds => {
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
      this.readFromStore().then(Reminds => {
        let index = findIndex(Reminds, { id: Remind.remind_id })
        ///console.warn(Reminds[index].members.length, Remind.members)
        Reminds[index].members && Reminds[index].members.length > 0 ? Reminds[index].members = Array.isArray(Remind.members) ?
          Remind.members.concat(Reminds[index].members) :
          [Remind.members].concat(Reminds[index].members) :
          Reminds[index].members = Array.isArray(Remind.members) ?
            Remind.members : [Remind.members]
        inform ? Reminds[index].updated_at = moment().format() : null
        Reminds[index].updated = true
        this.keyData.data = Reminds
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Reminds[index]);
        })
      })
    })
  }
  updateRequestReportOnComplete(Remind, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Reminds => {
        let index = findIndex(Reminds, { id: Remind.remind_id })
        Reminds[index].must_report = Remind.must_report
        if (inform) Reminds[index].updated_at = moment().format()
        this.keyData.data = Reminds
        storage.save(this.keyData).then(() => {
          resolve(Reminds[index])
        })
      })
    })
  }
  removeMember(remindUpdate, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Reminds => {
        let index = findIndex(Reminds, { id: remindUpdate.remind_id })
        Reminds[index].members = Reminds[index].members.filter(ele => Array.isArray(remindUpdate.members) ?
          remindUpdate.members.indexOf(ele.phone) < 0 :
          ele.phone !== remindUpdate.members);
        inform ? Reminds[index].updated_at = moment().format() : null
        Reminds[index].updated = inform
        this.keyData.data = Reminds
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Reminds[index]);
        })
      })
    })
  }
  makeAsDone(Remind, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Reminds => {
        let index = findIndex(Reminds, { id: Remind.remind_id })
        Reminds[index].donners && Reminds[index].donners.length > 0 ?
          Reminds[index].donners = Array.isArray(Remind.donners) ?
            Remind.donners.concat(Reminds[index].donners) :
            [Remind.donners].concat(Reminds[index].donners) :
          Reminds[index].donners = Array.isArray(Remind.donners) ?
            Remind.donners : [Remind.donners]
        inform ? Reminds[index].updated_at = moment().format() : null
        Reminds[index].updated = true
        this.keyData.data = Reminds
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Reminds[index]);
        })
      })
    })
  }
  confirm(Remind, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Reminds => {
        let index = findIndex(Reminds, { id: Remind.remind_id })
        Reminds[index].confirmed && Reminds[index].confirmed.length > 0 ?
          Reminds[index].confirmed =
          Array.isArray(Remind.confirmed) ?
            [...Remind.confirmed, ...Reminds[index].confirmed] :
            [...[Remind.confirmed], ...Reminds[index].confirmed] :
          Reminds[index].confirmed = Array.isArray(Remind.confirmed) ?
            Remind.confirmed : [Remind.confirmed]
        inform ? Reminds[index].updated_at = moment().format() : null
        Reminds[index].updated = true
        this.keyData.data = Reminds
        storage.save(this.keyData).then(() => {
          GState.eventUpdated = true;
          resolve(Reminds[index]);
        })
      })
    })
  }
  @action updateRecursiveFrequency(rem, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then(Reminds => {
        let RemindIndex = findIndex(Reminds, { id: rem.remind_id });
        Reminds[RemindIndex].recursive_frequency = rem.recursive_frequency;
        Reminds[RemindIndex].updated_at = moment().format();
        Reminds[RemindIndex].description_updated = inform;
        Reminds[RemindIndex].updated = inform;
        Reminds[RemindIndex] = [Reminds[RemindIndex]][0]
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
      this.readFromStore().then(Reminds => {
        let Remind = find(Reminds, { id: NewRemind.remind_id });
        RemindIndex = findIndex(Reminds, { id: NewRemind.remind_id });
        console.warn(NewRemind.recurrence, "pppp")
        Remind.recursive_frequency = NewRemind.recurrence;
        Remind.updated_at = moment().format();
        Remind.description_updated = inform;
        Remind.updated = inform;
        Remind = [Remind][0]
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
      this.readFromStore().then(Reminds => {
        let Remind = find(Reminds, { id: NewRemind.remind_id });
        RemindIndex = findIndex(Reminds, { id: NewRemind.remind_id });
        Remind.period = NewRemind.period;
        Remind.updated_at = moment().format();
        Remind.description_updated = inform;
        Remind = [Remind][0]
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
      this.readFromStore().then(Reminds => {
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
    console.warn("removing remind", RemindId)
    return new Promise((resolve, RejectPromise) => {
      this.readFromStore().then(Reminds => {
        let OldRemind = find(Reminds, { id: RemindId })
        Reminds = reject(Reminds, ["id", RemindId]);
        RemindId === "newRemindId" ? Reminds.unshift(request.Remind()) : null
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          this.Reminds = this.keyData.data;
          resolve(OldRemind);
        });
      });
    });
  }
  loadRemind(id) {
    console.warn("loading remind")
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Rems => {
        let rem = find(Rems, { id: id })
        if (rem) {
          resolve(rem)
        } else {
          let RemindID = request.RemindID();
          RemindID.remind_id = id;
          tcpRequest.getRemind(RemindID, id + "_get_remind").then(JSONData => {
            EventListener.sendRequest(JSONData, id + "_get_remind").then(Remind => {
              if (Remind.data !== 'empty') {
                this.addReminds(Remind.data).then(() => {
                  resolve(Remind.data)
                })
              } else {
                resolve()
              }
            }).catch(() => {
              resolve()
            })
          })
        }
      })
    })
  }
  readFromStore() {
    return new Promise((resolve, rejevt) => {
      storage
        .load({
          key: "reminds",
          autoSync: true
        })
        .then(Contacts => {
          resolve(Contacts);
        })
        .catch(error => {
          resolve([]);
        });
    });
  }


  @observable MyTasksData = [
    {
      id: '1',
      event_id: "",
      creator: '',
      title: 'help the child to do the homework',
      description: "Don 't forget helping the child to do his homeWork Tomorow",
      period: { time: "17:31", date: "07/09/2018" },
      isDone: false
    },
    {
      id: '2',
      event_id: "",
      creator: '',
      title: 'help the child to do the homework',
      description: "Correct out the error in the second projet code before sunday,thank",
      period: { time: "08:02", date: "05/09/2019" },
      isDone: false
    },
    {
      id: '3',
      event_id: "",
      creator: '',
      title: 'ERROR IN CODE',
      description: "Correct out the error in the second projet code before sunday,thank",
      period: { time: "16:41", date: "11/02/2018" },
      isDone: false
    },
    {
      id: '4',
      event_id: "",
      creator: '',
      title: 'Wash the church',
      description: "Need to wash the church on satursday morning",
      period: { time: "11:00", date: "06/05/2018" },
      isDone: false
    },

    {
      id: '5',
      event_id: "",
      creator: '',
      title: 'Go to phamarcie',
      description: "Go to pharmacie after work tomorow to buy constipation medcine",
      period: { time: "15:20", date: "05/08/2018" },
      isDone: false
    },

    {
      id: '6',
      event_id: "",
      creator: '',
      title: 'Rendevou Prefecture',
      description: "Rendevou a la prefecture pour le titre de sejour mecredi le septembre",
      period: { time: "12:10", date: "14/04/2018" },
      isDone: false
    },
    {
      id: '7',
      event_id: "",
      creator: '',
      title: 'HKEN Medication',
      description: "Give HKen his medication at 7pm",
      period: { time: "13:16", date: "12/07/2018" },
      isDone: false
    },
    {
      id: '8',
      event_id: "",
      creator: '',
      title: 'Achete le sacs de Marie',
      description: "Achete le sac de Marie au durant le voyage,un sacs bleu",
      period: { time: "12:10", date: "04/06/2018" },
      isDone: false
    },
    {
      id: '9',
      event_id: "",
      creator: '',
      title: '',
      description: "Correct out the error in the second projet code before sunday,thank",
      period: { time: "14:03", date: "23/01/2018" },
      isDone: false
    },
    {
      id: '10',
      event_id: "",
      creator: '',
      title: 'Meeting With Global Union',
      description: "Meeting with Global group on thursday,We will be receiving our chinese patners at 9 am",
      period: { time: "10:11", date: "10/09/2018" },
      isDone: false
    }

  ]




}
