import stores from "../../../stores";
import requestObject from '../../../services/requestObjects'
import requestData from "../../../services/tcpRequestData"
import serverEventListener from "../../../services/severEventListener";
import { forEach } from "lodash"
import moment from "moment"
import { AddParticipant } from '../../../services/cloud_services';
import { Toast } from "native-base";
import uuid from 'react-native-uuid';
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
                        element.invitation.arrival_date = moment().format("YYYY-MM-DD HH:mm")
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
                    Toast.show({ type: "success", text: "successfully published to your contacts", buttonText: "ok" })
                    stores.Events.publishEvent(event_id, false).then(() => {
                        stores.Publishers.addPublisher(event_id, {
                            phone:
                                stores.Session.SessionStore.phone, period: { date: moment().format() }
                        }).then(() => {
                            let Change = {
                                id: uuid.v1(),
                                title: "Updates On Main Activity",
                                updated: "publish",
                                event_id: event_id,
                                changed: "Shared The Activity",
                                updater: stores.LoginStore.user.phone,
                                new_value: { data: null, new_value: null },
                                date: moment().format(),
                            }
                            stores.ChangeLogs.addChanges(Change).then(() => {
                            })
                            resolve()
                        })
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
                    Toast.show({ text: "Event Successfully Joint !", type: "success", buttonText: "ok" })
                    stores.Events.addParticipant(EventID, Participant, false).then(() => {
                        let Change = {
                            id: uuid.v1(),
                            title: "Updates On Main Activity",
                            updated: "joint_paticipant",
                            event_id: EventID,
                            changed: "Joint The Activity",
                            updater: stores.LoginStore.user.phone,
                            new_value: { data: null, new_value: null },
                            date: moment().format(),
                        }
                        stores.ChangeLogs.addChanges(Change).then(() => {
                        })
                        resolve("ok")
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