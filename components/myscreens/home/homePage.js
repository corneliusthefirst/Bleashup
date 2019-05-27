import React, { Component } from "react";
import { Image,View,TouchableHighlight } from "react-native";
import {
  Container,
  Header,
  Title,
  Button,
  Content,
  Icon,
  Text,
  Footer,
  FooterTab,
  Tabs,
  Tab,
  Right,
  Left,
  Body
} from "native-base";
import Status from "./../status/index";
import InvitationView from "./../invitations/index";
import PersonalEventView from "./../personalevents/index";
import Settings from "./../settings/index";




class Home extends Component {
  render() {
    return (
      <Container style = {{
        backgroundColor:"lightgreen",borderTopColor:"darkgreen" }} >
        <Header hasTabs>
          <Body>
            <Title> Bleashup </Title>
          </Body>
          
          <TouchableHighlight style = {{
                 marginRight: 10  }} 
                 underlayColor='tomato'
                >

               <Image 
               active="true"
               source={require('./../../resource/ic_my_setting_selected.png')}
                 style = {{width:35,height:35,borderRadius:24,marginLeft:0,marginTop:10}}
                 
                 />
               </TouchableHighlight>
          
          
        </Header>   
       
       
        <TouchableHighlight style = {{
                 justifyContent:'flex-end',flexDirection:'row' ,marginTop:-10,marginRight:43 }} 
                 underlayColor='tomato'
                >

               <Image 
               active="true"
               source={require('./../../resource/ic_tab_my_select.png')}
                 style = {{width:35,height:35,borderRadius:24,marginLeft:0,marginTop:8,marginBottom:8}}
                 
                 />
               </TouchableHighlight> 

       
        <TouchableHighlight style = {{
                 justifyContent:'flex-end',flexDirection:'row' ,marginTop:-45,marginRight:164 }} 
                 underlayColor='tomato'
                >

               <Image 
               active="true"
               source={require('./../../resource/ic_myphoto_news.png')}
                 style = {{width:35,height:35,borderRadius:24,marginLeft:10,marginTop:5}}
                 
                 />
               </TouchableHighlight> 

               <TouchableHighlight style = {{
                 justifyContent:'flex-start',flexDirection:'row' ,marginTop:-45 }} 
                 underlayColor='tomato'
                >

               <Image 
               active="true"
               source={require('./../../resource/ic_search_history.png')}
                 style = {{width:35,height:35,borderRadius:24,marginLeft:40,marginTop:7,marginBottom:5}}
                 
                 />
               </TouchableHighlight> 












      
        <Tabs>
          <Tab heading="Events" 
         tabStyle={{borderRadius:2}}
         textStyle={{color: '#fff'}} 
         activeTabStyle={{backgroundColor: 'lightgreen'}} 
         activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
            <PersonalEventView />
          </Tab>

          <Tab heading="Invitations"
           tabStyle={{borderRadius:2}}
           textStyle={{color: '#fff'}} 
           activeTabStyle={{backgroundColor: 'lightgreen'}} 
           activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
            <InvitationView />
          </Tab>

          <Tab heading="Status"
           tabStyle={{borderRadius:2}} 
         textStyle={{color: '#fff'}} 
         activeTabStyle={{backgroundColor: 'lightgreen'}} 
         activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
            <Status />
          </Tab>


        </Tabs>
        
           
         







           

           


      </Container>
    );
  }
}

export default Home;






















































































/*
<Left>
<Icon
  active="true"
  style={{
    color: "antiquewhite"
  }}
  type="Foundation"
  name="home"
  onPress={() => this.props.navigation.openDrawer()}
/>
</Left>

 onPress = {this._onPressAdd}
*/