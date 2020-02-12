import React, { Component } from "react";
import autobind from "autobind-decorator";
import {
  Content,Card,CardItem,Text,Body,Container,Icon,Header,Form,Item,Title,Input,Left,Right,H3,H1,H2,Spinner,Button,InputGroup,DatePicker,Thumbnail
} from "native-base";
//import { Button,View } from "react-native";

import { AsyncStorage, Alert } from "react-native";
import { observer } from "mobx-react";
import styles from "./styles";
import stores from "../../../stores";
import { functionDeclaration } from "@babel/types";
import globalState from '../../../stores/globalState';
import UserService from '../../../services/userHttpServices';
import { observable } from "mobx";


@observer
export default class ResetCodeView extends Component {
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
    this.props.navigation.navigate('ForgotPassword');
    
  }

  @autobind
  removeError(){
    globalState.error = false
  }



  @autobind
  resendCode(){
   this.temploginStore.counter = 0
   resetCode = Math.floor(Math.random() * 600000) + 1000
   
   subject=' Reset password'
   name =this.temploginStore.user.name
   body = 'hello '+name+' this is your reset code '+ resetCode
   email = this.temploginStore.user.email

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
        this.temploginStore.saveData(resetCode, "resetCode").then(response => {
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
  onClickReset() {

    if( this.temploginStore.counter >= 300){
      Alert.alert(
        'Reset code expire',
        'Please click on Resend reset code',
       [
         {text: 'OK', onPress: () => console.log('OK Pressed')},
       ],
      
     );

    }else{
      globalState.loading = true
      //reset counter
      this.temploginStore.counter = 0
      this.temploginStore.resetCode = this.temploginStore.loadSaveData('resetCode').
      then(data => {
       this.temploginStore.resetCode = data
       if(this.temploginStore.resetCode == this.state.code){
         
        this.temploginStore.deleteData('resetCode').then(response => {
             globalState.loading  =false
             this.props.navigation.navigate('ResetPassword');
        })
        
       }else{
                 globalState.error = true
            } 
       })
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






    <Button  transparent regular style={{marginBottom:-22,marginTop:50,marginLeft:-12
    }}>
       <Text>Password Reset Code </Text>               
    </Button>

    <Text style={{color:'skyblue',marginTop:20 }} > Please check your phone a code  for your password reset was send to you.Please enter the  code in the field below </Text>
    
    
    
        
    <Item rounded style={styles.input}  error={globalState.error} >
          <Icon active type='Ionicons' name='md-code' />
          <Input   placeholder={globalState.error == false ? 'Please enter reset code': 'Invalid resetCode' } keyboardType='number-pad'  autoCapitalize="none" autoCorrect={false} returnKeyType='go' inverse last
            onChangeText={(value) =>this.onChangedCode(value)}  />
            {globalState.error == false ? <Text></Text> : <Icon onPress={this.removeError} type='Ionicons' name='close-circle' style={{color:'#00C497'}}/>}
            
    </Item>

    <Text style={{color:'royalblue',marginTop:20,marginLeft:210 }} onPress={this.resendCode} >Resend  reset code </Text>

    

      <Button  block rounded
            style={styles.buttonstyle}
            onPress={ this.onClickReset}
       >
             {globalState.loading  ? <Spinner color="#FEFFDE" /> : <Text> Continue </Text>}
           
          </Button>

     

        
      </Content>
    </Container>
    );
  }
}
