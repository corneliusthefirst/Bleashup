import React, { Component } from "react";
import { Platform, ScrollView, BackHandler, ToastAndroid } from "react-native";
import {
  Container,
  Header,
  Title,
  Icon,
  Tabs,
  Tab,
  Body,
  TabHeading
} from "native-base";
import StatusView from "./../status/index";
import InvitationView from "./../invitations/index";
import PersonalEventView from "./../personalevents/index";
import Chats from "../poteschat";
import SettingView from "./../settings/index";
import { CollapsibleHeaderScrollView } from "react-native-collapsible-header-views";
import GState from "../../../stores/globalState";
import { observer } from "mobx-react";
import UserHttpServices from "../../../services/userHttpServices";
import autobind from "autobind-decorator";
import RNExitApp from "react-native-exit-app";
import ServerEventListener from "../../../services/severEventListener";
import connection from "../../../services/tcpConnect";
import UpdatesDispatcher from "../../../services/updatesDispatcher";
import stores from "../../../stores";

@observer
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  handleBackButton() {
    ToastAndroid.show("Back button is pressed", ToastAndroid.SHORT);
    // RNExitApp.exitApp();
    return true;
  }
  isCloseToBottom(nativeEvent) {
    return (
      nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
      nativeEvent.contentSize.height - 20
    );
  }

  ifCloseToTop(nativeEvent) {
    return nativeEvent.contentOffset.y == 0;
  }
  state = {
    scroll: true
  };
  @autobind
  settings() { }

  render() {
    connection.init().then(socket => {
      stores.Session.updateSocket(socket).then(session => { });
    });
    return (
      <Container>
        <CollapsibleHeaderScrollView
          CollapsibleHeaderComponent={
            <Header hasTabs>
              <Body>
                <Title
                  style={{
                    fontWeight: "bold"
                  }}
                >
                  Bleashup
                </Title>
              </Body>

              <Icon
                name="cog"
                active={true}
                type="FontAwesome"
                style={{
                  padding: 15,
                  paddingLeft: 100,
                  color: "#FEFFDE"
                }}
                onPress={this.settings()}
              />
            </Header>
          }
          headerHeight={50}
          /*  scrollEnabled={GState.scrollOuter}
          /*  onScroll={nativeEvent => {
              if (this.isCloseToBottom(nativeEvent.nativeEvent)) {
                GState.scrollOuter = false;
              }
              if (this.ifCloseToTop(nativeEvent.nativeEvent)) {
                GState.scrollOuter = false;
              }
            }}*/
          statusBarHeight={Platform.OS === "ios" ? 20 : 0}
        >
          <Tabs
            locked
            tabBarPosition="overlayTop"
            tabBarUnderlineStyle={{
              borderBottomWidth: 0,
              backgroundColor: "transparent"
            }}
          >
            <Tab
              tabStyle={{
                borderRadius: 0
              }}
              heading={
                <TabHeading>
                  <Icon name="calendar" />
                </TabHeading>
              }
            >
              <PersonalEventView {...this.props} />
            </Tab>
            <Tab
              heading={
                <TabHeading>
                  <Icon name="sc-telegram" />
                </TabHeading>
              }
            >
              <InvitationView {...this.props} />
            </Tab>
            <Tab
              heading={
                <TabHeading>
                  <Icon name="comment" />
                </TabHeading>
              }
            >
              <Chats {...this.props} />
            </Tab>
            <Tab
              heading={
                <TabHeading>
                  <Icon name="user" />
                </TabHeading>
              }
            >
              <StatusView {...this.props} />
            </Tab>
          </Tabs>
        </CollapsibleHeaderScrollView>
      </Container>
    );
  }
}

export default Home;

//  onPress = {this.props.navigation.navigate('Settings')}
