import stores from "../../../stores";
import requestObject from '../../../services/requestObjects'
import requestData from "../../../services/tcpRequestData"
import serverEventListener from "../../../services/severEventListener";
class Requester {
    constructor() {
        this.currentUserPhone = stores.Session.SessionStore.phone;
    }
    currentUserPhone = ""
    like() {
        return new Promise((resolve, reject) => {

        })
    }
    unlike() {
        return new Promise((resolve, reject) => {

        })
    }
    publish() {
        return new Promise((resolve, reject) => {

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
                serverEventListener.sendRequest(JSONData).then((SuccessMessage) => {
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
    delete() {
        return new Promise((resolve, reject) => {

        })
    }
    hide() {
        return new promise((resovle, reject) => {

        })
    }
}
const Request = new Requester()
export default Request