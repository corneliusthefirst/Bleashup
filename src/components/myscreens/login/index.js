import React, { Component } from "react";
import autobind from "autobind-decorator";
import {
  Content,
  Card,
  CardItem,
  Text,
  Body,
  Container,
  Header,
  Form,
  Item,
  Title,
  Input,
  Left,
  Right,
  H3,
  H1,
  H2,
  Spinner,
  Button
} from "native-base";

import {  View, TouchableOpacity,Alert } from "react-native";
import  { AsyncStorage } from '@react-native-community/async-storage';
//import { observable } from 'mobx';
import { observer, extendObservable, inject } from "mobx-react";
import styles from "./styles";
import stores from "../../../stores";
import routerActions from "reazy-native-router-actions";
import { functionDeclaration } from "@babel/types";

import PhoneInput from "react-native-phone-input";
import CountryPicker from "react-native-country-picker-modal";
import UserService from "../../../services/userHttpServices";
import globalState from "../../../stores/globalState";


@observer
export default class LoginView extends Component {
  constructor(props) {
    super(props);
    this.onClickContinue = this.onClickContinue.bind(this);
    this.state = {
      cca2: "US",
      valid: "",
      type: "",
      value: "",
      erroMessage: ""
    };
  }
  loginStore = stores.LoginStore;
  temploginStore = stores.TempLoginStore;

  componentDidMount() {
    this.setState({
      pickerData: this.phone.getPickerData()
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
    try {
      this.setState({
        valid: this.phone.isValidNumber(),
        type: this.phone.getNumberType(),
        value: this.phone.getValue()
      });
    } catch (e) {
      alert(e.message);
      //this.setState({erroMessage: e.message});
    }
  }

  @autobind
  async onClickContinue() {
    try {
      await this.updateInfo();

      if (this.state.value == "") {
        throw new Error("Please provide phone number.");
      } else if (this.state.valid == false || this.state.type != "MOBILE") {
        throw new Error("Please provide a valid mobile phone number.");
      } else {
        globalState.loading = true;
      }
    } catch (e) {
      
      Alert.alert(
         'Phone Error',
         e.message,
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
       
      );

    }

    UserService.checkUser(this.state.value)
      .then(response => {
        if (response) {
          //if ok we get the user to loginStore
          this.loginStore.getUser();
          globalState.loading = false;
          this.props.navigation.navigate("SignIn");
        } else {
          globalState.loading = false;
          this.props.navigation.navigate("SignUp");
        }
      })
      .catch(error => {
        reject(error);
        alert("Sorry Please Check your internet connection");
      });
  }

  render() {
    return (
      <Container>
        <Content>
          <Left />
          <Header style={{ marginBottom: 450 }}>
            <Body>
              <Title>BleashUp</Title>
            </Body>
            <Right />
          </Header>

          <H3 style={styles.H3}>Phone number</H3>

          <Item style={styles.phoneinput} rounded>
            <PhoneInput
              ref={ref => {
                this.phone = ref;
              }}
              onChange={value => this.updateInfo()}
              onPressFlag={this.onPressFlag}
              value={this.state.value}
              error={globalState.error}
              autoFormat={true}
              pickerBackgroundColor="blue"
            />
          </Item>

          <Button
            block
            rounded
            style={styles.buttonstyle}
            onPress={() => {
              this.onClickContinue();
            }}
          >
            {globalState.loading ? (
              <Spinner color="#FEFFDE" />
            ) : (
              <Text> Continue </Text>
            )}
          </Button>

          <CountryPicker
            ref={ref => {
              this.countryPicker = ref;
            }}
            onChange={value => this.selectCountry(value)}
            translation="eng"
            cca2={this.state.cca2}
          >
            <View />
          </CountryPicker>
        </Content>
      </Container>
    );
  }
}
