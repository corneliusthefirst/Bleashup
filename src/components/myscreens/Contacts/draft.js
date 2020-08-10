import React, { Component } from "react";
import { 
  View,
  Text, 
  TouchableWithoutFeedback, 
  Dimensions, 
  TouchableOpacity, 
  PermissionsAndroid, 
  ScrollView, 
  Image, 
  StyleSheet } from 'react-native';

import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import Contacts from 'react-native-contacts';
import BleashupFlatList from '../../BleashupFlatList';
import GState from '../../../stores/globalState/index';
import CacheImages from '../../CacheImages';
import stores from "../../../stores";
import testForURL from '../../../services/testForURL';
import {find,uniq,} from "lodash";
import request from '../../../services/requestObjects';
import Invite from './invite';
//import CreateRequest from '../event/createEvent/CreateRequester';
import ProfileView from "../invitations/components/ProfileView"
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import rounder from "../../../services/rounder";






let { height, width } = Dimensions.get('window');
export default class ContactView extends Component{
constructor(props){
  super(props)
  this.state={
      isMount:false,
      contacts:null,
      user:null,
      invite:false,
      alreadyCreated:false
  }
}  

init = ()=>{

    setTimeout(() => {

      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          'title': 'Contacts',
          'message': 'Bleashup would like to view your contacts.',
          'buttonPositive': 'Please accept bare mortal'
        }
      ).then(() => {
        Contacts.getAll((err, contacts) => {
          if (err === 'denied'){
            // error
          } else {
             this.getValidUsers(contacts)
             this.setState({isMount:true})
          }
        })
      })

     
  }, 500)
   
  }
componentDidMount(){
    this.init();
    
}

array = [];
getValidUsers(contacts){
   console.warn("contacts",contacts,"array",this.array)
   contacts.forEach((contact)=>{
      contact.phoneNumbers.forEach((subcontact)=>{
         if(subcontact.number.charAt(0)!="+"){
           subcontact.number = "+33"+subcontact.number;
          }
           this.array.push(subcontact.number);
      })
   })
   console.warn("contacts",contacts,"array",this.array)

   stores.Contacts.readFromStore().then((store_contacts)=>{
     store_contacts.forEach((contact)=>{
        this.array.push(contact.phone);
     })
   })
 console.warn("array",this.array)
   this.array = uniq(this.array);
   var i=0;
   var phoneArray = []
   this.array.forEach((phone)=>{
     obj = {id:i,phone:phone}
     phoneArray.push(obj);
     i++;
  })
  console.warn("phonearray",phoneArray);
  this.setState({contacts:phoneArray});

}


invite = ()=>{
  this.setState({invite:true});
}

findIn = (arrayOfObjects,object)=>{
   // console.warn("here bro",arrayOfObjects,object);
    arrayOfObjects.forEach((element)=>{
        if(element.phone == object.phone){
          return true;
        }
    })
    return false;
}

createRelation = (user)=>{
  /*this.setState({alreadyCreated:false});
  stores.Events.readFromStore().then((events) =>{
      relations =  filter(events,{type:"relation"});
      currentUser = stores.LoginStore.user;
      //console.warn(relations);
     //console.warn(user,currentUser)
     //console.warn(events)
     relations.forEach(relation => {
         //add new participant
         //stores.Events.addParticipant(relation.id,user,false).then(()=>{console.warn("partipant updated")}); 
         if(this.findIn(relation.participant,currentUser)&&this.findIn(relation.participant,user)){
             this.setState({alreadyCreated:true});
             console.warn("relation exist");
         }
     });
     
     if(!this.state.alreadyCreated){
        let relation = request.Event();
        //set it type
        relation.type = "relation";
        //push participants
        relation.participant = [];
        let participant = request.Participant();
        participant.phone = currentUser.phone;
        participant.status = currentUser.status;
        relation.participant.push(participant1);
        participant.phone = user.phone;
        participant.status = user.status;
        relation.participant.push(participant);
        //supply it an id 
        var arr = new Array(32);
        let num = Math.floor(Math.random() * 16)
        uuid.v1(null, arr, num);
        let New_id = uuid.unparse(arr, num);
        //give this id to the relation
        relation.id = New_id;
        //add the new highlights to global highlights
        relation.creator_phone = currentUser.phone;
        relation.created_at = moment().format();
        //console.warn(relation);
        stores.Events.addEvent(relation).then(()=>{});
        //CreateRequest.createEvent(relation).then((res) => {})
     }else{
       this.setState({alreadyCreated:false})
     }

  })*/


}






defaultImage = require("../../../../Images/images.jpeg")
render(){
  //contacts = this.state.contacts;
  //console.warn("here boy",this.state.contacts)
    return (
      <View style={{ backgroundColor: "#FEFFDE",flexDirection:"column",width:width }}>
         <View style={{ height:40, }}>
           <View style={{
                ...bleashupHeaderStyle,
                
              }}>
                 <View style={{flexDirection:"row",width:width/3,marginLeft:width/25,justifyContent:"space-between",alignItems:"center"}}>
                 <MaterialIcons name="arrow-back" active={true} type="MaterialIcons" style={{ color: "#1FABAB", }} onPress={() => this.props.navigation.navigate("Home")} />
                 <Text style={{fontSize:18,fontWeight:"bold",marginLeft:"16%"}}>Contacts</Text>
                 </View>
          </View>
         </View>
         { this.state.isMount? 
        <View style={  this.state.user!=null?
          <View style={{flexDirection:"row",margin:"3%",width:"100%"}}>
          <View style={{width:"17%"}}>
          <TouchableWithoutFeedback onPress={() => {
                 requestAnimationFrame(() => {
                     GState.showingProfile = true
                     setTimeout(() => {
                         GState.showingProfile = false
                     }, 50)
                 });
             }}>
                 {this.state.user.profile && testForURL(this.state.user.profile) ? <CacheImages small thumbnails {...this.props}
                     source={{ uri:this.state.user.profile}} /> :
                     <Image  resizeMode={"contain"} style={styles.smallThumnail} source={this.defaultImage} ></Image>}
             </TouchableWithoutFeedback>
             </View>

             <View style={{flexDirection:"column",width:"82%"}}>
                    <Text style={{alignSelf:"flex-start"}}>{this.state.user.nickname}</Text>
                    <Text style={{color:"gray",alignSelf:"flex-start",fontSize:15}}>{this.state.user.status}</Text>
             </View>
        </View>:{flexDirection:"column",height:height - height/19,width:"100%"}}>

        <TouchableOpacity style={{flex:1}} onPress={() => this.props.navigation.navigate("NewContact")} >  
        <View style={{flex:1,flexDirection:"row",alignItems:"center"}} >
            <View style={{width:width/8,height:height/16,borderRadius:32,backgroundColor:"#1FABAB",alignItems:"center",justifyContent:"center",marginLeft:"2%"}} >
               <MaterialIcons name="person-add" active={true} type="MaterialIcons" style={{ color: "#FEFFDE",paddingRight:6 }} />
            </View>
            <View style={{marginLeft:"5%"}}>
               <Text>New Contact</Text>
            </View>
        </View>
  
        </TouchableOpacity> 

        <TouchableOpacity style={{flex:1}} onPress={this.invite} >  
        <View style={{flex:1,flexDirection:"row",alignItems:"center"}} >
            <View style={{width:width/8,height:height/16,borderRadius:32,alignItems:"center",justifyContent:"center",marginLeft:"2%"}} >
               <MaterialIcons name="share" active={true} type="MaterialIcons" style={{ color: "#1FABAB",paddingRight:6 }} />
            </View>
            <View style={{marginLeft:"5%"}}>
               <Text>Invite Friends</Text>
            </View>
        </View>
  
        </TouchableOpacity>  

        <View style={{flex:8}}>
       
               <BleashupFlatList
                    initialRender={10}
                    renderPerBatch={5}
                    style={{backgroundColor:"#FEFFDE"}}
                    firstIndex={0}
                    //extraData={this.state}
                    keyExtractor={(item,index)=>item.id}
                    dataSource={this.state.contacts}
                    noSpinner = {true}
                    renderItem={(item,index) =>{
                    
                    console.warn(item);

                   return(
                        <View style={{width:width,height:60}}>
                          <ProfileView phone={item.phone}></ProfileView>  
                        </View>
                      )
                    }
                    }

                >
                </BleashupFlatList>
                    <Invite isOpen={this.state.invite} onClosed={()=>{this.setState({invite:false})}} />
             </View>

         </View>
         :null}
        </View>
    );
}

}

const styles = StyleSheet.create({
  smallThumnail:{
    ...rounder(20)
  }
})