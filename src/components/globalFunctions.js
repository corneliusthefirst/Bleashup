import React, { Component } from "react";
import stores from "../stores";
import message_types from "./myscreens/eventChat/message_types";
import request from '../services/requestObjects';
import active_types from './myscreens/eventChat/activity_types';

class Functions {
  constructor() { }
  bleashupSearch = (fieldArray, text) => {
    return new Promise((resolve, reject) => {
      const newData = fieldArray.filter(function (item) {
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      resolve(newData);
    });
  };

  searchInActivities(fieldArray, text) {
    return fieldArray.filter((ele) => {
      const itemData =
        ele && ele.about && ele.about.title
          ? ele.about.title.toUpperCase()
          : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
  }

  bleashupSearchUser = (fieldArray, text) => {
    return new Promise((resolve, reject) => {
      const newData = fieldArray.filter(function (item) {
        const itemData = item.nickname
          ? item.nickname.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      resolve(newData);
    });
  };

  returnUserSearch(fieldArray, text) {
    return fieldArray.filter(function (item) {
      const itemData = item.nickname
        ? item.nickname.toUpperCase()
        : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
  }
  returnOponent(event) {
    return event && event.participant && event.participant.
      find(ele => ele && ele.phone !== stores.LoginStore.user.phone).phone
  }
  filterAllActivityAndRelation(event, text) {
    if (event) {
      text = (text && text.toLowerCase()) || ""
      if (event.type === active_types.relation) {
        let oponentPhone = this.returnOponent(event)
        let oponent = stores.TemporalUsersStore.Users[oponentPhone]
        return oponent && oponent.nickname && oponent.nickname.toLowerCase().includes(text)
      } else {
        return event.about && event.about.title && event.about.title.includes(text)
      }
    } else {
      return false
    }
  }
  isMe(phone) {
    return phone === stores.LoginStore.user.phone;
  }
  /*getOponentSimple(participant){
     let oponent = participant.find(ele => ele.phone !== stores.LoginStore.user.phone)
      return stores.TemporalUsersStore.User.find((ele) => ele.phone === oponent.phone)
  }*/
  getOpponent = (event) => {
    return new Promise((resolve, reject) => {
      event.participant.forEach((participant) => {
        if (participant.phone != stores.LoginStore.user.phone) {
          stores.TemporalUsersStore.getUser(participant.phone).then((user) => {
            resolve(user);
          });
        }
      });
    });
  };
  filterForRelation(ele, search) {
    let name = ele && ele.nickname && ele.nickname.toLowerCase();
    name =
      name ||
      (ele && stores.TemporalUsersStore.Users[ele.phone] &&
        stores.TemporalUsersStore.Users[ele.phone].nickname.toLowerCase());
    return name && name.includes(search.toLowerCase()) ? true : false;
  }

  filterMessages(ele, search, isRelation) {
    if (ele && search && search.length > 0) {
      search = search.toLowerCase()
      let senderPhone = ele.sender && ele.sender.phone.replace && ele.sender.phone.replace("+", "00")
      let isText = (ele.text && ele.text.toLowerCase().includes(search))
      let isName = (ele.name && ele.name.toLowerCase().includes(search))
      let user = senderPhone && senderPhone !== stores.LoginStore.user.phone &&
        stores.TemporalUsersStore.Users[senderPhone]
      let isUsername = user && user.nickname && user.nickname.toLowerCase().includes(search)
      return isText || (!isRelation && isUsername) || isName
    } else {
      return false
    }
  }
  byTitleAndDesc(ele, search) {
    search = search ? search.toLowerCase() : ""
    return (ele.title && ele.title.toLowerCase().includes(search) ||
      ele.description && ele.description.toLowerCase().includes(search)) ||
      (ele.location && ele.location.toLowerCase().includes(search)) ||
      (ele.members && ele.members.length && search.includes(ele.members.length.toString()))
  }
  filterStars(ele, search) {
    return ele && ele.id !== request.Highlight().id && this.byTitleAndDesc(ele, search)

  }
  filterReminds(ele, search) {
    return ele && ele.id !== request.Remind().id && this.byTitleAndDesc(ele, search)
  }
  filterHistory(ele, search) {
    if (ele && search && ele.type !== message_types.date_separator) {
      search = search.toLowerCase()
      let updater = typeof ele.updater == "object" ? stores.TemporalUsersStore.Users[ele.updater.phone] :
        stores.TemporalUsersStore.Users[ele.updater]
      let isLikeUpdater = updater && updater.nickname && updater.nickname.toLowerCase().includes(search)
      let likeUpdated = ele.changed && ele.changed.toLowerCase().includes(search)
      let likeTitle = ele.title && ele.title.toLowerCase().includes(search)
      return isLikeUpdater || likeUpdated || likeTitle
    } else {
      return false
    }
  }
}

const globalFunctions = new Functions();
export default globalFunctions;
