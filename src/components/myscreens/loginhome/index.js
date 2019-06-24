import React, { Component } from "react";
import autobind from "autobind-decorator";
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
import initialRoute from '../../initialRoute'
import globalState from "../../../stores/globalState";



@observer
export default class LoginHomeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    initialRoute.initialRoute()


  }

 

  render() {
    globalState.loading = true
 
    
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

          {globalState.loading ? (<Spinner color="#1FABAB" style={{marginTop:-175}} />) : (<Text> </Text>)}
           

        </Content>
      </Container>
    );
  }
}
