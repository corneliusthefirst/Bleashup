import React, { Component } from "react";
import {
  Platform,
  Text,
  View,
  ScrollView,
  Dimensions,
  BackHandler,
  ToastAndroid
} from "react-native";
import {
  Container,
  Header,
  Title,
  Icon,
  Tabs,
  Left,
  Card,
  CardItem,
  Tab,
  Button,
  ScrollableTab,
  Body,
  TabHeading,
  Right,
  H1,
  H3,
  H2,
  ListItem,
} from "native-base";
import ImageActivityIndicator from "../currentevents/components/imageActivityIndicator";
import EventDatails from "../eventDetails";
import Remind from "../reminds";
import Highlights from "../highlights";
import Votes from "../votes";
import { reject } from "lodash"
import EventChat from "../eventChat";
import Contributions from "../contributions";
import autobind from "autobind-decorator";
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";
import UpdateStateIndicator from "../currentevents/components/updateStateIndicator";
import BleashupFlatList from "../../BleashupFlatList";
import SWView from './SWView';
import SideMenu from 'react-native-side-menu';
import ChangeLogs from "../changelogs";
const screenWidth = Math.round(Dimensions.get('window').width);

var swipeoutBtns = [
  {
    text: 'Button'
  }
]
export default class Event extends Component {
  constructor(props) {
    super(props);
    this.props.Event = this.props.navigation.getParam("Event");
  }
  state = {
    Event: undefined /*{ about: { title: "Event title" }, updated: true }*/,
    activeTab: undefined,
    initalPage: "EventDetails",
    currentPage: "Details",
    enabled: false,
    isOpen:true
  }
  swipoutSetting = {
    close: true,
    autoClose: true,
    sensitivity: 100,
    left: [
      {
        component: <SWView master={true} Event={{ public: true }}></SWView>
      }
    ],
  }

  TabsNames = [
    { name: "EventDetails" },
    { name: "EventChat" },
    { name: "Contributions" },
    { name: "Votes" },
    { name: "Highlights" },
    { name: "Reminds" },
  ]
  Names = {
    Contributions: "Contributions",
    Votes: "Votes",
    Highlights: "Highlights",
    Reminds: "Reminds",
    EventChat: "Chat",
    EventDetails: "Details"
  }

  dropInitialRoute(initalPage) {
    return reject(this.TabsNames, { "name": initalPage })
  }

  TabsBody = {
    "Contributions": <Contributions {...this.state} />,
    "Votes": <Votes {...this.state} />,
    "Highlights": <Highlights {...this.props} />,
    "Reminds": <Remind {...this.props} />,
    "Chat": <EventChat {...this.props} />,
    "Details": (<EventDatails {...this.props} />)
  }

  textStyle = {
    fontSize: 15
  }

  TabHeadings = {
    Contributions: <Text style={this.textStyle}>Contributions</Text>,
    Votes: <Text style={this.textStyle}>Votes</Text>,
    Highlights: <Text style={this.textStyle}>Highlights</Text>,
    Reminds: <Text style={this.textStyle}>Reminds</Text>,
    EventChat: <Text style={this.textStyle}>Chat</Text>,
    EventDetails: <Text style={this.textStyle}>Details</Text>
  }
  tabStyle = {};
  activeTabStyle = {
    color: "#FEFFDE",
    fontWeight: "bold"
  };
  componentDidMount() {
    this.props.Event = this.props.navigation.getParam("Event");
    const { initialPage } = this.props;
    this.setState({
      Event: this.props.navigation.getParam("Event")
        ? this.props.navigation.getParam("Event")
        : undefined,/*{ about: { title: "Event title" }, updated: true },*/
      initalPage: this.props.navigation.getParam("tab")
        ? this.props.navigation.getParam("tab")
        : "EventDetails",
      currentPage: this.props.navigation.getParam("tab") ? this.props.navigation.getParam("tab") : "EventDetails"
    });
  }
  @autobind goToChangeLogs() {
    this.props.navigation.navigate("ChangeLogs", { ...this.props })
  }
  currentWidth = screenWidth * 2 / 3
  blinkerSize = 35;
  changeLogIndicatorStyle = {
    margin: "-40%",
    marginTop: "85%"
  }
  @autobind goToHome() {
    this.props.navigation.navigate("Home");
  }
  renderMenu() {
    console.warn(this.state.currentPage)
    switch (this.state.currentPage) {
      case "EventDetails":
        return <EventDatails {...this.props}></EventDatails>
      case "Reminds":
        return <Remind {...this.prpos}></Remind>
      case "Votes":
        return <Votes {...this.props}></Votes>
      case "Highlights":
        return <Highlights {...this.props}></Highlights>
      case "EventChat":
        return <EventChat {...this.props}></EventChat>
      case "Contributions":
        return <Contributions {...this.props}></Contributions>
      case "ChangeLogs":
        return <ChangeLogs></ChangeLogs>

    }
  }
  array = new Array(100)
  _allowScroll(scrollEnabled) {
    this.setState({ scrollEnabled: scrollEnabled })
  }
  render() {
    return (<SideMenu bounceBackOnOverdraw={false} isOpen={this.state.isOpen} openMenuOffset={this.currentWidth} menu={<SWView setCurrentPage={(page) => {
      this.setState({ currentPage: page })
    }
    } currentPage={this.state.currentPage} width={this.currentWidth}
      event={this.props.navigation.getParam("Event")} master={true} Event={{ public: true }}></SWView>}>
      <View style={{ display: 'flex', padding: 3, height: "100%", backgroundColor: "#FEFFDE" }}>
        <Text> is my swipe-view</Text>
        <View style={{ display: "flex" }}>
          {
            this.renderMenu()
          }
        </View>
      </View>
    </SideMenu>
    );
  }
}
