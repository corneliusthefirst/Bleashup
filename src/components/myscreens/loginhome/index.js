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
   <ChatRoom></ChatRoom>
   )
   /*  routeName = initialRoute.routeName;
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