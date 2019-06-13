import { observable, action } from "mobx-localstorage";
import { filter, uniqBy, dropWhile } from "lodash";
import storage from "./BigStorage";
export default class likes {
  constructor() {}
  @observable likes = [];
  saveKey = {
    key: "likes",
    data: [{}]
  };
  @action loadLikes(id) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(likes => {
        if (likes) {
          resolve(
            filter(likes, {
              event_id: id
            })
          );
        } else {
          resolve([{}]);
        }
      });
    });
  }
  @action addlikes(Like) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Likes => {
        if (Likes) {
          this.saveKey.data = uniqBy(Likes.concat([Like]), "liker");
          storage.save(this.saveKey).then(() => {
            resolve();
          });
        }
      });
    });
  }
  @action removeFromLikes(phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Likes => {
        Likes = dropWhile(Likes, ["phone", phone]);
        this.saveKey.data = Likes;
        storage.save(this.saveKey).then(() => {
          resolve();
        });
      });
    });
  }
  @action UpdateEventLikes(EvenID, NewLikes) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Likes => {
        Likes = dropWhile(Likes, ["event_id", EvenID]);
        Likes = Likes.concat(NewLikes);
        this.saveKey.data = Likes;
        storage.save(this.saveKey).then(() => {
          resolve();
        });
      });
    });
  }
  readFromStore() {
    return new Promise((resolve, reject) => {
      storage
        .load({
          key: "likes",
          autoSync: true
        })
        .then(Likes => {
          resolve(Likes);
        })
        .catch(error => {
          resolve([]);
        });
    });
  }
}
