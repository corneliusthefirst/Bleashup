import tcpRequest from "../../../services/tcpRequestData";
import requestObject from "../../../services/requestObjects"
import stores from "../../../stores";
import serverEventListener from '../../../services/severEventListener'
import { AddParticipant } from '../../../services/cloud_services';
import uuid from 'react-native-uuid';
import firebase from 'react-native-firebase';
import { uniqBy } from 'lodash';
class Requester {
    seen(invitation) {
        return new Promise((resolve, reject) => {
            let invite = requestObject.Invite()
            invite.invitation = invitation
            invite.invitee = stores.Session.SessionStore.phone
            invite.host = stores.Session.SessionStore.host
            tcpRequest.seen_invitation(invite, invitation.invitation_id + "seen").then(JSONData => {
                serverEventListener.sendRequest(JSONData, invitation.invitation_id + "seen").then(response => {
                    stores.Invitations.markAsSeen(invitation.invitation_id).then(() => {
                        resolve("ok");
                    })
                }).catch(error => {
                    serverEventListener.socket.write = undefined
                    reject(error)
                })
            })
        })
    }
    received(invitation) {
        return new Promise((resolve, reject) => {
            let invite = requestObject.Invite()
            invite.invitation = invitation
            invite.invitee = stores.Session.SessionStore.phone
            invite.host = stores.Session.SessionStore.host
            tcpRequest.received_invitation(invite, invitation.invitation_id + "received").then(JSONData => {
                serverEventListener.sendRequest(JSONData, invitation.invitation_id + "received").then(response => {
                    stores.Invitations.markAsReceived(invitation.invitation_id).then(() => {
                        resolve("ok");
                    })
                }).catch(error => {
                    serverEventListener.socket.write = undefined
                    reject(error)
                })
            })
        })
    }
    accept(invitation) {
        return new Promise((resolve, reject) => {
            let invite = requestObject.Invite()
            invite.invitation = invitation
            invite.invitee = stores.Session.SessionStore.phone
            invite.host = stores.Session.SessionStore.host
            tcpRequest.acceptInvtation(invite, invitation.invitation_id + "accept").then(JSONData => {
                serverEventListener.sendRequest(JSONData, invitation.invitation_id + "accept").then((response) => {
                    stores.Invitations.acceptInvitation(invitation.invitation_id).then(() => {
                        let Participant = requestObject.Participant();
                        Participant.phone = stores.Session.SessionStore.phone;
                        Participant.status = "invited";
                        Participant.master = invitation.status;
                        Participant.host = stores.Session.SessionStore.host
                        AddParticipant(invitation.event_id, [Participant]).then((res) => { })
                        console.warn(res)
                        stores.Events.addParticipant(invitation.event_id, Participant, true).then(() => {
                            let Change = {
                                id: uuid.v1(),
                                title: `First Update`,
                                updated: "new_event",
                                event_id: invitation.event_id,
                                updater: invitation.inviter,
                                changed: `Invited You To Ths Activity`,
                                new_value: { data: null, new_value: [Participant] },
                                date: event.created_at,
                                time: null
                            }
                            stores.ChangeLogs.addChanges(Change).then(res => {
                            })
                            resolve()
                        })
                    })
                }).catch(error => {
                    serverEventListener.socket.write = undefined
                    reject(error)
                })
            })
        })
    }
    denie(invitation) {
        return new Promise((resolve, reject) => {
            let invite = requestObject.Invite()
            invite.invitation = invitation
            invite.invitee = stores.Session.SessionStore.phone
            invite.host = stores.Session.SessionStore.host
            tcpRequest.denieInvitation(invite, invitation.invitation_id + "denie").then(JSONData => {
                serverEventListener.sendRequest(JSONData, invitation.invitation_id + "denie").then(response => {
                    stores.Invitations.denieInvitation(invitation.invitation_id).then(() => {
                        resolve("ok");
                    })
                }).catch(error => {
                    serverEventListener.socket.write = undefined
                    reject(error)
                })
            })
        })
    }
}

const Req = new Requester()
export default Req