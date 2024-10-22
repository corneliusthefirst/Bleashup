import React, { Component } from "react";
import autobind from "autobind-decorator";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert
} from "native-base";
//import { Button,View } from "react-native";

import { observer } from "mobx-react";
import styles from "./styles";
import stores from "../../../stores";
import globalState from '../../../stores/globalState';
import UserService from '../../../services/userHttpServices';

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

  @autobind
  onChangedEmail(text) {
    this.setState({ email: text });

  }

  @autobind
  back() {
    this.props.navigation.navigate('SignIn');

  }

  @autobind
  removeError() {
    globalState.error = false
  }

  @autobind
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


      <Container>
        <Content >
          <Left />
          <Header>
            <Body>
              <Title>BleashUp </Title>
            </Body>
            <Right>
              <Button onPress={this.back} transparent>
                <Icon type='Ionicons' name="md-arrow-round-back" />
              </Button>
            </Right>
          </Header>






          <Button transparent regular style={{ marginBottom: -22, marginTop: 50 }}>
            <Text>Reset Password </Text>
          </Button>





          <Item rounded style={styles.input} error={globalState.error} >
            <Icon active type='MaterialIcons' name='email' />
            <Input placeholder={globalState.error == false ? 'Please enter email to reset' : 'Invalid email'} keyboardType='email-address' autoCapitalize="none" returnKeyType='next' inverse last
              onChangeText={(value) => this.onChangedEmail(value)} />
            {globalState.error == false ? <Text></Text> : <Icon onPress={this.removeError} type='Ionicons' name='close-circle' style={{ color: '#00C497' }} />}
          </Item>





          <Button block rounded
            style={styles.buttonstyle}
            onPress={this.onClickReset}
          >
            {globalState.loading ? <Spinner color="#FEFFDE" /> : <Text> Send Reset Code </Text>}

          </Button>




        </Content>
      </Container>
    );
  }
}
