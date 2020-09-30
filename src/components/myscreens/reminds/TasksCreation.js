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
  CorrectDays,
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
import Ionicons from "react-native-vector-icons/Ionicons";
import GState from "../../../stores/globalState";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Texts from "../../../meta/text";

let { height, width } = Dimensions.get("window");

export default class TasksCreation extends BleashupModal {
  initialize() {
    this.state = {
      show: false,
      title: "",
      description: "",
      currentRemind: request.Remind(),
      //currentParticipant:null,
      mounted: true,
      date: "",
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
  backdropPressToClose = false;
  calculateType(remind) {
    return remind.location ||
      (remind.remind_url && remind.remind_url.photo) ||
      remind.description ||
      (remind.remind_url && remind.remind_url.video)
      ? "event"
      : "reminder";
  }

  unmountingComponent() {
    clearTimeout(this.initTimeout);
  }
  init() {
    this.shouldPersist = !this.update && !this.starRemind;
    this.remind && typeof this.remind !== "string"
      ? (this.initTimeout = setTimeout(() => {
        let remind = this.remind;
        this.setStatePure({
          currentRemind: remind,
          mounted: true,
          type: this.calculateType(remind),
          recurrent:
            remind.recursive_frequency.interval !== 1 &&
            remind.recursive_frequency.frequency !== "yearly",
          members: this.event.participant,
          ownership:
            remind.creator === stores.LoginStore.user.phone &&
            this.update,
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
      }))
      : stores.Reminds.loadRemind(
        this.event_id,
        this.remind_id ? this.remind_id : request.Remind().id
      ).then((rem) => {
        rem = isEmpty(rem) ? request.Remind() : rem;
        let remind = (!this.update && this.starRemind) || rem;
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
          members: this.event.participant,
          ownership:
            remind.creator === stores.LoginStore.user.phone &&
            (this.update || remind.id === request.Remind().id),
          currentMembers:
            this.currentMembers && this.currentMembers.length > 0
              ? this.currentMembers
              : rem && rem.members
                ? rem.members
                : [],
          date: remind && remind.period ? remind.period : moment().format(),
          /*title:
          remind && remind.period
            ? moment(remind.period).format()
            : moment().format(),*/
        });
      });
  }

  getCode(day) {
    let dayOb = find(daysOfWeeksDefault, { day: day });
    !dayOb ? console.error(this.state.currentRemind.period) : null;
    return dayOb.code;
  }
  getDayFromCode(code) {
    let dayOb = find(daysOfWeeksDefault, { code: code });
    !dayOb ? console.error(this.state.currentRemind.period) : null;
    return dayOb.day;
  }
  computeDaysOfWeek(data, shouldNotFilter, previousDate) {
    let date = moment(this.state.currentRemind.period).isValid()
      ? this.state.currentRemind.period
      : moment().format();
    let currentDayPeriod = this.getCode(getDay(date));
    let dayOfWeek = [];
    if (shouldNotFilter) {
      dayOfWeek = uniq([...data]);
    } else {
      let uniqCodes = uniq([...[currentDayPeriod], ...data]);
      if (previousDate && moment(previousDate).isValid()) {
        let previousPeriodCode = this.getCode(getDay(previousDate));
        dayOfWeek = uniqCodes.filter(
          (ele) =>
            CorrectDays[ele] >= CorrectDays[currentDayPeriod] &&
            CorrectDays[ele] !== CorrectDays[previousPeriodCode]
        );
      } else {
        dayOfWeek = uniqCodes.filter(
          (ele) => CorrectDays[ele] >= CorrectDays[currentDayPeriod]
        );
      }
    }
    dayOfWeek = dayOfWeek.sort((a, b) =>
      CorrectDays[a] <= CorrectDays[b] ? -1 : 1
    );
    let startRelativeOffset =
      CorrectDays[dayOfWeek[0]] - CorrectDays[currentDayPeriod];
    let endRelativeOffset =
      CorrectDays[dayOfWeek[dayOfWeek.length - 1]] -
      CorrectDays[currentDayPeriod];
    let lastDate = moment(date).add(endRelativeOffset, "day").format();
    let newDate = moment(date).add(startRelativeOffset, "day").format();
    let recurrence =
      this.state.currentRemind.recursive_frequency.recurrence ||
      this.state.currentRemind.period;
    let isWeekly =
      this.state.currentRemind.recursive_frequency.frequency == "weekly";
    let recurrenceEnDate = recurrence;
    if (recurrence) {
      let remindEndDayCode = this.getCode(getDay(recurrence));
      let recurrenceEndOffset =
        CorrectDays[dayOfWeek[dayOfWeek.length - 1]] -
        CorrectDays[remindEndDayCode];
      isWeekly
        ? (recurrence = moment(recurrence).add(recurrenceEndOffset, "day"))
        : null;
      recurrenceEnDate =
        moment(recurrence).format("x") >= moment(lastDate).format("x")
          ? recurrence
          : lastDate;
    }
    let NewRemind = {
      remind_id: this.state.currentRemind.id,
      recursive_frequency: {
        ...this.state.currentRemind.recursive_frequency,
        recurrence: recurrenceEnDate,
        days_of_week: data && data.length > 0 ? dayOfWeek : [currentDayPeriod],
      },
      period: newDate,
    };
    if (this.shouldPersist) {
      stores.Reminds.updateRecursiveFrequency(
        this.event_id,
        NewRemind,
        false
      ).then((newRemind) => {
        if (this.state.currentRemind.period !== NewRemind.period) {
          stores.Reminds.updatePeriod(
            this.event_id,
            NewRemind,
            false
          ).then((newRem) => {
            this.setStatePure({
              currentRemind: newRem,
              date: NewRemind.period,
              newing: !this.state.newing,
            });
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
        currentRemind: {
          ...this.state.currentRemind,
          period: dateTime,
        },
        isDateTimePickerVisible: false,
        show: true,
      });
      this.update
        ? null
        : stores.Reminds.updatePeriod(
          this.event_id,
          { remind_id: request.Remind().id, period: dateTime },
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
      this.update
        ? null
        : stores.Reminds.updatePeriod(
          this.event_id,
          { remind_id: request.Remind().id, period: dateTime },
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
    if (this.shouldPersist) {
      stores.Reminds.updateTitle(
        this.event_id,
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
    if (this.shouldPersist) {
      stores.Reminds.updateDescription(
        this.event_id,
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
    if (this.shouldPersist) {
      stores.Reminds.updateStatus(
        this.event_id,
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
    this.isRoute ? this.props.navigation.goBack() : this.props.onClosed()
  }
  setRecursiveFrequency(value) {
    let NewRemind = {
      remind_id: this.state.currentRemind.id,
      recursive_frequency: {
        ...this.state.currentRemind.recursive_frequency,
        frequency: nameToDataMapper[value],
      },
    };
    if (this.shouldPersist) {
      stores.Reminds.updateRecursiveFrequency(
        this.event_id,
        NewRemind,
        false
      ).then((newRemind) => {
        this.setStatePure({
          currentRemind: newRemind,
          newing: !this.state.newing,
        });
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
    !this.update
      ? stores.Reminds.updateRequestReportOnComplete(this.event_id, {
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
    let date = moment(this.state.currentRemind.period).isValid()
      ? this.state.currentRemind.period
      : moment().format();
    let data =
      this.state.currentRemind.recursive_frequency.days_of_week &&
        this.state.currentRemind.recursive_frequency.frequency === "weekly"
        ? this.state.currentRemind.recursive_frequency.days_of_week
        : [this.getCode(getDay(moment(date).format(format)))];
    if (
      this.state.currentRemind.recursive_frequency.frequency === "weekly" &&
      this.state.currentRemind.recursive_frequency.frequency !==
      prevState.currentRemind.recursive_frequency.frequency
    ) {
      this.computeDaysOfWeek(data);
    } else if (
      this.state.currentRemind.recursive_frequency.frequency !==
      prevState.currentRemind.recursive_frequency.frequency
    ) {
      this.computeDaysOfWeek([]);
    } else if (
      this.state.currentRemind.period !== prevState.currentRemind.period &&
      !this.periodChanged
    ) {
      this.computeDaysOfWeek(data, false, prevState.currentRemind.period);
    }
    if (
      this.state.currentRemind.recursive_frequency.interval !==
      prevState.currentRemind.recursive_frequency.interval &&
      !this.update
    ) {
      stores.Reminds.updateRecursiveFrequency(this.event_id, {
        recursive_frequency: {
          ...this.state.currentRemind.recursive_frequency,
          //interval: ,
        },
        remind_id: this.state.currentRemind.id,
      });
    }
  }

  addNewRemind() {
    this.CreateRemind(
      {
        ...this.state.currentRemind,
        members: this.state.currentMembers,
        created_at: moment().format(),
        event_id: this.event_id,
        recursive_frequency: {
          ...this.state.currentRemind.recursive_frequency,
          recurrence:
            this.state.currentRemind.recursive_frequency.recurrence &&
              moment(
                this.state.currentRemind.recursive_frequency.recurrence
              ).format("x") > moment(this.state.date).format("x")
              ? this.state.currentRemind.recursive_frequency.recurrence
              : moment(this.state.date).add(1, "h").format(),
        },
        creator: stores.LoginStore.user.phone,
        period: this.state.date,
        donners: [],
      },
      this.event.about.title
    );
    this.goback()
  }

  updateRem() {
    let rem = this.state.currentRemind;
    rem.period = this.state.date;
    this.updateRemind({
      ...rem,
      recursive_frequency: {
        ...rem.recursive_frequency,
        recurrence:
          rem.recursive_frequency.recurrence &&
            moment(rem.period).format("x") >=
            moment(rem.recursive_frequency.recurrence).format("x")
            ? moment(rem.period).add(2, "h").format()
            : rem.recursive_frequency.recurrence,
      },
    });
    this.goback()
    //this.resetRemind();
  }

  takecheckedResult(result) {
    this.setStatePure({ currentMembers: uniqBy(result, "phone") });
    !this.update &&
      stores.Reminds.updateMembers(this.event_id, {
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
      let newDate = moment(date).format();
      let dateTime = newDate;
      this.setStatePure({
        showEndTimePiker: true,
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
  changeEndTime(e, date) {
    if (date === undefined) {
      this.setStatePure({
        showEndTimePiker: false,
      });
    } else {
      let newDate = moment(date).format();
      let dateTime = newDate;
      this.shouldPersist
        ? stores.Reminds.updateRecursiveFrequency(this.event_id, {
          recursive_frequency: {
            ...this.state.currentRemind.recursive_frequency,
            recurrence: dateTime,
          },
          remind_id: this.state.currentRemind.id,
        }).then((newRemind) => {
          this.setStatePure({
            showEndatePiker: false,
            showEndTimePiker: false,
            currentRemind: newRemind,
          });
        })
        : this.setStatePure({
          showEndatePiker: false,
          showEndTimePiker: false,
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
    this.shouldPersist &&
      stores.Reminds.updateLocation(this.event_id, {
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
    this.shouldPersist &&
      stores.Reminds.updateURL(this.event_id, {
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
  getParam = (param) => this.props.navigation && this.props.navigation.getParam(param)
  isRoute = this.props.navigation && true
  updateRemind = this.getParam("updateRemind") || this.props.updateRemind
  CreateRemind = this.getParam("CreateRemind") || this.props.CreateRemind
  update = this.getParam("update") || this.props.update
  starRemind = this.getParam("starRemind") || this.props.starRemind
  remind = this.getParam("remind") || this.props.remind
  event_id = this.getParam("event_id") || this.props.event_id
  event = this.getParam("event") || this.props.event
  currentMembers = this.getParam("currentMembers") || this.props.currentMembers
  remind_id = this.getParam("remind_id") || this.props.remind_id
  propceed() {
    if (!this.state.date || !this.state.currentRemind.title) {
      Toaster({
        text: Texts.remind_must_have_atleate_date_time_or_title,
      });
    } else {
      if (this.update) {
        this.updateRem();
      } else {
        this.addNewRemind();
      }
    }
  }
  goback() {
    this.isRoute ? this.props.navigation.goBack() : this.props.onClosed();
  }
  swipeToClose = false;
  modalBody() {
    let defaultDate = parseInt(
      moment(this.state.currentRemind.period).format("x")
    );
    let defaultEndTime = this.state.currentRemind.recursive_frequency.recurrence
      ? parseInt(
        moment(
          this.state.currentRemind.recursive_frequency.recurrence
        ).format("x")
      )
      : new Date();
    return !this.state.mounted ? null : (
      <ScrollView
        keyboardShouldPersistTaps={"handled"}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <CreationHeader
            back={this.goback.bind(this)}
            title={
              !this.state.ownership
                ? Texts.remind_configs
                : this.update
                  ? Texts.update_remind
                  : Texts.add_remind
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
                  {!this.update ? (
                    <View>
                      <TouchableOpacity
                        onPress={() =>
                          requestAnimationFrame(() =>
                            this.setStatePure({ selectMemberState: true })
                          )
                        }
                        style={{ flexDirection: "row",marginRight: "3%", }}
                      >
                        <Ionicons
                          name="ios-people"
                          type="Ionicons"
                          style={{
                            ...GState.defaultIconSize,
                            color: ColorList.likeActive,
                          }}
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
                    </View>
                  ) : null}
                  <View>
                    <RemindsTypeMenu
                      type={this.isEvent() ? Texts.program : Texts.reminder}
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
                    placeholder={
                      this.isEvent()
                        ? Texts.your_event_title
                        : Texts.remind_message
                    }
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
                        requestAnimationFrame(
                          this.showDateTimePicker.bind(this)
                        )
                      }
                    >
                      <MaterialIcons
                        active
                        type="MaterialIcons"
                        name="date-range"
                        style={{
                          ...GState.defaultIconSize,
                          color: ColorList.indicatorColor,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View pointerEvents={this.state.ownership ? null : "none"}>
                    <TouchableOpacity
                      style={{ marginTop: "auto", marginBottom: "auto" }}
                      onPress={() =>
                        requestAnimationFrame(
                          this.showDateTimePicker.bind(this)
                        )
                      }
                    >
                      <Text
                        style={{
                          ...GState.defaultTextStyle,
                          color: ColorList.bodyText,
                        }}
                      >
                        {this.state.date
                          ? `${moment(this.state.date).format(
                            "dddd, MMMM Do YYYY"
                          )} at ${moment(this.state.date).format("hh:mm a")}`
                          : Texts.remind_date}
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
                      alignItems: "center",
                      marginTop: 20,
                    }}
                    onPress={() =>
                      requestAnimationFrame(() => this.setRecurrencyState())
                    }
                  >
                    <EvilIcons
                      style={{
                        ...GState.defaultIconSize,
                        width: "13%",
                        color: ColorList.bodyIcon,
                      }}
                      name={this.state.recurrent ? "arrow-up" : "arrow-down"}
                      type={"EvilIcons"}
                    />
                    <Text
                      style={{ ...GState.defaultTextStyle, fontWeight: "bold" }}
                    >
                      {Texts.repeat}
                    </Text>
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
                                style={{
                                  ...GState.defaultTextStyle,
                                  fontStyle: "italic",
                                  marginTop: 3,
                                }}
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
                                  borderColor={ColorList.bodyBackground}
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
                                  reachMaxIncIconStyle={{
                                    color: ColorList.delete,
                                  }}
                                  reachMinDecIconStyle={{
                                    color: ColorList.delete,
                                  }}
                                  minValue={1}
                                  sepratorWidth={0}
                                  iconStyle={{
                                    color: ColorList.bodyBackground,
                                  }}
                                  rightButtonBackgroundColor={
                                    ColorList.indicatorColor
                                  }
                                  leftButtonBackgroundColor={
                                    ColorList.indicatorColor
                                  }
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
                                  baseColor={ColorList.indicatorColor}
                                  selectedItemColor={ColorList.indicatorColor}
                                  value={
                                    this.state.currentRemind.recursive_frequency
                                      .frequency
                                      ? FrequencyReverser[
                                      this.state.currentRemind
                                        .recursive_frequency.frequency
                                      ]
                                      : "none"
                                  }
                                  onChangeText={this.setRecursiveFrequency.bind(
                                    this
                                  )}
                                  pickerStyle={{
                                    width: "35%",
                                    margin: "1%",
                                    borderRadius: 5,
                                    borderWidth: 0.2,
                                    borderColor: ColorList.indicatorColor,
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
                                    <Text style={{ ...GState.defaultTextStyle }}>
                                      {this.state.ownership
                                        ? Texts.select_days
                                        : Texts.view_days}
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
                                        <Text
                                          style={{ ...GState.defaultTextStyle }}
                                        >{` ${Texts.on_the} ${getDayMonth(
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
                                          <Text
                                            style={{ ...GState.defaultTextStyle }}
                                          >{`on ${getMonthDay(
                                            this.state.date
                                          )}`}</Text>
                                        </TouchableOpacity>
                                      </View>
                                    ) : (
                                      <Text style={{ ...GState.defaultTextStyle }}>
                                        {this.state.currentRemind.recursive_frequency
                                          .interval === 1
                                          ? Texts.all_days
                                          : `(${this.state.currentRemind.recursive_frequency.interval} ${Texts.days})`}
                                      </Text>
                                    )}
                            </View>
                          </View>
                        </View>
                        <View
                          pointerEvents={this.state.ownership ? null : "none"}
                          style={{ marginLeft: "4%" }}
                        >
                          <Text
                            style={{
                              ...GState.defaultTextStyle,
                              fontWeight: "bold",
                              color: ColorList.bodyText,
                            }}
                          >
                            End Date:
                          </Text>
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
                                ).format("dddd, MMMM Do YYYY")} at  ${moment(
                                  this.state.currentRemind.recursive_frequency
                                    .recurrence
                                ).format("hh:mm a")}`
                                : Texts.selete_recurrence_stop_date}
                            </Text>
                          </TouchableOpacity>
                          {this.state.showEndatePiker ? (
                            <DateTimePicker
                              value={defaultEndTime}
                              mode={"date"}
                              onChange={(e, date) =>
                                this.changeEndDate(e, date)
                              }
                            />
                          ) : null}
                          {this.state.showEndTimePiker ? (
                            <DateTimePicker
                              value={defaultEndTime}
                              mode={"time"}
                              onChange={(e, date) =>
                                this.changeEndTime(e, date)
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
                      placeholder={Texts.venue}
                      value={this.state.currentRemind.location}
                      onChange={this.setCurrentLocation.bind(this)}
                    />
                  </View>
                )}
              </View>
              {this.isEvent() && this.state.ownership && (
                <View
                  pointerEvents={this.state.ownership ? null : "none"}
                  style={{ width: "90%", alignSelf: "center", marginTop: 20 }}
                >
                  <PickersUpload
                    currentURL={this.state.currentRemind.remind_url || {}}
                    saveMedia={this.saveURL.bind(this)}
                    creating={!this.update}
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
                    placeholder={Texts.details}
                    maxLength={2000}
                    onChange={(value) => this.onChangedDescription(value)}
                  />
                </View>
              )}
              {!this.state.creating
                ? this.state.ownership && (
                  <TouchableOpacity
                    onPress={() => this.propceed()}
                    style={{ margin: "5%", alignSelf: "flex-end" }}
                  >
                    <View
                      style={{
                        alignSelf: "center",
                        alignItems: "center",
                        ...rounder(40, ColorList.likeActive),
                      }}
                    >
                      <Text
                        style={{
                          ...GState.defaultTextStyle,
                          fontWeight: "400",
                          color: ColorList.bodyBackground,
                          fontSize: 20,
                        }}
                      >
                        ok
                        </Text>
                    </View>
                  </TouchableOpacity>
                )
                : null}
            </ScrollView>
            <SelectDays
              daysOfWeek={daysOfWeeksDefault}
              addCode={(code) => {
                this.computeDaysOfWeek(
                  uniq([
                    code,
                    ...this.state.currentRemind.recursive_frequency
                      .days_of_week,
                  ]),
                  true
                );
              }}
              removeCode={(code) => {
                this.computeDaysOfWeek(
                  this.state.currentRemind.recursive_frequency.days_of_week.filter(
                    (ele) => ele !== code
                  ),
                  true
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
              participants={this.event.participant}
              creator={this.event.creator_phone}
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
  render() {
    return this.isRoute ? this.modalBody() : this.modal()
  }
}
