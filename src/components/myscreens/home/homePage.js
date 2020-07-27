/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import {
  Platform,
  View,
  StatusBar,
  AppState,
  Linking,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { withInAppNotification } from "react-native-in-app-notification";
import stores from "../../../stores";
import CurrentEventView from "../currentevents";
import emitter from "../../../services/eventEmiter";
import firebase from "react-native-firebase";
import GState from "../../../stores/globalState";
import Icon from "react-native-vector-icons/EvilIcons";
import DeepLinking from "react-native-deep-linking";
import shadower from "../../shadower";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import colorList from "../../colorList";
import BeNavigator from "../../../services/navigationServices";

let { height, width } = Dimensions.get("window");

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: "active",
      isTabModalOpened: false,
      currentTab: 0,
      setting: false,
      openBCamera: false,
    };
    this.permisssionListener();
  }
  state = {};
  //initialise menu
  _menu = null;

  permisssionListener() {
    firebase
      .messaging()
      .hasPermission()
      .then((status) => {
        if (status) {
          this.initializeNotificationListeners();
        } else {
          firebase
            .messaging()
            .requestPermission()
            .then((permission) => {
              if (permission) {
                this.permisssionListener();
              } else {
                console.warn("unable to get permission !");
              }
            });
        }
      });
  }
  navigateToChat(data) {
    this.handleNotif(data);
  }
  handleNotif(data) {
    switch (data.type) {
      case "new_message_activity": {
        stores.Events.loadCurrentEvent(data.activity_id).then((event) => {
          BeNavigator.navigateToActivity("EventChat", event);
        });
        break;
      }
      case "relation": {
        break;
      }
      //break;
      default:
        console.warn("defaulting.=------");
        break;
    }
  }
  handleNotifications(data) {
    this.handleNotif(data);
  }
  initializeNotificationListeners() {
    this.removeNotificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notifiation) => {
        this.navigateToChat(notifiation.notification._data);
        firebase.notifications().removeAllDeliveredNotifications();
      });
    this.removeNotificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        console.warn(notification._data);
        GState.currentCommitee !== notification._data.room_key &&
          emitter.emit(notification._data.activity_id + "_refresh-commitee");
        emitter.emit("notify", {
          body: notification._body,
          title: notification._title,
          action: "new_message",
          data: notification._data,
        });
      });
    this.removeNotificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed((notification) => {
        console.warn(notification);
      });
  }
  navigateToEventDetails(id) {
    let event = stores.Events.events.find((ele) => ele.id == id);
    if (event) {
      BeNavigator.navigateToActivity("EventChat", event);
    }
  }
  componentWillMount() {
    Linking.addEventListener("url", this.handleURL);
    DeepLinking.addScheme(GState.DeepLinkURL);
    DeepLinking.addRoute("/tester", (response) => {
      console.warn("responding to this nice test", response);
    });
    DeepLinking.addRoute("/event/:id", (response) => {
      this.navigateToEventDetails(response.id);
    });
    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
    AppState.addEventListener("change", this._handleAppStateChange);
  }
  animating = false;
  realNew = [];
  componentDidMount() {
    stores.Events.initSearch();
    emitter.on("notify", (event) => {
      if (GState.currentRoom !== event.data.room_key) {
        this.props.showNotification({
          title: event.title,
          message: event.body,
          vibrate: false,
          onPress: () => this.handleNotifications(event.data),
        });
      }
      stores.LoginStore.getUser().then((user) => {
        firebase
          .messaging()
          .requestPermission()
          .then((staus) => {
            firebase
              .messaging()
              .getToken()
              .then((token) => {
                firebase
                  .database()
                  .ref(`notifications_tokens/${user.phone.replace("00", "+")}`)
                  .set(token);
              })
              .catch((error) => {
                console.warn(error);
              });
          });
      });
    });
  }
  exiting = false;
  timeout = null;
  componentWillUnmount() {
    this.removeNotificationDisplayedListener();
    Linking.removeEventListener("url", this.handleUrl);
    this.removeNotificationListener();
    AppState.removeEventListener("change", this._handleAppStateChange);
    this.removeNotificationOpenedListener();
  }
  _handleAppStateChange = (nextAppState) => {
    if (nextAppState !== "active") {
      firebase
        .database()
        .ref(`current_room/${stores.LoginStore.user.phone.replace("00", "+")}`)
        .set(null);
    }
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      firebase
        .database()
        .ref(`current_room/${stores.LoginStore.user.phone.replace("00", "+")}`)
        .set(GState.currentRoom);
      console.warn("App has come to the foreground!");
    } else {
    }
    this.setState({ appState: nextAppState });
  };
  state = {
    scroll: true,
    currentTab: 0,
  };

  mapFunction = (item) => {
    return item;
  };

  /*
  settings = () => {
    BeNavigator.navigateTo("Settings");
    //BeNavigator.pushTo('SwiperComponent',{dataArray: media,mapFunction:this.mapFunction,currentIndex: 0});
    //this.setState({ openBCamera: true });
  };*/

  settings = () => {
    stores.LoginStore.getUser().then((user) => {
      !user.status ? (user.status = "") : null;
      BeNavigator.navigateTo("Profile", { userInfo: user });
    });
  };

  handleURL = ({ url }) => {
    console.warn("responding to links");
    Linking.canOpenURL(url).then((support) => {
      if (support) {
        DeepLinking.evaluateUrl(url);
      }
    });
  };
  navigateToInvitations() {
    BeNavigator.navigateTo("voteCard");
  }
  render() {
    GState.nav = this.props.navigation
    StatusBar.setBackgroundColor(colorList.headerBackground, true);
    StatusBar.setBarStyle("dark-content", true);
    StatusBar.setHidden(false, true);
    return (
      <View style={styles.mainContainer}>
        <View style={styles.subContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.headerImageContainer}>
              <Image
                resizeMode={"cover"}
                source={GState.bleashupImage}
                style={styles.headerImage}
              />
            </View>
            <View style={styles.settingsIconStyleContainer}>
              <TouchableOpacity
                style={styles.settingsIconStyleContainerSub}
                onPress={this.settings}
              >
                <Icon
                  name="gear"
                  style={styles.settingsIcon}
                  onPress={this.settings}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.content}>
          <CurrentEventView {...this.props} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    height: colorList.containerHeight,
    backgroundColor: colorList.containerBackground,
    width: colorList.containerWidth,
  },
  subContainer: {
    height: colorList.headerHeight,
    backgroundColor: colorList.headerBackground,
    width: "100%",
    marginBottom: 5,
  },
  headerContainer: {
    ...bleashupHeaderStyle,
    backgroundColor: colorList.headerBackground,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  headerImageContainer: {
    alignSelf: "flex-start",
    justifyContent: "center",
    height: "95%",
  },
  headerImage: {
    width: 120,
    height: 50,
  },
  settingsIconStyleContainer: {
    height: "100%",
    alignSelf: "flex-end",
    display: "flex",
    flexDirection: "row",
    marginRight: "2%",
  },
  settingsIconStyleContainerSub: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsIcon: {
    color: colorList.headerIcon,
    fontSize: 30,
    marginLeft: width / 35,
  },
  content: { marginBottom: 100 },
});
export default withInAppNotification(Home);
