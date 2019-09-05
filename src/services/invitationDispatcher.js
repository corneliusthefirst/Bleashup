import stores from "../stores";
import GState from "../stores/globalState";
import requestObject from "../services/requestObjects"
import requestData from "../services/tcpRequestData"
import ServerEventListener from "./severEventListener"
import {
    forEach
} from "lodash"
import Getter from "./Getter";
import moment from "moment"
class InvitationDispatcher {
    dispatchUpdates(Invitations, action) {
        return new Promise((resolve, reject) => {
            forEach(Invitations, (Invitation) => {
                let i = 0
                this.dispatcher(Invitation, action).then(() => {
                    i++;
                })
                if (i == Invitations.length - 1) resolve()
            })
        })
    }
    dispatchInvitationsUpdates(Updates) {
        return new Promise((resolve, reject) => {
            let i = 0;
            forEach(Updates, update => {
                this.dispatcher(update.body, update.response).then(() => {
                    i++
                })
            })
            if (i == Updates.length - 1) resolve()
        })
    }
    dispatcher(invitation, action) {
        return new Promise((resolve, reject) => {
            this.InvitationPossibilities[action](invitation).then(() => {
                resolve()
            })
        })

    }
    InvitationPossibilities = {
        accepted_invitation(Invitation) {
            return new Promise((resolve, reject) => {
                stores.Invitations.acceptInvitation(Invitation.invitation_id,true).then(() => {
                    GState.invitationUpdated = true
                    resolve()
                })
            })
        },
        denied_invitation(Invitation) {
            return new Promise((resolve, reject) => {
                stores.Invitations.denieInvitation(Invitation.invitation_id,true).then(() => {
                    GState.invitationUpdated = true;
                    resolve()
                })
            })
        },
        seen_invitation(Invitation) {
            return new Promise((resolve, reject) => {
                stores.Invitations.markAsSeen(Invitation.invitation_id).then(() => {
                    resolve()
                })
            })
        },
        received_invitation(Invitation) {
            return new Promise((resolve, reject) => {
                stores.Invitations.markAsReceived(Invitation.invitation_id).then(() => {
                    resolve()
                })
            })
        },
        invitation(Invitation) {
            return new Promise((resolve, reject) => {
                let invite = requestObject.Invite();
                invite.invitation = Invitation;
                invite.host = stores.Session.SessionStore.host;
                invite.invitee = stores.Session.SessionStore.phone;
                requestData.received_invitation(invite,Invitation.invitation_id).then(JSONData => {
                    ServerEventListener.sendRequest(JSONData,Invitation.invitation_id).then((response) => {
                        console.warn(response)
                        Invitation.type = "received"
                        Invitation.arrival_date = moment().format("YYYY-MM-DD HH:mm")
                        stores.Invitations.addInvitations(Invitation).then(() => {
                            ServerEventListener.GetData(Invitation.event_id).then(Event => {
                                stores.Events.addEvent(Event).then(() => {
                                    GState.invitationUpdated = true
                                    resolve()
                                })
                            })
                        })
                    })
                })
            })
        }

    }
}

const InvitationDispatch = new InvitationDispatcher()
export default InvitationDispatch
