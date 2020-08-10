import React, { Component } from "react";

import { Alert, BackHandler, View, ScrollView, Text, TextInput as Input, TouchableOpacity } from "react-native";
import { observer } from "mobx-react";
import styles from "./styles";
import stores from "../../../stores";
import globalState from "../../../stores/globalState";
import UserServices from "../../../services/userHttpServices";
import firebase from 'react-native-firebase';
import connect from '../../../services/tcpConnect';
import Toaster from "../../../services/Toaster";
import CreationHeader from "../event/createEvent/components/CreationHeader";
import Texts from '../../../meta/text';
import Ionicons  from 'react-native-vector-icons/Ionicons';
import GState from '../../../stores/globalState/index';
import CreateButton from '../event/createEvent/components/ActionButton';
import Spinner from '../../Spinner';
import ColorList from '../../colorList';

@observer
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

  onChangedCode(text) {
    this.setState({ code: text });
  }
  componentDidMount() {
    //BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }
  exiting = false
  timeout = null
  componentWillUnmount() {
    //BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  handleBackButton() {
    if (this.exiting) {
      clearTimeout(this.timeout)
      this.back()
    } else {
      this.exiting = true
      Toaster({ text: "Press again to go to the previous page" });
      this.timeout = setTimeout(() => {
        this.exiting = false
      }, 800)
    }
    return true;
  }
  back(){
    this.props.navigation.goBack()
  }
  componentWillMount() {
    /*firebase.auth().onAuthStateChanged(user => {
      console.warn(user)
      if (user) {
        this.registerUserAndClean()
      }
    });*/
  }
  back() {
    this.props.navigation.goBack();
  }

  
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
  } 
  registerUserAndClean() {
    this.temploginStore.getUser().then(user => {
      UserServices.register(user.phone, user.password, user.name, user.birth_date).then(res => {
        this.loginStore.setUser(user).then(response => {
          //Delete temporal data
          this.temploginStore.deleteData("phone").then(res => {
            this.temploginStore
              .deleteData("temploginStore")
              .then(res => {
                this.setState({
                  loading: false
                })
                connect.init().then((socket) => {
                  this.props.navigation.navigate("Home");
                }).catch(() => {
                  console.warn("error while connecting socket")
                })
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
      <View>
        <ScrollView>
          <CreationHeader title={Texts.phone_number_verify} back={() => {}}></CreationHeader>
          <View
            style={{  marginTop: 50,  }}
          >
            <Text style={{ ...GState.defaultTextStyle }}>Phone Number Verification {"    "}{this.temploginStore.user.phone.replace("00","+")} </Text>
          </View>

          <Text style={{ ...GState.defaultTextStyle, color: "skyblue", marginTop: 20 }}>
            Please Comfirm your Account; A verification Code was sent to your number
          </Text>

          <View rounded style={[styles.input, globalState.error?{backgroundColor: ColorList.errorColor,}:null]}>
            <View style={{ alignSelf: 'center', marginRight: 5,}}>
            <Ionicons style={{...GState.defaultIconSize,}} active type="Ionicons" name="md-code" />
            </View>
            <Input
             style={{
               width:"75%"
             }}
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
                <TouchableOpacity style={styles.close_button}  onPress={this.removeError.bind(this)}>
                <Ionicons
                  type="Ionicons"
                  name="ios-close-circle"
                  style={{ color: ColorList.errorColor }}
                />
                </TouchableOpacity>
              )}
          </View>
          <TouchableOpacity onPress={() => this.resendCode()}
          >
          <Text
            style={{ color: "royalblue", marginTop: 20, marginLeft: 175 }}
          >
            Resend verification code
          </Text>
          </TouchableOpacity>
          {!this.state.loading ? <CreateButton
            title={Texts.ok}
            style={styles.buttonstyle}
            action={() => this.onClickEmailVerification()}
          >
          </CreateButton>:
          <View style={{...styles.spinner}}>
              <Spinner color="#FEFFDE" /></View>}
        </ScrollView>
      </View>
    );
  }
}
