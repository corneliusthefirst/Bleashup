import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert
} from "native-base";

import { StyleSheet, View,Image,TouchableOpacity,Dimensions} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";
import { filter,uniqBy,orderBy,find,findIndex,reject,uniq,indexOf,forEach,dropWhile } from "lodash";
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
    stores.Events.readFromStore().then(Events =>{
        let event = find(Events, { id:"newEventId" }); 

          this.setState({title:event.about.title});
         
       if(event.period!=""){
        
         this.setState({
          date:event.period,
          time:event.period,
          inputDateValue:moment(event.period).format().split("T")[0],
          inputTimeValue:moment(event.period).format().split("T")[1].split("+")[0]
         });
       }

   
   });
      
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
    handleDatePicked(event,date){
      if (date !== undefined) {

        //deactivate the date picker before setting the obtain time
        this.setState({ isDateTimePickerVisible: false });
     
        this.setState({date:date});
        if(this.state.time==""){
            let period = moment(this.state.date).format().split("T")[0] + "T" +
            moment().format().split("T")[1];

            this.setState({inputDateValue:moment(period).format().split("T")[0]})      
            stores.Events.updatePeriod("newEventId",period,false).then(()=>{});
        }else{
            let period = moment(this.state.date).format().split("T")[0] + "T" +
            moment(this.state.time).format().split("T")[1];

            this.setState({inputDateValue:moment(period).format().split("T")[0]})      
            stores.Events.updatePeriod("newEventId",period,false).then(()=>{});
        }


      }
    }

    @autobind
    setTime(event, date){
      if (date !== undefined) {
        //deactivate the clock before setting the obtain time
        this.setState({show:false});
        //set time
        this.setState({time:date});
        
        if(this.state.date==""){
            let period = moment().format().split("T")[0] + "T" +
            moment(this.state.time).format().split("T")[1];

            this.setState({inputTimeValue:moment(period).format().split("T")[1].split("+")[0]});
            stores.Events.updatePeriod("newEventId",period,false).then(()=>{});
        }else{
            let period = moment(this.state.date).format().split("T")[0] + "T" +
            moment(this.state.time).format().split("T")[1];

            this.setState({inputTimeValue:moment(period).format().split("T")[1].split("+")[0]});
            stores.Events.updatePeriod("newEventId",period,false).then(()=>{});
        }
 

    
      }

    }


    render() {
    	return(
          <Modal
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                onClosingState={()=>{this.setState({show:false})}}
                style={{
                    height: height/4 + height/20 , borderRadius: 15,
                    backgroundColor:"#FEFFDE",borderColor:'black',borderWidth:1,width: "98%",
                    marginTop:"-3%"
                }}
                coverScreen={true}
                position={'bottom'}
                //backdropPressToClose={false}
                >


       <View style={{height:"100%",width:"100%",flexDirection:"column",marginTop:"8%"}}>
             
             <View style={{marginBottom:"8%",alignItems:"center"}}>
             <Text style={{fontWeight:"500"}}>select   date/time</Text>
             </View>

            <Item rounded style={{flexDirection:"row",height:height/17,marginLeft:"1%",marginRight:"1%",marginBottom:"8%"}} >
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
            <View>
              <Input editable={false} placeholder="select date of event" value={this.state.inputDateValue} style={{color:"#696969"}}/>
            </View>

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
        <View>
        <Input editable={false} placeholder="select event time" value={this.state.inputTimeValue} style={{color:"#696969"}}/>
        </View>
            
        {this.state.show && <DateTimePicker  mode="time" value={this.state.defaultTime}  display="default" onChange={this.setTime}/>}
       
      </Item>

    </View>



 </Modal>

    )}

    }
