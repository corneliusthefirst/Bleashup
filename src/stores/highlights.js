import storage from "./Storage";
import { observable, action } from "mobx";

import { uniqBy, dropWhile, filter, find, findIndex, sortBy } from "lodash";
import moment from "moment";
export default class highlights {
  @observable highlights = [];
  saveKey = {
    key: "highlights",
    data: []
  };
  @action addHighlights(Highlight) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Highlights => {
        Highlights = uniqBy(Highlights.concat([Highlight]), "id");
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
        Highlights = dropWhile(Highlights, ["id", id]);
        this.saveKey.data = Highlights;
        storage.save(this.saveKey.data).then(() => {
          this.highlights = this.saveKey.data;
          resolve();
        });
      });
    });
  }
  @action fetchHighlights(eventID) {
    return new Promise((resolve, reject) => {
      if (!this.highlights) {
        this.readFromStore().then(Highlights => {
          resolve(
            filter(Highlights, {
              event_id: eventID
            }),
            "update_date"
          );
        });
      } else {
        resolve(
          sortBy(
            filter(this.highlights, {
              event_id: eventID
            })
          ),
          "update_date"
        );
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
        if (inform) Highlight.title_updated = true;
        Highlight.update_date = moment.format("YYYY-MM-DD HH:mm");
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
        if (inform) Highlight.description_updated = true;
        Highlight.update_date = moment.format("YYYY-MM-DD HH:mm");
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
        if (inform) Highlight.url_updated = true;
        Highlight.update_date = moment.format("YYYY-MM-DD HH:mm");
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
        Highlights = dropWhile(Highlights, ["event_id", eventID]);
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
