import React , { Component }  from "react";
import { Root, StyleProvider } from "native-base";
import { Provider } from "mobx-react/native";
//import reazy from 'reazy';
//import routerActions from 'reazy-native-router-actions';
//import mobx from '../services/mobx';


// import { StackNavigator, DrawerNavigator } from "react-navigation";
import {
  createDrawerNavigator,createStackNavigator,createAppContainer
} from "react-navigation";
import getTheme from "../theme/components";
import Materials from "../theme/variables/material";
import CommonColor from "../theme/variables/commonColor";
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

//const app = reazy();
//app.use(mobx(), 'state');
//app.use(routerActions(), 'routerActions');




const AppNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    CurrentEventView: { screen: CurrentEventView },
    PassEventView: { screen: PastEventView },
    Settings: { screen: Settings },
    Status: { screen: Status },
    InvitationView: { screen: InvitationView },
    PersonalEventView: { screen: PersonalEventView },
    PotesChat: { screen: PotesChat }
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

const AppContainer = createAppContainer(AppNavigator);












export default function() {
  const app = this;
  const stores = app.get("state").getAllStores();
  const services = app.getAllServices();

<StyleProvider style={getTheme(Materials)}>
<Root>
  <StyleProvider style={getTheme(CommonColor)}>
  <Provider {...stores} {...services} app={app}>
      <AppContainer />
    </Provider>
  </StyleProvider>
</Root>
</StyleProvider>

}





















































/*
export default function() {
  return function() {
   

    /*return class Root extends Component {
      constructor() {
        super();
        this.state = {
          isLoading: false,
          isReady: false
        };
      }


      async componentWillMount() {
        await Font.loadAsync({
          Roboto: require("native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
          arial: require("../../Fonts/Arial.ttf")
        });
        this.setState({ isReady: true });
      }

      

      render() {
       /* if (!this.state.isReady) {
          return <AppLoading />;
        }
        return (


        );
      }
    };
  };
}
*/







































/*
export default () => (
  
);
*/


