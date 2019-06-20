import React, { Component } from "react";
import autobind from "autobind-decorator";
import {
  Content,Card,CardItem,Text,Body,Container,Icon,Header,Form,Item,Title,Input,Left,Right,H3,H1,H2,Spinner,Button,InputGroup,DatePicker,Thumbnail
} from "native-base";
//import { Button,View } from "react-native";

import { AsyncStorage } from "react-native";
import { observer } from "mobx-react";
import styles from "./styles";
import stores from "../../../stores";
import routerActions from "reazy-native-router-actions";
import { functionDeclaration } from "@babel/types";
import globalState from '../../../stores/globalState';


@observer
export default class ResetPasswordView extends Component {
  constructor(props) {
    super(props);
    this.state = {
        password:'',
        newPassword:''

    };
  }

  loginStore = stores.LoginStore;

  @autobind
  onChangedPassword(value){
    this.setState({ password: value});
  }

  @autobind
  onChangedNewPassword(value){
    this.setState({ newPassword: value});
  }

  @autobind
  back(){
    this.props.navigation.navigate('ForgotPassword');
    
  }

  @autobind
  removePasswordError(){
    globalState.passwordError = false
  }
  @autobind
  removeNewPasswordError(){
    globalState.newPasswordError = false
  }

  @autobind
  onClickResetPassword() {
      if(this.state.password != this.state.newPassword){
        globalState.newPasswordError = true
      }
      else if((this.state.password == '') &&(this.state.newPassword == '') ){
        globalState.passwordError = true
      }
      else{
        globalState.success = true
        console.warn(this.state.password)
        console.warn(this.state.newPassword)
        this.props.navigation.navigate('SignIn');
      }

      /*
    if(this.loginStore.user.email == this.state.email){
      console.warn(this.state.email) 

      /**Code to send a reset link through email 
      

   }else{
     globalState.error = true
   }*/

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
       <Text>Reset Password </Text>               
    </Button>


    
    
        
    <Item rounded style={styles.input}  error={globalState.passwordError} >
          <Icon active type='Ionicons' name='ios-lock' />
          <Input secureTextEntry  placeholder={globalState.passwordError == false ? 'Please enter password': 'password cannot be empty' }  autoCapitalize="none" returnKeyType='next' inverse
            onChangeText={(value) =>this.onChangedPassword(value)}  />
            {globalState.passwordError == false ? <Text></Text> : <Icon onPress={this.removePasswordError} type='Ionicons' name='close-circle' style={{color:'#00C497'}}/>}
    </Item>

    <Item rounded style={styles.input}  error={globalState.newPasswordError} >
          <Icon active type='Ionicons' name='ios-lock' />
          <Input secureTextEntry  placeholder={globalState.newPasswordError == false ? 'Please confirm password': 'password not matching' }  autoCapitalize="none"  returnKeyType='go' inverse last
            onChangeText={(value) =>this.onChangedNewPassword(value)}  />
            {globalState.newPasswordError == false ? <Text></Text> : <Icon onPress={this.removeNewPasswordError} type='Ionicons' name='close-circle' style={{color:'#00C497'}}/>}
    </Item>

    

      <Button  block rounded  success={globalState.success}
            style={styles.buttonstyle}
            onPress={ this.onClickResetPassword}
       >
             <Text>  Reset </Text>
           
          </Button>

     

        
      </Content>
    </Container>
    );
  }
}
