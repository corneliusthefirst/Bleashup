import stores from "../stores";
import GState from "../stores/globalState";
import {
    forEach
} from "lodash"
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
            console.warn(this.InvitationPossibilities[action])
            this.InvitationPossibilities[action](invitation).then(() => {
                resolve()
            })
        })

    }
    InvitationPossibilities = {
        accepted_invitation(Invitation) {
            return new Promise((resolve, reject) => {
                stores.Invitations.acceptInvitation(Invitation.invitation_id).then(() => {
                    GState.invitationUpdated = true
                    resolve()
                })
            })
        },
        deneid_invitation(Invitation) {
            return new Promise((resolve, reject) => {
                stores.Invitations.denieInvitation(Invitation.invitation_id).then(() => {
                    GState.invitationUpdated = true;
                    resolve()
                })
            })
        },
        sent_invitation(Invitation) {
            return new Promise((resolve, reject) => {
                stores.Invitations.markAsSentStatus(Invitation.invitation_id).then(() => {
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
                console.warn("called")
                stores.Invitations.addInvitations(Invitation)
                GState.invitationUpdated = true
                resolve()
            })
        }

    }
}

const InvitationDispatch = new InvitationDispatcher()
export default InvitationDispatch