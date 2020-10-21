import stores from "../stores";
import GState from "../stores/globalState";
import Getter from "./Getter"
import requestObjects from "./requestObjects";
import tcpRequestData from "./tcpRequestData";
import emitter from "./eventEmiter";
import serverEventListener from "./severEventListener"
import { find, findIndex, drop, reject, forEach } from "lodash";
import moment from "moment"
import CalendarServe from './CalendarService';
import { format } from './recurrenceConfigs';
import request from "./requestObjects";
import MainUpdater from './mainUpdater';
import RemindRequest from '../components/myscreens/reminds/Requester';
import IDMaker from './IdMaker';
import UserInfoDispatcher from './UserInfoDispatcher';
import Texts from '../meta/text';
class UpdatesDispatcher {
  constructor() { }
  dispatchUpdates(updates, done) {
    if (updates.length <= 0) {
      console.warn("finishing ...")
      done()
    } else {
      let update = updates.pop()
      this.dispatchUpdate(update).then(() => {
        console.warn("dipatching ", update)
        this.dispatchUpdates(updates, done)
      });
    }

  }
  dispatchUpdate(update, done) {
    console.warn("dispatching update !")
    return this.UpdatePossibilities[update.update](update);
  }
  infomCurrentRoom(Change, commitee, event_id) {
    emitter.emit(`event_updated_${event_id}`, Change, commitee)
    if (Change.changed.toLowerCase().includes('post')) {
      emitter.emit(`refresh-highlights_${event_id}`)
    }
  }
  applyToAllCommitees(ids, participant, e) {
    if (ids.length <= 0) {
      return "done"
    } else {
      let id = ids.pop()
      stores.CommiteeStore.replaceCommiteeParticipant(e, id, participant).then((c) => {
        this.applyToAllCommitees(ids, participant, e)
      })
    }
  }
  UpdatePossibilities = {
    user_info_changed: update => UserInfoDispatcher.updateContactUserInfo(update.updater, update.new_value),
    added_as_contact: (update) => UserInfoDispatcher.saveNewContact({ phone: update.addedphone, host: update.new_value }),
    removed_as_contact: update => UserInfoDispatcher.removeContact(update.addedphone),
    typing_message: update => MainUpdater.sayTyping(update.new_value.committee_id, update.new_value.data),
    message_reaction: update => MainUpdater.reactToMessage(update.new_value.data.message_id,
      update.new_value.committee_id,
      update.event_id,
      update.new_value.data.reaction),
    played_message: update => MainUpdater.
      playedMessage(update.new_value.data.message_id,
        update.new_value.committee_id,
        update.event_id,
        update.new_value.data.player),
    new_message: update => MainUpdater.saveMessage(update.new_value.data,
      update.event_id, update.new_value.
      committee_id),
    received_message: update => MainUpdater.receiveMessage(update.new_value.data.message_id,
      update.new_value.committee_id,
      update.new_value.data.recieved),
    update_message: update => MainUpdater.updateMessage(update.new_value.data.message_id,
      update.new_value.committee_id,
      update.event_id, update.new_value.data.text),
    deleted_message: update => MainUpdater.deleteMessage(update.new_value.message_id,
      update.new_value.committee_id,
      update.event),
    seen_message: update => MainUpdater.seenMessage(update.new_value.data.message_id,
      update.new_value.committee_id,
      update.event_id, update.new_value.seer),
    typing_message: update => MainUpdater.sayTyping(update.new_value.committee_id,
      update.new_value.data.typer),
    blocked: update => MainUpdater.blocked(update.updater),
    un_blocked: update => MainUpdater.unBlocked(update.updater),
    muted: update => MainUpdater.muted(update.updater),
    un_muted: updater => MainUpdater.unMuted(update.updater),
    title: update => {
      return new Promise((resolve, reject) => {
        stores.Events.updateTitle(update.event_id, update.new_value, true).then((Eve) => {
          let Change = {
            id: IDMaker.make(),
            updated: "title",
            event_id: update.event_id,
            updater: update.updater,
            title: Texts.update_on_main_activity,
            changed: Texts.changed_the_title_to,
            new_value: { data: null, new_value: update.new_value },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Eve, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          GState.eventUpdated = true;
          resolve();
        });
      });
    },

    background: update => {
      return new Promise((resolve, reject) => {
        stores.Events.updateBackground(update.event_id, update.new_value, true).then(() => {
          let Change = {
            id: IDMaker.make(),
            title: Texts.update_on_main_activity,
            updated: "background",
            event_id: update.event_id,
            updater: update.updater,
            changed: update.new_value ? Texts.changed_background_photo :
              Texts.removed_the_background_of_th_activity,
            new_value: { data: null, new_value: update.new_value },
            date: update.date,
            time: update.time
          };
          this.infomCurrentRoom(Change, Change, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          GState.eventUpdated = true;
          resolve();
        });
      });
    },

    description: update => {
      return new Promise((resolve, reject) => {
        stores.Events.updateDescription(
          update.event_id,
          update.new_value,
          true
        ).then((Eve) => {
          let Change = {
            id: IDMaker.make(),
            title: Texts.update_on_main_activity,
            updated: "description",
            updater: update.updater,
            event_id: update.event_id,
            changed: update.new_value ? Texts.changed_the_description_the_activity :
              Texts.removed_the_description_of_the_activity,
            new_value: { data: null, new_value: update.new_value },
            date: update.data,
            time: null
          }
          this.infomCurrentRoom(Change, Eve, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          GState.eventUpdated = true;
          resolve('ok')
        })
      });
    },
    period: update => {
      return new Promise((resolve, reject) => {
        stores.Events.updatePeriod(update.event_id, update.new_value, true).then((Eve, calID) => {
          let Change = {
            id: IDMaker.make(),
            title: "Updates On Main Activity",
            updated: "period",
            updater: update.updater,
            event_id: update.event_id,
            changed: update.new_value ? "Changed The Scheduled Time Of The Activity To: " : "Removed The Date Of The Activity",
            new_value: { data: null, new_value: update.new_value ? moment(update.new_value).format("dddd, MMMM Do YYYY, h:mm:ss a") : null },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Eve, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          Eve.calendar_id ? CalendarServe.saveEvent({ ...Eve, calendar_id: JSON.parse(calID).cal_id }, Eve.alarms).then(() => {

          }) : null
          GState.eventUpdated = true;
          resolve();
        })
      });

    },
    closed: update => {
      return new Promise((resolve, reject) => {
        stores.Events.openClose(update.event_id, update.new_value, true).then(() => {
          let Change = {
            id: IDMaker.make(),
            title: Texts.update_on_main_activity,
            updated: "close",
            event_id: update.event_id,
            updater: update.updater,
            changed: update.new_value == false ? Texts.opnened_the_main_activity : Texts.closed_activity,
            new_value: { data: null, new_value: null },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Change, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          GState.eventUpdated = true
          resolve("ok")
        })
      })
    },
    string: update => {
      return new Promise((resolve, reject) => {
        stores.Events.updateLocation(
          update.event_id,
          update.new_value,
          true
        ).then((Eve) => {
          let Change = {
            id: IDMaker.make(),
            title: "Updates On Main Activity",
            updated: "location",
            updater: update.updater,
            event_id: update.event_id,
            changed: update.new_value ? "Changed The Location Of The Activity To: " : "Removed The Location Of The Activity",
            new_value: { data: null, new_value: update.new_value },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Eve, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          GState.eventUpdated = true;
          resolve('ok')
        });
      });
    },
    calendar_id: update => {
      return new Promise((resolve, reject) => {
        stores.Events.updateCalendarID(update.event_id, update.new_value, true).then(() => {
          let Change = {
            id: IDMaker.make(),
            title: "Updates On Main Activity",
            updated: "calendar_id",
            updater: update.updater,
            event_id: update.event_id,
            changed: "Changed The Calendar The Main Activity To",
            new_value: { data: null, new_value: update.new_value },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Change, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          GState.eventUpdated = true
          resolve("ok")
        })
      })
    },
    who_can_manage: update => {
      return new Promise((resolve, reject) => {
        stores.Events.updateWhoCanManage(update.event_id, update.new_value, true).then(Eve => {
          let Change = {
            id: IDMaker.make(),
            title: Texts.update_on_main_activity,
            updated: "who_can_update",
            event_id: update.event_id,
            updater: update.updater,
            changed: Texts.changed_the_manage_previledge_of_the_activity,
            new_value: { data: null, new_value: update.new_value },
            date: update.date,
            time: null
          }
          stores.ChangeLogs.addChanges(Change)
          resolve()
          this.infomCurrentRoom(Change, Eve, update.event_id)
        })
      })
    },
    recurrency_config: update => {
      return new Promise((resolve, reject) => {
        stores.Events.updateRecurrency(update.event_id, update.new_value, true).then((Eve) => {
          let Change = {
            id: IDMaker.make(),
            title: Texts.update_on_main_activity,
            updated: "recurrency",
            event_id: update.event_id,
            updater: update.updater,
            changed: "Changed The Recurrency Configuration of the Activity",
            new_value: { data: null, new_value: update.new_value },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Eve, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          Eve.calendar_id ? CalendarServe.saveEvent(Eve, Eve.alarms).then(() => {

          }) : null
          GState.eventUpdated = true
          resolve("ok")
        })
      })
    },
    published: update => {
      return new Promise((resolve, reject) => {
        let EventID = requestObjects.EventID();
        EventID.event_id = update.event_id;
        stores.Events.publishEvent(update.event_id, true).then(() => {
          let Change = {
            title: Texts.update_on_main_activity,
            event_id: update.event_id,
            changed: Texts.shared_the_activity_to_his_contacts,
            updater: update.updater,
            new_value: { data: null, new_value: true },
            date: update.date,
            time: update.time
          };
          this.infomCurrentRoom(Change, update.event_id, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          GState.eventUpdated = true;
          resolve();
        })
      }
      );
    },
    adds: update => {
      return new Promise((resolve, reject) => {
        MainUpdater.addParticipants(update.event_id,
          update.new_value,
          update.updater, "adds",
          update.date).then(Change => {
            this.infomCurrentRoom(Change, update.event_id, update.event_id)
            resolve()
          })
      })
    },
    shared_item: update => {
      return new Promise((resolve, reject) => {
        MainUpdater.saveShares(update.event_id, update.new_value,
          update.updater, update.date).then((change) => {
            this.infomCurrentRoom(change, update.new_value, update.event_id)
            resolve()
          })
      })
    },
    following: update => {
      return new Promise((resolve, reject) => {
        stores.Contacts.addFollower(update.updater, "").then(() => {
          console.warn("following successfully stored")
          resolve()
        })
      })
    },
    unfollowing: update => {
      return new Promise((resolve, reject) => {
        stores.Contacts.removeFollower(update.updater).then(() => {
          console.warn("unfollowing successfully stored")
          resolve()
        })
      })
    },
    unpublished: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          title: Texts.update_on_main_activity,
          event_id: update.event_id,
          changed: Texts.unpublished_the_activity,
          updater: update.updater,
          id: IDMaker.make(),
          new_value: { data: null, new_value: false },
          date: update.date,
          time: update.time
        };
        stores.Events.unpublishEvent(update.event_id, true).then(
          () => {
            this.infomCurrentRoom(Change, Change, update.event_id)
            stores.ChangeLogs.addChanges(Change)
            GState.eventUpdated = true;
            resolve();
          });
      });
    },
    url: update => {
      return new Promise((resolve, reject) => {
        stores.Events.loadCurrentEvent(update.event_id).then(Event => {
          let Change = {
            event_id: update.event_id,
            changed: "New Event Location",
            updater: update.updater,
            old_value: Event.location,
            new_value: {
              string: Event.location.string,
              url: update.new_value
            },
            date: update.date,
            time: update.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.updateLocation(
              update.event_id,
              {
                string: Event.location.string,
                url: update.new_value
              },
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    host: update => {
      return new Promise((resolve, reject) => {
        stores.Events.loadCurrentEvent(update.event_id).then(Event => {
          let Participant = find(Event.participants, {
            phone: update.addedphone
          });
          Participant.host = update.new_value;
          stores.Events.updateEventParticipant(
            update.event_id,
            Participant,
            true
          ).then(() => {
            GState.eventUpdated = true;
            resolve();
          });
        });
      });
    },
    master: update => {
      return new Promise((resolve, reject) => {
        stores.Events.loadCurrentEvent(update.event_id).then(Event => {
          let Participant = find(Event.participant, {
            phone: update.addedphone
          });
          if (Participant) {
            let newParti = { ...Participant, master: update.new_value }
            stores.Events.updateEventParticipant(
              update.event_id,
              newParti,
              true
            ).then((newEvent) => {
              //console.warn(newEvent.commitee)
              this.applyToAllCommitees(newEvent.commitee, newParti, newEvent)
              let Change = {
                title: Texts.update_on_main_activity,
                event_id: update.event_id,
                changed: Texts.changed_participant_status,
                updater: update.updater,
                old_value: Participant.master,
                new_value: { data: null, new_value: [newParti] },
                date: update.date,
                time: update.time
              };
              this.infomCurrentRoom(Change, newEvent, update.event_id)
              stores.ChangeLogs.addChanges(Change)
              GState.eventUpdated = true;
              resolve();
            });
          } else {
            console.warn('participant does not exists');
            reject()
          }
        })
      });
    },
    removed: update => {
      return new Promise((resolve, reject) => {
        stores.Events.removeParticipant(
          update.event_id,
          update.new_value,
          true
        ).then((Event) => {
          let Change = {
            title: Texts.update_on_main_activity,
            event_id: update.event_id,
            changed: update.updater === update.new_value ?
              Texts.left_the_activity :
              Texts.removed_participants_from_activity,
            updater: update.updater,
            new_value: {
              data: null, new_value:
                Array.isArray(update.new_value) ?
                  update.new_value :
                  [update.new_value]
            },
            date: update.date,
            time: update.time
          };
          this.infomCurrentRoom(Change, Event, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          GState.eventUpdated = true;
          resolve();
        });
      });
    },
    likes: update => {
      return new Promise((resolve, reject) => {
        switch (update.addedphone) {
          case "like":
            stores.Likes.like(update.event_id, update.updater, true).then(() => {
              stores.Events.likeEvent(update.event_id, true).then(() => {
                GState.eventUpdated = true;
                emitter.emit(`liked_${update.event_id}`) //TODO this signal is beign listen to in the Module current_events>public_event>likes
                resolve();
              });
            });
            break;
        }
      });
    },
    unlikes: update => {
      return new Promise((resolve, reject) => {
        switch (update.addedphone) {
          case "unlike":
            stores.Likes.unlike(update.new_value, update.updater, true).then(() => {
              stores.Events.unlikeEvent(update.event_id).then(() => {
                GState.eventUpdated = true;
                emitter.emit(`liked_${update.event_id}`) //TODO this signal is beign listen to in the Module current_events>public_event>likes
                resolve();
              });
            });
            break;
        }
      });
    },

    must_contribute_update: update => {
      return new Promise((resolve, reject) => {
        stores.Events.loadCurrentEvent(update.event_id).then(Event => {
          let Change = {
            event_id: update.event_id,
            changed: "New Must Contribute Amount",
            updater: update.updater,
            old_value: Event.must_contribute,
            new_value: update.new_value,
            date: update.date,
            time: update.time
          };
          stores.ChangeLogs.addChanges(Change).then(() => {
            stores.Events.addMustToContribute(
              update.event_id,
              update.new_value,
              true
            ).then(() => {
              GState.eventUpdated = true;
              resolve();
            });
          });
        });
      });
    },
    new_highlight: update => {
      return new Promise((resolve, reject) => {
        let RequestObject = requestObjects.HID();
        RequestObject.h_id = update.new_value;
        stores.Highlights.loadHighlight(update.event_id, update.new_value).then((data) => {
          const Highlight = { data }
          Highlight.data = Array.isArray(Highlight.data) ? Highlight.data[0] : Highlight.data
          stores.Highlights.addHighlight(update.event_id, Highlight.data).then(() => {
            stores.Events.addHighlight(
              Highlight.data.event_id,
              Highlight.data.id
            ).then(() => {
              let Change = {
                id: IDMaker.make(),
                title: Texts.update_on_main_activity,
                updated: "add_highlight",
                event_id: update.event_id,
                updater: update.updater,
                changed: Texts.added_highlight,
                new_value: { data: null, new_value: Highlight.data },
                date: update.date,
                time: null
              }
              this.infomCurrentRoom(Change, Highlight, update.event_id)
              stores.ChangeLogs.addChanges(Change)
              GState.newHightlight = true;
              GState.eventUpdated = true;
              resolve("ok")
            })
          });
        }).catch(() => {
          resolve()
          //!! heyyy case that highlight doesn't exists please think of handling this.
          //!! a case where this scenario can occur is when the user add a highlight and imediately deletes it 
              //!! a case where this scenario can occur is when the user add a highlight and imediately deletes it 
          //!! a case where this scenario can occur is when the user add a highlight and imediately deletes it 
          //!! such that when offline users will received their updates,they will be receiving of and 
          //!! that doesn't exists. 
              //!! that doesn't exists. 
          //!! that doesn't exists. 
        })
      });
    },

    highlight_update_description: update => {
      return new Promise((resolve, reject) => {
        stores.Highlights.updateHighlightDescription(update.event_id,
          {
            id: update.new_value.highlight_id,
            description: update.new_value.new_description
          },
          true
        ).then((Highlight) => {
          let Change = {
            id: IDMaker.make(),
            title: `${Texts.updates_on} ${Highlight.title} (${Texts.star})`,
            updated: "highlight_decription",
            event_id: update.event_id,
            updater: update.updater,
            changed: update.new_value.new_description ? `${Texts.changed_the_content} ${Highlight.title}` :
              `${Texts.removed_the_content} ${Highlight.title}`,
            new_value: { data: null, new_value: update.new_value.new_description },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Highlight, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          GState.eventUpdated = true;
          resolve("ok")
        });
      });
    },
    highlight_update_url: update => {
      return new Promise((resolve, reject) => {
        stores.Highlights.updateHighlightUrl(update.event_id,
          {
            id: update.new_value.highlight_id,
            url: update.new_value.new_url
          },
          true
        ).then((Highlight) => {
          let Change = {
            id: IDMaker.make(),
            title: `${Texts.updates_on} ${Highlight.title} (${Texts.star})`,
            updated: "highlight_url",
            event_id: update.event_id,
            updater: update.updater,
            changed: `${Texts.changed_the_media} ${Highlight.title}`,
            new_value: { data: null, new_value: update.new_value.new_url },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Highlight, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          GState.eventUpdated = true;
          resolve("ok")
        });
      });
    },
    highlight_update_title: update => {
      return new Promise((resolve, reject) => {
        stores.Highlights.updateHighlightTitle(update.event_id,
          {
            id: update.new_value.highlight_id,
            title: update.new_value.new_title
          },
          true
        ).then((Highlight) => {
          let Change = {
            id: IDMaker.make(),
            title: `${Texts.updates_on} ${Highlight.title} (${Texts.star})`,
            updated: "highlight_title",
            event_id: update.event_id,
            updater: update.updater,
            changed: update.new_value.new_title ? `${Texts.changed_title} ${Highlight.title} ${Texts.to} :` :
              `${Texts.removed_the_title} ${Highlight.title}`,
            new_value: { data: null, new_value: update.new_value.new_title },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, Highlight, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          GState.eventUpdated = true;
          resolve("ok")
        });
      });
    },
    highlight_public_state: update => {
      return new Promise((resolve, reject) => {
        stores.Highlights.updateHighlightPublicState(update.event_id, update.new_value).then((highlight) => {
          let Change = {
            id: IDMaker.make(),
            title: `${Texts.updates_on} ${highlight.title} (${Texts.star})`,
            updated: "highlight_public_state",
            event_id: update.event_id,
            updater: update.updater,
            changed: `${Texts.changed_the_privacy_level} ${highlight.title}  ${Texts.to}: `,
            new_value: {
              data: null,
              new_value: update.new_value.public_State
            },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, highlight, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          GState.eventUpdated = true
          resolve("ok")
        })
      })
    },
    highlight_deleted: update => {
      return new Promise((resolve, reject) => {
        stores.Highlights.removeHighlight(update.event_id, update.new_value).then((Highlight) => {
          stores.Events.removeHighlight(
            update.event_id,
            update.new_value
          ).then(() => {
            let Change = {
              id: IDMaker.make(),
              title: Texts.update_on_main_activity,
              updated: "highlight_delete",
              event_id: update.event_id,
              updater: update.updater,
              changed: `${Texts.deleted} ${Highlight.title} (${Texts.star})`,
              new_value: { data: null, new_value: Highlight },
              date: update.date,
              time: null
            }
            this.infomCurrentRoom(Change, Highlight, update.event_id)
            stores.ChangeLogs.addChanges(Change)
            GState.eventUpdated = true;
            resolve("ok")
          });
        });
      });
    },
    restored_highlight: update => {
      return new Promise((resolve, reject) => {
        stores.Highlights.addHighlight(update.event_id, update.new_value).then(() => {
          stores.Events.addHighlight(update.event_id, update.new_value.id).then(() => {
            let Change = {
              id: IDMaker.make(),
              title: Texts.update_on_main_activity,
              updated: "highlight_restored",
              event_id: update.event_id,
              updater: update.updater,
              changed: `${Texts.restored} ${update.new_value.title} (${Texts.star})`,
              new_value: { data: null, new_value: update.new_value },
              date: update.date,
              time: null
            }
            this.infomCurrentRoom(Change, update.new_value, update.event_id)
            stores.ChangeLogs.addChanges(Change)
            GState.eventUpdated = true;
            resolve("ok")
          })
        })
      })
    },
    vote_added: update => {
      return new Promise((resolve, reject) => {
        let VoteID = requestObjects.VID();
        VoteID.vote_id = update.new_value;
        tcpRequestData.getVote(VoteID, update.new_value + "_get").then(JSONData => {
          serverEventListener.sendRequest(JSONData, update.new_value + '_get').then(Vote => {
            if (Vote.data && Vote.data !== 'empty') {
              let vote = Array.isArray(Vote.data) ? Vote.data[0] : Vote.data
              console.warn(vote)
              stores.Votes.addVote(update.event_id, vote).then(() => {
                stores.Events.addVote(vote.event_id, vote.id).then(() => {
                  stores.CommiteeStore.imIInThisCommttee(update.event_id, stores.LoginStore.user.phone,
                    vote.committee_id).then((state) => {
                      console.warn(state)
                      if (state || vote.published === 'public') {
                        let Change = {
                          id: IDMaker.make(),
                          event_id: update.event_id,
                          updated: 'new_vote',
                          changed: `Added ${vote.title} Vote`,
                          title: `Update On Main Activity`,
                          updater: update.updater,
                          new_value: { data: null, new_value: vote.title },
                          date: update.date,
                          time: null
                        };
                        stores.ChangeLogs.addChanges(Change).then(() => {
                          this.infomCurrentRoom(Change, vote, update.event_id)
                          resolve()
                        })
                      } else {
                        resolve()
                      }
                    })
                  GState.newVote = true;
                  GState.eventUpdated = true;
                  resolve();
                });
              });
            } else {
              let vote = { ...request.Vote(), title: 'Deleted Vote', event_id: update.event_id, id: update.new_value }
              stores.Votes.addVote(vote.event_id, vote).then(() => {
                stores.Events.addVote(vote.event_id, Vote.id).then(() => {
                })
              })
            }
          });
        });
      });
    },
    vote_deleted: update => {
      return new Promise((resolve, reject) => {
        stores.Votes.removeVote(update.event_id, update.new_value).then((vote) => {
          stores.Events.removeVote(update.event_id, update.new_value).then(
            () => {
              stores.CommiteeStore.imIInThisCommttee(update.event_id, stores.LoginStore.user.phone,
                vote.committee_id).then((state) => {
                  if (state || vote.published === 'public') {
                    let Change = {
                      id: IDMaker.make(),
                      event_id: update.event_id,
                      updated: 'vote_deleted',
                      title: `Update On Main Activity`,
                      changed: `Deleted ${vote.title} vote`,
                      updater: update.updater,
                      new_value: { data: null, new_value: vote },
                      date: update.date,
                      time: null
                    };
                    stores.ChangeLogs.addChanges(Change).then(() => {
                      this.infomCurrentRoom(Change, vote, update.event_id)
                      resolve()
                    })
                  } else {
                    resolve()
                  }
                })
            }
          );
        });
      });
    },
    restored_vote: update => new Promise((resolve, reject) => {
      stores.Votes.addVote(update.event_id, update.new_value).then(() => {
        stores.Events.addVote(update.event_id, update.new_value.id).then(() => {
          stores.CommiteeStore.imIInThisCommttee(update.event_id, stores.LoginStore.user.phone, update.new_value.committee_id).then((state) => {
            if (update.published === 'public' || state) {
              let Change = {
                id: IDMaker.make(),
                event_id: update.event_id,
                updated: 'vote_restored',
                title: `Update on ${update.new_value.title} vote`,
                changed: `Restored ${update.new_value.title} vote`,
                updater: update.updater,
                new_value: { data: null, new_value: update.new_value.id },
                date: update.date,
                time: null
              };
              stores.ChangeLogs.addChanges(Change).then(() => {
                this.infomCurrentRoom(Change, update.new_value, update.event_id);
                resolve();
              });
            }
            else {
              resolve();
            }
          });
        });
      });
    }),
    vote_published: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Vote Published",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Votes.PublishVote(update.event_id, update.new_value).then(() => {
            GState.eventUpdated = true;
            resolve();
          });
        });
      });
    },
    vote: update => {
      return new Promise((resolve, reject) => {
        stores.Votes.vote(update.event_id, update.new_value).then((vote) => {
          stores.CommiteeStore.imIInThisCommttee(update.event_id, stores.LoginStore.user.phone,
            vote.committee_id).then((state) => {
              console.warn(state, "--")
              if (state || vote.published === 'public') {
                let Change = {
                  id: IDMaker.make(),
                  event_id: update.event_id,
                  updated: 'voted',
                  title: `Update on ${vote.title} vote`,
                  changed: `Voted ${vote.title} vote`,
                  updater: update.updater,
                  new_value: { data: null, new_value: null },
                  date: update.date,
                  time: null
                };
                this.infomCurrentRoom(Change, vote, update.event_id)
              }
            })
          resolve()
        })
      })
    },
    vote_period_updated: update => {
      return new Promise((resolve, reject) => {
        stores.Votes.UpdateVotePeriod(update.event_id, update.new_value).then((vote) => {
          stores.CommiteeStore.imIInThisCommttee(update.event_id, stores.LoginStore.user.phone,
            vote.committee_id).then((state) => {
              if (state || votes.published === 'public') {
                let Change = {
                  id: IDMaker.make(),
                  event_id: update.event_id,
                  updated: 'vote_period',
                  title: `Update on ${vote.title} vote`,
                  changed: update.new_value.new_period && vote.period ? `Changed Voting End Date of ${vote.title} Vote To: ` :
                    update.new_value.new_period && !vote.period ? `Added Voting End Date To ${vote.title} Vote : ` :
                      `Remove Voting End Date From ${vote.title} Vote`,
                  updater: update.updater,
                  new_value: {
                    data: null,
                    new_value: update.new_value.period ? moment(update.new_value.period).format(format) : null
                  },
                  date: update.date,
                  time: null
                };
                stores.ChangeLogs.addChanges(Change)
                this.infomCurrentRoom(Change, vote, update.event_id)
                resolve()
              } else {
                resolve()
              }
            })
        })
      });
    },
    vote_description_updated: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Vote Description Changed",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Votes.UpdateVoteDescription(update.event_id,
            {
              id: update.new_value.vote_id,
              description: update.new_value.description
            },
            true
          ).then(() => {
            GState.eventUpdated = true;
            resolve();
          });
        });
      });
    },
    vote_title_updated: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Vote Title Updated",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Votes.updateVoteTitle(update.event_id,
            { id: update.new_value.vote_id, title: update.new_value.title },
            true
          ).then(() => {
            GState.eventUpdated = true;
            resolve();
          });
        });
      });
    },
    added_vote_option: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "New Vote Option",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Votes.addVoteOption(update.event_id,
            { id: update.new_value.vote_id, option: update.new_value.option },
            true
          ).then(() => {
            GState.eventUpdated = true;
            resolve();
          });
        });
      });
    },
    removed_vote_option: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Removed Vote Option",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Votes.removeVoteOption(update.event_id,
            update.new_value.vote_id,
            update.new_value.vote_option_name_updated,
            true
          ).then(() => {
            GState.eventUpdated = true;
            resolve();
          });
        });
      });
    },
    vote_option_name_updated: update => {
      return new Promise((resolve, reject) => {
        let Change = {
          event_id: update.event_id,
          changed: "Vote Option Name Changed",
          updater: update.updater,
          new_value: update.new_value,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Votes.UpdateVoteOptionName(update.event_id,
            update.new_value.vote_id,
            update.new_value.option_name,
            update.new_value.new_name,
            true
          ).then(() => {
            GState.eventUpdated = true;
            resolve();
          });
        });
      });
    },
    added: update => {
      return new Promise((resolve, reject) => {
        let Participant = requestObjects.Participant();
        Participant.phone = update.updater;
        Participant.master = update.new_value.master;
        Participant.host = update.new_value.host;
        Participant.status = update.new_value.status;
        let Change = {
          event_id: update.event_id,
          changed: Texts.new_participant,
          updater: update.new_value.inviter,
          new_value: Participant,
          date: update.date,
          time: update.time
        };
        stores.ChangeLogs.addChanges(Change).then(() => {
          stores.Events.addParticipant(update.event_id, Participant, true)
          GState.eventUpdated = true;
          resolve();
        });
      })

    },
    joint: update => {
      return new Promise((resolve, reject) => {
        let Participant = requestObjects.Participant();
        Participant.phone = update.updater;
        Participant.host = update.new_value.host;
        Participant.status = update.new_value.status;
        let Change = {
          id: IDMaker.make(),
          title: Texts.update_on_main_activity,
          event_id: update.event_id,
          updated: 'joint',
          changed: Texts.join_activity,
          updater: update.new_value.inviter,
          new_value: { data: null, new_value: [Participant] },
          date: update.date,
          time: update.time
        };
        console.warn("activity joint")
        stores.Events.addParticipant(update.event_id, Participant, true).then(
          (event) => {
            this.infomCurrentRoom(Change, event, update.event_id)
            stores.ChangeLogs.addChanges(Change)
            resolve();
          });
      });
    },
    remind_added: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.loadRemind(update.event_id, update.new_value).then((Remind) => {
          stores.Reminds.addReminds(update.event_id, Remind).then((rem) => {
            stores.Events.addRemind(update.event_id, Remind.id).then(() => {
              let Change = {
                id: IDMaker.make(),
                title: Texts.update_on_main_activity,
                updated: "added_remind",
                updater: update.updater,
                event_id: update.event_id,
                changed: Texts.added_remind,
                new_value: { data: update.new_value, new_value: Remind.title },
                date: update.date,
                time: null
              }
              stores.States.addNewReminds(update.event_id, Remind.id)
              this.infomCurrentRoom(Change, Remind, update.event_id)
              RemindRequest.saveToCanlendar(update.event_id,
                Remind, Remind.extra && Remind.extra.alarms,
                Remind.title).then(() => {
                  stores.ChangeLogs.addChanges(Change)
                })
              GState.newRemind = true;
              GState.eventUpdated = true;
              resolve('ok')
            });
          });
        }).catch(() => {
          resolve()
          //!! heyyy case that remind doesn't exists please think of handling this.
          //!! a case where this scenario can occur is when the user add a remind and imediately deletes it 
              //!! a case where this scenario can occur is when the user add a remind and imediately deletes it 
          //!! a case where this scenario can occur is when the user add a remind and imediately deletes it 
          //!! such that when offline users will received their updates,they will be receiving of and 
          //!! that doesn't exists. 
              //!! that doesn't exists. 
          //!! that doesn't exists. 
        })
      });
    },
    remind_location: update => {
      return new Promise((resolve, reject) => {
        MainUpdater.updateRemindLocation(update.event_id,
          update.new_value.remind_id,
          update.new_value.location,
          update.date, update.updater).then(Change => {
            this.infomCurrentRoom(Change, update.new_value, update.event_id)
          })
      })
    },
    remind_url: update => {
      return new Promise((resolve, reject) => {
        MainUpdater.updateRemindURL(update.event_id,
          update.new_value.remind_id,
          update.new_value.url,
          update.date, update.updater).then(Change => {
            resolve()
            this.infomCurrentRoom(Change, update.new_value, update.event_id)
          })
      })
    },
    remind_period_updated: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.updatePeriod(update.event_id, update.new_value, true).then((oldRemind) => {
          let Change = {
            id: IDMaker.make(),
            title: `${Texts.updates_on} ${oldRemind.title} (${Texts.remind})`,
            updated: `remind_period_updated`,
            updater: update.updater,
            event_id: update.event_id,
            changed: Texts.change_the_date_of_remind,
            new_value: { data: update.new_value.remind_id, new_value: update.new_value.period },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, oldRemind, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            RemindRequest.saveToCanlendar(oldRemind.event_id, {
              ...oldRemind, period:
                update.new_value.period
            }, null).then(() => {

            })
          })
          resolve('ok')
        });
      });
    },
    remind_description_updated: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.updateDescription(update.event_id,
          update.new_value, true).then((oldRemind) => {
            let Change = {
              id: IDMaker.make(),
              title: `${Texts.updates_on} ${oldRemind.title} (${Texts.remind})`,
              updated: `remind_description_updated`,
              updater: update.updater,
              event_id: update.event_id,
              changed: update.new_value.description ? oldRemind.description ? Texts.changed_remind_description :
                Texts.added_description_to_the_program : Texts.removed_description_from_program,
              new_value: {
                data: update.new_value.remind_id,
                new_value: update.new_value.description
              },
              date: update.date,
              time: null
            }
            this.infomCurrentRoom(Change, oldRemind, update.event_id)
            stores.ChangeLogs.addChanges(Change)
            GState.eventUpdated = true;
            resolve('ok')
          });
      });
    },
    remind_alarms: update => {
      return MainUpdater.updateRemindAlarms(update.event_id,
        update.new_value.remind_id,
        update.new_value.data,
        update.date,
        update.updater)
    },
    remind_title_updated: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.updateTitle(update.event_id, update.new_value, true).
          then((oldRemind) => {
            let Change = {
              id: IDMaker.make(),
              title: `${Texts.updates_on} ${oldRemind.title} (${Texts.remind})`,
              updated: `remind_title_updated`,
              updater: update.updater,
              event_id: update.event_id,
              changed: Texts.changed_the_title_of_the_program,
              new_value: {
                data: update.new_value.remind_id,
                new_value: update.new_value.title
              },
              date: update.date,
              time: null
            }
            this.infomCurrentRoom(Change, oldRemind, update.event_id)
            stores.ChangeLogs.addChanges(Change)
            GState.eventUpdated = true;
            resolve('ok')
          });
      });
    },
    remind_deleted: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.removeRemind(update.event_id, update.new_value, true).then((oldRemind) => {
          stores.Events.removeRemind(update.event_id, update.new_value, false)
          let Change = {
            id: IDMaker.make(),
            title: Texts.update_on_main_activity,
            updated: `delete_remind`,
            updater: update.updater,
            event_id: update.event_id,
            changed: `${Texts.deleted} ${oldRemind.title} (${Texts.remind}) `,
            new_value: { data: update.new_value, new_value: oldRemind },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, oldRemind, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          RemindRequest.saveToCanlendar(oldRemind.event_id, { ...oldRemind, period: null }, null)
          resolve('ok')
        });

      });
    },
    restored_remind: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.addReminds(update.event_id, update.new_value.remind).then(() => {
          stores.Events.addRemind(update.new_value.remind.id,
            update.new_value.remind.event_id, true).then(() => {
              let Change = {
                id: IDMaker.make(),
                title: Texts.update_on_main_activity,
                updated: `restored_remind`,
                updater: update.updater,
                event_id: update.event_id,
                changed: `${Texts.restored} ${update.new_value.remind.title} (${Texts.remind})`,
                new_value: { data: update.new_value.remind.id, new_value: null },
                date: update.date,
                time: null
              }
              this.infomCurrentRoom(Change, update.new_value.remind,
                update.event_id)
              stores.ChangeLogs.addChanges(Change).then(() => {
                RemindRequest.saveToCanlendar(update.new_value.remind.event_id, update.new_value.remind, null).
                  then(calendar_id => {
                  })
              })
              resolve()
            })
        })
      })
    },
    remind_public_state: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.updateStatus(update.event_id, update.new_value, true).then((oldRemind) => {
          let Change = {
            id: IDMaker.make(),
            title: `${Texts.updates_on} ${oldRemind.title} (${Texts.remind})`,
            updated: `remind_public_state_updated`,
            updater: update.updater,
            event_id: update.event_id,
            changed: Texts.changed_the_privacy_level_of_program,
            new_value: {
              data: update.new_value.remind_id,
              new_value: update.new_value.status
            },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, oldRemind, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          GState.eventUpdated = true;
          resolve('ok')
        });
      });
    },
    remind_recurrence: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.updateRecursiveFrequency(update.event_id, update.new_value, true).then((oldRemind) => {
          let Change = {
            id: IDMaker.make(),
            title: `${Texts.updates_on} ${oldRemind.title} (${Texts.remind})`,
            updated: `remind_reurrence_config_updated`,
            updater: update.updater,
            event_id: update.event_id,
            changed: Texts.changed_recurrence_config,
            new_value: {
              data: update.new_value.remind_id,
              new_value: update.new_value.recursive_frequency
            },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, oldRemind, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            RemindRequest.saveToCanlendar(oldRemind.event_id, {
              ...oldRemind,
              recursive_frequency: update.new_value.recursive_frequency
            },
              null).then(() => {
                GState.eventUpdated = true;
              })
          })
          resolve('ok')
        });
      });
    },
    members_added_to_remind: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.addMembers(update.event_id, update.new_value, true).then(oldRemind => {
          let Change = {
            id: IDMaker.make(),
            title: `${Texts.updates_on} ${oldRemind.title} (${Texts.remind})`,
            updated: `remind_member_added`,
            updater: update.updater,
            event_id: update.event_id,
            changed: Texts.assigned_to,
            new_value: {
              data: update.new_value.remind_id,
              new_value: update.new_value.members
            },
            date: update.date,
            time: null
          }
          RemindRequest.saveToCanlendar(oldRemind.event_id,
            oldRemind, (update.new_value.alarms || (oldRemind.extra &&
              oldRemind.extra.alams))).then(calendar_id => {
                this.infomCurrentRoom(Change, oldRemind, update.event_id)
                stores.ChangeLogs.addChanges(Change).then(() => {

                })
                resolve('ok')
              })
        });
      });
    },
    members_removed_from_remind: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.removeMember(update.event_id, update.new_value, true).
          then(oldRemind => {
            let Change = {
              id: IDMaker.make(),
              title: `${Texts.updates_on} ${oldRemind.title} (${Texts.remind})`,
              updated: `remind_member_removed`,
              updater: update.updater,
              event_id: update.event_id,
              changed: Texts.unassigned_from,
              new_value: {
                data: update.new_value.remind_id, new_value:
                  update.new_value.members.map(ele => { return { phone: ele } })
              },
              date: update.date,
              time: null
            }
            this.infomCurrentRoom(Change, oldRemind, update.event_id)
            RemindRequest.saveToCanlendar(oldRemind.event_id, { ...oldRemind, period: null }, null).then(() => {
              stores.ChangeLogs.addChanges(Change).then(() => {

              })
              resolve('ok')
            })
          })
      })
    },
    mark_as_done: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.makeAsDone(update.event_id, update.new_value, true).then(oldRemind => {
          let Change = {
            id: IDMaker.make(),
            title: `${Texts.updates_on} ${oldRemind.title} (${Texts.remind})`,
            updated: `remind_marked_as_done`,
            updater: update.updater,
            event_id: update.event_id,
            changed: Texts.marked_remind_as_done,
            new_value: {
              data: update.new_value.remind_id,
              new_value: update.new_value.donners
            },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, oldRemind, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          GState.eventUpdated = true;
          resolve('ok')
        })
      })
    },
    confirm: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.confirm(update.event_id, update.new_value, true).then(oldRemind => {
          let Change = {
            id: IDMaker.make(),
            title: `${Texts.updates_on} ${oldRemind.title} (${Texts.remind})`,
            updated: `remind_confirmed`,
            updater: update.updater,
            event_id: update.event_id,
            changed: Texts.confirmed_the_program_completion,
            new_value: {
              data: update.new_value.remind_id,
              new_value: update.new_value.confirmed
            },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, oldRemind, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          GState.eventUpdated = true;
          resolve('ok')
        })
      })
    },
    must_report: update => {
      return new Promise((resolve, reject) => {
        stores.Reminds.updateRequestReportOnComplete(update.event_id, update.new_value, true).then(oldRemind => {
          let Change = {
            id: IDMaker.make(),
            title: `${Texts.updates_on} ${oldRemind.title} (${Texts.remind})`,
            updated: `remind_confirmed`,
            updater: update.updater,
            event_id: update.event_id,
            changed: Texts.changed_the_must_report_status,
            new_value: {
              data: update.new_value.remind_id,
              new_value: update.new_value.must_report
            },
            date: update.date,
            time: null
          }
          this.infomCurrentRoom(Change, oldRemind, update.event_id)
          stores.ChangeLogs.addChanges(Change)
          GState.eventUpdated = true;
          resolve('ok')
        })
      })
    },
    new_commitee: update => {
      return new Promise((resolve, reject) => {
        stores.CommiteeStore.getCommitee(update.event_id, update.new_value).then(commitee => {
          stores.Events.addEventCommitee(update.event_id, update.new_value).then(() => {
            let Change = {
              id: IDMaker.make(),
              updated: update.updated,
              title: "Update On Committees",
              event_id: update.event_id,
              changed: `Created ${commitee.name} Committee`,
              updater: update.updater,
              new_value: { data: commitee.id, new_value: commitee.name },
              date: update.date,
              time: update.time,
            };
            this.infomCurrentRoom(Change, commitee, update.event_id)
            stores.ChangeLogs.addChanges(Change).then(() => {
              resolve()
            })
          })
        })
      })
    },
    commitee_opened: update => {
      return new Promise((resolve, reject) => {
        return new Promise((resolve, reject) => {
          stores.CommiteeStore.changeCommiteeOpenedState(update.event_id, update.new_value, true).then(commitee => {
            let Change = {
              id: IDMaker.make(),
              updated: update.updated,
              title: "Update On Committees",
              event_id: update.event_id,
              changed: `Reopened ${commitee.name} Committee`,
              updater: update.updater,
              new_value: { data: commitee.id, new_value: null },
              date: update.date,
              time: update.time,
            }
            this.infomCurrentRoom(Change, commitee, update.event_id)
            stores.ChangeLogs.addChanges(Change).then(() => {
              resolve()
            })
          })
        })
      })
    },
    commitee_closed: update => {
      return new Promise((resolve, reject) => {
        return new Promise((resolve, reject) => {
          stores.CommiteeStore.changeCommiteeOpenedState(update.event_id, update.new_value, false).then(commitee => {
            let Change = {
              id: IDMaker.make(),
              updated: update.updated,
              title: "Update On Committees",
              event_id: update.event_id,
              changed: `Closed ${commitee.name} Committee`,
              updater: update.updater,
              new_value: { data: commitee.id, new_value: null },
              date: update.date,
            }
            this.infomCurrentRoom(Change, commitee, update.event_id)
            stores.ChangeLogs.addChanges(Change).then(() => {
              resolve()
            })
          })
        })
      })
    },
    removed_commitee: update => {
      return new Promise((resolve, reject) => {
        stores.CommiteeStore.removeCommitee(update.event_id, update.new_value).then(commitee => {
          stores.Events.removeCommitee(update.event_id, update.new_value).then(() => {
            let Change = {
              id: IDMaker.make(),
              updated: update.updated,
              title: "Update On Committees",
              event_id: update.event_id,
              changed: "Committee Deleted",
              updater: update.updater,
              new_value: commitee,
              date: update.date,
              time: update.time,
            }
            this.infomCurrentRoom(Change, commitee, update.event_id)
            stores.ChangeLogs.addChanges(Change).then(() => {
              resolve()
            })
          })

        })
      })
    },
    added_commitee_member: update => {
      return new Promise((resolve, reject) => {
        stores.CommiteeStore.addMembers(update.event_id, update.new_value.id, update.new_value.member).then((commitee) => {
          let Change = {
            id: IDMaker.make(),
            updated: update.updated,
            title: "Update On Committees",
            event_id: update.event_id,
            changed: `Added A New Memeber(s) To ${commitee.name} Committee`,
            updater: update.updater,
            new_value: { data: commitee.id, new_value: update.new_value.member },
            date: update.date,
            time: update.time,
          }
          this.infomCurrentRoom(Change, commitee, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            resolve()
          })
        })
      })
    },
    removed_commitee_member: update => {
      return new Promise((resolve, reject) => {
        stores.CommiteeStore.removeMember(update.event_id, update.new_value.id, update.new_value.phone).then((commitee) => {
          let Change = {
            id: IDMaker.make(),
            updated: update.updated,
            title: "Update On Committees",
            event_id: update.event_id,
            changed: `Removed A Member(s) From ${commitee.name}`,
            updater: update.updater,
            new_value: { data: commitee.id, new_value: update.new_value.phone },
            date: update.date,
            time: update.time,
          }
          this.infomCurrentRoom(Change, commitee, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            resolve()
          })
        })
      })
    },
    commitee_name_updated: update => {
      return new Promise((resolve, reject) => {
        stores.CommiteeStore.getCommitee(update.event_id, update.new_value.id).then(oldCommitee => {
          stores.CommiteeStore.updateCommiteeName(update.event_id, update.new_value.id, update.new_value.name).then(commitee => {
            let Change = {
              id: IDMaker.make(),
              updated: update.updated,
              title: "Update On Committees",
              event_id: update.event_id,
              changed: `Changed The Name Of ${oldCommitee.name} Committee To: `,
              updater: update.updater,
              new_value: { data: commitee.id, new_value: update.new_value.name },
              date: update.date,
              time: update.time,
            }
            this.infomCurrentRoom(Change, commitee, update.event_id)
            stores.ChangeLogs.addChanges(Change).then(() => {
              resolve()
            })
          })
        })
      })
    },
    updated_commitee_public_status: update => {
      return new Promise((resolve, reject) => {
        stores.CommiteeStore.updateCommiteeState(update.event_id, update.new_value.id, update.new_value.state).then((commitee) => {
          //console.warn(update.updater)
          let Change = {
            id: IDMaker.make(),
            title: "Update On Committees",
            updated: update.updated,
            event_id: update.event_id,
            changed: update.new_value.state === true ? `Published ${commitee.name} Committee` : `Unpublished ${commitee.name} Committee`,
            updater: update.updater,
            new_value: { data: commitee.id, new_value: update.new_value.state },
            date: update.date,
            time: update.time,
          }
          this.infomCurrentRoom(Change, commitee, update.event_id)
          stores.ChangeLogs.addChanges(Change).then(() => {
            resolve()
          })

        })
      })
    }

  };
}

const UpdatesDispatch = new UpdatesDispatcher();
export default UpdatesDispatch;
