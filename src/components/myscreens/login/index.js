import React, { Component } from "react";
import {
  Platform,
  View,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import styles from "./styles";
import stores from "../../../stores";
import PhoneInput from "react-native-phone-input";
import CountryPicker from "react-native-country-picker-modal";
import UserService from "../../../services/userHttpServices";
import globalState from "../../../stores/globalState";
import ColorList from "../../colorList";
import shadower from "../../shadower";
import HeaderHome from "./header";
import Texts from "../../../meta/text";
import Toaster from "../../../services/Toaster";
import CreateButton from "../event/createEvent/components/ActionButton";
export default class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cca2: "US",
      valid: "",
      type: "",
      value: "",
      erroMessage: "",
    };
    this.onClickContinue = this.onClickContinue.bind(this);
    this.onPressFlag = this.onPressFlag.bind(this);
    this.setRef = this.setRef.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
    this.onClickContinue = this.onClickContinue.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
    this.setPickerRef = this.setPickerRef.bind(this);
  }
  state = {};
  loginStore = stores.LoginStore;
  temploginStore = stores.TempLoginStore;

  componentDidMount() {
    this.setState({
      pickerData: this.phone.getPickerData(),
    });
  }
  exiting = false;
  timeout = null;

  onPressFlag() {
    this.countryPicker.openModal();
  }

  selectCountry(country) {
    this.phone.selectCountry(country.cca2.toLowerCase());
    this.setState({ cca2: country.cca2 });
  }

  updateInfo(value) {
    this.setState({
      valid: this.phone.isValidNumber(),
      type: this.phone.getNumberType(),
      value: this.phone.getValue(),
    });
  }

  onClickContinue() {
    console.warn(this.state.value.replace(/\s/g, "").replace("+", "00"));
    console.warn("original", this.state.value);
    try {
      this.setState({
        loading: true,
      });
      if (this.state.value == "") {
        throw new Error("Please provide phone number.");
      } else if (this.state.valid == false || this.state.type != "MOBILE") {
        throw new Error("Please provide a valid mobile phone number.");
      } else {
        UserService.checkUser(
          this.state.value.replace(/\s/g, "").replace("+", "00")
        )
          .then((response) => {
            if (
              response.response !== "unknown_user" &&
              response.response !== "wrong server_key"
            ) {
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
                  email: response.email,
                  country_code: this.state.cca2,
                })
                .then(() => {
                  this.setState({
                    loading: false,
                  });
                  globalState.loading = false;
                  this.props.navigation.navigate("SignIn");
                });
            } else {
              this.temploginStore
                .saveData(
                  {
                    phone: this.state.value.replace(/\s/g, "").replace("+", "00"), 
                    country_code: this.state.cca2,
                  },
                  "phone"
                )
                .then(() => {
                  this.setState({
                    valid: null,
                    loading: false,
                    type: null,
                  });
                  globalState.loading = false;
                  this.props.navigation.navigate("SignUp");
                });
            }
          })
          .catch((error) => {
            this.setState({
              loading: false,
            });
            alert("Sorry Please Check your internet connection");
          });
      }
    } catch (e) {
      this.setState({
        loading: false,
      });
      Alert.alert("Phone Error", "Please provide a valid mobile phone number", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
  }
  setRef(ref) {
    this.phone = ref;
  }
  setPickerRef(ref) {
    this.countryPicker = ref;
  }
  render() {
    return (
      <View style={stylesinter.container}>
        <ScrollView showVerticalScrollIndicator={false}>
          <HeaderHome></HeaderHome>
          <Text style={stylesinter.headerText}>{"Enter Phone Number"}</Text>
          <View style={styles.phoneinput} rounded>
            <PhoneInput
              ref={this.setRef}
              onChangePhoneNumber={this.updateInfo.bind(this)}
              onPressFlag={this.onPressFlag}
              value={this.state.value}
              error={globalState.error}
              autoFormat={true}
              pickerBackgroundColor="blue"
            />
          </View>
          <View style={{marginTop: 50,}}>
          <CreateButton title={Texts.continue} action={() => this.onClickContinue()}>
          </CreateButton>
          </View>
          <CountryPicker
            ref={this.setPickerRef}
            onChange={this.selectCountry}
            translation="eng"
            cca2={this.state.cca2}
          >
            <View />
          </CountryPicker>
        </ScrollView>
      </View>
    );
  }
}

const stylesinter = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    ...styles.H3,
    color: ColorList.bodyText,
    marginTop: "30%",
  },
  continueButton: {
    ...styles.buttonstyle,
    borderRadius: 5,
    height:30,
    textAlign:"center",
    backgroundColor: ColorList.bodyBackground,
    borderWidth: 0.6,
  },
  continueButtonText: { margin: 'auto', }
});
