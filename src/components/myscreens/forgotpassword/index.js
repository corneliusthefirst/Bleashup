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
export default class ForgotPasswordView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
  }

  loginStore = stores.LoginStore;
  temploginStore = stores.TempLoginStore;

  @autobind
  onChangedEmail(text) {
    this.setState({ email: text });

  }

  @autobind
  back(){
    this.props.navigation.navigate('SignIn');
    
  }

  @autobind
  removeError(){
    globalState.error = false
  }

  @autobind
  onClickReset() {
    if(this.temploginStore.user.email == this.state.email){
      console.warn(this.state.email) 
      /*
      Resetcode = Math.floor(Math.random() * 6000) + 1000
      this.temploginStore.deleteData('resetcode')
      this.temploginStore.saveData(Resetcode,'resetcode')
     

      console.warn(Resetcode) 
     */

      /**Code to send a reset link through email */
      
      this.props.navigation.navigate('ResetCode');

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
       <Text>Reset Password </Text>               
    </Button>


    
    
        
    <Item rounded style={styles.input}  error={globalState.error} >
          <Icon active type='MaterialIcons' name='email' />
          <Input  placeholder={globalState.error == false ? 'Please enter email to reset': 'Invalid email' } keyboardType='email-address'  autoCapitalize="none" returnKeyType='next' inverse last
            onChangeText={(value) =>this.onChangedEmail(value)}  />
            {globalState.error == false ? <Text></Text> : <Icon onPress={this.removeError} type='Ionicons' name='close-circle' style={{color:'#00C497'}}/>}
    </Item>

  

    

      <Button  block rounded
            style={styles.buttonstyle}
            onPress={ this.onClickReset}
       >
             <Text> Send Reset Code </Text>
           
          </Button>

     

        
      </Content>
    </Container>
    );
  }
}
