import tcpRequest from '../../../../services/tcpRequestData';
import EventListener from '../../../../services/severEventListener';
import  stores  from '../../../../stores';
import  uuid  from 'react-native-uuid';
import  moment  from 'moment';
import { Toast } from 'native-base';
import firebase  from 'react-native-firebase';

class CreateRequester {
    createEvent(event){
        return new Promise((resolve,reject) => {
            tcpRequest.createEvent(event,event.id).then(JSONData => {
                console.warn("creating activiy ....")
                EventListener.sendRequest(JSONData,event.id).then(response => {
                    console.warn("activity created, ",response )
                    let newEvent = {...event,id:response.event_id}
                    stores.Events.addEvent(newEvent).then(() => {
                        console.warn("creating activity completed")
                        let Change = {
                            id: uuid.v1(),
                            title: `First Update`,
                            updated: "new_event",
                            event_id: response.event_id,
                            updater: stores.LoginStore.user.phone   ,
                            changed: `Created The Activity`,
                            new_value: { data: null, new_value: null },
                            date: event.created_at,
                            time: null
                        }
                        firebase.database().ref(`activity/${newEvent.id}/participants`).set(newEvent.participant)
                        stores.ChangeLogs.addChanges(Change).then(res => {
                            
                        })
                        resolve(newEvent)
                    })
                }).catch((error) => {
                    Toast.show({text:'Unable to perform request'})
                    reject(error)
                })
            })
        })
    }
}

 const CreateRequest = new CreateRequester()
export default CreateRequest