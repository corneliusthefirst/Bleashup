import React, { Component } from "react";
//import { StyleSheet,Button,Text, TouchableOpacity , View } from 'react-native';
import autobind from "autobind-decorator";
import { Image, TouchableOpacity, BackHandler,View ,ScrollView} from "react-native";
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
import HeaderHome from '../login/header';
import ColorList from "../../colorList";



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

  user = {}
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
    this.state.password &&  this.login()
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

  signIn = () => {
    globalState.loading = true;
    this.loginStore.getUser().then(user => {

      this.user = user;
      console.warn(user)
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
      <View style={{height:"100%",width:"100%",alignItems:"center"}}>

        <View style={{ height:ColorList.headerHeight,backgroundColor:ColorList.headerBackground,...shadower(3),flexDirection:"row",width:"100%" }}>
              <View style={{marginLeft:"5%", justifyContent:"center",height:"95%"}}>
                  <Icon type="MaterialIcons" name="arrow-back" onPress={this.back} style={{color:ColorList.headerIcon}}/>
              </View> 
              <View style={{ justifyContent:"center",height:"95%",marginLeft:"5%" }}>
                  <Text style={{fontSize:17,color:ColorList.bodyText}}>Sign In</Text>
              </View>

          </View>
       
        <ScrollView style={{flex:1,width:"100%"}}  showsVerticalScrollIndicator={false}>
          <Card style={{width:"100%"}}>
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
            style={{ alignSelf:"flex-end",marginRight:"5%" }}
            onPress={this.forgotPassword}
          >
            <Text style={{ color: "#1FABAB", fontSize: 14 }}>
              forgot password ?
            </Text>
          </TouchableOpacity>

       <View style={{marginTop:"10%",alignSelf:"center"}}>
          <Item rounded style={{width:"90%",height:45}} error={globalState.error}>
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
          </View>

       <View style={{marginTop:"15%",marginBottom:"7%"}}>
          <Button
            block
            rounded
            style={{width:"45%",alignSelf:"center",backgroundColor:ColorList.bodyBackground,borderWidth:0.7}}
            onPress={this.signIn}
          >
            {globalState.loading ? (
              <Spinner color={ColorList.bodyIcon} />
            ) : (
                <Text> SignIn </Text>
              )}
          </Button>
          </View>
       </ScrollView>

        <VerificationModal isOpened={this.state.isModalOpened} phone={this.phone}
        verifyCode={(code) => this.verifyNumber(code)}></VerificationModal>

      </View>
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
