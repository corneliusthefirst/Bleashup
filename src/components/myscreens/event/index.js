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
import { uniqBy, findIndex, find, unionBy,reject } from "lodash";
import Requester from "./Requester";
import emitter from "../../../services/eventEmiter";
import GState from "../../../stores/globalState";
import firebase from "react-native-firebase";
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
import SearchImage from "./createEvent/components/SearchImage";
import Pickers from "../../../services/Picker";
import HighlightCardDetail from "./createEvent/components/HighlightCardDetail";
import TasksCreation from "../reminds/TasksCreation";
import testForURL from "../../../services/testForURL";
import ProfileModal from "../invitations/components/ProfileModal";
import shadower from "../../shadower";
import colorList from "../../colorList";
import SettingsTabModal from "./SettingTabModal";
import BeNavigator from "../../../services/navigationServices";
import replies from "../eventChat/reply_extern";
import Toaster from "../../../services/Toaster";
import Spinner from '../../Spinner';
import IDMaker from '../../../services/IdMaker';
import SetAlarmPatternModal from "./SetAlarmPatternModal";
import BeComponent from '../../BeComponent';
import Texts from '../../../meta/text';
import { close_all_modals, reply_me } from '../../../meta/events';
import EventDescription from './createEvent/components/EventDescription';
import DescriptionModal from "../eventDetails/descriptionModal";
import ActivityPages from '../eventChat/chatPages';
import ShareAsLink from './ShareAsLink';
import request from '../../../services/requestObjects';
import ShareWithYourContacts from "../eventChat/ShareWithYourContacts";
import message_types from '../eventChat/message_types';
import DetailsModal from '../invitations/components/DetailsModal';

const screenWidth = Math.round(Dimensions.get("window").width);

var swipeoutBtns = [
  {
    text: "Button",
  },
];

export default class Event extends BeComponent {
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
    initalPage: ActivityPages.starts,
    currentPage: ActivityPages.starts,
    enabled: false,
    members: [],
    newing: false,
    isOpen: false,
  };
  textStyle = {
    fontSize: 15,
  };

  showRemindID(id) {
    BeNavigator.goToRemindDetail(id, this.event.id)
  }
  showHighlightID(id) {
    stores.Highlights.loadHighlight(this.event.id, id).then((High) => {
      High
        ? BeNavigator.gotoStarDetail(id, High.event_id, { star: High })
        : null;
    });
  }
  showHighlightDetails(H, restoring, play) {
    play ? (H.url.video ?
      this.showVideo(H.url.video) :
      this.showPhoto(H.url.photo)) :
      BeNavigator.gotoStarDetail(H.id, H.event_id, { star: H })
  }
  addRemindForCommittee(members) {
    BeNavigator.pushActivity(this.event, ActivityPages.reminds, { currentRemindMembers: members })
  }
  applystate() {
    this.setStatePure({
      mounted: true,
    });
  }
  openMenu() {
    this.isOpen = !this.isOpen;
    this.applystate()
  }
  closeMenu() {
    this.isOpen = false
    this.applystate()
  }
  editCommiteeName() {

  }
  startThis(star) {
    BeNavigator.pushActivity(this.event, ActivityPages.starts, { star })
  }
  remindThis(remind) {
    BeNavigator.pushActivity(this.event, ActivityPages.reminds, { remind })
  }
  currentWidth = 0.5;
  isOpen = false;

  type = this.getParam("type")
  currentRemindUser = this.type && this.getParam(this.type)
  handleReplyExtern =
    (reply) => {
      if (reply.type_extern == replies.activity_photo) {
        this.openPhotoSelectorModal()
      } else if (reply.type_extern.includes(replies.description)) {
        this.showDescription()
      } else if (reply.type_extern.toLowerCase().includes("remind")) {
        reply.id ? BeNavigator.gotoRemindsWithIndex(this.event, reply.id, null,
          {
            [reply.type_extern]: reply[reply.type_extern],
            type: reply.type_extern
          }) : null;
      } else if (reply.type_extern.toLowerCase().includes("post")) {
        reply.id ? BeNavigator.gotoStarWithIndex(this.event, reply.id) : null;
      } else {
        reply.id ? this.showChanges(reply) : null;
      }
    }
  showDescription() {
    this.setStatePure({ viewdetail: true })
  }
  getShareLink(link) {
    this.setStatePure({
      isShareLinkModalOpened: true,
      link
    })
  }
  showSahreWithYourContact(message) {
    this.setStatePure({
      isShareLinkModalOpened: false,
      isShareWithYourContactsModalOpened: true,
      message: message
    })
  }
  forwardLink(link) {
    let message = request.Message()
    message.forwarded = true
    message.from_activity = this.event.id
    message.text = link
    message.sent = true
    message.created_at = moment().format()
    message.type = message_types.text
    message.id = IDMaker.make()
    message.committee_id = this.event.id
    this.showSahreWithYourContact(message)
  }
  hideShareWithYourContacts() {
    this.setStatePure({
      isShareWithYourContactsModalOpened: false
    })
  }
  hideShareLinkModal() {
    this.setStatePure({
      isShareLinkModalOpened: false
    })
  }
  showDetailModal(id) {
    this.setStatePure({
      showEventDetail: true,
      event_id: id
    })
  }
  hideDetailModal() {
    this.setStatePure({
      showEventDetail: false
    })
  }
  addStar(){
    BeNavigator.pushActivity(this.event,ActivityPages.starts,{autoStar:true})
  }
  clearIndexedRemind() {
    /*this.type = null
    this.currentRemindUser = null 
    this.setStatePure({
      newing:!this.state.newing
    })*/
  }
  
  renderMenu(NewMessages) {
    ///console.error(this.state.currentPage)
    switch (this.state.currentPage) {
      case ActivityPages.starts:
        return (
          <EventDetails
            showShare={this.showSahreWithYourContact.bind(this)}
            shareLink={this.getShareLink.bind(this)}
            isRelation={this.isRelation}
            id={this.id}
            shared={false}
            star={this.getParam("star")}
            autoStar={this.getParam('autoStar')}
            share={{
              id: "1434",
              date: moment().format(),
              sharer: stores.LoginStore.user.phone,
              item_id: "740a5530-8b20-11ea-9234-9b01561bce6b",
              event_id: this.event.id,
            }}
            startLoader={() => {
              this.setStatePure({
                working: true,
              });
            }}
            openMenu={() => {
              this.openMenu();
            }}
            mention={(data) => this.mentionPost(data)}
            updateLocation={(loc) => this.updateActivityLocation(loc)}
            showDescription={() => this.showDescription()}
            master={this.master}
            computedMaster={this.computedMaster}
            stopLoader={() => {
              this.setStatePure({
                working: false,
              });
            }}
            goback={this.goback.bind(this)}
            showVideo={(url) => this.showVideo(url)}
            showHighlight={this.showHighlightDetails.bind(this)}
            Event={this.event}
          ></EventDetails>
        );
      case ActivityPages.reminds:
        return (
          <Remind
            //shared={false}={this.getShareLink}
            showSharer={this.showSahreWithYourContact.bind(this)}
            shareLink={this.getShareLink.bind(this)}
            type={this.type}
            clearIndexedRemind={this.clearIndexedRemind.bind(this)}
            currentRemindUser={this.currentRemindUser}
            isRelation={this.isRelation}
            id={this.id}
            share={{
              id: "456322",
              date: moment().format(),
              sharer: stores.LoginStore.user.phone,
              item_id: "a7f976f0-8cd8-11ea-9234-ebf9c3b94af7",
              event_id: this.event.id,
            }}
            remind={this.getParam("remind")}
            startLoader={() => {
              this.setStatePure({
                working: true,
              });
            }}
            stopLoader={() => {
              this.setStatePure({
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
      case ActivityPages.chat:
        return (
          <EventChat
            showDetailModal={this.showDetailModal.bind(this)}
            showShare={this.showSahreWithYourContact.bind(this)}
            getShareLink={this.getShareLink.bind(this)}
            openPage={this.setCurrentPage.bind(this)}
            openSettings={this.openSettingsModal.bind(this)}
            activityPhoto={this.event.background}
            showActivityPhotoAction={this.openPhotoSelectorModal.bind(this)}
            ref={ActivityPages.chat}
            oponent={this.oponent.phone}
            id={this.id}
            isRelation={this.isRelation}
            startThis={this.startThis.bind(this)}
            remindThis={this.remindThis.bind(this)}
            editCommitteeName={() => this.editCommiteeName()}
            openSettings={() => this.openSettingsModal()}
            activity_id={this.event.id}
            activity_name={this.event.about.title}
            room_type={"activity"} //!! 'relation' if it's a relation
            //activity_name={this.event.about.title}
            openMenu={() => this.openMenu()}
            closeMenu={() => this.closeMenu()}
            showLoader={() => this.startLoader()}
            working={this.state.working}
            addStar={this.addStar.bind(this)}
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
              this.setStatePure({
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
              this.setStatePure({
                isContactListOpened: true,
                title: title,
                contactList: conctacts,
              });
            }}
          ></EventChat>
        );
      case ActivityPages.logs:
        return (
          <ChangeLogs
            isRelation={this.isRelation}
            index={this.index}
            goback={this.goback.bind(this)}
            propcessAndFoward={(change) => this.propcessAndFoward(change)}
            mention={(data) => this.mention(data)}
            restore={(data) => this.restore(data)}
            openMenu={() => this.openMenu()}
            openPhoto={(url) => this.openPhoto(url)}
            master={this.master}
            isM={this.getParam("isMe") || this.state.isMe}
            activeMember={this.getParam("activeMember") || this.state.activeMember}
            forMember={this.getParam("forMember") || this.state.forMember}
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
      this.setStatePure({
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
    let index = findIndex(stores.ChangeLogs.changes[this.event.id], (ele) => {
      return ele.updater == data.updater &&
        ele.date == data.date
    })
    if (index >= 0) {
      BeNavigator.pushActivity(this.event, ActivityPages.logs, { index })
    } else {
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
        change.new_value.new_value);
    } else if (change.updated === "highlight_url") {
      this.showHighlightDetails({
        title: change.changed,
        description: null,
        url: change.new_value.new_value,
        created_at: change.date,
      });
    } else if (change.updated === "remind_alarms") {
      this.setStatePure({
        showAlarms: true,
        alarms: change.new_value.new_value.alarms
      })
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
    this.setStatePure({
      showMembers: true,
      partimembers: members,
      hideTitle: true,
    });
  }
  showRemind(remind, restoring) {
    BeNavigator.goToRemindDetail(remind.id, this.event.id, { remind })
  }
  openPhoto(url) {
    this.showPhoto(url)
  }
  showContent(content) {
    this.setStatePure({
      textContent: content,
      isContentModalOpened: true,
    });
  }
  showContacts(contacts) {
    this.setStatePure({
      contactList: contacts,
      isContactListOpened: true,
    });
  }
  bandMember(members) {
    if (!this.state.working) {
      this.setStatePure({
        isManagementModalOpened: false,
        working: true,
      });
      Requester.bandMembers(members, this.event.id)
        .then((mem) => {
          this.initializeMaster();
          //emitter.emit("parti_removed");
        })
        .catch((e) => {
          this.setStatePure({
            working: false,
          });
          Toaster({ text: Texts.unable_to_perform_request });
        });
    }
  }
  changeEventMasterState(newState) {
    if (!this.state.working) {
      this.setStatePure({
        isManagementModalOpened: false,
        working: true,
      });
      Requester.changeEventMasterState(newState, this.event.id)
        .then(() => {
          this.initializeMaster();
        })
        .catch((e) => {
          this.setStatePure({
            isManagementModalOpened: false,
            working: false,
          });
          Toaster({ text: Texts.unable_to_perform_request });
        });
    } else {
      this.setStatePure({
        isManagementModalOpened: false,
      });
      Toaster({ text: Texts.app_busy });
    }
  }
  refreshePage() {
    this.setStatePure({
      fresh: false,
    });
  }
  handleActivityUpdates(change, newValue) {
    this.setStatePure({
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
        this.setStatePure({
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
      this.initializeMaster();
      this.refreshCommitees();
    }
    if (
      (change &&
        change.changed &&
        change.changed.toLowerCase().includes("remind")) ||
      change.title.toLowerCase().includes("remind")
    ) {
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
    emitter.emit("refresh-history");
    setTimeout(() => {
      this.setStatePure({
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
      this.event = this.returnRealEvent(e);
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
      this.setStatePure({
        working: false,
        roomMembers: GState.currentCommitee === this.event.id ?
          this.event.participant : this.state.roomMembers
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
    GState.reply = {
      ...data,
      activity_id: this.event.id
    };
    Vibration.vibrate(this.duration);
    let reply = this.getParam("reply")
    if (this.refs[ActivityPages.chat]) {
      this.directReply(data)
    } else if (reply) {
      reply(data)
      this.goback()
    } else {
      emitter.emit(reply_me + this.event.id, GState.reply);
      this.goback()
    }
  }
  startLoader() {
    this.setStatePure({
      working: true,
    });
  }
  stopLoader() {
    this.setStatePure({
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
            Toaster({ text: Texts.successfull_restoration, type: "success" });
          })
          .catch(() => {
            this.stopLoader();
          });
      } else {
        this.stopLoader();
        Toaster({ text: Texts.restored_already });
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
      Toaster({ text: Texts.app_busy });
    }
  }
  master = false;
  leave_route_event = "leave_route"
  componentMounting() {
    emitter.on(this.leave_route_event, () => {
      this.goback()
    })
    emitter.on(this.event_to_be_listen, (change, newValue) => {
      this.handleActivityUpdates(change, newValue);
    })
    this.initializeMaster();
  }
  getParam(key) {
    return this.props.navigation.getParam(key)
  }
  getOponent(participant) {
    let user = participant && participant.find(ele => ele.phone !== stores.LoginStore.user.phone)
    if (user && user.phone) {
      return stores.TemporalUsersStore.Users[user.phone]
    } else {
      return {}
    }
  }
  returnRealEvent(event) {
    let oponent = this.getOponent(event.participant) || {}
    this.oponent = oponent
    this.isRelation = event.type === "relation"
    return {
      ...event,
      background: this.isRelation ? oponent.profile : event.background,
      participant:[event.participant.find(ele => ele.phone == stores.LoginStore.user.phone)].
      concat(reject(event.participant,{phone:stores.LoginStore.user.phone})),
      about: {
        ...event.about,
        title: this.isRelation ? oponent.nickname : event.about.title
      }
    }
  }
  id = this.getParam("id")
  index = this.getParam("index")
  currentTab = this.getParam("tab")
  user = null;
  isOpen = true;
  event = this.returnRealEvent(this.getParam("Event"))
  currentRemindMembers = this.getParam("currentRemindMembers")
  componentDidMount() {
    let page = this.currentTab;
    let isEventCurrentPage = this.isChat(page);
    isEventCurrentPage ? (GState.currentCommitee = this.event.id) : null;
    this.setStatePure({
      isChat: isEventCurrentPage ? true : false,
      currentPage: page,
      currentRemindMembers: this.currentRemindMembers,
      mounted: true,
    });
    this.isOpen = false // isEventCurrentPage ? true : false;

    this.refreshePage();
  }
  updateActivityLocation(newLocation) {
    if (!this.state.working) {
      this.setStatePure({
        working: true,
      });
      Requester.updateLocation(this.event.id, newLocation)
        .then(() => {
          this.initializeMaster();
        })
        .catch(() => {
          this.setStatePure({
            working: false,
          });
        });
    } else {
      Toaster({ text: Texts.app_busy });
    }
  }
  updateActivityDescription(newDesciption) {
    if (!this.state.working) {
      this.setStatePure({
        working: true,
      });
      Requester.updateDescription(this.event.id, newDesciption)
        .then(() => {
          this.initializeMaster();
        })
        .catch(() => {
          this.setStatePure({
            working: false,
          });
        });
    } else {
      Toaster({ text: Texts.app_busy });
    }
  }
  isChat(currentPage) {
    return currentPage === ActivityPages.chat
  }


  event_to_be_listen = `event_updated_${this.event.id}`
  unInitialize() {
    Pickers.CleanAll();
    emitter.off(this.leave_route_event)
    emitter.off(this.event_to_be_listen);

    this.isChat(this.state.currentPage) ? GState.currentCommitee = null : null;
  }
  unmountingComponent() {
    this.unInitialize();
  }
  _allowScroll(scrollEnabled) {
    this.setStatePure({ scrollEnabled: scrollEnabled });
  }
  showMembers() {
    this.isOpen = false;
    this.setStatePure({
      isManagementModalOpened: true,
      partimembers: this.event.participant,
    });
  }
  processResult(data) {
    this.setStatePure({
      isSelectableListOpened: true,
      isCommiteeModalOpened: false,
      title: Texts.select_members,
      members: this.event.participant,
      notcheckall: !data.publicState,
      tempCommiteeName: data.commiteeName,
      tempPublicState: data.publicState,
    });
  }
  createCommitee(data) {
    if (!this.state.working) {
      this.setStatePure({
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
        id: IDMaker.make(),
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
              this.setStatePure({
                newCommitee: true,
                working: false,
              });
              this.refreshCommitees();
            });
        })
        .catch(() => {
          this.setStatePure({
            newCommitee: true,
            working: false,
          });
        });
      //console.warn(data)
    } else {
      Toaster({ text: Texts.app_busy });
    }
  }
  editName(newName, id) {
    let roomName = this.state.roomID === id ? newName : this.state.roomName;
    if (!this.state.working) {
      this.setStatePure({
        working: true,
      });
      Requester.editCommiteeName(newName, id, this.event.id)
        .then(() => {
          this.setStatePure({
            working: false,
            roomName,
          });
        })
        .catch((error) => {
          this.setStatePure({
            working: false,
          });
          /// console.warn(error)
          emitter.emit("edit-failed", error);
        });
    } else {
      Toaster({ text: Texts.app_busy });
    }
  }
  publishCommitee(id, state) {
    if (!this.state.working) {
      this.setStatePure({
        working: true,
      });
      Requester.publishCommitee(id, this.event.id, state, this.state.roomName)
        .then(() => {
          emitter.emit("publish-unpublish", state);
          this.setStatePure({
            working: false,
            public_state: !this.state.public_state,
          });
          this.refreshCommitees();
        })
        .catch(() => {
          this.setStatePure({
            working: false,
          });
        });
    } else {
      Toaster({ text: Texts.app_busy });
    }
  }
  addCommiteeMembers(id, currentMembers) {
    this.setStatePure({
      isSelectableListOpened: true,
      title: Texts.add_participant,
      members: this.event.participant.filter(
        (ele) => findIndex(currentMembers, { phone: ele.phone }) < 0
      ),
      commitee_id: id,
      adding: true,
    });
  }
  removeMembers(id, members) {
    this.setStatePure({
      isSelectableListOpened: true,
      title: Texts.select_members_to_remove,
      members: members,
      notcheckall: true,
      commitee_id: id,
      removing: true,
    });
  }
  saveCommiteeMembers(members) {
    if (members.length > 0) {
      if (!this.state.working) {
        this.setStatePure({
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
            this.setStatePure({
              commitee_id: null,
              members: null,
              roomMembers: unionBy(this.state.roomMembers, members, "phone"),
              adding: false,
              working: false,
            });
          })
          .catch((error) => {
            this.setStatePure({
              isSelectableListOpened: false,
              commitee_id: null,
              members: null,
              adding: false,
              working: false,
            });
          });
      } else {
        this.setStatePure({
          isSelectableListOpened: false,
          commitee_id: null,
          members: null,
          adding: false,
          working: false,
        });
        Toaster({ text: Texts.app_busy });
      }
    } else {
      this.setStatePure({
        isSelectableListOpened: false,
        commitee_id: null,
        members: null,
        adding: false,
        working: false,
      });
      Toaster({ text: Texts.no_member_selected });
    }
  }
  swapChats(commitee) {
    this.isOpen = false;
    GState.currentCommitee = commitee.id;
    this.setStatePure({
      roomID: commitee.id,
      roomName: commitee.name,
      currentPage: ActivityPages.chat,
      fresh: true,
      public_state: commitee.public_state,
      opened: commitee.opened,
      newMessageCount: GState.currentRoomNewMessages
        ? GState.currentRoomNewMessages.length
        : 0,
      roomMembers: commitee.member,
    });
    setTimeout(() => {
      this.setStatePure({
        fresh: false,
      });
    }, 20);
  }
  invite(members) {
    if (!this.state.working) {
      this.setStatePure({
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
            this.setStatePure({
              working: false,
            });
            Toaster({ text: Texts.unable_to_perform_request });
          });
      } else {
        Requester.invite(members, this.event.id)
          .then(() => {
            this.initializeMaster();
          })
          .catch((err) => {
            this.setStatePure({
              working: false,
            });
            Toaster({ message: Texts.unable_to_perform_request });
          });
      }
    } else {
      Toaster({ message: Texts.app_busy });
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
        this.setStatePure({
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
            this.setStatePure({
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
            this.setStatePure({
              isSelectableListOpened: false,
              commitee_id: null,
              members: null,
              removing: false,
              notcheckall: false,
              working: false,
            });
          });
      } else {
        this.setStatePure({
          isSelectableListOpened: false,
          commitee_id: null,
          members: null,
          removing: false,
          notcheckall: false,
          working: false,
        });
        Toaster({ text: Texts.app_busy });
      }
    } else {
      this.setStatePure({
        isSelectableListOpened: false,
        commitee_id: null,
        members: null,
        removing: false,
        notcheckall: false,
        working: false,
      });
      Toaster({ text: Texts.no_member_selected });
    }
  }
  joinCommitee(id) {
    if (!this.state.working) {
      this.setStatePure({
        working: true,
      });
      let member = find(this.event.participant, {
        phone: stores.LoginStore.user.phone,
      });
      Requester.joinCommitee(id, this.event.id, member)
        .then(() => {
          emitter.emit("joint");
          this.setStatePure({
            working: false,
          });
          this.refreshCommitees();
          AddMembers(this.event.id, id, [member]).then(() => { });
        })
        .catch((error) => {
          this.setStatePure({
            working: false,
          });
        });
    } else {
      Toaster({ text: Texts.no_member_selected });
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
      this.setStatePure({
        working: true,
      });
      Requester.leaveCommitee(id, this.event.id)
        .then(() => {
          this.isOpen = true;
          this.resetSelectedCommitee();
          this.setStatePure({
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
          this.setStatePure({
            working: false,
          });
        });
    } else {
      Toaster({ text: Texts.app_busy });
    }
  }
  openCommitee(id) {
    if (!this.state.working) {
      this.setStatePure({
        working: true,
      });
      Requester.openCommitee(id, this.event.id)
        .then(() => {
          emitter.emit("open-close", true);
          this.setStatePure({
            working: false,
            opened: true,
          });
          this.refreshCommitees();
        })
        .catch((error) => {
          console.warn(error);
          this.setStatePure({
            working: false,
          });
        });
    } else {
      Toaster({ text: Texts.app_busy });
    }
  }
  closeCommitee(id) {
    if (!this.state.working) {
      this.setStatePure({
        working: true,
      });
      Requester.closeCommitee(id, this.event.id)
        .then(() => {
          emitter.emit("open-close", false);
          this.setStatePure({
            working: false,
            opened: false,
          });
          this.refreshCommitees();
        })
        .catch((error) => {
          this.setStatePure({
            working: false,
          });
          console.warn(error);
        });
    } else {
      Toaster({ text: Texts.no_member_selected });
    }
  }
  inviteContacts(adding) {
    this.isOpen = false;
    this.setStatePure({
      isInviteModalOpened: true,
      adding: adding,
    });
  }
  hideDescription() {
    this.setStatePure({ viewdetail: false })
  }
  checkActivity(member) {
    this.closeSettingModal()
    BeNavigator.gotoChangeLogs(this.event, {
      isMe: member.phone === stores.LoginStore.user.phone ? true : false,
      activeMember: member.phone,
      forMember: member.nickname
    })
  }
  openSettingsModal() {
    this.isOpen = false;
    this.setStatePure({
      isSettingsModalOpened: true,
    });
  }
  openPhotoSelectorModal() {
    this.isOpen = false;
    this.setStatePure({
      isSelectPhotoInputMethodModal: true,
    });
  }
  leaveActivity() {
    this.isOpen = true;
    if (!this.state.working) {
      this.setStatePure({
        working: true,
        isAreYouSureModalOpened: false,
      });
      Requester.leaveActivity(this.event.id, this.user.phone)
        .then(() => {
          this.initializeMaster();
          this.setStatePure({
            working: false,
          });
          emitter.emit(`left_${this.event.id}`); //TODO: this signal is beign listen to in the module current_events>public_events>join
          RemoveParticipant(this.event.id, [this.user]).then((response) => {
            this.initializeMaster();
            this.goback();
          });
        })
        .catch((e) => {
          this.setStatePure({
            working: false,
          });
        });
    } else {
      Toaster({ text: Texts.app_busy });
    }
  }
  /*publish() {
    if (!this.state.working) {
      this.setStatePure({
        working: true,
      });
      if (this.event.public) {
        Requester.publish(this.event.id, this.event.about.title).then(() => {
          this.initializeMaster();
        });
      } else {
        this.setStatePure({
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
  }*/
  saveSettings(original, newSettings) {
    if (!this.state.working) {
      this.setStatePure({
        working: true,
      });
      Requester.applyAllUpdate(original, newSettings)
        .then((res) => {
          this.initializeMaster();
        })
        .catch((erorr) => {
          Toaster({ text: Texts.unable_to_perform_request });
          this.initializeMaster();
        });
    } else {
      this.initializeMaster();
      Toaster({ text: Texts.app_busy });
    }
  }
  markAsConfigured() {
    stores.Events.markAsConfigured(this.event.id).then(() => {
      this.initializeMaster();
    });
  }
  closeActivity() {
    if (!this.state.working) {
      this.setStatePure({
        working: true,
        isAreYouSureModalOpened: false,
      });
      Requester.updateCloseActivity(this.event, !this.event.closed)
        .then(() => {
          this.initializeMaster();
        })
        .catch(() => {
          Toaster({ text: Texts.unable_to_perform_request });
        });
    } else {
      Toaster({ text: Texts.app_busy });
    }
  }
  saveBackground(path) {
    this.setStatePure({
      working: true,
    });
    Requester.changeBackground(this.event.id, path)
      .then((res) => {
        this.initializeMaster();
      })
      .catch((err) => {
        this.setStatePure({
          working: false,
        });
        Toaster({ text: Texts.unable_to_perform_request });
        this.initializeMaster();
      });
  }
  showPhoto(photo) {
    BeNavigator.openPhoto(photo)
  }
  showVideo(url) {
    BeNavigator.openVideo(url)
  }
  mentionPost(replyer) {
    this.mention(GState.prepareStarForMention(replyer));
  }
  setCurrentPage(page, data) {
    BeNavigator.pushActivity(this.event, page);
  }
  preleaveActivity() {
    this.isOpen = false;
    this.member
      ? this.setStatePure({
        isAreYouSureModalOpened: true,
        warnDescription: Texts.are_you_sure_you_want_to_leave,
        warnTitle: Texts.leave_activity,
        callback: this.leaveActivity.bind(this),
      })
      : Toaster({ text: Texts.not_member_anymore });
  }
  hideEditDescription() {
    this.setStatePure({ EventDescriptionState: false })
  }
  showEditDescription() {
    this.setStatePure({ EventDescriptionState: true })
  }
  replyDescription() {
    this.hideDescription()
    setTimeout(() => {
      this.mention(GState.prepareDescriptionForMention(
        this.event.about.description,
        this.event.id,
        this.event.creator_phone))
    }, 200)
  }
  hidePhotoIput() {
    this.setStatePure({
      isSelectPhotoInputMethodModal: false,
    })
  }
  directReply(reply) {
    this.refs[ActivityPages.chat] && this.refs[ActivityPages.chat].initReply(reply)
  }
  replyToPhoto() {
    this.hidePhotoIput()
    setTimeout(() => {
      let reply = GState.prepareActivityPhotoForMention(this.event.background,
        this.event.id, this.event.creator_phone)
      this.mention(reply)
    }, 100)
  }
  closeSettingModal() {
    this.setStatePure({
      isSettingsModalOpened: false,
    });
    //this.markAsConfigured();
  }
  startInvitation(adding) {
    this.computedMaster || this.event.public
      ? this.inviteContacts(adding)
      : Toaster({
        text:
          Texts.unable_to_perform_request,
        duration: 4000,
      });
  }
  unsync() {
    this.setStatePure({
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
        {this.state.showNotifiation ? <NotificationModal
          change={this.state.change || {}}
          onPress={() => {
            this.setStatePure({
              showNotifiation: false,
              currentPage: ActivityPages.logs,
              forMember: !this.state.forMember,
            });
            this.resetSelectedCommitee();
          }}
          close={() => {
            this.setStatePure({
              showNotifiation: false,
            });
          }}
          isOpen={this.state.showNotifiation}
        ></NotificationModal> : false}
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
      {this.state.showMembers ? <ParticipantModal
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
          this.setStatePure({
            showMembers: false,
            partimembers: null,
            hideTitle: false,
          });
        }}
        event_id={this.event.id}
      ></ParticipantModal> : null}
      {this.state.showAlarms ? <SetAlarmPatternModal
        isOpen={this.state.showAlarms}
        dontSet
        pattern={this.state.alarms}
        closed={() => {
          this.setStatePure({
            showAlarms: false
          })
        }}
      >
      </SetAlarmPatternModal> : null}
      {this.state.isSelectableListOpened ? <SelectableContactList
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
          this.setStatePure({
            adding: false,
            removing: false,
            members: null,
            notcheckall: false,
            isSelectableListOpened: false,
          });
        }}
        isOpen={this.state.isSelectableListOpened}
        takecheckedResult={(data) => this.createCommitee(data)}
      ></SelectableContactList> : null}
      {this.state.isCommiteeModalOpened ? <CreateCommiteeModal
        isOpen={this.state.isCommiteeModalOpened}
        createCommitee={(data) => this.processResult(data)}
        close={() =>
          this.setStatePure({
            isCommiteeModalOpened: false,
          })
        }
      ></CreateCommiteeModal> : null}
      {this.state.isContactListOpened ? <ContactListModal
        contacts={this.state.contactList}
        title={this.state.title}
        isOpen={this.state.isContactListOpened}
        onClosed={() => {
          this.setStatePure({
            isContactListOpened: false,
            contactList: [],
          });
        }}
      ></ContactListModal> : null}
      {this.state.viewdetail ? <DescriptionModal
        Event={this.event}
        isOpen={this.state.viewdetail}
        onClosed={this.hideDescription.bind(this)}
        computedMaster={this.computedMaster}
        replyDescription={this.replyDescription.bind(this)}
        showEditDescription={this.showEditDescription.bind(this)}
      >
      </DescriptionModal> : null}

      {this.state.EventDescriptionState ? <EventDescription
        updateDesc={(newDesc) => {
          this.updateActivityDescription(newDesc)
        }}
        event={this.event || {}}
        isOpen={this.state.EventDescriptionState}
        onClosed={this.hideEditDescription.bind(this)}
        ref={"description_ref"}
        eventId={this.event.id} /> : null}


      {this.state.isContentModalOpened ? <ContentModal
        content={this.state.textContent}
        isOpen={this.state.isContentModalOpened}
        closed={() => {
          this.setStatePure({
            isContentModalOpened: false,
            textContent: null,
          });
        }}
      ></ContentModal> : null}
      {this.state.isAreYouSureModalOpened ? <AreYouSure
        isOpen={this.state.isAreYouSureModalOpened}
        title={this.state.warnTitle}
        closed={() => {
          this.setStatePure({
            isAreYouSureModalOpened: false,
            warnDescription: null,
            warnTitle: null,
            callback: null,
          });
        }}
        callback={() => this.state.callback()}
        ok={this.state.okButtonText}
        message={this.state.warnDescription}
      ></AreYouSure> : null}
      {this.state.isInviteModalOpened ? <InviteParticipantModal
        adding={this.state.adding}
        invite={(members) => this.invite(members)}
        onClosed={() => {
          this.setStatePure({
            isInviteModalOpened: false,
          });
        }}
        master={this.master}
        isOpen={this.state.isInviteModalOpened}
        participant={this.event.participant}
      ></InviteParticipantModal> : null}
      {this.state.isShareLinkModalOpened ? <ShareAsLink
        onClosed={this.hideShareLinkModal.bind(this)}
        link={this.state.link}
        share={this.forwardLink.bind(this)}
        isOpen={this.state.isShareLinkModalOpened}>

      </ShareAsLink> : null}
      {this.state.isShareWithYourContactsModalOpened ?
        <ShareWithYourContacts
          isOpen={this.state.isShareWithYourContactsModalOpened}
          message={this.state.message}
          activity_id={this.event.id}
          sender={request.Message().sender}
          committee_id={this.event.id}
          onClosed={this.hideShareWithYourContacts.bind(this)}
        >
        </ShareWithYourContacts> : null}
      {this.state.showEventDetail?<DetailsModal
        event={{ ...request.Event(),id:this.state.event_id }}
        isToBeJoint
        isOpen={this.state.showEventDetail}
        onClosed={this.hideDetailModal.bind(this)}
        >
        </DetailsModal>:null}
      {this.state.isManagementModalOpened ? <ManageMembersModal
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
          this.setStatePure({
            isManagementModalOpened: false,
          });
        }}
      ></ManageMembersModal> : null}
      {this.state.isSelectPhotoInputMethodModal ? <PhotoInputModal
        replyToPhoto={this.replyToPhoto.bind(this)}
        isRelation={!this.computedMaster || this.isRelation}
        saveBackground={(url) => this.saveBackground(url)}
        photo={this.event.background}
        showActivityPhoto={() => {
          this.event.background && this.showPhoto(this.event.background);
        }}
        isOpen={this.state.isSelectPhotoInputMethodModal}
        closed={this.hidePhotoIput.bind(this)}
      ></PhotoInputModal> : null}
      {this.state.isProfileModalOpened ? <ProfileModal
        profile={this.state.profile}
        isOpen={this.state.isProfileModalOpened}
        onClosed={() => {
          this.setStatePure({
            isProfileModalOpened: false,
          });
        }}
      ></ProfileModal> : null}
      {this.state.isSettingsModalOpened ? <SettingsTabModal
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
            : this.setStatePure({
              isAreYouSureModalOpened: true,
              callback: () => this.closeActivity(),
              warnDescription: Texts.are_you_sure_to_close,
              warnTitle: Texts.close_activity,
              okButtonText: Texts.close,
            });
        }}
        creator={this.event.creator_phone === this.user.phone}
        computedMaster={this.computedMaster}
        master={this.master}
        event={this.event}
        saveSettings={(original, newSettings) => {
          this.saveSettings(original, newSettings);
        }}
        closed={this.closeSettingModal.bind(this)}
      ></SettingsTabModal> : null}
    </View>
  }
  render() {
    StatusBar.setHidden(false, true);
    return !this.state.mounted ? null : (!this.isChat(this.state.currentPage) ? <View style={{ height: '100%' }}>{this.renderMenu()}
      {this.renderExtra()}
    </View> : <View>
        {this.state.fresh ? (
          <View
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: colorList.bodyBackground,
            }}
          ></View>
        ) : this.renderMenu()}
        {this.renderExtra()}
      </View>
    )
  }
}
