import React, { Component } from "react";
//import { StyleSheet,Button,Text, TouchableOpacity , View } from 'react-native';
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
  CheckBox
} from "native-base";
import styles from "./styles";
import UserService from "../../../services/userHttpServices";
import stores from "../../../stores";
import globalState from "../../../stores/globalState";
import { observer } from "mobx-react";

@observer
export default class SignUpView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      age: "",
      password: "",
      newPassword: ""
    };
  }
  loginStore = stores.LoginStore;

  @autobind
  onChangedName(value) {
    this.setState({ name: value });
  }

  @autobind
  onChangedEmail(value) {
    this.setState({ email: value });
  }
  @autobind
  onChangedAge(value) {
    this.setState({ age: value });
  }
  @autobind
  onChangedPassword(value) {
    this.setState({ password: value });
  }

  @autobind
  onChangedNewPassword(value) {
    this.setState({ newPassword: value });
  }

  //Error state handling
  @autobind
  removePasswordError() {
    globalState.passwordError = false;
  }
  @autobind
  removeNewPasswordError() {
    globalState.newPasswordError = false;
  }
  @autobind
  removeNameError() {
    globalState.nameError = false;
  }
  @autobind
  removeEmailError() {
    globalState.emailError = false;
  }

  @autobind
  removeAgeError() {
    globalState.ageError = false;
  }

  @autobind
  SignUp() {
    if (this.state.password != this.state.newPassword) {
      globalState.newPasswordError = true;
    }
    if (this.state.password == "") {
      globalState.passwordError = true;
    }
    if (this.state.name == "") {
      globalState.nameError = true;
    }
    if (this.state.email == "") {
      globalState.emailError = true;
      //console.warn(this.date.defaultDate)
    }
    if (this.state.age == "") {
      globalState.ageError = true;
      console.warn(globalState.ageError);
    }

    if (
      globalState.newPasswordError == false &&
      globalState.passwordError == false &&
      globalState.nameError == false &&
      globalState.emailError == false &&
      globalState.ageError == false
    ) {
      globalState.loading = true;

      this.loginStore
        .updateName(this.state.name)
        .then(response => {
          if (response) {
          }
        })
        .catch(error => {
          reject(error);
        });

      this.loginStore
        .updateEmail(this.state.email)
        .then(response => {
          if (response) {
          }
        })
        .catch(error => {
          reject(error);
        });
      this.loginStore
        .updateAge(this.state.age)
        .then(response => {
          if (response) {
          }
        })
        .catch(error => {
          reject(error);
        });
      this.loginStore
        .updatePassword(this.state.password)
        .then(response => {
          if (response) {
          }
        })
        .catch(error => {
          reject(error);
        });

      this.props.navigation.navigate("Login");
    }
  }

  @autobind
  back() {
    this.props.navigation.navigate("Login");
  }

  render() {
    return (
      <Container>
        <Content>
          <Left />
          <Header style={{ marginBottom: 15 }}>
            <Body>
              <Title>BleashUp </Title>
            </Body>
            <Right>
              <Button onPress={this.back} transparent>
                <Icon type="Ionicons" name="md-arrow-round-back" />
              </Button>
            </Right>
          </Header>

          <Item rounded style={styles.input} error={globalState.nameError}>
            <Icon active name="user" style={{ color: "#1FABAB" }} />
            <Input
              placeholder={
                globalState.nameError == false
                  ? "please enter your full name"
                  : "user name cannot be empty"
              }
              autoCapitalize="none"
              onChangeText={value => this.onChangedName(value)}
            />

            {globalState.nameError == false ? (
              <Text />
            ) : (
              <Icon
                onPress={this.removeNameError}
                type="Ionicons"
                name="close-circle"
                style={{ color: "#00C497" }}
              />
            )}
          </Item>

          <Item rounded style={styles.input} error={globalState.emailError}>
            <Icon
              active
              type="MaterialIcons"
              name="email"
              style={{ color: "#1FABAB" }}
            />
            <Input
              keyboardType="email-address"
              placeholder={
                globalState.emailError == false
                  ? "please enter email"
                  : "Please enter valid email"
              }
              autoCapitalize="none"
              onChangeText={value => this.onChangedEmail(value)}
            />

            {globalState.emailError == false ? (
              <Text />
            ) : (
              <Icon
                onPress={this.removeEmailError}
                type="Ionicons"
                name="close-circle"
                style={{ color: "#00C497" }}
              />
            )}
          </Item>

          <Item rounded style={styles.input} error={globalState.ageError}>
            <Icon
              active
              type="MaterialIcons"
              name="date-range"
              style={{ color: "#1FABAB" }}
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
          </Item>

          <Item rounded style={styles.input} error={globalState.passwordError}>
            <Icon
              active
              type="Ionicons"
              name="ios-lock"
              style={{ color: "#1FABAB" }}
            />
            <Input
              secureTextEntry
              placeholder={
                globalState.passwordError == false
                  ? "Please enter   password"
                  : "password cannot be empty"
              }
              autoCapitalize="none"
              returnKeyType="next"
              inverse
              onChangeText={value => this.onChangedPassword(value)}
            />

            {globalState.passwordError == false ? (
              <Text />
            ) : (
              <Icon
                onPress={this.removePasswordError}
                type="Ionicons"
                name="close-circle"
                style={{ color: "#00C497" }}
              />
            )}
          </Item>

          <Item
            rounded
            style={styles.input}
            error={globalState.newPasswordError}
          >
            <Icon
              active
              type="Ionicons"
              name="ios-lock"
              style={{ color: "#1FABAB" }}
            />
            <Input
              secureTextEntry
              placeholder={
                globalState.newPasswordError == false
                  ? "Please confirm password"
                  : "password not matching"
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
              <Icon
                onPress={this.removeNewPasswordError}
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
            onPress={this.SignUp}
          >
            {globalState.loading ? (
              <Spinner color="yellow" />
            ) : (
              <Text> SignUp </Text>
            )}
          </Button>
        </Content>
      </Container>
    );
  }
}

//</Container><Input type='date' placeholder='please enter birth date'
//onChangeText={value => this.OnChangedAge(value)}/>
