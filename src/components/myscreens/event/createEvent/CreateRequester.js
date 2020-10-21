import tcpRequest from '../../../../services/tcpRequestData';
import EventListener from '../../../../services/severEventListener';
import  stores  from '../../../../stores';
import  moment  from 'moment';
import firebase  from 'react-native-firebase';
import Toaster from '../../../../services/Toaster';
import IDMaker from '../../../../services/IdMaker';
import Texts from '../../../../meta/text';

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
                        const newEvent = { ...event, id: response.event_id }
                        stores.Events.addEvent(newEvent).then(() => {
                            let Change = {
                                id: IDMaker.make(),
                                title: Texts.first_update,
                                updated: "new_event",
                                event_id: response.event_id,
                                updater: stores.LoginStore.user.phone,
                                changed: Texts.created_the_activity,
                                new_value: { data: null, new_value: null },
                                date: event.created_at,
                                time: null
                            }
                            stores.ChangeLogs.addChanges(Change).then(res => {
                                resolve(newEvent)
                            })
                        })
                    }
                }).catch((error) => {
                    Toaster({text:Texts.unable_to_perform_request})
                    reject(error)
                })
            })
        })
    }
}

 const CreateRequest = new CreateRequester()
export default CreateRequest