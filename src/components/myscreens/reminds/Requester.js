import tcpRequest from "../../../services/tcpRequestData";
import EventListener from "../../../services/severEventListener";
import stores from "../../../stores";
import request from "../../../services/requestObjects";
import { isEqual, differenceWith, uniqBy } from "lodash";
import moment from "moment";
import { findIndex } from "lodash";
import CalendarServe from "../../../services/CalendarService";
import MainUpdater from "../../../services/mainUpdater";
import toTitleCase from "../../../services/toTitle";
import Toaster from "../../../services/Toaster";
import IDMaker from "../../../services/IdMaker";
import Texts from "../../../meta/text";
import notification_channels from "../eventChat/notifications_channels";
import UpdatesDispatch from '../../../services/updatesDispatcher';
import Updates from '../../../services/updates-posibilites';
import replies from "../eventChat/reply_extern";
class Requester {
  constructor() {
    this.notif_channel = notification_channels.reminds;
  }
  saveToCanlendar(eventID, remind, alarms, newRemindName) {
    console.warn("remind members is: ", remind.members)
    return new Promise((resolve, reject) => {
      if (
        findIndex(remind.members, { phone: stores.LoginStore.user.phone }) >= 0
      ) {
        CalendarServe.saveEvent(remind, alarms, "reminds", newRemindName).then(
          (calendar_id) => {
            stores.Reminds.updateCalendarID(
              eventID,
              { remind_id: remind.id, calendar_id: calendar_id },
              alarms
            ).then(() => {
              resolve(calendar_id);
            });
          }
        );
      } else {
        resolve()
      }
    });
  }
  CreateRemind(Remind, activityName) {
    return new Promise((resolve, reject) => {
      tcpRequest
        .addRemind(Remind, Remind.event_id + "_currence")
        .then((JSONData) => {
          EventListener.sendRequest(JSONData, Remind.event_id + "_currence")
            .then((response) => {
              UpdatesDispatch.dispatchUpdate(request.Updated(Remind.event_id,
                Remind,
                null,
                Updates.possibilites.remind_added
              )).then(() => {
                resolve("ok")
              })
            })
            .catch(() => {
              Toaster({ text: Texts.unable_to_perform_request });
              reject();
            });
        });
    });
  }
  updateRemindName(newName, oldName, remindID, eventID) {
    return new Promise((resolve, reject) => {
      if (newName !== oldName) {
        let newRemindName = request.RemindUdate();
        newRemindName.action = "title";
        newRemindName.data = newName;
        newRemindName.event_id = eventID;
        newRemindName.remind_id = remindID;
        tcpRequest
          .updateRemind(newRemindName, remindID + "_name")
          .then((JSONData) => {
            EventListener.sendRequest(JSONData, remindID + "_name")
              .then((response) => {
                UpdatesDispatch.dispatchUpdate(request.Updated(eventID, {
                  remind_id: remindID,
                  title: newName,
                }, null, Updates.possibilites.remind_title_updated)).then(() => {
                  resolve("ok")
                })
              })
              .catch((error) => {
                Toaster({ text: Texts.unable_to_perform_request });
                console.warn(error);
                reject(error);
              });
          });
      } else {
        resolve();
      }
    });
  }
  updateRemindDescription(newDescription, oldDesc, remindID, eventID) {
    return new Promise((resolve, reject) => {
      if (newDescription !== oldDesc) {
        let newRemindName = request.RemindUdate();
        newRemindName.action = "description";
        newRemindName.data = newDescription;
        newRemindName.event_id = eventID;
        newRemindName.remind_id = remindID;
        const id = remindID + "_description"
        tcpRequest
          .updateRemind(newRemindName, id)
          .then((JSONData) => {
            EventListener.sendRequest(JSONData, id).then(() => {
              UpdatesDispatch.dispatchUpdate(request.Updated(eventID, {
                remind_id: remindID,
                description: newDescription,
              }, null, Updates.possibilites.remind_description_updated)).then(() => {
                resolve("ok")
              })
            }).catch((error) => {
              Toaster({ text: Texts.unable_to_perform_request });
              console.warn(error);
              reject(error);
            });
          })
      } else {
        resolve();
      }
    });
  }
  confirm(Member, remindID, eventID) {
    return new Promise((resolve, reject) => {
      let newRemindName = request.RemindUdate();
      newRemindName.action = "confirm";
      newRemindName.data = Member;
      newRemindName.event_id = eventID;
      newRemindName.remind_id = remindID;
      const id = remindID + "_confirm"
      tcpRequest
        .updateRemind(newRemindName, id)
        .then((JSONData) => {
          EventListener.sendRequest(JSONData, id).then(() => {
            UpdatesDispatch.dispatchUpdate(request.Updated(eventID, {
              remind_id: remindID,
              confirmed: Member,
            }, null, Updates.possibilites.confirm)).then(() => {
              resolve("ok")
            })
          }).catch((error) => {
            Toaster({ text: Texts.unable_to_perform_request });
            console.warn(error);
            reject(error);
          });
        })
    });
  }
  updateRemindRecurrentcyConfig(newConfigs, oldConfig, remindID, eventID) {
    return new Promise((resolve, reject) => {
      if (
        (typeof newConfigs === "string" && newConfigs !== oldConfig) ||
        (typeof newConfigs === "object" && !isEqual(newConfigs, oldConfig))
      ) {
        let newRemindName = request.RemindUdate();
        newRemindName.action = "recurrence";
        newRemindName.data = newConfigs;
        newRemindName.event_id = eventID;
        newRemindName.remind_id = remindID;
        tcpRequest
          .updateRemind(newRemindName, remindID + "_recurrence")
          .then((JSONData) => {
            EventListener.sendRequest(JSONData, remindID + "_recurrence")
              .then((reponse) => {
                UpdatesDispatch.dispatchUpdate(request.Updated(eventID, {
                  remind_id: remindID,
                  recursive_frequency: newConfigs,
                }, null, Updates.possibilites.remind_recurrence)).then(() => {
                  resolve("ok")
                })
              })
              .catch((error) => {
                Toaster({ text: Texts.unable_to_perform_request });
                console.warn(error);
                reject(error);
              });
          });
      } else {
        resolve();
      }
    });
  }
  updateRemindPublicState(newState, oldState, remindID, eventID) {
    return new Promise((resolve, reject) => {
      if (newState !== oldState) {
        let newRemindName = request.RemindUdate();
        newRemindName.action = "public_state";
        newRemindName.data = newState;
        newRemindName.event_id = eventID;
        newRemindName.remind_id = remindID;
        tcpRequest
          .updateRemind(newRemindName, remindID + "_public_state")
          .then((JSONData) => {
            EventListener.sendRequest(JSONData, remindID + "_public_state")
              .then((response) => {
                UpdatesDispatch.dispatchUpdate(request.Updated(eventID,
                  { remind_id: remindID, status: newState },
                  null,
                  Updates.possibilites.remind_public_state)).then(() => {
                    resolve("ok")
                  })
              })
              .catch((error) => {
                Toaster({ text: Texts.unable_to_perform_request });
                console.warn(error);
                reject(error);
              });
          });
      } else {
        resolve();
      }
    });
  }
  updateMustRepot(newMustReport, oldMust, remindID, eventID) {
    return new Promise((resolve, reject) => {
      if (newMustReport !== oldMust) {
        let newRemindName = request.RemindUdate();
        newRemindName.action = "must_report";
        newRemindName.data = newMustReport;
        newRemindName.event_id = eventID;
        newRemindName.remind_id = remindID;
        tcpRequest
          .updateRemind(newRemindName, remindID + "_must_report")
          .then((JSONData) => {
            EventListener.sendRequest(JSONData, remindID + "_must_report")
              .then((response) => {
                UpdatesDispatch.dispatchUpdate(request.Updated(eventID,
                  { remind_id: remindID, must_report: newMustReport }, null,
                  Updates.possibilites.must_report)).then(() => {
                    resolve("ok")
                  })
              })
              .catch((error) => {
                Toaster({ text: Texts.unable_to_perform_request });
                console.warn(error);
                reject(error);
              });
          });
      } else {
        resolve();
      }
    });
  }
  updatePeriod(newPeriod, oldPer, remindID, eventID) {
    return new Promise((resolve, reject) => {
      if (newPeriod !== oldPer) {
        let newRemindName = request.RemindUdate();
        newRemindName.action = "period";
        newRemindName.data = newPeriod;
        newRemindName.event_id = eventID;
        newRemindName.remind_id = remindID;
        tcpRequest
          .updateRemind(newRemindName, remindID + "_period")
          .then((JSONData) => {
            EventListener.sendRequest(JSONData, remindID + "_period")
              .then((response) => {
                UpdatesDispatch.dispatchUpdate(request.Updated(eventID, {
                  remind_id: remindID,
                  period: newPeriod
                }, null,
                  Updates.possibilites.remind_period_updated)).then(() => {
                    resolve("ok")
                  })
              })
              .catch((error) => {
                Toaster({ text: Texts.unable_to_perform_request });
                reject(error);
              });
          });
      } else {
        resolve();
      }
    });
  }
  updateRemindAlarms(newExtra, oldExtra, remindID, eventID) {
    return new Promise((resolve, reject) => {
      if (
        newExtra &&
        oldExtra &&
        differenceWith(newExtra.alarms, oldExtra.alarms, isEqual).length !==
        differenceWith(oldExtra.alarms, newExtra.alarms, isEqual).length
      ) {
        let newRemindName = request.RemindUdate();
        newRemindName.action = "remind_alarms";
        newRemindName.data = { alarms: newExtra.alarms, date: newExtra.date };
        newRemindName.event_id = eventID;
        newRemindName.remind_id = remindID;
        tcpRequest
          .updateRemind(newRemindName, remindID + "_alarms")
          .then((JSONData) => {
            EventListener.sendRequest(JSONData, remindID + "_alarms").then(
              (response) => {
                newRemindName.alarms = newRemindName.data
                UpdatesDispatch.dispatchUpdate(request.Updated(eventID,
                  newRemindName,
                  null,
                  Updates.possibilites.remind_alarms)).then(() => {
                    resolve("ok")
                  })
              }
            );
          })
          .catch((e) => {
            Toaster({ text: Texts.unable_to_perform_request });
            reject();
          });
      } else {
        resolve();
      }
    });
  }
  updateRemindLocation(newLocation, oldLocation, remindID, eventID) {
    return new Promise((resolve, reject) => {
      if (newLocation !== oldLocation) {
        let newRemindName = request.RemindUdate();
        newRemindName.action = "location";
        newRemindName.data = newLocation;
        newRemindName.event_id = eventID;
        newRemindName.remind_id = remindID;
        const id = remindID + "_location"
        tcpRequest
          .updateRemind(newRemindName, id)
          .then((JSONData) => {
            EventListener.sendRequest(JSONData, id).then(() => {
              UpdatesDispatch.dispatchUpdate(request.Updated(eventID,
                { remind_id: remindID, location: newLocation }, null,
                Updates.possibilites.remind_location)).then(() => {
                  resolve("ok")
                })
            })
              .catch(() => {
                Toaster({ text: Texts.unable_to_perform_request });
                reject();
              });
          });
      } else {
        resolve();
      }
    });
  }

  updateRemindURL(newURL, oldULR, remindID, eventID) {
    return new Promise((resolve, reject) => {
      if (!isEqual(newURL, oldULR)) {
        let newRemindName = request.RemindUdate();
        newRemindName.action = "remind_url";
        newRemindName.data = newURL;
        newRemindName.event_id = eventID;
        newRemindName.remind_id = remindID;
        const id = remindID + "_remind_url"
        tcpRequest
          .updateRemind(newRemindName, id)
          .then((JSONData) => {
            EventListener.sendRequest(JSONData, id).then(() => {
              UpdatesDispatch.dispatchUpdate(request.Updated(eventID,
                { url: newURL, remind_id: remindID },
                null,
                Updates.possibilites.remind_url)).then(() => {
                  resolve("ok")
                })
            })
              .catch(() => {
                Toaster({ text: Texts.unable_to_perform_request });
                reject();
              });
          });
      } else {
        resolve();
      }
    });
  }
  addMembersToRemote(remind, activity_name, persist) {
    this.yourName = toTitleCase(stores.LoginStore.user.nickname);
    this.shortName = this.yourName.split(" ")[0];
    return new Promise((resolve, reject) => {
      let newRemindName = request.RemindUdate();
      let notif = request.Notification();
      notif.notification.body = activity_name
        ? `${this.shortName} @ ${activity_name} ${Texts.have_add_members_to_the_program}`
        : `${this.yourName} ${Texts.added_members}`;
      notif.notification.android_channel_id = this.notif_channel;
      notif.notification.title = `${Texts.new_members_in} ${remind.title} ${Texts.program}`;
      notif.data.activity_id = remind.event_id;
      notif.data.reply = { type: replies.member,[replies.member]:{
          phone: remind.members[0].phone
        } 
      }
      notif.data.remind_id = remind.id;
      newRemindName.action = "add_members";
      const id = remind.id + "_add_members"
      if (stores.States.requestExists(id) && persist) {
        const data = EventListener.returnRequestData(stores.States.getRequest(id)).data
        remind.members = uniqBy([...data, ...remind.members], "phone");
      }
      newRemindName.data = remind.members;
      newRemindName.event_id = remind.event_id;
      newRemindName.remind_id = remind.id;
      newRemindName.notif = notif;
      tcpRequest
        .updateRemind(newRemindName, id)
        .then((JSONData) => {
          EventListener.sendRequest(JSONData, id, persist).then(
            (response) => {
              resolve();
            }
          ).catch(err => reject(err));
        });
    });
  }
  concludeAddMembers(remind, alarms) {
    return new Promise((resolve, reject) => {
      UpdatesDispatch.dispatchUpdate(request.Updated(remind.event_id, {
        members: remind.members,
        remind_id: remind.id,
        alarms
      }, null, Updates.possibilites.members_added_to_remind)).then(() => {
        resolve("ok")
      })
    })
  }
  addMembers(remind, alarms, activity_name) {
    this.yourName = toTitleCase(stores.LoginStore.user.nickname);
    this.shortName = this.yourName.split(" ")[0];
    return new Promise((resolve, reject) => {
      const canPersistRequest = remind.members.length == 1 &&
        remind.members[0].phone == stores.LoginStore.user.phone
      if (canPersistRequest) {
        this.addMembersToRemote(remind, activity_name, true)
        this.concludeAddMembers(remind, alarms).then(() => {
          resolve()
        })
      } else {
        this.addMembersToRemote(remind, alarms, activity_name, false).then(() => {
          this.concludeAddMembers(remind, alarms).then(() => {
            resolve()
          })
        }).catch((error) => {
          Toaster({ text: Texts.unable_to_perform_request });
          console.warn(error);
          reject(error);
        });
      }
    })
  }
  removeMembersRemote(members, remindID, eventID, perist) {
    return new Promise((resolve, reject) => {
      const id = remindID + "_remove_members"
      if (stores.States.requestExists(id)) {
        console.warn("concatinating members to be removed")
        const oldMembers = EventListener.returnRequestData(stores.States.states.requests[id]).data
        members = uniq([...oldMembers, ...members])
        console.warn(members)
      }
      let newRemindName = request.RemindUdate();
      newRemindName.action = "remove_members";
      newRemindName.data = members;
      newRemindName.event_id = eventID;
      newRemindName.remind_id = remindID;
      tcpRequest
        .updateRemind(newRemindName, id)
        .then((JSONData) => {
          EventListener.sendRequest(JSONData, id, perist)
            .then(() => {
              resolve()
            }).catch((err) => {
              reject(err)
            })
        }).catch(err => {
          reject(err)
        })
    })
  }
  concludeRemoveMembers(members, remindID, eventID) {
    return new Promise((resolve, reject) => {
      UpdatesDispatch.dispatchUpdate(request.Updated(eventID, {
        members: members,
        remind_id: remindID,
      }, null, Updates.possibilites.members_removed_from_remind)).then(() => {
        resolve("ok")
      })
    })
  }
  removeMembers(members, remindID, eventID) {
    return new Promise((resolve, reject) => {
      const canPersistRequest = members.length == 1 && members[0] === stores.LoginStore.user.phone
      if (canPersistRequest) {
        this.removeMembersRemote(members, remindID, eventID, true)
        this.concludeRemoveMembers(members, remindID, eventID).then(() => {
          resolve()
        })
      } else {
        this.removeMembersRemote(members, remindID, eventID, false).then(() => {
          this.concludeRemoveMembers(members, remindID, eventID).then(() => {
            resolve()
          })
        }).catch((error) => {
          Toaster({ text: Texts.unable_to_perform_request });
          console.warn(error);
          reject(error);
        })
      }
    })
  }
  performAllUpdates(previousRemind, newRemind) {
    return new Promise((resolve, reject) => {
      this.updateRemindName(
        newRemind.title,
        JSON.parse(previousRemind).title,
        newRemind.id,
        newRemind.event_id
      )
        .then((t1) => {
          this.updateRemindDescription(
            newRemind.description,
            JSON.parse(previousRemind).description,
            newRemind.id,
            newRemind.event_id
          )
            .then((t2) => {
              this.updatePeriod(
                newRemind.period,
                JSON.parse(previousRemind).period,
                newRemind.id,
                newRemind.event_id
              )
                .then((t3) => {
                  this.updateRemindPublicState(
                    newRemind.status,
                    JSON.parse(previousRemind).status,
                    newRemind.id,
                    newRemind.event_id
                  )
                    .then((t4) => {
                      this.updateRemindRecurrentcyConfig(
                        newRemind.recursive_frequency,
                        JSON.parse(previousRemind).recursive_frequency,
                        newRemind.id,
                        newRemind.event_id
                      )
                        .then((t5) => {
                          this.updateRemindLocation(
                            newRemind.location,
                            JSON.parse(previousRemind).location,
                            newRemind.id,
                            newRemind.event_id
                          )
                            .then((t6) => {
                              this.updateRemindURL(
                                newRemind.remind_url,
                                JSON.parse(previousRemind).remind_url,
                                newRemind.id,
                                newRemind.event_id
                              )
                                .then((t7) => {
                                  this.updateMustRepot(
                                    newRemind.must_report,
                                    JSON.parse(previousRemind).must_report,
                                    newRemind.id,
                                    newRemind.event_id
                                  )
                                    .then((t8) => {
                                      this.updateRemindAlarms(
                                        newRemind.extra,
                                        JSON.parse(previousRemind).extra,
                                        newRemind.id,
                                        newRemind.event_id
                                      )
                                        .then((t9) => {
                                          resolve(
                                            t1 +
                                            t2 +
                                            t3 +
                                            t4 +
                                            t5 +
                                            t6 +
                                            t7 +
                                            t8 +
                                            t9
                                          );
                                        })
                                        .catch((r) => {
                                          reject(r);
                                        });
                                    })
                                    .catch((r) => {
                                      reject(r);
                                    });
                                })
                                .catch(() => {
                                  reject(r);
                                });
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
                    });
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
        });
    });
  }
  markAsDoneRemote(member, remind, activity_name) {
    this.yourName = toTitleCase(stores.LoginStore.user.nickname);
    this.shortName = this.yourName.split(" ")[0];
    return new Promise((resolve, reject) => {
      let newRemindName = request.RemindUdate();
      let notif = request.Notification();
      (notif.notification.title = `${remind.title}; ${Texts.completed_program}`),
        (notif.notification.body = activity_name
          ? `${this.shortName} @ ${activity_name} ${Texts.have_completed_the_program}`
          : `${this.yourName} ${Texts.have_completed_the_program}`);
      notif.notification.android_channel_id = this.notif_channel;
      notif.data.activity_id = remind.event_id;
      notif.data.reply = {
        type: replies.done,
        [replies.done]: {
          phone: member[0].phone,
          status: {
            date: member[0].status.date
          }
        }
      }
      notif.data.remind_id = remind.id;
      newRemindName.action = "mark_as_done";
      newRemindName.data = member;
      newRemindName.event_id = remind.event_id;
      newRemindName.remind_id = remind.id;
      newRemindName.notif = notif;
      const id = remind.id + '_' + member[0].status.date + '_' + "_mark_as_done"
      tcpRequest
        .updateRemind(newRemindName, id)
        .then((JSONData) => {
          EventListener.sendRequest(JSONData, id, true)
            .then((response) => {
              resolve("ok")
            }).catch(error => {
              reject(error)
            })
        })
    })
  }
  markAsDone(member, remind, alams, activity_name) {
    this.yourName = toTitleCase(stores.LoginStore.user.nickname);
    this.shortName = this.yourName.split(" ")[0];
    return new Promise((resolve, reject) => {
      this.markAsDoneRemote(member, remind, activity_name)
      UpdatesDispatch.dispatchUpdate(request.Updated(remind.event_id, {
        donners: member,
        remind_id: remind.id,
      }, null, Updates.possibilites.mark_as_done)).then(() => {
        resolve("ok")
      })
    })
      .catch((e) => {
        Toaster({ text: Texts.unable_to_perform_request });
        reject();
      });
  }
  deleteRemind(remindID, eventID) {
    return new Promise((resolve, reject) => {
      let newRemindName = request.RemindUdate();
      newRemindName.action = "delete";
      newRemindName.data = null;
      newRemindName.event_id = eventID;
      newRemindName.remind_id = remindID;
      tcpRequest
        .updateRemind(newRemindName, remindID + "_delete")
        .then((JSONData) => {
          EventListener.sendRequest(JSONData, remindID + "_delete")
            .then((response) => {
              UpdatesDispatch.dispatchUpdate(request.Updated(eventID, remindID, null,
                Updates.possibilites.remind_deleted)).then(() => {
                  resolve("ok")
                })
            })
            .catch(() => {
              Toaster({ text: Texts.unable_to_perform_request });
              reject("delete remind error");
            });
        });
    });
  }
  restoreRemind(remind) {
    return new Promise((resolve, reject) => {
      let newRemindName = request.RemindUdate();
      newRemindName.action = "restore";
      newRemindName.data = { ...remind, alams: undefined };
      newRemindName.event_id = remind.event_id;
      newRemindName.remind_id = remind.id;
      tcpRequest
        .updateRemind(newRemindName, remind.id + "_restore")
        .then((JSONData) => {
          EventListener.sendRequest(JSONData, remind.id + "_restore")
            .then((response) => {
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
                    time: null,
                  };
                  this.saveToCanlendar(remind.event_id, remind, null);
                  stores.ChangeLogs.addChanges(Change).then(() => { });
                  resolve("ok");
                });
              });
            })
            .catch((er) => {
              reject(er);
            });
        });
    });
  }
}

const RemindRequest = new Requester();
export default RemindRequest;
