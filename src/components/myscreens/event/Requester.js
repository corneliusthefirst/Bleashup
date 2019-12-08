import tcpRequest from '../../../services/tcpRequestData';
import serverEventListener from '../../../services/severEventListener'
import stores from '../../../stores';
import request from '../../../services/requestObjects';
import { Toast } from 'native-base';
import uuid from 'react-native-uuid';
import moment from 'moment';
import { isEqual } from "lodash"
import Requesterer from '../currentevents/Requester';
import { RemoveParticipant } from '../../../services/cloud_services';

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
                            let Change = {
                                id: uuid.v1(),
                                title: "Update On Commitees",
                                updated: 'new_commitee',
                                event_id: event_id,
                                changed: `Create ${commitee.name} Commitee  `,
                                updater: stores.LoginStore.user,
                                new_value: { data: commitee.id, new_value: commitee.name },
                                date: moment().format(),
                                time: null
                            }
                            stores.ChangeLogs.addChanges(Change).then(() => {
                                Toast.show({ text: "commitee successfully added !", type: "success" })
                                resolve()
                            })
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
                    stores.CommiteeStore.updateCommiteeName(ID, newName).then((commitee) => {
                        let Change = {
                            id: uuid.v1(),
                            title: "Update On Commitees",
                            updated: 'commitee_name_updated',
                            event_id: eventID,
                            changed: `Changed ${commitee.name} Commitee Name To: `,
                            updater: stores.LoginStore.user,
                            new_value: { data: commitee.id, new_value: newName },
                            date: moment().format(),
                            time: null
                        }
                        stores.ChangeLogs.addChanges(Change).then(() => {
                            Toast.show({ text: "update went successfully !", type: "success" })
                            resolve()
                        })
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
                    stores.CommiteeStore.updateCommiteeState(id, state).then((commitee) => {
                        let Change = {
                            id: uuid.v1(),
                            title: "Update On Commitees",
                            updated: 'published_commitee',
                            event_id: event_id,
                            changed: `Published ${commitee.name} Commitee`,
                            updater: stores.LoginStore.user,
                            new_value: { data: commitee.id, new_value: "published" },
                            date: moment().format(),
                            time: null
                        }
                        stores.ChangeLogs.addChanges(Change).then(() => {
                            Toast.show({ text: "Commitee accessibility was successfully !", type: "success" })
                            resolve()
                        })
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
                    stores.CommiteeStore.addMembers(id, members).then((commitee) => {
                        let Change = {
                            id: uuid.v1(),
                            title: "Update On Commitees",
                            updated: 'added_commitee_member',
                            event_id: event_id,
                            changed: `Added Members To ${commitee.name} Commitee`,
                            updater: stores.LoginStore.user,
                            new_value: { data: commitee.id, new_value: members },
                            date: moment().format(),
                            time: null
                        }
                        stores.ChangeLogs.addChanges(Change).then(() => {
                            Toast.show({ text: "members where successfully added !", type: "success" })
                            resolve(members)
                        })
                    })
                }).catch((error) => {
                    Toast.show({ text: "Unable to perform the add action" })
                    reject(error)
                })
            })
        })
    }
    openCommitee(id, event_id) {
        return new Promise((resolve, reject) => {
            let CEID = request.COEID()
            CEID.commitee_id = id
            CEID.event_id = event_id;
            tcpRequest.open_commitee(CEID, id + "_open").then((JSONData) => {
                serverEventListener.sendRequest(JSONData, id + "_open").then((reponse) => {
                    stores.CommiteeStore.changeCommiteeOpenedState(id, true).then((commitee) => {
                        let Change = {
                            id: uuid.v1(),
                            title: "Update On Commitees",
                            updated: 'commitee_opened',
                            event_id: event_id,
                            changed: `Opened ${commitee.name} Commitee`,
                            updater: stores.LoginStore.user,
                            new_value: { data: null, new_value: "opened" },
                            date: moment().format(),
                            time: null
                        }
                        stores.ChangeLogs.addChanges(Change).then(() => {
                            Toast.show({ text: "The commitee was successfully opened !", type: "success" })
                            resolve()
                        })
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
                    stores.CommiteeStore.changeCommiteeOpenedState(id, false).then((commitee) => {
                        let Change = {
                            id: uuid.v1(),
                            title: "Update On Commitees",
                            updated: 'commitee_closed',
                            event_id: event_id,
                            changed: `Closed ${commitee.name} Commitee`,
                            updater: stores.LoginStore.user,
                            new_value: { data: null, new_value: "closed" },
                            date: moment().format(),
                            time: null
                        }
                        stores.ChangeLogs.addChanges(Change).then(() => {
                            Toast.show({ text: "The commitee was successfully opened !", type: "success" })
                            resolve()
                        })
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
                    stores.CommiteeStore.removeMember(id, memberPhone).then((commitee) => {
                        let Change = {
                            id: uuid.v1(),
                            title: "Update On Commitees",
                            updated: 'removed_commitee_member',
                            event_id: event_id,
                            changed: `Removed Members From ${commitee.name} Commitee`,
                            updater: stores.LoginStore.user,
                            new_value: { data: null, new_value: members },
                            date: moment().format(),
                            time: null
                        }
                        stores.ChangeLogs.addChanges(Change).then(() => {
                            Toast.show({ text: "members where successfully removed !", type: "success" })
                            resolve()
                        })
                    })
                }).catch((error) => {
                    Toast.show({ text: "Unable to perform the remove action" })
                    reject(error)
                })
            })
        })
    }
    joinCommitee(id, event_id, memberItem) {
        return new Promise((resolve, reject) => {
            let member = request.addCommiteeMember()
            member.commitee_id = id;
            member.event_id = event_id;
            member.member_phone = [memberItem]
            tcpRequest.join_commitee(member, id + "_join").then(JSONData => {
                serverEventListener.sendRequest(JSONData, id + "_join").then((response) => {
                    stores.CommiteeStore.addMembers(id, member.member_phone).then((commitee) => {
                        let Change = {
                            id: uuid.v1(),
                            title: "Update On Commitees",
                            updated: 'added_commitee_member',
                            event_id: event_id,
                            changed: `Joint ${commitee.name} Commitee`,
                            updater: stores.LoginStore.user,
                            new_value: { data: null, new_value: [stores.LoginStore.user.phone] },
                            date: moment().format(),
                            time: null
                        }
                        stores.ChangeLogs.addChanges(Change).then(() => {
                            Toast.show({ text: "commitee successfully joint !", type: "success" })
                            resolve()
                        })
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
                    stores.CommiteeStore.removeMember(id, member.member_phone).then((commitee) => {
                        let Change = {
                            id: uuid.v1(),
                            title: "Update On Commitees",
                            updated: 'removed_commitee_member',
                            event_id: event_id,
                            changed: `Left ${commitee.name} Commitee`,
                            updater: stores.LoginStore.user,
                            new_value: { data: null, new_value: [stores.LoginStore.user.phone] },
                            date: moment().format(),
                            time: null
                        }
                        stores.ChangeLogs.addChanges(Change).then(() => {
                            Toast.show({ text: "commitee successfully left !!", type: "success" })
                            resolve()
                        })
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
    /*saveContacts(){
     let contacts =  request.many_contact()
        contacts = [{phone:"00237609894330",host:"192.168.43.32"},
            {phone:"00237609854563",host:"192.168.43.32"},
            {phone:"00237604385006",host:"192.168.43.32"},
            {phone:"002376043852206",host:"192.168.43.32"},
            {phone:"0023762338523306",host:"192.168.43.32"},
            {phone:"0023762338521235",host:"192.168.43.32"},
            {phone:"00237623398863306",host:"192.168.43.32"},
            {phone:"0023762239523306",host:"192.168.43.32"},
            {phone:"0023762338523309756",host:"192.168.43.32"},
            {phone:"002376233834566873306",host:"192.168.43.32"},
            {phone:"002376233852567798",host:"192.168.43.32"},
            {phone:"00237623312309723306",host:"192.168.43.32"},
            {phone:"00237623385233068765",host:"192.168.43.32"},
            {phone:"0023762338508764323306",host:"192.168.43.32"},
            {phone:"002376233852330698776",host:"192.168.43.32"},
            {phone:"002376233852330098765",host:"192.168.43.32"},
            {phone:"00237623385236478409706",host:"192.168.43.32"}]
    tcpRequest.add_many_contacts(contacts,"conatacter").then(JSONData =>{
        serverEventListener.sendRequest(JSONData).then((response) =>{
            console.warn(response)
        })
    })
    }*/
    invite(members, even_id) {
        return new Promise((resolve, reject) => {
            let invitees = members.map(ele => {
                return {
                    invitee: ele.phone,
                    host: ele.host,
                    invitation: {
                        inviter: stores.LoginStore.user.phone,
                        invitee: ele.phone,
                        invitation_id: uuid.v1(),
                        host: stores.Session.SessionStore.host,
                        period: moment().format(),
                        event_id: even_id,
                        status: ele.master
                    }
                }

            })
            tcpRequest.invite_many(invitees, even_id + "_invitees").then(JSONData => {
                serverEventListener.sendRequest(JSONData, even_id + "_invitees").then(SuccessMessage => {
                    this.storeInvitations(invitees).then((res) => {
                        console.warn(res)
                        //console.warn("invitations gone!!")
                        Toast.show({ text: "invitations was successfully sent !", type: "success" });
                        resolve("")
                    })
                }).catch(error => {
                    serverEventListener.socket.write = undefined
                    reject(error)
                })
            })
        })
    }

    storeInvitations(invitations) {
        return new Promise((resolve, reject) => {
            let func = (invitations) => {
                if (invitations.length <= 0) {
                    return true
                }
                else {
                    let element = invitations.pop()
                    element.invitation.type = 'sent';
                    element.invitation.sent = true;
                    element.invitation.arrival_date = moment().format("YYYY-MM-DD HH:mm")
                    stores.Invitations.addInvitations(element.invitation).then(mes => {
                        func(invitations)
                    })
                }
            }
            let rese = func(invitations)
            resolve(rese)
        })
    }
    bandMembers(members, event_id) {
        return new Promise((resolve, reject) => {
            let mem = members.map(ele => ele.phone)
            tcpRequest.UpdateCurrentEvent(stores.LoginStore.user.phone, event_id, "remove",
                { phone: mem }, event_id + "_update").then(JSONData => {
                    serverEventListener.sendRequest(JSONData, event_id + "_update").then((response) => {
                        stores.Events.removeParticipant(event_id, mem, true).then(() => {
                            let Change = {
                                id: uuid.v1(),
                                title: "Update On Main Activity",
                                updated: 'removed',
                                event_id: event_id,
                                changed: "Banned Member(s)",
                                updater: stores.LoginStore.user,
                                new_value: { data: null, new_value: members },
                                date: moment().format(),
                                time: null
                            }
                            stores.ChangeLogs.addChanges(Change).then(() => {
                                resolve(mem)
                            })
                        })
                    }).catch(e => {
                        console.warn(e)
                        reject(e)
                    })
                })

        })
    }
    leaveActivity(event_id, phone) {
        return new Promise((resolve, reject) => {
            let leave = request.Leave()
            leave.event_id = event_id
            leave.phone = [phone]
            tcpRequest.leaveEvent(leave, event_id + "_leave").then(JSONData => {
                serverEventListener.sendRequest(JSONData, event_id + "_leave").then(() => {
                    stores.Events.leaveEvent(event_id).then(() => {
                        stores.Events.removeParticipant(event_id, [phone]).then(() => {
                            RemoveParticipant(event_id, leave.phone).then(() => {
                                let Change = {
                                    id: uuid.v1(),
                                    title: "Update On Main Activity",
                                    updated: 'removed',
                                    event_id: event_id,
                                    changed: "Left The Activity",
                                    updater: stores.LoginStore.user,
                                    new_value: { data: null, new_value: [stores.LoginStore.user.phone] },
                                    date: moment().format(),
                                    time: null
                                }
                                stores.ChangeLogs.addChanges(Change).then(() => {
                                    resolve("done")
                                })
                            }).catch(e => {
                                reject(e)
                            })
                        })
                    }).catch((e) => {
                        console.warn(e)
                        reject(e)
                    })
                })
            })
        })
    }
    changeEventMasterState(newState, event_id) {
        return new Promise((resolve, reject) => {
            tcpRequest.UpdateCurrentEvent(stores.LoginStore.user.phone, event_id, 'master',
                newState, event_id + "_update_sate").then(JSONData => {
                    serverEventListener.sendRequest(JSONData, event_id + '_update_sate').then((response) => {
                        stores.Events.updateEventParticipant(event_id, newState, true).then(() => {
                            let Change = {
                                id: uuid.v1(),
                                title: "Update On Main Activity",
                                updated: 'master',
                                event_id: event_id,
                                changed: "Changed Member Master Status",
                                updater: stores.LoginStore.user,
                                new_value: { data: null, new_value: [newState] },
                                date: moment().format(),
                                time: null
                            }
                            stores.ChangeLogs.addChanges(Change).then(() => {
                                resolve("done")
                            })
                        })
                    }).catch((e) => {
                        console.warn(e)
                        reject(e)
                    })
                })
        })
    }
    publish(event_id) {
        return new Promise((resolve, reject) => {
            tcpRequest.publishEvent({ event_id: event_id }, event_id + "_publish").then(JSONData => {
                serverEventListener.sendRequest(JSONData, event_id + "_publish").then(() => {
                    stores.Events.publishEvent(event_id).then(() => {
                        stores.Publishers.addPublisher(event_id, {
                            phone: stores.LoginStore.user.phone,
                            period: moment().format()
                        }).then(() => {
                            let Change = {
                                id: uuid.v1(),
                                title: "Update On The Main Activity",
                                updated: 'publish',
                                event_id: event_id,
                                changed: "Published The Activity",
                                updater: stores.LoginStore.user,
                                new_value: { data: null, new_value: true },
                                date: moment().format(),
                                time: null
                            }
                            stores.ChangeLogs.addChanges(Change).then(() => {
                                resolve("done")
                            })
                        })
                    })
                }).catch((e) => {
                    console.warn(e)
                    reject(e)
                })
            })
        })
    }
    unpublish(event_id) {
        return new Promise((resolve, reject) => {
            tcpRequest.unpublishEvent({ event_id: event_id }, event_id + "_unpublish").then(JSONData => {
                serverEventListener.sendRequest(JSONData, event_id + "_unpublish").then(() => {
                    stores.Events.unpublishEvent(event_id).then(() => {
                            let Change = {
                                id: uuid.v1(),
                                title: "Update On The Main Activity",
                                updated: 'publish',
                                event_id: event_id,
                                changed: "UnPublished The Activity",
                                updater: stores.LoginStore.user,
                                new_value: { data: null, new_value: true },
                                date: moment().format(),
                                time: null
                            }
                            stores.ChangeLogs.addChanges(Change).then(() => {
                                resolve("done")
                            })
                        })
                    })
                }).catch((e) => {
                    console.warn(e)
                    reject(e)
                })
        })
    }
    update_notes(event, newNotes) {
        return new Promise((resolve, reject) => {
            let eqlty = isEqual(event.notes, newNotes)
            console.warn(eqlty, "pppp", event.notes, newNotes)
            if (eqlty === false) {
                tcpRequest.UpdateCurrentEvent(stores.LoginStore.user.phone, event.id, 'notes',
                    newNotes, event.id + "_notes").then((JSONData) => {
                        serverEventListener.sendRequest(JSONData, event.id + "_notes").then(response => {
                            stores.Events.updateNotes(event.id, newNotes).then((res) => {
                                let Change = {
                                    id: uuid.v1(),
                                    title: "Updates on Main Activity",
                                    updated: "notes",
                                    event_id: event.id,
                                    changed: "Changed The Notes of the Activity",
                                    updater: stores.LoginStore.user,
                                    new_value: { data: null, new_value: newNotes },
                                    date: moment().format(),
                                    time: null
                                }
                                stores.ChangeLogs.addChanges(Change).then(() => {
                                    resolve('ok')
                                })
                            })
                        }).catch((e) => {
                            reject(e)
                        })
                    })
            } else {
                resolve()
            }
        })
    }
    updatePeriod(event, newPeriod) {
        return new Promise((resolve, reject) => {
            if (event.period !== newPeriod) {
                tcpRequest.UpdateCurrentEvent(stores.LoginStore.user.phone, event.id,
                    "period", newPeriod, event.id + "_period").then(JSONData => {
                        serverEventListener.sendRequest(JSONData, event.id + "_period").then((response) => {
                            console.warn(response)
                            stores.Events.updatePeriod(event.id, newPeriod, false).then(() => {
                                let Change = {
                                    id: uuid.v1(),
                                    title: "Updates On Main Activity",
                                    updated: "period",
                                    updater: stores.LoginStore.user,
                                    event_id: event.id,
                                    changed: "Changed The Scheduled Time Of The Activity To: ",
                                    new_value: { data: null, new_value: moment(newPeriod).format("dddd, MMMM Do YYYY, h:mm:ss a") },
                                    date: moment().format(),
                                    time: null
                                }
                                stores.ChangeLogs.addChanges(Change).then(() => {
                                    resolve('ok')
                                })
                            })
                        }).catch((e) => {
                            reject(e)
                        })
                    })
            } else {
                resolve()
            }
        })
    }
    updateTitle(event, newTitle) {
        return new Promise((resolve, reject) => {
            console.warn(event.about.title !== newTitle, newTitle, event.about.title)
            if (event.about.title !== newTitle) {
                tcpRequest.UpdateCurrentEvent(stores.LoginStore.user.phone, event.id,
                    'title', newTitle, event.id + "_title").then(JSONData => {
                        serverEventListener.sendRequest(JSONData, event.id + "_title").then((response) => {
                            console.warn(response)
                            stores.Events.updateTitle(event.id, newTitle, false).then((res) => {
                                console.warn("title updated successfully ......")
                                let Change = {
                                    id: uuid.v1(),
                                    updated: "title",
                                    event_id: event.id,
                                    updater: stores.LoginStore.user,
                                    title: "Updates On Main Activity",
                                    changed: "Changed The Title Of The Activity to: ",
                                    new_value: { data: null, new_value: newTitle },
                                    date: moment().format(),
                                    time: null
                                }
                                stores.ChangeLogs.addChanges(Change).then(() => {
                                    resolve("ok")
                                })
                            })
                        }).catch((e) => {
                            reject(e)
                        })
                    })
            } else {
                resolve()
            }
        })
    }
    updateRecurrency(event, recurrentUpdate) {
        return new Promise((resolve, reject) => {
            if (event.recurrent !== recurrentUpdate.recurrent ||
                event.frequency !== recurrentUpdate.frequency ||
                event.interval !== recurrentUpdate.interval ||
                event.recurrence !== recurrentUpdate.recurrence) {
                tcpRequest.UpdateCurrentEvent(stores.LoginStore.user.phone, event.id, 'recurrency',
                    recurrentUpdate, event.id + "_recurrency").then(JSONData => {
                        serverEventListener.sendRequest(JSONData, event.id + "_recurrency").then(response => {
                            console.warn(response)
                            stores.Events.updateRecurrency(event.id, recurrentUpdate).then(() => {
                                let Change = {
                                    id: uuid.v1(),
                                    title: "Updates On Main Activity",
                                    updated: "recurrency",
                                    event_id:event.id,
                                    updater: stores.LoginStore.user,
                                    changed: "Changed The Recurrency Configuration of the Activity",
                                    new_value: { data: null, new_value: recurrentUpdate },
                                    date: moment().format(),
                                    time: null
                                }
                                stores.ChangeLogs.addChanges(Change).then(() => {
                                    resolve("ok")
                                })
                            })
                        }).catch((e) => {
                            reject(e)
                        })
                    })
            } else {
                resolve()
            }
        })
    }
    updateCloseActivity(event, newState) {
        return new Promise((resolve, reject) => {
            if (event.closed !== newState) {
                tcpRequest.UpdateCurrentEvent(stores.LoginStore.user.phone,
                    event.id, !newState ? 'open' : 'close', newState, event.id + "_close").then(JSONData => {
                        serverEventListener.sendRequest(JSONData, event.id + "_close").then((response) => {
                            console.warn(response)
                            stores.Events.openClose(event.id, newState, false).then(() => {
                                let Change = {
                                    id: uuid.v1(),
                                    title: "Updates On Main Activity",
                                    updated: "close",
                                    event_id:event.id,
                                    updater: stores.LoginStore.user,
                                    changed: !newState ? 'Opened' : 'Closed' + " The Main Activity",
                                    new_value: { data: null, new_value: null },
                                    date: moment().format(),
                                    time: null
                                }
                                stores.ChangeLogs.addChanges(Change).then(() => {
                                    resolve("ok")
                                })
                            })
                        }).catch((e) => {
                            reject(e)
                        })
                    })
            } else {
                resolve()
            }
        })
    }
    addUpdateCalendarID(event, newCalendarID) {
        return new Promise((resolve, reject) => {
            if (event.calendar_id !== newCalendarID) {
                tcpRequest.UpdateCurrentEvent(stores.LoginStore.user.phone, event.id,
                    'calendar_id', newCalendarID, event.id + '_calendar_id').then((JSONData) => {
                        serverEventListener.sendRequest(JSONData, event.id + '_calendar_id').then((response) => {
                            console.warn(response)
                            stores.Events.updateCalendarID(event.id, newCalendarID).then(() => {
                                let Change = {
                                    id: uuid.v1(),
                                    title: "Updates On Main Activity",
                                    updated: "calendar_id",
                                    event_id:event.id,
                                    updater: stores.LoginStore.user,
                                    changed: "Changed The Calendar The Main Activity",
                                    new_value: { data: null, new_value: null },
                                    date: moment().format(),
                                    time: null
                                }
                                stores.ChangeLogs.addChanges(Change).then(() => {
                                    resolve("ok")
                                })
                            })
                        }).catch((e) => {
                            reject(e)
                        })
                    })
            } else {
                resolve()
            }
        })
    }

    applyAllUpdate(event, settings) {
        return new Promise((resolve, reject) => {
            this.updateTitle(event, settings.title_new).then((t1) => {
                this.updatePeriod(event, settings.period_new).then((t2) => {
                    this.update_notes(event, settings.notes_new).then((t3) => {
                        this.updateRecurrency(event, {
                            recurrent: settings.recurrent_new,
                            interval: settings.interval_new, frequency: settings.frequency_new,
                            recurrence: settings.recurrence_new
                        }).then((t4) => {
                            if (event.public !== settings.public_new && settings.public_new)
                                this.publish(event.id).then((t5) => {
                                    resolve(t1 + t2 + t3 + t4 + t5)
                                })
                            else if (event.public !== settings.public_new && !settings.public_new)
                            this.unpublish(event.id).then((t5) =>{
                                resolve(t1 + t2 + t3 + t4 + t5)
                            })
                            else resolve(t1 + t2 + t3 + t4)
                        }).catch((e) => {
                            reject(e)
                        })
                    }).catch(e => {
                        reject(e)
                    })
                }).catch((e) => {
                    reject(e)
                })
            }).catch((e) => {
                reject(e)
            })
        })
    }
}

const Requester = new Request()
export default Requester