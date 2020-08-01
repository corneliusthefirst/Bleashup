import React, { Component } from "react";
import {
   Text,  Icon, Item,
  Button, 
} from "native-base";

import {  View,TouchableOpacity,Dimensions} from 'react-native';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";
import request from "../../../../../services/requestObjects";
import  stores from '../../../../../stores/index';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

let {height, width} = Dimensions.get('window')

export default class EventPeriod extends Component {
    constructor(props) {
      super(props)
      this.state={
          show: false,
          title:"",
          date:"",
          time:"",
          defaultDate:new Date(),
          defaultTime:new Date(),
          inputTimeValue:"",
          inputDateValue:"",
          isDateTimePickerVisible: false
         }
         
    }


   componentDidMount(){
     //stores.Events.updatePeriod("newEventId","").then(() => {})
         let period = this.props.event.period
         //console.error(period)
         this.setState({
          date:period,
          time:period,
          inputDateValue:period?moment(period).format().split("T")[0]:null,
          inputTimeValue:period?moment(period).format().split("T")[1].split("+")[0]:null
         }); 
 }

  componentDidUpdate(prevProps, prevState){
    if(this.props.event.period !== prevProps.event.period){
      let period = this.props.event.period 
      this.setState({
        date: period,
        time: period,
        inputDateValue:period?moment(period).format().split("T")[0]:null,
        inputTimeValue: period?moment(period).format().split("T")[1].split("+")[0]:null
      }); 
    }
 }


   @autobind
   show(mode){
      this.setState({
        show: true,
        mode,
      });
    }
  
    @autobind
    timepicker(){
      this.show('time');
  
    }

    //for date
    @autobind
    showDateTimePicker(){
      this.setState({ isDateTimePickerVisible: true });
    };

  @autobind
  handleDatePicked(event, date) {
    if (date !== undefined) {
      let newDate = moment(date).format().split("T")[0]
      let currentTime = this.state.date ?
        moment(this.state.date).format().split("T")[1] :
        moment().startOf("day").add(moment.duration(1,'hours')).toISOString().split("T")[1]
      let dateTime = newDate + "T" + currentTime
      //deactivate the date picker before setting the obtain time     
      this.setState({ date: dateTime, isDateTimePickerVisible: false });
      stores.Events.updatePeriod("newEventId", dateTime, false).then(() => { });
    }else{
      this.setState({
        isDateTimePickerVisible:false
      })
    }
  }
    resetPeriod(){
      stores.Events.updatePeriod("newEventId", "").then(() => {
        this.setState({
          date: null,
          time: null
        })
      })
    }
    resetTime(){
      let time = moment().startOf('day').add(moment.duration(1,'hours')).toISOString().split("T")[1]
      let newDate = this.state.date ?
        moment(this.state.date).format().split("T")[0] :
        moment().format().split("T")[0]
      let dateTime = newDate + "T" + time
      this.setState({ show: false, date: dateTime });
      stores.Events.updatePeriod("newEventId", dateTime, false).then(() => { });
    }
    setTime(event, date){
      if (date !== undefined) {
        let time = moment(date).format().split("T")[1]
        let newDate = this.state.date?
        moment(this.state.date).format().split("T")[0]:
        moment().format().split("T")[0]
        let dateTime = newDate + "T"+time
        this.setState({ show: false, date: dateTime});
        stores.Events.updatePeriod("newEventId", dateTime, false).then(() => { });
      }else{
        this.setState({
          show:false
        })
      }

    }


    render() {
    	return(
          <Modal
                isOpen={this.props.isOpen}
                onClosed={() => this.props.onClosed(this.state.date)}
                onClosingState={()=>{this.setState({show:false})}}
                style={{
                    height: height/4 + height/20 , borderRadius: 15,
                    backgroundColor:"#FEFFDE",borderColor:'black',borderWidth:1,width: "98%",
                    marginTop:"-3%"
                }}
                coverScreen={true}
                position={'bottom'}
                backButtonClose={true}
                //backdropPressToClose={false}
                >


       <View style={{height:"100%",width:"100%",flexDirection:"column",marginTop:"8%"}}>
             
             <View style={{marginBottom:"8%",alignItems:"center"}}>
             <Text style={{fontWeight:"500"}}>select   date/time</Text>
             </View>

            <Item rounded style={{flexDirection:"row",height:height/17,marginLeft:"1%",marginRight:"1%",marginBottom:"8%",paddingBottom: '5%',}} >
            <View style={{width:"12%"}} >
            <TouchableOpacity  onPress={this.showDateTimePicker}>     
            <Icon
              active
              type="MaterialIcons"
              name="date-range"
              style={{ color: "#1FABAB" }}
            />
            </TouchableOpacity>
            </View>
            <View style={{width:'78%'}}>
                <Input editable={false} placeholder="select date of activity" 
                value={this.state.date?moment(this.state.date).format('dddd, MMMM Do YYYY'):null} style={{color:"#696969"}}/>
            </View>
            {this.state.date || this.state.period?<View>
            <Icon onPress={() => {
                 this.resetPeriod()
            }} name={"close"} type={"EvilIcons"} style={{color:'red'}}></Icon>
            </View>:null}

            {this.state.isDateTimePickerVisible && <DateTimePicker
            mode="date"
            minimumDate={this.state.defaultDate}
            value={this.state.defaultDate}
            onChange={this.handleDatePicked}
            />
            }

          </Item>
        
      <Item rounded style={{flexDirection:"row",height:height/17,marginLeft:"1%",marginRight:"1%"}}  >
       <View style={{width:"12%"}} >
        <TouchableOpacity  onPress={this.timepicker}>
          <Icon
              active
              type="Ionicons"
              name="ios-clock"
              style={{ color: "#1FABAB"}}
            />
        </TouchableOpacity>
        </View>
        <View style={{ width:'78%'}}>
          <Input editable={false} placeholder="select activity time" 
          value={this.state.date?moment(this.state.date).format('hh:mm:s a'):null} 
          style={{color:"#696969"}}/>
        </View>
        {this.state.date || this.state.time?<View>
        <Icon onPress={() => {
            this.resetTime()
        }} name={'close'} style={{color:'red'}} type={'EvilIcons'}></Icon>
        </View>:null}
      </Item>
            {this.state.show && <DateTimePicker is24Hour={true} mode="time"
              value={this.state.defaultDate} display="default" onChange={(e,d) => this.setTime(e,d)} />}

    </View>



 </Modal>

    )}

    }
