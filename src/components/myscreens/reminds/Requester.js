import tcpRequest from '../../../services/tcpRequestData';
import EventListener from '../../../services/severEventListener';
import stores from '../../../stores';
import request from '../../../services/requestObjects';
import { isEqual, differenceWith } from 'lodash';
import moment from 'moment';
import { findIndex } from 'lodash';
import CalendarServe from '../../../services/CalendarService';
import MainUpdater from '../../../services/mainUpdater';
import toTitleCase from '../../../services/toTitle';
import Toaster from '../../../services/Toaster';
import IDMaker from '../../../services/IdMaker';
import Texts from '../../../meta/text';
class Requester {
    saveToCanlendar(eventID, remind, alarms, newRemindName) {
        return new Promise((resolve,reject) => {
            if (findIndex(remind.members, { phone: stores.LoginStore.user.phone }) >= 0) {
                CalendarServe.saveEvent(remind, alarms, 'reminds', newRemindName).then(calendar_id => {
                    stores.Reminds.updateCalendarID(eventID, { remind_id: remind.id, calendar_id: calendar_id }, alarms).then(() => {
                        resolve(calendar_id)
                    })
                })
            }
        })
    }
    CreateRemind(Remind, activityName) {
        return new Promise((resolve, reject) => {
            let notif = request.Notification()
            notif.notification.body = toTitleCase(stores.LoginStore.user.nickname) + " @ " + activityName + ' Added a new Remind'
            notif.notification.title = Remind.title
            notif.data.activity_id = Remind.event_id
            notif.data.id = Remind.id
            Remind.notif = notif
            tcpRequest.addRemind(Remind,
                Remind.event_id + '_currence').then(JSONData => {
                    EventListener.sendRequest(JSONData,
                        Remind.event_id + '_currence').then((response) => {
                            stores.Reminds.addReminds(Remind.event_id, Remind).then((res) => {
                                stores.Events.addRemind(Remind.event_id, Remind.id).then(() => {
                                    let Change = {
                                        id: IDMaker.make(),
                                        title: "Updates On Main Activity",
                                        updated: "added_remind",
                                        updater: stores.LoginStore.user.phone,
                                        event_id: Remind.event_id,
                                        changed: `Added  ${Remind.title} Remind `,
                                        new_value: { data: Remind.id, new_value: Remind.title },
                                        date: moment().format(),
                                        time: null
                                    }
                                    this.saveToCanlendar(Remind.event_id, 
                                        Remind,Remind.extra && Remind.extra.alarms)
                                    stores.ChangeLogs.addChanges(Change).then(() => {
                                        console.warn("completed")
                                    })
                                    resolve('ok')
                                })
                            })
                        }).catch(() => {
                            Toaster({ text: Texts.unable_to_perform_request })
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
                                stores.Reminds.updateTitle(eventID, {
                                    remind_id:
                                        remindID, title: newName
                                }, true).then((oldRemind) => {
                                    let Change = {
                                        id: IDMaker.make(),
                                        title: `Updates On ${oldRemind.title} Remind`,
                                        updated: `remind_title_updated`,
                                        updater: stores.LoginStore.user.phone,
                                        event_id: eventID,
                                        changed: "Changed The Title To ",
                                        new_value: { data: remindID, new_value: newName },
                                        date: moment().format(),
                                        time: null
                                    }
                                    stores.ChangeLogs.addChanges(Change).then(() => {
                                        oldRemind.calendar_id && this.saveToCanlendar(oldRemind.calendar_id,
                                            { ...oldRemind, title: newName }, oldRemind.alams,
                                            oldRemind.title).then(() => {

                                            })
                                    })
                                    resolve('ok')
                                })
                            }).catch(error => {
                                Toaster({ text: Texts.unable_to_perform_request })
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
                        stores.Reminds.updateDescription(eventID, {
                            remind_id: remindID,
                            description: newDescription
                        }, true).then((oldRemind) => {
                            let Change = {
                                id: IDMaker.make(),
                                title: `Updates On ${oldRemind.title} Remind`,
                                updated: `remind_description_updated`,
                                updater: stores.LoginStore.user.phone,
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
                        Toaster({ text: Texts.unable_to_perform_request })
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
                    stores.Reminds.confirm(eventID, {
                        remind_id: remindID,
                        confirmed: Member
                    }, true).then((oldRemind) => {
                        let Change = {
                            id: IDMaker.make(),
                            title: `Updates On ${oldRemind.title} Remind`,
                            updated: `remind_confirmed`,
                            updater: stores.LoginStore.user.phone,
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
                    Toaster({ text: Texts.unable_to_perform_request })
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
                let newRemindName = request.RemindUdate()
                newRemindName.action = 'recurrence'
                newRemindName.data = newConfigs
                newRemindName.event_id = eventID
                newRemindName.remind_id = remindID
                tcpRequest.updateRemind(newRemindName, remindID + '_recurrence').then((JSONData) => {
                    EventListener.sendRequest(JSONData, remindID + '_recurrence').then(reponse => {
                        console.warn("update completely sent !")
                        stores.Reminds.updateRecursiveFrequency(eventID, {
                            remind_id: remindID,
                            recursive_frequency: newConfigs
                        }, true).then((oldRemind) => {
                            let Change = {
                                id: IDMaker.make(),
                                title: `Updates On ${oldRemind.title} Remind`,
                                updated: `remind_reurrence_config_updated`,
                                updater: stores.LoginStore.user.phone,
                                event_id: eventID,
                                changed: "Changed The Recurrency configurations",
                                new_value: { data: remindID, new_value: newConfigs },
                                date: moment().format(),
                                time: null
                            }
                            this.saveToCanlendar(eventID,oldRemind,oldRemind.extra && oldRemind.extra.alarms)
                            resolve('ok')
                            stores.ChangeLogs.addChanges(Change).then(() => {

                            })
                        })
                    }).catch(error => {
                        Toaster({ text: Texts.unable_to_perform_request })
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
                        stores.Reminds.updateStatus(eventID, { remind_id: remindID, status: newState }, true).then(oldRemind => {
                            let Change = {
                                id: IDMaker.make(),
                                title: `Updates On ${oldRemind.title} Remind`,
                                updated: `remind_public_state_updated`,
                                updater: stores.LoginStore.user.phone,
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
                        Toaster({ text: Texts.unable_to_perform_request })
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
                        stores.Reminds.updateRequestReportOnComplete(eventID, { remind_id: remindID, must_report: newMustReport }, false).then(oldRemind => {
                            let Change = {
                                id: IDMaker.make(),
                                title: `Updates On ${oldRemind.title} Remind`,
                                updated: `remind_period_updated`,
                                updater: stores.LoginStore.user.phone,
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
                        Toaster({ text: Texts.unable_to_perform_request })
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
                        stores.Reminds.updatePeriod(eventID, { remind_id: remindID, period: newPeriod }, true).then(oldRemind => {
                            let Change = {
                                id: IDMaker.make(),
                                title: `Updates On ${oldRemind.title} Remind`,
                                updated: `remind_period_updated`,
                                updater: stores.LoginStore.user.phone,
                                event_id: eventID,
                                changed: "Changed start Date Of The Remind To ",
                                new_value: { data: remindID, new_value: moment(newPeriod).format("dddd, MMMM Do YYYY, h:mm:ss a") },
                                date: moment().format(),
                                time: null
                            }
                            oldRemind.calendar_id ? CalendarServe.saveEvent({ ...oldRemind, period: newPeriod },
                                null, 'reminds').then(() => {

                                }) : null
                            resolve('ok')
                            stores.ChangeLogs.addChanges(Change).then(() => {

                            })
                        })

                    }).catch(error => {
                        Toaster({ text: Texts.unable_to_perform_request })
                        reject(error)
                    })
                })
            } else {
                resolve()
            }
        })
    }
    updateRemindAlarms(newExtra, oldExtra, remindID, eventID) {
        console.warn("applying update for reminds")
        return new Promise((resolve, reject) => {
            if (newExtra &&
                oldExtra && (differenceWith(newExtra.alarms, oldExtra.alarms, isEqual).length !==
                  differenceWith(oldExtra.alarms, newExtra.alarms, isEqual).length)) {
                let newRemindName = request.RemindUdate()
                newRemindName.action = "remind_alarms"
                newRemindName.data = { alarms: newExtra.alarms, date: newExtra.date }
                newRemindName.event_id = eventID
                newRemindName.remind_id = remindID
                tcpRequest.updateRemind(newRemindName, remindID + "_alarms").then(JSONData => {
                    EventListener.sendRequest(JSONData, remindID + "_alarms").then(response => {
                        MainUpdater.updateRemindAlarms(eventID,
                            remindID, newRemindName.data,
                            moment().format(),
                            stores.LoginStore.user.phone).
                            then(() => {
                                resolve("ok")
                            })
                    })
                }).catch(e => {
                    Toaster({ text: Texts.unable_to_perform_request })
                    reject()
                })
            } else {
                resolve()
            }
        })
    }
    updateRemindLocation(newLocation, oldLocation, remindID, eventID) {
        return new Promise((resolve, reject) => {
            if (newLocation !== oldLocation) {
                let newRemindName = request.RemindUdate()
                newRemindName.action = 'location'
                newRemindName.data = newLocation
                newRemindName.event_id = eventID
                newRemindName.remind_id = remindID
                tcpRequest.updateRemind(newRemindName, remindID + '_location').then((JSONData) => {
                    EventListener.sendRequest(JSONData, remindID + '_location').then((response) => {
                        MainUpdater.updateRemindLocation(eventID, remindID,
                            newLocation, moment().format(), stores.LoginStore.user.phone).then(() => {
                                resolve("ok")
                            })
                    }).catch(() => {
                        Toaster({ text: Texts.unable_to_perform_request })
                        reject()
                    })
                })
            } else {
                resolve()
            }
        })
    }

    updateRemindURL(newURL, oldULR, remindID, eventID) {
        return new Promise((resolve, reject) => {
            if (!isEqual(newURL, oldULR)) {
                let newRemindName = request.RemindUdate()
                newRemindName.action = 'remind_url'
                newRemindName.data = newURL
                newRemindName.event_id = eventID
                newRemindName.remind_id = remindID
                tcpRequest.updateRemind(newRemindName, remindID + '_remind_url').then((JSONData) => {
                    EventListener.sendRequest(JSONData, remindID + '_remind_url').then((response) => {
                        MainUpdater.updateRemindURL(eventID, remindID,
                            newURL, moment().format(), stores.LoginStore.user.phone).then(() => {
                                resolve("ok")
                            })
                    }).catch(() => {
                        reject()
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
                    stores.Reminds.addMembers(remind.event_id, {
                        members: remind.members,
                        remind_id: remind.id
                    }, true).then(oldRemind => {
                        let Change = {
                            id: IDMaker.make(),
                            title: `Updates On ${oldRemind.title} Remind`,
                            updated: `remind_member_added`,
                            updater: stores.LoginStore.user.phone,
                            event_id: remind.event_id,
                            changed: "Assigned The Remind To ...",
                            new_value: { data: remind.id, new_value: remind.members },
                            date: moment().format(),
                            time: null
                        }
                        this.saveToCanlendar(remind.event_id, remind, alarms)
                        stores.ChangeLogs.addChanges(Change).then(() => {

                        })
                        resolve('ok')
                    })
                }).catch(error => {
                    Toaster({ text: Texts.unable_to_perform_request })
                    console.warn(error)
                    reject(error)
                })
            })
        })
    }
    removeMembers(members, remindID, eventID) {
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
                            stores.Reminds.removeMember(eventID, {
                                members: members,
                                remind_id: remindID
                            }, true).then(oldRemind => {
                                let Change = {
                                    id: IDMaker.make(),
                                    title: `Updates On ${oldRemind.title} Remind`,
                                    updated: `remind_member_removed`,
                                    updater: stores.LoginStore.user.phone,
                                    event_id: eventID,
                                    changed: "Unassigned This Task / Remind From ",
                                    new_value: { data: remindID, new_value: members.map(ele => { return { phone: ele } }) },
                                    date: moment().format(),
                                    time: null
                                }
                                if (oldRemind.calendar_id && findIndex(members, ele => ele === stores.LoginStore.user.phone) >= 0) {
                                    CalendarServe.saveEvent({ ...oldRemind, period: null }, null, 'reminds', true).then(() => {
                                        stores.Reminds.updateCalendarID(eventID, { remind_id: oldRemind.id, calendar_id: undefined }).then(() => {
                                            console.warn("calendar_id successfully removed")
                                        })
                                    })
                                }
                                resolve('ok')
                                stores.ChangeLogs.addChanges(Change).then(() => {

                                })
                            })
                        }).catch(error => {
                            Toaster({ text: Texts.unable_to_perform_request })
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
                                                    this.updateRemindLocation(newRemind.location,
                                                        JSON.parse(previousRemind).location, newRemind.id, newRemind.event_id).then((t6) => {
                                                            this.updateRemindURL(newRemind.remind_url, JSON.parse(previousRemind).remind_url,
                                                                newRemind.id, newRemind.event_id).then((t7) => {
                                                                    this.updateMustRepot(newRemind.must_report, JSON.parse(previousRemind).must_report,
                                                                        newRemind.id, newRemind.event_id).then(t8 => {
                                                                            this.updateRemindAlarms(newRemind.extra, JSON.parse(previousRemind).extra, newRemind.id, newRemind.event_id).then(t9 => {
                                                                                resolve(t1 + t2 + t3 + t4 + t5 + t6 + t7 + t8 + t9)
                                                                            }).catch(r => {
                                                                                reject(r)
                                                                            })
                                                                        }).catch(r => {
                                                                            reject(r)
                                                                        })
                                                                }).catch(() => {
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
                    stores.Reminds.makeAsDone(remind.event_id, {
                        donners: member,
                        remind_id: remind.id
                    }, true).then(oldRemind => {
                        let Change = {
                            id: IDMaker.make(),
                            title: `Updates On ${oldRemind.title} Remind`,
                            updated: `remind_marked_as_done`,
                            updater: stores.LoginStore.user.phone,
                            event_id: remind.event_id,
                            changed: "Marked The Remind As Done",
                            new_value: { data: remind.id, new_value: member },
                            date: moment().format(),
                            time: null
                        }
                        if (oldRemind.calendar_id) {
                            //CalendarServe.saveEvent({ ...oldRemind, period: null }, null, 'reminds',false).then(() => {
                            //   stores.Reminds.updateCalendarID({ remind_id: oldRemind.id, calendar_id: undefined }).then(() => {
                            console.warn("calendar_id successfully removed")
                            //  })
                            //  })
                        }
                        resolve('ok')
                        stores.ChangeLogs.addChanges(Change).then(() => {

                        })
                        resolve('ok')
                    })
                }).catch(e => {
                    Toaster({ text: Texts.unable_to_perform_request })
                    reject()
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
                    stores.Reminds.removeRemind(eventID, remindID).then((oldRemind) => {
                        stores.Events.removeRemind(eventID, remindID, false).then(() => {
                            let Change = {
                                id: IDMaker.make(),
                                title: `Removed ${oldRemind.title} Remind`,
                                updated: `delete_remind`,
                                updater: stores.LoginStore.user.phone,
                                event_id: eventID,
                                changed: `Deleted ${oldRemind.title} Remind`,
                                new_value: { data: remindID, new_value: oldRemind },
                                date: moment().format(),
                                time: null
                            }
                            if (oldRemind.calendar_id && findIndex(oldRemind.members,
                                { phone: stores.LoginStore.user.phone }) >= 0) {
                                CalendarServe.saveEvent({ ...oldRemind, period: null }, null, 'reminds').then(() => {
                                })
                            }
                            stores.ChangeLogs.addChanges(Change).then(() => {

                            })
                            resolve('ok')
                        })
                    })
                }).catch(() => {
                    Toaster({ text: Texts.unable_to_perform_request })
                    reject("delete remind error")
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
                    stores.Reminds.addReminds(remind.event_id, remind).then(() => {
                        stores.Events.addRemind(remind.event_id, remind.id).then(() => {
                            let Change = {
                                id: IDMaker.make(),
                                title: `Updates On ${remind.title} Remind`,
                                updated: `restored_remind`,
                                updater: stores.LoginStore.user.phone,
                                event_id: remind.event_id,
                                changed: `Restored  ${remind.title} Remind`,
                                new_value: { data: remind.id, new_value: remind },
                                date: moment().format(),
                                time: null
                            }
                            this.saveToCanlendar(remind.event_id, remind, null)
                            stores.ChangeLogs.addChanges(Change).then(() => {

                            })
                            resolve('ok')
                        })
                    })
                }).catch((er) => {
                    reject(er)
                })
            })
        })
    }
}

const RemindRequest = new Requester()
export default RemindRequest