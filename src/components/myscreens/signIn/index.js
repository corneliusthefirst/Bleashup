import React, { Component } from "react";
//import { StyleSheet,Button,Text, TouchableOpacity , View } from 'react-native';
import autobind from "autobind-decorator";
import { Image, TouchableOpacity, BackHandler } from "react-native";
import Modal from 'react-native-modalbox';
import { observer } from "mobx-react";
import {
  Content,
  Card,
  CardItem,
  Text,
  Body,
  Container,
  Icon,
  Header,
  Item,
  Title,
  Input,
  Left,
  Right,
  Spinner,
  Button,
  Thumbnail,
  Toast
} from "native-base";
import styles from "./styles";
import UserService from "../../../services/userHttpServices";
import stores from "../../../stores/index";
import globalState from "../../../stores/globalState";
import firebase from 'react-native-firebase';
import VerificationModal from "../invitations/components/VerificationModal";
import connect from '../../../services/tcpConnect';
@observer
export default class SignInView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: ""
    };
  }
  loginStore = stores.LoginStore;
  state = {}
  @autobind
  OnChangedPassword(value) {
    this.setState({ password: value });
  }

  @autobind
  back() {
    this.props.navigation.navigate("Login");
  }

  @autobind
  removeError() {
    globalState.error = false;
  }
  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.login()
      }
    });
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);

  }

  user = null
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
      Toast.show({ text: "Press again to go to the pervious page" });
      this.timeout = setTimeout(() => {
        this.exiting = false
      }, 800)
    }
    return true;
  }
  back() {
    this.props.navigation.navigate("Login");
  }

  phone = this.loginStore.user.phone
  @autobind
  forgotPassword() {
    this.props.navigation.navigate("ForgotPassword");
  }
  verifyNumber(code) {
    stores.TempLoginStore.confirmCode.confirm(code).then(success => {
      this.login()
    })
  }
  login() {
    this.user.password = this.state.password;
    this.loginStore.setUser(this.user).then(() => {
      stores.Session.initialzeStore().then(session => {
        globalState.loading = false;
        this.setState({ isModalOpened: false })
        connect.init().then(socket => {
          this.props.navigation.navigate("Home");
        }).catch(() =>{
          console.warn("error while connecting socket")
        })
      });
    });
  }
  @autobind
  SignIn() {
    globalState.loading = true;
    this.loginStore.getUser().then(user => {
      this.user = user;
      UserService.login(user.phone, this.state.password).then(response => {
        if (response === "true") {
          firebase.auth().signInWithPhoneNumber(user.phone.replace("00", "+")).then(confirmCode => {
            stores.TempLoginStore.confirmCode = confirmCode
            this.setState({ isModalOpened: true })
          })
        } else {
          globalState.loading = false;
          globalState.error = true;
          //alert("Wrong password !");
        }
      });
    });
  }
  onChangedCode(value) {
    this.setState({
      code: value
    })
  }
  render() {
    return (
      <Container>
        <Content>
          <Header>
            <Left><Button onPress={this.back} transparent>
              <Icon type="Ionicons" name="md-arrow-round-back" />
            </Button></Left>
            <Body>
              <Title>Bleashup </Title>
            </Body>
            <Right>
            </Right>
          </Header>
          <Card>
            <CardItem>
              <Left>
                <Thumbnail source={this.loginStore.user.profile} />
                <Body>
                  <Text>{this.loginStore.user.name}</Text>
                  <Text note>{this.loginStore.user.status}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Image
                source={this.loginStore.user.profile_ext}
                style={{ height: 200, width: null, flex: 1 }}
              />
            </CardItem>

            <CardItem style={{ height: 60 }} />
          </Card>
          <TouchableOpacity
            style={{ paddingLeft: 220, marginBottom: -22 }}
            onPress={this.forgotPassword}
          >
            <Text style={{ color: "#1FABAB", fontSize: 14 }}>
              forgot password ?
            </Text>
          </TouchableOpacity>

          <Item rounded style={styles.input} error={globalState.error}>
            <Icon active type="FontAwesome" name="unlock" />
            <Input
              secureTextEntry
              placeholder={
                globalState.error == false
                  ? "Please enter password"
                  : "Invalid password"
              }
              onChangeText={value => this.OnChangedPassword(value)}
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

          <Button
            block
            rounded
            style={styles.buttonstyle}
            onPress={() => {
              this.SignIn();
            }}
          >
            {globalState.loading ? (
              <Spinner color="#FEFFDE" />
            ) : (
                <Text> SignIn </Text>
              )}
          </Button>
        </Content>
        <VerificationModal isOpened={this.state.isModalOpened} phone={this.phone}
        verifyCode={(code) => this.verifyNumber(code)}></VerificationModal>
      </Container>
    );
  }
}

/** <CardItem>
              <Left>
                <Button transparent>
                  <Icon active type='Ionicons' name="ios-thumbs-up" />
                  <Text>12 Likes</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent>
                  <Icon active type='Ionicons' name="ios-chatbubbles" />
                  <Text>4 Comments</Text>
                </Button>
              </Body>
              <Right>
                <Text style={{color:'#1FABAB'}}>11h ago</Text>
              </Right>
            </CardItem> */
