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
  onClickReset() {
                      //to check
    /*
    Resetcode = this.temploginStore.loadSaveData(this.temploginStore.resetCode,'resetcode')
    console.warn(Resetcode) 
    */
    if(this.temploginStore.resetCode == this.state.code){
        console.warn(this.state.code) 

        this.props.navigation.navigate('ResetPassword');

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
          <Icon active type='Ionicons' name='md-code' />
          <Input   placeholder={globalState.error == false ? 'Please enter reset code': 'Invalid resetCode' } keyboardType='number-pad'  autoCapitalize="none" autoCorrect={false} returnKeyType='go' inverse last
            onChangeText={(value) =>this.onChangedCode(value)}  />
            {globalState.error == false ? <Text></Text> : <Icon onPress={this.removeError} type='Ionicons' name='close-circle' style={{color:'#00C497'}}/>}
            
    </Item>

  

    

      <Button  block rounded
            style={styles.buttonstyle}
            onPress={ this.onClickReset}
       >
             <Text> Continue</Text>
           
          </Button>

     

        
      </Content>
    </Container>
    );
  }
}
