import React, { Component } from "react";
import {
  Content,
  Card,
  CardItem,
  Text,
  Body,
  Container,
  Header,
  Form,
  Title,
  Input,
  Left,
  Right,
  H3,
  Spinner,
  Button
} from "native-base";
import { Image } from "react-native";

import { observer } from "mobx-react";
import styles from "./styles";
import stores from "../../../stores";
import routerActions from "reazy-native-router-actions";
import initialRoute from "../invitations/components/initialRoute";
import globalState from "../../../stores/globalState";
import ServerEventListener from "../../../services/severEventListener";
import connection from "../../../services/tcpConnect";
import UpdatesDispatcher from "../../../services/updatesDispatcher";
export default class LoginHomeView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    routeName = initialRoute.routeName;
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
    );
  }
}
