import stores from "../../../stores";
import requestObject from '../../../services/requestObjects'
import requestData from "../../../services/tcpRequestData"
import serverEventListener from "../../../services/severEventListener";
class Requester {
    constructor() {
        this.currentUserPhone = stores.Session.SessionStore.phone;
    }
    currentUserPhone = ""
    like(event_id) {
        return new Promise((resolve, reject) => {
            let eventID = requestObject.EventID()
            eventID.event_id = event_id;
            requestData.likeEvent(eventID).then(JSONData => {
                serverEventListener.sendRequest(JSONData, EventID).then(SuccessMessage => {
                    stores.Events.likeEvent(event_id, false).then(() => {
                        resolve("ok");
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
            requestData.unlikeEvent(eventID).then((JSONData) => {
                serverEventListener.sendRequest(JSONData, EventID).then(SuccessMessage => {
                    stores.Events.unlikeEvent(event_id, false).then(() => {
                        resolve("ok")
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
            requestData.publishEvent(eventID).then(JSONData => {
                serverEventListener.sendRequest(JSONData, EventID).then(SuccessMessage => {
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
            Participant.phone = this.currentUserPhone;
            Participant.status = "joint";
            Participant.master = false;
            Participant.host = stores.Session.SessionStore.host
            let Join = requestObject.EventIDHost();
            Join.event_id = EventID;
            Join.host = EventHost;
            requestData.joinEvent(Join).then((JSONData) => {
                serverEventListener.sendRequest(JSONData, EventID).then((SuccessMessage) => {
                    stores.Events.addParticipant(EventID, Participant, false).then(() => {
                        stores.Events.joinEvent(EventID).then(() => {
                            resolve("ok")
                        })
                    })
                }).catch(error => {
                    console.error(error)
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