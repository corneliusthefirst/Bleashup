import React, { PureComponent } from "react";
import { View, Dimensions, TouchableOpacity } from "react-native";
import { map } from "lodash";
import Modal from "react-native-modalbox";
import shadower from "../../shadower";
import ConcerneeList from "./ConcerneeList";
import DonnersList from "./DonnersList";
import TabModal from "../../mainComponents/TabModal";
import CreationHeader from "../event/createEvent/components/CreationHeader";
import ColorList from '../../colorList';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import GState from "../../../stores/globalState";
import rounder from "../../../services/rounder";
import replies from '../eventChat/reply_extern';
import { format } from "../../../services/recurrenceConfigs";
import moment from 'moment';
import Spinner from "../../Spinner";
import MessageActions from "../eventChat/MessageActons";
import Texts from '../../../meta/text';
const screenheight = Math.round(Dimensions.get("window").height);
export default class ReportTabModal extends TabModal {
  initialize() {
    this.state = {
      content: null,
      complexReport: false,
      mounted: false,
    };
  }
  swipeToClose = false
  onClosedModal() {
    this.props.onClosed();
    this.setStatePure({
      content: null,
      mounted: false
    });
  }
  backdropPressToClose = false
  shouldComponentUpdate(prevprops, prevState) {
    return (prevState.mounted !== this.state.mounted ||
      this.props.isOpen !== prevprops.isOpen)
      ? true : false
  }
  onOpenModal() {
    setTimeout(() => {
      this.setStatePure({
        //content: this.props.content,
        mounted: true,
      });
      //this.props.stopLoader();
    });
  }
  mountedComponent() {
    this.isRoute && this.onOpenModal()
  }
  goback() {
    this.isRoute ? this.props.navigation.goBack() : this.onClosedModal()
  }
  mapInitialRoute(type) {
    switch (type) {
      case replies.done:
        return "Donners"
      case replies.confirmed:
        return "Confirmed"
      default:
        return "Members"
    }
  }
  isRoute = this.props.navigation && true
  getParam = (param) => this.props.navigation && this.props.navigation.getParam(param)
  type = this.getParam("type") || this.props.type
  refresh= this.getParam("refresh") || this.props.refresh
  remind_id = this.getParam("remind_id") || this.props.remind_id
  activity_id = this.getParam("activity_id") || this.props.activity_id
  actualInterval = this.getParam("actualInterval") || this.props.actualInterval
  intervals = this.getParam("intervals") || this.props.intervals
  currentRemindUser = this.getParam("currentRemindUser") || this.props.currentRemindUser
  master = this.getParam("master") || this.props.master
  confirm = this.getParam("confirm") || this.props.confirm
  editReport = this.getParam("editReport") || this.props.editReport
  reply = this.getParam("reply") || this.props.reply
  program_name = this.getParam('program_name') || this.props.program_name
  shareReport = this.getParam("shareReport") || this.props.shareReport
  addMembers = this.getParam("addMembers") || this.props.addMembers
  removeMember = this.getParam("removeMember") || this.props.removeMember
  getMembers = this.getParam("getMembers") || this.props.getMembers
  isRelation = this.getParam("isRelation") || this.props.isRelation
  replyPrivate = this.getParam("replyPrivate") || this.props.replyPrivate
  confirmed = this.getParam("confirmed") || this.props.confirmed
  must_report = this.getParam("must_report") || this.props.must_report
  concernees = this.getParam("concernees") || this.props.concernees
  donners = this.getParam("donners") || this.props.donners
  inialPage = this.mapInitialRoute(this.type)


  tabs = {
    Members: {
      navigationOptions: {
        gesturesEnabled: false,
        swipeEnabled: false,
        tabBarIcon: ({ tintColor, focused }) =>
          <Ionicons
            style={{ ...GState.defaultIconSize }}
            name={"ios-people"}
            type="Ionicons"
          />
      },
      screen: () => (
        this.state.mounted ? <View style={{ height: "100%" }}>
          <ConcerneeList
            master={this.master}
            getMembers={this.getMembers}
            removeMember={this.removeMember}
            addMembers={this.addMembers}
            replyPrivate={this.replyPrivate.bind(this)}
            isRelation={this.isRelation}
            initDate={this.actualInterval ? this.actualInterval.start : moment().format(format)}
            reply={this.reply}
            type={replies.member}
            currentRemindUser={this.currentRemindUser}
            contacts={this.concernees}
            complexReport={false}
            must_report={this.must_report}
            actualInterval={this.actualInterval}
          ></ConcerneeList>
        </View> : <Spinner></Spinner>
      ),
    },
    Donners: {
      navigationOptions: {
        gesturesEnabled: false,
        swipeEnabled: false,
        tabBarIcon: ({ tintColor, focused }) => <Ionicons name={"md-checkmark"} type={"Ionicons"} style={{
          ...GState.defaultIconSize,
          color: ColorList.indicatorColor
        }} />,
        tabBarColor: ColorList.indicatorColor,
      },
      screen: () => (
        this.state.mounted ? <View style={{ height: "100%" }}>
          <DonnersList
            refresh={this.refresh}
            shareReport={this.shareReport}
            editReport={this.editReport}
            replyPrivate={this.replyPrivate.bind(this)}
            isRelation={this.isRelation}
            program_name={this.program_name}
            currentRemindUser={this.currentRemindUser}
            type={replies.done}
            reply={this.reply}
            activity_id={this.activity_id}
            remind_id={this.remind_id}
            intervals={this.intervals}
            donners={this.donners}
            confirmed={this.confirmed}
            master={this.master}
            actualInterval={this.actualInterval}
            confirm={this.confirm}
            must_report={this.must_report}
          ></DonnersList>
        </View> : <Spinner></Spinner>
      ),
    },
    Confirmed: {
      navigationOptions: {
        swipeEnabled: false,
        gesturesEnabled: false,
        tabBarIcon: ({ tintColor, focused }) => <MaterialIconCommunity name="check-all" style={{
          ...GState.defaultIconSize,
          color: ColorList.likeActive
        }} />,
        tabBarColor: ColorList.likeActive,
      },
      screen: () => (
        this.state.mounted ? <View style={{ height: "100%" }}>
          <DonnersList
            shareReport={this.shareReport}
            refresh={this.refresh}
            editReport={this.editReport}
            activity_id={this.activity_id}
            remind_id={this.remind_id}
            replyPrivate={this.replyPrivate.bind(this)}
            isRelation={this.isRelation}
            currentRemindUser={this.currentRemindUser}
            type={replies.confirmed}
            program_name={this.program_name}
            reply={this.reply}
            cannotReport
            intervals={this.intervals}
            master={this.master}
            donners={this.confirmed}
            must_report={this.must_report}
            actualInterval={this.actualInterval}
          ></DonnersList>
        </View> : <Spinner></Spinner>
      ),
    },
    Back: {
      navigationOptions: {
        tabBarIcon: () => <TouchableOpacity
          style={{
            ...rounder(40, ColorList.bodyDarkWhite)
          }}>
          <MaterialIcons
            name="close"
            style={{ ...GState.defaultIconSize, color: ColorList.headerIcon }}
          /></TouchableOpacity>,
      },
      screen: () => {
        this.goback()
        return <View></View>
      }
    },
  };
  render() {
    return this.isRoute ? this.modalBody() : this.modal()
  }
}
