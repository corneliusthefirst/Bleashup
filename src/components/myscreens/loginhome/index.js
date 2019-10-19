import React, { Component } from "react";
import {
  Content,
  Card,
  CardItem,
  Body,
  Container,
  Header,
  Form,
  Title,
  Input,
  Left,
  Right,
  Icon,
  H3,
  Spinner,
} from "native-base";
import { Text, View ,ImageBackground} from 'react-native';
import initialRoute from "../invitations/components/initialRoute";
import globalState from "../../../stores/globalState";
import ServerEventListener from "../../../services/severEventListener";
import connection from "../../../services/tcpConnect";
import UpdatesDispatcher from "../../../services/updatesDispatcher";
import ChatRoom from "../eventChat/ChatRoom";
import rnFetchBlob from 'rn-fetch-blob';
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
  render() {
    //console.disableYellowBox = true;
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
   return (
      <Container>
        <ChatRoom></ChatRoom>
      </Container>

    )
    /* routeName = initialRoute.routeName;
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
       globalState.loading = true;
       return (
         <Container>
         <ImageBackground resizeMode={"contain"} source={require("../../../../assets/Bleashup.png")} style={{ width: "100%", height: "100%", backgroundColor: "#FEFFDE", }}>
             {globalState.loading ? (
               <Spinner color="#FEFFDE" style={{ color:"#FEFFDE",marginTop: "96%",marginLeft: "8%", }} />
             ) : (
                 <Text> Waiting ... </Text>
               )}
         </ImageBackground>
         </Container>
         
       );*/
  }
}
