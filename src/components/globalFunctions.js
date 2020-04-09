import React, { Component } from "react";
import stores from "../stores";


export default class globalFunctions extends Component {
  constructor(props){
     super(props)
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


} 