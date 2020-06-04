import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Icon, Item,
  Title, Input, Left, Right, Spinner, Toast,
  Button, Label
} from "native-base";

import { StyleSheet, TextInput, View, Image, TouchableOpacity, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import autobind from "autobind-decorator";
import { filter, find, findIndex, concat, uniqBy, uniq } from "lodash";
import request from "../../../services/requestObjects";
import Textarea from 'react-native-textarea';
import stores from '../../../stores/index';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-material-dropdown';
import moment from "moment";
import SelectableContactList from '../../SelectableContactList';
import NumericInput from 'react-native-numeric-input'
import Modal from 'react-native-modalbox';
import uuid from 'react-native-uuid';
import emitter from '../../../services/eventEmiter';
import { frequencyType, FrequencyReverser, nameToDataMapper, daysOfWeeksDefault, formWeekIntervals, format, } from '../../../services/recurrenceConfigs';
import SelectDays from "../event/SelectDaysModal";
import { getMonthDay, getDayMonth, getDay } from "../../../services/datesWriter";
import ColorList from '../../colorList';
import BleashupModal from '../../mainComponents/BleashupModal';
import CreationHeader from "../event/createEvent/components/CreationHeader";
import CreateButton from "../event/createEvent/components/ActionButton";
import CreateTextInput from "../event/createEvent/components/CreateTextInput";
import RemindMembers from "./RemindMembers";
import RemindsTypeMenu from './RemindTypeMenu';
import PickersUpload from "../event/createEvent/components/PickerUpload";
import MediaPreviewer from "../event/createEvent/components/MediaPeviewer";
import TaskCreationExtra from "./TaskCreationExtra";

let { height, width } = Dimensions.get('window')

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
      defaultDate: new Date(),
      defaultTime: new Date(),
      inputTimeValue: "",
      inputDateValue: "",
      isDateTimePickerVisible: false,
      selectMemberState: false,
      members: [],
      currentMembers: []
      //recurrence:""
    }
  }
  onClosedModal() {
    this.props.onClosed()
  }
  calculateType(remind) {
    return remind.location ||
      (remind.remind_url && remind.remind_url.photo) || remind.description ||
        (remind.remind_url && remind.remind_url.video) ? 'event' : 'reminder'
  }
  @autobind
  init() {
    console.warn('here we are');
    //stores.Reminds.removeRemind("newRemindId").then()
    this.props.remind ? setTimeout(() => {
      let remind = this.props.remind
      this.setState({
        currentRemind: remind,
        mounted: true,
        type: this.calculateType(remind),
        recurrent: remind.recursive_frequency.interval !== 1 && remind.recursive_frequency.frequency !== 'yearly',
        members: this.props.event.participant,
        ownership: remind.creator === stores.LoginStore.user.phone && this.props.update,
        currentMembers: remind && remind.members ? remind.members : [],
        date: remind && remind.period ? moment(remind.period).format() : moment().format(),
        title: remind && remind.period ? moment(remind.period).format() : moment().format()
      });
    }) : stores.Reminds.loadRemind(this.props.event_id,this.props.remind_id ?this.props.remind_id : "newRemindId").then(rem => {
      console.warn('here we are 2');
        //if (!rem) stores.Reminds.addReminds(this.props.event_id,request.Remind()).then(()=>{})
        
        console.warn("remind from render ....", rem)
        let remind = rem ? rem : request.Remind()
        this.setState({
          currentRemind: remind,
          mounted: true,
          type: this.calculateType(remind),
          recurrent: remind && !(remind.recursive_frequency.interval === 1 && remind.recursive_frequency.frequency === 'yearly'),
          members: this.props.event.participant,
          ownership: remind.creator === stores.LoginStore.user.phone && (this.props.update || remind.id === "newRemindId"),
          currentMembers: this.props.currentMembers && this.props.currentMembers.length > 0 ? this.props.currentMembers : remind && remind.members ? remind.members : [],
          date: remind && remind.period ? moment(remind.period).format() : moment().format(),
          title: remind && remind.period ? moment(remind.period).format() : moment().format()
        });
      })


  }

  getCode(day) {
    !find(find(daysOfWeeksDefault, { day: day })) ? console.error(this.state.currentRemind.period) : null
    return find(daysOfWeeksDefault, { day: day }).code
  }
  computeDaysOfWeek(data) {
    let newDate = data && data.length > 0 ?
      moment(formWeekIntervals(data, {
        start: moment(this.state.date).format(format),
        end: moment(this.state.currentRemind.recursive_frequency.recurrence).format(format)
      },
        moment(this.state.currentRemind.period).format(format))[0].end, format).format() :
      this.state.currentRemind.period
    let NewRemind = {
      remind_id: this.state.currentRemind.id,
      recursive_frequency: {
        ...this.state.currentRemind.recursive_frequency,
        days_of_week: data,
      },
      period: newDate
    }
    if (!this.props.update) {
      stores.Reminds.updateRecursiveFrequency(NewRemind, false).then((newRemind) => {
        if (this.state.currentRemind.period !== NewRemind.period) {
          stores.Reminds.updatePeriod(NewRemind, false).then((newRem) => {
            this.setState({ currentRemind: newRem, date: NewRemind.period });
          })
        } else {
          this.setState({
            currentRemind: newRemind,
            date: NewRemind.period
          })
        }

      });
    } else {
      this.setState({
        currentRemind: {
          ...this.state.currentRemind,
          recursive_frequency: NewRemind.recursive_frequency,
          period: NewRemind.period
        },
        date: NewRemind.period
      })
    }
  }
  componentDidMount() {
    this.init();
  }
  @autobind
  show(mode) {
    this.setState({
      show: true,
      mode,
    });
  }

  @autobind
  timepicker() {
    this.show('time');

  }

  //for date
  @autobind
  showDateTimePicker() {
    this.setState({ isDateTimePickerVisible: true });
  };

  @autobind
  handleDatePicked(event, date) {
    if (date !== undefined) {
      let newDate = moment(date).format().split("T")[0]
      let currentTime = this.state.date ?
        moment(this.state.date).format().split("T")[1] :
        moment().startOf("day").add(moment.duration(1, 'hours')).toISOString().split("T")[1]
      let dateTime = newDate + "T" + currentTime
      //deactivate the date picker before setting the obtain time     
      this.setState({ date: dateTime, isDateTimePickerVisible: false, show: true });
      this.props.update ? null : stores.Reminds.updatePeriod({ remind_id: "newRemindId", period: dateTime }, false).then(() => { });
    } else {
      this.setState({
        isDateTimePickerVisible: false
      })
    }
  }

  @autobind
  setTime(event, date) {
    if (date !== undefined) {
      let time = moment(date).format().split("T")[1]
      let newDate = this.state.date ?
        moment(this.state.date).format().split("T")[0] :
        moment().format().split("T")[0]
      let dateTime = newDate + "T" + time
      this.setState({ show: false, date: dateTime });
      this.props.update ? null : stores.Reminds.updatePeriod({ remind_id: "newRemindId", period: dateTime }, false).then(() => { });
    } else {
      this.setState({
        show: false
      })
    }

  }

  @autobind
  onChangedTitle(value) {
    this.state.currentRemind.title = value;
    this.setState({ currentRemind: { ...this.state.currentRemind, title: value } });
    let NewRemind = { remind_id: this.state.currentRemind.id, title: value }
    if (!this.props.update) {
      stores.Reminds.updateTitle(NewRemind, false).then(() => { });
    }
  }

  @autobind
  onChangedDescription(value) {
    this.setState({ currentRemind: { ...this.state.currentRemind, description: value } });
    let NewRemind = { remind_id: this.state.currentRemind.id, description: value }
    if (!this.props.update) {
      stores.Reminds.updateDescription(NewRemind, false).then(() => { });
    }
  }

  onChangedStatus(status) {
    let newstatus = status
    this.setState({ currentRemind: { ...this.state.currentRemind, status: newstatus } });
    let NewRemind = { remind_id: this.state.currentRemind.id, status: newstatus }
    if (!this.props.update) {
      stores.Reminds.updateStatus(NewRemind, false).then(() => { });
    }
  }

  @autobind
  onClickMembers() {
    this.setState({ selectMemberState: true });
  }


  @autobind
  back() {
    //this.setState({
    //  isExtra:false
   // })
    this.props.onClosed();
  }
  @autobind
  setRecursiveFrequency(value) {
    let NewRemind = {
      remind_id: this.state.currentRemind.id,
      recursive_frequency: {
        ...this.state.currentRemind.recursive_frequency,
        frequency: nameToDataMapper[value]
      }
    }
    if (!this.props.update) {
      stores.Reminds.updateRecursiveFrequency(NewRemind, false).then((newRemind) => {
        this.setState({ currentRemind: newRemind });

      });
    } else {
      this.setState({
        currentRemind: {
          ...this.state.currentRemind,
          recursive_frequency: NewRemind.recursive_frequency
        }
      })
    }
  }

  @autobind
  resetRemind() {
    this.setState({
      currentRemind: request.Remind(),

    });
  }
  setInterval(value) {
    !this.props.update ? stores.Reminds.updateRecursiveFrequency(
      {
        recursive_frequency: {
          ...this.state.currentRemind.recursive_frequency,
          interval: value
        },
        remind_id: this.state.currentRemind.id
      }
    ).then(newRemind => {
      this.setState({
        currentRemind: newRemind
      })
    }) : this.setState({
      currentRemind: {
        ...this.state.currentRemind,
        recursive_frequency: {
          ...this.state.currentRemind.recursive_frequency,
          interval: value
        }
      }
    })

  }
  updateRequestReportOnComplete() {
    !this.props.update ?
      stores.Reminds.updateRequestReportOnComplete({
        must_report: this.state.currentRemind.must_report ?
          !this.state.currentRemind.must_report : true,
        remind_id: this.state.currentRemind.id
      }).then(() => {
        this.setState({
          currentRemind: {
            ...this.state.currentRemind, must_report:
              this.state.currentRemind.must_report ?
                false : true
          }
        })
      }) : this.setState({
        currentRemind: {
          ...this.state.currentRemind, must_report:
            this.state.currentRemind.must_report ?
              !this.state.currentRemind.must_report : true
        }
      })
  }
  componentDidUpdate(prevProp, prevState) {
    let data = this.state.currentRemind.recursive_frequency.days_of_week ?
      this.state.currentRemind.recursive_frequency.days_of_week : [this.getCode(getDay(moment(this.state.currentRemind.period)))]
    if (this.props.currentMembers !== prevProp.currentMembers) {
      this.init()
    }
    if (this.props.remind_id !== prevProp.remind_id) {
      this.init()
    } else if (this.state.currentRemind.recursive_frequency.frequency === 'weekly' &&
      this.state.currentRemind.recursive_frequency.frequency !==
      prevState.currentRemind.recursive_frequency.frequency) {
      this.computeDaysOfWeek(data)
    } else if (this.state.currentRemind.recursive_frequency.frequency !== prevState.currentRemind.recursive_frequency.frequency) {
      this.computeDaysOfWeek(null)
    } else if (this.state.currentRemind.period !== prevState.currentRemind.period) {
      this.computeDaysOfWeek(data)
    }
  }

  @autobind
  addNewRemind() {
    if (!this.props.working) {
      if (!this.state.date || !this.state.currentRemind.title) {
        this.setState({
          isExtra: false
        })
        this.props.onClosed()
        Toast.show({
          text: "Remind Must Have Atleat a Title and Data/Time",
          buttonText: "Okay",
          duration: 6000,
          buttonTextStyle: { color: "#008000" },
          buttonStyle: { backgroundColor: "#5cb85c" },
          textStyle: { fontSize: 15 }
        })
      }
      else {
        this.setState({
          creating: true
        })
        this.props.reinitializeList()
        let newRemind = request.Remind();
        newRemind = this.state.currentRemind;
        newRemind.id = uuid.v1();
        newRemind.donners = []
        newRemind.period = this.state.date
        let user = stores.LoginStore.user
        newRemind.creator = user.phone;
        newRemind.recursive_frequency.recurrence = this.state.currentRemind.recursive_frequency.recurrence ?
          this.state.currentRemind.recursive_frequency.recurrence : moment(this.state.currentRemind.period).add(1, 'h').format()
        newRemind.event_id = this.props.event_id; //user phone is use to uniquely identify locals
        newRemind.created_at = moment().format();
        newRemind.members = this.state.currentMembers
        this.props.onClosed()
        this.props.startLoader()
        this.props.RemindRequest.CreateRemind(newRemind,
          this.props.event.about.title).then(() => {
          this.props.stopLoader()
          this.resetRemind();
          stores.Reminds.removeRemind(this.props.event_id,"newRemindId").then(() => { });
          this.setState({
            creating: false,
            currentMembers: []
          })
          this.props.updateData(newRemind)
        }).catch(() => {
          this.props.stopLoader()
          this.setState({
            creating: false
          })
        })
      }
    } else {
      Toast.show({ text: 'App is Busy' })

    }

  }

  updateRemind() {
    this.back();
    let rem = this.state.currentRemind
    rem.period = this.state.date
      this.props.updateRemind(JSON.stringify(rem));
    
    //this.resetRemind();
  }

  @autobind
  takecheckedResult(result) {
    this.setState({ currentMembers: uniqBy(result, "phone") })
    !this.props.update && stores.Reminds.updateMembers({
      remind_id: this.state.currentRemind.id,
      members: result
    }).then(() => { })
  }

  showEndatePiker() {
    this.setState({
      showEndatePiker: true,
      mode: "date",
      display: 'calendar'
    })
  }
  changeEndDate(e, date) {
    if (date === undefined) {
      this.setState({
        showEndatePiker: false,
      })
    } else {
      let newDate = moment(date).format().split("T")[0]
      let newTime = this.state.date ? moment(this.state.date).format().split("T")[1] :
        moment().startOf("day").add(moment.duration(1, 'hours')).toISOString().split("T")[1]
      let dateTime = newDate + "T" + newTime
      !this.props.update ? stores.Reminds.updateRecursiveFrequency({
        recursive_frequency:
          { ...this.state.currentRemind.recursive_frequency, recurrence: dateTime },
        remind_id: this.state.currentRemind.id
      }).then(newRemind => {
        this.setState({
          showEndatePiker: false,
          currentRemind: newRemind
        })
      }) : this.setState({
        showEndatePiker: false,
        currentRemind: {
          ...this.state.currentRemind,
          recursive_frequency: {
            ...this.state.currentRemind.recursive_frequency,
            recurrence: dateTime
          }
        },
      })
    }
  }
  setCurrentLocation(value) {
    this.setState({
      currentRemind: { ...this.state.currentRemind, location: value }
    })
    !this.props.update && stores.Reminds.updateLocation({
      remind_id: this.state.currentRemind.id,
      location: value
    }).then(() => { })
  }
  saveURL(url) {
    this.setState({
      currentRemind: { ...this.state.currentRemind, remind_url: url || request.Remind().remind_url }
    })
    !this.props.update && stores.Reminds.updateURL({
      remind_id:
        this.state.currentRemind.id,
      url: url || request.Remind().remind_url
    }).then(() => { })
  }
  computeMax(remind) {
    switch (remind.recursive_frequency.frequency && remind.recursive_frequency.frequency.toLowerCase()) {
      case 'daily':
        return 365;
      case 'weekly':
        return 63;
      case 'monthly':
        return 12;
      case 'yearly':
        return 2;
      default:
        return ""
    }
  }
  setRecurrencyState() {
    this.setState({
      recurrent: !this.state.recurrent,
    })
  }
  isEvent() {
    return this.calculateType(this.state.currentRemind) && this.state.type === 'event'
  }
  swipeToClose = false
  modalBody() {
    let defaultDate = parseInt(moment(this.state.currentRemind.period).format("x"))
    return !this.state.mounted ? null : (
        <ScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, justifyContent: "flex-end",}}>
            <CreationHeader
              back={this.props.onClosed}
              title={!this.state.ownership ? "Remind configs" : this.props.update ? "Update Remind" : "Add Remind"}
              extra={this.state.ownership && <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 'auto', marginTop: 'auto', }}>
                <View><TouchableOpacity onPress={() => requestAnimationFrame(() => this.setState({ selectMemberState: true }))} style={{ flexDirection: 'row', }}>
                  <Icon name="ios-people" type="Ionicons" style={{ color: ColorList.likeActive }} />
                  <Text style={{ fontWeight: 'bold', marginBottom: 'auto', marginTop: 'auto',color:ColorList.likeActive }}>{` (${this.state.currentMembers.length})`}</Text>
                </TouchableOpacity></View>
                <View>
                  <RemindsTypeMenu
                    type={this.isEvent() ? 'Event' : 'Reminder'}
                    reminder={() => {
                      this.setState({
                        type: 'reminder'
                      })
                    }}
                    event={() => {
                      this.setState({
                        type: 'event'
                      })
                    }}
                  ></RemindsTypeMenu></View></View>}
            >
            </CreationHeader>

            <View style={{ marginTop: '3%', }}>
              <ScrollView 
               keyboardShouldPersistTaps={'handled'}
               ref={"scrollView"} 
               showsVerticalScrollIndicator={false}>
                {this.props.shouldRestore && this.props.canRestore ? <View style={{ width: '95%', alignItems: 'flex-end', }}><Button style={{ alignSelf: 'flex-end', margin: '2%', marginRight: '2%', }} onPress={() => {
                  this.props.onClosed()
                  this.props.restore(this.props.remind)
                }} rounded><Text>{"Restore"}</Text></Button></View> : null}
                <View pointerEvents={this.state.ownership ? null : 'none'} style={{ height: height / 12, alignItems: 'center' }}>
                  <View style={{ width: '90%', alignSelf: 'center', }}>
                    <CreateTextInput
                      height={height / 15}
                      value={this.state.currentRemind.title}
                      placeholder={'remind'}
                      onChange={this.onChangedTitle}
                    ></CreateTextInput>
                  </View>
                </View>
                <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                  <View style={{
                    flexDirection: "row", height: 30,
                    width: '90%',
                    alignSelf: 'center',
                  }} >
                    <View pointerEvents={this.state.ownership ? null : 'none'} style={{ width: "12%" }} >
                      <TouchableOpacity style={{ marginBottom: 'auto', marginTop: 'auto', }} onPress={() => requestAnimationFrame(this.showDateTimePicker)}>
                        <Icon
                          active
                          type="MaterialIcons"
                          name="date-range"
                          style={{ color: "#1FABAB", }}
                        />
                      </TouchableOpacity>
                    </View>
                    <View pointerEvents={this.state.ownership ? null : 'none'}>
                      <TouchableOpacity style={{ marginTop: 'auto', marginBottom: 'auto', }} onPress={() => requestAnimationFrame(this.showDateTimePicker)}>
                        <Text style={{ color: ColorList.bodyText }}>
                          {this.state.date ? `${moment(this.state.date).format("dddd, MMMM Do YYYY")} at ${moment(this.state.date).format('hh:mm a')}` : 'set remind date'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {this.state.isDateTimePickerVisible && <DateTimePicker
                      mode="date"
                      value={defaultDate}
                      onChange={this.handleDatePicked}
                    />
                    }
                    {this.state.show && <DateTimePicker mode="time" value={defaultDate} display="default" onChange={this.setTime} />}
                  </View>
                  <View pointerEvents={this.state.ownership ? null : 'none'} style={{ width: "90%", alignSelf: 'center', height: 50 }}>
                    <TouchableOpacity style={{ flexDirection: 'row', marginTop: 'auto', marginBottom: 'auto', }} onPress={() => requestAnimationFrame(() => this.setRecurrencyState())}>
                      <Icon style={{ width: '15%', color: ColorList.bodyIcon }} name={
                        this.state.recurrent ? "arrow-up" :
                          "arrow-down"
                      } type={"EvilIcons"}></Icon>
                      <Text style={{ fontWeight: 'bold', }}>{"Repeat"}</Text>
                    </TouchableOpacity>
                  </View>
                  {this.state.recurrent ?
                    <Item style={{ marginLeft: '4%' }}><View style={{ width: "95%", flexDirection: "column", justifyContent: "space-between", marginTop: "1%" }}>

                      <View>
                        <Item style={{ width: "100%", marginLeft: '3%', padding: '1%' }}>
                          <View style={{ flexDirection: 'column', }}>
                            <View style={{ marginLeft: '1%', flexDirection: 'row', }}>
                              <Text style={{ fontStyle: 'italic', marginTop: 3, }}>Every  </Text>
                              <View pointerEvents={this.state.ownership ? null : 'none'}>
                                <NumericInput value={this.state.currentRemind.recursive_frequency.interval ?
                                  this.state.currentRemind.recursive_frequency.interval : 0}
                                  onChange={value => this.setInterval(value)}
                                  totalWidth={70}
                                  rounded
                                  borderColor={'#FEFFDE'}
                                  maxValue={this.computeMax(this.state.currentRemind)}
                                  initValue={this.state.currentRemind.recursive_frequency.interval ? this.state.currentRemind.recursive_frequency.interval : 1}
                                  reachMaxIncIconStyle={{ color: 'red' }}
                                  reachMinDecIconStyle={{ color: 'red' }}
                                  minValue={1}
                                  sepratorWidth={0}
                                  iconStyle={{ color: '#FEFFDE' }}
                                  rightButtonBackgroundColor='#1FABAB'
                                  leftButtonBackgroundColor='#1FABAB'
                                  totalHeight={30}
                                ></NumericInput>
                              </View>
                              <View pointerEvents={this.state.ownership ? null : 'none'} style={{ width: "30%", marginTop: '-6%', margin: '2%', }}>
                                <Dropdown
                                  data={frequencyType}
                                  baseColor={"#1FABAB"}
                                  selectedItemColor={"#1FABAB"}
                                  value={this.state.currentRemind.recursive_frequency.frequency ?
                                    FrequencyReverser[this.state.currentRemind.recursive_frequency.frequency] : 'none'}
                                  onChangeText={this.setRecursiveFrequency}
                                  pickerStyle={{ width: "35%", margin: '1%', borderRadius: 5, borderWidth: 0.2, borderColor: "#1FABAB" }}
                                  containerStyle={{ borderWidth: 0, borderColor: "gray", borderRadius: 6, justifyContent: "center", padding: "2%", height: 43 }}
                                />
                              </View>
                              {this.state.currentRemind.recursive_frequency.frequency === 'weekly' ? <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                                this.setState({
                                  isSelectDaysModalOpened: true
                                })
                              })
                              }><Text>{this.state.ownership ? "select days" : "view days"}</Text></TouchableOpacity> :
                                this.state.currentRemind.recursive_frequency.frequency === 'monthly' ?
                                  <View pointerEvents={this.state.ownership ? null : 'none'} >
                                    <TouchableOpacity onPress={() => {
                                      this.showDateTimePicker()
                                    }}><Text>{` on the ${getDayMonth(this.state.date)}`}</Text>
                                    </TouchableOpacity></View> : this.state.currentRemind.recursive_frequency.frequency === 'yearly' ?
                                    <View pointerEvents={this.state.ownership ? null : 'none'}>
                                      <TouchableOpacity onPress={() => {
                                        this.showDateTimePicker()
                                      }}><Text>{`on ${getMonthDay(this.state.date)}`}</Text></TouchableOpacity></View> : <Text>{this.state.currentRemind.recursive_frequency.interval === 1 ? '(all days)' : `(${this.state.currentRemind.recursive_frequency.interval} days)`}</Text>}
                            </View>
                          </View>
                        </Item>
                        <Item pointerEvents={this.state.ownership ? null : 'none'} style={{ marginLeft: '4%' }}>
                          <Label>
                            Ends
                    </Label>
                          <Button pointerEvents={this.state.ownership ? null : 'none'} style={{ width: "90%" }} onPress={() => this.showEndatePiker()} transparent>
                            <Text>{this.state.date && this.state.currentRemind.recursive_frequency.recurrence ? `On ${moment(this.state.currentRemind.recursive_frequency.recurrence).format('dddd, MMMM Do YYYY')}` : "Select Recurrence Stop Date"}</Text>
                          </Button>
                          {this.state.showEndatePiker ? <DateTimePicker value={this.state.currentRemind.recursive_frequency.recurrence ?
                            parseInt(moment(this.state.currentRemind.recursive_frequency.recurrence).format("x")) :
                            new Date()}
                            display={this.state.display}
                            mode={this.state.mode}
                            onChange={(e, date) => this.changeEndDate(e, date)}></DateTimePicker> : null}
                        </Item>
                      </View>
                    </View></Item> : null}
                  {this.isEvent() && <View pointerEvents={this.state.ownership ? null : 'none'} style={{ width: '90%', alignSelf: 'center', marginTop: '2%', marginBottom: '2%'}}>
                    <CreateTextInput
                      height={height / 20}
                      maxLength={70}
                      placeholder={'Venue'}
                      value={this.state.currentRemind.location}
                      onChange={this.setCurrentLocation.bind(this)}
                    ></CreateTextInput></View>}
                </View>
                {this.isEvent() && this.state.ownership && <View pointerEvents={this.state.ownership ? null : 'none'} style={{ width:'90%',alignSelf: 'center', }}>
                  <PickersUpload
                    currentURL={this.state.currentRemind.remind_url || {}}
                    saveMedia={this.saveURL.bind(this)}
                    creating={!this.props.update}
                    notAudio>
                  </PickersUpload>
                </View>}
                {this.isEvent() && <View pointerEvents={this.state.ownership ? null : 'none'} style={{ width: '90%', alignSelf: 'center', }}><MediaPreviewer
                  cleanMedia={() => this.saveURL(request.Remind().remind_url)}
                  height={height / 3.4}
                  defaultPhoto={require("../../../../assets/new-event.png")}
                  url={this.state.currentRemind.remind_url || {}}>
                </MediaPreviewer></View>}
                {this.isEvent() && <View pointerEvents={!this.state.ownership ? "none" : null} style={{ width: "90%", alignSelf: 'center', marginTop: '1%', }}>
                  <CreateTextInput
                    multiline
                    numberOfLines={30}
                    height={(height / (this.state.ownership ? 3.5 : 1.5)) * .7}
                    disabled={!this.state.ownership}
                    value={this.state.currentRemind.description}
                    placeholder="details"
                    maxLength={2000}
                    onChange={(value) => this.onChangedDescription(value)} />

                </View>}
                {!this.state.creating ?
                   this.state.ownership && <View style={{ margin: '2%', marginBottom: '4%', }}>
                <CreateButton
                  title={!this.props.update ? "Add Remind" : "Update Remind"}
                  action={() => {
                    this.setState({
                    isExtra: true
                  })
                  //this.onClosedModal()
                }}
                ></CreateButton></View> :
                  <Spinner></Spinner>}
              </ScrollView>
              <SelectDays daysOfWeek={daysOfWeeksDefault}
                addCode={code => {
                  this.computeDaysOfWeek(uniq([code, ...this.state.currentRemind.recursive_frequency.days_of_week]))
                }}
                removeCode={code => {
                  this.computeDaysOfWeek(this.state.currentRemind.recursive_frequency.days_of_week.filter(ele => ele !== code))
                }}
                ownership={this.state.ownership}
                daysSelected={this.state.currentRemind.recursive_frequency.days_of_week}
                isOpen={this.state.isSelectDaysModalOpened} onClosed={() => {

                  this.setState({
                    isSelectDaysModalOpened: false,
                  })
                }}></SelectDays>
              <RemindMembers
                isOpen={this.state.selectMemberState}
                currentMembers={this.state.currentMembers}
                participants={this.props.event.participant}
                creator={this.props.event.creator_phone}
                onClosed={() => {
                  this.setState({
                    selectMemberState: false,
                  })
                }}
                takecheckedResult={members => this.takecheckedResult(members)}
              >
              </RemindMembers>
              <TaskCreationExtra
                proceed={!this.props.update ? this.addNewRemind.bind(this) : this.updateRemind.bind(this)}
                onChangedStatus={this.onChangedStatus.bind(this)}
                currentRemind={this.state.currentRemind}
                onComplete={this.updateRequestReportOnComplete.bind(this)}
                isOpen={this.state.isExtra} onClosed={() => {
                  this.setState({
                    isExtra: false
                  })
                }}></TaskCreationExtra>
            </View>
          </View>
        </ScrollView>
    );
  }
}
