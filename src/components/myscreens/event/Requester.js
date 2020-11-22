import tcpRequest from "../../../services/tcpRequestData";
import serverEventListener from "../../../services/severEventListener";
import stores from "../../../stores";
import request from "../../../services/requestObjects";
import moment from "moment";
import { isEqual } from "lodash";
import Requesterer from "../currentevents/Requester";
import { RemoveParticipant } from "../../../services/cloud_services";
import CalendarServe from "../../../services/CalendarService";
import MainUpdater from "../../../services/mainUpdater";
import toTitleCase from "../../../services/toTitle";
import Toaster from "../../../services/Toaster";
import IDMaker from "../../../services/IdMaker";
import Texts from "../../../meta/text";
import notification_channels from "../eventChat/notifications_channels";
import { observer } from "mobx-react";
import UpdatesDispatch from "../../../services/updatesDispatcher";
import Updates from '../../../services/updates-posibilites';
const no_data_with_such_key = "no data with such id not found";
class Request {
    constructor() { }

    addCommitee(commitee, activityName) {
        return new Promise((resolve, reject) => {
            let notif = request.Notification();
            notif.notification.title = commitee.name;
            notif.notification.body =
                toTitleCase(stores.LoginStore.user.nickname) +
                " @ " +
                toTitleCase(activityName) +
                " Added a Committee";
            notif.data.activity_id = commitee.event_id;
            let Commitee = request.createCommitee();
            (Commitee.event_id = commitee.event_id), (Commitee.commitee = commitee);
            Commitee.notif = notif;
            tcpRequest.addcommitee(Commitee, commitee.id).then((JSONData) => {
                serverEventListener
                    .sendRequest(JSONData, commitee.id)
                    .then((response) => {
                        stores.CommiteeStore.addCommitee(commitee.event_id, commitee).then(
                            () => {
                                stores.Events.addEventCommitee(
                                    commitee.event_id,
                                    commitee.id
                                ).then(() => {
                                    let Change = {
                                        id: IDMaker.make(),
                                        title: "Update On Committees",
                                        updated: "new_commitee",
                                        event_id: commitee.event_id,
                                        changed: `Create ${commitee.name} Committee  `,
                                        updater: stores.LoginStore.user.phone,
                                        new_value: { data: commitee.id, new_value: commitee.name },
                                        date: moment().format(),
                                        time: null,
                                    };
                                    stores.ChangeLogs.addChanges(Change).then(() => { });
                                    resolve();
                                });
                            }
                        );
                    })
                    .catch((error) => {
                        console.warn(error);
                        Toaster({ text: "Unable to perform the creation action" });
                        reject(error);
                    });
            });
        });
    }
    editCommiteeName(newName, ID, eventID) {
        return new Promise((resolve, reject) => {
            let updateName = request.UpdateCommiteeName();
            updateName.commitee_id = ID;
            updateName.event_id = eventID;
            updateName.name = newName;
            tcpRequest
                .update_commitee_name(updateName, ID + "_name")
                .then((JSONData) => {
                    serverEventListener
                        .sendRequest(JSONData, ID + "_name")
                        .then((response) => {
                            stores.CommiteeStore.updateCommiteeName(
                                eventID,
                                ID,
                                newName
                            ).then((commitee) => {
                                let Change = {
                                    id: IDMaker.make(),
                                    title: "Update On Committees",
                                    updated: "commitee_name_updated",
                                    event_id: eventID,
                                    changed: `Changed ${commitee.name} Committee Name To: `,
                                    updater: stores.LoginStore.user.phone,
                                    new_value: { data: commitee.id, new_value: newName },
                                    date: moment().format(),
                                    time: null,
                                };
                                stores.ChangeLogs.addChanges(Change).then(() => {
                                    //Toaster({ text: "update went successfully !", type: "success" })
                                });
                                resolve();
                            });
                        })
                        .catch((error) => {
                            Toaster({ text: "Unable to perform the name editing action" });
                            reject(error);
                        });
                });
        });
    }
    publishCommitee(id, event_id, state, roomName) {
        return new Promise((resolve, reject) => {
            let publish = request.updateCommiteeState();
            publish.commitee_id = id;
            publish.event_id = event_id;
            publish.state = state;
            let notif = request.Notification();
            notif.notification.title = toTitleCase(roomName) + "Is now Public";
            notif.notification.body =
                toTitleCase(stores.LoginStore.user.nickname) +
                " Made The Committee Public";
            publish.notif = state ? notif : [];
            tcpRequest
                .update_commitee_public_state(publish, id + "_publish")
                .then((JSONData) => {
                    serverEventListener
                        .sendRequest(JSONData, id + "_publish")
                        .then((response) => {
                            stores.CommiteeStore.updateCommiteeState(
                                event_id,
                                id,
                                state
                            ).then((commitee) => {
                                let Change = {
                                    id: IDMaker.make(),
                                    title: "Update On Committees",
                                    updated: "published_commitee",
                                    event_id: event_id,
                                    changed: `${state === true ? "Published" : "Unpublished"} ${
                                        commitee.name
                                        } Committee`,
                                    updater: stores.LoginStore.user.phone,
                                    new_value: {
                                        data: commitee.id,
                                        new_value: state === true ? "Published" : "Unpublished",
                                    },
                                    date: moment().format(),
                                    time: null,
                                };
                                stores.ChangeLogs.addChanges(Change).then(() => { });
                                resolve();
                            });
                        })
                        .catch((error) => {
                            Toaster({ text: "Unable to perform the publish action" });
                            reject(error);
                        });
                });
        });
    }
    addMembers(id, members, event_id) {
        return new Promise((resolve, reject) => {
            let addMembers = request.addCommiteeMember();
            addMembers.commitee_id = id;
            addMembers.member = members;
            addMembers.event_id = event_id;
            tcpRequest
                .add_member_to_commitee(addMembers, id + "_members")
                .then((JSONData) => {
                    serverEventListener
                        .sendRequest(JSONData, id + "_members")
                        .then((response) => {
                            stores.CommiteeStore.addMembers(event_id, id, members).then(
                                (commitee) => {
                                    let Change = {
                                        id: IDMaker.make(),
                                        title: "Update On Committees",
                                        updated: "added_commitee_member",
                                        event_id: event_id,
                                        changed: `Added Members To ${commitee.name} Committee`,
                                        updater: stores.LoginStore.user.phone,
                                        new_value: { data: commitee.id, new_value: members },
                                        date: moment().format(),
                                        time: null,
                                    };
                                    stores.ChangeLogs.addChanges(Change).then(() => {
                                        //Toaster({ text: "members where successfully added !", type: "success" })
                                    });
                                    resolve(members);
                                }
                            );
                        })
                        .catch((error) => {
                            Toaster({ text: "Unable to perform the add action" });
                            reject(error);
                        });
                });
        });
    }
    openCommitee(id, event_id) {
        return new Promise((resolve, reject) => {
            let CEID = request.COEID();
            CEID.commitee_id = id;
            CEID.event_id = event_id;
            tcpRequest.open_commitee(CEID, id + "_open").then((JSONData) => {
                serverEventListener
                    .sendRequest(JSONData, id + "_open")
                    .then((reponse) => {
                        stores.CommiteeStore.changeCommiteeOpenedState(
                            event_id,
                            id,
                            true
                        ).then((commitee) => {
                            let Change = {
                                id: IDMaker.make(),
                                title: "Update On Committees",
                                updated: "commitee_opened",
                                event_id: event_id,
                                changed: `Opened ${commitee.name} Committee`,
                                updater: stores.LoginStore.user.phone,
                                new_value: { data: null, new_value: "opened" },
                                date: moment().format(),
                                time: null,
                            };
                            stores.ChangeLogs.addChanges(Change).then(() => {
                                Toaster({
                                    text: "The commitee was successfully opened !",
                                    type: "success",
                                });
                            });
                            resolve();
                        });
                    })
                    .catch((error) => {
                        Toaster({ text: "Unable to perform the open action" });
                        reject(error);
                    });
            });
        });
    }
    closeCommitee(id, event_id) {
        return new Promise((resolve, reject) => {
            let CEID = request.COEID();
            CEID.commitee_id = id;
            CEID.event_id = event_id;
            tcpRequest.close_commitee(CEID, id + "_close").then((JSONData) => {
                serverEventListener
                    .sendRequest(JSONData, id + "_close")
                    .then((reponse) => {
                        stores.CommiteeStore.changeCommiteeOpenedState(
                            event_id,
                            id,
                            false
                        ).then((commitee) => {
                            let Change = {
                                id: IDMaker.make(),
                                title: "Update On Committees",
                                updated: "commitee_closed",
                                event_id: event_id,
                                changed: `Closed ${commitee.name} Committee`,
                                updater: stores.LoginStore.user.phone,
                                new_value: { data: null, new_value: "closed" },
                                date: moment().format(),
                                time: null,
                            };
                            stores.ChangeLogs.addChanges(Change).then(() => {
                                //Toaster({ text: "The commitee was successfully opened !", type: "success" })
                            });
                            resolve();
                        });
                    })
                    .catch((error) => {
                        Toaster({ text: "Unable to perform the close action" });
                        reject(error);
                    });
            });
        });
    }
    removeMembers(id, members, event_id) {
        return new Promise((resolve, reject) => {
            memberPhone = members.map((ele) => ele.phone);
            let removeMember = request.removeCommiteeMember();
            removeMember.commitee_id = id;
            removeMember.event_id = event_id;
            removeMember.member_phone = memberPhone;
            tcpRequest
                .remove_member_from_commitee(removeMember, id + "_members")
                .then((JSON) => {
                    serverEventListener
                        .sendRequest(JSON, id + "_members")
                        .then((response) => {
                            stores.CommiteeStore.removeMember(event_id, id, memberPhone).then(
                                (commitee) => {
                                    let Change = {
                                        id: IDMaker.make(),
                                        title: "Update On Committees",
                                        updated: "removed_commitee_member",
                                        event_id: event_id,
                                        changed: `Removed Members From ${commitee.name} Committee`,
                                        updater: stores.LoginStore.user.phone,
                                        new_value: { data: null, new_value: members },
                                        date: moment().format(),
                                        time: null,
                                    };
                                    stores.ChangeLogs.addChanges(Change).then(() => {
                                        //Toaster({ text: "members where successfully removed !", type: "success" })
                                    });
                                    resolve();
                                }
                            );
                        })
                        .catch((error) => {
                            Toaster({ text: "Unable to perform the remove action" });
                            reject(error);
                        });
                });
        });
    }
    joinCommitee(id, event_id, memberItem) {
        return new Promise((resolve, reject) => {
            let member = request.addCommiteeMember();
            member.commitee_id = id;
            member.event_id = event_id;
            member.member_phone = [memberItem];
            tcpRequest.join_commitee(member, id + "_join").then((JSONData) => {
                serverEventListener
                    .sendRequest(JSONData, id + "_join")
                    .then((response) => {
                        stores.CommiteeStore.addMembers(
                            event_id,
                            id,
                            member.member_phone
                        ).then((commitee) => {
                            let Change = {
                                id: IDMaker.make(),
                                title: "Update On Committees",
                                updated: "added_commitee_member",
                                event_id: event_id,
                                changed: `Joint ${commitee.name} Committee`,
                                updater: stores.LoginStore.user.phone,
                                new_value: {
                                    data: null,
                                    new_value: [stores.LoginStore.user.phone],
                                },
                                date: moment().format(),
                                time: null,
                            };
                            stores.ChangeLogs.addChanges(Change).then(() => {
                                //Toaster({ text: "commitee successfully joint !", type: "success" })
                            });
                            resolve();
                        });
                    })
                    .catch((error) => {
                        Toaster({ text: "Unable to perform the join action" });
                        reject(error);
                    });
            });
        });
    }

    leaveCommitee(id, event_id) {
        return new Promise((resolve, reject) => {
            let member = request.removeCommiteeMember();
            member.commitee_id = id;
            member.event_id = event_id;
            member.member_phone = [stores.LoginStore.user.phone];
            tcpRequest.leave_commitee(member, id + "_leave").then((JSONData) => {
                serverEventListener
                    .sendRequest(JSONData, id + "_leave")
                    .then((response) => {
                        stores.CommiteeStore.removeMember(
                            event_id,
                            id,
                            member.member_phone
                        ).then((commitee) => {
                            let Change = {
                                id: IDMaker.make(),
                                title: "Update On Committees",
                                updated: "removed_commitee_member",
                                event_id: event_id,
                                changed: `Left ${commitee.name} Committee`,
                                updater: stores.LoginStore.user.phone,
                                new_value: {
                                    data: null,
                                    new_value: [stores.LoginStore.user.phone],
                                },
                                date: moment().format(),
                                time: null,
                            };
                            stores.ChangeLogs.addChanges(Change).then(() => {
                                //Toaster({ text: "commitee successfully left !!", type: "success" })
                            });
                            resolve();
                        });
                    })
                    .catch((error) => {
                        Toaster({ text: "Unable to perform the leave action" });
                        reject(error);
                    });
            });
        });
    }
    getCommitee(id) { }
    saveContacts() {
        let contacts = request.many_contact();
        contacts = [
            { phone: "00237609894330", host: "192.168.43.32" },
            { phone: "00237609854563", host: "192.168.43.32" },
            { phone: "00237604385006", host: "192.168.43.32" },
            { phone: "002376043852206", host: "192.168.43.32" },
            { phone: "0023762338523306", host: "192.168.43.32" },
            { phone: "0023762338521235", host: "192.168.43.32" },
            { phone: "00237623398863306", host: "192.168.43.32" },
            { phone: "0023762239523306", host: "192.168.43.32" },
            { phone: "0023762338523309756", host: "192.168.43.32" },
            { phone: "002376233834566873306", host: "192.168.43.32" },
            { phone: "002376233852567798", host: "192.168.43.32" },
            { phone: "00237623312309723306", host: "192.168.43.32" },
            { phone: "00237623385233068765", host: "192.168.43.32" },
            { phone: "0023762338508764323306", host: "192.168.43.32" },
            { phone: "002376233852330698776", host: "192.168.43.32" },
            { phone: "002376233852330098765", host: "192.168.43.32" },
            { phone: "00237623385236478409706", host: "192.168.43.32" },
        ];
        tcpRequest.add_many_contacts(contacts, "conatacter").then((JSONData) => {
            serverEventListener.sendRequest(JSONData).then((response) => {
                console.warn(response, "saved");
            });
        });
    }
    invite(members, event_id) {
        return new Promise((resolve, reject) => {
            let invitees = members.map((ele) => {
                return (
                    ele && {
                        invitee: ele.phone,
                        host: ele.host,
                        invitation: {
                            inviter: stores.LoginStore.user.phone,
                            invitee: ele.phone,
                            invitation_id: IDMaker.make(),
                            host: stores.Session.SessionStore.host,
                            period: moment().format(),
                            event_id: event_id,
                            status: ele.master,
                        },
                    }
                );
            });
            tcpRequest
                .invite_many(invitees, event_id + "_invitees")
                .then((JSONData) => {
                    serverEventListener
                        .sendRequest(JSONData, event_id + "_invitees")
                        .then((SuccessMessage) => {
                            this.storeInvitations(invitees).then((res) => {
                                console.warn(res);
                                //console.warn("invitations gone!!")
                                Toaster({
                                    text: Texts.invitation_was_successfull,
                                    type: "success",
                                });
                                resolve("");
                            });
                        })
                        .catch((error) => {
                            serverEventListener.socket.write = undefined;
                            reject(error);
                        });
                });
        });
    }
    addParticipants(eventID, participants, activity_name) {
        return new Promise((resolve, reject) => {
            let notif = request.Notification();
            notif.notification.title = "New Activity";
            notif.notification.body =
                toTitleCase(stores.LoginStore.user.nickname) +
                " Added you to " +
                activity_name;
            notif.data.activity_id = eventID;
            let updater = stores.LoginStore.user.phone;
            tcpRequest
                .UpdateCurrentEvent(
                    updater,
                    eventID,
                    "adds",
                    participants,
                    eventID + "_adds",
                    notif
                )
                .then((JSONData) => {
                    serverEventListener
                        .sendRequest(JSONData, eventID + "_adds")
                        .then(() => {
                            UpdatesDispatch.dispatchUpdate(request.Updated(eventID, participants, null,
                                Updates.possibilites.add_participant
                            )).then(() => {
                                resolve("ok");
                            })
                        })
                        .catch((error) => {
                            console.warn(error);
                            Toaster({ text: Texts.unable_to_perform_request });
                            resolve();
                        });
                });
        });
    }
    storeInvitations(invitations) {
        return new Promise((resolve, reject) => {
            let func = (invitations) => {
                if (invitations.length <= 0) {
                    return true;
                } else {
                    let element = invitations.pop();
                    element.invitation.type = "sent";
                    element.invitation.sent = true;
                    element.invitation.arrival_date = moment().format("YYYY-MM-DD HH:mm");
                    stores.Invitations.addInvitations(element.invitation).then((mes) => {
                        func(invitations);
                    });
                }
            };
            let rese = func(invitations);
            resolve(rese);
        });
    }
    bandMembers(members, event_id) {
        return new Promise((resolve, reject) => {
            let mem = members.map((ele) => ele.phone);
            tcpRequest
                .UpdateCurrentEvent(
                    stores.LoginStore.user.phone,
                    event_id,
                    "remove",
                    { phone: mem },
                    event_id + "_update"
                )
                .then((JSONData) => {
                    serverEventListener
                        .sendRequest(JSONData, event_id + "_update")
                        .then((response) => {
                            UpdatesDispatch.dispatchUpdate(request.Updated(event_id,
                                mem,
                                null,
                                Updates.possibilites.remove_paricipants)).then(() => {
                                    resolve(mem)
                                })
                        })
                        .catch((e) => {
                            console.warn(e);
                            reject(e);
                        });
                });
        });
    }
    leaveActivity(event_id, phone) {
        return new Promise((resolve, reject) => {
            let leave = request.Leave();
            leave.event_id = event_id;
            leave.phone = [phone];
            tcpRequest.leaveEvent(leave, event_id + "_leave").then((JSONData) => {
                serverEventListener
                    .sendRequest(JSONData, event_id + "_leave")
                    .then(() => {
                        Toaster({ text: Texts.activity_sucessfully_left, type: "success" });
                        UpdatesDispatch.dispatchUpdate(request.Updated(
                            event_id,
                            [phone],
                            null,
                            Updates.possibilites.remove_paricipants
                        )).then(() => {
                            resolve()
                        }).catch((e) => {
                            reject(e);
                        });
                    })
                    .catch((e) => {
                        console.warn(e);
                        reject(e);
                    });
            });
        });
    }
    changeEventMasterState(newState, event_id) {
        return new Promise((resolve, reject) => {
            tcpRequest
                .UpdateCurrentEvent(
                    stores.LoginStore.user.phone,
                    event_id,
                    "master",
                    newState,
                    event_id + "_update_sate"
                )
                .then((JSONData) => {
                    serverEventListener
                        .sendRequest(JSONData, event_id + "_update_sate")
                        .then((response) => {
                            UpdatesDispatch.dispatchUpdate(request.Updated(event_id,
                                newState.master,
                                newState.phone,
                                Updates.possibilites.master)).then(() => {
                                    resolve()
                                })
                        })
                        .catch((e) => {
                            console.warn(e);
                            reject(e);
                        });
                });
        });
    }
    publish(event_id, name) {
        return new Promise((resolve, reject) => {
            const id = event_id + "_publish";
            tcpRequest
                .publishEvent({ event_id: event_id }, id)
                .then((JSONData) => {
                    serverEventListener
                        .sendRequest(JSONData, id)
                        .then(() => {
                            Toaster({ text: Texts.published_successfully, type: "success" });
                            UpdatesDispatch.dispatchUpdate(request.Updated(event_id, null, null,
                                Updates.possibilites.published)).then(() => {
                                    resolve("done");
                                })
                        })
                        .catch((e) => {
                            console.warn(e);
                            reject(e);
                        });
                });
        });
    }
    unpublish(event_id) {
        return new Promise((resolve, reject) => {
            tcpRequest
                .unpublishEvent({ event_id: event_id }, event_id + "_unpublish")
                .then((JSONData) => {
                    serverEventListener
                        .sendRequest(JSONData, event_id + "_unpublish")
                        .then(() => {
                            UpdatesDispatch.dispatchUpdate(request.Updated(event_id, null, null,
                                Updates.possibilites.unpublish)).then(() => {
                                    resolve("done");
                                })
                        });
                })
                .catch((e) => {
                    console.warn(e);
                    reject(e);
                });
        });
    }
    updateDescription(eventID, newDescription) {
        return new Promise((resolve, reject) => {
            tcpRequest
                .UpdateCurrentEvent(
                    stores.LoginStore.user.phone,
                    eventID,
                    "description",
                    newDescription,
                    eventID + "_description"
                )
                .then((JSONData) => {
                    serverEventListener
                        .sendRequest(JSONData, eventID + "_description")
                        .then((response) => {
                            console.warn(response);
                            UpdatesDispatch.dispatchUpdate(request.Updated(eventID,
                                newDescription, null,
                                Updates.possibilites.description)).then(() => {
                                    resolve("ok")
                                })
                        })
                        .catch((e) => {
                            console.warn(e);
                            Toaster({ text: Texts.unable_to_perform_request });
                            reject(e);
                        });
                });
        });
    }
    updateTitle(event, newTitle) {
        return new Promise((resolve, reject) => {
            console.warn(event.about.title !== newTitle, newTitle, event.about.title);
            if (event.about.title !== newTitle) {
                tcpRequest
                    .UpdateCurrentEvent(
                        stores.LoginStore.user.phone,
                        event.id,
                        "title",
                        newTitle,
                        event.id + "_title"
                    )
                    .then((JSONData) => {
                        serverEventListener
                            .sendRequest(JSONData, event.id + "_title")
                            .then((response) => {
                                console.warn(response);
                                stores.Events.updateTitle(event.id,
                                    newTitle, false).then(
                                        (Eve) => {
                                            UpdatesDispatch.dispatchUpdate(request.Updated(event.id,
                                                newTitle, null,
                                                Updates.possibilites.title)).then(() => {
                                                    resolve("ok")
                                                })
                                        }
                                    );
                            })
                            .catch((e) => {
                                reject(e);
                            });
                    });
            } else {
                resolve();
            }
        });
    }
    updateWhoCanManage(event, whoCanManage) {
        return new Promise((resolve, reject) => {
            if (event.who_can_update !== whoCanManage) {
                tcpRequest
                    .UpdateCurrentEvent(
                        stores.LoginStore.user.phone,
                        event.id,
                        "who_can_update",
                        whoCanManage,
                        event.id + "_who_can_update"
                    )
                    .then((JSONData) => {
                        serverEventListener
                            .sendRequest(JSONData, event.id + "_who_can_update")
                            .then((response) => {
                                UpdatesDispatch.dispatchUpdate(request.Updated(event.id,
                                    whoCanManage, null,
                                    Updates.possibilites.who_can_manage
                                )).then(() => {
                                    resolve("ok")
                                })
                            })
                            .catch((e) => {
                                reject(e);
                            });
                    });
            } else {
                resolve();
            }
        });
    }

    updateCloseActivity(event, newState) {
        return new Promise((resolve, reject) => {
            if (event.closed !== newState) {
                let state = !newState ? "open" : "close"
                tcpRequest
                    .UpdateCurrentEvent(
                        stores.LoginStore.user.phone,
                        event.id,
                        state,
                        newState,
                        event.id + "_close"
                    )
                    .then((JSONData) => {
                        serverEventListener
                            .sendRequest(JSONData, event.id + "_close")
                            .then((response) => {
                                UpdatesDispatch.dispatchUpdate(request.Updated
                                    (event.id, newState, null,
                                        Updates.possibilites.closed)).then(() => {
                                            resolve("ok")
                                        })
                            })
                            .catch((e) => {
                                reject(e);
                            });
                    });
            } else {
                resolve();
            }
        });
    }

    applyAllUpdate(event, settings) {
        return new Promise((resolve, reject) => {
            this.updateTitle(JSON.parse(event), settings.title_new)
                .then((t1) => {
                    this.updateWhoCanManage(
                        JSON.parse(event),
                        settings.who_can_update_new
                    )
                        .then((t6) => {
                            event = JSON.parse(event);
                            if (
                                event.public !== settings.public_new &&
                                settings.public_new
                            )
                                this.publish(event.id, event.about.title)
                                    .then((t5) => {
                                        resolve(t1 + + t5 + t6);
                                    })
                                    .catch((e) => {
                                        reject(e);
                                    });
                            else if (
                                event.public !== settings.public_new &&
                                !settings.public_new
                            )
                                this.unpublish(event.id)
                                    .then((t5) => {
                                        resolve(t1 + t5 + t6);
                                    })
                                    .catch((e) => {
                                        reject(e);
                                    });
                            else resolve(t1 + t6);
                        })
                        .catch((e) => {
                            reject(e);
                        });

                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    changeBackground(event_id, background) {
        return new Promise((resolve, reject) => {
            tcpRequest
                .UpdateCurrentEvent(
                    stores.LoginStore.user.phone,
                    event_id,
                    "background",
                    background,
                    event_id + "_background"
                )
                .then((JSONData) => {
                    serverEventListener
                        .sendRequest(JSONData, event_id + "_background")
                        .then((response) => {
                            UpdatesDispatch.dispatchUpdate(request.Updated(
                                event_id,
                                background,
                                null,
                                Updates.possibilites.background)).then(() => {
                                    resolve("ok")
                                })
                        })
                        .catch((error) => {
                            console.warn(error);
                            reject(error);
                        });
                });
        });
    }
    createHighlight(newHighlight, activityName) {
        return new Promise((resolve, reject) => {
            tcpRequest
                .addHighlight(newHighlight, newHighlight.id)
                .then((JSONData) => {
                    serverEventListener
                        .sendRequest(JSONData, newHighlight.id)
                        .then((response) => {
                            UpdatesDispatch.dispatchUpdate(request.Updated(newHighlight.event_id, newHighlight, null,
                                Updates.possibilites.new_highlight)).then(() => {
                                    resolve("ok")
                                })
                        })
                        .catch((error) => {
                            Toaster({
                                text: Texts.unable_to_perform_request,
                                position: "top",
                            });
                            reject(error);
                        });
                });
        });
    }
    updateHighlightTitle(newTitle, oldTitle, highlightID, eventID) {
        return new Promise((resolve, reject) => {
            if (newTitle !== oldTitle) {
                let higlightTitle = request.HUpdate();
                higlightTitle.action = "title";
                higlightTitle.event_id = eventID;
                higlightTitle.h_id = highlightID;
                higlightTitle.new_data = newTitle;
                tcpRequest
                    .updateHighlight(higlightTitle, highlightID + "_title")
                    .then((JSONData) => {
                        serverEventListener
                            .sendRequest(JSONData, highlightID + "_title")
                            .then((response) => {
                                UpdatesDispatch.dispatchUpdate(request.Updated(eventID,
                                    {
                                        new_title: higlightTitle.new_data,
                                        highlight_id: higlightTitle.h_id
                                    }, null,
                                    Updates.possibilites.highlight_title)).then(() => {
                                        resolve("ok")
                                    })
                            })
                            .catch((error) => {
                                console.warn(error);
                                reject(error);
                            });
                    });
            } else {
                resolve();
            }
        });
    }
    updateHightlightPublicState(
        newPublicState,
        oldPublicState,
        highlightID,
        eventID
    ) {
        return new Promise((resolve, reject) => {
            if (newPublicState !== oldPublicState) {
                let higlightTitle = request.HUpdate();
                higlightTitle.action = "public_state";
                higlightTitle.event_id = eventID;
                higlightTitle.h_id = highlightID;
                higlightTitle.new_data = newPublicState;
                tcpRequest
                    .updateHighlight(higlightTitle, highlightID + "_public_state")
                    .then((JSONData) => {
                        serverEventListener
                            .sendRequest(JSONData, highlightID + "_public_state")
                            .then((response) => {
                                UpdatesDispatch.dispatchUpdate(request.Updated(eventID, {
                                    highlight_id: higlightTitle.h_id,
                                    public_state: higlightTitle.new_data
                                }, null, Updates.possibilites.highlight_public_state)).then(() => {
                                    resolve("ok")
                                })
                            })
                            .catch((error) => {
                                console.warn(error);
                                reject(error);
                            });
                    });
            } else {
                resolve();
            }
        });
    }
    updateHighlightDescription(newDescription, oldDes, highlightID, eventID) {
        return new Promise((resolve, reject) => {
            if (oldDes !== newDescription) {
                let higlightTitle = request.HUpdate();
                higlightTitle.action = "description";
                higlightTitle.event_id = eventID;
                higlightTitle.h_id = highlightID;
                higlightTitle.new_data = newDescription;
                tcpRequest
                    .updateHighlight(higlightTitle, highlightID + "_description")
                    .then((JSONData) => {
                        serverEventListener
                            .sendRequest(JSONData, highlightID + "_description")
                            .then((response) => {
                                UpdatesDispatch.dispatchUpdate(request.Updated(eventID, {
                                    highlight_id: higlightTitle.h_id,
                                    new_description: higlightTitle.new_data
                                },
                                    null,
                                    Updates.possibilites.highlight_update_description)).
                                    then(() => {
                                        resolve("ok")
                                    })
                            })
                            .catch((error) => {
                                console.warn(error);
                                reject(error);
                            });
                    });
            } else {
                resolve();
            }
        });
    }
    updateHighlightURL(newURL, oldURL, highlightID, eventID) {
        return new Promise((resolve, reject) => {
            if (!isEqual(newURL, oldURL)) {
                let newHighlightURL = request.HUpdate();
                newHighlightURL.h_id = highlightID;
                newHighlightURL.event_id = eventID;
                newHighlightURL.action = "url";
                newHighlightURL.new_data = newURL;
                tcpRequest
                    .updateHighlight(newHighlightURL, highlightID + "_url")
                    .then((JSONData) => {
                        serverEventListener
                            .sendRequest(JSONData, highlightID + "_url")
                            .then((response) => {
                                UpdatesDispatch.dispatchUpdate(request.Updated(eventID, {
                                    highlight_id: newHighlightURL.h_id,
                                    new_url: newHighlightURL.new_data
                                }, null,
                                    Updates.possibilites.highlight_update_url)).then(() => {
                                        resolve()
                                    })
                            })
                            .catch((error) => {
                                console.warn(error);
                                reject(error);
                            });
                    });
            } else {
                resolve();
            }
        });
    }
    updateCount = 0;
    updatedhighlight = null;
    applyAllHighlightsUpdate(newHighlight, highlight) {
        console.warn("here again 8", JSON.parse(highlight).title);
        return new Promise((resolve, reject) => {
            this.updateHighlightTitle(
                newHighlight.title,
                JSON.parse(highlight).title,
                newHighlight.id,
                newHighlight.event_id
            ).then((t1) => {
                this.updateHighlightDescription(
                    newHighlight.description,
                    JSON.parse(highlight).description,
                    newHighlight.id,
                    newHighlight.event_id
                )
                    .then((t2) => {
                        this.updateHighlightURL(
                            newHighlight.url,
                            JSON.parse(highlight).url,
                            newHighlight.id,
                            newHighlight.event_id
                        )
                            .then((t3) => {
                                this.updateHightlightPublicState(
                                    newHighlight.public_state,
                                    JSON.parse(highlight).public_state,
                                    newHighlight.id,
                                    newHighlight.event_id
                                )
                                    .then((t4) => {
                                        resolve(t1 + t2 + t3 + t4);
                                    })
                                    .catch((r) => {
                                        reject(r);
                                    });
                            })
                            .catch((r) => {
                                reject(r);
                            });
                    })
                    .catch((r) => {
                        reject(r);
                    })
                    .catch((r) => {
                        reject(r);
                    });
            });
        });
    }
    deleteHighlight(highlightID, eventID) {
        return new Promise((resolve, reject) => {
            let HEID = request.HEID();
            HEID.event_id = eventID;
            HEID.h_id = highlightID;
            tcpRequest
                .deleteHighlight(HEID, highlightID + "_delete")
                .then((JSONData) => {
                    serverEventListener
                        .sendRequest(JSONData, highlightID + "_delete")
                        .then((response) => {
                            UpdatesDispatch.dispatchUpdate(request.Updated(eventID, highlightID
                                , null, Updates.possibilites.highlight_deleted)).then(() => {
                                    resolve("ok")
                                })
                        })
                        .catch((error) => {
                            if (error.data.data === no_data_with_such_key) {
                                stores.Highlights.removeHighlight(eventID, highlightID).then(
                                    (Highlight) => {
                                        stores.Events.removeHighlight(
                                            eventID,
                                            highlightID
                                        ).then((res) => {
                                            resolve("ok")
                                         });
                                    }
                                );
                            }
                            Toaster({ text: Texts.unable_to_perform_request });
                            reject(error);
                        });
                });
        });
    }
    restoreHighlight(highlight) {
        return new Promise((resolve, reject) => {
            tcpRequest
                .restoreHighlight(highlight, highlight.id + "_highlight")
                .then((JSONData) => {
                    serverEventListener
                        .sendRequest(JSONData, highlight.id + "_highlight")
                        .then((response) => {
                            stores.Highlights.addHighlight(
                                highlight.event_id,
                                highlight
                            ).then(() => {
                                stores.Events.addHighlight(
                                    highlight.event_id,
                                    highlight.id,
                                    false
                                ).then(() => {
                                    let Change = {
                                        id: IDMaker.make(),
                                        title: `Update On Main Activity`,
                                        updated: "highlight_restored",
                                        event_id: highlight.event_id,
                                        updater: stores.LoginStore.user.phone,
                                        changed: `Restored ${highlight.title} Post`,
                                        new_value: { data: null, new_value: highlight },
                                        date: moment().format(),
                                        time: null,
                                    };
                                    stores.ChangeLogs.addChanges(Change).then((res) => { });
                                    resolve();
                                });
                            });
                        })
                        .catch((error) => {
                            console.warn(error);
                            Toaster({ text: "Unable To Perform Request" });
                            reject(error);
                        });
                });
        });
    }
    unsyncActivity(event) {
        return new Promise((resolve, reject) => {
            CalendarServe.saveEvent({ ...event, period: null }).then(() => {
                stores.Events.markAsCalendared(event.id, null, null).then(() => {
                    resolve();
                });
            });
        });
    }
}

const Requester = new Request();
export default Requester;
