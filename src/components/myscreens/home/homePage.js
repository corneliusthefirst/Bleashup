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
import NetInfo from "@react-native-community/netinfo";
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
import stores from "../../../stores";



@observer
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    NetInfo.isConnected.addEventListener("connectionChange", this.handleConnectionChange);
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

  handleConnectionChange(connect) {
    connect ? console.warn("connected") : console.warn("not connected")
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
    //console.disableYellowBox = true; 
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
                name="gear"
                active={true}
                type="EvilIcons"
                style={{
                  padding: 15,
                  paddingLeft: 100,
                  color: "#FEFFDE"
                }}
                onPress={this.settings()}
              />
            </Header>
          }
          headerHeight={40}
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
                  <Icon name="calendar" type="EvilIcons" />
                </TabHeading>
              }
            >
              <PersonalEventView {...this.props} />
            </Tab>
            <Tab
              heading={
                <TabHeading>
                  <Icon name="sc-telegram" type="EvilIcons" />
                </TabHeading>
              }
            >
              <InvitationView {...this.props} />
            </Tab>
            <Tab
              heading={
                <TabHeading>
                  <Icon name="comment" type="EvilIcons" />
                </TabHeading>
              }
            >
              <Chats {...this.props} />
            </Tab>
            <Tab
              heading={
                <TabHeading>
                  <Icon name="user" type="EvilIcons" />
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
