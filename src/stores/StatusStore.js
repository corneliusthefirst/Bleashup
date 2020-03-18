import { observable, action } from "mobx";
import {
  filter,
  uniqBy,
  orderBy,
  find,
  findIndex,
  reject,
  uniq,
  indexOf,
  forEach,
  dropWhile
} from "lodash";
import storage from "./Storage";
import moment from "moment";
import requestObject from "../services/requestObjects";
import tcpRequest from "../services/tcpRequestData";
import serverEventListener from "../services/severEventListener"
import request from "../services/requestObjects";

export default class StatusStore {
  constructor() {
    /*storage.remove({
      key: 'Stats'
    });*/
    //console.warn("constructor called")

    this.readFromStore().then(Stats => {
      let i = 0
      forEach(Stats, (Stat) => {
        Stats[i].hiden = false
        if (i == Stats.length - 1) {
          if (Stats) {
            this.setProperties(Stats, true);
          }
        }
        i++
      })
    });
  }

  @observable stats = []
  @observable myStories = [];

  storeAccessKey = {
    key: "Stats",
    autoSync: true
  };
  saveKey = {
    key: "Stats",
    data: []
  };
  @action addStat(NewStat) {
    if (NewStat == 'no_such_key') {
      resolve()
    } else {
      NewStat.updated_at = moment().format()
      NewStat.new = true
      return new Promise((resolve, reject) => {
        this.readFromStore().then(Stats => {
          if (Stats.length !== 0) {
            Stats.unshift(NewStat)
            this.saveKey.data = Stats;
          }
          else this.saveKey.data = [NewStat];
          this.saveKey.data = uniqBy(this.saveKey.data, 'id');
          storage.save(this.saveKey).then(() => {
            this.setProperties(this.saveKey.data, true);
            resolve();
          });
        });
      });
    }
  }

  @action addStats(newStats) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Stats => {
        if (!Stats || Stats.length !== 0)
          Stats = uniqBy(newStats.concat(Stats), 'id');
        else Stats = newStats;
        this.saveKey.data = Stats;
        storage.save(this.saveKey).then(() => {
          this.stats = this.saveKey.data;
          resolve();
        });
      });
    });
  }


  @action delete(StatID) {
    return new Promise((resolve, rejec) => {
      this.readFromStore().then(Stats => {
        Stats = reject(Stats, { id: StatID })
        //StatID === "newStatId" ? Stats.unshift(request.Stat()) : null
        this.saveKey.data = Stats;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, false);
          resolve("ok")
        })

      })
    })
  }


  @action loadCurrentStat(StatID) {
    return new Promise((resolve, reject) => {
      this.readFromStore()
        .then(Stats => {
          let story = find(Stats, { id: StatID });
          if (!story) {
            serverEventListener.GetData(StatID).then(story => {
              this.addStat(story).then(() => {
                resolve(story)
              })
            }).catch(error => {
              serverEventListener.socket.write = undefined
              console.error(error, "in load stats")
              reject(error)
            })
          } else {
            resolve(story)
          }
        })
    });
  }
  
  @action loadStats() {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(stats => {
        this.setProperties(stats, true);
        resolve(stats)
      })
    })
  }


  @action removeStat(StatID, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then(Stats => {
        let NewStats = reject(Stats, ["id", StatID]);
        this.saveKey.data = NewStats;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }
  
  removeStory(StatID, StoryID, inform) {
    //console.warn(StoryID, "remove story 1");
    return new Promise((resolve, rejectPromise) => {
      this.readFromStore().then(Stats => {
        let index = findIndex(Stats, { id: StatID });

        Stats[index].stories = dropWhile(
          Stats[index].stories,
          element => element == StoryID
        );
        if (inform) {
          Stats[index].story_removed = true;
          Stats[index].updated = true
        }
        this.saveKey.data = Stats;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });
  }

  @action addStory(StatID, StoryID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Stats => {
        let index = findIndex(Stats, {
          id: StatID
        });
        if (index >= 0) {
          if (Stats[index].stories && Stats[index].stories.length > 0)
            Stats[index].stories.unshift(StoryID);
          else Stats[index].stories = [StoryID]
          if (inform) {
            Stats[index].story_added = true;
            Stats[index].updated = true
            Stats[index].updated_at = moment().format();
          }
          this.saveKey.data = Stats;
          storage.save(this.saveKey).then(() => {
            this.setProperties(this.saveKey.data, inform);
            resolve();
          });
        }
        else {
          let EID = requestObject.StatID();
          EID.story_id = StatID;
          tcpRequest.getCurrentStat(EID, StatID).then(JSONData => {
            serverEventListener.get_data(JSONData).then(E => {
              if (E) {
                this.addStat(E).then(() => {
                  this.addStory(StatID, StoryID, true).then(() => {
                    resolve()
                  })
                });
              } else {
                reject()
              }
            });
          });
        }
      });
    });
  }
  
  readFromStore() {
    return new Promise((resolve, reject) => {
      storage
        .load(this.storeAccessKey)
        .then(stats => {
          resolve(stats);
        })
        .catch(error => {
          resolve([]);
        });
    });
  }
  setProperties(Stats, inform) {
    if (inform) Stats = orderBy(Stats, ["updated_at"], ["desc"]);
    this.stats = Stats;
    this.myStories = filter(Stats, { reminds: true });
  }
   
  @action resetEventStat(StatID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Stats => {
        let Stat = find(Stats, { id: StatID });
        let storyIndex = findIndex(Stats, { id: StatID });
        Stat = request.EventStat();
        Stat.id = StatID;

        Stat.updated_at = moment().format("YYYY-MM-DD HH:mm");
        Stats.splice(storyIndex, 1, Stat);
        this.saveKey.data = Stats;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });

  }
  @action resetContactStat(StatID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Stats => {
        let Stat = find(Stats, { id: StatID });
        let storyIndex = findIndex(Stats, { id: StatID });
        Stat = request.ContactStat();
        Stat.id = StatID;

        Stat.updated_at = moment().format("YYYY-MM-DD HH:mm");
        Stats.splice(storyIndex, 1, Stat);
        this.saveKey.data = Stats;
        storage.save(this.saveKey).then(() => {
          this.setProperties(this.saveKey.data, inform);
          resolve();
        });
      });
    });

  }


}
