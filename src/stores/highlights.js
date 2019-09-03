import storage from "./Storage";
import { observable, action } from "mobx";

import { uniqBy, reject, filter, find, findIndex, sortBy } from "lodash";
import moment from "moment";
import tcpRequest from "../services/tcpRequestData";
import request from '../services/requestObjects';
import serverEventListener from "../services/severEventListener"
export default class highlights {
  @observable highlights = [];
  saveKey = {
    key: "highlights",
    data: []
  };
  @action addHighlight(H){
    return this.addHighlights([H])
  }
  @action addHighlights(Highlight) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Highlights => {
        if (Highlights.length !== 0)
          Highlights = uniqBy(Highlights.concat(Highlight), "id");
        else Highlights = Highlight;
        this.saveKey.data = Highlights;
        storage.save(this.saveKey.data).then(() => {
          this.highlights = this.saveKey.data;
          resolve();
        });
      });
    });
  }

  @action removeHighlight(id) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Highlights => {
        Highlights = reject(Highlights, ["id", id]);
        this.saveKey.data = Highlights;
        storage.save(this.saveKey.data).then(() => {
          this.highlights = this.saveKey.data;
          resolve();
        });
      });
    });
  }
  fetchHighlightsFromRemote(eventID){
    return new Promise((resolve,reject) =>{
      let eventid = request.EventID()
      eventid.event_id = eventID;
      tcpRequest.getHighlights(eventid, eventid.event_id + "highlights").then(JSONDATA => {
        serverEventListener.sendRequest(JSONDATA, eventid.event_id + "highlights").then(Data => {
          if (Data == 'empty') {
            resolve([])
          } else {
            this.addHighlights(Data).then(() => {
              resolve(sortBy(Data,"update_date"))
            })
          }
        }).catch(error => {
          resolve([])
        })
      })
    })
  }
  @action fetchHighlights(eventID) {
    return new Promise((resolve, reject) => {
      if (this.highlights.length == 0) {
        this.readFromStore().then(Highlights => {
          let result = filter(Highlights, {
            event_id: eventID
          })
          if(result.length==0){
            this.fetchHighlightsFromRemote(eventID).then(data =>{
              resolve(data)
            })
          }
        });
      } else {
       let highlights = filter(this.highlights,{event_id:eventID});
       if(highlights.length == 0){
         this.fetchHighlightsFromRemote(eventID).then(data =>{
           resolve(data)
         })
       }
      }
    });
  }
  @action updateHighlightTitle(newHightlight, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Highlights => {
        let Highlight = find(Highlights, {
          id: newHightlight.id
        });
        let index = findIndex(Highlights, {
          id: newHightlight.id
        });
        Highlight.title = newHightlight.title;
        if (inform) {
          Highlight.title_updated = true;
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
  @action updateHighlightDescription(newHightlight, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Highlights => {
        let Highlight = find(Highlights, {
          id: newHightlight.id
        });
        let index = findIndex(Highlights, {
          id: newHightlight.id
        });
        Highlight.description = newHightlight.description;
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
  @action updateHighlightURL(newHightlight, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Highlights => {
        let Highlight = find(Highlights, {
          id: newHightlight.id
        });
        let index = findIndex(Highlights, {
          id: newHightlight.id
        });
        Highlight.url = newHightlight.url;
        if (inform) {
          Highlight.url_updated = true;
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
  @action updateEventHighlights(eventID, newHightlights) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Highlights => {
        Highlights = reject(Highlights, ["event_id", eventID]);
        Highlights = Highlights.concat(newHightlights);
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
          resolve(Highlights);
        })
        .catch(error => {
          resolve([]);
        });
    });
  }
}
