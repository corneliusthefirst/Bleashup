
import React, { Component } from 'react';
//import { StyleSheet,Button,Text, TouchableOpacity , View } from 'react-native';
import autobind from "autobind-decorator";
import {
  Content,Card,CardItem,Text,Body,Container,Icon,Header,Form,Item,Title,Input,Left,Right,H3,H1,H2,Spinner,Button,InputGroup,DatePicker
} from "native-base";
import styles from "./styles";
import UserService from '../../../services/userHttpServices';
import stores from "../../../stores";


export default  class SignUpView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name:'',
      email:'',
      age:new Date(),
      password:'',
      newPassword:''

    };
  }
  loginStore = stores.LoginStore;


  @autobind
  OnChangedName(value){ 
    this.setState({ name: value});
  }

  @autobind
  OnChangedEmail(value){ 
    this.setState({ email: value});
  }
  @autobind
  OnChangedAge(value){
    this.setState({ age: value});
    
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
  /*
        this.loginStore.updateName(this.state.name).then((response) => {
          if(response){}
        }).catch(error => {
        reject(error)
    
      })

       this.loginStore.updateEmail(this.state.email).then((response) => {
        if(response){}
      }).catch(error => {
      reject(error)
  
     })
       this.loginStore.updateAge(this.state.age).then((response) => {
        if(response){}
      }).catch(error => {
      reject(error)
  
     })
       this.loginStore.updatePassword(this.state.password).then((response) => {
        if(response){}
      }).catch(error => {
        reject(error)
  
      })*/

       console.warn(this.state.password)
       console.warn(this.state.name)
       console.warn(this.state.newPassword)
       console.warn(this.state.email)
       console.warn(this.state.age)

       //this.props.navigation.navigate("Home")
    
    
    } 
  @autobind
  back(){
    this.props.navigation.navigate('Login');
  }



  render() {
    return (
      
        <Container>
        <Content >
          <Left />
          <Header style={{marginBottom:15}}>
            <Body>
              <Title>BleashUp </Title>
            </Body>
            <Right>
            <Button onPress={this.back} transparent>
                  <Icon type='Ionicons' name="md-arrow-round-back" />
            </Button>
            </Right>
          </Header>

      
          
          
      <Item rounded style={styles.input}>
            <Icon active  name='user'   style={{color: "#1FABAB"}}/>
            <Input placeholder='user name'
              onChangeText={value => this.OnChangedName(value)} />
      </Item>
      <Item rounded style={styles.input}>
            <Icon active type='MaterialIcons' name='email' style={{color: "#1FABAB"}}/>
            <Input keyboardType="email-address" placeholder='please enter email'   
              onChangeText={value => this.OnChangedEmail(value)}/>
      </Item>
  
      <Item rounded style={styles.input}>
      <Icon active type='MaterialIcons' name='date-range' style={{color: "#1FABAB"}}/>
      <DatePicker 
            defaultDate={new Date(2018, 4, 4)}
            minimumDate={new Date(2018, 1, 1)}
            maximumDate={new Date(2018, 12, 31)}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Select date of birth"
            textStyle={{ color: "green" }}
            placeHolderTextStyle={{ color: "#696969" }}
            onDateChange={this.OnChangedAge}
          />
       </Item>
      <Item rounded style={styles.input}>
            <Icon active type='Ionicons' name='ios-lock' style={{color: "#1FABAB"}}/>
            <Input secureTextEntry  placeholder='enter password' 
              onChangeText={value => this.OnChangedPassword(value)} />
              
      </Item>
      <Item rounded style={styles.input}>
            <Icon active type='Ionicons' name='ios-lock' style={{color: "#1FABAB"}}/>
            <Input secureTextEntry  placeholder='confirm password'
              onChangeText={value => this.OnChangedNewPassword(value)} />
      </Item>
    

      

        <Button  block rounded
              style={styles.buttonstyle}
              onPress={() => {
                this.SignUp();
              }}
              >
               <Text> SignUp </Text>
             
            </Button>

       

          
        </Content>
      </Container>
    );
  }
}














//</Container><Input type='date' placeholder='please enter birth date'  
//onChangeText={value => this.OnChangedAge(value)}/>




















































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