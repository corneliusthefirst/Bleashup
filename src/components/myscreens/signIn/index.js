import React, { Component } from "react";
import autobind from "autobind-decorator";
import { Content, Card, CardItem, Text, Body,Container, Header, Form, Item,Title, Input, Left,Right,H3,Spinner,Button} from "native-base";
//import { Button,View } from "react-native";

import { AsyncStorage } from "react-native";
import { observer,extendObservable, inject } from "mobx-react";
import styles from "./styles";
import stores from "../../../stores";
import routerActions from 'reazy-native-router-actions';
import { functionDeclaration } from "@babel/types";


const loginStore = stores.loginStore;

@observer
export default class SignInView extends Component {
 
  constructor(props){
    super(props);
    this.state = {
        password:''
     };
    
  }
  
  @autobind
_onPasswordChanged(text) {
      this.setState({password: text})    
      //console.warn(loginStore.password);
  
}

@autobind
_onClickForgotPassword(){this.props.navigation.navigate("ForgotPassword")} 
  

  @autobind
  async _onClickSignIn() {
    loginStore.password = this.state.password
    
    try {
        await loginStore.login();
        if (loginStore.loading == true){
            this.props.navigation.navigate("Home")
        }
    } catch (e) {
      alert(e.message);
    }

    } 

      


  render() {
   
  
    return (

      <Container>
      <Content>
      <Left/>
      <Header style={{marginBottom:450}}>
      <Body>
            <Title>BleashUp </Title>
      </Body>
         <Right/>
      </Header>


        <Form style={styles.formstyle}>
        
         <Button transparent full onPress={this._onClickForgotPassword}
         style={{marginBottom:0,marginTop:190,marginLeft:0}} >
          <H3  style={{color:"green",fontSize:15,marginLeft:170}}>Forgot password?</H3>
          </Button>

          <Header style={{marginBottom:-70}}>
            <Left/>
            <Body>
            <Title style={{paddingLeft:20}}>Password</Title>
            </Body>
           </Header>
          

        <Item style={{marginTop:60}} regular >
        <Input placeholder="Please enter password"  
        onChangeText = {this._onPasswordChanged} 
        value = {this.state.password}  />
        </Item>

          <Button   style={styles.buttonstyle}
             onPress={this._onClickSignIn}>
           <Text style={{ paddingLeft:50}} >Sign In</Text>
           
          </Button>

        </Form>

      </Content>
    </Container>
   
   
   
   
      );
  
    }

  
}

