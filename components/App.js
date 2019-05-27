import React from "react";
import { Root } from "native-base";
// import { StackNavigator, DrawerNavigator } from "react-navigation";
import { createDrawerNavigator, createStackNavigator, createAppContainer } from "react-navigation";


import Home from "./myscreens/home/homePage";
import Settings from "./myscreens/settings/index";
import PastEventView from "./myscreens/pastevents/index";
import CurrentEventView from "./myscreens/currentevents/index";
import InvitationView from "./myscreens/invitations/index";
import PersonalEventView from "./myscreens/personalevents/index";
import PotesChat from "./myscreens/poteschat/index";
import Status from "./myscreens/status/index";

/*
import Trash from "./myscreens/trash/index";

import MyReminds from "./myscreens/myreminds/index";
import Help from "./myscreens/help/index";
import Contacts from "./myscreens/contacts/index";
import Notifications from "./myscreens/notifications/index";
*/


const AppNavigator = createStackNavigator(
  {
    Home: { screen: Home },  
    CurrentEventView: { screen: CurrentEventView},
    PassEventView: { screen: PastEventView},
    Settings: { screen: Settings},
    Status: { screen: Status},
    InvitationView: { screen: InvitationView},
    PersonalEventView: {screen:PersonalEventView},
    PotesChat: {screen:PotesChat}
},
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default () =>
  <Root>
    <AppContainer />
  </Root>;



































