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
import ParticipantModal from "../../ParticipantModal";
import ContactsModal from "../../ContactsModal";
import SelectableContactList from "../../SelectableContactList";
import CreateCommiteeModal from "./CreateCommiteeModal";
import moment from "moment";
import stores from '../../../stores';
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
    const { initialPage } = this.props;
    this.state = {
      Event: this.props.navigation.getParam("Event")
        ? this.props.navigation.getParam("Event")
        : undefined,/*{ about: { title: "Event title" }, updated: true },*/
      initalPage: this.props.navigation.getParam("tab")
        ? this.props.navigation.getParam("tab")
        : "EventDetails",
      currentPage: this.props.navigation.getParam("tab") ? this.props.navigation.getParam("tab") : "EventDetails",
      isOpen: this.props.navigation.getParam('isOpen') ? this.props.navigation.getParam('isOpen') : false,
      participants: undefined,
      members: []
    };
    //this.props.Event = this.props.navigation.getParam("Event");
  }
  state = {
    Event: undefined /*{ about: { title: "Event title" }, updated: true }*/,
    activeTab: undefined,
    initalPage: "EventDetails",
    currentPage: "Details",
    enabled: false,
    members: [],
    isOpen: false
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
  isOpen = false
  renderMenu() {
    //console.error(this.props.navigation.getParam("Event").participant)
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
        return <EventChat showMembers={(members) => {
          console.warn(members)
          this.setState({
            showMembers: true,
            participants: members
          })
        }} {...this.props} showContacts={(conctacts) => {
          this.setState({
            contactModalOpened: true,
            contacts: conctacts
          })
        }}></EventChat>
      case "Contributions":
        return <Contributions {...this.props}></Contributions>
      case "ChangeLogs":
        return <ChangeLogs></ChangeLogs>

    }
  }
  componentWillMount() {
    stores.LoginStore.getUser().then(user =>{
      this.user = user;
      //this.event = this.props.navigation.getParam("Event")
      BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this))
    })
  }
  user = null
  event = this.props.navigation.getParam("Event")
  handleBackButton() {
    if (!this.isOpen) {
      this.isOpen = true
      this.setState({
        isOpen: true,
        members: []
      })
      return true
    }
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);

  }
  array = new Array(100)
  _allowScroll(scrollEnabled) {
    this.setState({ scrollEnabled: scrollEnabled })
  }
  showMembers() {
    this.setState({
      showMembers: true,
      participants: this.event.participant

    })
  }
  processResult(data) {
    this.setState({
      isSelectableListOpened: false,
      isCommiteeModalOpened: true,
      commiteeMember: data
    })
    //console.warn(data)
  }
  createCommitee(data) {
    this.setState({
      isCommiteeModalOpened: false
    })
    let commitee = {
      id: this.state.event_id + "-" + data.commiteeName,
      creator:this.user.phone,
      created_at: moment().format(),
      updated_at: moment().format(),
      member: this.state.commiteeMember.unshift(this.event.creator),
      name: data.commiteeName,
      public_state: data.publicState,
      event_id: this.state.event_id
    }
    //console.warn(data)
  }
  render() {
    return (<SideMenu autoClosing={true} onMove={(position) => {

    }} bounceBackOnOverdraw={false} onChange={(position) => {
      this.isOpen = position
    }} isOpen={this.isOpen} openMenuOffset={this.currentWidth}
      menu={<SWView showSelectableMembers={() => {
        this.setState({
          isSelectableListOpened: true,
          members: this.event.participant
        })
      }} showMembers={() => this.showMembers()} setCurrentPage={(page) => {
        this.isOpen = false
        this.setState({ currentPage: page })
      }
      } currentPage={this.state.currentPage} width={this.currentWidth}
        event={this.event} master={true} Event={{ public: true }}></SWView>}>
      <View style={{ height: "100%", backgroundColor: "#FEFFDE" }}>
        {
          this.renderMenu()
        }
        <ParticipantModal participants={this.state.participants} isOpen={this.state.showMembers} onClosed={() => {
          this.setState({
            showMembers: false,
            participants: undefined
          })
        }} event_id={this.event.id}></ParticipantModal>
        <ContactsModal isOpen={this.state.contactModalOpened} onClosed={() => {
          this.setState({
            contactModalOpened: false,
            conctacts: []
          })
        }} contacts={this.state.contacts}></ContactsModal>
        <SelectableContactList members={this.state.members} close={() => {
          this.setState({
            isSelectableListOpened: false
          })
        }} isOpen={this.state.isSelectableListOpened} takecheckedResult={(data) => this.processResult(data)}>
        </SelectableContactList>
        <CreateCommiteeModal isOpen={this.state.isCommiteeModalOpened} createCommitee={(data) => this.createCommitee(data)} close={() => this.setState({
          isCommiteeModalOpened: false
        })}></CreateCommiteeModal>
      </View>
    </SideMenu>
    );
  }
}
