/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import { StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modalbox';
import stores from '../../../stores/index';
import moment from 'moment';
import { find, isEqual, findIndex, uniqBy, cloneDeep } from "lodash";
import AccordionModule from '../invitations/components/Accordion';
import Creator from "./Creator";
import RemindsMenu from "./RemindsMenu";
import { dateDiff, writeDateTime } from "../../../services/datesWriter";
import { getCurrentDateInterval, getcurrentDateIntervals } from '../../../services/getCurrentDateInterval';
import { format } from '../../../services/recurrenceConfigs';
import { confirmedChecker } from "../../../services/mapper";
import ColorList from '../../colorList';
import MedaiView from "../event/createEvent/components/MediaView";
import { createOpenLink } from "react-native-open-maps";
import CreateButton from "../event/createEvent/components/ActionButton";
import shadower from "../../shadower";
import Swipeout from "../eventChat/Swipeout";
import BeComponent from '../../BeComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GState from "../../../stores/globalState";
import BePureComponent from '../../BePureComponent';

let { height, width } = Dimensions.get('window')


export default class EventTasksCard extends BeComponent {
  constructor(props) {
    super(props)
    this.state = {
      isOpenTasks: false,
      isDone: this.props.item.isDone,
      created_date: "",
      created_time: "",
      period_date: "",
      newing: false,
      showAll: false,
      period_time: "",
      hasDoneForThisInterval: false,
      correspondingDateInterval: {},
      mounted: false,
      creator: this.props.master,//this.props.item.creator === this.props.phone,
      currentDateIntervals: [],
      cardData: this.props.item,

      assignToMe: false,
      userphone: "",
      accordData: { title: "", content: "" },
      RemindCreationState: false,
      long: false
    }

  }
  componentMounting() {
  }
  loadIntervals() {
    return new Promise((resolve, reject) => {
      getcurrentDateIntervals({
        start: moment(this.props.item.period).format(format),
        end: moment(this.props.item.recursive_frequency.recurrence).format(format)
      }, this.props.item.recursive_frequency.interval, this.props.item.recursive_frequency.frequency,
        this.props.item.recursive_frequency.days_of_week).then((currentDateIntervals) => {
          getCurrentDateInterval(currentDateIntervals,
            moment().format(format)).then(correspondingDateInterval => {
              this.setStatePure({
                correspondingDateInterval,
                currentDateIntervals,
                //hasDoneForThisInterval,
                newing: !this.state.newing
              })
              resolve('ok')
            })
        })
    })
  }
  componentDidMount() {
    this.mountTimeout = setTimeout(() => {
      this.setStatePure({
        mounted: true
      })
      setTimeout(() => {
        this.loadIntervals()
      })
    }, 30 * this.props.delay)
  }

  onDone() {
    this.props.markAsDone(this.props.item)
  }

  update() {
    this.props.update(this.props.item)
  }


  assignToMe() {
    this.props.assignToMe(this.props.item)
  }
  previousItem = null
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    this.props.animate()
    return this.state.mounted !== nextState.mounted ||
      !isEqual(this.previousItem, nextProps.item) ||
      this.props.isPointed !== nextProps.isPointed ||
      this.previousItem.period !== nextProps.item.period ||
      this.state.newing !== nextState.newing
  }
  /*compareRecurrenceConfig(prev, current) {
    let equalRecurrence = prev.recursive_frequency.recurrence == current.recursive_frequency.recurrence
    let equalFrequency = prev.recursive_frequency.frequency == current.recursive_frequency.frequency
    let equaInterval = prev.recursive_frequency.interval == current.recursive_frequency.interval
    let reduceFunc = (a, b) => a + b
    let prevDayOfWeekString = prev.recursive_frequency.days_of_week &&
      prev.recursive_frequency.days_of_week.reduce(reduceFunc, "")
    let currentDaysOfWeekString = current.recursive_frequency.days_of_week &&
      current.recursive_frequency.days_of_week.reduce(reduceFunc, "")
    let equalDaysOfWeek = prevDayOfWeekString == currentDaysOfWeekString
    return equaInterval && equalFrequency && equalRecurrence && equalDaysOfWeek
  }*/
  componentDidUpdate(prevProps, prevState) {
    let canUpdate = this.state.mounted && (!this.previousItem || this.previousItem.period
      !== this.props.item.period || !isEqual(this.props.item.recursive_frequency, this.previousItem.recursive_frequency))
    if (canUpdate) {
      this.loadIntervals().then(() => {
      })
    }
    this.previousItem = cloneDeep(this.props.item)
  }
  unmountingComponent() {
  }
  saveAll(alarms) {
    this.props.assignToMe(this.props.item, alarms);
  }
  accordData = {
    title: null,
    content: null
  }
  returnActualDatesIntervals() {
    return this.state.correspondingDateInterval ?
      {
        period: moment(this.state.correspondingDateInterval.end, format).format(),
        recurrence: moment(this.state.correspondingDateInterval.end, format).format(),
        title: this.props.item.title
      } : {
        period: moment(this.state.currentDateIntervals[this.state.currentDateIntervals.length - 1].end, format).format(),
        recurrence: moment(this.state.currentDateIntervals[this.state.currentDateIntervals.length - 1].end, format).format(),
        title: this.props.item.title
      }
  }
  returnRealActualIntervals() {
    return this.state.correspondingDateInterval ?
      {
        start: this.state.correspondingDateInterval.start,
        end: this.state.correspondingDateInterval.end,
      } : {
        period: this.state.currentDateIntervals[this.state.currentDateIntervals.length - 1].start,
        recurrence: this.state.currentDateIntervals[this.state.currentDateIntervals.length - 1].end,
      }
  }
  container = {
    width: "98%",
    flexDirection: 'column',
    borderRadius: 5,
    backgroundColor: ColorList.bodyBackground,
    alignSelf: 'center',
    margin: '1%', padding: "1%", ...shadower(1)
  }
  render() {
    let hasDoneForThisInterval = find(this.props.item.donners, (ele) =>
      ele.status.date &&
      this.state.correspondingDateInterval &&
      moment(ele.status.date).format("x") >
      moment(this.state.correspondingDateInterval.start,
        format).format("x") && moment(ele.status.date).format("x") <=
      moment(this.state.correspondingDateInterval.end, format).format("x") &&
      ele.phone === stores.LoginStore.user.phone) ? true : false

    let actualInterval = this.returnActualDatesIntervals()
    let realActualIntervals = this.returnRealActualIntervals()
    let lastIndex = 0
    let lastInterval = {}
    let isLastInterval = false
    if (this.state.currentDateIntervals && this.state.currentDateIntervals.length > 0) {
      lastIndex = this.state.currentDateIntervals.length - 1
      lastInterval = this.state.currentDateIntervals[lastIndex]
      isLastInterval = (realActualIntervals.start == lastInterval.start) && (realActualIntervals.end == lastInterval.end)
    }

    canBeDone = this.state.correspondingDateInterval ? true : false

    missed = dateDiff({
      recurrence: this.state.correspondingDateInterval ?
        moment(this.state.correspondingDateInterval.end, format).format() :
        this.props.item.recursive_frequency.recurrence
    }) > 0 && !hasDoneForThisInterval;
    status = this.props.item.confirmed && this.state.correspondingDateInterval && findIndex(this.props.item.confirmed,
      ele => confirmedChecker(ele, stores.LoginStore.user.phone, this.state.correspondingDateInterval)) >= 0;
    cannotAssign = dateDiff({
      recurrence: this.state.correspondingDateInterval ?
        moment(this.state.correspondingDateInterval.end, format).format() :
        this.props.item.period
    }) > 0
    member = findIndex(this.props.item.members,
      { phone: stores.LoginStore.user.phone }) >= 0;
    return !this.state.mounted ? <View style={{ ...this.container, height: 100, ...this.props.item.dimensions}}></View> : (
      <Swipeout onLongPress={() => {
        this.props.showRemindActions(this.state.currentDateIntervals,
          this.state.correspondingDateInterval,
          this.state.creator.phone,
          this.returnActualDatesIntervals().period)
      }} disabled={false} swipeRight={() => {
        this.props.mention({ ...this.props.item, current_date: this.returnActualDatesIntervals().period, })
      }}><View onLayout={(e) => this.props.onLayout(e.nativeEvent.layout)} style={[this.container,{opacity:this.props.isPointed?.2:1,
        backgroundColor: this.props.isPointed?ColorList.reminds:ColorList.bodyBackground,}]}>
          <View>
            <View style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
              <View style={{ width: "95%" }}>
                <Text style={{
                  width: '100%', fontWeight: "300", fontSize: 14, color: ColorList.bodySubtext,
                  color: dateDiff({
                    recurrence: this.state.correspondingDateInterval ?
                      moment(this.state.correspondingDateInterval.end, format).format() :
                      this.props.item.period
                  }) > 0 ? ColorList.bodySubtext : ColorList.iconActive,
                  alignSelf: 'flex-end',
                }}
                >{`${writeDateTime(actualInterval).
                  replace("Starting", isLastInterval ? "Ends" : "Due").
                  replace("Ended", "Past").
                  replace("Started", "Past")}`}</Text>
              </View>
            </View>

            {this.props.item.location ? <View style={{ flexDirection: 'row', }}>
              <TouchableOpacity style={{ flexDirection: 'row', }} onPress={() => requestAnimationFrame(() => {
                let Query = { query: this.props.item.location };
                createOpenLink({ ...Query, zoom: 50 })();
              })}>
                <Text style={{ ...GState.defaultTextStyle, fontWeight: 'bold', }}>{"Venue: "}</Text><Text style={{ textDecorationLine: 'underline' }}>{this.props.item.location}</Text>
              </TouchableOpacity>
            </View> : null}
            <View style={{ flexDirection: 'row', }}>
              <View>
                <Text ellipsizeMode={'tail'} numberOfLines={7} style={{ ...GState.defaultTextStyle, fontWeight: "500", marginBottom: "5%", marginLeft: "0%", fontSize: 17, color: ColorList.bodyText, textTransform: "capitalize", }}>{this.props.item.title}</Text>
              </View>
            </View>
            {this.props.item.remind_url &&
              (this.props.item.remind_url.photo || this.props.item.remind_url.video) ?
              <MedaiView
                height={ColorList.containerHeight * .39}
                width={"100%"}
                url={this.props.item.remind_url}
                showItem={this.props.showMedia}
              ></MedaiView>

              : null}

            <View style={{
              flexDirection: 'row',
            }}>
              <TouchableOpacity onPress={() => {
                this.setStatePure({
                  showAll: !this.state.showAll,
                  newing: !this.state.newing
                })
              }}>
                <Text note style={{ fontSize: 12, marginTop: "2%", color: ColorList.bodyText }} ellipsizeMode={!this.state.showAll ? 'tail' : null} numberOfLines={this.state.showAll ? null : 10}>{this.props.item.description}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ width: "100%", marginTop: '3%', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 15 }}>
              {!member ?
                cannotAssign ? null :
                  <CreateButton title={"Assign To Me"} style={{
                    borderWidth: 0,
                    borderRadius: 10,
                    width: 135,
                    alignSelf: 'flex-end',
                    height: 35,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...shadower(3),
                    backgroundColor: ColorList.bodyDarkWhite
                  }}
                    action={this.assignToMe.bind(this)}>
                  </CreateButton>
                :
                (hasDoneForThisInterval ?
                  status ?
                    <MaterialCommunityIcons type="MaterialCommunityIcons" name="check-all"
                      style={{ ...GState.defaultIconSize, color: "#54F5CA", marginLeft: "90%" }}></MaterialCommunityIcons>
                    : <AntDesign type="AntDesign" name="check" style={{
                      ...GState.defaultIconSize,
                      color: "#1FABAB",
                      marginLeft: "90%"
                    }}></AntDesign>
                  :
                  missed ? /*<Button style={{
                  borderWidth: 2, marginTop: 5, borderRadius: 10,
                  width: "21%", alignItems: 'center', justifyContent: 'center',
                  marginLeft: "78%"
                }} transparent><Text style={{ fontWeight: 'bold', color: 'red' }}>{"Missed"}</Text></Button>*/ null
                    : canBeDone ? <CreateButton style={{
                      borderRadius: 10, alignSelf: 'flex-end', ...shadower(3), borderWidth: 0, backgroundColor: ColorList.bodyDarkWhite,
                      width: 70, alignItems: 'center', justifyContent: 'center', height: 35
                    }}
                      title={"Done"}
                      action={this.onDone.bind(this)}>
                    </CreateButton> : null
                )

              }


            </View>
            <View style={{
              alignItems: 'flex-start',
              padding: 2,
            }}>
              <Creator
                giveCreator={(creator) => {
                  this.setStatePure({
                    creator: creator,
                    newing: !this.state.newing
                  })
                }}
                creator={this.props.item.creator}
                created_at={this.props.item.created_at}></Creator>
            </View>
          </View>
        </View>
      </Swipeout>


    )
  }

}