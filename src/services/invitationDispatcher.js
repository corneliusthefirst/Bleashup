import stores from "../stores";
import GState from "../stores/globalState";
import {
    forEach
} from "lodash"
class InvitationDispatcher {
    dispatcheUpdates(Invitations, action) {
        forEach(Invitations, (Invitation) => {
            this.dispatcher(Invitation, action).then(() => {

            })
        })
    }
    dispatchInvitationsUpdates(Updates) {
        forEach(Updates, update => {
            this.dispatcher(update.body, update.response).then(() => {

            })
        })
    }
    dispatcher(invitation, action) {
        return this.InvitationPossibilities[action];
    }
    InvitationPossibilities = {
        accepted_invitation: (Invitation) => {
            return new Promise((resolve, reject) => {
                stores.Invitations.acceptInvitation(Invitation.invitation_id).then(() => {
                    GState.invitationUpdated = true
                })
            })
        },
        deneid_invitation: (Invitation) => {
            return new Promise((resolve, reject) => {
                stores.Invitations.denieInvitation(Invitation.invitation_id).then(() => {
                    GState.invitationUpdated = true;
                    resolve()
                })
            })
        },
        sent_invitation: (Invitation) => {
            return new Promise((resolve, reject) => {
                stores.Invitations.markAsSentStatus(Invitation.invitation_id).then(() => {
                    resolve()
                })
            })
        },
        received_invitation: (Invitation) => {
            return new PRomise((resolve, reject) => {
                stores.Invitations.markAsReceived(Invitation.invitation_id).then(() => {
                    resolve()
                })
            })
        },
        invitation: (Invitation) => {
            return new Promise((resolve, reject) => {
                stores.Invitations.addInvitations(Invitation).then(() => {
                    GState.invitationUpdated = true
                })
            })
        }

    }
}

const InvitationDispatch = new InvitationDispatcher()
export default InvitationDispatch
