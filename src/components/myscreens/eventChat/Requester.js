import request from "../../../services/requestObjects";
import tcpRequest from "../../../services/tcpRequestData";
import EventListener from "../../../services/severEventListener";
import MainUpdater from "../../../services/mainUpdater";
import stores from "../../../stores";
import moment from "moment";

const received = "received";
const newMes = "new";
const update = "update";
const deleteMes = "delete";
const played = "played";
const seen = "seen";
const react = "reaction";
const typing = "typing";
class MessageRequest {
    sendMessage(message, CommitteeID, EventID, notme) {
        return new Promise((resolve, reject) => {
            let messageData = request.MessageAction();
            messageData.action = newMes;
            messageData.data = message;
            messageData.committee_id = CommitteeID;
            messageData.event_id = EventID;
            tcpRequest.messaging(messageData, message.id).then((JSONdata) => {
                EventListener.sendRequest(JSONdata, message.id).then((response) => {
                    MainUpdater.saveMessage(message, EventID, CommitteeID, notme ? false : true).then(() => {
                        resolve(response);
                    });
                }).catch((error) => {
                    console.warn(error)
                    
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
            tcpRequest
                .messaging(messageData, messageID + deleteMes)
                .then((JSONdata) => {
                    EventListener.sendRequest(JSONdata, messageID + deleteMes).then(
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
                EventListener.sendMessage(JSONdata, messageID + played).then(
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
                        console.warn(response);
                        MainUpdater.seenMessage(
                            messageID,
                            committeeID,
                            eventID,
                            seer
                        ).then(() => {
                            resolve()
                        });
                    }
                );
            });
        });
    }
    reactMessage(messageID, committeeID, reactio, eventID) {
        return new Promise((resolve, reject) => {
            let reactPhone = { phone: stores.LoginStore.user.phone, date: moment().format() }
            let reaction = { reaction: reactio, reacter: reactPhone }
            let reacter = { message_id: messageID, reaction }
            let messageData = request.MessageAction()
            messageData.action = react
            messageData.data = reacter
            messageData.committee_id = committeeID
            messageData.event_id = eventID
            tcpRequest.messaging(messageData, messageID + react).then(JSONdata => {
                EventListener.sendRequest(JSONdata, messageID + react).then(() => {
                    MainUpdater.reactToMessage(messageID, committeeID, eventID,
                        reaction).then(() => {
                            resolve()
                        })
                })
            })

        })
    }
    sayTyping(committeeID, eventID) {
        return new Promise((resolve, reject) => {
            let messageData = request.MessageAction()
            let typer = {
                phone: stores.LoginStore.user.phone,
                name: stores.LoginStore.user.nickname
            }
            messageData.action = typing,
                messageData.data = typer
            messageData.committee_id = committeeID
            messageData.event_id = eventID
            tcpRequest.messaging(messageData, committeeID + typing).then(JSONdata => {
                EventListener.sendRequest(JSONdata, committeeID + typing).then((res) => {
                    MainUpdater.sayTyping(committeeID, typer).then(() => {
                        resolve()
                    })
                })
            })

        })
    }
}
const Requester = new MessageRequest()
export default Requester