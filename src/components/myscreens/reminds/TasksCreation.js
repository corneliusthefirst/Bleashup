import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner, Toast,
  Button, InputGroup, DatePicker, Thumbnail, Alert, Label
} from "native-base";

import { StyleSheet, TextInput, View, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import autobind from "autobind-decorator";
import { filter, find, findIndex, concat, uniqBy } from "lodash";
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
let data = [ {
  value: 'Daily',
},{
  value:'Weekly'
  }, {
    value: 'Monthly',
  }, {
    value: 'Yearly',
  }];

let { height, width } = Dimensions.get('window')

export default class TasksCreation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      title: "",
      description: "",
      currentRemind: request.Remind(),
      //currentParticipant:null,
      date: "",
      mounted: false,
      time: "",
      defaultDate: new Date(),
      defaultTime: new Date(),
      //update:this.props.parentComp.update_remind?this.props.parentComp.params.update_remind:false,
      inputTimeValue: "",
      inputDateValue: "",
      isDateTimePickerVisible: false,
      selectMemberState: false,
      members: [],
      currentMembers: []
      //recurrence:""
    }

  }

  @autobind
  init() {
    //stores.Reminds.removeRemind("newRemindId").then()
    this.props.remind? setTimeout(() => {
      let remind = this.props.remind
      this.setState({
        currentRemind: remind,
        mounted: true,
        recurrent : remind.recursive_frequency.interval !== 1 && remind.recursive_frequency.frequency !== 'yearly',
        members: this.props.event.participant,
        currentMembers: remind && remind.members ? remind.members : [],
        date: remind && remind.period ? moment(remind.period).format() : moment().format(),
        title: remind && remind.period ? moment(remind.period).format() : moment().format()
      });
    }): stores.Reminds.readFromStore().then(Reminds => {
      //console.warn("reminds are",Reminds);
      let remind = find(Reminds, { id: this.props.remind_id ? this.props.remind_id : "newRemindId" });
      this.setState({
        currentRemind: remind,
        mounted: true,
        recurrent: remind.recursive_frequency.interval !== 1 && remind.recursive_frequency.frequency !== 'yearly',
        members: this.props.event.participant,
        currentMembers: remind && remind.members ? remind.members : [],
        date: remind && remind.period ? moment(remind.period).format() : moment().format(),
        title: remind && remind.period ? moment(remind.period).format() : moment().format()
      });
    })


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
      this.setState({ date: dateTime, isDateTimePickerVisible: false });
      this.props.update ? null : stores.Reminds.updatePeriod({ remind_id: "newRemindId", period: dateTime }, false).then(() => { });
    }else{
      this.setState({
        isDateTimePickerVisible:false
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
    }else{
      this.setState({
        show:false
      })
    }

  }

  @autobind
  onChangedTitle(value) {
    // console.warn("here is the update state",this.state.update)
    this.state.currentRemind.title = value;
    this.setState({ currentRemind: this.state.currentRemind });
    let NewRemind = { remind_id: this.state.currentRemind.id, title: this.state.currentRemind.title }
    if (!this.props.update) {
      stores.Reminds.updateTitle(NewRemind, false).then(() => { });
    }
  }

  @autobind
  onChangedDescription(value) {
    this.state.currentRemind.description = value;
    this.setState({ currentRemind: this.state.currentRemind });
    let NewRemind = { remind_id: this.state.currentRemind.id, description: this.state.currentRemind.description }
    if (!this.props.update) {
      stores.Reminds.updateDescription(NewRemind, false).then(() => { });
    }
  }



  onChangedStatus() {
    if (this.state.currentRemind.status == "public") {
      this.state.currentRemind.status = "private";
      this.setState({ currentRemind: this.state.currentRemind });
      let NewRemind = { remind_id: this.state.currentRemind.id, status: this.state.currentRemind.status }
      if (!this.props.update) {
        stores.Reminds.updateStatus(NewRemind, false).then(() => { });
      }
    } else {
      this.state.currentRemind.status = "public";
      this.setState({ currentRemind: this.state.currentRemind });
      let NewRemind = { remind_id: this.state.currentRemind.id, status: this.state.currentRemind.status }
      if (!this.props.update) {
        stores.Reminds.updateStatus(NewRemind, false).then(() => { });
      }
    }

  }

  @autobind
  onClickMembers() {
    this.setState({ selectMemberState: true });
  }


  @autobind
  back() {
    this.props.onClosed();
  }
  @autobind
  setRecursiveFrequency(value) {
    let NewRemind = {
      remind_id: this.state.currentRemind.id,
      recursive_frequency: {
        ...this.state.currentRemind.recursive_frequency,
        frequency: value.toLowerCase()
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

  /* 
  @autobind
  onChangedRecurrence(value){
    this.setState({recurrence:value});
    this.state.currentRemind.recurrence = parseInt(value);
    this.setState({currentRemind:this.state.currentRemind});
    let NewRemind={remind_id:this.state.currentRemind.id,recurrence:this.state.currentRemind.recurrence}
     if(!this.state.update){
    stores.Reminds.updateRecurrence(NewRemind,false).then(()=>{});
     }
  } */

  @autobind
  resetRemind() {
    this.state.currentRemind = request.Remind();
    this.state.currentRemind.id = "newRemindId";
    this.setState({
      currentRemind: this.state.currentRemind,

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
                !this.state.currentRemind.must_report : true
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
    if (this.props.remind_id !== prevProp.remind_id) {
      this.init()
    }
  }

  @autobind
  addNewRemind() {

    if (!this.state.date || !this.state.currentRemind.title) {
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
      let newRemind = request.Remind();
      newRemind = this.state.currentRemind;
      newRemind.id = uuid.v1();
      newRemind.donners = []
      newRemind.period = this.state.date
      let user = stores.LoginStore.user
      newRemind.creator = user.phone;
      newRemind.recursive_frequency.recurrence = this.state.currentRemind.recursive_frequency.recurrence ?
        this.state.currentRemind.recursive_frequency.recurrence : this.state.currentRemind.period
      newRemind.event_id = this.props.event_id; //user phone is use to uniquely identify locals
      newRemind.created_at = moment().format();
      console.warn(this.state.currentMembers)
      newRemind.members = newRemind.status === 'private' ? this.state.currentMembers : []
      this.props.onClosed()
      this.props.createRemind(newRemind)
      this.resetRemind();
      stores.Reminds.removeRemind("newRemindId").then(() => { });

    }

  }

  @autobind
  updateRemind() {
    let newRemind = this.state.currentRemind
    newRemind.period = this.state.date
    this.props.updateRemind(JSON.stringify(newRemind));
    this.resetRemind();
    this.back();

  }

  @autobind
  takecheckedResult(result) {
    let members = concat(this.state.currentMembers, result);
    this.setState({ currentMembers: uniqBy(members, "phone") })
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
  writeInterval(remind) {
    switch (remind.recursive_frequency.frequency && remind.recursive_frequency.frequency.toLowerCase()) {
      case 'daily':
        return '   day(s)';
      case 'weekly':
        return '   week(s)';
      case 'monthly':
        return '   month(s)';
      case 'yearly':
        return '   year(s)';
      default:
        return ''
    }
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
      //newThing: !this.state.newThing
    })
  }
  render() {
    return !this.state.mounted ? null : (
      <Modal
        isOpen={this.props.isOpen}
        onClosed={() => { this.props.onClosed() }}
        style={{
          height: "93%", width: "98%", borderTopLeftRadius: 8, borderTopRightRadius: 8,
          backgroundColor: "#FEFFDE", borderColor: 'black', flexDirection: 'column'
        }}
        coverScreen={true}
        backButtonClose={true}
        position={'bottom'}
        swipeToClose={true}
      >
        <View style={{ height: "100%", backgroundColor: "#FEFFDE", width: "100%", borderRadius: 10 }}>


          {/*   <View style={{height:"8%",width:"96%",flexDirection:"row",backgroundColor:"#FEFFDE",alignItems:"center",marginLeft:"2%",marginRight:"2%"}}>
           <View >
             <TouchableOpacity>
                <Icon  onPress={this.back} type='MaterialCommunityIcons' name="keyboard-backspace" style={{color:"#1FABAB"}} />
             </TouchableOpacity>
           </View>

             <View style={{marginLeft:"20%"}}>
               <Text style={{fontSize:16}}>New Tasks/Reminds</Text>
             </View>

         </View>*/}

          <ScrollView ref={"scrollView"} showsVerticalScrollIndicator={false}>
            <View pointerEvents={this.props.master ? null : 'none'} style={{ height: height / 8, alignItems: 'center' }}>
              {/*<Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"500",fontSize:16}} >Title :</Text>*/}
              <Item style={{ borderColor: 'black', width: "95%", marginTop: "3%" }} rounded>
                <TextInput maxLength={20} style={{ marginLeft: '2%', width: '100%' }} maxLength={40} value={this.state.currentRemind.title} maxLength={40} placeholder='New Remind Title' keyboardType='email-address' returnKeyType='next' inverse last
                  onChangeText={(value) => this.onChangedTitle(value)} />
              </Item>
            </View>

            <View pointerEvents={this.props.master ? null : 'none'} style={{ flexDirection: "column", justifyContent: "space-between" }}>
              <Item rounded style={{ flexDirection: "row", height: height / 17, margin: '2%' }} >
                <View style={{ width: "12%" }} >
                  <TouchableOpacity onPress={this.showDateTimePicker}>
                    <Icon
                      active
                      type="MaterialIcons"
                      name="date-range"
                      style={{ color: "#1FABAB" }}
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  <Input editable={false} placeholder="select date of event" value={moment(this.state.date).format("dddd, MMMM Do YYYY")} style={{ color: "#696969" }} />
                </View>

                {this.state.isDateTimePickerVisible && <DateTimePicker
                  mode="date"
                  minimumDate={this.state.defaultDate}
                  value={this.state.defaultDate}
                  onChange={this.handleDatePicked}
                />
                }

              </Item>

              <Item rounded style={{ flexDirection: "row", height: height / 17, marginLeft: "1%", marginRight: "1%" }}  >
                <View style={{ width: "12%" }} >
                  <TouchableOpacity onPress={this.timepicker}>
                    <Icon
                      active
                      type="Ionicons"
                      name="ios-clock"
                      style={{ color: "#1FABAB" }}
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  <Input editable={false} placeholder="select event time" value={moment(this.state.date).format('hh:mm:s a')} style={{ color: "#696969" }} />
                </View>

                {this.state.show && <DateTimePicker mode="time" value={this.state.defaultTime} display="default" onChange={this.setTime} />}

              </Item>
              <Item>
              </Item>
              <Item style={{ width: "100%" }}>
                <Button onPress={() => this.setRecurrencyState()}
                  transparent>
                  <Icon name={
                    this.state.recurrent ? "radio-button-checked" :
                      "radio-button-unchecked"
                  } type={"MaterialIcons"}></Icon>
                  <Text style={{ fontWeight: 'bold', }}>Recurrence Configurations</Text>
                </Button>
              </Item>
              {this.state.recurrent ?
                <Item style={{ marginLeft: '4%' }}><View style={{ width: "95%", flexDirection: "column", justifyContent: "space-between", marginTop: "1%" }}>
                  <View style={{ margin: "2%", width: "100%", height: 45 }}>
                    <Dropdown label='Frequency'
                      data={data}
                      baseColor={"#1FABAB"}
                      selectedItemColor={"#1FABAB"}
                      labelFontSize={15}
                      value={this.state.currentRemind.recursive_frequency.frequency ?
                        this.state.currentRemind.recursive_frequency.frequency : 'none'}
                      onChangeText={this.setRecursiveFrequency}
                      pickerStyle={{ width: "90%", margin: '1%', borderRadius: 5, backgroundColor: "#FEFFDE", borderWidth: 0.2, borderColor: "#1FABAB" }}
                      containerStyle={{ borderWidth: 0, borderColor: "gray", borderRadius: 6, justifyContent: "center", padding: "2%", height: 43 }}
                    />
                  </View>
                  <View >
                    <Item style={{ width: "100%", marginLeft: '3%', padding: '1%' }}>
                      <View style={{ flexDirection: 'column', }}>
                        <Text style={{ fontWeight: 'bold', }}>Interval</Text>
                        <View style={{ marginLeft: '5%', flexDirection: 'row', }}>
                          <Text style={{ fontStyle: 'italic', marginTop: 3, }}>Every  </Text>
                          <NumericInput value={this.state.currentRemind.recursive_frequency.interval ? this.state.currentRemind.recursive_frequency.interval : 0}
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
                          <Text style={{ marginTop: 3, }}>{this.writeInterval(this.state.currentRemind)}</Text>
                        </View>
                      </View>
                    </Item>
                    <Item style={{ marginLeft: '4%' }}>
                      <Label>
                        Ends
                    </Label>
                      <Button style={{ width: "90%" }} onPress={() => this.showEndatePiker()} transparent>
                        <Text>{this.state.date && this.state.currentRemind.recursive_frequency.recurrence ? `On ${moment(this.state.currentRemind.recursive_frequency.recurrence).format('dddd, MMMM Do YYYY')}` : "Select Recurrence Stop Date"}</Text>
                      </Button>
                      {this.state.showEndatePiker ? <DateTimePicker value={new Date()}
                        display={this.state.display}
                        mode={this.state.mode}
                        onChange={(e, date) => this.changeEndDate(e, date)}></DateTimePicker> : null}
                    </Item>
                  </View>
                </View></Item> : null}
              <View>
                <Item>
                  <View style={{ width: '60%' }}>
                    {this.state.currentRemind.status == "public" ?
                      <Button onPress={() => this.onChangedStatus()} transparent>
                        <Icon name="md-radio-button-on" //active={true}  type="Ionicons" style={{ color: "#0A4E52", alignSelf: "center", marginTop: "1%" }} 
                        />
                        <Text>Public</Text>
                      </Button> :
                      <Button onPress={() => this.onChangedStatus()} transparent>
                        <Icon name="md-radio-button-on" //active={true} type="Ionicons" style={{ color: "#0A4E52", alignSelf: "center" }} 
                        />
                        <Text>Private</Text>
                      </Button>}
                  </View>
                  {this.state.currentRemind.status == "private" && !this.props.update ?
                    <Button onPress={() => {  this.setState({ selectMemberState: true }) }} transparent>
                      <Icon name="ios-people" type="Ionicons" style={{ fontSize: 25 }} />
                      <Text>Members</Text>
                    </Button> : null}
                </Item>
                <Item pointerEvents={this.props.master ? null : 'none'}>
                  <Button onPress={() => this.updateRequestReportOnComplete()}
                    transparent>
                    <Icon name={
                      this.state.currentRemind.must_report ? "radio-button-checked" :
                        "radio-button-unchecked"
                    } type={"MaterialIcons"}></Icon>
                    <Text style={{ fontWeight: 'bold', }}>Request Report On Task done</Text>
                  </Button>
                </Item>
              </View>
            </View>
            <View style={{ height: height / 3 + height / 26, alignItems: 'flex-start', justifyContent: 'center' }}>
              <View pointerEvents={!this.props.master ? "none" : null} style={{ width: "100%", height: "100%" }}>
                <Text style={{ alignSelf: 'flex-start', margin: "3%", fontWeight: "500", fontSize: 16 }} >Description</Text>
                <Textarea
                  disabled={!this.props.master}
                  value={this.state.currentRemind.description}
                  containerStyle={{
                    width: "94%", margin: "1%",
                    height: height / 4,
                    borderRadius: 15, borderWidth: 1,
                    borderColor: "#9E9E9E",
                    backgroundColor: "#f5fffa"
                  }}
                  placeholder="Task / Remind Description"
                  style={{
                    textAlignVertical: 'top',  // hack android
                    height: "100%",
                    fontSize: 14,
                    color: '#333',
                  }}
                  maxLength={1000}
                  onChangeText={(value) => this.onChangedDescription(value)} />

              </View>
            </View>
            {this.props.master ? !this.props.update ?
              <TouchableOpacity style={{ width: "20%", alignSelf: 'center', marginBottom: "3%", marginLeft: "68%", marginTop: "-8%" }}>
                <Button
                  onPress={() => { this.addNewRemind() }} rounded>
                  <Text style={{ color: "#FEFFDE" }}> Create </Text>
                </Button>
              </TouchableOpacity> : <TouchableOpacity style={{ width: "22%", marginBottom: "1%", marginLeft: "72%", marginTop: "-8%" }}>
                <Button style={{ width: "100%", borderRadius: 15, borderColor: "#1FABAB", backgroundColor: "#1FABAB", justifyContent: 'center', alignItem: 'center' }}
                  onPress={() => { this.updateRemind() }}>
                  <Text style={{ color: "#FEFFDE", fontSize: 12 }}> Update </Text>
                </Button>
              </TouchableOpacity> : null
            }

          </ScrollView>

          < SelectableContactList isOpen={this.state.selectMemberState} close={() => { this.setState({ selectMemberState: false }) }}
            members={this.state.members} notcheckall={true} takecheckedResult={this.takecheckedResult}>
          </SelectableContactList>

        </View>
      </Modal >
    );
  }
}

/*<View style={{height:height/18,width:width/2-width/28,alignItems:'center',marginTop:-26}}>
       <Text style={{alignSelf:'flex-start',margin:"3%",marginLeft:"6%",fontWeight:"400",fontSize:15,color:"#1FABAB"}} >recurrence :</Text>
       <Item  style={{borderColor:'black',width:"95%",borderRadius:5}} rounded>
        <Input keyboardType = 'numeric'  value={this.state.recurrence} maxLength={3} placeholder='number of repetions'  maxLength={3}  returnKeyType='next' inverse last
        onChangeText={(value) => this.onChangedRecurrence(value)} />
       </Item>
  </View>*/