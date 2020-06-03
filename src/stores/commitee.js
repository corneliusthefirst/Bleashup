import storage from "./Storage";
import { observable } from "mobx";
import { reject, findIndex, uniqBy, unionBy, find } from "lodash";
import moment from "moment";
import request from "../services/requestObjects";
import tcpRequest from "../services/tcpRequestData";
import serverEventListener from "../services/severEventListener";
import GState from "./globalState/index";
import stores from ".";
export default class commitee {
  constructor() {
    /* storage.remove({key:"commitees"}).then(()=>{
 
         })*/
    this.initializeCommittees().then((data) => {
      this.commitees = data;
    });
    this.initialsGeneralsStore().then((data) => {
      this.generals = data;
    });
    this.saverInterval = setInterval(() => {
      this.currentSavedTime !== this.previousSavedTime ? this.saver() : null;
      this.generalPreviousSaveTime !== this.generalCurrentSaveTime
        ? this.generalSaver()
        : null;
    }, this.saverTime);
  }
  currentSavedTime = moment().format();
  previousSavedTime = moment().format();
  generalCurrentSaveTime = this.currentDate();
  generalPreviousSaveTime = this.currentDate();
  saverInterval = null;
  saverTime = 2000;
  @observable commitees = {};
  storeAccessKey = {
    key: "commitees",
    autoSync: true,
  };
  saveKey = {
    key: "commitees",
    data: {},
  };
  addCommitee(eventID, newCommitee) {
    newCommitee = { ...newCommitee, updated: moment().format() };
    return new Promise((resolve, reject) => {
      this.readFromStore().then((commitees) => {
        commitees[eventID] && commitees[eventID].length > 0
          ? commitees[eventID].push(newCommitee)
          : (commitees[eventID] = [newCommitee]);
        this.addToStore(commitees).then(() => {
          resolve("ok");
        });
      });
    });
  }
  getCommitee(eventID, id) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((commitees) => {
        let index = findIndex(commitees[eventID], { id: id });
        if (index >= 0) {
          resolve(commitees[eventID][index]);
        } else {
          let getCommitee = request.get_commitee();
          getCommitee.id = id;
          tcpRequest.get_commitee(getCommitee, id).then((JSONData) => {
            serverEventListener.sendRequest(JSONData, id).then((data) => {
              this.addCommitee(data.data[0]).then(() => {
                resolve(data.data[0]);
              });
            });
          });
        }
      });
    });
  }
  currentDate() {
    return moment().format();
  }
  replaceCommiteeParticipant(eventID, ID, participant) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((commitees) => {
        let commiteeIndex = findIndex(commitees[eventID], { id: ID });
        let index = findIndex(commitees[eventID][commiteeIndex].member, {
          phone: participant.phone,
        });
        if (index >= 0) {
          commitees[eventID][commiteeIndex].member[index] = participant;
          commitees[eventID][commiteeIndex].updated_at = this.currentDate();
          this.addToStore(commitees).then(() => {
            resolve(commitees[eventID][commiteeIndex]);
          });
        } else {
          resolve();
        }
      });
    });
  }
  imIInThisCommttee(eventID, phone, committeeID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Committees) => {
        let committee = find(Committees[eventID], { id: committeeID });
        if (findIndex(committee.member, { phone: phone }) >= 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
  removeCommitee(eventID, ID) {
    return new Promise((resolve, rejec) => {
      this.readFromStore().then((commitees) => {
        commitees = reject(commitees[eventID], { id: ID });
        this.addToStore(commitees).then(() => {
          resolve(findIndex(commitees[eventID], { id: ID }));
        });
      });
    });
  }
  addMembers(eventID, ID, member) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((commitees) => {
        let index = findIndex(commitees[eventID], { id: ID });
        commitees[eventID][index].updated_at = this.currentDate();
        commitees[eventID][index].member = unionBy(
          commitees[eventID][index].member,
          member,
          "phone"
        );
        this.addToStore(commitees).then(() => {
          resolve(commitees[eventID][index]);
        });
      });
    });
  }
  removeMember(eventID, ID, phones) {
    return new Promise((resolve, rejec) => {
      this.readFromStore().then((commitees) => {
        let index = findIndex(commitees[eventID], { id: ID });
        commitees[eventID][index].updated_at = this.currentDate();
        commitees[eventID][index].member = reject(
          commitees[eventID][index].member,
          (ele) => findIndex(phones, (phone) => phone === ele.phone) >= 0
        );
        this.addToStore(commitees).then(() => {
          resolve(commitees[eventID][index]);
        });
      });
    });
  }

  addMaster(eventID, ID, phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((commitees) => {
        let index = findIndex(commitees[eventID], { id: ID });
        commitees[eventID][index].updated_at = this.currentDate();
        let indexSub = findIndex(commitees[eventID][index].members, {
          phone: phone,
        });
        commitees[eventID][index].members[indexSub].master = true;
        this.addToStore(commitees).then(() => {
          resolve();
        });
      });
    });
  }
  changeCommiteeOpenedState(eventID, ID, newState) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((commitees) => {
        let index = findIndex(commitees[eventID], { id: ID });
        commitees[eventID][index].opened = newState;
        commitees[eventID][index].updated_at = this.currentDate();
        this.addToStore(commitees).then(() => {
          this.setProperties(commitees);
          resolve(commitees[eventID][index]);
        });
      });
    });
  }
  removeMaster(eventID, ID, phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((commitees) => {
        let index = findIndex(commitees[eventID], { id: ID });
        commitees[eventID][index].updated_at = this.currentDate();
        let indexSub = findIndex(commitees[eventID][index].members, {
          phone: phone,
        });
        commitees[eventID][index].members[indexSub].master = false;
        this.addToStore(commitees).then(() => {
          resolve();
        });
      });
    });
  }
  updateCommiteeName(eventID, ID, name) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((commitees) => {
        let index = findIndex(commitees[eventID], { id: ID });
        let previousCommittee = JSON.stringify(commitees[eventID][index]);
        commitees[eventID][index].name = name;
        commitees[eventID][index].updated_at = this.currentDate();
        this.addToStore(commitees).then(() => {
          resolve(JSON.parse(previousCommittee));
        });
      });
    });
  }
  updateCommiteeState(eventID, ID, state) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((commitees) => {
        let index = findIndex(commitees[eventID], { id: ID });
        commitees[eventID][index].public_state = state;
        commitees[eventID][index].updated_at = this.currentDate();
        this.addToStore(commitees).then(() => {
          resolve(commitees[eventID][index]);
        });
      });
    });
  }
  setProperties(data) {
    this.commitees = data;
  }
  saver() {
    this.saveKey.data = this.commitees;
    if(Object.keys(this.commitees) > 0){
      storage.save(this.saveKey).then(() => {
        this.previousSavedTime = this.currentSavedTime;
      });
    }
  }
  generalSaver() {
    if (Object.keys(this.generals).length > 0) {
      this.generalsSaveKey.data = this.generals;
      storage.save(this.generalsSaveKey).then(() => {
        this.generalPreviousSaveTime = this.generalCurrentSaveTime;
      });
    }
  }
  generalsReadKeys = {
    key: "generals",
    autoSync: true,
  };
  generalsSaveKey = {
    key: "generals",
    data: this.generals,
  };
  generals = {};
  addToStore(data) {
    this.currentSavedTime = moment().format();
    return new Promise((resolve, reject) => {
      this.commitees = data;
      resolve();
    });
  }
  addNewMessage(message, eventID, committeeID) {
    return new Promise((resovle, reject) => {
      if (committeeID == eventID) {
        this.generals[eventID]
          ? (this.generals[eventID].newest_message = message)
          : (this.generals[eventID] = { newest_message: message });
        GState.currentCommitee !== eventID && (!message.sender ||
          message.sender.phone.replace("+", "00") !== stores.LoginStore.user.phone)
          ? this.generals[eventID].new_messages &&
            this.generals[eventID].new_messages.length > 0
            ? this.generals[eventID].new_messages.push(message.id)
            : (this.generals[eventID].new_messages = [message.id])
          : null;
        this.generalCurrentSaveTime = this.currentDate();
        resovle()
      } else {
        this.readFromStore().then((committes) => {
          let index = findIndex(committes[eventID], { id: committeeID });
          committes[eventID][index].newest_message = message;
          committes[eventID][index].updated_at = this.currentDate();
          GState.currentCommitee === committes[eventID][index].id && (!message.sender ||
            message.sender.phone.replace("+", "00") !== stores.LoginStore.user.phone)
            ? committes[eventID][index].new_messages &&
              committes[eventID][index].new_messages.length > 0
              ? committes[eventID][index].new_messages.push(message.id)
              : (committes[eventID][index].new_messages = [message.id])
            : null;
          this.addToStore(committes);
          resovle();
        });
      }
    });
  }
  updateLatestMessageText(messageID, text, commiteeID, eventID) {
    return new Promise((resolve, reject) => {
      if (commiteeID == eventID) {
        this.generals[eventID].newest_message && this.generals[eventID].new_messages ?
          this.generals[eventID].newest_message.text = text : null
        this.generalCurrentSaveTime = this.currentDate()
        resolve()
      } else {
        this.readFromStore().then((commitees) => {
          let index = findIndex(commitees[eventID], { id: commiteeID });
          if (
            commitees[eventID][index].new_messages &&
            messageID === commitees[eventID][index].newest_message.id
          ) {
            commitees[eventID][index].newest_message.text = text;
            commitees[eventID][index].updated_at = this.currentDate;
          }
          this.addToStore(commitees);
          resolve();
        });
      }
    });
  }
  removeNewMessage(messageID, eventID, committeeID) {
    return new Promise((resolve, rejec) => {
      if (committeeID == eventID) {
        this.generals[eventID].newest_message =
          stores.Messages.messages[committeeID][0];
        this.generals[eventID].new_messages = reject(
          this.generals[eventID].new_messages,
          (ele) => ele == messageID
        );
        this.generalCurrentSaveTime = this.currentDate()
        resolve()
      } else {
        this.readFromStore().then((commitees) => {
          let index = findIndex(commitees[eventID], { id: committeeID });
          commitees[eventID][index].newest_message =
            stores.Messages.messages[committeeID][0];
          commitees[eventID][index].new_messages = reject(
            commitees[eventID][index].new_messages,
            (ele) => ele == messageID
          );
          commitees[eventID][index].updated_at = this.currentDate();
          this.addToStore(commitees);
          resolve();
        });
      }
    });
  }
  initializeCommittees() {
    return this.loadStore(this.storeAccessKey);
  }
  loadStore(loader) {
    return new Promise((resolve, reject) => {
      storage
        .load(loader)
        .then((chats) => {
          resolve(chats);
        })
        .catch((error) => {
          resolve({});
        });
    });
  }
  initialsGeneralsStore() {
    return this.loadStore(this.generalsReadKeys);
  }
  setGeneralProps(data) {
    this.generalCurrentSaveTime = moment().format();
    this.generals = data;
  }
  readFromStore() {
    return new Promise((resolve, reject) => {
      resolve(this.commitees);
    });
  }
}
