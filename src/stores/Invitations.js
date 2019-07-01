import {
    observable,
    action
} from 'mobx'
import storage from './Storage';
import {
    uniqBy,
    dropWhile,
    find,
    sortBy,
    filter,
    findIndex
} from 'lodash'

export default class Invitations {
    @observable SendInvitations = [];
    @observable ReceivedInvitations = [];
    saveKey = {
        key: "Invitations",
        data: [{}]
    }
    constructor() {
        this.readFromStore().then(Invitations => {
            if (Invitations) {
                this.setProperties(Invitations, true)
            }
        })
    }
    @action addInvitations(Invitation) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Invitations => {
                if (Invitations)
                    Invitations = uniqBy(Invitations, "invitation_id").concat([Invitation])
                else Invitations = [Invitation]
                this.saveKey.data = Invitations
                storage.save(this.saveKey).then(() => {
                    this.setProperties(this.saveKey.data, true)
                    resolve()
                })
            })
        })
    }
    @action removeInvitation(InvitationID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Invitations => {
                Invitations = dropWhile(Invitations, ["invitation_id", InvitationID])
                this.saveKey.data = Invitations
                storage.save(this.saveKey).then(() => {
                    this.setProperties(this.saveKey.data, false)
                    resolve()
                })
            })
        })
    }
    @action markAsSentStatus(InvitationID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Invitations => {
                let Invitation = find(Invitations, {
                    invitation_id: InvitationID
                })
                let index = findIndex(Invitations, {
                    invitation_id: InvitationID
                })
                Invitation.sent = true
                Invitations.splice(index, 1, Invitation)
                this.saveKey.data = Invitations
                storage.save(this.saveKey).then(() => {
                    this.setProperties(this.setProperties(this.saveKey, true))
                    resolve()
                })
            })
        })
    }
    @action markAsReceived(InvitationID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Invitations => {
                let Invitation = find(Invitations, {
                    invitation_id: InvitationID
                })
                let index = findIndex(Invitations, {
                    invitation_id: InvitationID
                })
                Invitation.received = true
                Invitations.splice(index, 1, Invitation)
                this.saveKey.data = Invitations
                storage.save(this.saveKey).then(() => {
                    this.setProperties(this.setProperties(this.saveKey, true))
                    resolve()
                })
            })
        })
    }
    @action acceptInvitation(InvitationID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Invitations => {
                let Invitation = find(Invitations, {
                    invitation_id: InvitationID
                })
                let index = findIndex(Invitations, {
                    invitation_id: InvitationID
                })
                Invitation.status = "accepted"
                Invitations.splice(index, 1, Invitation)
                this.saveKey.data = Invitations
                storage.save(this.saveKey).then(() => {
                    this.setProperties(this.saveKey.data, true)
                    resolve()
                })
            })
        })
    }
    @action getInvitation(InvitationID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Invitations => {
                resolve(find(Invitations, {
                    invitation_id: InvitationID
                }))
            })
        })
    }
    @action denieInvitation(InvitationID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Invitations => {
                let Invitation = find(Invitations, {
                    invitation_id: InvitationID
                })
                let index = findIndex(Invitations, {
                    invitation_id: InvitationID
                })
                Invitation.status = "denied"
                Invitations.splice(index, 1, Invitation)
                this.saveKey.data = Invitations
                storage.save(this.saveKey).then(() => {
                    this.setProperties(this.saveKey.data, true)
                    resolve()
                })
            })
        })
    }
    @action changeNewInvitationStatus(InvitationID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Invitations => {
                let Invitation = find(Invitations, {
                    invitation_id: InvitationID
                })
                let index = findIndex(Invitations, {
                    invitation_id: InvitationID
                })
                Invitation.new = false
                Invitations.splice(index, 1, Invitation)
                this.saveKey.data = Invitations
                storage.save(this.saveKey).then(() => {
                    this.setProperties(this.saveKey.data, true)
                    resolve()
                })
            })
        })
    }
    readFromStore() {
        return new Promise((resolve, reject) => {
            storage.load({
                key: "Invitations",
                autoSync: true
            }).then((invitations) => {
                resolve(invitations)
            }).catch(error => {
                resolve([])
            })
        })
    }
    setProperties(Events, inform) {
        if (inform) Events = sortBy(Events, ["update_date"]);
        this.SendInvitations = filter(Events, {
            type: "sent"
        });
        this.ReceivedInvitations = filter(Events, {
            type: "received"
        });
    }
}
