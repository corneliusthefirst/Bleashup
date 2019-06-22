import React, { Component } from "react";
import autobind from "autobind-decorator";
import {
  Content,Card,CardItem,Text,Body,Container,Icon,Header, Form, Item, Title, Input,Left,
  Right,H3,H1,H2,Spinner,Button,InputGroup,DatePicker,CheckBox, Thumbnail
} from "native-base";

import { AsyncStorage,Alert } from "react-native";
import { observer } from "mobx-react";
import styles from "./styles";
import stores from "../../../stores";
import routerActions from "reazy-native-router-actions";
import { functionDeclaration } from "@babel/types";
import globalState from "../../../stores/globalState";
import { observable } from "mobx";
import UserServices from "../../../services/userHttpServices";

@observer
export default class EmailVerificationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: ""
    };
  }

  loginStore = stores.LoginStore;
  temploginStore = stores.TempLoginStore;

  @autobind
  onChangedCode(text) {
    this.setState({ code: text });
  }

  @autobind
  back() {
    this.props.navigation.navigate("SignUp");
  }

  @autobind
  removeError() {
    globalState.error = false;
  }

  @autobind
  resendCode() {
    this.temploginStore.counter = 0
    emailVerificationCode = Math.floor(Math.random() * 600000) + 1000;

    subject = "Verify email acccount";
    name = this.temploginStore.user.name;
    body =("Welcome to Bleashup"+name+
           "this is your new code to check "
           +emailVerificationCode)
    
    email = this.temploginStore.user.email;
    let emailData = {
      name: name,
      email: email,
      subject: subject,
      body: body
    };
    while(this.temploginStore.counter >= 0){
      this.temploginStore.counter++;
    } 
    UserService.sendEmail(emailData)
      .then(response => {
        if ((response = "ok")) {
          this.temploginStore.saveData(emailVerificationCode, "emailVerificationCode").then(response => {
              if (response) {
              }
            })
            .catch(error => {
              reject(error)
            })
        }
      })
      .catch(error => {
        reject(error)
      })
  }

  @autobind
  onClickEmailVerification() {
    


   if(this.temploginStore.counter >= 300){
  
    Alert.alert(
      'Verification code expired',
      'Please click on Resend verification code',
     [
       {text: 'OK', onPress: () => console.log('OK Pressed')},
     ],  
   )

  }else{
    globalState.loading  = true
    //if code do not expired we renisialise the counter to 0
    this.temploginStore.counter = 0
    this.temploginStore.loadSaveData("emailVerificationCode").then(data => {
        
      this.temploginStore.emailVerificationCode = data;

      if (this.temploginStore.emailVerificationCode == this.state.code) {
        //we register the user
        this.temploginStore.getUser().then(user => {
        UserServices.register(user.phone, user.password).then(res => {
          
         this.loginStore.setUser(user).then(response => {

          //Delete temporal data
           this.temploginStore.deleteData('emailVerificationCode').then(res =>
               {
                 this.temploginStore.deleteData('phonenumber').then(res =>{
                   this.temploginStore.deleteData('temploginStore').then(res =>{
                   
                  
                    globalState.loading  = false
                    this.props.navigation.navigate("Home");
                
                })
              })
            })

         })

      })

  })
             
      }else{
              globalState.error = true;
      }
  
   })

  }

}

  render() {
    return (
      <Container>
        <Content>
          <Left />
          <Header>
            <Body>
              <Title>BleashUp </Title>
            </Body>
            <Right>
              <Button onPress={this.back} transparent>
                <Icon type="Ionicons" name="md-arrow-round-back" />
              </Button>
            </Right>
          </Header>

          <Button
            transparent
            regular
            style={{ marginBottom: -22, marginTop: 50, marginLeft: -12 }}
          >
            <Text>Email Verification </Text>
          </Button>

          <Text style={{ color: "skyblue", marginTop: 20 }}>
            Please check your phone a code verification for your email was send
            to you.Please enter the code below
          </Text>

          <Item rounded style={styles.input} error={globalState.error}>
            <Icon active type="Ionicons" name="md-code" />
            <Input
              placeholder={
                globalState.error == false
                  ? "Please enter email verification code"
                  : "Invalid email Verification code"
              }
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              inverse
              last
              onChangeText={value => this.onChangedCode(value)}
            />
            {globalState.error == false ? (
              <Text />
            ) : (
              <Icon
                onPress={this.removeError}
                type="Ionicons"
                name="close-circle"
                style={{ color: "#00C497" }}
              />
            )}
          </Item>

          <Text
            style={{ color: "royalblue", marginTop: 20, marginLeft: 175 }}
            onPress={this.resendCode}
          >
            Resend verification code
          </Text>

          <Button
            block
            rounded
            style={styles.buttonstyle}
            onPress={this.onClickEmailVerification}
          >
              {globalState.loading  ? <Spinner color="#FEFFDE" /> : <Text> Ok </Text>}
           
          </Button>
        </Content>
      </Container>
    );
  }
}