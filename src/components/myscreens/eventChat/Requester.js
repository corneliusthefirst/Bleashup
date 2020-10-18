import request from "../../../services/requestObjects";
import tcpRequest from "../../../services/tcpRequestData";
import EventListener from "../../../services/severEventListener";
import MainUpdater from "../../../services/mainUpdater";
import stores from "../../../stores";
import moment from "moment";
import toTitleCase from "../../../services/toTitle";
import message_types from "./message_types";
import notification_channels from './notifications_channels';
import emitter from "../../../services/eventEmiter";
import persistTypes from './persisTypes';

const received = "received";
const newMes = "new";
export const update = "update";
export const deleteMes = "delete";
const played = "played";
const seen = "seen";
const react = "reaction";
const typing = "typing";
class MessageRequest {
  constructor(){
     
     this.notif_channel = notification_channels.messaging
  }
  cancelMessageSent(messageID){
    const id = messageID + deleteMes
    emitter.emit(EventListener.events.unsuccessful_ + id)
  }
  determineMessageType(type) {
    switch (type) {
      case message_types.audio:
        return "Audio message";
      case message_types.video:
        return "Video message";
      case message_types.photo:
        return "Photo message";
      case message_types.file:
        return "File message";
      default:
        return "Text message";
    }
  }
  sendMessage(message, CommitteeID, EventID, notme, activity_name) {
    this.yourName = toTitleCase(stores.LoginStore.user.nickname);
    this.shortName = this.yourName.split(" ")[0];
    return new Promise((resolve, reject) => {
      let messageData = request.MessageAction();
      let notif = request.Notification();
      notif.notification.title = activity_name
        ? `New ${this.determineMessageType(message.type)} @ ${activity_name}`
        : `New ${this.determineMessageType(message.type)} from ${this.yourName}`;
      notif.notification.image =
        message.type == message_types.photo ||
        message.type == message_types.video
          ? message.photo || message.video
          : null;
      notif.notification.body = activity_name
        ? `${this.shortName}: ${message.text}`
        : message.text;
        notif.notification.android_channel_id = this.notif_channel
      notif.data.activity_id = EventID;
      notif.data.message_id = message.id;
      messageData.action = newMes;
      messageData.data = message;
      message.notme = notme;
      messageData.committee_id = CommitteeID;
      messageData.event_id = EventID;
      messageData.notif = notif;
      tcpRequest.messaging(messageData, message.id).then((JSONdata) => {
        EventListener.sendRequest(JSONdata, message.id,persistTypes.messaging)
          .then((response) => {
            MainUpdater.saveMessage(
              message,
              EventID,
              CommitteeID,
              notme ? false : true
            ).then(() => {
              resolve(response);
            });
          })
          .catch((error) => {
            console.warn(error);
          });
      });
    });
  }
  receiveMessage(messageID, phone, eventID, commiteeID) {
    return new Promise((resolve, reject) => {
      let recieved = {
        phone: stores.LoginStore.user.phone,
        date: moment().format(),
      };
      let messageData = request.MessageAction();
      messageData.action = received;
      messageData.data = { message_id: messageID, recieved: received };
      messageData.event_id = eventID;
      messageData.committee_id = commiteeID;
      tcpRequest
        .messaging(messageData, messageID + received)
        .then((JSONdata) => {
          EventListener.sendRequest(JSONdata, messageID + received).then(() => {
            MainUpdater.receiveMessage(messageID, commiteeID, recieved).then(
              () => {
                resolve();
              }
            );
          });
        });
    });
  }

  updateTextMessage(messageID, text, eventID, commiteeID) {
    return new Promise((resolve, reject) => {
      let textUpdate = {
        message_id: messageID,
        text,
      };
      let messageData = request.MessageAction();
      messageData.action = update;
      messageData.committee_id = commiteeID;
      messageData.event_id = eventID;
      messageData.data = textUpdate;
      tcpRequest.messaging(messageData, messageID + update).then((JSONdata) => {
        EventListener.sendRequest(JSONdata, messageID + update).then(
          (response) => {
            console.warn(response);
            MainUpdater.updateMessage(
              messageID,
              commiteeID,
              eventID,
              text
            ).then(() => {
              resolve();
            });
          }
        );
      });
    });
  }
  deleteMessage(messageID, eventID, commiteeID) {
    return new Promise((resolve, reject) => {
      let messageData = request.MessageAction();
      messageData.action = deleteMes;
      messageData.committee_id = commiteeID;
      messageData.event_id = eventID;
      messageData.data = { message_id: messageID };
      const id = messageID + deleteMes
      tcpRequest
        .messaging(messageData, id)
        .then((JSONdata) => {
          EventListener.sendRequest(JSONdata, id).then(
            (response) => {
              console.warn(response);
              MainUpdater.deleteMessage(messageID, commiteeID, eventID).then(
                () => {
                  resolve();
                }
              );
            }
          );
        });
    });
  }
  playedMessage(messageID, commiteeID, eventID) {
    return new Promise((resolve, reject) => {
      let messageData = request.MessageAction();
      let player = {
        phone: stores.LoginStore.user.phone,
        date: moment().format(),
      };
      messageData.action = played;
      messageData.committee_id = commiteeID;
      messageData.event_id = eventID;
      messageData.data = { message_id: messageID, player };
      tcpRequest.messaging(messageData, messageID + played).then((JSONdata) => {
        EventListener.sendRequest(JSONdata, messageID + played).then(
          (response) => {
            console.warn(response);
            MainUpdater.playedMessage(
              messageID,
              commiteeID,
              eventID,
              player
            ).then(() => {
              resolve();
            });
          }
        );
      });
    });
  }
  seenMessage(messageID, committeeID, eventID) {
    return new Promise((resolve, reject) => {
      let seer = {
        phone: stores.LoginStore.user.phone,
        date: moment().format(),
      };
      let messageData = request.MessageAction();
      messageData.action = seen;
      messageData.data = { message_id: messageID, seer };
      messageData.committee_id = committeeID;
      messageData.event_id = eventID;
      tcpRequest.messaging(messageData, messageID + seen).then((JSONdata) => {
        EventListener.sendRequest(JSONdata, messageID + seen).then(
          (response) => {
            MainUpdater.seenMessage(messageID, committeeID, eventID, seer).then(
              () => {
                resolve();
              }
            );
          }
        );
      });
    });
  }
  reactMessage(messageID, committeeID, reactio, eventID,activity_name) {
    this.yourName = toTitleCase(stores.LoginStore.user.nickname);
    this.shortName = this.yourName.split(" ")[0];
    return new Promise((resolve, reject) => {
      let reactPhone = {
        phone: stores.LoginStore.user.phone,
        date: moment().format(),
      };
      let reaction = { reaction: reactio, reacter: reactPhone };
      let reacter = { message_id: messageID, reaction };
      let messageData = request.MessageAction();
      let notif = request.Notification()

      notif.notification.title = `Message Reaction`
      notif.notification.android_channel_id = this.notif_channel
      notif.notification.body  = activity_name? 
      `${this.shortName} @ ${activity_name} reacted to a message`:
      `${this.yourName} reacted to your message`
      notif.data.activity_id = eventID 
      notif.data.message_id = messageID
      messageData.action = react;
      messageData.data = reacter;
      messageData.committee_id = committeeID;
      messageData.event_id = eventID;
      messageData.notif = notif
      tcpRequest.messaging(messageData, messageID + react).then((JSONdata) => {
        EventListener.sendRequest(JSONdata, messageID + react).then(() => {
          MainUpdater.reactToMessage(
            messageID,
            committeeID,
            eventID,
            reaction
          ).then(() => {
            resolve();
          });
        });
      });
    });
  }
  sayTyping(committeeID, eventID) {
    return new Promise((resolve, reject) => {
      let messageData = request.MessageAction();
      let typer = {
        phone: stores.LoginStore.user.phone,
        name: stores.LoginStore.user.nickname,
      };
      (messageData.action = typing), (messageData.data = typer);
      messageData.committee_id = committeeID;
      messageData.event_id = eventID;
      tcpRequest
        .messaging(messageData, committeeID + typing)
        .then((JSONdata) => {
          EventListener.sendRequest(JSONdata, committeeID + typing).then(
            (res) => {
              MainUpdater.sayTyping(committeeID, typer).then(() => {
                resolve();
              });
            }
          );
        });
    });
  }
}
const Requester = new MessageRequest();
export default Requester;
