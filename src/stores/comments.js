import {
    filter,
    dropWhile,
    find,
    findIndex,
    indexOf,
    uniqBy,
    uniq,
    reject,
} from "lodash";
import storage from "./Storage";
export default class comments {
    constructor() {
        this.readFromStore().then((comments) => {
            this.setPropties(comments);
        });

    }
    comments = [];
    saveKey = {
        key: "comments",
        data: [{}],
    };
    loadComments(id) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then((comments) => {
                if (comments && comments.length > 0) {
                    let comment = find(comments, {
                        event_id: id,
                    });
                    if (comment) {
                        resolve(comment);
                    } else {
                        resolve({ event_id: id, count: 0, latest: {} });
                    }
                } else {
                    resolve({ event_id: id, count: 0, latest: {} });
                }
            });
        });
    }
    setPropties(data) {
        this.comments = data;
    }
    addComment(comment) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Comments => {
                let index = findIndex(Comments, { event_id: comment.event_id })
                if (index >= 0) {
                    Comments[index] = comment
                } else {
                    Comments.push(comment);
                }
                this.saveKey.data = uniqBy(Comments, "event_id");
                storage.save(this.saveKey).then(() => {
                    this.setPropties(this.saveKey.data);
                    resolve();
                });
            })
        });
    }

    readFromStore() {
        return new Promise((resolve, reject) => {
            storage
                .load({
                    key: "comments",
                    autoSync: true,
                })
                .then((comments) => {
                    resolve(comments);
                })
                .catch((error) => {
                    resolve([]);
                });
        });
    }
}
