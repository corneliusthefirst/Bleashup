import request from '../../../services/requestObjects';
import tcpRequest from '../../../services/tcpRequestData';
import EventListener from '../../../services/severEventListener';

class MessageRequest {
    sendMessage(message,CommitteeID,EventID){
        return new Promise((resolve,reject) => {
            let messageData = request.MessageAction()
            messageData.action = "new";
            messageData.data = message; 
            messageData.committee_id = CommitteeID;
            messageData.event_id = EventID 
            tcpRequest.messaging(messageData,message.id).then(JSONdata => {
                EventListener.sendRequest(JSONdata,id).then((response) => {
                    resolve(response)
                })
            })
        })
    }
}