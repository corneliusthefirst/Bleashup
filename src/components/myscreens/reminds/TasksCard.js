import React, { Component } from "react";
import {
  Card, CardItem, Text, Icon, Title, Left, Button, Right, Spinner
} from "native-base";

import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";
import stores from '../../../stores/index';
import moment from 'moment';
import { find, isEqual, findIndex, uniqBy } from "lodash";
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

let { height, width } = Dimensions.get('window')


export default class EventTasksCard extends Component {
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
  componentWillMount() {

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
              this.setState({
                correspondingDateInterval,
                currentDateIntervals,
                hasDoneForThisInterval,
                newing: !this.state.newing
              })
              resolve('ok')
            })
        })
    })
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        mounted: true
      })
    })
  }

  @autobind
  onDone() {
    this.props.markAsDone(this.props.item)
  }

  @autobind
  update() {
    this.props.update(this.props.item)
  }

  @autobind
  assignToMe() {
    this.props.assignToMe(this.props.item)
  }
  previousItem = null
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.state.mounted !== nextState.mounted ||
      !isEqual(JSON.parse(this.previousItem), nextProps.item) ||
      this.state.newing !== nextState.newing
  }
  componentDidUpdate(prevProps, prevState) {
    this.previousItem = JSON.stringify(this.props.item)
    if (prevProps.item.period !== this.props.item.period || !isEqual(this.props.item.recursive_frequency,
      prevProps.item.recursive_frequency) || this.state.mounted !== prevState.mounted) {
      this.loadIntervals().then(() => {
      })
    }
  }
  componentWillUnmount() {
  }
  saveAll(alarms) {
    this.props.assignToMe(this.props.item, alarms)
  }
  accordData = {
    title: null,
    content: null
  }
  render() {
    hasDoneForThisInterval = find(this.props.item.donners, (ele) =>
      ele.status.date &&
      this.state.correspondingDateInterval &&
      moment(ele.status.date).format("X") >
      moment(this.state.correspondingDateInterval.start,
        format).format("X") && moment(ele.status.date).format("X") <=
      moment(this.state.correspondingDateInterval.end, format).format("X") &&
      ele.phone === stores.LoginStore.user.phone) ? true : false
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
    return !this.state.mounted ? null : (
        <Card style={{
          //marginLeft: "2%", marginRight: "2%", //marginBottom: this.props.isLast ? '25%' : '0%',
        }}>
          <CardItem style={{
            justifyContent: 'space-between',
          }}>
            <View style={{ width: "90%" }}>
              <Text style={{
                width: '100%', fontWeight: "300", fontSize: 14, color: ColorList.bodySubtext,
                color: dateDiff({
                  recurrence: this.state.correspondingDateInterval ?
                    moment(this.state.correspondingDateInterval.end, format).format() :
                    this.props.item.period
                }) > 0 ? ColorList.bodySubtext : ColorList.iconActive,
                alignSelf: 'flex-end',
              }}
              >{`${writeDateTime(
                this.state.correspondingDateInterval ?
                  {
                    period: moment(this.state.correspondingDateInterval.end, format).format(),
                    recurrence: moment(this.state.correspondingDateInterval.end, format).format(),
                    title: this.props.item.title
                  } : {
                    period: moment(this.state.currentDateIntervals[this.state.currentDateIntervals.length - 1].end, format).format(),
                    recurrence: moment(this.state.currentDateIntervals[this.state.currentDateIntervals.length - 1].end, format).format(),
                    title: this.props.item.title
                  }).
                replace("Starting", "Due").
                replace("Ended", "Past").
                replace("Started", "Past")}`}</Text>
            </View>
            <View style={{ width: "4%",flexDirection: 'row', }}>
              <View style={{ flexDirection: 'row',alignSelf: 'flex-end', }}>
                <RemindsMenu
                  reply={() => this.props.mention({ ...this.props.item, creator: this.state.creator })}
                  members={() => this.props.showReport(this.props.item, this.state.currentDateIntervals, this.state.correspondingDateInterval)}
                  update={() => this.props.updateRemind(this.props.item)}
                  creator={this.state.creator}
                  addMembers={() => { this.props.addMembers(uniqBy(this.props.item.members, "phone"), this.props.item) }}
                  removeMembers={() => this.props.removeMembers(uniqBy(this.props.item.members.filter(ele => this.state.creator ||
                    ele.phone === stores.LoginStore.user.phone), 'phone'), this.props.item)}
                  deleteRemind={() => this.props.deleteRemind(this.props.item)}
                ></RemindsMenu>
              </View>
            </View>
          </CardItem>

          {this.props.item.location ? <CardItem>
            <TouchableOpacity style={{ flexDirection: 'row', }} onPress={() => requestAnimationFrame(() => {
              let Query = { query: this.props.item.location };
              createOpenLink({ ...Query, zoom: 50 })();
            })}>
              <Text style={{ fontWeight: 'bold', }}>{"Venue: "}</Text><Text style={{ textDecorationLine: 'underline' }}>{this.props.item.location}</Text>
            </TouchableOpacity>
          </CardItem> : null}
          <CardItem>
            <Left>
              <Text ellipsizeMode={'tail'} numberOfLines={3} style={{ fontWeight: "500", marginBottom: "5%", marginLeft: "0%", fontSize: 17, color: ColorList.bodyText, textTransform: "capitalize", }}>{this.props.item.title}</Text>
            </Left>
          </CardItem>
          {this.props.item.remind_url &&
            (this.props.item.remind_url.photo || this.props.item.remind_url.video) ?
            <View style={{ flex: 1, alignItems: 'center', alignSelf: 'center', width: ColorList.containerWidth }}>
              <MedaiView
                height={ColorList.containerHeight * .39}
                width={ColorList.containerWidth * 0.96}
                url={this.props.item.remind_url}
                showItem={this.props.showMedia}
              ></MedaiView>

            </View> : null}

          <CardItem carBody>
            <TouchableOpacity onPress={() => {
              this.setState({
                showAll: !this.state.showAll,
                newing: !this.state.newing
              })
            }}>
              <Text note style={{ fontSize: 12, marginTop: "2%", color: ColorList.bodyText }} ellipsizeMode={!this.state.showAll ? 'tail' : null} numberOfLines={this.state.showAll ? null : 10}>{this.props.item.description}</Text>
            </TouchableOpacity>
          </CardItem>

          <CardItem style={{ width: "100%", marginTop: '2%', }}>
            {!member ?
              cannotAssign ? null :
                <Button style={{ borderWidth: 2, borderRadius: 10, borderColor: ColorList.iconActive, width: "32%", alignItems: 'center', justifyContent: 'center', marginLeft: "67%" }}
                  onPress={() => this.assignToMe()} transparent >
                  <Text style={{ fontWeight: "500", color: ColorList.darkGrayText, fontSize: 11 }}>Assign To Me</Text>
                </Button>
              :
              (hasDoneForThisInterval ?
                status ?
                  <Icon type="MaterialCommunityIcons" name="check-all"
                    style={{ color: "#54F5CA", marginLeft: "90%" }}></Icon>
                  : <Icon type="AntDesign" name="check" style={{
                    color: "#1FABAB",
                    marginLeft: "90%"
                  }}></Icon>
                :
                missed ? /*<Button style={{
                  borderWidth: 2, marginTop: 5, borderRadius: 10,
                  width: "21%", alignItems: 'center', justifyContent: 'center',
                  marginLeft: "78%"
                }} transparent><Text style={{ fontWeight: 'bold', color: 'red' }}>{"Missed"}</Text></Button>*/ null
                  : canBeDone ? <Button style={{
                    borderWidth: 2, marginTop: 5, borderRadius: 10, borderColor: "#1FABAB",
                    width: "21%", alignItems: 'center', justifyContent: 'center',
                    marginLeft: "78%"
                  }}
                    onPress={() => this.onDone()} transparent >
                    <Text style={{
                      fontWeight: "500", color: "#696969",
                      fontSize: 12
                    }}>{"Done"}</Text>
                  </Button> : null
              )

            }


          </CardItem>
          <View style={{
            alignItems: 'flex-start',
            padding: 2,
          }}>
            <Creator giveCreator={(creator) => {
              this.setState({
                creator: creator,
                newing: !this.state.newing
              })
            }} creator={this.props.item.creator} created_at={this.props.item.created_at}></Creator>
          </View>
        </Card>

      )
  }

}