import React, { Component } from "react";
import autobind from "autobind-decorator";
import {
  Content,Card,CardItem,Text,Body,Container,Icon,Header,Form,Item,Title,Input,Left,Right,H3,H1,H2,Spinner,Button,InputGroup,DatePicker,Thumbnail
} from "native-base";
import { touchableOpacity } from "react-native";

import { AsyncStorage } from "react-native";
import { observer } from "mobx-react";
import styles from "./styles";
import stores from "../../../stores";
import routerActions from "reazy-native-router-actions";
import { functionDeclaration } from "@babel/types";
import globalState from '../../../stores/globalState';
import { observable } from "mobx";


@observer
export default class EmailVerificationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
       code: ''
    };
  }

  loginStore = stores.LoginStore;
  temploginStore = stores.TempLoginStore;

  @autobind
  onChangedCode(text) {
    this.setState({ code: text });

  }

  @autobind
  back(){
    this.props.navigation.navigate('SignUp');
    
  }

  @autobind
  removeError(){
    globalState.error = false
  }


 @autobind
 resendCode(){

  emailVerificationCode = Math.floor(Math.random() * 600000) + 1000
  //UserService.register(this.state.phone,this.state.password)
  subject='Verify email acccount'
  name =this.temploginStore.user.name
  body = 'Welcome to Bleashup '+name+' this is your new code to check '+ emailVerificationCode
  email = this.temploginStore.user.email

  UserService.sendEmail(name,email, subject,body).then((response) => {
    if(response = 'ok'){
      

      this.temploginStore.saveData(emailVerificationCode,'verificationCode').then((response) => {
        if(response){}
      }).catch(error => {
        reject(error)
  
      })

     }
  }).catch(error => {
    reject(error)

  })  

 }

  @autobind
  onClickReset() {
                      //to check
    /*
    Resetcode = this.temploginStore.loadSaveData(this.temploginStore.resetCode,'resetcode')
    console.warn(Resetcode) 
    */
   this.temploginStore.emailVerificationCode = this.temploginStore.loadSaveData('emailVerificationCode').then((response) => {
        if(response){}
    }).catch(error => {
          reject(error) })

    if(this.temploginStore.emailVerificationCode == this.state.code){
        //console.warn(this.state.code) 
        
        //we set the user real data then go back to login
        this.loginStore.setUser(this.temploginStore.getUser());
        this.props.navigation.navigate('Login');

   }else{
         globalState.error = true
   } 
  }


  render() {
    return (
    
       
      <Container>
      <Content >
        <Left />
        <Header>
          <Body>
            <Title>BleashUp </Title>
          </Body>
          <Right>
          <Button onPress={this.back} transparent>
                <Icon type='Ionicons' name="md-arrow-round-back" />
          </Button>
          </Right>
        </Header>






    <Button  transparent regular style={{marginBottom:-22,marginTop:50}}>
       <Text>Email Verifiction </Text>               
    </Button>

    <Text> Please check your phone a code verification for your email was send to you.Please enter the  code below </Text>
    
    
        
    <Item rounded style={styles.input}  error={globalState.error} >
          <Icon active type='Ionicons' name='md-code' />
          <Input   placeholder={globalState.error == false ? 'Please enter email verification code': 'Invalid email Verification code' } keyboardType='number-pad'  autoCapitalize="none" autoCorrect={false} returnKeyType='go' inverse last
            onChangeText={(value) =>this.onChangedCode(value)}  />
            {globalState.error == false ? <Text></Text> : <Icon onPress={this.removeError} type='Ionicons' name='close-circle' style={{color:'#00C497'}}/>}
            
    </Item>

  
<touchableOpacity onPress={this.resendCode}> resent Code</touchableOpacity>
    

      <Button  block rounded
            style={styles.buttonstyle}
            onPress={ this.onClickReset}
       >
             <Text> Continue </Text>
           
          </Button>

     

        
      </Content>
    </Container>
    );
  }
}
