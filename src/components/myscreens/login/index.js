import React, { Component } from "react";
import autobind from "autobind-decorator";
import { Content, Card, CardItem, Text, Body,Container, Header, Form, Item,Title, Input, Left,Right,Button} from "native-base";
//import { Button,View } from "react-native";

import { AsyncStorage,View,TouchableOpacity } from "react-native";
//import { observable } from 'mobx';
import { observer,extendObservable, inject } from "mobx-react";
import styles from "./styles";
import stores from '../../../stores/index';
import routerActions from 'reazy-native-router-actions';
import { functionDeclaration } from "@babel/types";

import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';

const loginStore = stores.loginStore;


@observer
export default class LoginView extends Component {
  constructor(props){
   super(props);
   this.onClickContinue = this.onClickContinue.bind(this);
   this.state = {
       cca2: 'US',   
       valid:'',
       type:'',
       value:''
    };
   
 }

componentDidMount() {
  this.setState({
    pickerData: this.phone.getPickerData(),
  });
}
@autobind
onPressFlag() {
  this.countryPicker.openModal();
}

selectCountry(country) {
  this.phone.selectCountry(country.cca2.toLowerCase());
  this.setState({ cca2: country.cca2 });
}


@autobind
async updateInfo() {

    this.setState({
      valid: this.phone.isValidNumber(),
      type: this.phone.getNumberType(),
      value: this.phone.getValue(),
    });

}
  


@autobind
async onClickContinue() {
  try {
    await  this.updateInfo()

    if (this.state.value == "") {
      throw new Error("Please provide phone number.");
    }
  } catch (e) {
    alert(e.message);
  }

  

  console.warn(this.state.valid);   
  console.warn(this.state.type);
  console.warn(this.state.value);
  console.warn(this.state.cca2);
  
       
  
      /*  if (loginStore.checkUser(loginStore.phoneNumber) == true){
              this.props.navigation.navigate("SignIn")
        }else{
               this.props.navigation.navigate("SignUp")
        }*/
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
          <Header >
            <Left/>
            <Body>
            <Title>Phone Number</Title>
            </Body>
           </Header>
          <Right/>
         
          <Item style={{marginTop:5}} regular >
          <PhoneInput
          ref={(ref) => {
            this.phone = ref;
          }}
          onChange={value => this.updateInfo()}
          onPressFlag={this.onPressFlag}
          value={this.state.value}
         />
        </Item>

        <CountryPicker
          ref={(ref) => {
            this.countryPicker = ref;
          }}
          onChange={value => this.selectCountry(value)}
          translation="eng"
          cca2={this.state.cca2}
        >
          <View/>
        </CountryPicker>

        

       

          <Button   style={styles.buttonstyle}
           onPress={()=>{this.onClickContinue()
            }}
           >
          <Text style={{ paddingLeft:40}}> Continue </Text>
          </Button>

        </Form>


      </Content>
    </Container>


    );
  }
  
}







