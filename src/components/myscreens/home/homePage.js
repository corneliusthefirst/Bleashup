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
  Keyboard
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
import IDMaker from '../../../services/IdMaker';
import { PrivacyRequester } from '../settings/privacy/Requester';
import BeComponent from '../../BeComponent';
import DetailsModal from "../invitations/components/DetailsModal";
import Searcher from "../Contacts/Searcher";
import { justSearch, cancelSearch, startSearching } from '../eventChat/searchServices';

let { height, width } = Dimensions.get("window");

class Home extends BeComponent {
  constructor(props) {
    super(props);
    this.state = {
      appState: "active",
      isTabModalOpened: false,
      currentTab: 0,
      showDetailModal: false,
      setting: false,
      openBCamera: false,
    };
    this.permisssionListener();
    this.search = justSearch.bind(this)
    this.cancelSearching = cancelSearch.bind(this)
    this.startSearching = startSearching.bind(this)
  }
  state = {
    showDetailModal: false
  };
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
  isMember = (event) => event && event.participant &&
    event.participant.findIndex(ele => ele && ele.phone === stores.LoginStore.user.phone) >= 0
  handleNotif(data) {
    stores.Events.loadCurrentEvent(data.activity_id).then(activity => {
      if (this.isMember(activity)) {
        BeNavigator.pushActivityWithIndex(activity, data)
      } else {
        this.showDetailModal(activity, data)
      }
    })
  }
  showDetailModal(event, data) {
    if (data.remind_id) {
      BeNavigator.goToRemindDetail(data.remind_id, data.activity_id)
    } else if (data.post_id) {
      BeNavigator.gotoStarDetail(data.post_id, data.activity_id)
    } else {
      console.warn("setting event")
      this.setStatePure({
        showDetailModal: true,
        data: data || this.state.data,
        event: event || this.state.event
      })
    }
  }
  hideDetailModal() {
    this.setStatePure({
      showDetailModal: false
    })
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
  navigateToEventDetails(id, remind_id,post_id) {
    data = {
      activity_id: id, remind_id,post_id
    }
    this.handleNotifications(data)
  }
  componentMounting() {
    Linking.addEventListener("url", this.handleURL);
    DeepLinking.addScheme(GState.DeepLinkURL);
    DeepLinking.addScheme(GState.DeepLinkURLs);
    DeepLinking.addRoute("/tester", (response) => {
      console.warn("responding to this nice test", response);
    });
    DeepLinking.addRoute("/event/:id", (response) => {
      this.navigateToEventDetails(response.id);
    });
    DeepLinking.addRoute("/event/:id/reminds/:remind_id", (response) => {
      this.navigateToEventDetails(response.id, response.remind_id);
    });
    DeepLinking.addRoute("/event/:id/stars/:post_id", (response) => {
      this.navigateToEventDetails(response.id, null,response.post_id);
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
    //stores.Events.initSearch();
    emitter.on("notify", (event) => {
      if (GState.currentRoom !== event.data.room_key) {
        this.props.showNotification({
          title: event.title,
          message: event.body,
          vibrate: false,
          onPress: () => this.handleNotifications(event.data),
        });
      }
    });
  }
  exiting = false;
  timeout = null;
  unmountingComponent() {
    this.removeNotificationDisplayedListener();
    Linking.removeEventListener("url", this.handleUrl);
    this.removeNotificationListener();
    AppState.removeEventListener("change", this._handleAppStateChange);
    this.removeNotificationOpenedListener();
  }
  hide_keyboard_event = "hide_keyboard"
  _handleAppStateChange = (nextAppState) => {
    if (nextAppState !== "active") {

    }
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      GState.currentRoom && PrivacyRequester.makeOnline()
      console.warn("App has come to the foreground!");
    } else {
      Keyboard.dismiss()
      PrivacyRequester.makeOffline()
    }
    //this.setState({ appState: nextAppState });
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
    //BeNavigator.pushTo('SwiperComponent',{dataArray: media,mapFunction:this.mapFunction,currentIndex: 0});
    //BeNavigator.pushTo('Pagin');
    //this.setState({ openBCamera: true });
    BeNavigator.navigateTo("Profile");
  }

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
              {this.state.searching ? null : <Image
                resizeMode={"cover"}
                source={GState.bleashupImage}
                style={styles.headerImage}
              />}
            </View>
            <View style={styles.settingsIconStyleContainer}>
              <View style={{
                height: 35,
                ...this.state.searching ? { width: "80%" } : { width: 35 }
              }}>
                <Searcher
                  searching={this.state.searching}
                  search={this.search}
                  startSearching={this.startSearching}
                  cancelSearch={this.cancelSearching}
                  searchString={this.state.searchString}
                >
                </Searcher>
              </View>
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
          <CurrentEventView searchString={this.state.searchString} {...this.props} />
          <DetailsModal
            isToBeJoint
            data={this.state.data}
            isOpen={this.state.showDetailModal}
            event={this.state.event}
            openModal={this.showDetailModal.bind(this)}
            onClosed={() => this.hideDetailModal()}
          >
          </DetailsModal>
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
    alignItems: 'center',
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
