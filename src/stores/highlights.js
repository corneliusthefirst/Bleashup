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

   @action addHighlight(H){
    return this.addHighlights([H])
  }

  initializeGetHighlightsListener(){
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
 
  @action addHighlights(Highlight) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Highlights => {
        if (!Highlights || Highlights.length !== 0)
          Highlights = uniqBy(Highlights.concat(Highlight), 'id');
        else Highlights = Highlight;
        this.saveKey.data = Highlights;
        storage.save(this.saveKey).then(() => {
          this.highlights = this.saveKey.data;
          resolve();
        });
      });
    });
  }

   removeHighlight(id) {
    console.warn(id,"remove highlight 2");
    return new Promise((resolve, rejectPromise) => {
      this.readFromStore().then(Highlights => {
        console.warn("all higlights",Highlights);
        Highlights = reject(Highlights,{id,id});
        console.warn(Highlights,"highlight object deleted");
        this.saveKey.data = Highlights;
        storage.save(this.saveKey).then(() => {
          this.highlights = this.saveKey.data;
          resolve();
        });
      });
    });
  }
  fetchHighlightsFromRemote(eventID){
    return new Promise((resolve,reject) =>{
      if(this.curentTemporalHighlight[eventID] && this.curentTemporalHighlight[eventID].length> 0 ){
        resolve(this.curentTemporalHighlight[eventID])
      }else{
        let eventid = request.EventID()
        eventid.event_id = eventID;
        tcpRequest.getHighlights(eventid, eventid.event_id + "highlights").then(JSONDATA => {
          serverEventListener.sendRequest(JSONDATA, eventid.event_id + "highlights").then(Data => {
            if (Data.data === 'empty') {
              resolve([])
            } else {
              this.addHighlights(Data.data).then(() => {
                this.curentTemporalHighlight[eventID] = Data.data
                resolve(sortBy(Data.data, "update_date"))
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
    return new Promise((resolve, reject) => {
      if (this.highlights.length == 0) {
        this.readFromStore().then(Highlights => {
          let result = filter(Highlights, {
            event_id: eventID
          })
          if(result.length==0){
            this.fetchHighlightsFromRemote(eventID).then(data =>{
              console.warn(data)
              resolve(data)
            })
          }else{
            resolve(result)
          }
        });
      } else {
       let highlights = filter(this.highlights,{event_id:eventID});
       if(highlights.length == 0){
         this.fetchHighlightsFromRemote(eventID).then(data =>{
           resolve(data)
         })
       }else{
         resolve(highlights)
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
  @action updateHighlightUrl(newHightlight, inform) {
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
  
  @action resetHighlight(newHightlight, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Highlights => {
        let Highlight = find(Highlights, {
          id: newHightlight.id
        });
        let index = findIndex(Highlights, {id: newHightlight.id });
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
          resolve(Highlights);
        })
        .catch(error => {
          resolve([]);
        });
    });
  }
}
