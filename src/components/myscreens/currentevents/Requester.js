import stores from "../../../stores";
import requestObject from '../../../services/requestObjects'
import requestData from "../../../services/tcpRequestData"
import serverEventListener from "../../../services/severEventListener";
import { forEach } from "lodash"
import moment from "moment"
import { AddParticipant } from '../../../services/cloud_services';
import firebase from 'react-native-firebase';
import Toaster from "../../../services/Toaster";
import IDMaker from '../../../services/IdMaker';
import Texts from '../../../meta/text';
import UpdatesDispatch from "../../../services/updatesDispatcher";
import Updates from '../../../services/updates-posibilites';
class Requester {
    constructor() {
        this.currentUserPhone = stores.Session.SessionStore.phone;
    }
    currentUserPhone = ""
    like(event_id, likesCount) {
        return new Promise((resolve, reject) => {
            let eventID = requestObject.EventID()
            eventID.event_id = event_id;
            requestData.likeEvent(eventID, event_id + "like").then(JSONData => {
                serverEventListener.sendRequest(JSONData, event_id + "like").then(SuccessMessage => {
                    stores.Likes.like(event_id, stores.Session.SessionStore.phone, likesCount).then(() => {
                        resolve("ok");
                    })
                }).catch(error => {
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
                    forEach(invites, element => {
                        element.invitation.type = 'sent';
                        element.invitation.sent = true;
                        element.invitation.arrival_date = moment().format()
                        stores.Invitations.addInvitations(element.invitation).then(mes => {
                            if (i == invites.length - 1) resolve(SuccessMessage)
                            i++
                        })
                    })
                }).catch(error => {
                    reject(error)
                })
            })
        })
    }
    unlike(event_id, likesCount) {
        return new Promise((resolve, reject) => {
            let eventID = requestObject.EventID()
            eventID.event_id = event_id;
            requestData.unlikeEvent(eventID, event_id + "unlike").then((JSONData) => {
                serverEventListener.sendRequest(JSONData, event_id + "unlike").then(SuccessMessage => {
                    stores.Likes.unlike(event_id, stores.Session.SessionStore.phone, likesCount).then(() => {
                        resolve("ok");
                    })
                }).catch(error => {
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
                    Toaster({ type: "success", text: Texts.activity_successfully_shared, buttonText: "ok" })
                    UpdatesDispatch.dispatchUpdate(requestObject.Updated(event_id,
                        "",
                        null,
                        Updates.possibilites.published)).then(() => {
                            resolve()
                        })
                }).catch(error => {
                    reject(error)
                })
            })
        })
    }
    join(EventID, EventHost, particant) {
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
                console.warn("joining activity")
                serverEventListener.sendRequest(JSONData, EventID + "join").then((SuccessMessage) => {
                    Toaster({ text: Texts.activity_sucessfully_joined, type: "success", buttonText: "ok" })
                    UpdatesDispatch.dispatchUpdate(requestObject.Updated(EventID,
                        {host:Participant.host,
                        status:Participant.status},
                        Participant.phone,
                        Updates.possibilites.joined
                    )).then(() => {
                        console.warn("completing join")
                        resolve()
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