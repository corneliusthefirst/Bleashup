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
  Item,
  Title,
  Input,
  Left,
  Right,
  H3,
  Spinner,
  Button
} from "native-base";
import { Image } from "react-native";

import { AsyncStorage } from "react-native";
import { observer, extendObservable, inject } from "mobx-react";
import styles from "./styles";
import stores from "../../../stores";
import routerActions from "reazy-native-router-actions";
import initialRoute from '../../initialRoute'
import globalState from "../../../stores/globalState";

import { Email, Item, Span, A, renderEmail } from 'react-html-email'

@observer
export default class LoginHomeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    initialRoute.initialRoute()

    if(globalState.loading = true){
      routeName = initialRoute.routeName
      console.warn(routeName,'***')
     // this.props.navigation.navigate(routeName)
      globalState.loading = false
    }


  }

 

  render() {
    globalState.loading = true
    
 
    const emailHTML = renderEmail(
      <Email title="Hello World!">
        <Item align="center">
          <Span fontSize={20}>
            This is an example email made with:
            <A href="https://github.com/chromakode/react-html-email">react-html-email</A>.
          </Span>
        </Item>
      </Email>
    )
   
    
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
         <Text>emailHTML</Text>

        </Content>
      </Container>
    );
  }
}
