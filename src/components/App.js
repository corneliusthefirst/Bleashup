import React, { Component } from "react";
import { Root, StyleProvider } from "native-base";

import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";
import getTheme from ".././native-base-theme/components";
import Materials from ".././native-base-theme/variables/material";
import CommonColor from ".././native-base-theme/variables/commonColor";
import Home from "./myscreens/home/homePage";
import Settings from "./myscreens/settings/index";
import PastEventView from "./myscreens/pastevents/index";
import CurrentEventView from "./myscreens/currentevents/index";
import InvitationView from "./myscreens/invitations/index";
import PersonalEventView from "./myscreens/personalevents/index";
import PotesChat from "./myscreens/poteschat/index";
import Status from "./myscreens/status/index";
import LoginView from "./myscreens/login/index";
import ForgotPasswordView from "./myscreens/forgotpassword/index";
import SignUpView from "./myscreens/signUp/index";
import SignInView from "./myscreens/signIn/index";
import LoginHomeView from "./myscreens/loginhome/index";
import stores from "../stores";
import routerActions from "reazy-native-router-actions";
import reazy from "reazy";
import ServerEventListener from "../services/severEventListener";
import connection from "../services/tcpConnect";
import { Provider } from "mobx-react";
//import loginStore from "../stores/login/LoginStore";

const AppNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    CurrentEvent: { screen: CurrentEventView },
    PassEvent: { screen: PastEventView },
    Settings: { screen: Settings },
    Status: { screen: Status },
    Invitation: { screen: InvitationView },
    PersonalEvent: { screen: PersonalEventView },
    PotesChat: { screen: PotesChat },
    Login: { screen: LoginView },
    ForgotPassword: { screen: ForgotPasswordView },
    SignUp: { screen: SignUpView },
    SignIn: { screen: SignInView },
    LoginHome: { screen: LoginHomeView }
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);
const app = reazy();
app.use(routerActions(), "routerActions");

const AppContainer = createAppContainer(AppNavigator);
connection.init().then(socket => {
  ServerEventListener.listen(socket);
});
export default () => (
  <Root>
    <StyleProvider style={getTheme(CommonColor)}>
      <Provider app={app}>
        <AppContainer />
      </Provider>
    </StyleProvider>
  </Root>
);
