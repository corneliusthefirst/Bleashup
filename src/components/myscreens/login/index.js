import React, { Component } from "react";
import autobind from "autobind-decorator";
import {
  Content,
  Card,
  CardItem,
  Text,
  Body,
  Container,
  Icon,
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
  Button,
  InputGroup,
  DatePicker,
  CheckBox,
  Thumbnail
} from "native-base";

import {
  Platform,
  View,
  TouchableOpacity,
  Alert,
  BackHandler,
  ToastAndroid
} from "react-native";
import { AsyncStorage } from "@react-native-community/async-storage";
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
import RNExitApp from "react-native-exit-app";

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
  state = {}
  loginStore = stores.LoginStore;
  temploginStore = stores.TempLoginStore;

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    this.setState({
      pickerData: this.phone.getPickerData()
    });
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  handleBackButton() {
    ToastAndroid.show("Back button is pressed", ToastAndroid.SHORT);
    RNExitApp.exitApp();
    return true;
  }
  @autobind
  onPressFlag() {
    this.countryPicker.openModal();
  }

  selectCountry(country) {
    this.phone.selectCountry(country.cca2.toLowerCase());
    this.setState({ cca2: country.cca2 });
  }

  async updateInfo(value) {
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
    this.setState({
      loading:true
    })
    try {
      await this.updateInfo();
      if (this.state.value == "") {
        throw new Error("Please provide phone number.");
      } else if (this.state.valid == false || this.state.type != "MOBILE") {
        throw new Error("Please provide a valid mobile phone number.");
      } else {
        UserService.checkUser(
          this.state.value.replace(/\s/g, "").replace("+", "00")
        )
          .then(response => {
            if (response.response !== "unknown_user" && response.response !== "wrong server_key") {
              this.loginStore
                .setUser({
                  phone: this.state.value.replace(/\s/g, "").replace("+", "00"),
                  password: "",
                  profile: response.profile,
                  profile_ext: response.profile_ext,
                  name: response.name,
                  nickname: response.nickname,
                  created_at: response.created_at,
                  updated_at: response.updated_at,
                  birth_date: response.birth_date,
                  email: response.email
                })
                .then(() => {
                  globalState.loading = false;
                  this.props.navigation.navigate("SignIn");
                });
            } else {
              this.temploginStore
                .saveData(
                  this.state.value.replace(/\s/g, "").replace("+", "00"),
                  "phone"
                )
                .then(() => {
                  globalState.loading = false;
                  this.props.navigation.navigate("SignUp");
                });
            }
          })
          .catch(error => {
            console.warn(error)
            this.setState({
              loading: false
            })
            alert("Sorry Please Check your internet connection");
          });
      }
    } catch (e) {
      console.warn(e.message)
      this.setState({
        loading:false
      })
      Alert.alert("Phone Error","Please provide a valid mobile phone number", [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]);
    }
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
              onChange={value => this.updateInfo(value)}
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
            {this.state.loading ? (
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
