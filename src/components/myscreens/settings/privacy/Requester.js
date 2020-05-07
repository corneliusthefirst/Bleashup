import request from "../../../../services/requestObjects";
import tcpRequest from "../../../../services/tcpRequestData";
import EventListener from "../../../../services/severEventListener";
import uuid from 'react-native-uuid';
import stores from "../../../../stores";

export const storeToken = "save_token";
export const block = "block";
export const unblock = "unblock"
export const mute = "mute"
export const unmute = "unmute"
export const blocked = "blocked"
export const muted = "muted"
export const meBlocked = "me_blocked"
export const meMuted = "me_muted"
export const get = "get"
class Requster {
    saveToken(token, phone) {
        return new Promise((resolve, reject) => {
            this.sendPrivacyUpdate(token, storeToken).then((res) => {
                stores.Privacy.updateToken(token).then(() => {
                    resolve(token);
                })
            })
        });
    }
    get(privacy) {
        return new Promise((resolve, reject) => {
            this.sendPrivacyUpdate(privacy, get).then(privacy => {
                console.warn(privacy.data)
                resolve(privacy.data.map(ele => ele.item))
            })
        })
    }
    getBlocked() {
        return new Promise((resolve, reject) => {
            this.get("blocked").then(blocked => {
                stores.Privacy.updateBlocked(blocked).then(() => {
                    resolve(blocked)
                })
            })
        })
    }
    getMuted() {
        return new Promise((resolve, reject) => {
            this.get("muted").then(muted => {
                stores.Privacy.updateMuted(muted).then(() => {
                    resolve(blocked)
                })
            })
        })
    }
    blocked(member) {
        return new Promise((resolve, reject) => {
            this.sendPrivacyUpdate(member, blocked).then((res) => {
                if(res.data) stores.Privacy.block(member).then(() => {
                    resolve(res.data)
                })
                else stores.Privacy.unblock(member).then(() => {
                    resolve(res.data)
                })
            })
        })
    }
    muted(member) {
        return new Promise((resolve, reject) => {
            this.sendPrivacyUpdate(member, muted).then((res) => {
                if(res.data) stores.Privacy.mute(member).then(() => {
                    resolve(res.data)
                })
                else stores.Privacy.unmute(member).then(() => {
                    resolve(res.data)
                })
            })
        })
    }
    meMuted(member) {
        return new Promise((resolve, reject) => {
            this.sendPrivacyUpdate(member, meMuted).then(res => {
                if(res.data) stores.Privacy.muteMe(member).then(() => {
                    resolve(res.data)
                })
                else stores.Privacy.unmuteMe(member).then(() => {
                    resolve(res.data)
                })
            })
        })
    }
    meBlocked(member) {
        return new Promise((resolve, reject) => {
            this.sendPrivacyUpdate(member, meBlocked).then(res => {
                if(res.data) stores.Privacy.blockMe(member).then(() => {
                    resolve(res.data)
                })
                else stores.Privacy.unblockMe(member).then(() => {
                    resolve(res.data)
                })
            })
        })
    }
    block(member) {
        return new Promise((resolve, reject) => {
            this.sendPrivacyUpdate(member, block).then((res) => {
                stores.Privacy.block(member)
                resolve(res)
            })
        });
    }
    unblock(member) {
        return new Promise((resolve, reject) => {
            this.sendPrivacyUpdate(member, unblock).then(() => {
                stores.Privacy.unblock(member).then(() => {
                    resolve()
                })
            })
        })
    }
    mute(member) {
        return new Promise((resovle, reject) => {
            this.sendPrivacyUpdate(member, mute).then((res) => {
                stores.Privacy.mute(member)
                resovle(res)
            })
        })
    }
    unmute(member) {
        return new Promise((resolve, reject) => {
            this.sendPrivacyUpdate(member, unmute).then((res) => {
                stores.Privacy.unmute(member)
                resolve(res)
            })
        })
    }
    sendPrivacyUpdate(data, action) {
        return new Promise((resolve, reject) => {
            let id = uuid.v1()
            let privacy = request.Privacy();
            privacy.data = data;
            privacy.action = action;
            tcpRequest
                .update_privacy(privacy, "privacy" + id)
                .then((JSONData) => {
                    EventListener.sendRequest(JSONData,
                        "privacy" + id).then((res) => {
                            resolve(res)
                        }).catch((error) => {
                            reject(error)
                        })
                });
        })
    }
}

export const PrivacyRequester = new Requster();
