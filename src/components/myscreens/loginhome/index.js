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
import { Button, PermissionsAndroid, Platform, SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import initialRoute from "../invitations/components/initialRoute";
import globalState from "../../../stores/globalState";
import ServerEventListener from "../../../services/severEventListener";
import connection from "../../../services/tcpConnect";
import UpdatesDispatcher from "../../../services/updatesDispatcher";
import ChatRoom from "../eventChat/ChatRoom";
import rnFetchBlob from 'rn-fetch-blob';

export default class LoginHomeView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.disableYellowBox = true;
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

const styles = StyleSheet.create({
  slider: {
    height: 10,
    margin: 10,
    marginBottom: 50,
  },
  settingsContainer: {
    alignItems: 'center',
  },
  container: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  errorMessage: {
    fontSize: 15,
    textAlign: 'center',
    padding: 10,
    color: 'red'
  }
});