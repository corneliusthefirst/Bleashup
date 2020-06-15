import storage from "./Storage";
import { observable, action } from "mobx";

import { uniqBy, reject, filter, find, findIndex, sortBy } from "lodash";
import moment from "moment";
import tcpRequest from "../services/tcpRequestData";
import request from "../services/requestObjects";
import serverEventListener from "../services/severEventListener";
import emitter from "../services/eventEmiter";
export default class highlights {
  constructor() {
    //storage.remove(this.saveKey).then(() => {
     // console.warn("removed");
   // });
    this.initializeReminds();
    this.timer();
  }
  saveInterval = 2000;
  saverInterval = null;
  currentSaveTime = moment().format();
  previousSaveTime = moment().format();
  initializeReminds() {
    console.warn("initializing highlights", this.highlights);
    storage
      .load(this.readKey)
      .then((data) => {
        this.highlights = data;
      })
      .catch(() => {
        this.highlights = {};
      });
  }
  timer = () => {
    setInterval(() => {
      this.previousSaveTime !== this.currentSaveTime ? this.saver() : null;
    }, this.saveInterval);
  };

  @observable highlights = {};

  extraVotes = {};
  saver() {
    if (Object.keys(this.highlights).length > 0) {
      console.warn("persisiting highlights foolish", this.highlights);
      this.saveKey.data = this.highlights;
      storage.save(this.saveKey).then(() => {
        this.previousSaveTime = this.currentSaveTime;
      });
    }
  }
  setProperty(highlights) {
    this.highlights = highlights;
    console.warn("here foolish", this.highlights);
    this.currentSaveTime = moment().format();
  }
  saveKey = {
    key: "highlights",
    data: {},
  };
  readKey = {
    key: "highlights",
    autoSync: true,
  };

  @action addHighlight(EventID, H) {
    return this.addHighlights(EventID, [H]);
  }

  @action addHighlights(EventID, NewHighlight) {
    console.warn("new highlight is ", EventID, NewHighlight);
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Highlights) => {
        console.warn("from readFrom store", Highlights);
        if (Highlights[EventID] && Highlights[EventID].length > 0) {
          if (Array.isArray(NewHighlight)) {
            if (NewHighlight.length === 1) {
              Highlights[EventID] = reject(Highlights[EventID], {
                id: NewHighlight[0].id,
              });
              Highlights[EventID] = NewHighlight.concat(Highlights[EventID]);
            } else {
              Highlights[EventID] = uniqBy(
                NewHighlight.concat(Highlights[EventID]),
                "id"
              );
            }
          } else {
            Highlights[EventID] = reject(Highlights[EventID], {
              id: NewHighlight.id,
            });
            Highlights[EventID] = [NewHighlight].concat(Highlights[EventID]);
          }
        } else {
          Highlights[EventID] = Array.isArray(NewHighlight)
            ? NewHighlight
            : [NewHighlight];
        }
        console.warn("here is the highlight", Highlights);
        this.setProperty(Highlights);
        resolve();
      });
    });
  }

  updateHighlightPublicState(EventID, update) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Highlights) => {
        let hIndex = findIndex(Highlights[EventID], {
          id: update.highlight_id,
        });
        Highlights[EventID][hIndex].public_state = update.public_state;
        this.setProperty(Highlights);
        resolve();
      });
    });
  }

  @action removeHighlight(EventID, HighlightId) {
    console.warn("removing Highlight", HighlightId);
    return new Promise((resolve, RejectPromise) => {
      this.readFromStore().then((Highlights) => {
        let index = find(Highlights[EventID], { id: HighlightId });
        Highlights[EventID] = reject(Highlights[EventID], ["id", HighlightId]);
        HighlightId === "newHighlightId"
          ? Highlights[EventID].unshift(request.Highlight())
          : null;
        this.setProperty(Highlights);
        resolve(Highlights[EventID][index]);
      });
    });
  }

  fetchHighlightsFromRemote(EventID, fresh) {
    let sorter = (a, b) =>
      a.created_at > b.created_at ? -1 : a.created_at < b.created_at ? 1 : 0;
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Highlights) => {
        let ActHighlights = Highlights[EventID];
        if (ActHighlights && ActHighlights.length > 0) {
          resolve(
            fresh
              ? JSON.stringify(ActHighlights.sort(sorter))
              : ActHighlights.sort(sorter)
          );
        } else {
          let getHighlight = request.EventID();
          getHighlight.event_id = EventID;
          tcpRequest
            .getHighlights(getHighlight, EventID + "highlights")
            .then((JSONData) => {
              serverEventListener
                .sendRequest(JSONData, EventID + "highlights")
                .then((response) => {
                  if (
                    !response.data ||
                    response.data === "empty" ||
                    response.data === "no_such_value"
                  ) {
                    resolve(fresh ? JSON.stringify([]) : []);
                  } else {
                    this.addHighlights(EventID, response.data).then(() => {
                      resolve(response.data);
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

  @action fetchHighlights(EventID) {
    let sorter = (a, b) =>
      a.created_at > b.created_at ? -1 : a.created_at < b.created_at ? 1 : 0;
    return new Promise((resolve, reject) => {
      if (this.highlights[EventID] && this.highlights[EventID].length === 0) {
        this.readFromStore().then((Highlights) => {
          let result = Highlights[EventID].sort(sorter);

          if (result.length === 0) {
            this.fetchHighlightsFromRemote(EventID, true)
              .then((data) => {
                resolve(data);
              })
              .catch(() => {
                resolve([]);
              });
          } else {
            resolve(uniqBy(result, "id"));
          }
        });
      } else {
        resolve([]);
      }
    });
  }

  @action updateHighlightTitle(EventID, NewHighlight, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Highlights) => {
        let RemindIndex = findIndex(Highlights[EventID], {
          id: NewHighlight.highlight_id,
        });
        Highlights[EventID][RemindIndex].title = NewHighlight.title;
        Highlights[EventID][RemindIndex].updated_date = moment().format();
        Highlights[EventID][RemindIndex].title_updated = inform;
        Highlights[EventID][RemindIndex].updated = inform;

        this.setProperty(Highlights);
        resolve(Highlights[EventID][RemindIndex]);
      });
    });
  }

  @action updateHighlightDescription(EventID, NewHighlight, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Highlights) => {
        let RemindIndex = findIndex(Highlights[EventID], {
          id: NewHighlight.highlight_id,
        });
        Highlights[EventID][RemindIndex].description = NewHighlight.description;
        Highlights[EventID][RemindIndex].updated_date = moment().format();
        Highlights[EventID][RemindIndex].description_updated = inform;
        Highlights[EventID][RemindIndex].updated = inform;

        this.setProperty(Highlights);
        resolve(Highlights[EventID][RemindIndex]);
      });
    });
  }

  @action updateHighlightUrl(EventID, NewHighlight, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Highlights) => {
        let RemindIndex = findIndex(Highlights[EventID], {
          id: NewHighlight.highlight_id,
        });
        Highlights[EventID][RemindIndex].url = NewHighlight.url;
        Highlights[EventID][RemindIndex].updated_date = moment().format();
        Highlights[EventID][RemindIndex].url_updated = inform;
        Highlights[EventID][RemindIndex].updated = inform;

        this.setProperty(Highlights);
        resolve(Highlights[EventID][RemindIndex]);
      });
    });
  }

  @action updateHighlight(EventID, NewHighlight, inform) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Highlights) => {
        let RemindIndex = findIndex(Highlights[EventID], {
          id: NewHighlight.highlight_id,
        });

        Highlights[EventID][RemindIndex].title = NewHighlight.title;
        Highlights[EventID][RemindIndex].url = NewHighlight.url;
        Highlights[EventID][RemindIndex].description = NewHighlight.description;
        Highlights[EventID][RemindIndex].updated_date = moment().format();
        Highlights[EventID][RemindIndex].all_updated = inform;
        Highlights[EventID][RemindIndex].updated = inform;

        this.setProperty(Highlights);
        resolve(Highlights[EventID][RemindIndex]);
      });
    });
  }

  loadHighlight(EventID, id) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Highlights) => {
        let high = Highlights[EventID];
        if (high) {
          resolve(high);
        } else {
          this.loadHighlightFromRemote(EventID, id)
            .then((highlight) => {
              this.addHighlight(EventID, highlight).then(() => {
                resolve(highlight);
              });
            })
            .catch((e) => {
              resolve();
            });
        }
      });
    });
  }

  loadHighlightFromRemote(EventID, id) {
    return new Promise((resolve, reject) => {
      let RequestObject = request.HID();
      RequestObject.h_id = id;
      tcpRequest
        .getHighlight(RequestObject, id + "highlight")
        .then((JSONData) => {
          serverEventListener
            .sendRequest(JSONData, id + "highlight")
            .then((response) => {
              if (response.data && response.data !== "empty") {
                resolve(response.data);
              } else {
                reject(response);
              }
            })
            .catch((error) => {
              reject(error);
            });
        });
    });
  }

  readFromStore() {
    return new Promise((resolve, rejectpromise) => {
      resolve(this.highlights);
    });
  }
}

/**
 *
  @action addHighlights(EventID, Highlight) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then((Highlights) => {
        if (!Highlights[EventID] || Highlights[EventID].length !== 0) {
          if (Highlight.length === 1) {
            Highlights = reject(Highlights, { id: Highlight[0].id });
          }
          Highlights = uniqBy(Highlight.concat(Highlights), 'id');
        } else {
          Highlights = Highlight;
        }
        this.saveKey.data = Highlights;
        storage.save(this.saveKey).then(() => {
          this.highlights = this.saveKey.data;
          resolve();
        });
      });
    });
  }


  fetchHighlightsFromRemote(EventID) {
    let sorter = (a, b) =>
      a.created_at > b.created_at ? -1 : a.created_at < b.created_at ? 1 : 0;
    return new Promise((resolve, reject) => {
      if (
        this.curentTemporalHighlight[EventID] &&
        this.curentTemporalHighlight[EventID].length > 0
      ) {
        resolve(this.curentTemporalHighlight[EventID]);
      } else {
        let eventid = request.EventID();
        eventid.event_id = EventID;
        tcpRequest
          .getHighlights(eventid, eventid.event_id + 'highlights')
          .then((JSONDATA) => {
            serverEventListener
              .sendRequest(JSONDATA, eventid.event_id + 'highlights')
              .then((Data) => {
                if (Data.data === 'empty') {
                  resolve([]);
                } else {
                  this.replaceHighlights(
                    Array.isArray(Data.data)
                      ? uniqBy(Data.data, 'id')
                      : [Data.data],
                    EventID
                  ).then(() => {
                    this.curentTemporalHighlight[EventID] = Data.data;
                    resolve(
                      uniqBy(
                        (Array.isArray(Data.data)
                          ? uniqBy(Data.data, 'id')
                          : [Data.data]
                        ).sort(sorter),
                        'id'
                      )
                    );
                  });
                }
              })
              .catch((error) => {
                resolve([]);
              });
          });
      }
    });
  }

  @action updateEventHighlights(EventID, newHighlights) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Highlights) => {
        Highlights = reject(Highlights, ["event_id", EventID]);
        Highlights = Highlights.concat(newHighlights);
        this.saveKey.data = sortBy(Highlights, "update_date");
        storage.save(this.saveKey).then(() => {
          this.highlights = this.saveKey.data;
          resolve();
        });
      });
    });
  }

 */
