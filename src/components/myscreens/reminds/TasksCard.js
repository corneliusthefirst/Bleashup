/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import stores from "../../../stores/index";
import moment from "moment";
import { find, isEqual, findIndex, uniqBy, cloneDeep } from "lodash";
import Creator from "./Creator";
import { dateDiff, writeDateTime } from "../../../services/datesWriter";
import {
  getCurrentDateInterval,
  getcurrentDateIntervals,
} from "../../../services/getCurrentDateInterval";
import { format } from "../../../services/recurrenceConfigs";
import { confirmedChecker } from "../../../services/mapper";
import ColorList from "../../colorList";
import MedaiView from "../event/createEvent/components/MediaView";
import { createOpenLink } from "react-native-open-maps";
import CreateButton from "../event/createEvent/components/ActionButton";
import shadower from "../../shadower";
import Swipeout from "../eventChat/Swipeout";
import BeComponent from "../../BeComponent";
import GState from "../../../stores/globalState";
import BePureComponent from "../../BePureComponent";
import TextContent from '../eventChat/TextContent';
import { showHighlightForScrollToIndex } from '../eventChat/highlightServices';
import Texts from '../../../meta/text';
import { loadStates, loadIntervals, calculateCurrentStates, returnRealActualIntervals, returnActualDatesIntervals, returnStoredIntervalsKey } from "./remindsServices";
import { remindTime, remindLocation, remindTitle, remindMedia, remindDescription, remindMembers, remindTimeDetail, remindActons, remindCreator } from './taskCardParts';

let { height, width } = Dimensions.get("window");

export default class EventTasksCard extends BeComponent {
  constructor(props) {
    super(props);
    this.state = {
      newing: false,
      showAll: false,
      correspondingDateInterval: {},
      mounted: false,
      currentDateIntervals: [],
      assignToMe: false,
    };
    this.loadStates = loadStates.bind(this)
    this.loadIntervals = loadIntervals.bind(this)
    this.calculateCurrentStates = calculateCurrentStates.bind(this)
    this.returnRealActualIntervals = returnRealActualIntervals.bind(this)
    this.returnActualDatesIntervals = returnActualDatesIntervals.bind(this)
    this.remindTime = remindTime.bind(this)
    this.remindLocation = remindLocation.bind(this)
    this.remindTitle = remindTitle.bind(this)
    this.remindMedia = remindMedia.bind(this)
    this.remindDescription = remindDescription.bind(this)
    this.remindMembers = remindMembers.bind(this)
    this.remindTimeDetail = remindTimeDetail.bind(this)
    this.remindActions = remindActons.bind(this)
    this.remindCreator = remindCreator.bind(this)
    this.returnStoredIntervalsKey = returnStoredIntervalsKey.bind(this)
    this.correspondingDateInterval = this.returnStoredIntervalsKey("correspondingDateInterval");
    this.currentDateIntervals = this.returnStoredIntervalsKey("currentDateIntervals")
    //console.error(this.correspondingDateInterval)
  }

  componentDidMount() {
    this.mountTimeout = setTimeout(() => {
      const showHighlighted = showHighlightForScrollToIndex.bind(this)
      const isPointed = showHighlighted()
      let isThisProgram =
        isPointed &&
        this.props.type &&
        this.props.currentRemindUser;
      this.loadStates(isThisProgram)
    }, 30 * this.props.delay);
  }
  updateURL(aid,data){
    stores.Reminds.updateURL(aid, data)
    console.warn("remind url updated: ",data)
  }
  onDone() {
    this.props.markAsDone(this.props.item);
  }

  update() {
    this.props.update(this.props.item);
  }
  showReport = this.props.showReport
  showMembers(type){
    this.showActions(this.currentDateIntervals,this.correspondingDateInterval,true)
    setTimeout(() => {
      this.props.showReport && this.props.showReport(null,null,type)
    })
  }

  assignToMe() {
    this.props.assignToMe(this.props.item);
  }
  previousItem = null;
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    this.props.animate();
    let canUpdate = this.props.update_state !== nextProps.update_state || this.state.newing !== nextState.newing
    return (
      canUpdate
    );
  }

  componentDidUpdate(prevProps, prevState) {
    let canReload = (prevProps.members_state !== this.props.members_state) ||
      (prevProps.update_state !== this.props.update_state)
    if (canReload) {
      setTimeout(() => {
        this.loadStates()
      })
    }
  }
  saveAll(alarms) {
    this.props.assignToMe(this.props.item, alarms);
  }
  showActions(
    currentDateIntervals,
    correspondingDateInterval,
    dontShowModal) {
    currentDateIntervals = currentDateIntervals || this.currentDateIntervals,
      correspondingDateInterval = correspondingDateInterval || this.correspondingDateInterval,
      this.props.showRemindActions(
        currentDateIntervals,
        correspondingDateInterval,
        this.props.item.creator,
        this.returnActualDatesIntervals(currentDateIntervals,
          correspondingDateInterval).period,
        dontShowModal
      );
  }
  container = {
    width: "98%",
    flexDirection: "column",
    borderRadius: 5,
    backgroundColor: ColorList.bodyBackground,
    alignSelf: "center",
    margin: "1%",
    padding: "1%",
    ...shadower(1),
  };
  showMedia(url){
    this.props.showMedia(url)
  }
  canLoadFirst(){
    return this.currentDateIntervals  && !this.state.mounted
  }
  render() {
    console.warn("rendering: ", this.props.item.title)
    if(this.canLoadFirst()){
      this.calculateCurrentStates(this.currentDateIntervals,this.correspondingDateInterval)
    }
    return  (
        <Swipeout
          onLongPress={this.showActions.bind(this)}
          disabled={false}
          swipeRight={() => {
            this.props.mention({
              ...this.props.item,
              current_date: this.returnActualDatesIntervals(this.currentDateIntervals,
                this.correspondingDateInterval).period,
            });
          }}
        >
          <View
            onLayout={(e) => this.props.onLayout(e.nativeEvent.layout)}
            style={[
            
              {
                borderRadius:5,
                backgroundColor: this.props.isPointed
                  ? ColorList.remindsTransparent
                  : null,
              },
            ]}
          >
          <View style={this.container}>
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
                  {this.remindActions()}
                </View>
              </View>
              {this.remindCreator()}
            </View>
          </View>
        </Swipeout>
      );
  }
}
