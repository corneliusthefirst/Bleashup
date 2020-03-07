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
const AppDir = rnFetchBlob.fs.dirs.SDCardDir + '/Bleashup'
const PhotoDir = AppDir + '/Photo'
const SounDir = AppDir + '/Sound'
const VideoDir = AppDir + '/Video'
const OthersDir = AppDir + '/Others'
const { fs } = rnFetchBlob
export default class LoginHomeView extends Component {
  constructor(props) {
    super(props);
  }
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
  render() {
  //console.disableYellowBox = true;
    this.requestReadAndWritePermission()
  /*return (
     <Container>
        <ChatRoom newMessageNumber={10} firebaseRoom={"message"}></ChatRoom>
      </Container>

    )*/
     /*routeName = initialRoute.routeName;
       if ((globalState.loading = true)) {
         initialRoute.initialRoute().then(route => {
           if(route !== "Login"){
             connection.init().then(socket => {
               globalState.loading = false;
               this.props.navigation.navigate(route);
             })
             setTimeout(() => this.props.navigation.navigate(route), 500)
           }else{
             globalState.loading = false;
             this.props.navigation.navigate(route);
           }
         });
       }
       globalState.loading = true;*/
       /*return (
         <Container style={{}}>
             {globalState.loading ? (
            <Waiter></Waiter>
             ) : (
                 <Text> Waiting ... </Text>
               )}
         </Container>
         
       );*/

       return <Voter></Voter>
  }
}
