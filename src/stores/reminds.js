import { observable, action } from "mobx";
import {
  find,
  findIndex,
  uniqBy,
} from "lodash";
import storage from "./Storage";
import moment  from("moment");
import GState from "./globalState";
class Reminds {
  @observable Reminds = {
    event_id: "",
    remind_id: "",
    title: "",
    updated_at: "",
    created_at: "",
    description: "",
    period: ""
  };
  keyData = {
    key: "reminds",
    data: [{}]
  };
  @action addReminds(NewRemind) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Reminds => {
        Reminds = uniqBy(Reminds.concat([newEven]), "remind_id");
        this.keyData.data = Reminds;
        storage.save(this.keyData).then(() => {
          this.Reminds = this.keyData.data;
          resolve();
        });
      });
    });
  }
  @action updateDescription(NewRemind) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Reminds => {
        Remind = find(Reminds, { remind_id: NewRemind.remind_id });
          RemindIndex = findIndex(Reminds, { remind_id: NewRemind.remind_id });
          Remind.description = NewRemind.new_description;
          Remind.updated_at = moment().format("YYYY-MM-DD HH:mm");
          Remind.description_updated = true;
          Reminds.splice(Remind, 1, RemindIndex);
          this.keyData.data = Reminds;
          storage.save(this.keyData).then(() => {
                GState.eventUpdated = true
              resolve()
          })
      });
    });
  }
    @action updateTitle(NewRemind) {
        return new Promise((resolve, reject) => {
            Remind = find(Reminds, { remind_id: NewRemind.remind_id });
            RemindIndex = findIndex(Reminds, { remind_id: NewRemind.remind_id });
            Remind.title = NewRemind.title;
            Remind.updated_at = moment().format("YYYY-MM-DD HH:mm");
            Remind.description_updated = true;
            Reminds.splice(Remind, 1, RemindIndex);
            this.keyData.data = Reminds;
            storage.save(this.keyData).then(() => {
                GState.eventUpdated = true
                resolve()
            })
        })
    }
    @action updatePeriod(NewRemind) {
        return new Promise((resolve, reject) => {
            Remind = find(Reminds, { remind_id: NewRemind.remind_id });
            RemindIndex = findIndex(Reminds, { remind_id: NewRemind.remind_id });
            Remind.period = NewRemind.period;
            Remind.updated_at = moment().format("YYYY-MM-DD HH:mm");
            Remind.description_updated = true;
            Reminds.splice(Remind, 1, RemindIndex);
            this.keyData.data = Reminds;
            storage.save(this.keyData).then(() => {
                GState.eventUpdated = true
                resolve()
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
}
