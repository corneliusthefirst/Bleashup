import tcpRequest from '../../../services/tcpRequestData';
import stores from '../../../stores';
import EventListener from '../../../services/severEventListener';
import GState from '../../../stores/globalState';
import IDMaker from '../../../services/IdMaker';

class HomeRequester {
    constructor() {

    }

    createEvent(event) {
        return new Promise((resolve, reject) => {
            tcpRequest.createEvent(event, stores.LoginStore.user.phone).then(JSONData => {
                EventListener.sendRequest(JSONData, stores.LoginStore.user.phone).then((response) => {
                    let newEvent = { ...event, id: response.event_id, calendared: true }
                    stores.Events.addEvent(newEvent).then(() => {
                        let Change = {
                            id: IDMaker.make(),
                            title: `First Update`,
                            updated: "new_event",
                            event_id: response.event_id,
                            updater: stores.LoginStore.user,
                            changed: `Created The Activity`,
                            new_value: { data: null, new_value: null },
                            date: event.created_at,
                            time: null
                        }
                        stores.ChangeLogs.addChanges(Change).then(res => {

                        })
                        resolve(GState.DeepLinkURL+"event/"+response.event_id)
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