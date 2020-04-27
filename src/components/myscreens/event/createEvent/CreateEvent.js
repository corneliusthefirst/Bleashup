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
import ColorList from '../../../colorList';

export default class CreateEvent extends Component {
  constructor(props){
    super(props)
  }
  

  onClickNewEvent(){
  return new Promise((resolve, rejectPromise) => {
    
    //stores.Events.delete("newEventId").then(()=>{console.warn("event deleted")});
   

    stores.Events.readFromStore().then(Events =>{
     let event = find(Events, { id:"newEventId" });
      console.warn(Events);


     if(!event){
      event =  request.Event();
      event.id = "newEventId";

       stores.LoginStore.getUser().then((user)=>{

        event.creator_phone = user.phone;
        //we add the creator as first participant 
        let Participant=request.Participant();
        Participant.phone = user.phone;
        Participant.master = true;
        Participant.status = user.status;
        stores.Events.addEvent(event).then(()=>{});
        stores.Events.addParticipant(event.id, Participant,false).then(()=>{})

      })

     }

    //stores.Highlights.removeHighlight("newHighlightId").then(()=>{console.warn("highlight removed")})   
    stores.Highlights.readFromStore().then(Highlights =>{
      
     let highlight = find(Highlights, { id:"newHighlightId" }); 
     //let highlight1 = find(Highlights, { id:"1dad9df0-fbc4-11e9-9234-25e415964302" });
     //console.warn("here is highlight",highlight);

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
  return new Promise((resolve, rejectPromise) => {

  stores.Reminds.readFromStore().then(Reminds =>{
    console.warn("remind are",Reminds);
    let remind = find(Reminds,{ id:"newRemindId" }); 
    console.warn("remind it is",remind);

    if(!remind){
      console.warn("here")
      remind =  request.Remind();
      remind.id = "newRemindId";
      stores.Reminds.addReminds(remind).then(()=>{});
    }
   
    this.props.navigation.navigate("MyTasksView");
   })

  })
 }

 onClickNewContact(){
  this.props.navigation.navigate("Contacts");
 }
  navigateToQRScanner() {
    this.props.navigation.navigate("QR")
  }
  render() {
    return (

 
        <ActionButton buttonColor='rgba(52, 52, 52, 0.9)' position="right" backgroundTappable={true} btnOutRange={ColorList.bodyText} size={55} 
        useNativeFeedback={false}
        renderIcon={()=>{
          return <Icon name="plus" type="AntDesign" style={{color:ColorList.bodyBackground,fontSize:53}} />
        }}
        >

          <ActionButton.Item buttonColor='#1CDBAB' title="New Relation" onPress={()=>{this.onClickNewContact()}} size={75}>
            <Icon name="person-add" active={true} type="MaterialIcons" style={styles.actionButtonIcon} />
          </ActionButton.Item>   
          <ActionButton.Item buttonColor='#9b59b6' title=" New Activity  " onPress={()=>{this.onClickNewEvent().then(()=>{})}} size={65}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>   
        <ActionButton.Item buttonColor='#3D90E3' title="Join Activity" onPress={() => { this.navigateToQRScanner() }} size={55}>
          <Icon name="barcode-scan" active={true} type="MaterialCommunityIcons" style={{ color: "#FEFFDE", }} />
        </ActionButton.Item> 
          <ActionButton.Item buttonColor='#1abc9c' title="My Tasks" onPress={() => {this.onClickNewRemind()}} size={45}>
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
     /*  let user = {
        phone: "0666406835",
        name: "cornelius",
        status: "One step ahead the world",
        age: "21",
        nickname: "corneliusthefirst",
        email: "ndeffo.jugal98@gmail.com",
        created_at: "",
        updated_at: "",
        password:"jugal98",
        profile:"",
        profile_ext:""
      }; 
      stores.LoginStore.setUser(user).then(()=>{console.warn("user added")})*/

    /* stores.Reminds.removeRemind("newRemindId").then((R1)=>{
    console.warn("first deleted",R1)
  });*/