import React, { Component } from "react";
import { View ,Text,TextInput as Input} from "react-native";
import { observer } from "mobx-react";
import styles from "./styles";
import stores from "../../../stores";
import globalState from '../../../stores/globalState';
import UserService from '../../../services/userHttpServices';
import CreationHeader from "../event/createEvent/components/CreationHeader";
import Texts from '../../../meta/text';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons';

@observer
export default class ForgotPasswordView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
  }

  loginStore = stores.LoginStore;
  temploginStore = stores.TempLoginStore;

  onChangedEmail(text) {
    this.setState({ email: text });

  }

  back() {
    this.props.navigation.navigate('SignIn');

  }

  removeError() {
    globalState.error = false
  }

  onClickReset() {

    if (this.loginStore.user.email == this.state.email) {

      globalState.loading = true

      ResetCode = Math.floor(Math.random() * 6000) + 1000


      /**Code to send a reset link through email */

      subject = 'reset bleashup password'
      name = this.loginStore.user.name
      body = 'hello ' + name + ' the reset code for your password is ' + ResetCode
      email = this.loginStore.user.email


      while (this.temploginStore.counter >= 0) {
        this.temploginStore.counter++;
      }
      let emailData = {
        name: name,
        email: email,
        subject: subject,
        body: body
      };

      UserService.sendEmail(emailData).then(response => {
        if ((response = "ok")) {
          this.temploginStore.saveData(resetCode, "resetCode")
            .then(() => {

              globalState.loading = false;
              this.props.navigation.navigate("ResetCode");

            })
        }
      })
        .catch(error => {
          alert("An error Occured When sending you an Email please try later");
        });

    } else {
      globalState.error = true
    }
  }


  render() {
    return (


      <View>
        <ScrollView >
         <CreationHeader title={Texts.reset_password} back={this.back.bind(this)}>
         </CreationHeader>

          <View rounded style={styles.input} error={globalState.error} >
            <MaterialIcons active type='MaterialIcons' name='email' />
            <Input placeholder={globalState.error == false ? 'Please enter email to reset' : 'Invalid email'} keyboardType='email-address' autoCapitalize="none" returnKeyType='next' inverse last
              onChangeText={(value) => this.onChangedEmail(value)} />
            {globalState.error == false ? <Text></Text> : <Icon onPress={this.removeError} type='Ionicons' name='close-circle' style={{ color: '#00C497' }} />}
          </View>





          <TouchableOpacity block rounded
            style={styles.buttonstyle}
            onPress={this.onClickReset}
          >
            {globalState.loading ? <Spinner color="#FEFFDE" /> : <Text> Send Reset Code </Text>}

          </TouchableOpacity>




        </ScrollView>
      </View>
    );
  }
}
