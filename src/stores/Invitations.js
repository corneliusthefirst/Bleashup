import {
    observable,
    action
} from 'mobx'
import storage from './Storage';
import {
    uniqBy,
    reject,
    find,
    orderBy,
    forEach,
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
        /*   storage.remove({
               key: 'Invitations'
           });*/
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
                    stores.LoginStore.getUser().then((Thisuser) => {
                        stores.TemporalUsersStore.getUser(invitation.inviter).then(user => {
                            resolve({
                                "key": invitation.invitation_id,
                                "sender_Image": user.profile,
                                "event_id": event.id,
                                "sender_name": user.nickname,
                                "sender_status": user.status,
                                "receiver_Image": user.profile,
                                "received_date": invitation.period.date.year + "/" +
                                    invitation.period.date.month + "/" +
                                    invitation.period.date.day + " at " + invitation.period.time.hour + ": " + invitation.period.time.mins + ": " + invitation.period.time.secs,
                                "created_date": event.created_at,
                                "event_organiser_name": user.nickname,
                                "event_description": event.about.description,
                                "event_Image": event.background,
                                "event_time": event.period.date.year + "/" +
                                    event.period.date.month + "/" +
                                    event.period.date.day + " at " + event.period.time.hour + ": " + event.period.time.mins + ": " + event.period.time.secs,
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
                forEach(this.invitations,(invitation) => {
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
                if (Invitations.length !== 0){
                    Invitations[Invitations.length] = Invitation
                    Invitations = uniqBy(Invitations, "invitation_id")
                }
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
                Invitations[index].sent = true
                this.saveKey.data = Invitations
                storage.save(this.saveKey).then(() => {
                    this.setProperties(this.saveKey.data, true)
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
                    this.setProperties(this.saveKey.data, true)
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
                    this.setProperties(this.saveKey.data, true)
                    resolve()
                })
            })
        })
    }
    acceptInvitation(InvitationID,inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Invitations => {
                let index = findIndex(Invitations, {
                    invitation_id: InvitationID
                })
                Invitations[index].accept = true
                this.saveKey.data = Invitations
                storage.save(this.saveKey).then(() => {
                    if(inform)this.setProperties(this.saveKey.data, true)
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
    denieInvitation(InvitationID,inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Invitations => {
                let index = findIndex(Invitations, {
                    invitation_id: InvitationID
                })
                Invitations[index].deny = true
                this.saveKey.data = Invitations
                storage.save(this.saveKey).then(() => {
                   if(inform) this.setProperties(this.saveKey.data, true)
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
        if (inform) Events = orderBy(Events, ["arrival_date"], ["desc"]);
        this.SendInvitations = filter(Events, {
            type: "sent"
        });
        this.ReceivedInvitations = filter(Events, {
            type: "received"
        });
        this.invitations = Events
    }
}
