import React, { PureComponent } from "react";
import { View, Dimensions,TouchableOpacity} from "react-native";
import { map } from "lodash";
import Modal from "react-native-modalbox";
import shadower from "../../shadower";
import ConcerneeList from "./ConcerneeList";
import DonnersList from "./DonnersList";
import TabModal from "../../mainComponents/TabModal";
import CreationHeader from "../event/createEvent/components/CreationHeader";
import ColorList from '../../colorList';
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import Ionicons  from 'react-native-vector-icons/Ionicons';
import MaterialIconCommunity  from 'react-native-vector-icons/MaterialCommunityIcons';
import GState from "../../../stores/globalState";
import rounder from "../../../services/rounder";
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
    this.setState({
      content: null,
    });
  }
  shouldComponentUpdate(prevprops, prevState) {
    return (prevState.mounted !== this.state.mounted ||
      this.props.isOpen !== prevprops.isOpen ||
      (this.props.concernees && 
        prevprops.concernees &&
         this.props.concernees.length !== prevprops.concernees.length))
         ?true:false
  }
  onOpenModal() {
    /*setTimeout(() => {
      this.setState({
        content: this.props.content,
        mounted: true,
      });
      this.props.stopLoader();
    }, 20);*/
  }
  inialPage="Members"
  tabs = {
    Members: {
      navigationOptions:{
        tabBarIcon: ({ tintColor, focused }) => 
        <Ionicons 
        style={{ ...GState.defaultIconSize }} 
        name={"ios-people"} 
        type="Ionicons" />
      },
      screen: () => (
        <View style={{ height: "100%" }}>
            <ConcerneeList
              contacts={this.props.concernees}
              complexReport={false}
              must_report={this.props.must_report}
              actualInterval={this.props.actualInterval}
            ></ConcerneeList>
        </View>
      ),
    },
    Donners: {
      navigationOptions:{
        tabBarIcon: ({ tintColor, focused }) => <Ionicons name={"md-checkmark"} type={"Ionicons"} style={{
          ...GState.defaultIconSize,
          color: ColorList.indicatorColor
        }} />,
        tabBarColor: ColorList.indicatorColor,
      },
      screen: () => (
        <View style={{ height: "100%" }}>
          <DonnersList
            intervals={this.props.intervals}
            donners={this.props.donners}
            master={this.props.master}
            actualInterval={this.props.actualInterval}
            confirm={this.props.confirm}
            must_report={this.props.must_report}
          ></DonnersList>
        </View>
      ),
    },
    Confirmed: {
      navigationOptions:{
        tabBarIcon: ({ tintColor, focused }) => <MaterialIconCommunity name="check-all" style={{
          ...GState.defaultIconSize,
          color: ColorList.likeActive
        }} />,
        tabBarColor: ColorList.likeActive,
      },
      screen: () => (
        <View style={{ height: "100%" }}>
          <DonnersList
            cannotReport
            intervals={this.props.intervals}
            master={this.props.master}
            donners={this.props.confirmed}
            must_report={this.props.must_report}
            actualInterval={this.props.actualInterval}
          ></DonnersList>
        </View>
      ),
    },
    Back: {
      navigationOptions: {
        tabBarIcon: () => <TouchableOpacity 
        style={{
          ...rounder(40,ColorList.bodyDarkWhite)}}>
          <MaterialIcons
            name="close"
            style={{ ...GState.defaultIconSize, color: ColorList.headerIcon }}
          /></TouchableOpacity>,
      },
      screen: () => {
        this.onClosedModal()
       return <View></View>
      }
    },
  };
}
