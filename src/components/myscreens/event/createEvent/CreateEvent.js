import React, { Component } from "react";
import { Header,Container,Content,Card,CardItem,Text,Footer,BodyTabs,Tabs,Tab,Right,FooterTab,Button,Left,
Body,ScrollableTab,Title,Icon } from "native-base";
import { StyleSheet, View ,TouchableOpacity} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import stores from '../../../../stores/index';
import request from '../../../../services/requestObjects';
import { filter,uniqBy,orderBy,find,findIndex,reject,uniq,indexOf,forEach,dropWhile } from "lodash";

export default class CreateEvent extends Component {
  constructor(props){
    super(props)
  }
  

  onClickNewEvent(){
  return new Promise((resolve, reject) => {
    
    stores.Events.readFromStore().then(Events =>{
     let event = find(Events, { id:"newEventId" });
     console.warn(Events);
  
     if(!event){
       event =  request.Event();
       event.id = "newEventId";
       stores.Events.addEvent(event).then(()=>{
       });
     }
    stores.Highlights.readFromStore().then(Highlights =>{
      
     let highlight = find(Highlights, { id:"newHighlightId" }); 
     //let highlight1 = find(Highlights, { id:"1dad9df0-fbc4-11e9-9234-25e415964302" }); 
     //console.warn(highlight1);
    
     if(!highlight){
       highlight =  request.Highlight();
       highlight.id = "newHighlightId";
       
       stores.Highlights.addHighlight(highlight).then(()=>{
       }); 
    
     }        
     this.props.Parentprops.navigation.navigate("CreateEventView");
     resolve();

    });
      
    
    });
      
  });

 }


  render() {
    return (

 
        <ActionButton buttonColor="#1CDBAB" position="center" backgroundTappable={true} btnOutRange="green" size={45}>
         <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {console.warn("these are log")}} size={70}>
            <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#9b59b6' title="New Event" onPress={()=>{this.onClickNewEvent().then(()=>{resolve()})}} size={60}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>   
          <ActionButton.Item buttonColor='#1abc9c' title="Tasks/Reminds" onPress={() => {this.props.Parentprops.navigation.navigate("MyTasksView")}} size={50}>
            <Icon name="tasks" type="FontAwesome" style={styles.actionButtonIcon} />
          </ActionButton.Item>

          </ActionButton>

    );
  }
}


const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white'
  }
});
