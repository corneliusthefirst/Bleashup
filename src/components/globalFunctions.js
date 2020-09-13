import React, { Component } from "react";
import stores from "../stores";
import message_types from "./myscreens/eventChat/message_types";
import request from '../services/requestObjects';

class Functions {
  constructor() {}
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
    let name = ele.nickname && ele.nickname.toLowerCase();
    name =
      name ||
      (stores.TemporalUsersStore.Users[ele.phone] &&
        stores.TemporalUsersStore.Users[ele.phone].nickname);
    return name && name.includes(search.toLowerCase()) ? true : false;
  }

  filterMessages(ele, search) {
    return ele && ((ele.text && ele.text.toLowerCase().includes(search.toLowerCase())) ||
          ele.type == message_types.date_separator ||
          ele.type === message_types.new_separator)
      
  }
  byTitleAndDesc(ele,search){
    return (ele.title && ele.title.toLowerCase().includes(search.toLowerCase()) ||
      ele.description && ele.description.toLowerCase().includes(search.toLowerCase()))
  }
  filterStars(ele,search) {
    return ele && ele.id !== request.Highlight().id && this.byTitleAndDesc(ele,search)
    
  }
  filterReminds(ele,search){
    return ele && ele.id !== request.Remind().id && this.byTitleAndDesc(ele,search)
  }
  filterHistory(ele,search){
    if(ele){
      search = search.toLowerCase()
      let updater = typeof ele.updater == "object"? stores.TemporalUsersStore.Users[ele.updater.phone]: 
      stores.TemporalUsersStore.Users[ele.updater]
      let isLikeUpdater = updater && updater.nickname && updater.nickname.toLowerCase().includes(search)
      let likeUpdated = ele.changed && ele.changed.toLowerCase().includes(search)
      let likeTitle = ele.title && ele.title.toLowerCase().includes(search)
      let likeNewValue = ele.new_value && ele.new_value.new_value && typeof ele.new_value.new_value == "string" && ele.new_value.new_value.toLowerCase().includes(search)   
       return isLikeUpdater || likeUpdated || likeTitle || likeNewValue || ele.type == message_types.date_separator
    }else{
      return false
    }
  }
}

const globalFunctions = new Functions();
export default globalFunctions;
