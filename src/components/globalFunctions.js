import React, { Component } from "react";
import stores from "../stores";


  class Functions  {
     constructor(){

     }
  bleashupSearch = (fieldArray,text) => {
   return new Promise((resolve, reject) => {
      const newData = fieldArray.filter(function(item) {
         const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
         const textData = text.toUpperCase();
         return itemData.indexOf(textData) > -1;
       });   
        resolve(newData);
   })
  }

  bleashupSearchUser = (fieldArray,text) => {
   return new Promise((resolve, reject) => {
      const newData = fieldArray.filter(function(item) {
         const itemData = item.nickname ? item.nickname.toUpperCase() : ''.toUpperCase();
         const textData = text.toUpperCase();
         return itemData.indexOf(textData) > -1;
       });   
        resolve(newData);
   })
  }

  returnUserSearch(fieldArray,text){
     return fieldArray.filter(function (item) {
        const itemData = item.nickname ? item.nickname.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
     });   
  }

  /*getOponentSimple(participant){
     let oponent = participant.find(ele => ele.phone !== stores.LoginStore.user.phone)
      return stores.TemporalUsersStore.User.find((ele) => ele.phone === oponent.phone)
  }*/
  getOpponent = (event)=>{
   return new Promise((resolve, reject) => {
      event.participant.forEach((participant)=>{
         if( participant.phone != stores.LoginStore.user.phone){
            stores.TemporalUsersStore.getUser(participant.phone).then((user)=>{
               resolve(user);
           })   
         }
      })
   })
  }
} 

const globalFunctions = new Functions()
export default globalFunctions
