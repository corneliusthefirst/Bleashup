import tcpRequest from "../../../services/tcpRequestData";
import requestObject from "../../../services/requestObjects"
import stores from "../../../stores";
import serverEventListener from '../../../services/severEventListener'
class Requester {
    seen(invitation) {
        return new Promise((resolve, reject) => {
            let invite = requestObject.Invite()
            invite.invitation = invitation
            invite.invitee = stores.Session.SessionStore.phone
            invite.host = stores.Session.SessionStore.host
            tcpRequest.seen_invitation(invite).then(JSONData => {
                serverEventListener.sendRequest(JSONData, invitation.invitation_id).then(response => {
                    stores.Invitations.markAsSeen(invitation.invitation_id).then(() => {
                        resolve("ok");
                    })
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
            tcpRequest.received_invitation(invite).then(JSONData => {
                serverEventListener.sendRequest(JSONData, invitation.invitation_id).then(response => {
                    stores.Invitations.markAsReceived(invitation.invitation_id).then(() => {
                        resolve("ok");
                    })
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
            tcpRequest.acceptInvtation(invite).then(JSONData => {
                serverEventListener.sendRequest(JSONData, invitation.invitation_id).then((response) => {
                    stores.Invitations.acceptInvitation(invitation.invitation_id).then(() => {
                        resolve('ok')
                    })
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
            tcpRequest.denieInvitation(invite).then(JSONData => {
                serverEventListener.sendRequest(JSONData, invitation.invitation_id).then(response => {
                    stores.Invitations.denieInvitation(invitation.invitation_id).then(() => {
                        resolve("ok");
                    })
                })
            })
        })
    }
}

const Req = new Requester()
export default Req