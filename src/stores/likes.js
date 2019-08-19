import { observable, action } from "mobx";
import {
  filter,
  drop,
  find,
  findIndex,
  indexOf,
  uniqBy,
  uniq,
  reject
} from "lodash";
import storage from "./Storage";
import request from "../services/requestObjects";
import tcpRequest from "../services/tcpRequestData";
import ServerEventListener from "../services/severEventListener"
export default class likes {
  constructor() {
    this.readFromStore().then(likes => {
      this.setPropties(likes)
    })
    /*storage.remove({
      key: 'likes'
    });*/
  }
  @observable likes = [];
  saveKey = {
    key: "likes",
    data: [{}]
  };
  @action loadLikes(id) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(likes => {
        if (likes) {
          like = find(likes, {
            event_id: id
          })
          if (like) {
            like.likers = uniq(like.likers)
            resolve(like);
          } else {
            this.getLikesFromRemote(id).then(Like => {
              likes.push(Like);
              this.saveKey.data = likes
              storage.save(this.saveKey).then(() => {
                resolve(Like)
              })
            }).catch(error => {
              console.warn("unable to send request deu to ", error)
            })
          }
        } else {
          this.getLikesFromRemote(id).then(Like => {
            this.saveKey.data = [Like]
            storage.save(this.saveKey).then(() => {
              resolve(Like)
            })
          }).catch(error => {
            console.warn("unable to send request deu to ", error)
          })
        }
      });
    });
  }
  getLikesFromRemote(id) {
    return new Promise((resolve, reject) => {
      let ID = request.EventID();
      ID.event_id = id;
      tcpRequest.getLikes(ID, id + "get_likes").then(DataJSON => {
        ServerEventListener.sendRequest(DataJSON, id + "get_likes").then(Like => {
          if (Like == 'empty') Like = { event_id: id, likes: 0, likers: [] }
          Like.likers = uniq(Like.likers)
          resolve(Like)
        }).catch(error => {
          reject(error)
        })
      })
    })
  }
  @action like(ID, Liker) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Likes => {
        if (Likes.length !== 0) {
          let likeIndex = findIndex(Likes, { event_id: ID });
          if (likeIndex >= 0) {
            Likes[likeIndex].likers.push(Liker);
            Likes[likeIndex].likers = uniq(Likes[likeIndex].likers)
            Likes[likeIndex].likes = Likes[likeIndex].likers.length;
            Likes = uniqBy(Likes, "event_id");
            this.saveKey.data = Likes;
            storage.save(this.saveKey).then(() => {
              this.setPropties(this.saveKey.data)
              resolve();
            });
          } else {
            this.getLikesFromRemote(ID).then(Like => {
              this.addLike(Likes, Like).then(() => {
                resolve();
              })
            })
          }
        } else {
          this.getLikesFromRemote(ID).then(Likes => {
            this.addLike([], Likes).then(() => {
              resolve()
            })
          })
        }
      });
    });
  }
  @action setPropties(data) {
    this.likes = data
  }
  @action addLike(Likes, Like) {
    return new Promise((resolve, reject) => {
      Likes.push(Like);
      this.saveKey.data = uniqBy(Likes, "event_id");
      storage.save(this.saveKey).then(() => {
        this.setPropties(this.saveKey.data)
        resolve()
      })
    })
  }
  @action unlike(ID, phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Likes => {
        if (Likes.length !== 0) {
          let likeIndex = findIndex(Likes, { event_id: ID });
          if (likeIndex >= 0) {
            Likes[likeIndex].likers = drop(Likes[likeIndex].likers, indexOf(Likes[likeIndex].likers, phone) + 1);
            Likes[likeIndex].likes -= Likes[likeIndex].likers.length;
            this.saveKey.data = Likes;
            storage.save(this.saveKey).then(() => {
              resolve();
            });
          } else {
            this.getLikesFromRemote(ID).then(Like => {
              this.addLike(Likes, Like).then(() => {
                resolve()
              })
            })
          }
        } else {
          this.getLikesFromRemote(ID).then(Like => {
            this.addLike([], Like).then(() => {
              resolve()
            })
          })
        }
      });
    });
  }
  loadAllLikes() {
    this.readFromStore().then((likes) => {
      this.setPropties(likes)
    })
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
