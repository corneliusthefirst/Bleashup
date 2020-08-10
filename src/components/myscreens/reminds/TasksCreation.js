import React, { Component } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { filter, find, findIndex, concat, uniqBy, uniq, isEmpty } from "lodash";
import request from "../../../services/requestObjects";
import stores from "../../../stores/index";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-material-dropdown";
import moment from "moment";
import SelectableContactList from "../../SelectableContactList";
import NumericInput from "react-native-numeric-input";
import Modal from "react-native-modalbox";
import emitter from "../../../services/eventEmiter";
import {
  frequencyType,
  FrequencyReverser,
  nameToDataMapper,
  daysOfWeeksDefault,
  formWeekIntervals,
  format,
} from "../../../services/recurrenceConfigs";
import SelectDays from "../event/SelectDaysModal";
import {
  getMonthDay,
  getDayMonth,
  getDay,
} from "../../../services/datesWriter";
import ColorList from "../../colorList";
import BleashupModal from "../../mainComponents/BleashupModal";
import CreationHeader from "../event/createEvent/components/CreationHeader";
import CreateButton from "../event/createEvent/components/ActionButton";
import CreateTextInput from "../event/createEvent/components/CreateTextInput";
import RemindMembers from "./RemindMembers";
import RemindsTypeMenu from "./RemindTypeMenu";
import PickersUpload from "../event/createEvent/components/PickerUpload";
import MediaPreviewer from "../event/createEvent/components/MediaPeviewer";
import rounder from "../../../services/rounder";
import Toaster from "../../../services/Toaster";
import Ionicons from 'react-native-vector-icons/Ionicons';
import GState from "../../../stores/globalState";
import  MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons  from 'react-native-vector-icons/EvilIcons';

let { height, width } = Dimensions.get("window");

export default class TasksCreation extends BleashupModal {
  initialize() {
    this.state = {
      show: false,
      title: "",
      description: "",
      currentRemind: request.Remind(),
      //currentParticipant:null,
      date: "",
      mounted: this.props.isOpen,
      time: "",
      newing: false,
      defaultDate: new Date(),
      defaultTime: new Date(),
      inputTimeValue: "",
      inputDateValue: "",
      isDateTimePickerVisible: false,
      selectMemberState: false,
      members: [],
      currentMembers: [],
      //recurrence:""
    };
  }
  onClosedModal() {
    this.props.onClosed();
  }
  calculateType(remind) {
    return remind.location ||
      (remind.remind_url && remind.remind_url.photo) ||
      remind.description ||
      (remind.remind_url && remind.remind_url.video)
      ? "event"
      : "reminder";
  }
  unmountingComponent(){
    clearTimeout(this.initTimeout)
  }
  init() {
    this.props.remind && typeof this.props.remind !== "string"
      ? this.initTimeout = setTimeout(() => {
        let remind = this.props.remind;
        this.setStatePure({
          currentRemind: remind,
          mounted: true,
          type: this.calculateType(remind),
          recurrent:
            remind.recursive_frequency.interval !== 1 &&
            remind.recursive_frequency.frequency !== "yearly",
          members: this.props.event.participant,
          ownership:
            remind.creator === stores.LoginStore.user.phone &&
            this.props.update,
          currentMembers: remind && remind.members ? remind.members : [],
          date:
            remind && remind.period
              ? moment(remind.period).format()
              : moment().format(),
          /*title:
            remind && remind.period
              ? moment(remind.period).format()
              : moment().format(),*/
        });
      })
      : stores.Reminds.loadRemind(
        this.props.event_id,
        this.props.remind_id ? this.props.remind_id : request.Remind().id
      ).then((rem) => {
        rem = isEmpty(rem) ? request.Remind() : rem
        let remind = this.props.starRemind || rem;
        this.setStatePure({
          currentRemind: remind,
          mounted: true,
          type: this.calculateType(remind),
          recurrent:
            remind &&
            !(
              remind.recursive_frequency.interval === 1 &&
              remind.recursive_frequency.frequency === "yearly"
            ),
          members: this.props.event.participant,
          ownership:
            remind.creator === stores.LoginStore.user.phone &&
            (this.props.update || remind.id === request.Remind().id),
          currentMembers:
            this.props.currentMembers && this.props.currentMembers.length > 0
              ? this.props.currentMembers
              : rem && rem.members
                ? rem.members
                : [],
          date:
            remind && remind.period
              ? remind.period
              : moment().format(),
          /*title:
            remind && remind.period
              ? moment(remind.period).format()
              : moment().format(),*/
        });
      });
  }

  getCode(day) {
    !find(find(daysOfWeeksDefault, { day: day }))
      ? console.error(this.state.currentRemind.period)
      : null;
    return find(daysOfWeeksDefault, { day: day }).code;
  }
  computeDaysOfWeek(data) {
    let newDate =
      data && data.length > 0
        ? moment(
          formWeekIntervals(
            data,
            {
              start: moment(this.state.date).format(format),
              end: moment(
                this.state.currentRemind.recursive_frequency.recurrence
              ).format(format),
            },
            moment(this.state.currentRemind.period).format(format)
          )[0].end,
          format
        ).format()
        : this.state.currentRemind.period;
    let NewRemind = {
      remind_id: this.state.currentRemind.id,
      recursive_frequency: {
        ...this.state.currentRemind.recursive_frequency,
        days_of_week: data && data.length > 0 ?
          data : [daysOfWeeksDefault.find(ele => ele.day ===
            moment(this.state.date).format(format).split(",")[0]).code],
      },
      period: newDate,
    };
    if (!this.props.update) {
      stores.Reminds.updateRecursiveFrequency(
        this.props.event_id,
        NewRemind,
        false
      ).then((newRemind) => {
        if (this.state.currentRemind.period !== NewRemind.period) {
          stores.Reminds.updatePeriod(
            this.props.event_id,
            NewRemind,
            false
          ).then((newRem) => {
            this.setStatePure({ currentRemind: newRem, date: NewRemind.period, newing: !this.state.newing });
          });
        } else {
          this.setStatePure({
            currentRemind: newRemind,
            newing: !this.state.newing,
            date: NewRemind.period,
          });
        }
      });
    } else {
      this.setStatePure({
        currentRemind: {
          ...this.state.currentRemind,
          recursive_frequency: NewRemind.recursive_frequency,
          period: NewRemind.period,
        },
        date: NewRemind.period,
      });
    }
  }
  componentDidMount() {
    this.init();
  }
  show(mode) {
    this.setStatePure({
      show: true,
      mode,
    });
  }

  timepicker() {
    this.show("time");
  }

  //for date
  showDateTimePicker() {
    this.setStatePure({ isDateTimePickerVisible: true });
  }

  handleDatePicked(event, date) {
    if (date !== undefined) {
      let newDate = moment(date).format().split("T")[0];
      let currentTime = this.state.date
        ? moment(this.state.date).format().split("T")[1]
        : moment()
          .startOf("day")
          .add(moment.duration(1, "hours"))
          .toISOString()
          .split("T")[1];
      let dateTime = newDate + "T" + currentTime;
      //deactivate the date picker before setting the obtain time
      this.setStatePure({
        date: dateTime,
        isDateTimePickerVisible: false,
        show: true,
      });
      this.props.update
        ? null
        : stores.Reminds.updatePeriod(
          this.props.event_id,
          { remind_id: "newRemindId", period: dateTime },
          false
        ).then(() => { });
    } else {
      this.setStatePure({
        isDateTimePickerVisible: false,
      });
    }
  }

  setTime(event, date) {
    if (date !== undefined) {
      let time = moment(date).format().split("T")[1];
      let newDate = this.state.date
        ? moment(this.state.date).format().split("T")[0]
        : moment().format().split("T")[0];
      let dateTime = newDate + "T" + time;
      this.setStatePure({ show: false, date: dateTime });
      this.props.update
        ? null
        : stores.Reminds.updatePeriod(
          this.props.event_id,
          { remind_id: "newRemindId", period: dateTime },
          false
        ).then(() => { });
    } else {
      this.setStatePure({
        show: false,
      });
    }
  }

  onChangedTitle(value) {
    this.state.currentRemind.title = value;
    this.setStatePure({
      currentRemind: { ...this.state.currentRemind, title: value },
    });
    let NewRemind = { remind_id: this.state.currentRemind.id, title: value };
    if (!this.props.update) {
      stores.Reminds.updateTitle(
        this.props.event_id,
        NewRemind,
        false
      ).then(() => { });
    }
  }

  onChangedDescription(value) {
    this.setStatePure({
      currentRemind: { ...this.state.currentRemind, description: value },
    });
    let NewRemind = {
      remind_id: this.state.currentRemind.id,
      description: value,
    };
    if (!this.props.update) {
      stores.Reminds.updateDescription(
        this.props.event_id,
        NewRemind,
        false
      ).then(() => { });
    }
  }

  onChangedStatus(status) {
    let newstatus = status;
    this.setStatePure({
      currentRemind: { ...this.state.currentRemind, status: newstatus },
    });
    let NewRemind = {
      remind_id: this.state.currentRemind.id,
      status: newstatus,
    };
    if (!this.props.update) {
      stores.Reminds.updateStatus(
        this.props.event_id,
        NewRemind,
        false
      ).then(() => { });
    }
  }

  onClickMembers() {
    this.setStatePure({ selectMemberState: true });
  }

  back() {
    //this.setStatePure({
    //  isExtra:false
    // })
    this.props.onClosed();
  }
  setRecursiveFrequency(value) {
    let NewRemind = {
      remind_id: this.state.currentRemind.id,
      recursive_frequency: {
        ...this.state.currentRemind.recursive_frequency,
        frequency: nameToDataMapper[value],
      },
    };
    if (!this.props.update) {
      stores.Reminds.updateRecursiveFrequency(
        this.props.event_id,
        NewRemind,
        false
      ).then((newRemind) => {
        this.setStatePure({ currentRemind: newRemind, newing: !this.state.newing });
      });
    } else {
      this.setStatePure({
        newing: !this.state.newing,
        currentRemind: {
          ...this.state.currentRemind,
          recursive_frequency: NewRemind.recursive_frequency,
        },
      });
    }
  }

  resetRemind() {
    this.setStatePure({
      currentRemind: request.Remind(),
    });
  }
  setInterval(value) {
     this.setStatePure({
        currentRemind: {
          ...this.state.currentRemind,
          recursive_frequency: {
            ...this.state.currentRemind.recursive_frequency,
            interval: value,
          },
        },
      });
  }
  updateRequestReportOnComplete() {
    !this.props.update
      ? stores.Reminds.updateRequestReportOnComplete(this.props.event_id, {
        must_report: this.state.currentRemind.must_report
          ? !this.state.currentRemind.must_report
          : true,
        remind_id: this.state.currentRemind.id,
      }).then(() => {
        this.setStatePure({
          currentRemind: {
            ...this.state.currentRemind,
            must_report: this.state.currentRemind.must_report ? false : true,
          },
        });
      })
      : this.setStatePure({
        currentRemind: {
          ...this.state.currentRemind,
          must_report: this.state.currentRemind.must_report
            ? !this.state.currentRemind.must_report
            : true,
        },
      });
  }
  componentDidUpdate(prevProp, prevState) {
    let data = this.state.currentRemind.recursive_frequency.days_of_week &&
      this.state.currentRemind.recursive_frequency.frequency === "weekly"
      ? this.state.currentRemind.recursive_frequency.days_of_week
      : [this.getCode(getDay(moment(this.state.currentRemind.period)))];
    if (this.props.currentMembers !== prevProp.currentMembers) {
      this.init();
    }
    if (this.props.remind !== prevProp.remind) {
      this.init()
    }
    if (this.props.remind_id !== prevProp.remind_id) {
      this.init();
    } else if (
      this.state.currentRemind.recursive_frequency.frequency === "weekly" &&
      this.state.currentRemind.recursive_frequency.frequency !==
      prevState.currentRemind.recursive_frequency.frequency
    ) {
      this.computeDaysOfWeek(data);
    } else if (
      this.state.currentRemind.recursive_frequency.frequency !==
      prevState.currentRemind.recursive_frequency.frequency
    ) {
      this.computeDaysOfWeek(null);
    } else if (
      this.state.currentRemind.period !== prevState.currentRemind.period
    ) {
      this.computeDaysOfWeek(data);
    }
    if (this.state.currentRemind.recursive_frequency.interval !== 
      prevState.currentRemind.recursive_frequency.interval && 
      !this.props.update) {
      stores.Reminds.updateRecursiveFrequency(this.props.event_id, {
        recursive_frequency: {
          ...this.state.currentRemind.recursive_frequency,
          //interval: ,
        },
        remind_id: this.state.currentRemind.id,
      })
    }
  }

  addNewRemind() {
    if (!this.props.working) {
      this.props.CreateRemind(
        {
          ...this.state.currentRemind, members: this.state.currentMembers,
          created_at: moment().format(), event_id: this.props.event_id,
          recursive_frequency:
          {
            ...this.state.currentRemind.recursive_frequency,
            recurrence: this.state.currentRemind
              .recursive_frequency.recurrence
              ? this.state.currentRemind.recursive_frequency.recurrence
              : moment(this.state.date).add(1, "h").format()
          },
          creator: stores.LoginStore.user.phone,
          period: this.state.date,
          donners: []
        },
        this.props.event.about.title
      )
    } else {
      Toaster({ text: "App is Busy" });
    }
  }

  updateRemind() {
    let rem = this.state.currentRemind;
    rem.period = this.state.date;
    this.props.updateRemind({
      ...rem,
      recursive_frequency: {
        ...rem.recursive_frequency,
        recurrence: moment(rem.period).format("x") >= 
        moment(rem.recursive_frequency.recurrence).format("x") ? 
        moment(rem.period).add(1, "h").format() : rem.recursive_frequency.recurrence
      }
    });

    //this.resetRemind();
  }

  takecheckedResult(result) {
    this.setStatePure({ currentMembers: uniqBy(result, "phone") });
    !this.props.update &&
      stores.Reminds.updateMembers(this.props.event_id, {
        remind_id: this.state.currentRemind.id,
        members: result,
      }).then(() => { });
  }

  showEndatePiker() {
    this.setStatePure({
      showEndatePiker: true,
      mode: "date",
      display: "calendar",
    });
  }
  changeEndDate(e, date) {
    if (date === undefined) {
      this.setStatePure({
        showEndatePiker: false,
      });
    } else {
      let newDate = moment(date).format().split("T")[0];
      let newTime = this.state.date
        ? moment(this.state.date).format().split("T")[1]
        : moment()
          .startOf("day")
          .add(moment.duration(1, "hours"))
          .toISOString()
          .split("T")[1];
      let dateTime = newDate + "T" + newTime;
      !this.props.update
        ? stores.Reminds.updateRecursiveFrequency(this.props.event_id, {
          recursive_frequency: {
            ...this.state.currentRemind.recursive_frequency,
            recurrence: dateTime,
          },
          remind_id: this.state.currentRemind.id,
        }).then((newRemind) => {
          this.setStatePure({
            showEndatePiker: false,
            currentRemind: newRemind,
          });
        })
        : this.setStatePure({
          showEndatePiker: false,
          currentRemind: {
            ...this.state.currentRemind,
            recursive_frequency: {
              ...this.state.currentRemind.recursive_frequency,
              recurrence: dateTime,
            },
          },
        });
    }
  }
  setCurrentLocation(value) {
    this.setStatePure({
      currentRemind: { ...this.state.currentRemind, location: value },
    });
    !this.props.update &&
      stores.Reminds.updateLocation(this.props.event_id, {
        remind_id: this.state.currentRemind.id,
        location: value,
      }).then(() => { });
  }
  saveURL(url) {
    this.setStatePure({
      currentRemind: {
        ...this.state.currentRemind,
        remind_url: url || request.Remind().remind_url,
      },
    });
    !this.props.update &&
      stores.Reminds.updateURL(this.props.event_id, {
        remind_id: this.state.currentRemind.id,
        url: url || request.Remind().remind_url,
      }).then(() => { });
  }
  computeMax(remind) {
    switch (
    remind.recursive_frequency.frequency &&
    remind.recursive_frequency.frequency.toLowerCase()
    ) {
      case "daily":
        return 365;
      case "weekly":
        return 63;
      case "monthly":
        return 12;
      case "yearly":
        return 2;
      default:
        return "";
    }
  }
  setRecurrencyState() {
    this.setStatePure({
      recurrent: !this.state.recurrent,
    });
  }
  isEvent() {
    return (
      this.calculateType(this.state.currentRemind) &&
      this.state.type === "event"
    );
  }
  propceed() {
    if (!this.state.date || !this.state.currentRemind.title) {
      //this.props.onClosed();
      Toaster({
        text: "Remind Must Have Atleat a Title and Data/Time",
        buttonText: "Okay",
        duration: 6000,
        buttonTextStyle: { color: "#008000" },
        buttonStyle: { backgroundColor: "#5cb85c" },
        textStyle: { fontSize: 15 },
      });
    } else {
      if (this.props.update) {
        this.updateRemind()
      } else {
        this.addNewRemind()
      }
    }
  }
  goback(){
    this.props.onClosed(this.props.currentMembers||this.props.starRemind)
  }
  swipeToClose = false;
  modalBody() {
    let defaultDate = parseInt(
      moment(this.state.currentRemind.period).format("x")
    );
    console.warn(this.state.currentRemind.recursive_frequency.interval,moment().format(format))
    return !this.state.mounted ? null : (
      <ScrollView
        keyboardShouldPersistTaps={"handled"}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, justifyContent: "flex-end"}}>
          <CreationHeader
            back={this.goback.bind(this)}
            title={
              !this.state.ownership
                ? "Remind configs"
                : this.props.update
                  ? "Update Remind"
                  : "Add Remind"
            }
            extra={
              this.state.ownership ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    marginBottom: "auto",
                    marginTop: "auto",
                  }}
                >
                  {!this.props.update ? <View>
                    <TouchableOpacity
                      onPress={() =>
                        requestAnimationFrame(() =>
                          this.setStatePure({ selectMemberState: true })
                        )
                      }
                      style={{ flexDirection: "row" }}
                    >
                      <Ionicons
                        name="ios-people"
                        type="Ionicons"
                        style={{...GState.defaultIconSize, color: ColorList.likeActive }}
                      />
                      <Text
                        style={{
                          ...GState.defaultTextStyle,
                          fontWeight: "bold",
                          marginBottom: "auto",
                          marginTop: "auto",
                          color: ColorList.likeActive,
                        }}
                      >{` (${this.state.currentMembers.length})`}</Text>
                    </TouchableOpacity>
                  </View> : null}
                  <View>
                    <RemindsTypeMenu
                      type={this.isEvent() ? "Event" : "Reminder"}
                      reminder={() => {
                        this.setStatePure({
                          type: "reminder",
                        });
                      }}
                      event={() => {
                        this.setStatePure({
                          type: "event",
                        });
                      }}
                    />
                  </View>
                </View>
              ) :
                this.props.shouldRestore && this.props.canRestore && false ? (
                  <View style={{ width: "60%", alignSelf: "flex-end", margin: '1%', height: 30, marginBottom: 'auto', marginTop: 'auto', }}>
                    <CreateButton
                      style={{
                        height: '100%'
                      }}
                      action={() => {
                        this.props.onClosed();
                        this.props.restore(this.props.remind);
                      }}
                      rounded
                      title="Restore"
                    />
                  </View>
                ) : null

            }
          />

          <View style={{ marginTop: 20 }}>
            <ScrollView
              keyboardShouldPersistTaps={"handled"}
              ref={"scrollView"}
              showsVerticalScrollIndicator={false}
            >
              <View
                pointerEvents={this.state.ownership ? null : "none"}
                style={{ height: height / 12, alignItems: "center" }}
              >
                <View style={{ width: "90%", alignSelf: "center" }}>
                  <CreateTextInput
                    height={50}
                    value={this.state.currentRemind.title}
                    placeholder={this.isEvent()?"Your event title":"Your remind message"}
                    onChange={this.onChangedTitle.bind(this)}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    height: 30,
                    width: "90%",
                    alignSelf: "center",
                    marginTop: 20,
                  }}
                >
                  <View
                    pointerEvents={this.state.ownership ? null : "none"}
                    style={{ width: "12%" }}
                  >
                    <TouchableOpacity
                      style={{ marginBottom: "auto", marginTop: "auto" }}
                      onPress={() =>
                        requestAnimationFrame(this.showDateTimePicker)
                      }
                    >
                      <MaterialIcons
                        active
                        type="MaterialIcons"
                        name="date-range"
                        style={{...GState.defaultIconSize, color: "#1FABAB" }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View pointerEvents={this.state.ownership ? null : "none"}>
                    <TouchableOpacity
                      style={{ marginTop: "auto", marginBottom: "auto" }}
                      onPress={() =>
                        requestAnimationFrame(this.showDateTimePicker)
                      }
                    >
                      <Text style={{...GState.defaultTextStyle, color: ColorList.bodyText }}>
                        {this.state.date
                          ? `${moment(this.state.date).format(
                            "dddd, MMMM Do YYYY"
                          )} at ${moment(this.state.date).format("hh:mm a")}`
                          : "set remind date"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {this.state.isDateTimePickerVisible && (
                    <DateTimePicker
                      mode="date"
                      value={defaultDate}
                      onChange={this.handleDatePicked.bind(this)}
                    />
                  )}
                  {this.state.show && (
                    <DateTimePicker
                      mode="time"
                      value={defaultDate}
                      display="default"
                      onChange={this.setTime.bind(this)}
                    />
                  )}
                </View>
                <View
                  pointerEvents={this.state.ownership ? null : "none"}
                  style={{ width: "90%", alignSelf: "center", height: 50 }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      marginTop: 20,
                    }}
                    onPress={() =>
                      requestAnimationFrame(() => this.setRecurrencyState())
                    }
                  >
                    <EvilIcons
                      style={{...GState.defaultIconSize, width: "15%", color: ColorList.bodyIcon }}
                      name={this.state.recurrent ? "arrow-up" : "arrow-down"}
                      type={"EvilIcons"}
                    />
                    <Text style={{...GState.defaultTextStyle, fontWeight: "bold" }}>{"Repeat"}</Text>
                  </TouchableOpacity>
                </View>
                {this.state.recurrent ? (
                  <View style={{ marginLeft: "4%" }}>
                    <View
                      style={{
                        width: "95%",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        
                      }}
                    >
                      <View>
                        <View
                          style={{
                            width: "100%",
                            marginLeft: "3%",
                            padding: "1%",
                          }}
                        >
                          <View style={{ flexDirection: "column" }}>
                            <View
                              style={{ marginLeft: "1%", flexDirection: "row" }}
                            >
                              <Text
                                style={{...GState.defaultTextStyle, fontStyle: "italic", marginTop: 3 }}
                              >
                                Every{" "}
                              </Text>
                              <View
                                pointerEvents={
                                  this.state.ownership ? null : "none"
                                }
                              >
                                <NumericInput
                                  value={
                                    this.state.currentRemind.recursive_frequency
                                      .interval
                                      ? this.state.currentRemind
                                        .recursive_frequency.interval
                                      : 0
                                  }
                                  onChange={(value) => this.setInterval(value)}
                                  totalWidth={70}
                                  rounded
                                  borderColor={"#FEFFDE"}
                                  maxValue={this.computeMax(
                                    this.state.currentRemind
                                  )}
                                  initValue={
                                    this.state.currentRemind.recursive_frequency
                                      .interval
                                      ? this.state.currentRemind
                                        .recursive_frequency.interval
                                      : 1
                                  }
                                  reachMaxIncIconStyle={{ color: "red" }}
                                  reachMinDecIconStyle={{ color: "red" }}
                                  minValue={1}
                                  sepratorWidth={0}
                                  iconStyle={{ color: "#FEFFDE" }}
                                  rightButtonBackgroundColor="#1FABAB"
                                  leftButtonBackgroundColor="#1FABAB"
                                  totalHeight={30}
                                />
                              </View>
                              <View
                                pointerEvents={
                                  this.state.ownership ? null : "none"
                                }
                                style={{
                                  width: "30%",
                                  marginTop: "-6%",
                                  margin: "2%",
                                }}
                              >
                                <Dropdown
                                  data={frequencyType}
                                  baseColor={"#1FABAB"}
                                  selectedItemColor={"#1FABAB"}
                                  value={
                                    this.state.currentRemind.recursive_frequency
                                      .frequency
                                      ? FrequencyReverser[
                                      this.state.currentRemind
                                        .recursive_frequency.frequency
                                      ]
                                      : "none"
                                  }
                                  onChangeText={this.setRecursiveFrequency.bind(this)}
                                  pickerStyle={{
                                    width: "35%",
                                    margin: "1%",
                                    borderRadius: 5,
                                    borderWidth: 0.2,
                                    borderColor: "#1FABAB",
                                  }}
                                  containerStyle={{
                                    borderWidth: 0,
                                    borderColor: "gray",
                                    borderRadius: 6,
                                    justifyContent: "center",
                                    padding: "2%",
                                    height: 43,
                                  }}
                                />
                              </View>
                              {this.state.currentRemind.recursive_frequency
                                .frequency === "weekly" ? (
                                  <TouchableOpacity
                                    onPress={() =>
                                      requestAnimationFrame(() => {
                                        this.setStatePure({
                                          isSelectDaysModalOpened: true,
                                        });
                                      })
                                    }
                                  >
                                    <Text style={{...GState.defaultTextStyle}}>
                                      {this.state.ownership
                                        ? "select days"
                                        : "view days"}
                                    </Text>
                                  </TouchableOpacity>
                                ) : this.state.currentRemind.recursive_frequency
                                  .frequency === "monthly" ? (
                                    <View
                                      pointerEvents={
                                        this.state.ownership ? null : "none"
                                      }
                                    >
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.showDateTimePicker();
                                        }}
                                      >
                                        <Text style={{...GState.defaultTextStyle}}>{` on the ${getDayMonth(
                                          this.state.date
                                        )}`}</Text>
                                      </TouchableOpacity>
                                    </View>
                                  ) : this.state.currentRemind.recursive_frequency
                                    .frequency === "yearly" ? (
                                      <View
                                        pointerEvents={
                                          this.state.ownership ? null : "none"
                                        }
                                      >
                                        <TouchableOpacity
                                          onPress={() => {
                                            this.showDateTimePicker();
                                          }}
                                        >
                                          <Text style={{ ...GState.defaultTextStyle }}>{`on ${getMonthDay(
                                            this.state.date
                                          )}`}</Text>
                                        </TouchableOpacity>
                                      </View>
                                    ) : (
                                      <Text style={{...GState.defaultTextStyle}}>
                                        {this.state.currentRemind.recursive_frequency
                                          .interval === 1
                                          ? "(all days)"
                                          : `(${this.state.currentRemind.recursive_frequency.interval} days)`}
                                      </Text>
                                    )}
                            </View>
                          </View>
                        </View>
                        <View
                          pointerEvents={this.state.ownership ? null : "none"}
                          style={{ marginLeft: "4%" }}
                        >
                          <Text style={{...GState.defaultTextStyle, fontWeight:"bold",color:ColorList.bodyText }}>End Date:</Text>
                          <TouchableOpacity
                            pointerEvents={this.state.ownership ? null : "none"}
                            style={{ width: "90%" }}
                            onPress={() => this.showEndatePiker()}
                            transparent
                          >
                            <Text style={{ ...GState.defaultTextStyle }}>
                              {this.state.date &&
                                this.state.currentRemind.recursive_frequency
                                  .recurrence
                                ? `On ${moment(
                                  this.state.currentRemind.recursive_frequency
                                    .recurrence
                                ).format("dddd, MMMM Do YYYY")}`
                                : "Select Recurrence Stop Date"}
                            </Text>
                          </TouchableOpacity>
                          {this.state.showEndatePiker ? (
                            <DateTimePicker
                              value={
                                this.state.currentRemind.recursive_frequency
                                  .recurrence
                                  ? parseInt(
                                    moment(
                                      this.state.currentRemind
                                        .recursive_frequency.recurrence
                                    ).format("x")
                                  )
                                  : new Date()
                              }
                              display={this.state.display}
                              mode={this.state.mode}
                              onChange={(e, date) =>
                                this.changeEndDate(e, date)
                              }
                            />
                          ) : null}
                        </View>
                      </View>
                    </View>
                  </View>
                ) : null}
                {this.isEvent() && (
                  <View
                    pointerEvents={this.state.ownership ? null : "none"}
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      marginTop: 20,
                    }}
                  >
                    <CreateTextInput
                      height={50}
                      maxLength={100}
                      placeholder={"Venue"}
                      value={this.state.currentRemind.location}
                      onChange={this.setCurrentLocation.bind(this)}
                    />
                  </View>
                )}
              </View>
              {this.isEvent() && this.state.ownership && (
                <View
                  pointerEvents={this.state.ownership ? null : "none"}
                  style={{ width: "90%", alignSelf: "center" , marginTop:20}}
                >
                  <PickersUpload
                    currentURL={this.state.currentRemind.remind_url || {}}
                    saveMedia={this.saveURL.bind(this)}
                    creating={!this.props.update}
                    notAudio
                  />
                </View>
              )}
              {this.isEvent() && (
                <View
                  pointerEvents={this.state.ownership ? null : "none"}
                  style={{ width: "90%", alignSelf: "center" }}
                >
                  <MediaPreviewer
                    cleanMedia={() => this.saveURL(request.Remind().remind_url)}
                    height={180}
                    defaultPhoto={require("../../../../assets/new-event.png")}
                    url={this.state.currentRemind.remind_url || {}}
                  />
                </View>
              )}
              {this.isEvent() && (
                <View
                  pointerEvents={!this.state.ownership ? "none" : null}
                  style={{ width: "90%", alignSelf: "center", marginTop: 20 }}
                >
                  <CreateTextInput
                    multiline
                    numberOfLines={30}
                    autogrow
                    height={60}
                    disabled={!this.state.ownership}
                    value={this.state.currentRemind.description}
                    placeholder="event details"
                    maxLength={2000}
                    onChange={(value) => this.onChangedDescription(value)}
                  />
                </View>
              )}
              {!this.state.creating ? (
                this.state.ownership && (
                  <TouchableOpacity onPress={()=> this.propceed()} style={{ margin: '5%',alignSelf:'flex-end',}}>
                  <View style={{ alignSelf:'center',alignItems:'center',...rounder(40,ColorList.likeActive)}}>
                     <Text style={{
                       ...GState.defaultTextStyle,
                       fontWeight: '400',
                       color:ColorList.bodyBackground,
                       fontSize: 20,
                     }}>ok</Text>
                  </View>
                  </TouchableOpacity>
                
                )
              ) : (
                  null
                )}
            </ScrollView>
            <SelectDays
              daysOfWeek={daysOfWeeksDefault}
              addCode={(code) => {
                this.computeDaysOfWeek(
                  uniq([
                    code,
                    ...this.state.currentRemind.recursive_frequency
                      .days_of_week,
                  ])
                );
              }}
              removeCode={(code) => {
                this.computeDaysOfWeek(
                  this.state.currentRemind.recursive_frequency.days_of_week.filter(
                    (ele) => ele !== code
                  )
                );
              }}
              ownership={this.state.ownership}
              daysSelected={
                this.state.currentRemind.recursive_frequency.days_of_week
              }
              isOpen={this.state.isSelectDaysModalOpened}
              onClosed={() => {
                this.setStatePure({
                  isSelectDaysModalOpened: false,
                });
              }}
            />
            <RemindMembers
              isOpen={this.state.selectMemberState}
              currentMembers={this.state.currentMembers}
              participants={this.props.event.participant}
              creator={this.props.event.creator_phone}
              onClosed={() => {
                this.setStatePure({
                  selectMemberState: false,
                });
              }}
              takecheckedResult={(members) => this.takecheckedResult(members)}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
