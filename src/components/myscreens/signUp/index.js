
import React, { Component } from 'react';
//import { StyleSheet,Button,Text, TouchableOpacity , View } from 'react-native';
import autobind from "autobind-decorator";
import {
  Content,Card,CardItem,Text,Body,Container,Header,Form,Item,Title,Input,Left,Right,H3,H1,H2,Spinner,Button
} from "native-base";
export default  class SignUpView extends Component {
  constructor() {
    super();
    this.state = {
      name:'',
      email:'',
      password:'',
      newPassword:''

    };
  }

  @autobind
  OnChangedName(value){ 
    this.setState({ name: value});
  }

  @autobind
  OnChangedEmail(value){ 
    this.setState({ email: value});
  }
  @autobind
  OnChangedPassword(value){
    this.setState({ password: value});
  }

  @autobind
  OnChangedNewPassword(value){
    this.setState({ newPassword: value});
  }

  @autobind
   SignUp() {

    
    } 
 



  render() {
    return (
      <View style={styles.container}>
      <Input></Input>
      <Input></Input>
      <Input></Input>
      <Input></Input>

     <Button  onPress={this.SignUp} title="SignUp">
           
     </Button>

        

      </View>
    );
  }
}

































































/*
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
export default class SignUpView extends Component {
 
  constructor(props){
    super(props);
    this.state = {
      name:'',
      surname:'',
      country:'',
      email:'',
      birthDate:'',  
      password:'',
      confirmPassword:''
     };
    
  }

@autobind
_onNameChanged(text) {
      this.setState({name: text})    
      //console.warn(loginStore.password);
}
@autobind
_onSurnameChanged(text) {
      this.setState({surname: text})    
      //console.warn(loginStore.password);
}  
@autobind
_onCountryChanged(text) {
      this.setState({country: text})    
      //console.warn(loginStore.password);
}  
@autobind
_onEmailChanged(text) {
      this.setState({email: text})    
      //console.warn(loginStore.password);
}
  @autobind
_onBirthDateChanged(text) {
      this.setState({birthDate: text})    
      //console.warn(loginStore.password);
}  
@autobind
_onPasswordChanged(text) {
      this.setState({password: text})    
      //console.warn(loginStore.password);
}
@autobind
_onConfirmPasswordChanged(text) {
      this.setState({confirmPassword: text})    
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
            <Title style={{paddingLeft:20}}>Sign Up</Title>
            </Body>
           </Header>
          

        <Item style={{marginTop:30}} regular >
        <Input placeholder="Please enter name"  
        onChangeText = {this._onNameChanged} 
        value = {this.state.name}  />
        </Item>
        <Item style={{marginTop:5}} regular >
        <Input placeholder="Please enter surname"  
        onChangeText = {this._onSurnameChanged} 
        value = {this.state.surname}  />
        </Item>
        <Item style={{marginTop:5}} regular >
        <Input placeholder="Please enter country"  
        onChangeText = {this._onCountryChanged} 
        value = {this.state.country}  />
        </Item>
        <Item style={{marginTop:5}} regular >
        <Input placeholder="Please enter email"  
        onChangeText = {this._onEmailChanged} 
        value = {this.state.email}  keyboardType="email-address"
        autoCapitalize="none" autoCorrect={false} />
        </Item>
        <Item style={{marginTop:5}} regular >
        <Input placeholder="Please enter birthDate"  
        onChangeText = {this._onBirthDateChanged} 
        value = {this.state.birthDate} />
        </Item>
        <Item style={{marginTop:5}} regular >
        <Input placeholder="Please enter password"  
        onChangeText = {this._onPasswordChanged} 
        value = {this.state.password} secureTextEntry      autoCapitalize="none" autoCorrect={false}/>
        </Item>
        <Item style={{marginTop:5}} regular >
        <Input placeholder="Please confirm password"  
        onChangeText = {this._onConfirmPasswordChanged} 
        value = {this.state.confirmPassword} secureTextEntry      autoCapitalize="none" autoCorrect={false}/>
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

*/