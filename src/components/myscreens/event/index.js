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
  Spinner,
  Toast,
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
import { uniqBy, findIndex, find, unionBy } from "lodash"
import Requester from './Requester';
import emitter from '../../../services/eventEmiter';
import GState from '../../../stores/globalState';
import firebase from 'react-native-firebase';
import uuid from 'react-native-uuid';
import NotificationModal from "./NotificationModal";
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
      roomName: "Generale",
      members: [],
      roomID: this.event.id,
      newMessageCount: 0,
      fresh: false,
      public_state: false,
      opened: true,
      roomMembers: this.event.participant,
      working: false
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
  renderMenu(NewMessages) {
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
        return <EventChat
          activity={this.event}
          //activity_name={this.event.about.title}
          roomName={this.state.roomName}
          members={this.state.roomMembers}
          addMembers={() => this.addCommiteeMembers(this.state.roomID, this.state.roomMembers)}
          removeMembers={() => this.removeMembers(this.state.roomID, this.state.roomMembers)}
          publish={() => this.publishCommitee(this.state.roomID, !this.state.public_state)}
          leave={() => this.leaveCommitee(this.state.roomID)}
          close={() => this.closeCommitee(this.state.roomID)}
          open={() => this.openCommitee(this.state.roomID)}
          master={this.master}
          public_state={this.state.public_state}
          opened={this.state.opened}
          roomID={this.state.roomID}
          newMessageCount={GState.currentCommitee === "Generale" && GState.generalNewMessages.length > 0 ?
            GState.generalNewMessages.length : this.state.newMessageCount}
          showMembers={() => {
            let thisMember = find(this.event.participant, { phone: stores.LoginStore.user.phone });
            this.setState({
              showMembers: true,
              partimembers: unionBy(this.state.roomMembers, [thisMember]
                , "phone")
            })
          }} {...this.props}
          showContacts={(conctacts) => {
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
  master = false
  componentWillMount() {
    stores.LoginStore.getUser().then(user => {
      this.user = user;
      member = find(this.event.participant, { phone: user.phone })
      this.master = member.master
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
  _allowScroll(scrollEnabled) {
    this.setState({ scrollEnabled: scrollEnabled })
  }
  showMembers() {
    this.setState({
      showMembers: true,
      participants: this.state.roomMembers

    })
  }
  processResult(data) {
    //console.warn(data)
    this.setState({
      isSelectableListOpened: true,
      isCommiteeModalOpened: false,
      title: "Select Members for the new Commitee",
      members: this.event.participant,
      notcheckall: !data.publicState,
      tempCommiteeName: data.commiteeName,
      tempPublicState: data.publicState
    })
    //console.warn(data)
  }
  createCommitee(data) {
    if (!this.state.working) {
      this.setState({
        isSelectableListOpened: false,
        notcheckall: false,
        creating: true,
        working: true
        // members: null
      })
      let creator = find(this.event.participant, { phone: this.event.creator_phone })
      let currentCreator = find(this.event.participant, { phone: stores.LoginStore.user.phone })
      let arr = [creator, currentCreator]
      let commitee = {
        id: uuid.v1(),
        creator: this.user.phone,
        created_at: moment().format(),
        updated_at: moment().format(),
        member: unionBy(data, arr, "phone"),
        name: this.state.tempCommiteeName,
        public_state: this.state.tempPublicState,
        event_id: this.event.id,
        opened: true
      }
      //console.error(commitee.id)

      //commitee.member = uniqBy(commitee.member, "phone");
      Requester.addCommitee(commitee).then(() => {
        this.event.commitee.unshift(commitee.id)
        this.setState({
          newCommitee: true,
          working: false
        })
        firebase.database().ref(`rooms/${this.event.id}/${commitee.id}`).set({ name: commitee.name, members: commitee.member })
        this.refreshCommitees()
      }).catch(() => {
        this.setState({
          newCommitee: true,
          working: false
        })
      })
      //console.warn(data)
    } else {

      Toast.show({ text: "App is busy" })

    }
  }
  editName(newName, id) {
    if (!this.state.working) {
      this.setState({
        working: true
      })
      Requester.editCommiteeName(newName, id, this.event.id).then(() => {
        this.setState({
          working: false
        })
      }).catch(error => {
        this.setState({
          working: false
        })
        /// console.warn(error)
        emitter.emit("edit-failed", error)
      })
    } else {
      Toast.show({ text: "App is busy" })
    }
  }
  publishCommitee(id, state) {
    if (!this.state.working) {
      this.setState({
        working: true
      })
      Requester.publishCommitee(id, this.event.id, state).then(() => {
        emitter.emit('publish-unpublish', state)
        this.setState({
          working: false,
          public_state: !this.state.public_state
        })
        this.refreshCommitees()
      }).catch(() => {
        this.setState({
          working: false
        })
      })
    } else {
      Toast.show({ text: "App is busy" })
    }
  }
  addCommiteeMembers(id, currentMembers) {
    //console.warn(currentMembers)
    this.setState({
      isSelectableListOpened: true,
      title: "Add Participant To this Commitee",
      members: this.event.participant.filter(ele => findIndex(currentMembers, { phone: ele.phone }) < 0),
      commitee_id: id,
      adding: true
    })
  }
  removeMembers(id, members) {
    this.setState({
      isSelectableListOpened: true,
      title: "Select Members To Remove",
      members: members,
      notcheckall: true,
      commitee_id: id,
      removing: true
    })
  }
  saveCommiteeMembers(members) {
    if (members.length > 0) {
      if (!this.state.working) {
        this.setState({
          working: true,
          isSelectableListOpened: false
        })
        let key = `rooms/${this.event.id}/${this.state.commitee_id}`
        Requester.addMembers(this.state.commitee_id, members, this.event.id).then((mem) => {
          firebase.database().ref(key).once('value', snapshoot => {
            let newMembers = { ...snapshoot.val(), members: unionBy(snapshoot.val().members, members, "phone") }
            firebase.database().ref(key).set(newMembers)
            //this.refreshCommitees()
            this.setState({
              commitee_id: null,
              members: null,
              roomMembers: unionBy(this.state.roomMembers, members, "phone"),
              adding: false,
              working: false
            })
          })
        }).catch(error => {
          this.setState({
            isSelectableListOpened: false,
            commitee_id: null,
            members: null,
            adding: false,
            working: false
          })
        })
      } else {
        this.setState({
          isSelectableListOpened: false,
          commitee_id: null,
          members: null,
          adding: false,
          working: false
        })
        Toast.show({ text: "App is busy" })
      }
    } else {
      this.setState({
        isSelectableListOpened: false,
        commitee_id: null,
        members: null,
        adding: false,
        working: false
      })
      Toast.show({ text: "no members selected" })
    }
  }
  swapChats(commitee) {
    //console.warn(commitee.member, "oooo")
    this.isOpen = false
    this.setState({
      roomID: commitee.id,
      roomName: commitee.name,
      currentPage: "EventChat",
      fresh: true,
      public_state: commitee.public_state,
      opened: commitee.opened,
      newMessageCount: GState.currentRoomNewMessages ? GState.currentRoomNewMessages.length : 0,
      roomMembers: commitee.member
    })
    setTimeout(() => {
      this.setState({
        fresh: false
      })
    }, 100)

  }
  refreshCommitees() {
    this.refs.swipperView.refreshCommitees()
  }
  saveRemoved(mem) {
    //console.warn(mem)
    if (mem.length > 0) {
      if (!this.state.working) {
        this.setState({
          working: true,
          isSelectableListOpened: false
        })
        let key = `rooms/${this.event.id}/${this.state.commitee_id}/members`
        Requester.removeMembers(this.state.commitee_id, mem, this.event.id).then(() => {
          firebase.database().ref(key).once("value", snapshoot => {
            let newMembers = snapshoot.val().filter(ele => (findIndex(mem, { phone: ele.phone }) < 0))
            firebase.database().ref(key).set(newMembers)
            this.setState({
              commitee_id: null,
              members: null,
              roomMembers: this.state.roomMembers.filter(ele => (findIndex(mem, { phone: ele.phone }) < 0)),
              removing: false,
              working: false,
              notcheckall: false
            })
          })
          //this.refreshCommitees()
        }).catch(error => {
          this.setState({
            isSelectableListOpened: false,
            commitee_id: null,
            members: null,
            removing: false,
            notcheckall: false,
            working: false
          })
        })
      } else {
        this.setState({
          isSelectableListOpened: false,
          commitee_id: null,
          members: null,
          removing: false,
          notcheckall: false,
          working: false
        })
        Toast.show({ text: "App is busy" })
      }
    } else {
      this.setState({
        isSelectableListOpened: false,
        commitee_id: null,
        members: null,
        removing: false,
        notcheckall: false,
        working: false
      })
      Toast.show({ text: "no members selected" })
    }
  }
  joinCommitee(id) {
    if (!this.state.working) {
      this.setState({
        working: true
      })
      let member = find(this.event.participant, { phone: stores.LoginStore.user.phone })
      Requester.joinCommitee(id, this.event.id, member).then(() => {
        emitter.emit('joint')
        this.setState({
          working: false
        })
        this.refreshCommitees()
        let key = `rooms/${this.event.id}/${id}`
        firebase.database().ref(key).once('value', snapshoot => {
          let newComm = { ...snapshoot.val(key), members: unionBy(snapshoot.val().members, [member]) }
          firebase.database().ref(key).set(newComm)
        })
      }).catch((error) => {
        this.setState({
          working: false
        })
      })
    } else {
      Toast.show({ text: "no members selected" })
    }
  }
  resetSelectedCommitee() {
    if (GState.currentCommitee !== null) {
      this.previous = GState.currentCommitee
      GState.currentCommitee = null;
      emitter.emit("current_commitee_changed", this.previous)
    }
  }
  leaveCommitee(id) {
    if (!this.state.working) {
      this.setState({
        working: true
      })
      Requester.leaveCommitee(id, this.event.id).then(() => {
        this.isOpen = true
        this.resetSelectedCommitee()
        this.setState({
          currentPage: "EventDetails",
          working: false
        })
        emitter.emit('left')
        this.refreshCommitees()
        let key = `rooms/${this.event.id}/${id}`
        firebase.database().ref(key).once('value', snapshoot => {
          let newComm = { ...snapshoot.val(), members: reject(snapshoot.val().members, { phone: stores.LoginStore.user.phone }) }
          firebase.database().ref(key).set(newComm)
        })
      }).catch(() => {
        this.setState({
          working: false
        })
      })
    } else {
      Toast.show({ text: "App is busy" })
    }
  }
  openCommitee(id) {
    if (!this.state.working) {
      this.setState({
        working: true
      })
      Requester.openCommitee(id, this.event.id).then(() => {
        emitter.emit("open-close", '')
        this.setState({
          working: false,
          opened: true
        })
        this.refreshCommitees()
      }).catch((error) => {
        console.warn(error)
        this.setState({
          working: false
        })
      })
    } else {
      Toast.show({ text: "App is busy" })
    }
  }
  closeCommitee(id) {
    if (!this.state.working) {
      this.setState({
        working: true
      })
      Requester.closeCommitee(id, this.event.id).then(() => {
        emitter.emit("open-close", false)
        this.setState({
          working: false,
          opened: false,
        })
        this.refreshCommitees()
      }).catch((error) => {
        this.setState({
          working: false
        })
        console.warn(error)
      })
    } else {
      Toast.show({ text: "no members selected" })
    }
  }
  render() {
    return (<SideMenu autoClosing={true} onMove={(position) => {

    }} bounceBackOnOverdraw={false} onChange={(position) => {
      this.isOpen = position
    }} isOpen={this.isOpen} openMenuOffset={this.currentWidth}
      menu={<View><SWView
        ref="swipperView"
        join={(id) => { this.joinCommitee(id) }}
        leave={(id) => { this.leaveCommitee(id) }}
        removeMember={(id, members) => { this.removeMembers(id, members) }}
        addMembers={(id, currentMembers) => this.addCommiteeMembers(id, currentMembers)}
        publishCommitee={(id, stater) => { this.publishCommitee(id, stater) }}
        editName={(newName, id) => this.editName(newName, id)}
        swapChats={(room) => this.swapChats(room)} phone={stores.LoginStore.user.phone}
        commitees={this.event.commitee ? this.event.commitee : []}
        showCreateCommiteeModal={() => {
          if (!this.state.working) {
            this.setState({
              isCommiteeModalOpened: true
            })
          }
        }}
        showMembers={() => this.showMembers()}
        setCurrentPage={(page, data) => {
          this.isOpen = false
          this.setState({ currentPage: page, })
        }
        } currentPage={this.state.currentPage}
        width={this.currentWidth}
        event={this.event} master={true} Event={{ public: true }}></SWView></View>}>
      <View style={{ height: "100%", backgroundColor: "#FEFFDE" }}>
        {this.state.fresh ? <Spinner size={"small"}></Spinner> :
          this.renderMenu()
        }
        {this.state.working ? <View style={{ position: "absolute", }}>
          <Spinner size={"small"}></Spinner>
        </View> : null}
        <ParticipantModal
          participants={this.state.partimembers ? uniqBy(this.state.partimembers.filter(ele => ele !== null &&
            !Array.isArray(ele)), ele => ele.phone) : []} isOpen={this.state.showMembers}
          onClosed={() => {
            this.setState({
              showMembers: false,
              partimembers: null
            })
          }} event_id={this.event.id}></ParticipantModal>
        <ContactsModal isOpen={this.state.contactModalOpened} onClosed={() => {
          this.setState({
            contactModalOpened: false,
            conctacts: []
          })
        }} contacts={this.state.contacts}></ContactsModal>
        <SelectableContactList
          removing={this.state.removing}
          notcheckall={this.state.notcheckall}
          saveRemoved={(mem) => this.saveRemoved(mem)}
          adding={this.state.adding}
          title={this.state.title}
          phone={stores.LoginStore.user.phone}
          addMembers={(members) => { this.saveCommiteeMembers(members) }}
          members={this.state.members !== null && this.state.members ?
            uniqBy(this.state.members.filter(ele => ele !== null && !Array.isArray(ele)), ele => ele.phone) : []}
          close={() => {
            this.setState({
              adding: false,
              removing: false,
              members: null,
              notcheckall: false,
              isSelectableListOpened: false
            })
          }}
          isOpen={this.state.isSelectableListOpened}
          takecheckedResult={(data) => this.createCommitee(data)}>
        </SelectableContactList>
        <CreateCommiteeModal isOpen={this.state.isCommiteeModalOpened} createCommitee={(data) => this.processResult(data)} close={() => this.setState({
          isCommiteeModalOpened: false
        })}></CreateCommiteeModal>
      </View>
    </SideMenu>
    );
  }
}
