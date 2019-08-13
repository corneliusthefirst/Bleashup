import {
    observable,
    action
} from 'mobx'
import storage from './Storage';
import {
    uniqBy,
    reject,
    find,
    sortBy,
    filter,
    findIndex
} from 'lodash'
import stores from '.';

export default class Invitations {
    @observable invitations = [];
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
    translateToinvitationData(invitation) {
        return new Promise((resolve, reject) => {
            stores.Events.loadCurrentEvent(invitation.event_id).then(event => {
                stores.Highlights.fetchHighlights(invitation.event_id).then((hightlights) => {
                    stores.LoginStore.getUser().then((user) => {
                        stores.Contacts.getContact(invitation.inviter).then(contact => {
                            resolve({
                                "key": invitation.invitation_id,
                                "sender_Image": contact.profile,
                                "sender_name": contact.nickname,
                                "sender_status": contact.status,
                                "receiver_Image": user.profile,
                                "received_date": invitation.period.date.year + "/" +
                                    invitation.period.date.month + "/" +
                                    invitation.period.date.day + " on " + invitation.period.time.hour + ": " + invitation.period.time.mins + ": " + invitation.period.time.secs,
                                "created_date": event.created_at,
                                "event_organiser_name": contact.nickname,
                                "event_description": event.about.description,
                                "event_Image": event.background,
                                "event_time": event.period.date.year + "/" +
                                    event.period.date.month + "/" +
                                    event.period.date.day + " on " + event.period.time.hour + ": " + event.period.time.mins + ": " + event.period.time.secs,
                                "event_title": event.about.title,
                                "location": event.location.string,
                                "invitation_status": invitation.status,
                                "highlight": hightlights,
                                "accept": invitation.accept,
                                "deny": invitation.deny,
                                "sent": invitation.sent,
                                "recevied": invitation.received,
                                "seen": invitation.seen
                            })
                        })
                    })
                })
            })
        })
    }
    initStoreForInitationDisplay() {
        return new Promise((resolve, reject) => {
            let result = [];
            let i = 0;
            if (this.invitations.length !== 0) {
                this.invitations.forEach((invitation) => {
                    this.translateToinvitationData(invitation).then(data => {
                        result.push(data)
                        if (i === this.invitations.length - 1) {
                            resolve(result)
                        }
                        i++
                    })
                })
            }
        })
    }
    addInvitations(Invitation) {
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
    removeInvitation(InvitationID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Invitations => {
                Invitations = reject(Invitations, ["invitation_id", InvitationID])
                this.saveKey.data = Invitations
                storage.save(this.saveKey).then(() => {
                    this.setProperties(this.saveKey.data, false)
                    resolve()
                })
            })
        })
    }
    markAsSentStatus(InvitationID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Invitations => {
                let index = findIndex(Invitations, {
                    invitation_id: InvitationID
                })
                Invitation.sent = true
                this.saveKey.data = Invitations
                storage.save(this.saveKey).then(() => {
                    this.setProperties(this.setProperties(this.saveKey, true))
                    resolve()
                })
            })
        })
    }
    markAsReceived(InvitationID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Invitations => {
                let index = findIndex(Invitations, {
                    invitation_id: InvitationID
                })
                Invitations[index].received = true
                this.saveKey.data = Invitations
                storage.save(this.saveKey).then(() => {
                    this.setProperties(this.setProperties(this.saveKey, true))
                    resolve()
                })
            })
        })
    }
    markAsSeen(InvitationID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Invitations => {
                let index = findIndex(Invitations, {
                    invitation_id: InvitationID
                })
                Invitations[index].seen = true
                this.saveKey.data = Invitations
                storage.save(this.saveKey).then(() => {
                    this.setProperties(this.setProperties(this.saveKey, true))
                    resolve()
                })
            })
        })
    }
    acceptInvitation(InvitationID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Invitations => {
                let index = findIndex(Invitations, {
                    invitation_id: InvitationID
                })
                Invitations[index].accept = true
                this.saveKey.data = Invitations
                storage.save(this.saveKey).then(() => {
                    this.setProperties(this.saveKey.data, true)
                    resolve()
                })
            })
        })
    }
    getInvitation(InvitationID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Invitations => {
                resolve(find(Invitations, {
                    invitation_id: InvitationID
                }))
            })
        })
    }
    denieInvitation(InvitationID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Invitations => {
                let index = findIndex(Invitations, {
                    invitation_id: InvitationID
                })
                Invitations[index].deny = true
                this.saveKey.data = Invitations
                storage.save(this.saveKey).then(() => {
                    this.setProperties(this.saveKey.data, true)
                    resolve()
                })
            })
        })
    }
    changeNewInvitationStatus(InvitationID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Invitations => {
                let index = findIndex(Invitations, {
                    invitation_id: InvitationID
                })
                Invitations[index].new = false
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
    @action setProperties(Events, inform) {
        if (inform) Events = sortBy(Events, ["update_date"]);
        this.SendInvitations = filter(Events, {
            type: "sent"
        });
        this.ReceivedInvitations = filter(Events, {
            type: "received"
        });
        this.invitations = Events
    }
}
