import stores from "../../../stores";
import requestObject from '../../../services/requestObjects'
import requestData from "../../../services/tcpRequestData"
import serverEventListener from "../../../services/severEventListener";
import { forEach } from "lodash"
class Requester {
    constructor() {
        this.currentUserPhone = stores.Session.SessionStore.phone;
    }
    currentUserPhone = ""
    like(event_id) {
        return new Promise((resolve, reject) => {
            let eventID = requestObject.EventID()
            eventID.event_id = event_id;
            requestData.likeEvent(eventID, event_id + "like").then(JSONData => {
                serverEventListener.sendRequest(JSONData, event_id + "like").then(SuccessMessage => {
                    stores.Likes.like(event_id, stores.Session.SessionStore.phone).then(() => {
                        resolve("ok");
                    })
                }).catch(error => {
                    console.warn(error, "like")
                    reject(error)
                })
            })
        })
    }
    invite(invites, id) {
        return new Promise((resolve, reject) => {
            let i = 0
            requestData.invite_many(invites, id + "_invites").then(JSONData => {
                serverEventListener.sendRequest(JSONData, id + "_invites").then(SuccessMessage => {
                    invites.forEach(element => {
                        element.invitation.type = 'sent';
                        stores.Invitations.addInvitations(element.invitation).then(mes => {
                            if (i == invites.length - 1) resolve(SuccessMessage)
                            i++
                        })
                    })
                })
            })
        })
    }
    unlike(event_id) {
        return new Promise((resolve, reject) => {
            let eventID = requestObject.EventID()
            eventID.event_id = event_id;
            requestData.unlikeEvent(eventID, event_id + "unlike").then((JSONData) => {
                serverEventListener.sendRequest(JSONData, event_id + "unlike").then(SuccessMessage => {
                    stores.Likes.unlike(event_id, stores.Session.SessionStore.phone).then(() => {
                        resolve("ok");
                    })
                }).catch(error => {
                    console.warn(error, "unlike")
                    reject(error)
                })
            })
        })
    }
    publish(event_id) {
        return new Promise((resolve, reject) => {
            let eventID = requestObject.EventID();
            eventID.event_id = event_id;
            requestData.publishEvent(eventID, event_id + "publish").then(JSONData => {
                serverEventListener.sendRequest(JSONData, event_id + "publish").then(SuccessMessage => {
                    stores.Events.publishEvent(event_id, false).then(() => {
                        resolve()
                    })
                }).catch(error => {
                    reject(error)
                })
            })
        })
    }
    join(EventID, EventHost) {
        return new Promise((resolve, reject) => {
            let Participant = requestObject.Participant();
            Participant.phone = stores.Session.SessionStore.phone;
            Participant.status = "joint";
            Participant.master = false;
            Participant.host = stores.Session.SessionStore.host
            let Join = requestObject.EventIDHost();
            Join.event_id = EventID;
            Join.host = EventHost;
            requestData.joinEvent(Join, EventID + "join").then((JSONData) => {
                serverEventListener.sendRequest(JSONData, EventID + "join").then((SuccessMessage) => {
                    stores.Events.addParticipant(EventID, Participant, false).then(() => {
                        stores.Events.joinEvent(EventID).then(() => {
                            resolve("ok")
                        })
                    })
                }).catch(error => {
                    reject(error)
                })
            })
        })
    }
    delete(event_id) {
        return new Promise((resolve, reject) => {
            stores.Events.delete(event_id).then((response) => {
                resolve("ok");
            })
        })
    }
    hide(event_id) {
        return new Promise((resolve, reject) => {
            stores.Events.hide(event_id).then(() => {
                resolve("ok")
            })
        })
    }
}
const Request = new Requester()
export default Request