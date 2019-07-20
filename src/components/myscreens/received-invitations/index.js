import React, { Component } from 'react';
import { Platform, StyleSheet, Image, TextInput, FlatList, View, Alert, TouchableHighlight } from 'react-native';

import autobind from "autobind-decorator";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header, Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner, Button, InputGroup, DatePicker, CheckBox, Thumbnail, List
} from "native-base";

import cardListData from './EventData';

import CardListItem from './invitationCard';

import NestedScrollView from "react-native-nested-scroll-view"

class ReceivedInvitations extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      deletedRowKey: null,

    });

  }

  ComponentWillMount() {
    /*create this object from ariving data to form new_invitation
     cardListData = [
    {
      "key" : "32143",
      "sender_Image":"https://upload.wikimedia.org/wikipedia/commons/b/bf/Cornish_cream_tea_2.jpg",
      "sender_name":"cornelius",
      "sender_status":"One step ahead the world De plus, les nouvelles API à votre disposition",
      "receiver_Image":"https://upload.wikimedia.org/wikipedia/commons/6/6e/Lactarius_indigo_48568.jpg",
      "received_date":"28/06/2019",
      "created_date":"27/06/2019",
      "event_organiser_name":"Giles",
      "event_description":"De plus, les nouvelles API à votre disposition sont également « entraînables » de façon très simple. Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule, grâce au machine learning",
      "event_Image":"https://upload.wikimedia.org/wikipedia/commons/a/ac/Simple_somen.jpg",
      "event_time":"13:51",
      "event_title":"Ceremony anesty",
      "location":"pizza Hut grenoble",
      "invitation_status":"master",
      "highlight":[
        {title:"highlight_1",description:" Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule",image:"https://cdn.stocksnap.io/img-thumbs/960w/VQZNYH80K6.jpg"},
        {title:"highlight_2",description:" Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule",image:"https://cdn.stocksnap.io/img-thumbs/960w/X6QBLPBXAJ.jpg"}
        ]
   
    }*/


    //then
    //cardListData.push(new_invitation)
  }




  //callback function to refresh state of change
  refreshCardList = (activeKey) => {
    this.setState((prevState) => {
      return {
        //give the key to delete to the deleted row key
        deletedRowKey: activeKey
      };

    });
    //flatlist here is a reference to flatlist
    this.refs.cardlist.scrollToEnd();
  }


  /// Adding a new item using a modal
  /*   @autobind
    _onPressAdd () {
        //alert("You add Item");
        this.refs.addModal.showAddModal();
    }*/
  render() {

     return (
           <Content>
        
    
           <FlatList 
             //reference name to Flatlist
             style={{flex:1}}
             ref={"cardlist"}
             listKey={'Invitations'}
             data={cardListData}
             renderItem={( {item,index} )=> {
                 //console.log(`Item=${JSON.stringify(item)}, Index = ${index}`);
           
              return(
                     //this is my private class just created
                     <CardListItem item={item} index={index} parentCardList = {this} refresh={this.refreshCardList}>
                     </CardListItem>
                 );


             }}
             >
                
             </FlatList>

           </Content>
        
           
     );
  }
}


export default ReceivedInvitations;


















































