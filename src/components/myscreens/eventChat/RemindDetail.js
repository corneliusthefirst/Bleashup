/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import stores from "../../../stores/index";
import moment from "moment";
import { find, } from "lodash";
import { dateDiff, writeDateTime } from "../../../services/datesWriter";
import { format } from "../../../services/recurrenceConfigs";
import ColorList from "../../colorList";
import MedaiView from "../event/createEvent/components/MediaView";
import { createOpenLink } from "react-native-open-maps";
import CreateButton from "../event/createEvent/components/ActionButton";
import shadower from "../../shadower";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import GState from "../../../stores/globalState";
import TextContent from "../eventChat/TextContent";
import Texts from "../../../meta/text";
import SetAlarmPatternModal from "../event/SetAlarmPatternModal";
import {
  returnCurrentPatterns,
  loadStates,
  loadIntervals,
  calculateCurrentStates,
  returnRealActualIntervals,
  returnActualDatesIntervals
} from "../reminds/remindsServices";
import RemindRequest from "../reminds/Requester";
import request from "../../../services/requestObjects";
import BeNavigator from "../../../services/navigationServices";
import AnimatedPureComponent from '../../AnimatedPureComponent';
import AddReport from '../reminds/AddReportModal';
import ActivityProfile from "../currentevents/components/ActivityProfile";
import DetailsModal from "../invitations/components/DetailsModal";
import rounder from '../../../services/rounder';
import Entypo from 'react-native-vector-icons/Entypo';
import Spinner from "../../Spinner";
import Creator from '../reminds/Creator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ShareWithYourContacts from "./ShareWithYourContacts";
import messagePreparer from './messagePreparer';
import active_types from './activity_types';
import { remindTitle, remindDescription, remindLocation, remindMembers, remindMedia, remindTimeDetail, remindActons, remindCreator, UnAssignAction } from '../reminds/taskCardParts';
import { remindTime } from '../reminds/taskCardParts';
import public_states from '../reminds/public_states';
import BeMenu from "../../Menu";

let { height, width } = Dimensions.get("window");

export default class RemindDetail extends AnimatedPureComponent {
  initialize() {
    this.state = {
      newing: false,
      mounted: false
    };
    this.loadStates = loadStates.bind(this)
    this.loadIntervals = loadIntervals.bind(this)
    this.calculateCurrentStates = calculateCurrentStates.bind(this)
    this.returnRealActualIntervals = returnRealActualIntervals.bind(this)
    this.returnActualDatesIntervals = returnActualDatesIntervals.bind(this)
    this.remindTitle = remindTitle.bind(this)
    this.remindTime = remindTime.bind(this)
    this.remindDescription = remindDescription.bind(this)
    this.remindLocation = remindLocation.bind(this)
    this.remindMembers = remindMembers.bind(this)
    this.remindMedia = remindMedia.bind(this)
    this.remindTimeDetail = remindTimeDetail.bind(this)
    this.remindActions = remindActons.bind(this)
    this.remindCreator = remindCreator.bind(this)
    this.unAssignAction = UnAssignAction.bind(this)
  }
  refreshStates() {
    this.setStatePure({
      newing: !this.state.newing,
      mounted: true
    })
  }
  showMembers() {
    BeNavigator.gotoContactList(
      this.item.members,
      Texts.program_members)
  }
  loadInitialStates() {
    stores.Events.loadCurrentEvent(this.activity_id).then(eve => {
      this.activity = eve
      stores.Reminds.loadRemind(this.activity_id, this.item_id).then((item) => {
        this.item = { ...item, status: public_states.private_ }
        console.warn("local states loaded")
        this.loadStates()
      }).catch(() => {
        this.showError()
      })
    }).catch(() => {
      this.showError()
    })
  }
  loadStateFromRemind() {
    stores.Events.loadCurrentEvent(this.remind.event_id).then((eve) => {
      this.activity = eve
      this.item = { ...this.remind, status: public_states.private_ }
      this.loadStates()
    })
  }
  loadStatesFromRemote() {
    console.warn("loading states from remote")
    stores.Events.loadCurrentEventFromRemote(this.activity_id).then(
      (event) => {
        this.activity = event
        stores.Reminds.loadRemindFromRemote(
          this.activity_id,
          this.item_id
        ).then((remind) => {
          this.item = Array.isArray(remind) ? remind[0] : remind;
          this.message_id &&
            sstores.Messages.updateRemindInfoInMessage(this.activity_id,
              this.message_id, this.item)
          stores.Reminds.addReminds(this.activity_id, remind).then(() => { })
          this.loadStates(false, true);
        }).catch(() => {
          this.showError()
        });
      }
    ).catch(() => {
      this.showError()
    });
  }
  showError() {
    this.setStatePure({
      error: true
    })
  }
  componentDidMount() {
    setTimeout(() => {
      if (this.remind) {
        this.loadStateFromRemind()
      } else {
        this.loadInitialStates()
        this.loadStatesFromRemote()
      }
    }, 5);
  }


  onDone() {
    this.markAsDone(this.item);
  }
  concludeDone(member) {
    this.item.donners = [...this.item.donners, member]
    this.loadStates()
  }
  markAsDoneWithReport(report) {
    let member = find(this.item.members, {
      phone: stores.LoginStore.user.phone,
    });
    member = {
      ...member,
      status: {
        date: moment().format(),
        status: {
          report: report,
          date: moment().format(),
          status: member.status,

        },
      },
    },
      RemindRequest.markAsDone([
        member
      ],
        this.item,
        this.activity.about.title).then(() => {
          this.concludeDone(member)
        })
  }
  markAsDone(item) {
    if (item.must_report) {
      this.setStatePure({
        showAddReportModal: true
      })
    } else {
      let member = find(item.members, {
        phone: stores.LoginStore.user.phone,
      });
      member = {
        ...member,
        status: {
          date: moment().format(),
          status: member.status,
        },
      },
        RemindRequest.markAsDone([
          member
        ],
          item,
          this.activity.about.title).then(() => {
            this.concludeDone(member)
          })
    }
  }
  assignToMe() {
    this.setStatePure({
      showAlarmsPattern: true,
    });
  }
  unAssignToMe() {
    let members = [stores.LoginStore.user.phone]
    RemindRequest.removeMembers(members, this.item.id, this.activity.id).then(() => {
      this.item.members = this.item.members.filter(ele => ele && ele.phone !== members[0])
      this.loadStates()
    })
  }
  container = {
    width: "98%",
    flexDirection: "column",
    backgroundColor: ColorList.bodyBackground,
    alignSelf: "center",
    margin: "1%",
    padding: "1%",
  };
  getParam = (param) => this.props.navigation.getParam(param);
  item_id = this.getParam("remind_id");
  message_id = this.getParam("message_id")
  roomID = this.getParam("room")
  remind = this.getParam("remind")
  reply = this.getParam("reply")
  reply_privately = this.getParam("reply_privately") 
  forward = this.getParam("forward") || this.startSharing.bind(this)
  activity_id = this.getParam("activity_id");
  handleReply() {

  }
  handlePrivateReply() {

  }
  saveAlarms(alarms, date) {
    let member = {
      ...request.Participant(),
      phone: stores.LoginStore.user.phone,
      master: false,
      status: "joint",
      host: stores.Session.SessionStore.host,
    };
    RemindRequest.addMembers(
      {
        ...this.item,
        members: [member],
      },
      alarms,
      this.activity.about.title
    ).then(() => {
      this.item.members = [...this.item.members, member];
      this.loadStates();
    });
  }
  showMedia(url) {
    url.video
      ? BeNavigator.openVideo(url.video)
      : BeNavigator.openPhoto(url.photo);
  }
  showDetails() {
    this.setStatePure({
      showDetailsModal: true
    })
  }
  hideDetailModal() {
    this.setStatePure({
      showDetailsModal: false
    })
  }
  hideAddReportModal() {
    this.setStatePure({
      showAddReportModal: false
    })
  }
  hideAlarmsModal() {
    this.setStatePure({
      showAlarmsPattern: false,
    });
  }
  startSharing() {
    this.setStatePure({
      isSharing: true
    })
  }
  goback() {
    this.props.navigation.goBack()
  }
  hideSharing() {
    this.setStatePure({
      isSharing: false
    })
  }
  formReply(){
    let reply = GState.prepareRemindsForMetion(this.item)
    reply.from_activity = this.item.event_id
    reply.activity_id  = this.roomID
    reply.activity_name = this.activity.about.title
    return reply
  }
  startReply() {
    GState.reply = this.formReply()
    this.reply()
    this.goback()
  }
  startPrivateReply() {
    GState.reply = this.formReply()
    this.reply_privately(this.item.members,this.item.creator)
  }
  items() {
    return [
      {
        title: Texts.reply,
        condition: this.roomID,
        action: this.startReply.bind(this)
      },
      {
        title: Texts.reply_privately,
        condition: this.roomID,
        action: this.startPrivateReply.bind(this)
      },
      {
        condition: this.member,
        title: Texts.un_assign_to_me,
        action: this.unAssignToMe.bind(this)
      }
    ]
  }
  showItem(url) {
    url.video ? BeNavigator.openVideo(url.video) : BeNavigator.openPhoto(url.photo)
  }
  render() {
    return !this.state.mounted ? (
      <View
        style={{
          ...this.container,
          height: "100%",
          width: "100%",
          justifyContent: 'center',
        }}
      >
        {this.state.error ? <Text>{Texts.unable_to_load_data}</Text> : <Spinner></Spinner>}
      </View>
    ) : (
        <ScrollView showVerticalScrollIndicator={false}>
          <View
            style={[
              this.container,
              {
                backgroundColor: this.props.isPointed
                  ? ColorList.remindsTransparent
                  : ColorList.bodyBackground,
              },
            ]}
          >
            <View style={{
              width: "100%",
              justifyContent: 'space-between',
              height: 60,
              alignSelf: 'center',
              marginBottom: "5%",
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <TouchableOpacity onPress={this.goback.bind(this)} style={{
                width: 45,

              }}>
                <MaterialIcons name={"arrow-back"} style={{
                  ...GState.defaultIconSize
                }}>
                </MaterialIcons>
              </TouchableOpacity>
              <View style={{
                flex: 1,
              }}>
                <ActivityProfile
                  small
                  Event={this.activity}
                  showPhoto={(url) => BeNavigator.openPhoto(url)}
                  openDetails={this.showDetails.bind(this)}
                ></ActivityProfile>
              </View>
              <View style={{
                maxWidth: 100,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                {this.canShare ? <TouchableOpacity onPress={this.forward} style={{
                  ...rounder(40),
                  justifyContent: 'center',
                }}>
                  <Entypo name={"forward"} style={{
                    ...GState.defaultIconSize,
                    color: ColorList.indicatorColor
                  }}>
                  </Entypo>
                </TouchableOpacity> : null}
                <View style={{
                  marginHorizontal: '4%',
                }}>
                  <BeMenu items={this.items.bind(this)}></BeMenu>
                </View>
              </View>
            </View>
            <View>
              {this.remindTime()}
              {this.remindLocation()}
              {this.remindTitle()}
              {this.remindMedia()}
              {this.remindDescription()}
              {this.remindMembers()}
              <View
                style={{
                  width: "100%",
                  marginTop: "1%",
                  marginBottom: "2%",
                  alignItems: 'center',
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingRight: 5,
                }}
              >
                <View style={{
                  flex: 1,
                }}>
                  {this.remindTimeDetail()}
                </View>
                <View>
                  {!this.remind && this.remindActions()}
                </View>
              </View>
              {this.remindCreator()}
            </View>
          </View>
          <SetAlarmPatternModal
            save={(alarms, date) => this.saveAlarms(alarms, date)}
            alarms={returnCurrentPatterns(this.item)}
            isOpen={this.state.showAlarmsPattern}
            closed={this.hideAlarmsModal.bind(this)}
          ></SetAlarmPatternModal>
          <AddReport
            isOpen={this.state.showAddReportModal}
            report={(report) => {
              this.hideAddReportModal()
              this.markAsDoneWithReport(report);
            }}
            onClosed={this.hideAddReportModal.bind(this)}
          >

          </AddReport>
          <DetailsModal
            data={{ remind_id: this.item_id }}
            isToBeJoint
            event={this.activity}
            isOpen={this.state.showDetailsModal}
            onClosed={this.hideDetailModal.bind(this)}
          >
          </DetailsModal>
          <ShareWithYourContacts
            isOpen={this.state.isSharing}
            activity_id={this.activity_id}
            sender={request.Message().sender}
            committee_id={this.activity_id}
            message={{
              ...messagePreparer.formMessageFromRemind(this.item),
              forwarded: true,
              reply: null,
              from_activity: this.activity,
              from_committee: this.activity,
              from: null,
            }}
            onClosed={this.hideSharing.bind(this)}
          >

          </ShareWithYourContacts>
        </ScrollView>
      );
  }
}
