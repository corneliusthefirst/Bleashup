import { observable, action } from "mobx";
import { find, findIndex, uniqBy, reject } from "lodash";
import storage from "./Storage";
import moment from "moment";
import GState from "./globalState";
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
    recursive_frequency:"none",
    recurrence:1000,
    status:"public",
    members:[],
    isDone:false
  };
  
  keyData = {
    key: "reminds",
    data: []
  };
  @action addReminds(NewRemind) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then(Reminds => {
        if (Reminds) Reminds = uniqBy(Reminds.concat([NewRemind]), "id");
        else Reminds = [NewRemind];
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          this.Reminds = this.keyData.data;
          resolve();
        });
      });
    });
  }
  @action updateDescription(NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then(Reminds => {
        let Remind = find(Reminds, { id: NewRemind.remind_id });
        RemindIndex = findIndex(Reminds, { id: NewRemind.remind_id });
        Remind.description = NewRemind.description;
        Remind.updated_at = moment().format("YYYY-MM-DD HH:mm");
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
  @action updateTitle(NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then(Reminds => {
        let Remind = find(Reminds, { id: NewRemind.remind_id });
        RemindIndex = findIndex(Reminds, { id: NewRemind.remind_id });
        Remind.title = NewRemind.title;
        Remind.updated_at = moment().format("YYYY-MM-DD HH:mm");
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
  @action updateIsDoneState(NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then(Reminds => {
        let Remind = find(Reminds, { id: NewRemind.remind_id });
        RemindIndex = findIndex(Reminds, { id: NewRemind.remind_id });
        Remind.isDone = NewRemind.isDone;
        Remind.updated_at = moment().format("YYYY-MM-DD HH:mm");
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
        Remind.updated_at = moment().format("YYYY-MM-DD HH:mm");
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


  @action updateRecursiveFrequency(NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then(Reminds => {
        let Remind = find(Reminds, { id: NewRemind.remind_id });
        RemindIndex = findIndex(Reminds, { id: NewRemind.remind_id });
        Remind.recursive_frequency = NewRemind.recursive_frequency;
        Remind.updated_at = moment().format("YYYY-MM-DD HH:mm");
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

  @action updateRecurrence(NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then(Reminds => {
        let Remind = find(Reminds, { id: NewRemind.remind_id });
        RemindIndex = findIndex(Reminds, { id: NewRemind.remind_id });
        Remind.recurrence = NewRemind.recurrence;
        Remind.updated_at = moment().format("YYYY-MM-DD HH:mm");
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

  @action updatePeriod(NewRemind, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then(Reminds => {
        let Remind = find(Reminds, { id: NewRemind.remind_id });
        RemindIndex = findIndex(Reminds, { id: NewRemind.remind_id });
        Remind.period = NewRemind.period;
        Remind.updated_at = moment().format("YYYY-MM-DD HH:mm");
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
  @action removeRemind(RemindId) {
    return new Promise((resolve, RejectPromise) => {
      this.readFromStore().then(Reminds => {
        Reminds = reject(Reminds, ["id", RemindId]);
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          this.Reminds = this.keyData.data;
          resolve(this.keyData.data);
        });
      });
    });
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


@observable MyTasksData =[
{
    id: '1',
    event_id: "",
    creator: '',
    title: 'help the child to do the homework',
    description: "Don 't forget helping the child to do his homeWork Tomorow",
    period: {time:"17:31",date:"07/09/2018"},
    isDone:false
},
{
    id: '2',
    event_id: "",
    creator: '',
    title: 'help the child to do the homework',
    description: "Correct out the error in the second projet code before sunday,thank",
    period: {time:"08:02",date:"05/09/2019"},
    isDone:false
},
{
    id: '3',
    event_id: "",
    creator: '',
    title: 'ERROR IN CODE',
    description: "Correct out the error in the second projet code before sunday,thank",
    period: {time:"16:41",date:"11/02/2018"},
    isDone:false
},
{
    id: '4',
    event_id: "",
    creator: '',
    title: 'Wash the church',
    description: "Need to wash the church on satursday morning",
    period: {time:"11:00",date:"06/05/2018"},
    isDone:false
},

{
    id: '5',
    event_id: "",
    creator: '',
    title: 'Go to phamarcie',
    description: "Go to pharmacie after work tomorow to buy constipation medcine",
    period: {time:"15:20",date:"05/08/2018"},
    isDone:false
},

{
    id: '6',
    event_id: "",
    creator: '',
    title: 'Rendevou Prefecture',
    description: "Rendevou a la prefecture pour le titre de sejour mecredi le septembre",
    period: {time:"12:10",date:"14/04/2018"},
    isDone:false
},
{
    id: '7',
    event_id: "",
    creator: '',
    title: 'HKEN Medication',
    description: "Give HKen his medication at 7pm",
    period: {time:"13:16",date:"12/07/2018"},
    isDone:false
},
{
    id: '8',
    event_id: "",
    creator: '',
    title: 'Achete le sacs de Marie',
    description: "Achete le sac de Marie au durant le voyage,un sacs bleu",
    period: {time:"12:10",date:"04/06/2018"},
    isDone:false
},
{
    id: '9',
    event_id: "",
    creator: '',
    title: '',
    description: "Correct out the error in the second projet code before sunday,thank",
    period: {time:"14:03",date:"23/01/2018"},
    isDone:false
},
{
    id: '10',
    event_id: "",
    creator: '',
    title: 'Meeting With Global Union',
    description: "Meeting with Global group on thursday,We will be receiving our chinese patners at 9 am",
    period: {time:"10:11",date:"10/09/2018"},
    isDone:false
}

]




}
