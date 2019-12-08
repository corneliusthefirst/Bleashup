import tcpRequest from '../../../services/tcpRequestData';
import stores from '../../../stores';
import EventListener from '../../../services/severEventListener';
class HomeRequester {
    constructor() {

    }

    createEvent(event) {
        return new Promise((resolve, reject) => {
            tcpRequest.createEvent(event, stores.LoginStore.user.phone).then(JSONData => {
                EventListener.sendRequest(JSONData, stores.LoginStore.user.phone).then((response) => {
                    let newEvent = { ...event, id: response.event_id, calendared: true }
                    stores.Events.addEvent(newEvent).then(() => {
                        resolve("ok")
                    })
                    // stores.Events.addEvent()
                }).catch((error) => {
                    reject(error)
                })
            })
        })
    }
}
const HomeRequest = new HomeRequester()
export default HomeRequest