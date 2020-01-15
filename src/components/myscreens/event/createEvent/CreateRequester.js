import tcpRequest from '../../../../services/tcpRequestData';
import EventListener from '../../../../services/severEventListener';
import  stores  from '../../../../stores';
import  uuid  from 'react-native-uuid';
import  moment  from 'moment';
import { Toast } from 'native-base';

class CreateRequester {
    createEvent(event){
        return new Promise((resolve,reject) => {
            tcpRequest.createEvent(event,event.id).then(JSONData => {
                EventListener.sendRequest(JSONData,event.id).then(response => {
                    let newEvent = {...event,id:response.event_id}
                    stores.Events.addEvent(newEvent).then(() => {
                        let Change = {
                            id: uuid.v1(),
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
                        resolve(newEvent)
                    })
                }).catch(() => {
                    Toast.show({text:'Unable To Perform Network Request'})
                    reject(error)
                })
            })
        })
    }
}

 const CreateRequest = new CreateRequester()
export default CreateRequest