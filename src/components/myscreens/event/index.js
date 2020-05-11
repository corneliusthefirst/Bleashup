import React, { Component } from "react";
import {
  View,
  Dimensions,
  BackHandler,
  StatusBar,
  Platform,
  Vibration
} from 'react-native';
import {
  Spinner,
  Toast,
} from "native-base";
import EventDetails from "../eventDetails";
import Remind from "../reminds";
import Highlights from "../highlights";
import Votes from "../votes";
import { reject } from "lodash"
import EventChat from "../eventChat";
import Contributions from "../contributions";
import SWView from './SWView';
import ChangeLogs from "../changelogs";
import ParticipantModal from "../../ParticipantModal";
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
import ManageMembersModal from "./ManageMembersModal";
import AreYouSure from "./AreYouSureModal";
import { RemoveParticipant, AddMembers, RemoveMembers } from '../../../services/cloud_services';
import SettingsModal from "./SettingsModal";
import CalendarSynchronisationModal from "./CalendarSynchronisationModal";
import CalendarServe from '../../../services/CalendarService';
import SetAlarmPatternModal from "./SetAlarmPatternModal";
import PhotoInputModal from "./PhotoInputModal";
import PhotoViewer from "./PhotoViewer";
import SearchImage from "./createEvent/components/SearchImage";
import FileExachange from '../../../services/FileExchange';
import Pickers from '../../../services/Picker';
import HighlightCardDetail from './createEvent/components/HighlightCardDetail';
import RemindRequest from '../reminds/Requester';
import TasksCreation from "../reminds/TasksCreation";
import testForURL from '../../../services/testForURL';
import ProfileModal from "../invitations/components/ProfileModal";
import VideoViewer from '../highlights_details/VideoModal';
import Drawer from 'react-native-drawer'
import shadower from "../../shadower";
import colorList from "../../colorList";
import SettingsTabModal from "./SettingTabModal";
import BeNavigator from '../../../services/navigationServices';

const screenWidth = Math.round(Dimensions.get('window').width);

var swipeoutBtns = [
  {
    text: 'Button'
  }
]

export default class Event extends Component {
  constructor(props) {
    super(props);
    GState.nav = this.props.navigation
    const { initialPage } = this.props;
    this.state = {
      currentPage: "",
      participants: undefined,
      roomName: "Generale",
      members: [],
      roomID: this.event.id,
      newMessageCount: 0,
      fresh: false,
      mounted: false,
      public_state: false,
      opened: true,
      isManagementModalOpened: false,
      roomMembers: this.event.participant,
      working: false,
      isChat: true,
      showNotifiation: false,
    };
    this.backHandler = null
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
  showRemindID(id) {
    this.setState({
      remind_id: id,
      isremindConfigurationModal: true,
      remind: null
    })
  }
  showHighlightID(id) {
    stores.Highlights.loadHighlight(id).then(High => {
      High ? this.setState({
        isHighlightDetailModalOpened: true,
        shouldNotMention: true,
        highlight: High

      }) : null
    })
  }
  showHighlightDetails(H, restoring) {
    this.setState({
      highlight: H,
      shouldRestore: restoring,
      isHighlightDetailModalOpened: true
    })
  }
  addRemindForCommittee(members) {
    emitter.emit("leave-chat")
    this.setState({
      currentPage: "Reminds",
      isChat: false,
      currentRemindMembers: members
    })
  }
  openMenu() {
    this.isOpen = !this.isOpen
    this.setState({
      mounted: true
    })
  }
  currentWidth = .5
  isOpen = false
  renderMenu(NewMessages) {
    switch (this.state.currentPage) {
      case "EventDetails":
        return <EventDetails
        shared={false}
        share={{ 
            id:'1434',
            date:moment().format(),
            sharer:stores.LoginStore.user.phone,
            item_id: "740a5530-8b20-11ea-9234-9b01561bce6b",
            event_id: this.event.id
         }}
        startLoader={() => {
          this.setState({
            working: true
          })
        }}
          openMenu={() => {
            this.openMenu()
          }}
          mention={(data) => this.mentionPost(data)}
          updateLocation={(loc) => this.updateActivityLocation(loc)}
          updateDesc={(newDes) => {
            this.updateActivityDescription(newDes)
          }}
          master={this.master}
          computedMaster={this.computedMaster}
          stopLoader={() => {
            this.setState({
              working: false
            })
          }} {...this.props}
          showVideo={(url) => this.showVideo(url)}
          showHighlight={(h) => this.showHighlightDetails(h)}
          Event={this.event}></EventDetails>
      case "Reminds":
        return <Remind 
        //shared={false}
          share={{
            id: '456322',
            date: moment().format(),
            sharer: stores.LoginStore.user.phone,
            item_id: "a7f976f0-8cd8-11ea-9234-ebf9c3b94af7",
            event_id: this.event.id
          }}
        startLoader={() => {
          this.setState({
            working: true
          })
        }} stopLoader={() => {
          this.setState({
            working: false
          })
        }}
          openMenu={() => this.openMenu()}
          clearCurrentMembers={() => {
            this.setState({
              currentRemindMembers: null
            })
          }}
          currentMembers={this.state.currentRemindMembers}
          mention={(item) => this.mention(item)}
          master={this.master}
          computedMaster={this.computedMaster}
          working={this.state.working}
          event={this.event}
          event_id={this.event.id} {...this.props}></Remind>
      case "Votes":
        return <Votes {...this.props}></Votes>
      case "Highlights":
        return <Highlights {...this.props}></Highlights>
      case "EventChat":
        return <EventChat
          activity_id={this.event.id}
          activity_name={this.event.about.title}
          room_type={"activity"} //!! 'relation' if it's a relation
          //activity_name={this.event.about.title}
          openMenu={() => this.openMenu()}
          showLoader={() => this.startLoader()}
          working={this.state.working}
          addRemind={(members) => this.addRemindForCommittee(members)}
          stopLoader={() => this.stopLoader()}
          showProfile={(pro) => this.showProfile(pro)}
          roomName={this.state.roomName}
          computedMaster={this.computedMaster}
          members={this.state.roomMembers}
          addMembers={() => this.addCommiteeMembers(this.state.roomID, this.state.roomMembers)}
          removeMembers={() => this.removeMembers(this.state.roomID, this.state.roomMembers)}
          publish={() => this.publishCommitee(this.state.roomID, !this.state.public_state)}
          leave={() => this.leaveCommitee(this.state.roomID)}
          close={() => this.closeCommitee(this.state.roomID)}
          open={() => this.openCommitee(this.state.roomID)}
          master={this.master}
          handleReplyExtern={(reply) => {
            if (reply.type_extern.toLowerCase().includes('reminds')) {
              reply.id ? this.showRemindID(reply.id) : null
            } else if (reply.type_extern.toLowerCase().includes('posts')) {
              reply.id ? this.showHighlightID(reply.id) : null
            } else {
              reply.id ? this.showChanges(reply) : null
            }
          }}
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
          showContacts={(conctacts, title) => {
            this.setState({
              isContactListOpened: true,
              title: title,
              contactList: conctacts
            })
          }}></EventChat>
      case "Contributions":
        return <Contributions {...this.props}></Contributions>
      case "ChangeLogs":
        return <ChangeLogs
          propcessAndFoward={(change) => this.propcessAndFoward(change)}
          mention={(data) => this.mention(data)}
          restore={(data) => this.restore(data)}
          openMenu={() => this.openMenu()}
          openPhoto={(url) => this.openPhoto(url)}
          master={this.master}
          isM={this.state.isMe}
          activeMember={this.state.activeMember}
          forMember={this.state.forMember}
          event_id={this.event.id}
          navigatePage={(page) => { BeNavigator.navigateTo(page) }}></ChangeLogs>

    }
  }
  showProfile(pro) {
    stores.TemporalUsersStore.getUser(pro).then(profile => {
      this.setState({
        isProfileModalOpened: true,
        profile: profile
      })
    })
  }
  showChanges(data) {
    let change = {
      //id:data.id,
      changed: data.title,
      updated: data.updated,
      title: data.type_extern,
      //changer : data.replyer_phone,
      new_value: data.new_value
    }
    this.propcessAndFoward(change)
  }
  propcessAndFoward(change) {
    if (change.updated === "add_highlight") {
      this.showHighlightDetails(change.new_value.new_value)
    } else if (change.updated === "restored_remind" || change.updated === "delete_remind") {
      this.showRemind(change.new_value.new_value, change.updated === "delete_remind" ? true : false)
    } else if (change.updated === 'added_remind') {
      this.showRemindID(change.new_value.data)
    } else if (change.updated === "highlight_delete" || change.updated == 'highlight_restored') {
      this.showHighlightDetails(change.new_value.new_value, change.updated == 'highlight_delete' ? true : false)
    } else if (change.updated === "highlight_url") {
      this.showHighlightDetails({
        title: change.changed,
        description: null,
        url: change.new_value.new_value,
        created_at: change.date
      })
    } else if (Array.isArray(change.new_value.new_value) &&
      change.new_value.new_value[0] &&
      change.new_value.new_value[0].phone) {
      this.showMember(change.new_value.new_value)
    } else if (Array.isArray(change.new_value.new_value) &&
      change.new_value.new_value[0] &&
      change.new_value.new_value[0].includes("00")) {
      console.warn("showing contacts")
      this.showContacts(change.new_value.new_value)
    } else if (typeof change.new_value.new_value === "string" &&
      testForURL(change.new_value.new_value)) {
        this.showContent({photo:change.new_value.new_value})
      //this.openPhoto(change.new_value.new_value)
    }
    else if (change.new_value &&
      change.new_value.new_value &&
      change.new_value.new_value[0] &&
      typeof change.new_value.new_value === 'object' &&
      change.new_value.new_value[0].includes("00")) {
      this.showContacts(change.new_value.new_value)
    }
    else if (typeof change.new_value.new_value === "string" ||
      (Array.isArray(change.new_value.new_value) &&
        typeof change.new_value.new_value[0] === "string") ||
      typeof change.new_value.new_value === 'object') {
      this.showContent(change.new_value.new_value)
    } else if (change.title.toLowerCase().includes("remind")) {
      this.showRemindID(change.new_value.data)

    } else {

    }
  }
  showMember(members) {
    this.setState({
      showMembers: true,
      partimembers: members,
      hideTitle: true
    })
  }
  showRemind(remind, restoring) {
    this.setState({
      isremindConfigurationModal: true,
      remind: remind,
      shouldRestore: restoring
    })
  }
  openPhoto(url) {
    this.setState({
      showPhoto: true,
      photo: url
    })
  }
  showContent(content) {
    this.setState({
      textContent: content,
      isContentModalOpened: true
    })
  }
  showContacts(contacts) {
    this.setState({
      contactList: contacts,
      isContactListOpened: true
    })
  }
  bandMember(members) {
    if (!this.state.working) {
      this.setState({
        isManagementModalOpened: false,
        working: true
      })
      Requester.bandMembers(members, this.event.id).then((mem) => {
        this.initializeMaster()
        emitter.emit("parti_removed")
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
        this.initializeMaster()
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
    if (change.changed.toLowerCase().includes("committee")) {
      if (change.changed.toLowerCase().includes("created")) this.event.commitee.unshift(change.new_value.new_value)
      this.refreshCommitees()
      let commitee = newValue
      if (commitee.id == this.state.roomID) {
        emitter.emit("open-close", commitee.opened)
        emitter.emit('publish-unpublish', commitee.public_state)
        if (!this.unmounted) this.setState({
          roomName: commitee.name,
          public_state: commitee.public_state,
          opened: commitee.opened,
          newMessageCount: GState.currentRoomNewMessages ? GState.currentRoomNewMessages.length : 0,
          roomMembers: commitee.member
        })
      }
    } else if ((change.changed.toLowerCase().includes("participant") || change.changed.toLowerCase().includes("activity"))) {
      this.event = find(stores.Events.events, { id: this.event.id })
      this.initializeMaster()
      this.refreshCommitees()
    }
    if (change.changed.toLowerCase().includes('remind') ||
      change.title.toLowerCase().includes('remind')) {
      console.warn('includes reminds')
      emitter.emit('remind-updated')
    } if (change.changed.toLowerCase().includes("vote") ||
      change.title.toLowerCase().includes('vote')) {
      console.warn("including vote")
      emitter.emit("votes-updated", newValue.committee_id)
    }
    if (!this.unmounted) emitter.emit('refresh-history')
    setTimeout(() => {
      this.setState({
        change: null,
        showNotifiation: false
      })
    }, 4000)
  }
  computedMaster = false
  member = false
  initializeMaster() {
    this.user = stores.LoginStore.user;
    stores.Events.loadCurrentEvent(this.event.id).then(e => {
      this.event = e
      let member = find(this.event.participant, { phone: this.user.phone })
      this.master = member && member.master || this.event.creator_phone === this.user.phone
      this.computedMaster = this.event.who_can_update === 'master' ?
        this.master : this.event.who_can_update === 'creator' ?
          this.event.creator_phone === this.user.phone : true
      this.member = member ? true : false
      this.setState({
        working: false
      })
    })
  }
  generalCommitee(event) {
    return {
      id: event.id,
      name: "Generale",
      member: event.participant,
      opened: true,
      public_state: true,
      creator: event.creator_phone
    }
  }
  duration = 10
  mention(data) {
    GState.reply = data
    Vibration.vibrate(this.duration)
    this.isOpen = true
    emitter.emit('mentioning')
    this.setState({
      currentPage: 'EventChat',
      isChat: true
    })
  }
  startLoader() {
    this.setState({
      working: true
    })
  }
  stopLoader() {
    this.setState({
      working: false
    })
  }
  restoreHighlight(data) {
    this.startLoader()
    stores.Highlights.fetchHighlights(this.event.id).then(highs => {
      if (findIndex(highs, { id: data.new_value.new_value.id }) < 0) {
        Requester.restoreHighlight(data.new_value.new_value).then(() => {
          this.stopLoader()
          Toast.show({ text: 'restoration was successful', type: 'success' })
        }).catch(() => {
          this.stopLoader()
        })
      } else {
        this.stopLoader()
        Toast.show({ text: 'restored already', })
      }
    })
  }
  restoreRemind(data) {
    this.startLoader()
    stores.Reminds.loadReminds(this.event.id).then(reminds => {
      if (findIndex(reminds, { id: data.new_value.new_value.id }) < 0) {
        RemindRequest.restoreRemind(data.new_value.new_value).then(() => {
          this.stopLoader()
          Toast.show({ text: 'restoration was successful', type: 'success' })
        }).catch(() => {
          this.stopLoader()
        })
      } else {
        this.stopLoader()
        Toast.show({ text: 'restored already', })
      }
    })
  }
  restore(data) {
    if (!this.state.working) {
      switch (data.updated) {
        case "highlight_delete":
          this.restoreHighlight(data)
          break;
        case "delete_remind":
          this.restoreRemind(data)
          break;
      }
    } else {
      Toast.show({ text: 'App is Busy ' })
    }
  }
  master = false
  componentWillMount() {
    this.unmounted = false
    emitter.on(`event_updated_${this.event.id}`, (change, newValue) => {
      this.handleActivityUpdates(change, newValue)
    })
    this.initializeMaster()
    if (this.backHandler)
      this.backHandler.remove();
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this))
  }
  user = null
  isOpen = true
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
      this.goback()
      return true
    }
  }
  componentDidMount() {
    if (!this.event.calendared && this.event.period) {
      this.addToCalendar()
    }
    let page = this.props.navigation.getParam("tab")
    this.setState({
      isChat: page === 'EventChat' ? true : false,
      currentPage: page,
      mounted: true
    })
    this.isOpen = page === 'EventChat' ? true : false

    this.refreshePage()
  }
  updateActivityLocation(newLocation) {
    if (!this.state.working) {
      this.setState({
        working: true
      })
      Requester.updateLocation(this.event.id, newLocation).then(() => {
        this.initializeMaster()
      }).catch(() => {
        this.setState({
          working: false
        })
      })
    } else {
      Toast.show({ text: 'App is Busy' })
    }
  }
  updateActivityDescription(newDesciption) {
    if (!this.state.working) {
      this.setState({
        working: true
      })
      Requester.updateDescription(this.event.id, newDesciption).then(() => {
        this.initializeMaster()
      }).catch(() => {
        this.setState({
          working: false
        })
      })
    } else {
      Toast.show({ text: 'App is busy' })
    }
  }
  unInitialize(){
    this.unmounted = true
    Pickers.CleanAll()
    GState.reply = null
    emitter.off(`event_updated_${this.event.id}`)
    GState.currentCommitee = null
    this.backHandler.remove()
  }
  componentWillUnmount() {
    this.unInitialize()
  }
  _allowScroll(scrollEnabled) {
    this.setState({ scrollEnabled: scrollEnabled })
  }
  showMembers() {
    this.isOpen = false
    this.setState({
      isManagementModalOpened: true,
      partimembers: this.event.participant

    })
  }
  processResult(data) {
    this.setState({
      isSelectableListOpened: true,
      isCommiteeModalOpened: false,
      title: "Select Members",
      members: this.event.participant,
      notcheckall: !data.publicState,
      tempCommiteeName: data.commiteeName,
      tempPublicState: data.publicState
    })
  }
  createCommitee(data) {
    if (!this.state.working) {
      this.setState({
        isSelectableListOpened: false,
        notcheckall: false,
        creating: true,
        working: true
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
      Requester.addCommitee(commitee,this.event.about.title).then(() => {
        firebase.database().ref(`rooms/${this.event.id}/${commitee.id}`).set({ name: commitee.name, members: commitee.member }).then(() => {
          !this.event.commitee || this.event.commitee.length <= 0 ? this.event.commitee = [commitee.id] :
            this.event.commitee.unshift(commitee.id)
          this.swapChats(commitee)
          this.setState({
            newCommitee: true,
            working: false
          })
          this.refreshCommitees()
        })
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
    let roomName = this.state.roomID === id ? newName : this.state.roomName
    if (!this.state.working) {
      this.setState({
        working: true
      })
      Requester.editCommiteeName(newName, id, this.event.id).then(() => {
        this.setState({
          working: false,
          roomName
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
      Requester.publishCommitee(id, this.event.id, state,this.state.roomName).then(() => {
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

        Requester.addMembers(this.state.commitee_id, members, this.event.id).then((mem) => {
          AddMembers(this.event.id, this.state.commitee_id, members).then(() => { })
          //this.refreshCommitees()
          this.setState({
            commitee_id: null,
            members: null,
            roomMembers: unionBy(this.state.roomMembers, members, "phone"),
            adding: false,
            working: false
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
    this.isOpen = false
    GState.currentCommitee = commitee.id
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
    }, 20)

  }
  invite(members) {
    if (!this.state.working) {
      this.setState({
        working: true,
        isInviteModalOpened: false
      })
      if (this.state.adding) {
        Requester.addParticipants(this.event.id, members.map(ele => { return { ...ele, status: 'added' } })).then(() => {
          this.initializeMaster()
        }).catch(() => {
          this.setState({
            working: false
          })
          Toast.show({ message: "unable to connect to the server" })
        })
      } else {
        Requester.invite(members, this.event.id).then(() => {
          this.initializeMaster()
        }).catch(err => {
          this.setState({
            working: false
          })
          Toast.show({ message: "unable to connect to the server" })
        })
      }
    } else {
      Toast.show({ message: "App is busy !" })
    }
  }
  refreshCommitees() {
    emitter.emit(this.event.id + "_refresh-commitee")
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
        Requester.removeMembers(this.state.commitee_id, mem, this.event.id).then(() => {
          RemoveMembers(this.event.id, this.state.commitee_id, mem).then(() => { })
          this.setState({
            commitee_id: null,
            members: null,
            roomMembers: this.state.roomMembers.filter(ele => (findIndex(mem, { phone: ele.phone }) < 0)),
            removing: false,
            working: false,
            notcheckall: false
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
        AddMembers(this.event.id, id, [member]).then(() => { })
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
        RemoveMembers(this.event.id, id, [{ phone: this.user.phone }]).then(() => { })
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
  inviteContacts(adding) {
    this.isOpen = false
    this.setState({
      isInviteModalOpened: true,
      adding: adding
    })
  }
  checkActivity(member) {
    this.isOpen = false
    this.resetSelectedCommitee()
    this.setState({
      currentPage: "ChangeLogs",
      isMe: member.phone === stores.LoginStore.user.phone ? true : false,
      isChat: false,
      isSettingsModalOpened: false,
      activeMember: member.phone,
      forMember: member.nickname
    })
    this.refreshePage()
  }
  openSettingsModal() {
    this.isOpen = false
    this.setState({
      isSettingsModalOpened: true
    })
  }
  openPhotoSelectorModal(photo) {
    this.isOpen = false
    this.setState({
      isSelectPhotoInputMethodModal: true,
      photo: photo
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
        RemoveParticipant(this.event.id, [this.user]).then((response) => {
          this.initializeMaster()
          this.goback()
        })
      }).catch((e) => {
        this.setState({
          working: false
        })
      })
    } else {
      Toast.show({ text: "App is busy " })
    }
  }
  publish() {
    if (!this.state.working) {
      this.setState({
        working: true
      })
      if (this.event.public) {
        Requester.publish(this.event.id,this.event.about.title).then(() => {
          this.initializeMaster()
        })
      } else {
        this.setState({
          working: false
        })
        Toast.show({ text: "Cannot perform this action; the activity is not public", duration: 5000 })
      }
    } else {
      Toast.show({ text: "App Busy " })
    }
  }
  saveSettings(original, newSettings) {
    if (!this.state.working) {
      this.setState({
        working: true,
      })
      Requester.applyAllUpdate(original, newSettings).then((res) => {
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
  removeActivityPhoto() {
    this.setState({
      working: true,
      isAreYouSureModalOpened: false
    })
    Requester.changeBackground(this.event.id, '').then((res) => {
      this.initializeMaster()
    }).catch(() => {
      this.setState({
        working: false
      })
    })
  }
  addToCalendar(pattern) {
    this.setState({
      isSetPatternModalOpened: false,
    })
    let alarms = pattern && pattern.length > 0 ? pattern : [{
      date: Platform.OS === 'ios'
        ? moment(this.event.period)
          .subtract(600, 'seconds')
          .toISOString() : parseInt(moment(this.event.period).diff(moment(this.event.period).subtract(600, 'seconds'), 'minutes'))
    }, {
      date: Platform.OS === 'ios'
        ? moment(this.event.period)
          .subtract(1, 'hours')
          .toISOString() : parseInt(moment(this.event.period).diff(moment(this.event.period).subtract(1, 'hours'), 'minutes'))
    }]
    CalendarServe.saveEvent(this.event, alarms).then(id => {
      stores.Events.markAsCalendared(this.event.id, id, alarms).then(() => {
        this.initializeMaster()
      })
    })

  }
  saveBackground(path) {
      this.setState({
        working: true
      })
        Requester.changeBackground(this.event.id, path).then(res => {
          this.initializeMaster()
        }).catch(err => {
          this.setState({
            working: false
          })
          Toast.show({ text: "Sorry, the action could not be performed" })
          this.initializeMaster()
        })
  }
  showPhoto(photo) {
    this.setState({
      showPhoto: true,
      photo: photo
    })
  }
  showVideo(url) {
    this.setState({
      video: url,
      showVideoModal: true,
      isHighlightDetailModalOpened: false
    })
  }
  mentionPost(replyer) {
    this.mention({
      id: replyer.id,
      video: replyer.url.video ? true : false,
      audio: !replyer.url.video && replyer.url.audio ? true : false,
      photo: !replyer.url.video && replyer.url.photo ? true : false,
      sourcer: replyer.url.video ?
        replyer.url.photo : replyer.url.photo ?
          replyer.url.photo : replyer.url.audio ?
            replyer.url.audio : null,
      title: `${replyer.title} : \n ${replyer.description}`,
      replyer_phone: stores.LoginStore.user.phone,
      //replyer_name: stores.LoginStore.user.name,
      type_extern: 'Posts',
    })
  }
  setCurrentPage(page, data) {
    if (page === 'EventChat') {
      this.setState({
        isChat: true
      })
    } else {
      this.unInitialize()
      BeNavigator.pushActivity(this.event,page)
    }
  }
  preleaveActivity() {
    this.isOpen = false
    this.member ? this.setState({
      isAreYouSureModalOpened: true,
      warnDescription: "Are you sure you want to leave this activity ?",
      warnTitle: "Leave activity",
      callback: this.leaveActivity.bind(this)
    }) : Toast.show({ text: "You are not a  member anymore !" })
  }
  startInvitation(adding) {
    this.computedMaster || this.event.public ? this.inviteContacts(adding) :
      Toast.show({ text: "You don't have enough priviledges to invite your contacts to this activity ", duration: 4000 })
  }
  unsync() {
    this.setState({
      isSynchronisationModalOpned: false
    })
    Requester.unsyncActivity(this.event).then(() => {
      this.initializeMaster()
    })
  }
  goback() {
    BeNavigator.navigateTo('Home')
  }
  render() {
    StatusBar.setHidden(false, true)
    return (<Drawer
      useInteractionManager={true}
      tweenHandler={this.state.currentPage === 'EventChat' ? null : Drawer.tweenPresets.parallax}
      open={this.isOpen}
      //type="overlay"
      //side="right"
      onOpen={() => {
        this.isOpen = true
      }}
      onClose={() => {
        this.isOpen = false
        setTimeout(() => {
          this.state.currentPage !== 'EventChat' ? this.setState({
            isChat: false,
          }) : null
        }, 50)
      }}
      tapToClose={true}
      panOpenMask={.1}
      //negotiatePan={true}
      //acceptPan={true}
      //captureGestures={true}
      acceptDoubleTap={true}
      panOpenMask={.2}
      elevation={this.state.isChat ? 16 : null}
      openDrawerOffset={this.state.isChat ? .23 : .815}
      type={this.state.isChat ? "overlay" : "static"}
      styles={
        {
          drawer: {
            shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3,
          }
          ,
          main: {}
        }}
      autoClosing={false}
      onMove={(position) => {

      }}
      bounceBackOnOverdraw={false}
      onChange={(position) => {
        this.isOpen = position
      }} isOpen={this.isOpen}
      //initializeOpen={true}
      openMenuOffset={this.currentWidth}
      content={<View style={{ backgroundColor: colorList.bodyBackground, width: "100%" }}><SWView
      join={this.joinCommitee.bind(this)}
        navigateHome={() => {
          this.setState({
            isChat: false
          })
          //this.goback()
        }}
        exitActivity={() => {
          this.goback()
        }}
        hideMenu={() => {
          this.isOpen = false
          this.setState({

          })
        }}
        period={this.event.period}
        calendared={this.event.calendar_id ? true : false}
        isChat={this.state.isChat}
        computedMaster={this.computedMaster}
        ref="swipperView"
        publish={() => this.publish()}
        showActivityPhotoAction={() => this.computedMaster ? this.openPhotoSelectorModal(this.event.background) : this.showPhoto(this.event.background)}
        openSettingsModal={() => this.openSettingsModal()}
        addMembers={(id, currentMembers) => this.addCommiteeMembers(id, currentMembers)}
        publishCommitee={(id, stater) => { this.publishCommitee(id, stater) }}
        editName={(newName, id, currentName) => this.computedMaster ? this.editName(newName, id) : Toast.show({ text: "Connot Update This Commitee" })}
        swapChats={(room) => this.swapChats(room)} phone={stores.LoginStore.user.phone}
        commitees={this.event.commitee ? this.event.commitee : []}
        showCreateCommiteeModal={() => {
          if (!this.state.working && this.computedMaster) {
            this.setState({
              isCommiteeModalOpened: true
            })
          } else {
            Toast.show({ text: "You don't have enough priviledges to add a commitee ", duration: 4000 })
          }
        }}
        //showMembers={() => this.showMembers()}
        setCurrentPage={(page, data) => {
          this.setCurrentPage(page, data)
        }
        }
        currentPage={this.state.currentPage}
        //width={this.state.isChat ? this.normalWidth : this.currentWidth}
        event={this.event}
        master={this.master}
        public={this.event.public} 
        navigatePage={(page) => { BeNavigator.navigateTo(page) }} ></SWView></View>}>
      <View style={{
        height: "100%",
        backgroundColor: colorList.bodyBackground
      }}>
        {this.state.fresh ? <View style={{
          height: '100%',
          width: "100%",
          backgroundColor: colorList.bodyBackground,
        }}></View> :
          this.renderMenu()
        }
        {this.state.showNotifiation ? <View style={{
          position: "absolute", width: "100%", hight: 300, marginRight: "3%",
          marginTop: "12%"
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
            <Spinner  size={"small"}></Spinner>
          </View>
        </View> : null}
        {this.state.working ? <View style={{ position: "absolute", marginTop: "-8%", }}><Spinner size={"small"}></Spinner></View> : null}
        {!this.state.showMembers ? null : <ParticipantModal
          hideTitle={this.state.hideTitle}
          master={this.master}
          creator={this.event.creator_phone}
          participants={this.state.partimembers ? uniqBy(this.state.partimembers.filter(ele => ele !== null &&
            !Array.isArray(ele)), ele => ele.phone) : []} isOpen={this.state.showMembers}
          onClosed={() => {
            this.setState({
              showMembers: false,
              partimembers: null,
              hideTitle: false
            })
          }} event_id={this.event.id}></ParticipantModal>}
        {/*!this.state.contactModalOpened ? null : <ContactListModal isOpen={this.state.contactModalOpened} onClosed={() => {
          this.setState({
            contactModalOpened: false,
            conctacts: []
          })
        }} contacts={this.state.contacts}></ContactListModal>*/}
        {!this.state.isSelectableListOpened ? null : <SelectableContactList
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
        </SelectableContactList>}
        {!this.state.isCommiteeModalOpened ? null : <CreateCommiteeModal isOpen={this.state.isCommiteeModalOpened} createCommitee={(data) => this.processResult(data)} close={() => this.setState({
          isCommiteeModalOpened: false
        })}></CreateCommiteeModal>}
        {!this.state.isContactListOpened ? null : <ContactListModal
          contacts={this.state.contactList}
          title={this.state.title}
          isOpen={this.state.isContactListOpened}
          onClosed={() => {
            this.setState({
              isContactListOpened: false,
              contactList: []
            })
          }}
        ></ContactListModal>}
        {!this.state.isContentModalOpened ? null : <ContentModal content={this.state.textContent} isOpen={this.state.isContentModalOpened} closed={() => {
          this.setState({
            isContentModalOpened: false,
            textContent: null
          })
        }}></ContentModal>}
        {!this.state.isAreYouSureModalOpened ? null : <AreYouSure isOpen={this.state.isAreYouSureModalOpened}
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
          message={this.state.warnDescription}></AreYouSure>}
        {!this.state.isInviteModalOpened ? null : <InviteParticipantModal
          adding={this.state.adding}
          invite={(members) => this.invite(members)}
          onClosed={() => {
            this.setState({
              isInviteModalOpened: false
            })
          }} master={this.master} isOpen={this.state.isInviteModalOpened} participant={this.event.participant}>
        </InviteParticipantModal>}
        {!this.state.isManagementModalOpened ? null : <ManageMembersModal
          isOpen={this.state.isManagementModalOpened}
          checkActivity={(member) => this.checkActivity(member)}
          creator={this.event.creator_phone}
          participants={this.event.participant} master={this.master}
          changeMasterState={(newState) => this.changeEventMasterState(newState)}
          bandMembers={(selected) => this.bandMember(selected)} onClosed={() => {
            this.setState({
              isManagementModalOpened: false
            })
          }}></ManageMembersModal>}
        {this.state.isSynchronisationModalOpned ? <CalendarSynchronisationModal
          closed={() => {
            this.setState({
              isSynchronisationModalOpned: false
            })
          }}
          unsync={() => {
            this.unsync()
          }}
          synced={this.event.calendar_id ? true : false}
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
        {!this.state.isSelectPhotoInputMethodModal ? null : <PhotoInputModal
          saveBackground={(url) => this.saveBackground(url)}
          removePhoto={() => {
            this.setState({
              isAreYouSureModalOpened: true,
              warnTitle: "Remove Photo",
              warnDescription: "Are You Sure You Want To Remove This Photo",
              callback: this.removeActivityPhoto.bind(this),
              okButtonText: "Remove"
            })
          }}
          photo={this.event.background}
          showActivityPhoto={() => {
            this.event.background && this.showPhoto(this.event.background) 
          }}
          isOpen={this.state.isSelectPhotoInputMethodModal}
          closed={() => this.setState({
            isSelectPhotoInputMethodModal: false
          })}></PhotoInputModal>}
        {this.state.showPhoto ? <PhotoViewer open={this.state.showPhoto} photo={this.state.photo} hidePhoto={() => {
          this.setState({
            showPhoto: false,
            woking: true
          })
          setTimeout(() => {
            this.setState({
              working: false
            })
          }, 2000)
          // doing this because if the profile picture is being clicked from the 
          // the changeBox Component , the onPress function of the BleashupTimline Compoent is automatically 
          // triggered . so this is an attempt to restore the blocking done when that photo is being pressed
        }}></PhotoViewer> : null}
        {this.state.isHighlightDetailModalOpened ? <HighlightCardDetail
          mention={(item) => {
            this.mentionPost(item)
            this.setState({
              isHighlightDetailModalOpened: false
            })
          }
          }
          shouldRestore={this.state.shouldRestore}
          showPhoto={(url) => this.showPhoto(url)}
          showVideo={(url) => this.showVideo(url)}
          shouldNotMention={this.state.shouldNotMention}
          restore={(item) => this.restoreHighlight({ new_value: { new_value: item } })}
          isOpen={this.state.isHighlightDetailModalOpened}
          item={this.state.highlight}
          onClosed={() => {
            this.setState({
              isHighlightDetailModalOpened: false,
              shouldNotMention: false,
              shouldRestore: false
            })
          }}></HighlightCardDetail> : null}
        {this.state.isremindConfigurationModal ? <TasksCreation
          shouldRestore={this.state.shouldRestore}
          canRestore={this.state.remind && this.state.remind.creator === this.user.phone}
          restore={(item) => this.restoreRemind({ new_value: { new_value: item } })} isOpen={this.state.isremindConfigurationModal} 
          onClosed={() => {
            this.setState({
              isremindConfigurationModal: false,
              shouldRestore: false
            })
          }} event={this.event} remind_id={this.state.remind_id} remind={this.state.remind}></TasksCreation> : null}
        {this.state.isProfileModalOpened ? <ProfileModal profile={this.state.profile} isOpen={this.state.isProfileModalOpened} onClosed={() => {
          this.setState({
            isProfileModalOpened: false
          })
        }}></ProfileModal> : null}
        {this.state.showVideoModal ? <VideoViewer video={this.state.video} open={this.state.showVideoModal} hideVideo={() => {
          this.setState({
            showVideoModal: false,
            isHighlightDetailModalOpened: true
          })
        }}></VideoViewer> : null}
        <SettingsTabModal
          addMembers={() => this.startInvitation(true)}
          invite={() => this.startInvitation()}
          remove={() => this.showMembers()}
          isOpen={this.state.isSettingsModalOpened}
          currentPhone={this.user.phone}
          leaveActivity={() => this.preleaveActivity()}
          changeMasterState={(newState) => this.changeEventMasterState(newState)}
          bandMembers={(selected) => this.bandMember(selected)}
          checkActivity={(member) => this.checkActivity(member)}
          closeActivity={() => {
            this.event.closed ? this.closeActivity() : this.setState({
              isAreYouSureModalOpened: true,
              callback: () => this.closeActivity(),
              warnDescription: "Are You Sure You Want To Close This Activiy ?",
              warnTitle: "Close Activity",
              okButtonText: "Close"
            })
          }}
          creator={this.event.creator_phone === this.user.phone}
          computedMaster={this.computedMaster}
          master={this.master}
          event={this.event} saveSettings={(original, newSettings) => {
            this.saveSettings(original, newSettings)
          }}
          closed={() => {
            this.setState({
              isSettingsModalOpened: false
            })
            console.warn("closing settings modal")
            this.markAsConfigured()
          }}
        ></SettingsTabModal>
      </View>
    </Drawer>
    );
  }
}
