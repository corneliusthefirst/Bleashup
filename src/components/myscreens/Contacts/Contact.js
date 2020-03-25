import React, { Component } from "react";
import { View, Vibration,FlatList, TouchableWithoutFeedback, Dimensions, TouchableOpacity,PermissionsAndroid,ScrollView} from 'react-native';

import {
  Card,CardItem,Text,Label,Spinner,Button,Container,Icon,Thumbnail,Title, Item
} from 'native-base';
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import Contacts from 'react-native-contacts';
import BleashupFlatList from '../../BleashupFlatList';
import GState from '../../../stores/globalState/index';
import CacheImages from '../../CacheImages';
import stores from "../../../stores";
import { functionDeclaration } from "@babel/types";
import testForURL from '../../../services/testForURL';
import {find,uniqBy,uniq} from "lodash";
import autobind from "autobind-decorator";
import Invite from './invite';

let { height, width } = Dimensions.get('window');
export default class ContactView extends Component{
constructor(props){
  super(props)
  this.state={
      isMount:false,
      contacts:null,
      user:null,
      invite:false
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


getValidUsers(contacts){
   var array=[]
   contacts.forEach((contact)=>{
      contact.phoneNumbers.forEach((subcontact)=>{
         if(subcontact.number.charAt(0)!="+"){
           subcontact.number = "+33"+subcontact.number;
          }
           array.push(subcontact.number);
      })
   })
   array = uniq(array);
   //console.warn(array)
   userArray=[];
   //get valid users from temporal user store
   array.forEach((phone)=>{
     user = find(stores.TemporalUsersStore.Users, { phone: phone});
     if(user){
       userArray.push(user);
     }
   })
   
   this.setState({contacts:userArray});
   //console.warn(userArray)
}


invite = ()=>{
  this.setState({invite:true});
}









render(){
  //contacts = this.state.contacts;
  //console.warn("here boy",this.state.contacts)
    return (
      <Container style={{ backgroundColor: "#FEFFDE",flexDirection:"column",width:width }}>
         <View style={{ height:40, }}>
           <View style={{
                ...bleashupHeaderStyle,
                
              }}>
                 <View style={{flexDirection:"row",width:width/3,marginLeft:width/25,justifyContent:"space-between",alignItems:"center"}}>
                 <Icon name="arrow-back" active={true} type="MaterialIcons" style={{ color: "#1FABAB", }} onPress={() => this.props.navigation.navigate("Home")} />
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
                     <Thumbnail  small source={require("../../../../Images/images.jpeg")} ></Thumbnail>}
             </TouchableWithoutFeedback>
             </View>

             <View style={{flexDirection:"column",width:"82%"}}>
                    <Title style={{alignSelf:"flex-start"}}>{this.state.user.nickname}</Title>
                    <Title style={{color:"gray",alignSelf:"flex-start",fontSize:15}}>{this.state.user.status}</Title>
             </View>
        </View>:{flexDirection:"column",height:height - height/19,width:"100%"}}>

        <TouchableOpacity style={{flex:1}} onPress={() => this.props.navigation.navigate("NewContact")} >  
        <View style={{flex:1,flexDirection:"row",alignItems:"center"}} >
            <View style={{width:width/8,height:height/16,borderRadius:32,backgroundColor:"#1FABAB",alignItems:"center",justifyContent:"center",marginLeft:"2%"}} >
               <Icon name="person-add" active={true} type="MaterialIcons" style={{ color: "#FEFFDE",paddingRight:6 }} />
            </View>
            <View style={{marginLeft:"5%"}}>
               <Text>New Contact</Text>
            </View>
        </View>
  
        </TouchableOpacity> 

        <TouchableOpacity style={{flex:1}} onPress={this.invite} >  
        <View style={{flex:1,flexDirection:"row",alignItems:"center"}} >
            <View style={{width:width/8,height:height/16,borderRadius:32,alignItems:"center",justifyContent:"center",marginLeft:"2%"}} >
               <Icon name="share" active={true} type="MaterialIcons" style={{ color: "#1FABAB",paddingRight:6 }} />
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
                    keyExtractor={(item,index)=>item.recordID}
                    dataSource={this.state.contacts}
                    noSpinner = {true}
                    renderItem={(item,index) =>{
                    
                    //console.warn(user);

                   return(
                     
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
                             {item.profile && testForURL(item.profile) ? <CacheImages small thumbnails {...this.props}
                                 source={{ uri:item.profile}} /> :
                                 <Thumbnail  small source={require("../../../../Images/images.jpeg")} ></Thumbnail>}
                         </TouchableWithoutFeedback>
                         </View>
     
                         <View style={{flexDirection:"column",width:"82%"}}>
                                <Title style={{alignSelf:"flex-start"}}>{item.nickname}</Title>
                                <Title style={{color:"gray",alignSelf:"flex-start",fontSize:15}}>{item.status}</Title>
                         </View>
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

        </Container>
    );
}

}

/**
 *                  
 */


/**
 *       stores.LoginStore.getUser().then((user)=>{
        console.warn(user);
        this.users.push(user);
        console.warn(this.users);
       stores.TemporalUsersStore.addUser(user).then(()=>{
          console.warn("here bro")
          stores.TemporalUsersStore.loadFromStore().then((users)=>{
               console.warn("users are :",users)
               
          })
        })
      })   



users = [
  {
    phone: "+33623104297",
    name: "herve",
    status: "At home what a good day",
    age: "34",
    nickname: "herve",
    email: "herve@gmail.com",
    created_at: "",
    updated_at: "",
    password:"hervus",
    profile:"https://images.unsplash.com/photo-1500099817043-86d46000d58f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    profile_ext:""
  },
  {
    phone: "+143266489332",
    name: "Hken",
    status: "Designing the future",
    age: "21",
    nickname: "Hken",
    email: "Hken@gmail.com",
    created_at: "",
    updated_at: "",
    password:"hkenBoy",
    profile:"https://images.unsplash.com/photo-1478397453044-17bb5f994100?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    profile_ext:""
  },
  {
    phone: "+33683656312",
    name: "angel",
    status: "Cooking cakes is my passio",
    age: "23",
    nickname: "angel",
    email: "",
    created_at: "",
    updated_at: "",
    password:"angel",
    profile:"https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=581&q=80",
    profile_ext:""
  },
  {
    phone: "+237697712608",
    name: "Maurelle",
    status: "la go des wey fort",
    age: "",
    nickname: "Maurelle",
    email: "maurelle@gmail.com",
    created_at: "",
    updated_at: "",
    password:"",
    profile:"https://images.unsplash.com/photo-1496287437689-3c24997cca99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    profile_ext:""
  }
]

:
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
                                  {item.hasThumbnail && testForURL(item.thumbnailPath) ? <CacheImages small thumbnails {...this.props}
                                      source={{ uri:item.thumbnailPath}} /> :
                                      <Thumbnail  small source={require("../../../../Images/images.jpeg")} ></Thumbnail>}
                              </TouchableWithoutFeedback>
                              </View>
          
                              <View style={{flexDirection:"row",width:"82%",justifyContent:"space-between"}}>
                                     <Title style={{alignSelf:"flex-start"}}>{item.displayName}</Title>
                                     <TouchableOpacity onPress={this.invite}>
                                     <Text style={{fontWeight:"bold",color:"green",fontSize:18,marginRight:"15%"}}>invite</Text>
                                     </TouchableOpacity>
                              </View>

                             
                     </View>
checkUser(phoneNumbers){

  phoneNum = phoneNumbers
  phoneNum.forEach(phone => {
    if(phone.number.charAt(0)!="+"){
      phone.number = "+33"+phone.number;
    }
    //stores.TemporalUsersStore.getUser(phone.number).then((user)=>{
     user = find(stores.TemporalUsersStore.Users, { phone: phone.number });
    
      if(user){
         //console.warn("user is",user);
         return user;
      }
     
   })

   return user;
 // });

}
 */