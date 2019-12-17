import React, { Component } from "react";
import {
  View,
  Dimensions,
  BackHandler,
  StatusBar,
  Platform
} from 'react-native';
import {
  Spinner,
  Toast,
} from "native-base";
import EventDatails from "../eventDetails";
import Remind from "../reminds";
import Highlights from "../highlights";
import Votes from "../votes";
import { reject } from "lodash"
import EventChat from "../eventChat";
import Contributions from "../contributions";
import BleashupFlatList from "../../BleashupFlatList";
import SWView from './SWView';
import SideMenu from 'react-native-side-menu';
import ImagePicker from 'react-native-customized-image-picker';
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
import ContactListModal from "./ContactListModal";
import ContentModal from "./ContentModal";
import InviteParticipantModal from "./InviteParticipantModal";
import MamageMembersModal from "./ManageMembersModal";
import AreYouSure from "./AreYouSureModal";
import { RemoveParticipant } from '../../../services/cloud_services';
import SettingsModal from "./SettingsModal";
import CalendarSynchronisationModal from "./CalendarSynchronisationModal";
import CalendarServe from '../../../services/CalendarService';
import SetAlarmPatternModal from "./SetAlarmPatternModal";
import PhotoInputModal from "./PhotoInputModal";
import PhotoViewer from "./PhotoViewer";
import rnFetchBlob from 'rn-fetch-blob';
import * as config from "../../../config/bleashup-server-config.json"
import SearchImage from "./createEvent/components/SearchImage";
const AppDir = rnFetchBlob.fs.dirs.SDCardDir + '/Bleashup'

const screenWidth = Math.round(Dimensions.get('window').width);

var swipeoutBtns = [
  {
    text: 'Button'
  }
]
export default class Event extends Component {
  constructor(props) {
    super(props);
    this.uploadURL = config.file_server.protocol +
      "://" + config.file_server.host + ":" + config.file_server.port + "/photo/save"
    this.baseURL = config.file_server.protocol +
      "://" + config.file_server.host + ":" + config.file_server.port + '/photo/get/'
    const { initialPage } = this.props;
    this.state = {
      currentPage: "",
      participants: undefined,
      roomName: "Generale",
      members: [],
      roomID: this.event.id,
      newMessageCount: 0,
      fresh: false,
      mounted:false,
      public_state: false,
      opened: true,
      isManagementModalOpened: false,
      roomMembers: this.event.participant,
      working: false,
      showNotifiation: false,
    };
    this.backHandler = null
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
  textStyle = {
    fontSize: 15
  }
  currentWidth = screenWidth * 2 / 3
  isOpen = this.props.navigation.getParam('isOpen') ? this.props.navigation.getParam('isOpen') : false
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
          generallyMember={this.member}
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
        return <ChangeLogs showMembers={(members) => {
          this.setState({
            showMembers: true,
            partimembers: members,
            hideTitle: true
          })
        }}
          openPhoto={(url) => {
            this.setState({
              showPhoto: true,
              photo: url
            })
          }}
          showContacts={(contacts) => {
            this.setState({
              contactList: contacts,
              isContactListOpened: true
            })
          }}
          showContent={(content => {
            this.setState({
              textContent: content,
              isContentModalOpened: true
            })
          })}
          activeMember={this.state.activeMember}
          forMember={this.state.forMember}
          event_id={this.event.id}></ChangeLogs>

    }
  }
  bandMember(members) {
    if (!this.state.working) {
      this.setState({
        // isManagementModalOpened:false,
        working: true
      })
      Requester.bandMembers(members, this.event.id).then((mem) => {
        this.setState({
          working: false
        })
        this.event.participant = reject(this.event.participant, ele => findIndex(members, { phone: ele.phone }) >= 0)
        Toast.show({ text: "members successfully baned", type: "success", })
        emitter.emit("parti_removed")
        RemoveParticipant(this.event.id, mem).then(() => {

        })
      }).catch(e => {
        this.setState({
          working: false
        })
        Toast.show({ text: "Unable to process request !" })
      })
    }
  }
  changeEventMasterState(newState) {
    if (!this.state.working) {
      this.setState({
        isManagementModalOpened: false,
        working: true
      })
      Requester.changeEventMasterState(newState, this.event.id).then(() => {
        this.setState({
          working: false
        })
        this.event.participant = this.event.participant.map(e => e.phone == newState.phone ? newState : e)
        Toast.show({ text: "master state successfully updated", type: "success" })
      }).catch((e) => {
        this.setState({
          isManagementModalOpened: false,
          working: false
        })
        Toast.show({ text: "unable to perform this action" })
      })
    } else {
      this.setState({
        isManagementModalOpened: false
      })
      Toast.show({ text: "App Busy !" })
    }
  }
  refreshePage() {
    this.setState({
      fresh: true
    })
    setTimeout(() => {
      this.setState({
        fresh: false
      })
    }, 100)
  }
  handleActivityUpdates(change, newValue) {
    if (!this.unmounted)
      this.setState({
        change: change,
        showNotifiation: true
      })
    if (change.changed.toLowerCase().includes("commitee")) {
      if (change.changed.toLowerCase().includes("created")) this.event.commitee.unshift(change.new_value.new_value)
      this.refreshCommitees()
      let commitee = newValue
      if (commitee.id == this.state.roomID) {
        emitter.emit("open-close", commitee.opened)
        emitter.emit('publish-unpublish', commitee.public_state)
        if (!this.unmounted) this.setState({
          //roomID: commitee.id,
          roomName: commitee.name,
          //opened:commitee.opened,
          public_state: commitee.public_state,
          opened: commitee.opened,
          newMessageCount: GState.currentRoomNewMessages ? GState.currentRoomNewMessages.length : 0,
          roomMembers: commitee.member
        })
      }
    } else if (change.changed.toLowerCase().includes("participant") || change.changed.toLowerCase().includes("activity")) {
      ///this.event = newValue
      this.event = find(stores.Events.events, { id: this.event.id })
      this.initializeMaster()
      this.refreshCommitees()
    }
    if (!this.unmounted) emitter.emit('refresh-history')
    setTimeout(() => {
      this.setState({
        change: null,
        showNotifiation: false
      })
    }, 4000)
  }
  member = false
  initializeMaster() {
    this.user = stores.LoginStore.user;
    stores.Events.loadCurrentEvent(this.event.id).then(e => {
      this.event = e
      let member = find(this.event.participant, { phone: this.user.phone })
      this.master = member && member.master
      this.member = member ? true : false
      this.setState({
        working: false
      })
    })
  }
  master = false
  componentWillMount() {
    this.unmounted = false
    emitter.on(`event_updated_${this.event.id}`, (change, newValue) => {
      //console.warn(change)
      this.handleActivityUpdates(change, newValue)
    })
    this.initializeMaster()
    //this.event = this.props.navigation.getParam("Event")
    if (this.backHandler)
      this.backHandler.remove();
   this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this))
  }
  user = null
  event = this.props.navigation.getParam("Event")
  handleBackButton() {
    console.warn("handling backpress from simple activity")
    if (!this.isOpen) {
      this.isOpen = true
      this.setState({
        isOpen: true,
        members: []
      })
      return true
    } else {
      this.props.navigation.navigate("Home")
      return true
    }
  }
  componentDidMount() {
    console.warn(this.event.calendar_id)
    if (!this.event.calendared) {
      this.setState({
        isSynchronisationModalOpned: true
      })
    } else if (!this.event.configured) {
      this.setState({
        isSettingsModalOpened: true
      })
    }
      this.setState({
        currentPage: this.props.navigation.getParam("tab"),
        mounted: true
      })

    this.refreshePage()
  }
  componentWillUnmount() {
    this.unmounted = true
    console.warn("unMounting")
    GState.currentCommitee = null
    this.backHandler.remove()

  }
  _allowScroll(scrollEnabled) {
    this.setState({ scrollEnabled: scrollEnabled })
  }
  showMembers() {
    this.setState({
      isManagementModalOpened: true,
      partimembers: this.event.participant

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
        !this.event.commitee || this.event.commitee.length <= 0 ? this.event.commitee = [commitee.id] :
          this.event.commitee.unshift(commitee.id)
        console.warn('marking as not working!!')
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
            if (snapshoot.val()) {
              newMembers = { ...snapshoot.val(), members: unionBy(snapshoot.val().members, members, "phone") }
              firebase.database().ref(key).set(newMembers)
            } else {
              firebase.database().ref(key).set({
                name: this.state.roomName,
                members: unionBy(this.state.roomMembers, members, "phone")
              })
            }
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
  invite(members) {
    if (!this.state.working) {
      this.setState({
        working: true,
        isInviteModalOpened: false
      })
      Requester.invite(members, this.event.id).then(() => {
        this.setState({
          working: false
        })
      }).catch(err => {
        this.setState({
          working: false
        })
        Toast.show({ message: "unable to connect to the server" })
      })
    } else {

      Toast.show({ message: "App is busy !" })
    }
  }
  refreshCommitees() {
    emitter.emit("refresh-commitee")
    //this.refs.swipperView.refreshCommitees()
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
            if (snapshoot.val()) {
              let newMembers = snapshoot.val().filter(ele => (findIndex(mem, { phone: ele.phone }) < 0))
              firebase.database().ref(key).set(newMembers)
            } else {
              firebase.database().ref(key).set(this.state.roomMembers.filter(ele => (findIndex(mem, { phone: ele.phone }) < 0)))
            }
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
      GState.previousCommitee = GState.currentCommitee
      GState.currentCommitee = null;
      emitter.emit("current_commitee_changed", GState.previousCommitee)
    }
    else {
      emitter.emit("current_commitee_changed", GState.previousCommitee)
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
        emitter.emit("open-close", true)
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
  inviteContacts() {
    this.setState({
      isInviteModalOpened: true
    })
  }
  checkActivity(memberPhone) {
    this.isOpen = false
    this.resetSelectedCommitee()
    this.setState({
      currentPage: "ChangeLogs",
      isManagementModalOpened: false,
      activeMember: memberPhone
    })
    this.refreshePage()
  }
  openSettingsModal() {
    this.setState({
      isSettingsModalOpened: true
    })
  }
  openPhotoSelectorModal() {
    this.setState({
      isSelectPhotoInputMethodModal: true
    })
  }
  leaveActivity() {
    this.isOpen = true;
    if (!this.state.working) {
      this.setState({
        working: true,
        isAreYouSureModalOpened: false
      })
      Requester.leaveActivity(this.event.id, this.user.phone).then(() => {
        this.initializeMaster()
        this.setState({
          working: false
        })
        emitter.emit(`left_${this.event.id}`) //TODO: this signal is beign listen to in the module current_events>public_events>join
        RemoveParticipant(this.event_id,this.user.phone).then((response) =>{
          console.warn(response)
        })
      }).catch((e) => {
        this.setState({
          working: false
        })
      })
    } else {
      Toast.show({ text: "App Busy " })
    }
  }
  publish() {
    if (!this.state.working) {
      this.setState({
        working: true
      })
      if (this.event.public) {
        Requester.publish(this.event.id).then(() => {
          this.initializeMaster()
        })
      } else {
        this.setState({
          working: false
        })
        Toast.show({ text: "Please First Configure The Activity As Public In The Settings", duration: 5000 })
      }
    } else {
      Toast.show({ text: "App Busy " })
    }
  }
  saveSettings(original, newSettings) {
    if (!this.state.working) {
      this.setState({
        working: true,
        isSettingsModalOpened: false
      })
      Requester.applyAllUpdate(original, newSettings).then((res) => {
        console.warn(res)
        if (res)
          Toast.show({ text: 'All save completely applied !', type: 'success' })
        this.initializeMaster()
      }).catch((erorr) => {
        Toast.show({ text: 'could not perform the request' })
        this.initializeMaster()
      })
    } else {
      this.initializeMaster()
      Toast.show({ text: "App Busy" })
    }
  }
  markAsConfigured() {
    stores.Events.markAsConfigured(this.event.id).then(() => {
      this.initializeMaster()
    })
  }
  closeActivity() {
    if (!this.state.working) {
      this.setState({
        working: true,
        isAreYouSureModalOpened: false,
        isSettingsModalOpened: false
      })
      Requester.updateCloseActivity(this.event, !this.event.closed).then(() => {
        this.initializeMaster()
      }).catch(() => {
        Toast.show({ text: "Unable To process the request" })
      })
    } else {
      Toast.show({ text: "App is Busy" })
    }
  }
  addToCalendar(pattern) {
    this.setState({
      isSetPatternModalOpened: false,
    })
    let alarms = pattern ? pattern : [{
      date: Platform.OS === 'ios'
        ? moment(Bevent.period)
          .subtract(600, 'seconds')
          .toISOString() : parseInt(moment(Bevent.period).diff(moment(Bevent.period).subtract(600, 'seconds'), 'minutes'))
    }, {
      date: Platform.OS === 'ios'
        ? moment(Bevent.period)
          .subtract(1, 'hours')
          .toISOString() : parseInt(moment(Bevent.period).diff(moment(Bevent.period).subtract(1, 'hours'), 'minutes'))
    }]
    CalendarServe.saveEvent(this.event, alarms).then(id => {
      stores.Events.markAsCalendared(this.event.id, id, alarms).then(() => {
        this.initializeMaster()
      })
    })

  }
  openCamera(notCam) {
    this.setState({
      isSelectPhotoInputMethodModal: false
    })
    ImagePicker.openPicker({
      cropping: true,
      isCamera: notCam ? false : true,
      //width:400,
      //height:300,
      //openCameraOnStart: true,
      returnAfterShot: true,
      compressQuality: 50
    }).then(response => {
      this.setState({
        working: true
      })
      let temp = response[0].path.split('/');
      this.task = rnFetchBlob.fetch("POST", this.uploadURL, {
        'content-type': 'multipart/form-data',
      }, [{
        name: "file",
        filename: temp[temp.length - 1],
        type: response[0].mime,
        size: response[0].size,
        data: rnFetchBlob.wrap(response[0].path)
      }])
      this.task.then(respon => {
        let background = this.baseURL + respon.data
        Requester.changeBackground(this.event.id, background).then(res => {
          console.warn(res)
          this.initializeMaster()
        }).catch(err => {
          this.setState({
            working: false
          })
          Toast.show({ text: "Sorry , We are Unable To Perfrom This Action" })
        })
      })
      this.task.catch(error => {
        console.warn("catching activity bacground Photo upload ", error)
        this.setState({
          working: false
        })
      })
    })
  }
  render() {
    StatusBar.setHidden(false, true)
    return (<SideMenu style={{backgroundColor: "#FEFEDE",}} autoClosing={true} onMove={(position) => {

    }} bounceBackOnOverdraw={false} onChange={(position) => {
      this.isOpen = position
    }} isOpen={this.isOpen} openMenuOffset={this.currentWidth}
      menu={<View><SWView
        navigateHome={() =>{
          this.props.navigation.navigate("Home")
        }}
        ref="swipperView"
        publish={() => this.publish()}
        showActivityPhotoAction={() => this.openPhotoSelectorModal()}
        leaveActivity={() => this.member ? this.setState({
          isAreYouSureModalOpened: true,
          warnDescription: "Are You Sure You Want To Leave This Activity ?",
          warnTitle: "Leave Activity",
          callback: this.leaveActivity.bind(this)
        })/*this.leaveActivity()*/ : Toast.show({ text: "You Are Not a  member Anymore !" })}
        openSettingsModal={() => this.master ? this.openSettingsModal() : Toast.show({ text: "Yo cannot configure this Activity !" })}
        ShowMyActivity={(a) => this.checkActivity(a)}
        inviteContacts={() => this.master || this.event.public ? this.inviteContacts() : Toast.show({ text: "You cannot invite for th" })}
        join={(id) => { this.joinCommitee(id) }}
        leave={(id) => { this.leaveCommitee(id) }}
        removeMember={(id, members) => { this.removeMembers(id, members) }}
        addMembers={(id, currentMembers) => this.addCommiteeMembers(id, currentMembers)}
        publishCommitee={(id, stater) => { this.publishCommitee(id, stater) }}
        editName={(newName, id) => this.master ? this.editName(newName, id) : Toast.show({ text: "Connot Update This Commitee" })}
        swapChats={(room) => this.swapChats(room)} phone={stores.LoginStore.user.phone}
        commitees={this.event.commitee ? this.event.commitee : []}
        showCreateCommiteeModal={() => {
          if (!this.state.working && this.master) {
            this.setState({
              isCommiteeModalOpened: true
            })
          } else {
            Toast.show({ text: "cannot Add Commitee" })
          }
        }}
        showMembers={() => this.showMembers()}
        setCurrentPage={(page, data) => {
          this.isOpen = false
          this.setState({ currentPage: page, activeMember: null })
          this.refreshePage()
        }
        }
        currentPage={this.state.currentPage}
        width={this.currentWidth}
        event={this.event}
        master={this.master}
        public={this.event.public}></SWView></View>}>
      <StatusBar hidden={this.state.showPhotoy ? true : false} barStyle="dark-content" backgroundColor={this.state.showPhoto ? 'black' : "#FEFFDE"}></StatusBar>
      <View style={{ height: "100%", backgroundColor: "#FEFFDE" }}>
        {this.state.fresh ? <Spinner size={"small"}></Spinner> :
          this.renderMenu()
        }
        {this.state.showNotifiation ? <View style={{
          position: "absolute", width: "100%", hight: 300, marginRight: "3%",
          marginTop: "10%"
        }}>
          <NotificationModal change={this.state.change} onPress={() => {
            this.setState({
              showNotifiation: false,
              currentPage: "ChangeLogs",
              forMember: !this.state.forMember
            })
            this.resetSelectedCommitee()
          }} close={() => {
            this.setState({
              showNotifiation: false
            })
          }} isOpen={this.state.showNotifiation}></NotificationModal>
          <View style={{ marginRight: "95%", width: "100%", marginBottom: "5%", }}>
            <Spinner size={"small"}></Spinner>
          </View>
        </View> : null}
        {this.state.working ? <View style={{ position: "absolute", marginTop: "-8%", }}><Spinner size={"small"}></Spinner></View> : null}
        <ParticipantModal
          hideTitle={this.state.hideTitle}
          creator={this.event.creator_phone}
          participants={this.state.partimembers ? uniqBy(this.state.partimembers.filter(ele => ele !== null &&
            !Array.isArray(ele)), ele => ele.phone) : []} isOpen={this.state.showMembers}
          onClosed={() => {
            this.setState({
              showMembers: false,
              partimembers: null,
              hideTitle: false
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
            uniqBy(this.state.members.filter(ele => ele !== null && !Array.isArray(ele) && ele.phone !== this.event.creator_phone), ele => ele.phone) : []}
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
        <ContactListModal
          contacts={this.state.contactList}
          isOpen={this.state.isContactListOpened}
          onClosed={() => {
            this.setState({
              isContactListOpened: false,
              contactList: []
            })
          }}
        ></ContactListModal>
        <ContentModal content={this.state.textContent} isOpen={this.state.isContentModalOpened} closed={() => {
          this.setState({
            isContentModalOpened: false,
            textContent: null
          })
        }}></ContentModal>
        <AreYouSure isOpen={this.state.isAreYouSureModalOpened}
          title={this.state.warnTitle}
          closed={() => {
            this.setState({
              isAreYouSureModalOpened: false,
              warnDescription: null,
              warnTitle: null,
              callback: null
            })
          }}
          callback={() => this.state.callback()}
          ok={this.state.okButtonText}
          message={this.state.warnDescription}></AreYouSure>
        <InviteParticipantModal
          invite={(members) => this.invite(members)}
          onClosed={() => {
            this.setState({
              isInviteModalOpened: false
            })
          }} isOpen={this.state.isInviteModalOpened} participant={this.event.participant}>
        </InviteParticipantModal>
        <MamageMembersModal isOpen={this.state.isManagementModalOpened}
          checkActivity={(memberPhone) => this.checkActivity(memberPhone)}
          creator={this.event.creator_phone}
          participants={this.event.participant} master={this.master}
          changeMasterState={(newState) => this.changeEventMasterState(newState)}
          bandMembers={(selected) => this.bandMember(selected)} onClosed={() => {
            this.setState({
              isManagementModalOpened: false
            })
          }}></MamageMembersModal>
        {this.state.isSettingsModalOpened ? <SettingsModal closeActivity={() => {
          this.event.closed ? this.closeActivity() : this.setState({
            isSettingsModalOpened: false,
            isAreYouSureModalOpened: true,
            callback: () => this.closeActivity(),
            warnDescription: "Are You Sure Yo Want To Close This Activiy ?",
            warnTitle: "Close Activity",
            okButtonText: "Close"
          })
        }} event={this.event} saveSettings={(original, newSettings) => {
          this.saveSettings(original, newSettings)
        }} isOpen={this.state.isSettingsModalOpened} onClosed={() => {
          this.markAsConfigured()
          this.setState({
            isSettingsModalOpened: false
          })
        }}>
        </SettingsModal> : null}
        {this.state.isSynchronisationModalOpned ? <CalendarSynchronisationModal
          closed={() => {
            this.setState({
              isSynchronisationModalOpned: false
            })
          }}
          isOpen={this.state.isSynchronisationModalOpned}
          callback={() => this.setState({
            isSetPatternModalOpened: true,
            isSynchronisationModalOpned: false
          })}
        ></CalendarSynchronisationModal> : null}
        {this.state.isSetPatternModalOpened ? <SetAlarmPatternModal
          save={pattern => this.addToCalendar(pattern)}
          date={this.event.period}
          isOpen={this.state.isSetPatternModalOpened} closed={() => {
            this.setState({
              isSetPatternModalOpened: false
            })
          }}></SetAlarmPatternModal> : null}
        <PhotoInputModal
          showActivityPhoto={() => {
            this.event.background ? this.setState({
              showPhoto: true,
              isSelectPhotoInputMethodModal: false,
              photo: this.event.background
            }) : this.setState({
              isSelectPhotoInputMethodModal: false
            })
          }}
          openInternet={() => {
            this.setState({
              isSelectPhotoInputMethodModal: false,
              isSearchImageModalOpened: true
            })
          }}
          openCamera={() => this.openCamera()}
          isOpen={this.state.isSelectPhotoInputMethodModal}
          closed={() => this.setState({
            isSelectPhotoInputMethodModal: false
          })}></PhotoInputModal>
        {this.state.showPhoto ? <PhotoViewer open={this.state.showPhoto} photo={this.state.photo} hidePhoto={() => {
          this.setState({
            showPhoto: false,
            isSelectPhotoInputMethodModal: false
          })
        }}></PhotoViewer> : null}
        <SearchImage accessLibrary={() => this.openCamera(true)} isOpen={this.state.isSearchImageModalOpened} onClosed={() => {
          this.setState({
            isSearchImageModalOpened: false
          })
        }}></SearchImage>
      </View>
    </SideMenu>
    );
  }
}
