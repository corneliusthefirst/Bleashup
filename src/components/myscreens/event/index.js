import React, { Component } from "react";
import {
  Platform,
  Text,
  View,
  ScrollView,
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
  Tab,
  Button,
  ScrollableTab,
  Body,
  TabHeading,
  Right,
  H1,
  H3,
  H2,
} from "native-base";
import ImageActivityIndicator from "../currentevents/imageActivityIndicator";
import EventDatails from "../eventDetails";
import Remind from "../reminds";
import Highlights from "../highlights";
import Votes from "../votes";
import { reject } from "lodash"
import EventChat from "../eventChat";
import Contributions from "../contributions";
import autobind from "autobind-decorator";
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";
import UpdateStateIndicator from "../currentevents/updateStateIndicator";

export default class Event extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    Event: undefined /*{ about: { title: "Event title" }, updated: true }*/,
    activeTab: undefined,
    initalPage: "EventDetails",
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
        : undefined/*{ about: { title: "Event title" }, updated: true }*/,
      initalPage: this.props.navigation.getParam("tab")
        ? this.props.navigation.getParam("tab")
        : "EventDetails"
    });
  }
  @autobind goToChangeLogs() {
    this.props.navigation.navigate("ChangeLogs", { ...this.props })
  }
  blinkerSize = 35;
  changeLogIndicatorStyle = {
    margin: "-40%",
    marginTop: "85%"
  }
  @autobind goToHome() {
    this.props.navigation.navigate("Home");
  }
  render() {
    return this.state.Event ? (
      <Container>
        <Header>
          <Left>
            <Button onPress={this.goToHome} transparent>
              <Icon style={{ color: "#FEFFDE" }} name="close" type="EvilIcons" />
            </Button>
          </Left>
          <Body>
            <View>
              <Text style={{ color: "#FEFFDE", fontWeight: "bold", fontSize: 15 }}>{this.state.Event.about.title}</Text>
            </View>
          </Body>
          <Right>
            <View style={{ margin: 10 }}>
              {this.state.Event.updated ? <View style={this.changeLogIndicatorStyle} ><UpdateStateIndicator size={this.blinkerSize}
              ></UpdateStateIndicator></View> : null}
              <TouchableOpacity onPress={this.goToChangeLogs}>
                <Icon style={{
                  fontSize: 23,
                  color: "#FEFFDE"
                }} name="exclamation" type="EvilIcons">
                </Icon>
              </TouchableOpacity>
            </View>
            <Button transparent>
              <Icon name="dots-three-vertical" type="Entypo" />
            </Button>
          </Right>
        </Header>
        <Tabs
          renderTabBar={() => <ScrollableTab style={{
            backgroundColor: "#1FABAB"
          }} />}
          tabBarUnderlineStyle={{ backgroundColor: "#FEFFDE" }}
        >

          <Tab heading={<TabHeading >{this.TabHeadings[this.state.initalPage]}</TabHeading>}>
            <Text>{this.TabsBody[this.Names[this.state.initalPage]]}</Text>
          </Tab>
          {this.dropInitialRoute(this.state.initalPage).map(name => {
            return (<Tab activeTextStyle={{ color: "#FEFFDE" }} heading={<TabHeading>{this.TabHeadings[name.name]}</TabHeading>} >{this.TabsBody[this.Names[name.name]]}</Tab>)
          })}
        </Tabs>
      </Container>) :
      <ImageActivityIndicator />
  }
}
