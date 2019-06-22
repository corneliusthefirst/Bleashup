import React, { Component } from "react";
//import { StyleSheet,Button,Text, TouchableOpacity , View } from 'react-native';
import autobind from "autobind-decorator";
import { Image, TouchableOpacity } from "react-native";
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
  Thumbnail
} from "native-base";
import styles from "./styles";
import UserService from "../../../services/userHttpServices";
import stores from "../../../stores/index";
import globalState from "../../../stores/globalState";

@observer
export default class SignInView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: ""
    };
  }
  loginStore = stores.LoginStore;

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

  @autobind
  forgotPassword() {
    this.props.navigation.navigate("ForgotPassword");
  }

  @autobind
  SignIn() {
    globalState.loading = true;
    this.loginStore.getUser().then(user => {
      UserService.login(user.phone, this.state.password).then(response => {
        if (response) {
          user.password = this.state.password;
          this.loginStore.setUser(user).then(() => {
            globalState.loading = false;
            this.props.navigation.navigate("Home");
          });
        } else {
          globalState.loading = false;
          globalState.error == true
          //alert("Wrong password !");
        }
      });
    });
  }

  render() {
    return (
      <Container>
        <Content>
          <Left />
          <Header>
            <Body>
              <Title>BleashUp </Title>
            </Body>
            <Right>
              <Button onPress={this.back} transparent>
                <Icon type="Ionicons" name="md-arrow-round-back" />
              </Button>
            </Right>
          </Header>

          <Content>
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
          </Content>

          <Button transparent regular style={{ marginBottom: -31 }}>
            <Text> Password </Text>
          </Button>

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
              <Spinner color="yellow" />
            ) : (
              <Text> SignIn </Text>
            )}
          </Button>
        </Content>
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
