import React, { Component } from "react";
import {
  Container,
} from "native-base";
import { Text, View, PermissionsAndroid } from 'react-native';
import initialRoute from "../invitations/components/initialRoute";
import globalState from "../../../stores/globalState";
import connection from "../../../services/tcpConnect";
import rnFetchBlob from 'rn-fetch-blob';
import Waiter from "./Waiter";
import Voter from "../eventChat/Voter";
import GState from '../../../stores/globalState/index';
import BeNavigator from '../../../services/navigationServices';
import AnimatedComponent from '../../AnimatedComponent';
const AppDir = rnFetchBlob.fs.dirs.SDCardDir + '/Bleashup'
const PhotoDir = AppDir + '/Photo'
const SounDir = AppDir + '/Sound'
const VideoDir = AppDir + '/Video'
const OthersDir = AppDir + '/Others'
const { fs } = rnFetchBlob
export default class LoginHomeView extends AnimatedComponent   {
  constructor(props) {
    super(props);
    GState.nav = this.props.navigation
    this.state = {
      vote: {
        id: "1",
        always_show:true,
        title: 'My First Poll',
        description: `When you set up Facebook Login or change it and have made a mistake in the setup, you will get an error message when signing in or login in with Facebook. There are different error messages depending on what the issue is.

In this article, we show you how to solve the error message “URL blocked: This redirect failed because the redirect URI is not white-listed in the app's client OAuth settings. Make sure that the client and web OAuth logins are on and add all your app domains as valid OAuth redirect URIs.“ `,
        options: [{ name: "Yes,Do It", vote_count: 0, index: 0 }, { name: 'No, Stop It', vote_count: 0, index: 1 }, { name: 'None , I Don,t Know ', vote_count: 0 }],
        voters: [{ phone: "00237698683806", index: 0 }],
      }
    }
  }
  state = {}
  async requestReadAndWritePermission(){
   // const pers =  await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE	,{title:"Write To Storage Permission",
  //  message:"Bleashup Wants to write to disk"})
  //  if(pers == PermissionsAndroid.RESULT.GRANTED){
      fs.exists(AppDir).then(status => {
        if (!status) {
          fs.mkdir(AppDir).then(() => {
            fs.mkdir(PhotoDir).then(() => {
              fs.mkdir(SounDir).then(() => {
                fs.mkdir(VideoDir).then(() => {
                  fs.mkdir(OthersDir).then(() => {
                    console.warn("all dirs created")
                  })
                })
              })
            })
          })
        }
      })
   // }else{
   //   console.warn("permission deneid")
   // }
  }
   

componentDidMount(){}


  render() {
  //console.disableYellowBox = true;
    this.requestReadAndWritePermission()
  /*return (
     <Container>
        <ChatRoom newMessageNumber={10} firebaseRoom={"message"}></ChatRoom>
      </Container>

    )*/
    routeName = initialRoute.routeName;
       if ((globalState.loading = true)) {
         initialRoute.initialRoute().then(route => {
           if(route !== "Login"){
             connection.init().then(socket => {
               globalState.loading = false;
               BeNavigator.navigateTo(route);
             }).catch((error) => {
               GState.connected = false
               console.warn("error while connecting socket",error)
             })
             setTimeout(() => BeNavigator.navigateTo(route), 500)
           }else{
             globalState.loading = false;
             BeNavigator.navigateTo(route);
           }
         });
       }
       /*globalState.loading = true;*/
       return (
         <Container style={{}}>
             {globalState.loading ? (
            <Waiter></Waiter>
             ) : (
                 <Text> Waiting ... </Text>
               )}
         </Container>
         
       );

      /* return <Voter voteItem={(item) => {
         this.setState({
           vote:item.vote
          })
       }} message={{vote:this.state.vote}} showVoters={(members) => {
         //todo: call chatroom show members method with this members as participants 
       }}></Voter>*/
  }
}
