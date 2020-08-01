import tcpRequest from '../../../../services/tcpRequestData';
import EventListener from '../../../../services/severEventListener';
import  stores  from '../../../../stores';
import  uuid  from 'react-native-uuid';
import  moment  from 'moment';
import firebase  from 'react-native-firebase';
import Toaster from '../../../../services/Toaster';

class CreateRequester {
    createEvent(event){
        return new Promise((resolve,reject) => {
            tcpRequest.createEvent(event,event.id).then(JSONData => {
                console.warn("creating activiy ....")
                EventListener.sendRequest(JSONData,event.id).then(response => {
                    if(event.type === "relation"){
                        stores.Events.loadCurrentEventFromRemote(response.event_id).then(eve => {
                            resolve(eve)
                        })
                    }else{
                        let newEvent = { ...event, id: response.event_id }
                        stores.Events.addEvent(newEvent).then(() => {
                            let Change = {
                                id: uuid.v1(),
                                title: `First Update`,
                                updated: "new_event",
                                event_id: response.event_id,
                                updater: stores.LoginStore.user.phone,
                                changed: `Created The Activity`,
                                new_value: { data: null, new_value: null },
                                date: event.created_at,
                                time: null
                            }
                            resolve(newEvent)
                            //firebase.database().ref(`activity/${newEvent.id}/participants`).set(newEvent.participant)
                            stores.ChangeLogs.addChanges(Change).then(res => {

                            })
                        })
                    }
                }).catch((error) => {
                    Toaster({text:'Unable to perform request'})
                    reject(error)
                })
            })
        })
    }
}

 const CreateRequest = new CreateRequester()
export default CreateRequest