import React, { Component } from "react";
import styles from "./styles";
import UserService from "../../../services/userHttpServices";
import stores from "../../../stores";
import globalState from "../../../stores/globalState";
import { observer } from "mobx-react";
import moment from "moment";
import firebase from 'react-native-firebase';
import { TouchableOpacity,View,Text,ScrollView, TextInput as Input } from 'react-native';
import Toaster from "../../../services/Toaster";
import CreateButton from '../event/createEvent/components/ActionButton';
import Spinner from '../../Spinner';
import  Ionicons from 'react-native-vector-icons/Ionicons';
import Texts from '../../../meta/text';
import ColorList from '../../colorList';
import GState from "../../../stores/globalState";
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import EvilIcons  from 'react-native-vector-icons/EvilIcons';
import CreationHeader from '../event/createEvent/components/CreationHeader';
import BeNavigator from '../../../services/navigationServices';
import BeComponent from '../../BeComponent';

@observer
export default class SignUpView extends BeComponent {
  constructor(props) {
    super(props);
  }
  state = {}
  user = {};
  loginStore = stores.LoginStore;
  temploginStore = stores.TempLoginStore;

  onChangedName(value) {
    this.setState({ name: value });
  }

  onChangedEmail(value) {
    this.setState({ email: value });
  }
  onChangedAge(value) {
    this.setState({ age: value });
  }
  onChangedPassword(value) {
    this.setState({ password: value });
  }

  onChangedNewPassword(value) {
    this.setState({ newPassword: value });
  }

  exiting = false
  timeout = null

  back(){
    this.props.navigation.navigate("Login")
  }
  //Error state handling
  removePasswordError() {
    globalState.passwordError = false;
  }
  removeNewPasswordError() {
    globalState.newPasswordError = false;
  }
  removeNameError() {
    globalState.nameError = false;
  }
  removeEmailError() {
    globalState.emailError = false;
  }

  
  removeAgeError() {
    globalState.ageError = false;
  }
  SignUp() {
    if (this.state.password != this.state.newPassword) {
      globalState.newPasswordError = true;
    }
    if (!this.state.password) {
      globalState.passwordError = true;
    }
    if (!this.state.name) {
      globalState.nameError = true;
    }
   // if (this.state.email == "") {
   //   globalState.emailError = true;
   // }
    if (!this.state.age) {
      globalState.ageError = true;
    }

    if (
      !globalState.newPasswordError &&
      !globalState.passwordError &&
      !globalState.nameError &&
      !globalState.emailError &&
      globalState.ageError
    ) {
      this.setState({
        loading:true
      });
      this.user.password = this.state.password;
      //this.user.email = this.state.email;
      this.user.birth_date = this.state.age;
      this.user.name = this.state.name;
      let emailVerificationCode = Math.floor(Math.random() * 60000) + 1000;
      subject = "Verify email acccount";
      name = this.state.name;
      body =
        "Welcome to Bleashup " +
        name +
        " this is your code to check " +
        emailVerificationCode;

      email = this.state.email;
      let emailData = {
        name: name,
        email: email,
        subject: subject,
        body: body
      };
      this.temploginStore.loadSaveData("phone").then(phone => {
        this.user = {...this.user,
          phone: phone.phone,
          status: "",
          country_code: phone.country_code,
          profile: "",
          profile_ext: "",
          nickname: this.user.name,
          created_at: moment().format("YYYY-MM-DD HH:mm"),
          updated_at: moment().format("YYYY-MM-DD HH:mm")
        };
        firebase.auth().signInWithPhoneNumber(this.user.phone.replace("00", "+")).then(confirmCode => {
          this.temploginStore.confirmCode = confirmCode
          this.temploginStore.setUser(this.user).then(() => {
            BeNavigator.navigateTo("EmailVerification");
          });  
        }).catch(e => {
          alert(this.user.phone.replace("00", "+"), Texts.unable_to_verify_account)
        })
      });
    }
  }

  back() {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps={'hadled'} showVerticalScrollIndicator={false}>
          <CreationHeader title={Texts.sign_up} back={this.back.bind(this)}>
          </CreationHeader>
        <View style={styles.mainContainer}>
          <View style={[styles.input,
            globalState.nameError?
            {borderColor: ColorList.errorColor,}:{}]}>
            <EvilIcons active name="user"   
            style={{ 
              marginTop: 5,
              ...GState.defaultIconSize, 
              color: ColorList.indicatorColor 
            }} />
            <Input
            maxLength={GState.nameMaxLength}
            style={{
              width:"70%"
            }}
              placeholder={
                globalState.nameError == false
                  ? Texts.enter_name
                  : Texts.not_empty_name
              }
              autoCapitalize="none"
              onChangeText={value => this.onChangedName(value)}
            />

            {globalState.nameError == false ? (
              <Text />
            ) : (
                <TouchableOpacity
                style={styles.close_button}
                  onPress={this.removeNameError.bind(this)}
                ><Ionicons
                  name="ios-close-circle"
                  style={{ ...styles.icon, fontSize: 14, color: ColorList.errorColor }}
                />
                </TouchableOpacity>
              )}
          </View>
          {/*<View style={styles.input} error={globalState.ageError}>
            <MaterialIcons
              name="date-range"
              style={{ color: ColorList.indicatorColor }}
            />
            <DatePicker
              //defaultDate={new Date(2019, 6, 18)}
              minimumDate={new Date(1900, 1, 1)}
              maximumDate={new Date(2019, 5, 31)}
              locale={"en"}
              timeZoneOffsetInMinutes
              modalTransparent={false}
              animationType={"fade"}
              androidMode={"default"}
              placeHolderText={
                globalState.ageError == false
                  ? "Select date of birth"
                  : "Please enter valid birth date"
              }
              textStyle={{ color: "green" }}
              placeHolderTextStyle={{ color: "#696969" }}
              onDateChange={this.onChangedAge}
              autoCapitalize="none"
            />

            {globalState.ageError == false ? (
              <Text />
            ) : (
                <Icon
                  onPress={this.removeAgeError}
                  type="Ionicons"
                  name="close-circle"
                  style={{ color: "#00C497" }}
                />
              )}
            </View>*/}

          <View
            style={[styles.input, globalState.passwordError?
              {borderColor: ColorList.errorColor,}:{}]} error={globalState.passwordError}>
            <Ionicons
              active
              name="ios-lock"
              style={{ 
                marginTop: 9,
                ...GState.defaultIconSize,
                fontSize: 18,
                color: ColorList.indicatorColor 
              }}
            />
            <Input
            style={{width:"70%"}}
              secureTextEntry
              placeholder={
                globalState.passwordError == false
                  ? Texts.enter_password
                  : Texts.not_empty_password
              }
              autoCapitalize="none"
              returnKeyType="next"
              inverse
              onChangeText={value => this.onChangedPassword(value)}
            />

            {globalState.passwordError == false ? (
              <Text />
            ) : (
                <TouchableOpacity style={styles.close_button} onPress={this.removePasswordError.bind(this)}>
                <Ionicons
                  type="Ionicons"
                  name="ios-close-circle"
                  style={{ ...GState.defaultIconSize, 
                    fontSize: 14,
                     color: ColorList.errorColor }}
                />
                </TouchableOpacity>
              )}
          </View>
          <View
            style={[styles.input,
              globalState.newPasswordError?{borderColor: 
                ColorList.errorColor ,}:{}]}
            error={globalState.newPasswordError}
          >
            <Ionicons
              name="ios-lock"
              style={{ 
                marginTop: 9,
                ...GState.defaultIconSize, 
                fontSize: 18,
                color: ColorList.indicatorColor 
              }}
            />
            <Input
              secureTextEntry
              style={{
                width:"70%"
              }}
              placeholder={
                globalState.newPasswordError == false
                  ? Texts.confirm_password
                  : Texts.password_not_matched
              }
              autoCapitalize="none"
              returnKeyType="go"
              inverse
              last
              onChangeText={value => this.onChangedNewPassword(value)}
            />
            {globalState.newPasswordError == false ? (
              <Text />
            ) : (
                <TouchableOpacity onPress={() => this.removeNewPasswordError()}
                style={styles.close_button}>
                <Ionicons
                    name="ios-close-circle"
                  style={{ ...GState.defaultIconSize,fontSize: 14,
                     color: ColorList.errorColor }}
                />
                </TouchableOpacity>
              )}
          </View>
          {this.state.loading ? <Spinner></Spinner> : <CreateButton
            title={Texts.sign_up}
            action={() => {
              this.SignUp()
            }}
            style={styles.buttonstyle}
          >
          </CreateButton>}
        </View>
        </ScrollView>
    );
  }
}
