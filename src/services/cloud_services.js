

const CloudURL = "https://us-central1-bleashup-1562173529011.cloudfunctions.net";

export function SendNotifications(senderName,newKey,newMessageType,text,fireRoom,senderPhone,activityName,activityID,roomName,room_type){
    return fetch(`${CloudURL}/informOthers?sender_name=${senderName}&message_key=${newKey}&message_type=${newMessageType}&message=${text}&room_key=${fireRoom}&sender_phone=${senderPhone}&activity_name=${activityName}&activity_id=${activityID}&room_name=${roomName}&room_type=${room_type}`)
        
}

export function AddParticipant(activityID,Members){
    return fetch(`${CloudURL}/addParticipant?event_id=${activityID}&members=${JSON.stringify(Members)}`)
}

export function RemoveParticipant(activityID,members){
    return fetch(`${CloudURL}/removeParticipant?event_id=${activityID}&members=${JSON.stringify(members)}`)
}