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
  Text,
  H3,
  Spinner,
  Button
} from "native-base";
import {
    View,
    ImageBackground
} from 'react-native';

import initialRoute from "../invitations/components/initialRoute";
import globalState from "../../../stores/globalState";
import ServerEventListener from "../../../services/severEventListener";
import connection from "../../../services/tcpConnect";
import UpdatesDispatcher from "../../../services/updatesDispatcher";
import ChatRoom from "../eventChat/ChatRoom";
export default class LoginHomeView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
  return (
  <ImageBackground resizeMode={"contain"} source={require("../../../../assets/Bleashup.png")} style={{ width: null, height: null, backgroundColor: "#FEFFDE",}}>
      <ChatRoom></ChatRoom>
    </ImageBackground>
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