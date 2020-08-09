import React, { Component } from "react";
import {
  View,
  Dimensions,
  BackHandler,
  StatusBar,
  Platform,
  Vibration,
} from "react-native";
import EventDetails from "../eventDetails";
import Remind from "../reminds";
import EventChat from "../eventChat";
import SWView from "./SWView";
import ChangeLogs from "../changelogs";
import ParticipantModal from "../../ParticipantModal";
import SelectableContactList from "../../SelectableContactList";
import CreateCommiteeModal from "./CreateCommiteeModal";
import moment from "moment";
import stores from "../../../stores";
import { uniqBy, findIndex, find, unionBy } from "lodash";
import Requester from "./Requester";
import emitter from "../../../services/eventEmiter";
import GState from "../../../stores/globalState";
import firebase from "react-native-firebase";
import uuid from "react-native-uuid";
import NotificationModal from "./NotificationModal";
import ContactListModal from "./ContactListModal";
import ContentModal from "./ContentModal";
import InviteParticipantModal from "./InviteParticipantModal";
import ManageMembersModal from "./ManageMembersModal";
import AreYouSure from "./AreYouSureModal";
import {
  RemoveParticipant,
  AddMembers,
  RemoveMembers,
} from "../../../services/cloud_services";
import PhotoInputModal from "./PhotoInputModal";
import PhotoViewer from "./PhotoViewer";
import SearchImage from "./createEvent/components/SearchImage";
import Pickers from "../../../services/Picker";
import HighlightCardDetail from "./createEvent/components/HighlightCardDetail";
import TasksCreation from "../reminds/TasksCreation";
import testForURL from "../../../services/testForURL";
import ProfileModal from "../invitations/components/ProfileModal";
import VideoViewer from "../highlights_details/VideoModal";
import Drawer from "react-native-drawer";
import shadower from "../../shadower";
import colorList from "../../colorList";
import SettingsTabModal from "./SettingTabModal";
import BeNavigator from "../../../services/navigationServices";
import replies from "../eventChat/reply_extern";
import Toaster from "../../../services/Toaster";
import Spinner from '../../Spinner';

const screenWidth = Math.round(Dimensions.get("window").width);

var swipeoutBtns = [
  {
    text: "Button",
  },
];

export default class Event extends Component {
  constructor(props) {
    super(props);
    GState.nav = this.props.navigation;
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
    this.backHandler = null;
  }
  state = {
    Event: undefined /*{ about: { title: "Event title" }, updated: true }*/,
    activeTab: undefined,
    initalPage: "EventDetails",
    currentPage: "EventDetails",
    enabled: false,
    members: [],
    isOpen: false,
  };
  textStyle = {
    fontSize: 15,
  };
  showRemindID(id) {
    this.setState({
      remind_id: id,
      isremindConfigurationModal: true,
      remind: null,
    });
  }
  showHighlightID(id) {
    stores.Highlights.loadHighlight(this.event.id, id).then((High) => {
      High
        ? this.setState({
          isHighlightDetailModalOpened: true,
          shouldNotMention: true,
          highlight: High,
        })
        : null;
    });
  }
  showHighlightDetails(H, restoring) {
    this.setState({
      highlight: H,
      shouldRestore: restoring,
      isHighlightDetailModalOpened: true,
    });
  }
  addRemindForCommittee(members) {
    BeNavigator.pushActivity(this.event, "Reminds", { currentRemindMembers: members})
    /*this.setState({
      currentPage: "Reminds",
      isChat: false,
      currentRemindMembers: members,
    });*/
  }
  openMenu() {
    this.isOpen = !this.isOpen;
    this.setState({
      mounted: true,
    });
  }
  editCommiteeName() {

  }
  startThis(star){
    BeNavigator.pushActivity(this.event,"EventDetails",{star})
  }
  remindThis(remind){
    BeNavigator.pushActivity(this.event,"Reminds",{remind})
  }
  currentWidth = 0.5;
  isOpen = false;
  handleReplyExtern =
    (reply) => {
      if (reply.type_extern.toLowerCase().includes("reminds")) {
        reply.id ? BeNavigator.pushActivity(this.event,"Reminds",{id:reply.id}) : null;
      } else if (reply.type_extern.toLowerCase().includes("posts")) {
        reply.id ? BeNavigator.pushActivity(this.event,"EventDetails",{id:reply.id}) : null;
      } else {
        reply.id ? this.showChanges(reply) : null;
      }
    }
  
  renderMenu(NewMessages) {
    ///console.error(this.state.currentPage)
    switch (this.state.currentPage) {
      case "EventDetails":
        return (
          <EventDetails
            id={this.id}
            shared={false}
            star={this.star}
            share={{
              id: "1434",
              date: moment().format(),
              sharer: stores.LoginStore.user.phone,
              item_id: "740a5530-8b20-11ea-9234-9b01561bce6b",
              event_id: this.event.id,
            }}
            startLoader={() => {
              this.setState({
                working: true,
              });
            }}
            openMenu={() => {
              this.openMenu();
            }}
            mention={(data) => this.mentionPost(data)}
            updateLocation={(loc) => this.updateActivityLocation(loc)}
            updateDesc={(newDes) => {
              this.updateActivityDescription(newDes);
            }}
            master={this.master}
            computedMaster={this.computedMaster}
            stopLoader={() => {
              this.setState({
                working: false,
              });
            }}
            goback={this.goback.bind(this)}
            showVideo={(url) => this.showVideo(url)}
            showHighlight={(h) => this.showHighlightDetails(h)}
            Event={this.event}
          ></EventDetails>
        );
      case "Reminds":
        return (
          <Remind
            //shared={false}
            id={this.id}
            share={{
              id: "456322",
              date: moment().format(),
              sharer: stores.LoginStore.user.phone,
              item_id: "a7f976f0-8cd8-11ea-9234-ebf9c3b94af7",
              event_id: this.event.id,
            }}
            remind={this.remind}
            startLoader={() => {
              this.setState({
                working: true,
              });
            }}
            stopLoader={() => {
              this.setState({
                working: false,
              });
            }}
            openMenu={() => this.openMenu()}
            clearCurrentMembers={() => {
                this.goback()
            }}
            goback={this.goback.bind(this)}
            currentMembers={this.state.currentRemindMembers}
            mention={(item) => this.mention(item)}
            master={this.master}
            computedMaster={this.computedMaster}
            working={this.state.working}
            event={this.event}
            event_id={this.event.id}
          ></Remind>
        );
      case "EventChat":
        return (
          <EventChat
            startThis={this.startThis.bind(this)}
            remindThis={this.remindThis.bind(this)}
            editCommitteeName={() => this.editCommiteeName()}
            openSettings={() => this.openSettingsModal()}
            activity_id={this.event.id}
            activity_name={this.event.about.title}
            room_type={"activity"} //!! 'relation' if it's a relation
            //activity_name={this.event.about.title}
            openMenu={() => this.openMenu()}
            showLoader={() => this.startLoader()}
            working={this.state.working}
            addRemind={(members) => this.addRemindForCommittee(this.state.roomMembers)}
            stopLoader={() => this.stopLoader()}
            showProfile={(pro) => this.showProfile(pro)}
            roomName={this.state.roomName}
            computedMaster={this.computedMaster}
            members={this.state.roomMembers}
            addMembers={() =>
              this.addCommiteeMembers(this.state.roomID, this.state.roomMembers)
            }
            removeMembers={() =>
              this.removeMembers(this.state.roomID, this.state.roomMembers)
            }
            publish={() =>
              this.publishCommitee(this.state.roomID, !this.state.public_state)
            }
            leave={() => this.leaveCommitee(this.state.roomID)}
            close={() => this.closeCommitee(this.state.roomID)}
            open={() => this.openCommitee(this.state.roomID)}
            master={this.master}
            handleReplyExtern={this.handleReplyExtern.bind(this)}
            generallyMember={this.member}
            public_state={this.state.public_state}
            opened={!this.event.closed}
            roomID={this.state.roomID}
            newMessageCount={
              GState.currentCommitee === "Generale" &&
                GState.generalNewMessages.length > 0
                ? GState.generalNewMessages.length
                : this.state.newMessageCount
            }
            showMembers={() => {
              let thisMember = find(this.event.participant, {
                phone: stores.LoginStore.user.phone,
              });
              this.setState({
                showMembers: true,
                partimembers: unionBy(
                  this.state.roomMembers,
                  [thisMember],
                  "phone"
                ),
              });
            }}
            goback={this.goback.bind(this)}
            {...this.props}
            showContacts={(conctacts, title) => {
              this.setState({
                isContactListOpened: true,
                title: title,
                contactList: conctacts,
              });
            }}
          ></EventChat>
        );
        case "ChangeLogs":
        return (
          <ChangeLogs
            index={this.index}
            goback={this.goback.bind(this)}
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
            navigatePage={(page) => {
              BeNavigator.navigateTo(page);
            }}
          ></ChangeLogs>
        );
    }
  }
  showProfile(pro) {
    stores.TemporalUsersStore.getUser(pro).then((profile) => {
      console.warn(profile)
      this.setState({
        isProfileModalOpened: true,
        profile: profile,
      });
    });
  }
  showChanges(data) {
    let change = {
      //id:data.id,
      changed: data.title,
      updated: data.updated,
      title: data.type_extern,
      //changer : data.replyer_phone,
      new_value: data.new_value,
    };
    let index = findIndex(stores.ChangeLogs.changes[this.event.id],(ele) => {
      return ele.updater == data.updater && 
      ele.updated == data.updated && 
        ele.new_value.data == data.new_value.data //&& 
        //ele.new_value.new_value == data.new_value.data.new_value
    })
    if(index >=0){
      BeNavigator.pushActivity(this.event,"ChangeLogs",{index})
    }else{
      this.propcessAndFoward(change);
    }
  }
  propcessAndFoward(change) {
    if (change.updated === "add_highlight") {
      this.showHighlightDetails(change.new_value.new_value);
    } else if (
      change.updated === "restored_remind" ||
      change.updated === "delete_remind"
    ) {
      this.showRemind(
        change.new_value.new_value,
        change.updated === "delete_remind" ? true : false
      );
    } else if (change.updated === "added_remind") {
      this.showRemindID(change.new_value.data);
    } else if (
      change.updated === "highlight_delete" ||
      change.updated == "highlight_restored"
    ) {
      this.showHighlightDetails(
        change.new_value.new_value,
        change.updated == "highlight_delete" ? true : false
      );
    } else if (change.updated === "highlight_url") {
      this.showHighlightDetails({
        title: change.changed,
        description: null,
        url: change.new_value.new_value,
        created_at: change.date,
      });
    } else if (
      Array.isArray(change.new_value.new_value) &&
      change.new_value.new_value[0] &&
      change.new_value.new_value[0].phone
    ) {
      this.showMember(change.new_value.new_value);
    } else if (
      Array.isArray(change.new_value.new_value) &&
      change.new_value.new_value[0] &&
      change.new_value.new_value[0].includes("00")
    ) {
      console.warn("showing contacts");
      this.showContacts(change.new_value.new_value);
    } else if (
      typeof change.new_value.new_value === "string" &&
      testForURL(change.new_value.new_value)
    ) {
      this.showContent({ photo: change.new_value.new_value });
      //this.openPhoto(change.new_value.new_value)
    } else if (
      change.new_value &&
      change.new_value.new_value &&
      change.new_value.new_value[0] &&
      typeof change.new_value.new_value === "object" &&
      change.new_value.new_value[0].includes("00")
    ) {
      this.showContacts(change.new_value.new_value);
    } else if (
      typeof change.new_value.new_value === "string" ||
      (Array.isArray(change.new_value.new_value) &&
        typeof change.new_value.new_value[0] === "string") ||
      typeof change.new_value.new_value === "object"
    ) {
      this.showContent(change.new_value.new_value);
    } else if (change.title.toLowerCase().includes("remind")) {
      this.showRemindID(change.new_value.data);
    } else {
    }
  }
  showMember(members) {
    this.setState({
      showMembers: true,
      partimembers: members,
      hideTitle: true,
    });
  }
  showRemind(remind, restoring) {
    this.setState({
      isremindConfigurationModal: true,
      remind: remind,
      shouldRestore: restoring,
    });
  }
  openPhoto(url) {
    this.setState({
      showPhoto: true,
      photo: url,
    });
  }
  showContent(content) {
    this.setState({
      textContent: content,
      isContentModalOpened: true,
    });
  }
  showContacts(contacts) {
    this.setState({
      contactList: contacts,
      isContactListOpened: true,
    });
  }
  bandMember(members) {
    if (!this.state.working) {
      this.setState({
        isManagementModalOpened: false,
        working: true,
      });
      Requester.bandMembers(members, this.event.id)
        .then((mem) => {
          this.initializeMaster();
          emitter.emit("parti_removed");
        })
        .catch((e) => {
          this.setState({
            working: false,
          });
          Toaster({ text: "Unable to process request !" });
        });
    }
  }
  changeEventMasterState(newState) {
    if (!this.state.working) {
      this.setState({
        isManagementModalOpened: false,
        working: true,
      });
      Requester.changeEventMasterState(newState, this.event.id)
        .then(() => {
          this.initializeMaster();
        })
        .catch((e) => {
          this.setState({
            isManagementModalOpened: false,
            working: false,
          });
          Toaster({ text: "unable to perform this action" });
        });
    } else {
      this.setState({
        isManagementModalOpened: false,
      });
      Toaster({ text: "App Busy !" });
    }
  }
  refreshePage() {
    this.setState({
      fresh: false,
    });
  }
  handleActivityUpdates(change, newValue) {
    if (!this.unmounted)
      this.setState({
        change: change,
        showNotifiation: true,
      });
    if (
      change &&
      change.changed &&
      change.changed.toLowerCase().includes("committee")
    ) {
      if (change.changed.toLowerCase().includes("created"))
        this.event.commitee.unshift(change.new_value.new_value);
      this.refreshCommitees();
      let commitee = newValue;
      if (commitee.id == this.state.roomID) {
        emitter.emit("open-close", commitee.opened);
        emitter.emit("publish-unpublish", commitee.public_state);
        if (!this.unmounted)
          this.setState({
            roomName: commitee.name,
            public_state: commitee.public_state,
            opened: commitee.opened,
            newMessageCount: GState.currentRoomNewMessages
              ? GState.currentRoomNewMessages.length
              : 0,
            roomMembers: commitee.member,
          });
      }
    } else if (
      (change &&
        change.changed &&
        change.changed.toLowerCase().includes("participant")) ||
      change.changed.toLowerCase().includes("activity")
    ) {
      this.event = find(stores.Events.events, { id: this.event.id });
      this.initializeMaster();
      this.refreshCommitees();
    }
    if (
      (change &&
        change.changed &&
        change.changed.toLowerCase().includes("remind")) ||
      change.title.toLowerCase().includes("remind")
    ) {
      console.warn("includes reminds");
      emitter.emit("remind-updated");
    }
    if (
      (change &&
        change.changed &&
        change.changed.toLowerCase().includes("vote")) ||
      change.title.toLowerCase().includes("vote")
    ) {
      console.warn("including vote");
      emitter.emit("votes-updated", newValue.committee_id);
    }
    if (!this.unmounted) emitter.emit("refresh-history");
    setTimeout(() => {
      this.setState({
        change: null,
        showNotifiation: false,
      });
    }, 4000);
  }
  computedMaster = false;
  member = false;
  initializeMaster() {
    this.user = stores.LoginStore.user;
    stores.Events.loadCurrentEvent(this.event.id).then((e) => {
      this.event = e;
      let member = find(this.event.participant, { phone: this.user.phone });
      this.master =
        (member && member.master) ||
        this.event.creator_phone === this.user.phone;
      this.computedMaster =
        this.event.who_can_update === "master"
          ? this.master
          : this.event.who_can_update === "creator"
            ? this.event.creator_phone === this.user.phone
            : true;
      this.member = member ? true : false;
      this.setState({
        working: false,
        roomMembers:GState.currentCommitee === this.event.id ? this.event.participant : this.state.roomMembers
      });
    });
  }
  generalCommitee(event) {
    return {
      id: event.id,
      name: "Generale",
      member: event.participant,
      opened: true,
      public_state: true,
      creator: event.creator_phone,
    };
  }
  duration = 10;
  mention(data) {
    GState.reply = data;
    Vibration.vibrate(this.duration);
    emitter.emit("reply-me", GState.reply);
    this.goback()
  }
  startLoader() {
    this.setState({
      working: true,
    });
  }
  stopLoader() {
    this.setState({
      working: false,
    });
  }
  restoreHighlight(data) {
    this.startLoader();
    stores.Highlights.fetchHighlights(this.event.id).then((highs) => {
      if (findIndex(highs, { id: data.new_value.new_value.id }) < 0) {
        Requester.restoreHighlight(data.new_value.new_value)
          .then(() => {
            this.stopLoader();
            Toaster({ text: "restoration was successful", type: "success" });
          })
          .catch(() => {
            this.stopLoader();
          });
      } else {
        this.stopLoader();
        Toaster({ text: "restored already" });
      }
    });
  }
  restore(data) {
    if (!this.state.working) {
      switch (data.updated) {
        case "highlight_delete":
          this.restoreHighlight(data);
          break;
        case "delete_remind":
          this.restoreRemind(data);
          break;
      }
    } else {
      Toaster({ text: "App is Busy " });
    }
  }
  master = false;
  componentWillMount() {
    this.unmounted = false;
    emitter.on(`event_updated_${this.event.id}`, (change, newValue) => {
      this.handleActivityUpdates(change, newValue);
    });
    this.initializeMaster();
  }
  getParam(key){
    return this.props.navigation.getParam(key)
  }
  id = this.getParam("id")
  index = this.getParam("index")
  user = null;
  isOpen = true;
  star = this.getParam("star")
  remind = this.getParam("remind")
  event = this.getParam("Event")
  currentRemindMembers = this.getParam("currentRemindMembers")
  componentDidMount() {
    let page = this.getParam("tab");
    let isEventCurrentPage = this.isChat(page);
    isEventCurrentPage ? (GState.currentCommitee = this.event.id) : null;
    this.setState({
      isChat: isEventCurrentPage ? true : false,
      currentPage: page,
      currentRemindMembers:this.currentRemindMembers,
      mounted: true,
    });
    this.isOpen = false // isEventCurrentPage ? true : false;

    this.refreshePage();
  }
  updateActivityLocation(newLocation) {
    if (!this.state.working) {
      this.setState({
        working: true,
      });
      Requester.updateLocation(this.event.id, newLocation)
        .then(() => {
          this.initializeMaster();
        })
        .catch(() => {
          this.setState({
            working: false,
          });
        });
    } else {
      Toaster({ text: "App is Busy" });
    }
  }
  updateActivityDescription(newDesciption) {
    if (!this.state.working) {
      this.setState({
        working: true,
      });
      Requester.updateDescription(this.event.id, newDesciption)
        .then(() => {
          this.initializeMaster();
        })
        .catch(() => {
          this.setState({
            working: false,
          });
        });
    } else {
      Toaster({ text: "App is busy" });
    }
  }
  isChat(currentPage) {
    return currentPage === "EventChat"
  }
  unInitialize() {
    this.unmounted = true;
    Pickers.CleanAll();
    this.isChat(this.state.currentPage) ? GState.reply = null : null;
    emitter.off(`event_updated_${this.event.id}`);
    this.isChat(this.state.currentPage) ? GState.currentCommitee = null : null;
  }
  componentWillUnmount() {
    this.unInitialize();
  }
  _allowScroll(scrollEnabled) {
    this.setState({ scrollEnabled: scrollEnabled });
  }
  showMembers() {
    this.isOpen = false;
    this.setState({
      isManagementModalOpened: true,
      partimembers: this.event.participant,
    });
  }
  processResult(data) {
    this.setState({
      isSelectableListOpened: true,
      isCommiteeModalOpened: false,
      title: "Select Members",
      members: this.event.participant,
      notcheckall: !data.publicState,
      tempCommiteeName: data.commiteeName,
      tempPublicState: data.publicState,
    });
  }
  createCommitee(data) {
    if (!this.state.working) {
      this.setState({
        isSelectableListOpened: false,
        notcheckall: false,
        creating: true,
        working: true,
      });
      let creator = find(this.event.participant, {
        phone: this.event.creator_phone,
      });
      let currentCreator = find(this.event.participant, {
        phone: stores.LoginStore.user.phone,
      });
      let arr = [creator, currentCreator];
      let commitee = {
        id: uuid.v1(),
        creator: this.user.phone,
        created_at: moment().format(),
        updated_at: moment().format(),
        member: unionBy(data, arr, "phone"),
        name: this.state.tempCommiteeName,
        public_state: this.state.tempPublicState,
        event_id: this.event.id,
        opened: true,
      };
      Requester.addCommitee(commitee, this.event.about.title)
        .then(() => {
          firebase
            .database()
            .ref(`rooms/${this.event.id}/${commitee.id}`)
            .set({ name: commitee.name, members: commitee.member })
            .then(() => {
              !this.event.commitee || this.event.commitee.length <= 0
                ? (this.event.commitee = [commitee.id])
                : this.event.commitee.unshift(commitee.id);
              this.swapChats(commitee);
              this.setState({
                newCommitee: true,
                working: false,
              });
              this.refreshCommitees();
            });
        })
        .catch(() => {
          this.setState({
            newCommitee: true,
            working: false,
          });
        });
      //console.warn(data)
    } else {
      Toaster({ text: "App is busy" });
    }
  }
  editName(newName, id) {
    let roomName = this.state.roomID === id ? newName : this.state.roomName;
    if (!this.state.working) {
      this.setState({
        working: true,
      });
      Requester.editCommiteeName(newName, id, this.event.id)
        .then(() => {
          this.setState({
            working: false,
            roomName,
          });
        })
        .catch((error) => {
          this.setState({
            working: false,
          });
          /// console.warn(error)
          emitter.emit("edit-failed", error);
        });
    } else {
      Toaster({ text: "App is busy" });
    }
  }
  publishCommitee(id, state) {
    if (!this.state.working) {
      this.setState({
        working: true,
      });
      Requester.publishCommitee(id, this.event.id, state, this.state.roomName)
        .then(() => {
          emitter.emit("publish-unpublish", state);
          this.setState({
            working: false,
            public_state: !this.state.public_state,
          });
          this.refreshCommitees();
        })
        .catch(() => {
          this.setState({
            working: false,
          });
        });
    } else {
      Toaster({ text: "App is busy" });
    }
  }
  addCommiteeMembers(id, currentMembers) {
    this.setState({
      isSelectableListOpened: true,
      title: "Add Participant To this Commitee",
      members: this.event.participant.filter(
        (ele) => findIndex(currentMembers, { phone: ele.phone }) < 0
      ),
      commitee_id: id,
      adding: true,
    });
  }
  removeMembers(id, members) {
    this.setState({
      isSelectableListOpened: true,
      title: "Select Members To Remove",
      members: members,
      notcheckall: true,
      commitee_id: id,
      removing: true,
    });
  }
  saveCommiteeMembers(members) {
    if (members.length > 0) {
      if (!this.state.working) {
        this.setState({
          working: true,
          isSelectableListOpened: false,
        });

        Requester.addMembers(this.state.commitee_id, members, this.event.id)
          .then((mem) => {
            AddMembers(
              this.event.id,
              this.state.commitee_id,
              members
            ).then(() => { });
            //this.refreshCommitees()
            this.setState({
              commitee_id: null,
              members: null,
              roomMembers: unionBy(this.state.roomMembers, members, "phone"),
              adding: false,
              working: false,
            });
          })
          .catch((error) => {
            this.setState({
              isSelectableListOpened: false,
              commitee_id: null,
              members: null,
              adding: false,
              working: false,
            });
          });
      } else {
        this.setState({
          isSelectableListOpened: false,
          commitee_id: null,
          members: null,
          adding: false,
          working: false,
        });
        Toaster({ text: "App is busy" });
      }
    } else {
      this.setState({
        isSelectableListOpened: false,
        commitee_id: null,
        members: null,
        adding: false,
        working: false,
      });
      Toaster({ text: "no members selected" });
    }
  }
  swapChats(commitee) {
    this.isOpen = false;
    GState.currentCommitee = commitee.id;
    this.setState({
      roomID: commitee.id,
      roomName: commitee.name,
      currentPage: "EventChat",
      fresh: true,
      public_state: commitee.public_state,
      opened: commitee.opened,
      newMessageCount: GState.currentRoomNewMessages
        ? GState.currentRoomNewMessages.length
        : 0,
      roomMembers: commitee.member,
    });
    setTimeout(() => {
      this.setState({
        fresh: false,
      });
    }, 20);
  }
  invite(members) {
    if (!this.state.working) {
      this.setState({
        working: true,
        isInviteModalOpened: false,
      });
      if (this.state.adding) {
        Requester.addParticipants(
          this.event.id,
          members.map((ele) => {
            return { ...ele, status: "added" };
          })
        )
          .then(() => {
            this.initializeMaster();
          })
          .catch(() => {
            this.setState({
              working: false,
            });
            Toaster({ message: "unable to connect to the server" });
          });
      } else {
        Requester.invite(members, this.event.id)
          .then(() => {
            this.initializeMaster();
          })
          .catch((err) => {
            this.setState({
              working: false,
            });
            Toaster({ message: "unable to connect to the server" });
          });
      }
    } else {
      Toaster({ message: "App is busy !" });
    }
  }
  refreshCommitees() {
    emitter.emit(this.event.id + "_refresh-commitee");
    //this.refs.swipperView.refreshCommitees()
  }
  saveRemoved(mem) {
    //console.warn(mem)
    if (mem.length > 0) {
      if (!this.state.working) {
        this.setState({
          working: true,
          isSelectableListOpened: false,
        });
        Requester.removeMembers(this.state.commitee_id, mem, this.event.id)
          .then(() => {
            RemoveMembers(
              this.event.id,
              this.state.commitee_id,
              mem
            ).then(() => { });
            this.setState({
              commitee_id: null,
              members: null,
              roomMembers: this.state.roomMembers.filter(
                (ele) => findIndex(mem, { phone: ele.phone }) < 0
              ),
              removing: false,
              working: false,
              notcheckall: false,
            });

            //this.refreshCommitees()
          })
          .catch((error) => {
            this.setState({
              isSelectableListOpened: false,
              commitee_id: null,
              members: null,
              removing: false,
              notcheckall: false,
              working: false,
            });
          });
      } else {
        this.setState({
          isSelectableListOpened: false,
          commitee_id: null,
          members: null,
          removing: false,
          notcheckall: false,
          working: false,
        });
        Toaster({ text: "App is busy" });
      }
    } else {
      this.setState({
        isSelectableListOpened: false,
        commitee_id: null,
        members: null,
        removing: false,
        notcheckall: false,
        working: false,
      });
      Toaster({ text: "no members selected" });
    }
  }
  joinCommitee(id) {
    if (!this.state.working) {
      this.setState({
        working: true,
      });
      let member = find(this.event.participant, {
        phone: stores.LoginStore.user.phone,
      });
      Requester.joinCommitee(id, this.event.id, member)
        .then(() => {
          emitter.emit("joint");
          this.setState({
            working: false,
          });
          this.refreshCommitees();
          AddMembers(this.event.id, id, [member]).then(() => { });
        })
        .catch((error) => {
          this.setState({
            working: false,
          });
        });
    } else {
      Toaster({ text: "no members selected" });
    }
  }
  resetSelectedCommitee() {
    if (GState.currentCommitee !== null) {
      GState.previousCommitee = GState.currentCommitee;
      GState.currentCommitee = null;
      emitter.emit("current_commitee_changed", GState.previousCommitee);
    } else {
      emitter.emit("current_commitee_changed", GState.previousCommitee);
    }
  }
  leaveCommitee(id) {
    if (!this.state.working) {
      this.setState({
        working: true,
      });
      Requester.leaveCommitee(id, this.event.id)
        .then(() => {
          this.isOpen = true;
          this.resetSelectedCommitee();
          this.setState({
            currentPage: "EventDetails",
            working: false,
          });
          emitter.emit("left");
          this.refreshCommitees();
          RemoveMembers(this.event.id, id, [
            { phone: this.user.phone },
          ]).then(() => { });
        })
        .catch(() => {
          this.setState({
            working: false,
          });
        });
    } else {
      Toaster({ text: "App is busy" });
    }
  }
  openCommitee(id) {
    if (!this.state.working) {
      this.setState({
        working: true,
      });
      Requester.openCommitee(id, this.event.id)
        .then(() => {
          emitter.emit("open-close", true);
          this.setState({
            working: false,
            opened: true,
          });
          this.refreshCommitees();
        })
        .catch((error) => {
          console.warn(error);
          this.setState({
            working: false,
          });
        });
    } else {
      Toaster({ text: "App is busy" });
    }
  }
  closeCommitee(id) {
    if (!this.state.working) {
      this.setState({
        working: true,
      });
      Requester.closeCommitee(id, this.event.id)
        .then(() => {
          emitter.emit("open-close", false);
          this.setState({
            working: false,
            opened: false,
          });
          this.refreshCommitees();
        })
        .catch((error) => {
          this.setState({
            working: false,
          });
          console.warn(error);
        });
    } else {
      Toaster({ text: "no members selected" });
    }
  }
  inviteContacts(adding) {
    this.isOpen = false;
    this.setState({
      isInviteModalOpened: true,
      adding: adding,
    });
  }
  checkActivity(member) {
    this.isOpen = false;
    this.resetSelectedCommitee();
    this.setState({
      currentPage: "ChangeLogs",
      isMe: member.phone === stores.LoginStore.user.phone ? true : false,
      isChat: false,
      isSettingsModalOpened: false,
      activeMember: member.phone,
      forMember: member.nickname,
    });
    this.refreshePage();
  }
  openSettingsModal() {
    this.isOpen = false;
    this.setState({
      isSettingsModalOpened: true,
    });
  }
  openPhotoSelectorModal(photo) {
    this.isOpen = false;
    this.setState({
      isSelectPhotoInputMethodModal: true,
      photo: photo,
    });
  }
  leaveActivity() {
    this.isOpen = true;
    if (!this.state.working) {
      this.setState({
        working: true,
        isAreYouSureModalOpened: false,
      });
      Requester.leaveActivity(this.event.id, this.user.phone)
        .then(() => {
          this.initializeMaster();
          this.setState({
            working: false,
          });
          emitter.emit(`left_${this.event.id}`); //TODO: this signal is beign listen to in the module current_events>public_events>join
          RemoveParticipant(this.event.id, [this.user]).then((response) => {
            this.initializeMaster();
            this.goback();
          });
        })
        .catch((e) => {
          this.setState({
            working: false,
          });
        });
    } else {
      Toaster({ text: "App is busy " });
    }
  }
  publish() {
    if (!this.state.working) {
      this.setState({
        working: true,
      });
      if (this.event.public) {
        Requester.publish(this.event.id, this.event.about.title).then(() => {
          this.initializeMaster();
        });
      } else {
        this.setState({
          working: false,
        });
        Toaster({
          text: "Cannot perform this action; the activity is not public",
          duration: 5000,
        });
      }
    } else {
      Toaster({ text: "App Busy " });
    }
  }
  saveSettings(original, newSettings) {
    if (!this.state.working) {
      this.setState({
        working: true,
      });
      Requester.applyAllUpdate(original, newSettings)
        .then((res) => {
          this.initializeMaster();
        })
        .catch((erorr) => {
          Toaster({ text: "could not perform the request" });
          this.initializeMaster();
        });
    } else {
      this.initializeMaster();
      Toaster({ text: "App Busy" });
    }
  }
  markAsConfigured() {
    stores.Events.markAsConfigured(this.event.id).then(() => {
      this.initializeMaster();
    });
  }
  closeActivity() {
    if (!this.state.working) {
      this.setState({
        working: true,
        isAreYouSureModalOpened: false,
      });
      Requester.updateCloseActivity(this.event, !this.event.closed)
        .then(() => {
          this.initializeMaster();
        })
        .catch(() => {
          Toaster({ text: "Unable To process the request" });
        });
    } else {
      Toaster({ text: "App is Busy" });
    }
  }
  removeActivityPhoto() {
    this.setState({
      working: true,
      isAreYouSureModalOpened: false,
    });
    Requester.changeBackground(this.event.id, "")
      .then((res) => {
        this.initializeMaster();
      })
      .catch(() => {
        this.setState({
          working: false,
        });
      });
  }
  saveBackground(path) {
    this.setState({
      working: true,
    });
    Requester.changeBackground(this.event.id, path)
      .then((res) => {
        this.initializeMaster();
      })
      .catch((err) => {
        this.setState({
          working: false,
        });
        Toaster({ text: "Sorry, the action could not be performed" });
        this.initializeMaster();
      });
  }
  showPhoto(photo) {
    this.setState({
      showPhoto: true,
      photo: photo,
    });
  }
  showVideo(url) {
    this.setState({
      video: url,
      showVideoModal: true,
      isHighlightDetailModalOpened: false,
    });
  }
  mentionPost(replyer) {
    this.mention({
      id: replyer.id,
      video: replyer.url.video ? true : false,
      audio: !replyer.url.video && replyer.url.audio ? true : false,
      photo: !replyer.url.video && replyer.url.photo ? true : false,
      sourcer: replyer.url.video
        ? replyer.url.photo
        : replyer.url.photo
          ? replyer.url.photo
          : replyer.url.audio
            ? replyer.url.audio
            : null,
      title: `${replyer.title} : \n ${replyer.description}`,
      replyer_phone: stores.LoginStore.user.phone,
      //replyer_name: stores.LoginStore.user.name,
      type_extern: replies.posts,
    });
  }
  setCurrentPage(page, data) {
    if (this.isChat(page)) {
      this.setState({
        isChat: true,
      });
    } else {
      BeNavigator.pushActivity(this.event, page);
    }
  }
  preleaveActivity() {
    this.isOpen = false;
    this.member
      ? this.setState({
        isAreYouSureModalOpened: true,
        warnDescription: "Are you sure you want to leave this activity ?",
        warnTitle: "Leave activity",
        callback: this.leaveActivity.bind(this),
      })
      : Toaster({ text: "You are not a  member anymore !" });
  }
  startInvitation(adding) {
    this.computedMaster || this.event.public
      ? this.inviteContacts(adding)
      : Toaster({
        text:
          "You don't have enough priviledges to invite your contacts to this activity ",
        duration: 4000,
      });
  }
  unsync() {
    this.setState({
      isSynchronisationModalOpned: false,
    });
    Requester.unsyncActivity(this.event).then(() => {
      this.initializeMaster();
    });
  }
  goback() {
    this.props.navigation.goBack();
  }
  renderExtra() {
    return <View>
        <View
          style={{
            position: "absolute",
            width: "100%",
            hight: 300,
            marginRight: "3%",
            marginTop: "12%",
          }}
        >
          <NotificationModal
            change={this.state.change||{}}
            onPress={() => {
              this.setState({
                showNotifiation: false,
                currentPage: "ChangeLogs",
                forMember: !this.state.forMember,
              });
              this.resetSelectedCommitee();
            }}
            close={() => {
              this.setState({
                showNotifiation: false,
              });
            }}
            isOpen={this.state.showNotifiation}
          ></NotificationModal>
          <View
            style={{
              marginRight: "95%",
              width: "100%",
              marginBottom: "5%",
            }}
          >
          </View>
        </View>
      {this.state.working ? (
        <View style={{ position: "absolute", marginTop: "-8%" }}>
          <Spinner size={"small"}></Spinner>
        </View>
      ) : null}
        <ParticipantModal
          hideTitle={this.state.hideTitle}
          master={this.master}
          creator={this.event.creator_phone}
          participants={
            this.state.partimembers
              ? uniqBy(
                this.state.partimembers.filter(
                  (ele) => ele !== null && !Array.isArray(ele)
                ),
                (ele) => ele.phone
              )
              : []
          }
          isOpen={this.state.showMembers}
          onClosed={() => {
            this.setState({
              showMembers: false,
              partimembers: null,
              hideTitle: false,
            });
          }}
          event_id={this.event.id}
        ></ParticipantModal>
        <SelectableContactList
          removing={this.state.removing}
          notcheckall={this.state.notcheckall}
          saveRemoved={(mem) => this.saveRemoved(mem)}
          adding={this.state.adding}
          title={this.state.title}
          phone={stores.LoginStore.user.phone}
          addMembers={(members) => {
            this.saveCommiteeMembers(members);
          }}
          members={
            this.state.members !== null && this.state.members
              ? uniqBy(
                this.state.members.filter(
                  (ele) =>
                    ele !== null &&
                    !Array.isArray(ele) &&
                    ele.phone !== this.event.creator_phone
                ),
                (ele) => ele.phone
              )
              : []
          }
          close={() => {
            this.setState({
              adding: false,
              removing: false,
              members: null,
              notcheckall: false,
              isSelectableListOpened: false,
            });
          }}
          isOpen={this.state.isSelectableListOpened}
          takecheckedResult={(data) => this.createCommitee(data)}
        ></SelectableContactList>
        <CreateCommiteeModal
          isOpen={this.state.isCommiteeModalOpened}
          createCommitee={(data) => this.processResult(data)}
          close={() =>
            this.setState({
              isCommiteeModalOpened: false,
            })
          }
        ></CreateCommiteeModal>
        <ContactListModal
          contacts={this.state.contactList}
          title={this.state.title}
          isOpen={this.state.isContactListOpened}
          onClosed={() => {
            this.setState({
              isContactListOpened: false,
              contactList: [],
            });
          }}
        ></ContactListModal>
        <ContentModal
          content={this.state.textContent}
          isOpen={this.state.isContentModalOpened}
          closed={() => {
            this.setState({
              isContentModalOpened: false,
              textContent: null,
            });
          }}
        ></ContentModal>
        <AreYouSure
          isOpen={this.state.isAreYouSureModalOpened}
          title={this.state.warnTitle}
          closed={() => {
            this.setState({
              isAreYouSureModalOpened: false,
              warnDescription: null,
              warnTitle: null,
              callback: null,
            });
          }}
          callback={() => this.state.callback()}
          ok={this.state.okButtonText}
          message={this.state.warnDescription}
        ></AreYouSure>
        <InviteParticipantModal
          adding={this.state.adding}
          invite={(members) => this.invite(members)}
          onClosed={() => {
            this.setState({
              isInviteModalOpened: false,
            });
          }}
          master={this.master}
          isOpen={this.state.isInviteModalOpened}
          participant={this.event.participant}
        ></InviteParticipantModal>
        <ManageMembersModal
          isOpen={this.state.isManagementModalOpened}
          checkActivity={(member) => this.checkActivity(member)}
          creator={this.event.creator_phone}
          participants={this.event.participant}
          master={this.master}
          changeMasterState={(newState) =>
            this.changeEventMasterState(newState)
          }
          bandMembers={(selected) => this.bandMember(selected)}
          onClosed={() => {
            this.setState({
              isManagementModalOpened: false,
            });
          }}
        ></ManageMembersModal>
        <PhotoInputModal
          saveBackground={(url) => this.saveBackground(url)}
          removePhoto={() => {
            this.setState({
              isAreYouSureModalOpened: true,
              warnTitle: "Remove Photo",
              warnDescription: "Are You Sure You Want To Remove This Photo",
              callback: this.removeActivityPhoto.bind(this),
              okButtonText: "Remove",
            });
          }}
          photo={this.event.background}
          showActivityPhoto={() => {
            this.event.background && this.showPhoto(this.event.background);
          }}
          isOpen={this.state.isSelectPhotoInputMethodModal}
          closed={() =>
            this.setState({
              isSelectPhotoInputMethodModal: false,
            })
          }
        ></PhotoInputModal>
        <PhotoViewer
          open={this.state.showPhoto}
          photo={this.state.photo}
          hidePhoto={() => {
            this.setState({
              showPhoto: false,
              woking: true,
            });
            setTimeout(() => {
              this.setState({
                working: false,
              });
            }, 2000);
            // doing this because if the profile picture is being clicked from the
            // the changeBox Component , the onPress function of the BleashupTimline Compoent is automatically
            // triggered . so this is an attempt to restore the blocking done when that photo is being pressed
          }}
        ></PhotoViewer>
        <HighlightCardDetail
          mention={(item) => {
            this.mentionPost(item);
            this.setState({
              isHighlightDetailModalOpened: false,
            });
          }}
          shouldRestore={this.state.shouldRestore}
          showPhoto={(url) => this.showPhoto(url)}
          showVideo={(url) => this.showVideo(url)}
          shouldNotMention={this.state.shouldNotMention}
          restore={(item) =>
            this.restoreHighlight({ new_value: { new_value: item } })
          }
          isOpen={this.state.isHighlightDetailModalOpened}
          item={this.state.highlight}
          onClosed={() => {
            this.setState({
              isHighlightDetailModalOpened: false,
              shouldNotMention: false,
              shouldRestore: false,
            });
          }}
        ></HighlightCardDetail>
        <TasksCreation
          shouldRestore={this.state.shouldRestore}
          canRestore={
            this.state.remind &&
            (this.state.remind.creator === this.user.phone||this.master)
          }
          restore={(item) =>
            this.restoreRemind({ new_value: { new_value: item } })
          }
          isOpen={this.state.isremindConfigurationModal}
          onClosed={() => {
            this.setState({
              isremindConfigurationModal: false,
              shouldRestore: false,
            });
          }}
          event_id={this.event.id}
          event={this.event}
          remind_id={this.state.remind_id}
          remind={this.state.remind}
        ></TasksCreation>
        <ProfileModal
          profile={this.state.profile}
          isOpen={this.state.isProfileModalOpened}
          onClosed={() => {
            this.setState({
              isProfileModalOpened: false,
            });
          }}
        ></ProfileModal>
        <VideoViewer
          video={this.state.video}
          open={this.state.showVideoModal}
          hideVideo={() => {
            this.setState({
              showVideoModal: false,
              isHighlightDetailModalOpened: true,
            });
          }}
        ></VideoViewer>
      <SettingsTabModal
        addMembers={() => this.startInvitation(true)}
        invite={() => this.startInvitation()}
        remove={() => this.showMembers()}
        isOpen={this.state.isSettingsModalOpened}
        currentPhone={this.user.phone}
        leaveActivity={() => this.preleaveActivity()}
        changeMasterState={(newState) =>
          this.changeEventMasterState(newState)
        }
        bandMembers={(selected) => this.bandMember(selected)}
        checkActivity={(member) => this.checkActivity(member)}
        closeActivity={() => {
          this.event.closed
            ? this.closeActivity()
            : this.setState({
              isAreYouSureModalOpened: true,
              callback: () => this.closeActivity(),
              warnDescription:
                "Are You Sure You Want To Close This Activiy ?",
              warnTitle: "Close Activity",
              okButtonText: "Close",
            });
        }}
        creator={this.event.creator_phone === this.user.phone}
        computedMaster={this.computedMaster}
        master={this.master}
        event={this.event}
        saveSettings={(original, newSettings) => {
          this.saveSettings(original, newSettings);
        }}
        closed={() => {
          this.setState({
            isSettingsModalOpened: false,
          });
          console.warn("closing settings modal");
          this.markAsConfigured();
        }}
      ></SettingsTabModal>
    </View>
  }
  render() {
    StatusBar.setHidden(false, true);
    return !this.state.mounted?null:(!this.isChat(this.state.currentPage) ? <View style={{ height: '100%' }}>{this.renderMenu()}
    {this.renderExtra()}
    </View> :
      <Drawer
        useInteractionManager={true}
        tweenHandler={
          //this.isChat(this.state.currentPage)
          //  ? null
           // : 
            Drawer.tweenPresets.parallax
        }
        open={this.isOpen}
        onOpen={() => {
          this.isOpen = true;
        }}
        onClose={() => {
          this.isOpen = false;
          setTimeout(() => {
            !this.isChat(this.state.currentPage)
              ? this.setState({
                isChat: false,
              })
              : null;
          }, 50);
        }}
        tapToClose={true}
        panOpenMask={0.1}
        acceptDoubleTap={true}
        panOpenMask={0.2}
        elevation={//this.state.isChat ? 16 : 
          null
        }
        openDrawerOffset={//this.state.isChat ? 0.23 : 
          0.815}
        type={//this.state.isChat ? "overlay" : 
        "static"}
        styles={{
          drawer: {
            shadowColor: "#000000",
            shadowOpacity: 0.8,
            shadowRadius: 3,
          },
          main: {},
        }}
        autoClosing={false}
        onMove={(position) => { }}
        bounceBackOnOverdraw={false}
        onChange={(position) => {
          this.isOpen = position;
        }}
        isOpen={this.isOpen}
        //initializeOpen={true}
        openMenuOffset={this.currentWidth}
        content={
          <View
            style={{ backgroundColor: colorList.bodyBackground, width: "100%" }}
          >
            <SWView
              join={this.joinCommitee.bind(this)}
              navigateHome={() => {
                this.setState({
                  isChat: false,
                });
                //this.goback()
              }}
              exitActivity={() => {
                this.goback();
              }}
              hideMenu={() => {
                this.isOpen = false;
                this.setState({});
              }}
              period={this.event.period}
              calendared={this.event.calendar_id ? true : false}
              isChat={this.state.isChat}
              computedMaster={this.computedMaster}
              ref="swipperView"
              publish={() => this.publish()}
              showActivityPhotoAction={() =>
                this.computedMaster
                  ? this.openPhotoSelectorModal(this.event.background)
                  : this.showPhoto(this.event.background)
              }
              openSettingsModal={() => this.openSettingsModal()}
              addMembers={(id, currentMembers) =>
                this.addCommiteeMembers(id, currentMembers)
              }
              publishCommitee={(id, stater) => {
                this.publishCommitee(id, stater);
              }}
              editName={(newName, id, currentName) =>
                this.computedMaster
                  ? this.editName(newName, id)
                  : Toaster({ text: "Connot Update This Commitee" })
              }
              swapChats={(room) => this.swapChats(room)}
              phone={stores.LoginStore.user.phone}
              commitees={this.event.commitee ? this.event.commitee : []}
              showCreateCommiteeModal={() => {
                if (!this.state.working && this.computedMaster) {
                  this.setState({
                    isCommiteeModalOpened: true,
                  });
                } else {
                  Toaster({
                    text:
                      "You don't have enough priviledges to add a commitee ",
                    duration: 4000,
                  });
                }
              }}
              //showMembers={() => this.showMembers()}
              setCurrentPage={(page, data) => {
                this.setCurrentPage(page, data);
              }}
              currentPage={this.state.currentPage}
              //width={this.state.isChat ? this.normalWidth : this.currentWidth}
              event={this.event}
              master={this.master}
              public={this.event.public}
              navigatePage={(page) => {
                BeNavigator.navigateTo(page);
              }}
            ></SWView>
          </View>
        }
      >
        <View
          style={{
            height: "100%",
            backgroundColor: colorList.bodyBackground,
          }}
        >
          {this.state.fresh ? (
            <View
              style={{
                height: "100%",
                width: "100%",
                backgroundColor: colorList.bodyBackground,
              }}
            ></View>
          ) : (
              this.renderMenu()
            )}
            {this.renderExtra()}
        </View>
      </Drawer>);
  }
}
