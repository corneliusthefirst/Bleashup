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

export default class EventTitle extends Component {
    constructor(props) {
      super(props)
      this.state={
          show: false,
          title:"",
          date:new Date(),
          time:new Date(),
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
       }else{
         this.setState({
           inputDateValue:moment(this.state.defaultDate).format().split("T")[0],
           inputTimeValue:moment(this.state.defaultTime).format().split("T")[1].split("+")[0]
          });
       }
   
   });
      
 }


   @autobind
   onChangedTitle(value) { 
     this.setState({title:value});
     stores.Events.updateTitle("newEventId",value,false).then(()=>{});
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
        let period = moment(this.state.date).format().split("T")[0] + "T" +
        moment(this.state.time).format().split("T")[1]
        this.setState({inputDateValue:moment(period).format().split("T")[0]})      
        stores.Events.updatePeriod("newEventId",period,false).then(()=>{});
      }
    }

    @autobind
    setTime(event, date){
      if (date !== undefined) {
        //deactivate the clock before setting the obtain time
        this.setState({show:false});
        //set time
        this.setState({time:date});
        let period = moment(this.state.date).format().split("T")[0] + "T" +
        moment(this.state.time).format().split("T")[1];
        this.setState({inputTimeValue:moment(period).format().split("T")[1].split("+")[0]});
        stores.Events.updatePeriod("newEventId",period,false).then(()=>{});
    
      }

    }


    render() {
    	return(
          <Modal
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                onClosingState={()=>{this.setState({show:false})}}
                style={{
                    height: height/2 - height/12 , borderRadius: 15,
                    backgroundColor:"#FEFFDE",borderColor:'black',borderWidth:1,width: "98%",
                    marginTop:"-3%"
                }}
                coverScreen={true}
                position={'bottom'}
                //backdropPressToClose={false}
                >

               <View  style={{height:"27%",width:"100%",alignItems:'center',justifyContent:'center',marginTop:"9%"}}>
                   <View>
                   <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"400",fontSize:17}} >Event Title :</Text>
                    <Item  style={{borderColor:'black',width:"95%"}} rounded>
                     <Input placeholder='Please enter event title' maxLength={40} keyboardType='email-address' autoCapitalize="none" returnKeyType='next' inverse last
                      value={this.state.title} onChangeText={(value) => this.onChangedTitle(value)} />
                     </Item>
                    </View>
    
                </View>



       <View style={{height:"37%",marginTop:"8%",flexDirection:"column",justifyContent:"space-between"}}>
            
            <Item rounded style={{flexDirection:"row",height:height/17,marginLeft:"1%",marginRight:"1%"}} >
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
