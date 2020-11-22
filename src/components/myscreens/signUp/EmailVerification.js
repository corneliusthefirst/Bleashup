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
import Ionicons from 'react-native-vector-icons/Ionicons';
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
      loading: false,
      mounted: false
    };
  }
  state = {}
  loginStore = stores.LoginStore;
  temploginStore = stores.TempLoginStore;

  onChangedCode(text) {
    this.setState({ code: text });
  }
  exiting = false
  timeout = null
  componentWillUnmount() {
    //BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  back() {
    this.props.navigation.goBack()
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        mounted: true
      })
    }, 1000)
  }
  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.authUser = user
      if (user) {
        this.registerUserAndClean()
      }
    });
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
      alert(Texts.verfication_error, Texts.unable_to_verify_account)
    })
  }
  registerUserAndClean() {
    this.temploginStore.getUser().then(user => {
      console.warn("user from temp login store is: ",user)
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
                this.props.navigation.navigate("Home");
                connect && connect.init().then((socket) => {
                }).catch(() => {
                  console.warn("error while connecting socket")
                })
              });
          });
        });
      }).catch((er) => {
        console.warn(er)
      });
    })
  }
  onClickEmailVerification() {
    this.setState({
      loading: true
    })
    if (this.authUser) {
      this.registerUserAndClean()
    } else {
      if (this.state.code) {
        this.temploginStore.confirmCode.confirm(this.state.code).then(success => {
          this.registerUserAndClean()
        }).catch(e => {
          this.setState({
            loading: false
          })
          console.warn(e, "error here")
          alert(Texts.wrong_verification_code)
          globalState.error = true;
        })
      } else {
        this.setState({
          loading: false
        })
        alert(Texts.enter_verification_code)
      }
    }
  }

  render() {
    return (
      <View>
        <ScrollView>
          <CreationHeader title={Texts.phone_number_verify} back={() => { this.props.navigation.goBack() }}></CreationHeader>
          <View
            style={{ marginTop: 50, }}
          >
            <Text style={{ ...GState.defaultTextStyle }}>{Texts.phone_number_verification} {"    "}{this.temploginStore.user.phone.replace("00", "+")} </Text>
          </View>

          <Text style={{ ...GState.defaultTextStyle, color: "skyblue", marginTop: 20 }}>
            {Texts.verfication_code_sent_to_you}
          </Text>

          <View rounded style={[styles.input, globalState.error ? { backgroundColor: ColorList.errorColor, } : null]}>
            <View style={{ alignSelf: 'center', marginRight: 5, }}>
              <Ionicons style={{ ...GState.defaultIconSize, }} active type="Ionicons" name="md-code" />
            </View>
            <Input
              style={{
                width: "75%"
              }}
              placeholder={
                globalState.error == false
                  ? Texts.enter_verification_code
                  : Texts.invalide_verification_code
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
                <TouchableOpacity style={styles.close_button} onPress={this.removeError.bind(this)}>
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
              {Texts.resent_email_verification_code}
          </Text>
          </TouchableOpacity>
          <CreateButton
            loading={this.state.loading}
            title={Texts.ok}
            style={styles.buttonstyle}
            action={() => this.onClickEmailVerification()}
          >
          </CreateButton>
        </ScrollView>
      </View>
    );
  }
}
