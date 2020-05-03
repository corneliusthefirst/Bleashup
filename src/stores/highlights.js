import storage from "./Storage";
import { observable, action } from "mobx";

import { uniqBy, reject, filter, find, findIndex, sortBy } from "lodash";
import moment from "moment";
import tcpRequest from "../services/tcpRequestData";
import request from '../services/requestObjects';
import serverEventListener from "../services/severEventListener"
import emitter from '../services/eventEmiter';
export default class highlights {
  constructor() {

  }
  curentTemporalHighlight = []
  @observable highlights = [];
  saveKey = {
    key: "highlights",
    data: []
  };

  @action addHighlight(H) {
    return this.addHighlights([H])
  }

  initializeGetHighlightsListener() {
    console.warn('initializing listener')
    emitter.on('give-highlight', (id, hid) => {
      console.warn(id, hid)
      if (this.curentTemporalHighlight.length <= 0 || this.curentTemporalHighlight[id].length <= 0) {
        this.fetchHighlights(id).then(highlights => {
          this.curentTemporalHighlight[id] = highlights
          let h = find(this.curentTemporalHighlight[id], { id: hid })
          emitter.emit('take-highlight', h)
        })
      } else {
        let h = find(this.curentTemporalHighlight[id], { id: hid })
        emitter.emit(`take-highlight_${id}`, h)
      }
    })
  }

  replaceHighlights(Highlights, event_id) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(allHighlights => {
        //let allNewHighlights = allHighlights.filter(ele => ele.event_id !== event_id)
        // let allNewHighlights = 
        this.saveKey.data = uniqBy(Highlights.concat(allHighlights), "id");// Highlights.concat(allNewHighlights)
        storage.save(this.saveKey).then(() => {
          this.highlights = this.saveKey.data
          resolve()
        })
      })
    })
  }
  @action addHighlights(Highlight) {
    return new Promise((resolve, Reject) => {
      this.readFromStore().then(Highlights => {
        if (!Highlights || Highlights.length !== 0) {
          if (Highlight.length === 1) {
            Highlights = reject(Highlights, { id: Highlight[0].id })
          }
          Highlights = uniqBy(Highlight.concat(Highlights), 'id');
        }
        else Highlights = Highlight;
        this.saveKey.data = Highlights;
        storage.save(this.saveKey).then(() => {
          this.highlights = this.saveKey.data;
          resolve();
        });
      });
    });
  }
  updateHighlightPublicState(update) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Highlights => {
        let hIndex = findIndex(Highlights, { id: update.highlight_id })
        Highlights[hIndex].public_state = update.public_state
        this.saveKey.data = Highlights
        storage.save(this.saveKey).then(() => {
          this.highlights = this.saveKey.data;
          resolve(Highlights[hIndex])
        })
      })
    })
  }
  removeHighlight(id) {
    return new Promise((resolve, rejectPromise) => {
      this.readFromStore().then(Highlights => {
        let Previoushighlight = find(Highlights, { id: id })
        Highlights = reject(Highlights, { id, id });
        this.saveKey.data = id == "newHighlightId" ? [request.Highlight()].concat(Highlights) :
          Highlights;
        storage.save(this.saveKey).then(() => {
          this.highlights = this.saveKey.data;
          resolve(Previoushighlight);
        });
      });
    });
  }
  fetchHighlightsFromRemote(eventID) {
    let sorter = (a, b) => (a.created_at > b.created_at ? -1 :
      a.created_at < b.created_at ? 1 : 0)
    return new Promise((resolve, reject) => {
      if (this.curentTemporalHighlight[eventID] && this.curentTemporalHighlight[eventID].length > 0) {
        resolve(this.curentTemporalHighlight[eventID])
      } else {
        let eventid = request.EventID()
        eventid.event_id = eventID;
        tcpRequest.getHighlights(eventid, eventid.event_id + "highlights").then(JSONDATA => {
          serverEventListener.sendRequest(JSONDATA, eventid.event_id + "highlights").then(Data => {
            if (Data.data === 'empty') {
              resolve([])
            } else {
              this.replaceHighlights(Array.isArray(Data.data) ?
                uniqBy(Data.data, 'id') : [Data.data], eventID).then(() => {
                  this.curentTemporalHighlight[eventID] = Data.data
                  resolve(uniqBy((Array.isArray(Data.data) ?
                    uniqBy(Data.data, 'id') : [Data.data]).sort(sorter), 'id'))
                })
            }
          }).catch(error => {
            resolve([])
          })
        })
      }
    })
  }
  @action fetchHighlights(eventID) {
    let sorter = (a, b) => (a.created_at > b.created_at ? -1 :
      a.created_at < b.created_at ? 1 : 0)
    return new Promise((resolve, reject) => {
      if (this.highlights.length == 0) {
        this.readFromStore().then(Highlights => {
          let result = filter(Highlights, {
            event_id: eventID
          }).sort(sorter)
          if (result.length == 0) {
            this.fetchHighlightsFromRemote(eventID).then(data => {
              resolve(data.sort(sorter))
            }).catch(() => {
              resolve([])
            })
          } else {
            resolve(uniqBy(result, 'id'))
          }
        });
      } else {
        let highlights = filter(this.highlights, { event_id: eventID });
        if (highlights.length == 0) {
          this.fetchHighlightsFromRemote(eventID).then(data => {
            resolve(uniqBy(data.sort(sorter), 'id'))
          })
        } else {
          resolve(uniqBy(highlights.sort(sorter), 'id'))
        }
      }
    });
  }


  @action updateHighlightTitle(newHightlight, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Highlights => {
        let index = findIndex(Highlights, {
          id: newHightlight.id
        });
        let Previoushighlight = JSON.stringify(Highlights[index])
        Highlights[index].title = newHightlight.title;
        if (inform) {
          Highlights[index].title_updated = true;
          Highlights[index].updated = true;
        }
        Highlights[index].update_date = moment().format();
        this.saveKey.data = sortBy(Highlights, "update_date");
        storage.save(this.saveKey).then(() => {
          this.highlights = this.saveKey.data;
          resolve(Previoushighlight);
        });
      });
    });
  }
  @action updateHighlightDescription(newHightlight, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Highlights => {
        let index = findIndex(Highlights, {
          id: newHightlight.id
        });
        let Previoushighlight = Highlights[index]
        Highlights[index].description = newHightlight.description;
        if (inform) {
          Highlights[index].description_updated = true;
          Highlights[index].updated = true;
        }
        Highlights[index].update_date = moment().format();
        this.saveKey.data = sortBy(Highlights, "update_date");
        storage.save(this.saveKey).then(() => {
          this.highlights = this.saveKey.data;
          resolve(Previoushighlight);
        });
      });
    });
  }
  @action updateHighlightUrl(newHightlight, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Highlights => {
        let index = findIndex(Highlights, {
          id: newHightlight.id
        });
        let Previoushighlight = Highlights[index]
        Highlights[index].url = newHightlight.url;
        if (inform) {
          Highlights[index].url_updated = true;
          Highlights[index].updated = true;
        }
        Highlights[index].update_date = moment().format();
        this.saveKey.data = sortBy(Highlights, "update_date");
        storage.save(this.saveKey).then(() => {
          this.highlights = this.saveKey.data;
          resolve(Previoushighlight);
        });
      });
    });
  }

  @action updateHighlight(newHightlight, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Highlights => {
        let Highlight = find(Highlights, {
          id: newHightlight.id
        });
        let index = findIndex(Highlights, {
          id: newHightlight.id
        });
        Highlight.url = newHightlight.url;
        Highlight.title = newHightlight.title;
        Highlight.description = newHightlight.description;
        Highlight.event_id = newHightlight.event_id;

        if (inform) {
          Highlight.all_updated = true;
          Highlight.updated = true;
        }
        Highlight.update_date = moment().format();
        Highlights.splice(index, 1, Highlight);
        this.saveKey.data = sortBy(Highlights, "update_date");
        storage.save(this.saveKey).then(() => {
          this.highlights = this.saveKey.data;
          resolve();
        });
      });
    });
  }

  @action updateEventHighlights(eventID, newHighlights) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Highlights => {
        Highlights = reject(Highlights, ["event_id", eventID]);
        Highlights = Highlights.concat(newHighlights);
        this.saveKey.data = sortBy(Highlights, "update_date");
        storage.save(this.saveKey).then(() => {
          this.highlights = this.saveKey.data;
          resolve();
        });
      });
    });
  }
  loadHighlight(id) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Highs => {
        let high = find(Highs, { id: id })
        if (high) {
          resolve(high)
        } else {
          this.loadHighlightFromRemote(id).then(highlight => {
            this.addHighlight(highlight).then(() => {
              resolve(highlight)
            })
          }).catch((e) => {
            resolve()
          })
        }
      })
    })
  }

  loadHighlightFromRemote(id) {
    return new Promise((resolve, reject) => {
      let RequestObject = request.HID();
      RequestObject.h_id = id;
      tcpRequest.getHighlight(RequestObject, id + "highlight").then(JSONData => {
        serverEventListener.sendRequest(JSONData, id + "highlight").then(Highlight => {
          if (Highlight.data && Highlight.data !== 'empty') {
            resolve(Highlight.data)
          } else {
            reject()
          }
        })
      }).catch(() => {
        reject()
      })
    })
  }

  @action resetHighlight(newHightlight, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Highlights => {
        let Highlight = find(Highlights, {
          id: newHightlight.id
        });
        let index = findIndex(Highlights, { id: newHightlight.id });
        Highlight.title = newHightlight.title;
        Highlight.description = newHightlight.description;
        Highlight.url = newHightlight.url;
        if (inform) {
          Highlight.description_updated = true;
          Highlight.updated = true;
        }
        Highlight.update_date = moment().format("YYYY-MM-DD HH:mm");
        Highlights.splice(index, 1, Highlight);
        this.saveKey.data = sortBy(Highlights, "update_date");
        storage.save(this.saveKey).then(() => {
          this.highlights = this.saveKey.data;
          resolve();
        });
      });
    });
  }

  readFromStore() {
    return new Promise((resolve, reject) => {
      storage
        .load({
          key: "highlights",
          autoSync: true
        })
        .then(Highlights => {
          resolve(sortBy(Highlights, ['created_at'], ['desc']));
        })
        .catch(error => {
          resolve([]);
        });
    });
  }
}
