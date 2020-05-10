import React, { Component } from "react";
import { View, Vibration,FlatList, TouchableWithoutFeedback, Dimensions, TouchableOpacity,PermissionsAndroid,ScrollView} from 'react-native';

import {
  Card,CardItem,Text,Label,Spinner,Button,Container,Icon,Thumbnail,Title, Item} from 'native-base';
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import Contacts from 'react-native-contacts';
import BleashupFlatList from '../../BleashupFlatList';
import GState from '../../../stores/globalState/index';
import CacheImages from '../../CacheImages';
import stores from "../../../stores";
import { functionDeclaration } from "@babel/types";
import testForURL from '../../../services/testForURL';
import {find,uniqBy,uniq,filter,concat,reject,uniqWith,findIndex} from "lodash";
import request from '../../../services/requestObjects';
import autobind from "autobind-decorator";
import Invite from './invite';
import moment from "moment";
import ColorList from '../../colorList';
import countries from '../login/countries';
import ProfileView from "../invitations/components/ProfileView";
import CreateRequest from '../event/createEvent/CreateRequester';
import firebase from 'react-native-firebase';
import shadower from "../../shadower";
import BeNavigator from "../../../services/navigationServices";

var uuid = require('react-native-uuid');
uuid.v1({
  node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
  clockseq: 0x1234,
  msecs: new Date().getTime(),
  nsecs: Math.floor(Math.random() * 5678) + 50
});





let { height, width } = Dimensions.get('window');
export default class ContactView extends Component{
constructor(props){
  super(props)
  this.state={
      isMount:false,
      contacts:[],
      user:null,
      invite:false,
      alreadyCreated:false,
      searchArray:[],
      creating:false,
  }
  
}  

codeObj=find(countries,{id: stores.LoginStore.user.country_code})

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

    //first push contacts from contacts store
    stores.Contacts.contacts.forEach((contact)=>{
        if(contact.phone){
          let phoneUser = {nickname:"",phone:contact.phone,profile:"",status:"",found:true}
          this.array.push(phoneUser);
         }
    })

    //then push those from the phone
    contacts.forEach((contact)=>{
      var phoneUser = {nickname:contact.displayName,phone:"",profile:contact.thumbnailPath,status:"",found:false}
      contact.phoneNumbers.forEach((subcontact)=>{
         subcontact.number.charAt(0)!="+" ? subcontact.number = "00"+this.codeObj.code+subcontact.number:subcontact.number = subcontact.number.replace("+","00");
         phoneUser.phone = subcontact.number;
         this.array.push( phoneUser); 
      })
    })
    this.setState({contacts:uniqBy(this.array,'phone')});
    this.setState({searchArray:this.state.contacts});

}






invite = ()=>{
  /*.catch(e => {
    alert("Unable To Verify Your Account", "Please Check Your Internet Connection")
    //console.warn(e, "errr here!!!")
  })*/
  //this.setState({invite:true});
}

findIn = (arrayOfObjects,object)=>{
   // //console.warn("here bro",arrayOfObjects,object);
    arrayOfObjects.forEach((element)=>{
        if(element.phone == object.phone){
          return true;
        }
    })
    return false;
}

createRelation = (user)=>{
 
  this.setState({alreadyCreated:false});
  stores.Events.readFromStore().then((events) =>{
      relations =  filter(events,{type:"relation"});
      currentUser = stores.LoginStore.user;

      relations.forEach(relation => {
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
         let opponent = request.Participant();
         opponent.phone =  user.phone;
         opponent.master = true;
         relation.participant.push(opponent);


        //supply it an id 
        var arr = new Array(32);
        let num = Math.floor(Math.random() * 16)
        uuid.v1(null, arr, num);
        let New_id = uuid.unparse(arr, num);
        //give this id to the relation
        relation.id = New_id;
        console.warn("relation is",relation);
        //stores.Events.addEvent(relation).then(()=>{});
        //CreateRequest.createEvent(relation).then((res) => {})
       
        CreateRequest.createEvent(relation).then((res) => {
          console.warn("res here",res)
          stores.Events.delete("newEventId").then(() => {
            console.warn("newEventId deleted")
            firebase.database().ref(`rooms/${res.id}/${res.id}`).set({ name: 'General', members: res.participant }).then(() => {
              console.warn("room created",res)
              this.setState({creating: false })
              BeNavigator.navigateToActivity('EventChat',res)
             
            })
          });
        }).catch(() => {
          this.setState({
            creating: false
          })
        })

     }else{
       this.setState({alreadyCreated:false})
     }
  })


}


updateContact = (user)=>{
  let index = findIndex(this.state.searchArray, {phone: user.phone});
  this.state.searchArray[index].nickname = user.nickname;
  this.state.searchArray[index].profile = user.profile;
  this.state.searchArray[index].status = user.status;

  //console.warn("contacts are hmm",this.state.searchArray)
}

searchUser = ()=>{
  //console.warn("here")
  this.props.navigation.navigate('SearchUser',{userdata:this.state.searchArray});
}



render(){
    return (
      <View style={{ flex:1,backgroundColor: ColorList.bodyBackground,flexDirection:"column",width:"100%"}}>
        
         <View style={{height:"8%" }}>
                
                 <View style={{height:ColorList.headerHeight,width:"100%",flexDirection:"row",alignItems:"center",...bleashupHeaderStyle}}>
              
                 <View style={{width:"85%",paddingLeft:"4%",flexDirection:"row",alignItems:"center"}}>
                 <Icon name="arrow-back" active={true} type="MaterialIcons" style={{ color: ColorList.headerIcon }} onPress={() => this.props.navigation.navigate("Home")} />
                 <Text style={{fontSize:ColorList.headerFontSize,fontWeight:"bold",marginLeft:"7%"}}>Contacts</Text>
                 </View>

                 <View style={{width:"15%"}}>
                   <TouchableOpacity>
                   <Icon name="search"  type="EvilIcons" style={{ color: ColorList.headerIcon }} onPress={this.searchUser} />
                   </TouchableOpacity>
                 </View>
              
                 
                 </View>

         </View>

        
        <TouchableOpacity style={{height:"9%"}} onPress={() => this.props.navigation.navigate("NewContact")} >  
       
        <View style={{flex:1,width:"100%",paddingLeft:"2%",flexDirection:"row",alignItems:"center"}} >
            <View style={{width:45,height:45,alignItems:"center",justifyContent:"center",marginLeft:"2%"}} >
               <Icon name="adduser" active={true} type="AntDesign" style={{ color: ColorList.bodyIcon,paddingRight:6 }} />
            </View>
            <View style={{marginLeft:"4%"}}>
               <Text>New Contact</Text>
            </View>
        </View>
  
        </TouchableOpacity> 

        <TouchableOpacity style={{height:"8%"}} onPress={this.invite} >  
        <View style={{flex:1,width:"100%",paddingLeft:"2%",flexDirection:"row",alignItems:"center"}} >
            <View style={{width:width/8,height:height/16,borderRadius:32,alignItems:"center",justifyContent:"center",marginLeft:"2%"}} >
               <Icon name="sharealt" active={true} type="AntDesign" style={{ color: ColorList.bodyIcon,paddingRight:6 }} />
            </View>
            <View style={{marginLeft:"4%"}}>
               <Text>Invite Friends</Text>
            </View>
        </View>
  
        </TouchableOpacity>  

        <View style={{height:"5%",justifyContent:"center",alignItems:"flex-end",paddingRight:"5%"}}>
           {this.state.creating ? <Spinner></Spinner>:null}
        </View>

      {this.state.isMount? 
        <View style={{height:"70%",paddingLeft:"2%"}}>
       
               <BleashupFlatList
                    initialRender={15}
                    renderPerBatch={15}
                    style={{backgroundColor:ColorList.bodyBackground}}
                    firstIndex={0}
                    extraData={this.state}
                    keyExtractor={(item,index)=>item.phone}
                    dataSource={this.state.contacts}
                    noSpinner = {true}
                    renderItem={(item,index) =>{

                      this.delay = this.delay >= 15 ? 0:this.delay + 1
                      ////console.warn(user);

                   return(

                    <View style={{ height:60,width: "100%",paddingLeft:"1.3%" }}>
                      <ProfileView contact phoneInfo={item} delay={this.delay} phone={item.phone} updateContact={this.updateContact} action={this.createRelation} ></ProfileView>
                    </View>
                     
                     )
                    }
                    }

                >
                </BleashupFlatList>
                    <Invite isOpen={this.state.invite} onClosed={()=>{this.setState({invite:false})}} />
             </View>
            :<Spinner></Spinner>}





        </View>
    );
}

}














































/**                      <View style={{flexDirection:"row",margin:"3%",width:"100%",height:50}}>
                      <View style={{width:width/6,height:50}}>
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
     
                        <TouchableOpacity onPress={()=>{this.createRelation(item)}}>
                         <View style={{flexDirection:"column",width:width-width/5,height:50}}>
                                <Title style={{alignSelf:"flex-start"}}>{item.nickname}</Title>
                                <Title style={{color:"gray",alignSelf:"flex-start",fontSize:15}}>{item.status}</Title>
                         </View>
                        </TouchableOpacity>
                    </View>
                         */


















/**        <View style={  this.state.user!=null?
          <View style={{flexDirection:"row",margin:"3%",width:"100%"}}>
          <View style={{width:"17%",marginLeft:"2%"}}>
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
        </View>:{flexDirection:"column",height:height - height/19,width:"100%"}}> */































































/**
 *                  
 */


/**
 *       stores.LoginStore.getUser().then((user)=>{
        //console.warn(user);
        this.users.push(user);
        //console.warn(this.users);
       stores.TemporalUsersStore.addUser(user).then(()=>{
          //console.warn("here bro")
          stores.TemporalUsersStore.loadFromStore().then((users)=>{
               //console.warn("users are :",users)
               
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
         ////console.warn("user is",user);
         return user;
      }
     
   })

   return user;
 // });

}
 */