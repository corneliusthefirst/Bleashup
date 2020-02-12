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
  Thumbnail,
  Toast
} from "native-base";

import { Alert, BackHandler } from "react-native";
//import { observer } from "mobx-react";
import styles from "./styles";
import stores from "../../../stores";
import { functionDeclaration } from "@babel/types";
import globalState from "../../../stores/globalState";
import UserServices from "../../../services/userHttpServices";
import firebase from 'react-native-firebase';

/*@observer*/
export default class EmailVerificationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      loading: false
    };
  }
  state = {}
  loginStore = stores.LoginStore;
  temploginStore = stores.TempLoginStore;

  @autobind
  onChangedCode(text) {
    this.setState({ code: text });
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);

  }
  exiting = false
  timeout = null
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  handleBackButton() {
    if (this.exiting) {
      clearTimeout(this.timeout)
      this.back()
    } else {
      this.exiting = true
      Toast.show({ text: "Press again to go to the previous page" });
      this.timeout = setTimeout(() => {
        this.exiting = false
      }, 800)
    }
    return true;
  }
  back(){
    this.props.navigation.navigate("SignUp")
  }
  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.registerUserAndClean()
      }
    });
  }
  back() {
    this.props.navigation.navigate("SignUp");
  }

  @autobind
  removeError() {
    globalState.error = false;
  }

  resendCode() {
    console.warn("resending verificatio")
    let user = this.temploginStore.user
      firebase.auth().signInWithPhoneNumber(user.phone.replace("00", "+")).then((confirmCode) => {
        this.temploginStore.confirmCode = confirmCode
      }).catch(e => {
        alert("Verification Error", "Could not send verifiction code")
      })
    /* this.temploginStore.counter = 0;
     emailVerificationCode = Math.floor(Math.random() * 600000) + 1000;
 
     subject = "Verify email acccount";
     name = this.temploginStore.user.name;
     body =
       "Welcome to Bleashup" +
       name +
       "this is your new code to check " +
       emailVerificationCode;
 
     email = this.temploginStore.user.email;
     let emailData = {
       name: name,
       email: email,
       subject: subject,
       body: body
     };
     UserService.sendEmail(emailData)
       .then(response => {
         if ((response = "ok")) {
           this.temploginStore
             .saveData(emailVerificationCode, "emailVerificationCode")
             .then(response => {
               if (response) {
               }
             })
             .catch(error => {
               reject(error);
             });
         }
       })
       .catch(error => {
         reject(error);
       });*/
  } 
  registerUserAndClean() {
    this.temploginStore.getUser().then(user => {
      UserServices.register(user.phone, user.password, user.name, user.birth_date).then(res => {
        this.loginStore.setUser(user).then(response => {
          //Delete temporal data
          this.temploginStore.deleteData("phonenumber").then(res => {
            this.temploginStore
              .deleteData("temploginStore")
              .then(res => {
                this.setState({
                  loading: false
                })
                this.props.navigation.navigate("Home");
              });
          });
        });
      });
    })
  }
  onClickEmailVerification() {
    this.setState({
      loading: true
    })
    if (this.state.code) {
      this.temploginStore.confirmCode.confirm(this.state.code).then(success => {
        this.registerUserAndClean()
      }).catch(e => {
        this.setState({
          loading: false
        })
        console.warn(e, "error here")
        alert('wrong verification code; Please try again')
        globalState.error = true;
      })
    } else {
      this.setState({
        loading: false
      })
      alert("Please enter the confirmation Code")
    }
  }

  render() {
    return (
      <Container>
        <Content>
          <Header>
            <Left>
              <Button onPress={this.back} transparent>
                <Icon type="Ionicons" name="md-arrow-round-back" />
              </Button></Left>
            <Body>
              <Title>Bleashup </Title>
            </Body>
          </Header>

          <Button
            transparent
            regular
            style={{ marginBottom: -22, marginTop: 50, marginLeft: -12 }}
          >
            <Text>Phone Number Verification {"    "}{this.temploginStore.user.phone.replace("00","+")} </Text>
          </Button>

          <Text style={{ color: "skyblue", marginTop: 20 }}>
            Please Comfirm your Account; A verification Code was sent to your number
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
            onPress={() => this.resendCode()}
          >
            Resend verification code
          </Text>

          <Button
            block
            rounded
            style={styles.buttonstyle}
            onPress={() => this.onClickEmailVerification()}
          >
            {this.state.loading ? (
              <Spinner color="#FEFFDE" />
            ) : (
                <Text> Ok </Text>
              )}
          </Button>
        </Content>
      </Container>
    );
  }
}
