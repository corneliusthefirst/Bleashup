import request from "../../../../services/requestObjects";
import tcpRequest from "../../../../services/tcpRequestData";
import EventListener from "../../../../services/severEventListener";
import stores from "../../../../stores";
import toTitleCase from '../../../../services/toTitle';
import MainUpdater from '../../../../services/mainUpdater';
import moment  from 'moment';
import IDMaker from '../../../../services/IdMaker';

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
export const shared_post = 'post-share'
export const shared_remind = 'remind-share'
export const shared_votes = 'vote-share'
export const contacts_scope = 'contacts'
export const follewers_scope = 'follow'
export const some = 'some'
export class Requster {

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
                resolve(privacy.data.map(ele => ele.item))
            }).catch((e) => {
                reject(e)
            })
        })
    }

    getBlocked() {
        /** these takes all users blocked by the user (its takes from the server) you dont see any of theirs stuff*/
        return new Promise((resolve, reject) => {
            this.get("blocked").then(blocked => {
                stores.Privacy.updateBlocked(blocked).then(() => {
                    resolve(blocked)
                })
            }).catch((e) => {
                reject(e)
            })
        })
    }

    getMuted() {
        /** these takes all users(ids) muted by the user (its takes from the server) the users are not notify of changes done by these users*/
        return new Promise((resolve, reject) => {
            this.get("muted").then(muted => {
                stores.Privacy.updateMuted(muted).then(() => {
                    resolve(blocked)
                })
            }).catch((e) => {
                reject(e)
            })
        })
    }

    blocked(member) {
        /**to know if a phone is blocked then add that phone to the blocked store and server block else you unblock return a boolean */
        return new Promise((resolve, reject) => {
            this.sendPrivacyUpdate(member, blocked).then((res) => {
                if (res.data) stores.Privacy.block(member).then(() => {
                    resolve(res.data)
                })
                else stores.Privacy.unblock(member).then(() => {
                    resolve(res.data)
                })
            })
        })
    }

    muted(member) {
        /**same as blocked but for muted case */
        return new Promise((resolve, reject) => {
            this.sendPrivacyUpdate(member, muted).then((res) => {
                if (res.data) stores.Privacy.mute(member).then(() => {
                    resolve(res.data)
                })
                else stores.Privacy.unmute(member).then(() => {
                    resolve(res.data)
                })
            })
        })
    }

    meMuted(member) {
        /**to check if i am muted by someone or not */
        return new Promise((resolve, reject) => {
            this.sendPrivacyUpdate(member, meMuted).then(res => {
                if (res.data) stores.Privacy.muteMe(member).then(() => {
                    resolve(res.data)
                })
                else stores.Privacy.unmuteMe(member).then(() => {
                    resolve(res.data)
                })
            })
        })
    }

    meBlocked(member) {
         /**to check if i am blocked by someone or not */
        return new Promise((resolve, reject) => {
            this.sendPrivacyUpdate(member, meBlocked).then(res => {
                if (res.data) stores.Privacy.blockMe(member).then(() => {
                    resolve(res.data)
                })
                else stores.Privacy.unblockMe(member).then(() => {
                    resolve(res.data)
                })
            })
        })
    }

    block(member) {
         /**to block a user */
        return new Promise((resolve, reject) => {
            this.sendPrivacyUpdate(member, block).then((res) => {
                stores.Privacy.block(member)
                resolve(res)
            })
        });
    }

    unblock(member) {
         /**to unblock a user */
        return new Promise((resolve, reject) => {
            this.sendPrivacyUpdate(member, unblock).then(() => {
                stores.Privacy.unblock(member).then(() => {
                    resolve()
                })
            })
        })
    }

    mute(member) {
         /**to mute a user */
        return new Promise((resovle, reject) => {
            this.sendPrivacyUpdate(member, mute).then((res) => {
                stores.Privacy.mute(member)
                resovle(res)
            })
        })
    }

    unmute(member) {
         /**to unmute a muted user */
        return new Promise((resolve, reject) => {
            this.sendPrivacyUpdate(member, unmute).then((res) => {
                stores.Privacy.unmute(member)
                resolve(res)
            })
        })
    }


    sendPrivacyUpdate(data, action) {
        return new Promise((resolve, reject) => {
            let privacy = request.Privacy();
            privacy.data = data;
            privacy.action = action;
            tcpRequest
                .update_privacy(privacy, "privacy_" + stores.LoginStore.user.phone)
                .then((JSONData) => {
                    EventListener.sendRequest(JSONData,
                        "privacy_" + stores.LoginStore.user.phone).then((res) => {
                            resolve(res)
                        }).catch((error) => {
                            reject(error)
                        })
                });
        })
    }

    formShareNotifTitle(action) {
        if (action == shared_post) {
            return "Post"
        } else if (action == shared_remind) {
            return 'Remind'
        } else {
            return 'Vote'
        }
    }
    prepareRequest(scop, data, id) {
        return new Promise((resolve, reject) => {
            if (scop.includes('contact')) {
                return tcpRequest.share_with_contacts(data, id).then((JSONData) => {
                    resolve(JSONData)
                })
            } else if (scop.includes('follow')) {
                return tcpRequest.share_with_followers(data, id).then(JSONData => {
                    resolve(JSONData)
                })
            } else if (scop.includes('some')) {
                tcpRequest.share_with_some(data, id).then(JSONData => {
                    resolve(JSONData)
                })
            }
        })
    }
    shareWithContacts(eventID, itemID, type, activtyName, itemTitle, photo) {
        return this.sendShare(eventID, itemID, type, activtyName, itemTitle, contacts_scope, photo)
    }
    shareWithFollowers(eventID, itemID, type, activtyName, itemTitle, photo) {
        return this.sendShare(eventID, itemID, type, activtyName, itemTitle, follewers_scope, photo)
    }
    shareWithSome(eventID, itemID, type, activtyName, itemTitle, photo, members) {
        return this.sendShare(eventID, itemID, type, activtyName, itemTitle, some, photo, members)
    }
    sendShare(eventID, itemID, type, activityName, itemTitle, scope, photo, members) {
        return new Promise((resolve, reject) => {
            let share = request.Share()
            share.event_id = eventID
            share.share.activity_id = eventID
            share.share.id = IDMaker.make()
            share.share.item_id = itemID
            share.members = members
            share.share.type = type
            share.share.scope = scope
            share.notif.notification.title = 'New ' + this.formShareNotifTitle(type) + ' Share';
            share.notif.notification.body = toTitleCase(stores.LoginStore.user.nickname) + ' @ ' + toTitleCase(activityName) + ' Shared ' + toTitleCase(itemTitle)
            share.notif.notification.image = photo
            this.prepareRequest(scope, share, itemID + type).then(JSONData => {
                EventListener.sendRequest(JSONData, itemID + type).then((response) => {
                    MainUpdater.saveShares(eventID, share.share, stores.LoginStore.user, moment().format()).then((change) => {
                        resolve(change)
                    })
                })
            })
        })
    }
    followContact(contact){
        return new Promise((resolve,reject) => {
            let update = {
                phone:contact,
                host:stores.Session.SessionStore.host,
            }
            let notif = request.Notification()
            notif.notification.title = "New Follower";
            notif.notification.body = toTitleCase(stores.LoginStore.user.nickname) + ' Is now Following you'; 
            notif.notification.image = stores.LoginStore.user.profile
            update.notif = notif
            tcpRequest.follow(update,contact+' follow').then(JSONData => {
                EventListener.sendRequest(JSONData,contact + ' follow').then((response) => {
                    stores.Contacts.addFollowing(update.phone,update.host).then(() => {
                        resolve()
                    })
                })
            })
        })
    }
    unfollowContact(contact) {
        return new Promise((resolve,reject) => {
            let update = {
                phone: contact,
            }
            tcpRequest.unfollow(update, contact + ' unfollow').then(JSONData => {
                EventListener.sendRequest(JSONData, contact + ' unfollow').then((response) => {
                    stores.Contacts.removeFollowing(update.phone).then(() => {
                        resolve()
                    })
                })
            })
        })
    }

}


export const PrivacyRequester = new Requster();
