import React, { Component } from "react";
import stores from "../stores";


export default class globalFunctions extends Component {
  constructor(props){
     super(props)
  }

  bleashupSearch = (fieldArray,text,data) => {

       const newData = data.filter(item => {  
          fieldArray.forEach(element => {
             concat(itemData,' ',`${item.element.toUpperCase()}`);
          });

          const textData = text.toUpperCase();
  
          return itemData.indexOf(textData) > -1;
        });

        return newData;
  }


  bleashupSearchActivity = (text,data) => {

   const newData = data.filter(item => {
      const itemData = `${item.about.title.toUpperCase()} ${item.about.description.toUpperCase()} ${item.location.toUpperCase()} ${item.period}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    return newData;
}

opponent = {}
bleashupSearchRelation = (text,data) => {

   const newData = data.filter(item => {
      //get the opponent data
      item.participant.forEach((participant)=>{
         if(participant.phone != stores.LoginStore.user.phone){
            stores.TemporalUsersStore.Users.forEach((user)=>{
               if(participant.phone == user.phone){
                  this.opponent = user;
               }
         })

         }
      })
      const itemData = `${this.opponent.nickname.toUpperCase()} ${this.opponent.status.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    return newData;
}





} 