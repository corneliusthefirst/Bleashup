import React, { Component } from "react";
import stores from "../../../stores";


export default class globalFunctions extends Component {
  constructor(props){
     super(props)
  }

  bleashupSearch = (fieldArray,text,data) => {

       const newData = data.filter(item => {
        
          fieldArray.forEach(element => {
             itemData.concat(' ',`${item.element.toUpperCase()} `);
          });

          const textData = text.toUpperCase();
  
          return itemData.indexOf(textData) > -1;
        });

        return newData;
  }


}