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
import { Image, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from "react-native";

import { observer } from "mobx-react";
import stores from "../../../stores";
import Menu, { MenuDivider } from 'react-native-material-menu';
import routerActions from "reazy-native-router-actions";
import initialRoute from "../invitations/components/initialRoute";
import globalState from "../../../stores/globalState";
import ServerEventListener from "../../../services/severEventListener";
import connection from "../../../services/tcpConnect";
import UpdatesDispatcher from "../../../services/updatesDispatcher";
import { ScrollView } from 'react-navigation';
import TextMessage from "../eventChat/TextMessage";
import PhotoMessage from "../eventChat/PhotoMessage";
import AudioMessage from "../eventChat/AudioMessage";
export default class LoginHomeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sender: false,
      splicer: 500,
      creator: true,
      message: {
        sender: {
          phone: 2,
          nickname: "Sokeng Kamga"
        },
        photo: "https://resize-parismatch.lanmedia.fr/r/625,417,center-middle,ffffff/img/var/news/storage/images/paris-match/people/maitre-gims-a-bord-d-un-bateau-en-flammes-en-corse-1643621/26825558-1-fre-FR/Maitre-Gims-a-bord-d-un-bateau-en-flammes-en-Corse.jpg",
        created_at: "2014-03-30 12:32",
        text: `Hello!`
      }
    };
  }
  state = {
    sender: false,
    showTime: true
  }

  render() {
    return (
      <Container>
        <Content>
       <PhotoMessage user={1} creator={2} message={this.state.message}></PhotoMessage>
        <TextMessage user={2} creator={2} message={this.state.message}></TextMessage>
        <AudioMessage></AudioMessage>
      </Content>
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
            setTimeout(() => this.props.navigation.navigate(route), 5000)
          }else{
            globalState.loading = false;
            this.props.navigation.navigate(route);
          }
        });
      }
      globalState.loading = true;
      return (
        <Container>
          <Content>
            <Left />
            <Header style={{ marginBottom: 450 }}>
              <Body>
                <Title>BleashUp </Title>
              </Body>
              <Right />
            </Header>
  
            {globalState.loading ? (
              <Spinner color="#1FABAB" style={{ marginTop: -175 }} />
            ) : (
                <Text> Waiting ... </Text>
              )}
          </Content>
  
        </Container>
      );*/
  }
}
//TODO: separate these out. This is what happens when you're in a hurry!
const styles = StyleSheet.create({

  //ChatView

  outer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },

  messages: {
    flex: 1
  },

  //InputBar

  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 3,
  },

  textBox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10
  },

  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
    marginLeft: 5,
    paddingRight: 15,
    borderRadius: 5,
    backgroundColor: '#66db30'
  },

  //MessageBubble

  messageBubble: {
    borderRadius: 5,
    marginTop: 8,
    marginRight: 10,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    flex: 1
  },

  messageBubbleLeft: {
    backgroundColor: '#d5d8d4',
  },

  messageBubbleTextLeft: {
    color: 'black'
  },

  messageBubbleRight: {
    backgroundColor: '#66db30'
  },

  messageBubbleTextRight: {
    color: 'white'
  },
})
