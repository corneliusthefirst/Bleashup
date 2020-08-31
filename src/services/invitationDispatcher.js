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
    dispatchUpdates(Invitations, action, callback) {
        if (Invitations.length <= 0) {
            callback("done!")
        } else {
            let Invitation = Invitations.pop()
            this.dispatcher(Invitation, action).then(() => {
                this.dispatchUpdates(Invitations, action)
            })
        }
    }
    dispatchInvitationsUpdates(Updates, callback) {
        if (Updates.length == 0) {
            callback("done")
        } else {
            let update = Updates.pop()
            this.dispatcher(update.body, update.response).then(() => {
                this.dispatchInvitationsUpdates(Updates, i + 1, callback)
            })
        }
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
                stores.Invitations.acceptInvitation(Invitation.invitation_id, true).then(() => {
                    GState.invitationUpdated = true
                    resolve()
                })
            })
        },
        denied_invitation(Invitation) {
            return new Promise((resolve, reject) => {
                stores.Invitations.denieInvitation(Invitation.invitation_id, true).then(() => {
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
                requestData.received_invitation(invite, Invitation.invitation_id).then(JSONData => {
                    ServerEventListener.sendRequest(JSONData, Invitation.invitation_id).then((response) => {
                        Invitation.type = "received"
                        Invitation.arrival_date = moment().format()
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
