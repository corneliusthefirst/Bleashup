import tcpRequest from '../../../services/tcpRequestData';
import serverEventListener from '../../../services/severEventListener'
import stores from '../../../stores';
import request from '../../../services/requestObjects';
import { Toast } from 'native-base';

class Request {
    constructor() {

    }

    addCommitee(commitee) {
        return new Promise((resolve, reject) => {
            let Commitee = request.createCommitee()
            Commitee.event_id = commitee.event_id,
                Commitee.commitee = commitee
            tcpRequest.addcommitee(Commitee, commitee.id).then(JSONData => {
                serverEventListener.sendRequest(JSONData, commitee.id).then(response => {
                    stores.CommiteeStore.addCommitee(commitee).then(() => {
                        stores.Events.addEventCommitee(commitee.event_id, commitee.id).then(() => {
                            Toast.show({ text: "commitee successfully added !", type: "success" })
                            resolve()
                        })
                    })
                }).catch(error => {
                    console.warn(error)
                    Toast.show({ text: "Unable to perform the creation action" })
                    reject(error)
                })
            })
        })
    }
    editCommiteeName(newName, ID, eventID) {
        return new Promise((resolve, reject) => {
            let updateName = request.UpdateCommiteeName()
            updateName.commitee_id = ID;
            updateName.event_id = eventID
            updateName.name = newName
            tcpRequest.update_commitee_name(updateName, ID + "_name").then(JSONData => {
                serverEventListener.sendRequest(JSONData, ID + "_name").then(response => {
                    stores.CommiteeStore.updateCommiteeName(ID, newName).then((response) => {
                        Toast.show({ text: "update went successfully !", type: "success" })
                        resolve()
                    })
                }).catch(error => {
                    Toast.show({ text: "Unable to perform the name editing action" })
                    reject(error)
                })
            })
        })
    }
    publishCommitee(id, event_id, state) {
        return new Promise((resolve, reject) => {
            let publish = request.updateCommiteeState()
            publish.commitee_id = id;
            publish.event_id = event_id;
            publish.state = state;
            tcpRequest.update_commitee_public_state(publish, id + "_publish").then(JSONData => {
                serverEventListener.sendRequest(JSONData, id + "_publish").then(response => {
                    stores.CommiteeStore.updateCommiteeState(id, state).then(() => {
                        Toast.show({ text: "Commitee accessibility was successfully !", type: "success" })
                        resolve()
                    })
                }).catch((error) => {
                    Toast.show({ text: "Unable to perform the publish action" })
                    reject(error)
                })
            })
        })
    }
    addMembers(id, members, event_id) {
        return new Promise((resolve, reject) => {
            let addMembers = request.addCommiteeMember()
            addMembers.commitee_id = id;
            addMembers.member = members;
            addMembers.event_id = event_id
            tcpRequest.add_member_to_commitee(addMembers, id + "_members").then(JSONData => {
                serverEventListener.sendRequest(JSONData, id + "_members").then(response => {
                    stores.CommiteeStore.addMembers(id, members).then(() => {
                        Toast.show({ text: "members where successfully added !", type: "success" })
                        resolve(members)
                    })
                }).catch((error) => {
                    Toast.show({ text: "Unable to perform the add action" })
                    reject(error)
                })
            })
        })
    }
    openCommitee(id,event_id){
        return new Promise((resolve,reject) =>{
            let CEID = request.COEID()
            CEID.commitee_id = id
            CEID.event_id = event_id;
            tcpRequest.open_commitee(CEID,id+"_open").then((JSONData)=>{
                serverEventListener.sendRequest(JSONData,id+"_open").then((reponse) => {
                    stores.CommiteeStore.changeCommiteeOpenedState(id,true).then(()=>{
                        Toast.show({ text: "The commitee was successfully opened !", type: "success" })
                        resolve()
                    })
                }).catch((error) => {
                    Toast.show({ text: "Unable to perform the open action" })
                    reject(error)
                })
            })
        })
    }
    closeCommitee(id, event_id) {
        return new Promise((resolve, reject) => {
            let CEID = request.COEID()
            CEID.commitee_id = id
            CEID.event_id = event_id;
            tcpRequest.close_commitee(CEID, id + "_close").then((JSONData) => {
                serverEventListener.sendRequest(JSONData, id + "_close").then((reponse) => {
                    stores.CommiteeStore.changeCommiteeOpenedState(id, false).then(() => {
                        Toast.show({ text: "The commitee was successfully opened !", type: "success" })
                        resolve()
                    })
                }).catch((error) => {
                    Toast.show({ text: "Unable to perform the close action" })
                    reject(error)
                })
            })
        })
    }
    removeMembers(id, members, event_id) {
        return new Promise((resolve, reject) => {
            memberPhone = members.map(ele => ele.phone)
            let removeMember = request.removeCommiteeMember()
            removeMember.commitee_id = id;
            removeMember.event_id = event_id;
            removeMember.member_phone = memberPhone;
            tcpRequest.remove_member_from_commitee(removeMember, id + "_members").then(JSON => {
                serverEventListener.sendRequest(JSON, id + "_members").then(response => {
                    stores.CommiteeStore.removeMember(id, memberPhone).then(() => {
                        Toast.show({ text: "members where successfully removed !", type: "success" })
                        resolve()
                    })
                }).catch((error) => {
                    Toast.show({ text: "Unable to perform the remove action" })
                    reject(error)
                })
            })
        })
    }
    joinCommitee(id, event_id,memberItem) {
        return new Promise((resolve, reject) => {
            let member = request.addCommiteeMember()
            member.commitee_id = id;
            member.event_id = event_id;
            member.member_phone = [memberItem]
            tcpRequest.join_commitee(member, id + "_join").then(JSONData => {
                serverEventListener.sendRequest(JSONData, id + "_join").then((response) => {
                    stores.CommiteeStore.addMembers(id, member.member_phone).then(() => {
                        Toast.show({ text: "commitee successfully joint !", type: "success" })
                        resolve()
                    })
                }).catch((error) => {
                    Toast.show({ text: "Unable to perform the join action" })
                    reject(error)
                })
            })
        })
    }

    leaveCommitee(id, event_id) {
        return new Promise((resolve, reject) => {
            let member = request.removeCommiteeMember()
            member.commitee_id = id;
            member.event_id = event_id;
            member.member_phone = [stores.LoginStore.user.phone]
            tcpRequest.leave_commitee(member, id + "_leave").then(JSONData => {
                serverEventListener.sendRequest(JSONData, id + "_leave").then(response => {
                    stores.CommiteeStore.removeMember(id, member.member_phone).then(() => {
                        Toast.show({ text: "commitee successfully left !!", type: "success" })
                        resolve()
                    })
                }).catch((error) => {
                    Toast.show({ text: "Unable to perform the leave action" })
                    reject(error)
                })
            })
        })
    }
    getCommitee(id) {

    }
}

const Requester = new Request()
export default Requester