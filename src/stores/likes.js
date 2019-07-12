import { observable, action } from "mobx";
import {
  filter,
  drop,
  find,
  findIndex,
  indexOf,
  uniqBy,
  reject
} from "lodash";
import storage from "./Storage";
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
            find(likes, {
              event_id: id
            })
          );
        } else {
          resolve([{}]);
        }
      });
    });
  }
  @action like(ID, Liker) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Likes => {
        if (Likes) {
          let Like = find(Likes, { event_id: ID });
          let likeIndex = findIndex(Likes, { event_id: ID });
          Like.likers.concat([Liker]);
          Likes.splice(likeIndex, 1, Like);
          this.saveKey.data = Likes;
          storage.save(this.saveKey).then(() => {
            resolve();
          });
        }
      });
    });
  }
  @action unlike(ID, phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Likes => {
        let Like = find(Likes, { event_id: ID });
        let likeIndex = findIndex(Likes, { event_id: ID });
        Like.likers = drop(Like.likers, indexOf(Like.likers, phone));
        Like.likes -= 1;
        Likes.splice(likeIndex, 1, Like);
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
        Likes = reject(Likes, ["event_id", EvenID]);
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
