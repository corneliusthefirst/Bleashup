import React, { Component } from "react";
import { Image,View,TouchableHighlight } from "react-native";
import { Content,Tabs,Tab, Card, CardItem, Text, Body, Container } from "native-base";
import CurrentEventView from "./../currentevents/index";
import PastEventView from "./../pastevents/index";
import PotesChat from "./../poteschat/index";



export default class PersonalEventView extends Component {
  render() {
    return (
    <Container>
     
<Tabs  tabBarPosition='bottom'
           
          
>
    <Tab heading="CurrentEvents"  
    tabStyle={{marginBottom:0}} 
     textStyle={{color: '#fff'}} 
     activeTabStyle={{backgroundColor: 'lightgreen'}} 
     activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>

   <CurrentEventView/>
   </Tab>

    <Tab heading="Poteschat"
     tabStyle={{borderRadius:2}} 
     textStyle={{color: '#fff'}} 
     activeTabStyle={{backgroundColor: 'lightgreen'}} 
     activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
    <PotesChat/>
    </Tab>

    <Tab heading="PastEvents"
     tabStyle={{borderRadius:2}} 
     textStyle={{color: '#fff'}} 
     activeTabStyle={{backgroundColor: 'tomato'}} 
     activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
      <PastEventView />
    </Tab>
</Tabs>



       
        <TouchableHighlight style = {{
                 justifyContent:'flex-end',flexDirection:'row' ,marginTop:-5,marginRight:164 }} 
                 underlayColor='tomato'
                >

               <Image 
               active="true"
               source={require('./../../resource/ic_account_wechat.png')}
                 style = {{width:45,height:35,borderRadius:24,marginLeft:55,marginTop:10}}
                 
                 />
               </TouchableHighlight> 

   


</Container>
    );
  }
}
