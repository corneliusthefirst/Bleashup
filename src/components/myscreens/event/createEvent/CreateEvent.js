import React, { Component } from "react";
import { Header,Container,Content,Card,CardItem,Text,Footer,BodyTabs,Tabs,Tab,Right,FooterTab,Button,Left,
Body,ScrollableTab,Title,Icon } from "native-base";
import { StyleSheet, View ,TouchableOpacity} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import stores from '../../../../stores/index';
import request from '../../../../services/requestObjects';
import { filter,uniqBy,orderBy,find,findIndex,reject,uniq,indexOf,forEach,dropWhile } from "lodash";
import moment from "moment";

export default class CreateEvent extends Component {
  constructor(props){
    super(props)
  }
  

  onClickNewEvent(){
  return new Promise((resolve, reject) => {
    
    //stores.Events.delete("newEventId").then(()=>{});

    stores.Events.readFromStore().then(Events =>{
     let event = find(Events, { id:"newEventId" });
      console.warn(event);
    
     if(!event){
      event =  request.Event();
      event.id = "newEventId";

       stores.TempLoginStore.getUser().then((user)=>{

        event.creator_phone = user.phone;
        //we add the creator as first participant 
        let Participant=request.Participant();
        Participant.phone = user.phone;
        Participant.master = true;
        Participant.status = user.status;
        stores.Events.addEvent(event).then(()=>{});
        stores.Events.addParticipant(event.id, Participant,false).then(()=>{
           
        });
      })

     }

    stores.Highlights.readFromStore().then(Highlights =>{
      
     let highlight = find(Highlights, { id:"newHighlightId" }); 
     //let highlight1 = find(Highlights, { id:"1dad9df0-fbc4-11e9-9234-25e415964302" });
     console.warn("here is highlight",highlight);

     if(!highlight){
       highlight =  request.Highlight();
       highlight.id = "newHighlightId";
       
       stores.Highlights.addHighlight(highlight).then(()=>{}); 
     }    
     this.props.navigation.navigate("CreateEventView");
     resolve();

    });
      
    
    });
      
  });

 }

 onClickNewRemind(){
  
  stores.Reminds.readFromStore().then(Reminds =>{
    let remind = find(Reminds,{ id:"newRemindId" }); 
    console.warn("remind it is",remind);

    if(!remind){
      remind =  request.remind();
      remind.id = "newRemindId";
      stores.Reminds.addReminds(remind).then(()=>{});
    }
   
    this.props.navigation.navigate("MyTasksView");
   })
 }

  render() {
    return (

 
        <ActionButton buttonColor="#1CDBAB" position="right" backgroundTappable={true} btnOutRange="green" size={57}>

          <ActionButton.Item buttonColor='#9b59b6' title="New Event" onPress={()=>{this.onClickNewEvent().then(()=>{})}} size={72}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>   
          <ActionButton.Item buttonColor='#1abc9c' title="Tasks/Reminds" onPress={() => {this.onClickNewRemind()}} size={65}>
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


//stores.Reminds.removeRemind(remind.id).then((value)=>{console.warn("here it is",value)});
/* 
    let user = {
      phone: "0666406835",
      name: "cornelius",
      status: "One step ahead the world",
      birth_date: "21",
      nickname: "corneliusthefirst",
      email: "ndeffo.jugal98@gmail.com",
      created_at : moment().format(),
      updated_at:  moment().format(),
      password:"cornelius",
      profile:"",
      profile_ext:""
    }; 
    stores.TempLoginStore.setUser(user).then(()=>{});
*/