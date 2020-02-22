import tcpRequest from '../../../services/tcpRequestData';
import EventListener from '../../../services/severEventListener';
import stores from '../../../stores';
import uuid from 'react-native-uuid';
import { Toast } from 'native-base';
import request from '../../../services/requestObjects';
import { isEqual } from 'lodash';
import moment from 'moment';
import { findIndex } from 'lodash';
import CalendarServe from '../../../services/CalendarService';
class Requester {
    CreateRemind(Remind) {
        return new Promise((resolve, reject) => {
            tcpRequest.addRemind(Remind,
                Remind.event_id + '_currence').then(JSONData => {
                    EventListener.sendRequest(JSONData,
                        Remind.event_id + '_currence').then((response) => {
                            stores.Reminds.addReminds(Remind).then((res) => {
                                stores.Events.addRemind(Remind.event_id, Remind.id).then(() => {
                                    let Change = {
                                        id: uuid.v1(),
                                        title: "Updates On Main Activity",
                                        updated: "added_remind",
                                        updater: stores.LoginStore.user,
                                        event_id: Remind.event_id,
                                        changed: `Added  ${Remind.title} Remind `,
                                        new_value: { data: Remind.id, new_value: Remind.title },
                                        date: moment().format(),
                                        time: null
                                    }
                                    stores.ChangeLogs.addChanges(Change).then(() => {
                                        console.warn("completed")
                                    })
                                    resolve('ok')
                                })
                            })
                        }).catch(() => {
                            Toast.show({ text: "Unable To perform This Action" })
                            reject()
                        })
                })
        })
    }
    updateRemindName(newName, oldName, remindID, eventID) {
        return new Promise((resolve, reject) => {
            if (newName !== oldName) {
                let newRemindName = request.RemindUdate()
                newRemindName.action = 'title'
                newRemindName.data = newName
                newRemindName.event_id = eventID
                newRemindName.remind_id = remindID
                tcpRequest.updateRemind(newRemindName,
                    remindID + '_name').then(JSONData => {
                        EventListener.sendRequest(JSONData,
                            remindID + '_name').then((response) => {
                                stores.Reminds.updateTitle({ remind_id: remindID, title: newName }, true).then((oldRemind) => {
                                    let Change = {
                                        id: uuid.v1(),
                                        title: `Updates On ${oldRemind.title} Remind`,
                                        updated: `remind_title_updated`,
                                        updater: stores.LoginStore.user,
                                        event_id: eventID,
                                        changed: "Changed The Title To ",
                                        new_value: { data: remindID, new_value: newName },
                                        date: moment().format(),
                                        time: null
                                    }
                                    stores.ChangeLogs.addChanges(Change).then(() => {
                                    })
                                    resolve('ok')
                                })
                            }).catch(error => {
                                Toast.show({ text: 'Unable to perform network request' })
                                console.warn(error)
                                reject(error)
                            })
                    })
            } else {
                resolve()
            }
        })

    }
    updateRemindDescription(newDescription, oldDesc, remindID, eventID) {
        return new Promise((resolve, reject) => {
            if (newDescription !== oldDesc) {
                let newRemindName = request.RemindUdate()
                newRemindName.action = 'description'
                newRemindName.data = newDescription
                newRemindName.event_id = eventID
                newRemindName.remind_id = remindID
                tcpRequest.updateRemind(newRemindName, remindID + '_description').then(JSONData => {
                    EventListener.sendRequest(JSONData, remindID + '_description').then((response) => {
                        stores.Reminds.updateDescription({
                            remind_id: remindID,
                            description: newDescription
                        }, true).then((oldRemind) => {
                            let Change = {
                                id: uuid.v1(),
                                title: `Updates On ${oldRemind.title} Remind`,
                                updated: `remind_description_updated`,
                                updater: stores.LoginStore.user,
                                event_id: eventID,
                                changed: newDescription ? oldRemind.description ? "Changed The Description To " :
                                    "Add a Description to The Remind" : "Removed The Description Of The Remind",
                                new_value: { data: remindID, new_value: newDescription },
                                date: moment().format(),
                                time: null
                            }
                            stores.ChangeLogs.addChanges(Change).then(() => {
                            })
                            resolve('ok')
                        })
                    }).catch(error => {
                        Toast.show({ text: 'Unable to perform network request' })
                        console.warn(error)
                        reject(error)
                    })
                })
            } else {
                resolve()
            }
        })

    }
    confirm(Member, remindID, eventID) {
        return new Promise((resolve, reject) => {
            let newRemindName = request.RemindUdate()
            newRemindName.action = 'confirm'
            newRemindName.data = Member
            newRemindName.event_id = eventID
            newRemindName.remind_id = remindID
            tcpRequest.updateRemind(newRemindName, remindID + '_confirm').then(JSONData => {
                EventListener.sendRequest(JSONData, remindID + '_confirm').then((response) => {
                    stores.Reminds.confirm({
                        remind_id: remindID,
                        confirmed: Member
                    }, true).then((oldRemind) => {
                        let Change = {
                            id: uuid.v1(),
                            title: `Updates On ${oldRemind.title} Remind`,
                            updated: `remind_confirmed`,
                            updater: stores.LoginStore.user,
                            event_id: eventID,
                            changed: "Confirmed The Task Completion Of ...",
                            new_value: { data: remindID, new_value: Member },
                            date: moment().format(),
                            time: null
                        }
                        stores.ChangeLogs.addChanges(Change).then(() => {
                        })
                        resolve('ok')
                    })
                }).catch(error => {
                    Toast.show({ text: 'Unable to perform network request' })
                    console.warn(error)
                    reject(error)
                })
            })

        })
    }
    updateRemindRecurrentcyConfig(newConfigs, oldConfig, remindID, eventID) {
        return new Promise((resolve, reject) => {
            if ((typeof newConfigs === "string" && newConfigs !== oldConfig) ||
                (typeof newConfigs === "object" && !isEqual(newConfigs, oldConfig))) {
                console.warn("saving ruccrence",newConfigs)
                let newRemindName = request.RemindUdate()
                newRemindName.action = 'recurrence'
                newRemindName.data = newConfigs
                newRemindName.event_id = eventID
                newRemindName.remind_id = remindID
                tcpRequest.updateRemind(newRemindName, remindID + '_recurrence').then((JSONData) => {
                    EventListener.sendRequest(JSONData, remindID + '_recurrence').then(reponse => {
                        stores.Reminds.updateRecursiveFrequency({
                            remind_id: remindID,
                            recursive_frequency: newConfigs
                        }, remindID).then((oldRemind) => {
                            let Change = {
                                id: uuid.v1(),
                                title: `Updates On ${oldRemind.title} Remind`,
                                updated: `remind_reurrence_config_updated`,
                                updater: stores.LoginStore.user,
                                event_id: eventID,
                                changed: "Changed The Recurrency configurations",
                                new_value: { data: remindID, new_value: newConfigs },
                                date: moment().format(),
                                time: null
                            }
                            oldRemind.calendar_id ? CalendarServe.saveEvent({ ...oldRemind, recursive_frequency: newConfigs },
                                oldRemind.alams, 'reminds').then(() => {

                                }) : null

                            resolve('ok')
                            stores.ChangeLogs.addChanges(Change).then(() => {

                            })
                        })
                    }).catch(error => {
                        Toast.show({ text: 'Unable to perform network request' })
                        console.warn(error)
                        reject(error)
                    })
                })
            } else {
                resolve()
            }
        })
    }
    updateRemindPublicState(newState, oldState, remindID, eventID) {
        return new Promise((resolve, reject) => {
            if (newState !== oldState) {
                let newRemindName = request.RemindUdate()
                newRemindName.action = 'public_state'
                newRemindName.data = newState
                newRemindName.event_id = eventID
                newRemindName.remind_id = remindID
                tcpRequest.updateRemind(newRemindName, remindID + '_public_state').then(JSONData => {
                    EventListener.sendRequest(JSONData, remindID + '_public_state').then(response => {
                        stores.Reminds.updateStatus({ remind_id: remindID, status: newState }, true).then(oldRemind => {
                            let Change = {
                                id: uuid.v1(),
                                title: `Updates On ${oldRemind.title} Remind`,
                                updated: `remind_public_state_updated`,
                                updater: stores.LoginStore.user,
                                event_id: eventID,
                                changed: "Changed The State Of The Remind To",
                                new_value: { data: remindID, new_value: newState },
                                date: moment().format(),
                                time: null
                            }
                            stores.ChangeLogs.addChanges(Change).then(() => {
                            })
                            resolve('ok')
                        })
                    }).catch(error => {
                        Toast.show({ text: 'Unable to perform network request' })
                        console.warn(error)
                        reject(error)
                    })
                })
            } else {
                resolve()
            }
        })
    }
    updateMustRepot(newMustReport, oldMust, remindID, eventID) {
        return new Promise((resolve, reject) => {
            if (newMustReport !== oldMust) {
                let newRemindName = request.RemindUdate()
                newRemindName.action = 'must_report'
                newRemindName.data = newMustReport
                newRemindName.event_id = eventID
                newRemindName.remind_id = remindID
                tcpRequest.updateRemind(newRemindName, remindID + '_must_report').then(JSONData => {
                    EventListener.sendRequest(JSONData, remindID + '_must_report').then(response => {
                        stores.Reminds.updateRequestReportOnComplete({ remind_id: remindID, must_report: newMustReport }, false).then(oldRemind => {
                            let Change = {
                                id: uuid.v1(),
                                title: `Updates On ${oldRemind.title} Remind`,
                                updated: `remind_period_updated`,
                                updater: stores.LoginStore.user,
                                event_id: eventID,
                                changed: "Changed The Must Report Status ",
                                new_value: { data: remindID, new_value: newMustReport },
                                date: moment().format(),
                                time: null
                            }
                            stores.ChangeLogs.addChanges(Change).then(() => {
                            })
                            resolve('ok')
                        })
                    }).catch(error => {
                        Toast.show({ text: 'Unable to perform network request' })
                        console.warn(error)
                        reject(error)
                    })
                })
            } else {
                resolve()
            }
        })
    }
    updatePeriod(newPeriod, oldPer, remindID, eventID) {
        return new Promise((resolve, reject) => {
            if (newPeriod !== oldPer) {
                let newRemindName = request.RemindUdate()
                newRemindName.action = 'period'
                newRemindName.data = newPeriod
                newRemindName.event_id = eventID
                newRemindName.remind_id = remindID
                tcpRequest.updateRemind(newRemindName, remindID + '_period').then(JSONData => {
                    EventListener.sendRequest(JSONData, remindID + '_period').then(response => {
                        stores.Reminds.updatePeriod({ remind_id: remindID, period: newPeriod }, true).then(oldRemind => {
                            let Change = {
                                id: uuid.v1(),
                                title: `Updates On ${oldRemind.title} Remind`,
                                updated: `remind_period_updated`,
                                updater: stores.LoginStore.user,
                                event_id: eventID,
                                changed: "Changed start Date Of The Remind To ",
                                new_value: { data: remindID, new_value: moment(newPeriod).format("dddd, MMMM Do YYYY, h:mm:ss a") },
                                date: moment().format(),
                                time: null
                            }
                            oldRemind.calendar_id ? CalendarServe.saveEvent({ ...oldRemind, period: newPeriod },
                                oldRemind.alams, 'reminds').then(() => {

                                }) : null
                            resolve('ok')
                            stores.ChangeLogs.addChanges(Change).then(() => {

                            })
                        })

                    }).catch(error => {
                        Toast.show({ text: 'Unable to perform network request' })
                        console.warn(error)
                        reject(error)
                    })
                })
            } else {
                resolve()
            }
        })
    }
    addMembers(remind, alarms) {
        return new Promise((resolve, reject) => {
            let newRemindName = request.RemindUdate()
            newRemindName.action = 'add_members'
            newRemindName.data = remind.members
            newRemindName.event_id = remind.event_id
            newRemindName.remind_id = remind.id
            tcpRequest.updateRemind(newRemindName, remind.id + '_add_members').then(JSONData => {
                EventListener.sendRequest(JSONData, remind.id + '_add_members').then(response => {
                    stores.Reminds.addMembers({
                        members: remind.members,
                        remind_id: remind.id
                    }, true).then(oldRemind => {
                        let Change = {
                            id: uuid.v1(),
                            title: `Updates On ${oldRemind.title} Remind`,
                            updated: `remind_member_added`,
                            updater: stores.LoginStore.user,
                            event_id: remind.event_id,
                            changed: "Assigned The Remind To ...",
                            new_value: { data: remind.id, new_value: remind.members },
                            date: moment().format(),
                            time: null
                        }
                        if (findIndex(remind.members, { phone: stores.LoginStore.user.phone }) >= 0) {
                            CalendarServe.saveEvent(remind, alarms, 'reminds').then(calendar_id => {
                                stores.Reminds.updateCalendarID({ remind_id: remind.id, calendar_id: calendar_id }, alarms).then(() => {
                                })
                            })
                        }
                        stores.ChangeLogs.addChanges(Change).then(() => {
                            
                        })
                        resolve('ok')
                    })
                }).catch(error => {
                    Toast.show({ text: 'Unable to perform network request' })
                    console.warn(error)
                    reject(error)
                })
            })
        })
    }
    removeMembers(members, remindID, eventID) {
        console.warn(members)
        return new Promise((resolve, reject) => {
            let newRemindName = request.RemindUdate()
            newRemindName.action = 'remove_members'
            newRemindName.data = members
            newRemindName.event_id = eventID
            newRemindName.remind_id = remindID
            tcpRequest.updateRemind(newRemindName, remindID +
                '_remove_members').then(JSONData => {
                    EventListener.sendRequest(JSONData, remindID +
                        '_remove_members').then(() => {
                            stores.Reminds.removeMember({
                                members: members,
                                remind_id: remindID
                            }, true).then(oldRemind => {
                                let Change = {
                                    id: uuid.v1(),
                                    title: `Updates On ${oldRemind.title} Remind`,
                                    updated: `remind_member_removed`,
                                    updater: stores.LoginStore.user,
                                    event_id: eventID,
                                    changed: "Unassigned This Task / Remind From ",
                                    new_value: { data: remindID, new_value: members.map(ele => { return { phone: ele } }) },
                                    date: moment().format(),
                                    time: null
                                }
                                if (oldRemind.calendar_id && findIndex(members, ele => ele === stores.LoginStore.user.phone) >= 0) {
                                    CalendarServe.saveEvent({ ...oldRemind, period: null }, null, 'reminds').then(() => {
                                        stores.Reminds.updateCalendarID({ remind_id: oldRemind.id, calendar_id: undefined }).then(() => {
                                            console.warn("calendar_id successfully removed")
                                        })
                                    })
                                }
                                resolve('ok')
                                stores.ChangeLogs.addChanges(Change).then(() => {
                                    
                                })
                            })
                        }).catch(error => {
                            Toast.show({ text: 'Unable to perform network request' })
                            console.warn(error)
                            reject(error)
                        })
                })
        })
    }
    performAllUpdates(previousRemind, newRemind) {
        return new Promise((resolve, reject) => {
            this.updateRemindName(newRemind.title, JSON.parse(previousRemind).title, newRemind.id,
                newRemind.event_id).then((t1) => {
                    this.updateRemindDescription(newRemind.description, JSON.parse(previousRemind).description,
                        newRemind.id, newRemind.event_id).then((t2) => {
                            this.updatePeriod(newRemind.period, JSON.parse(previousRemind).period, newRemind.id,
                                newRemind.event_id).then((t3) => {
                                    this.updateRemindPublicState(newRemind.status, JSON.parse(previousRemind).status, newRemind.id,
                                        newRemind.event_id).then((t4) => {
                                            this.updateRemindRecurrentcyConfig(newRemind.recursive_frequency,
                                                JSON.parse(previousRemind).recursive_frequency,
                                                newRemind.id, newRemind.event_id).then((t5) => {
                                                    this.updateMustRepot(newRemind.must_report, JSON.parse(previousRemind).must_report,
                                                        newRemind.id, newRemind.event_id).then(t6 => {
                                                            resolve(t1 + t2 + t3 + t4 + t5 + t6)
                                                        }).catch(r => {
                                                            reject(r)
                                                        })
                                                }).catch(r => {
                                                    reject(r)
                                                })
                                        }).catch(r => {
                                            reject(r)
                                        })
                                }).catch(r => {
                                    reject(r)
                                })

                        }).catch(r => {
                            reject(r)
                        })
                }).catch(r => {
                    reject(r)
                })
        })

    }
    markAsDone(member, remind, alams, calendar_id) {
        return new Promise((resolve, reject) => {
            let newRemindName = request.RemindUdate()
            newRemindName.action = 'mark_as_done'
            newRemindName.data = member
            newRemindName.event_id = remind.event_id
            newRemindName.remind_id = remind.id
            tcpRequest.updateRemind(newRemindName, remind.id + '_mark_as_done').then(JSONData => {
                EventListener.sendRequest(JSONData, remind.id + '_mark_as_done').then(response => {
                    stores.Reminds.makeAsDone({
                        donners: member,
                        remind_id: remind.id
                    }, true).then(oldRemind => {
                        let Change = {
                            id: uuid.v1(),
                            title: `Updates On ${oldRemind.title} Remind`,
                            updated: `remind_marked_as_done`,
                            updater: stores.LoginStore.user,
                            event_id: remind.event_id,
                            changed: "Marked The Remind As Done",
                            new_value: { data: remind.id, new_value: member },
                            date: moment().format(),
                            time: null
                        }
                        if (oldRemind.calendar_id) {
                            CalendarServe.saveEvent({ ...oldRemind, period: null }, null, 'reminds').then(() => {
                                stores.Reminds.updateCalendarID({ remind_id: oldRemind.id, calendar_id: undefined }).then(() => {
                                    console.warn("calendar_id successfully removed")
                                })
                            })
                        }
                        resolve('ok')
                        stores.ChangeLogs.addChanges(Change).then(() => {
                            
                        })
                        resolve('ok')
                    })
                })
            })
        })
    }
    deleteRemind(remindID, eventID) {
        return new Promise((resolve, reject) => {
            let newRemindName = request.RemindUdate()
            newRemindName.action = 'delete'
            newRemindName.data = null
            newRemindName.event_id = eventID
            newRemindName.remind_id = remindID
            tcpRequest.updateRemind(newRemindName, remindID + '_delete').then(JSONData => {
                EventListener.sendRequest(JSONData, remindID + '_delete').then(response => {
                    stores.Reminds.removeRemind(remindID).then((oldRemind) => {
                        stores.Events.removeRemind(eventID, remindID, false).then(() => {
                            let Change = {
                                id: uuid.v1(),
                                title: `Removed ${oldRemind.title} Remind`,
                                updated: `delete_remind`,
                                updater: stores.LoginStore.user,
                                event_id: eventID,
                                changed: `Deleted ${oldRemind.title} Remind`,
                                new_value: { data: remindID, new_value: oldRemind },
                                date: moment().format(),
                                time: null
                            }
                            if (oldRemind.calendar_id && findIndex(oldRemind.members,
                                { phone: stores.LoginStore.user.phone }) >= 0) {
                                CalendarServe.saveEvent({ ...oldRemind, period: null }, null, 'reminds').then(() => {
                                    stores.Reminds.updateCalendarID({ remind_id: oldRemind.id, calendar_id: undefined }).then(() => {
                                        console.warn("calendar_id successfully removed")
                                    })
                                })
                            }
                            stores.ChangeLogs.addChanges(Change).then(() => {
                               
                            })
                            resolve('ok')
                        })
                    })
                })
            })
        })
    }
    restoreRemind(remind) {
        return new Promise((resolve, reject) => {
            let newRemindName = request.RemindUdate()
            newRemindName.action = 'restore'
            newRemindName.data = { ...remind, alams: undefined }
            newRemindName.event_id = remind.event_id
            newRemindName.remind_id = remind.id
            tcpRequest.updateRemind(newRemindName, remind.id + '_restore').then((JSONData) => {
                EventListener.sendRequest(JSONData, remind.id + '_restore').then(response => {
                    stores.Reminds.addReminds(remind).then(() => {
                        stores.Events.addRemind(remind.event_id, remind.id).then(() => {
                            let Change = {
                                id: uuid.v1(),
                                title: `Updates On ${remind.title} Remind`,
                                updated: `restored_remind`,
                                updater: stores.LoginStore.user,
                                event_id: remind.event_id,
                                changed: `Restored  ${remind.title} Remind`,
                                new_value: { data: remind.id, new_value: remind },
                                date: moment().format(),
                                time: null
                            }
                            if (findIndex(remind.members, { phone: stores.LoginStore.user.phone }) >= 0) {
                                CalendarServe.saveEvent(remind, remind.alams, 'reminds').then(calendar_id => {
                                    stores.Reminds.updateCalendarID({
                                        remind_id: remind.id,
                                        calendar_id: calendar_id
                                    }, remind.alams).then(() => {

                                    })
                                })
                            }
                            stores.ChangeLogs.addChanges(Change).then(() => {
                               
                            })
                            resolve('ok')
                        })
                    })
                })
            })
        })
    }
}

const RemindRequest = new Requester()
export default RemindRequest