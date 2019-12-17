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
import globalState from '../../../../../stores/globalState'
import DateTimePicker from '@react-native-community/datetimepicker';

let {height, width} = Dimensions.get('window')

export default class EventTitle extends Component {
    constructor(props) {
      super(props)
      this.state={

          period:request.Period(),
          show: false,
          title:"",
          //date:{year:"",month:"",day:""},this.state.defaultTime.getHours().toString(),this.state.defaultTime.getMinutes().toString()
          date:"",
          defaultDate:{year:2019,month:2,day:16},
          defaultTime:new Date(),
          time:{hours:"",minutes:""},
          inputTimeValue:""
         }

         stores.Events.readFromStore().then(Events =>{
          let event = find(Events, { id:"newEventId" }); 
          
           this.setState({title:event.about.title});
           this.setState({period:event.period});

           //set recursive frequency label and value
          /* this.setState({recursiveFrequency:event.recursiveFrequency})
             let remind =  find(this.state.reminds, { label:event.recursiveFrequency});
             this.setState({radioValue:remind.value});*/

           if(event.period.time.hour!="" && event.period.time.mins!=""){
           this.setState({inputTimeValue:event.period.time.hour+" : "+event.period.time.mins});
           //console.warn(this.state.inputTimeValue,"input time value");
           }
           this.setState({date:event.period.date.year+"/"+event.period.date.month+"/"+event.period.date.day});
           //console.warn(this.state.date,"date");
          });
         
    }

    show = (mode)=> {
      this.setState({
        show: true,
        mode,
      });
    }
  
  
    timepicker = () => {
      this.show('time');
  
    }

    

    @autobind
    onChangedTitle(value) { 
      this.setState({title:value});
      stores.Events.updateTitle("newEventId",value,false).then(()=>{});
    }
   
  


    @autobind
    onChangedEventDate(value){
      //this.setState({date:value});
      console.warn(value.getDate(),"day");
      console.warn(value.getFullYear(),"year");
      console.warn(value.getMonth(),"month-1");
      //console.warn(value.getDay(),"month");    
      //functon to decompose the date before storing
      let day = value.getDate();
      let month = value.getMonth();
      let year = value.getFullYear();
      
      this.state.period.date.day = day.toString();
      this.state.period.date.month = month.toString();
      this.state.period.date.year = year.toString();
      this.setState({period:this.state.period});
      stores.Events.updatePeriod("newEventId",this.state.period,false).then(()=>{});
      

    }
    @autobind
    onChangeEventTime(){
      this.setState({time:value});
      //function to decompose the time before storing

    }

    @autobind
    removeDateError() {
      globalState.dateError = false;
    }
    @autobind
    removeTimeError() {
      globalState.timeError = false;
    }

    setTime = (event, date) => {
      if (date !== undefined) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = Math.floor(Math.random() * 60)+10;
         
        // Use the hour and minute from the date object
        console.warn(hours,"hours");
        console.warn(minutes,"minutes");
        
        //deactivate the clock before setting the obtain time
        this.setState({show:false});

        this.state.period.time.hour = hours.toString();
        this.state.period.time.mins = minutes.toString();
        this.state.period.time.secs = seconds.toString();

        this.setState({period:this.state.period});
        
        this.setState({inputTimeValue:hours.toString()+" : "+minutes.toString()});
        stores.Events.updatePeriod("newEventId",this.state.period,false).then(()=>{});
       


        
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
                backdropPressToClose={false}
                >

               <View  style={{height:"27%",width:"100%",alignItems:'center',justifyContent:'center',marginTop:"9%"}}>
                   <View>
                   <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"400",fontSize:17}} >Event Title :</Text>
                    <Item  style={{borderColor:'black',width:"95%"}} rounded>
                     <Input placeholder='Please enter event title' keyboardType='email-address' autoCapitalize="none" returnKeyType='next' inverse last
                      value={this.state.title} onChangeText={(value) => this.onChangedTitle(value)} />
                     </Item>
                    </View>
    
                </View>



       <View style={{height:"37%",marginTop:"8%",flexDirection:"column",justifyContent:"space-between"}}>
            
            <Item rounded style={{marginLeft:"1%",marginRight:"1%"}} error={globalState.dateError}>
            <Icon
              active
              type="MaterialIcons"
              name="date-range"
              style={{ color: "#1FABAB" }}
            />
            <DatePicker
              //defaultDate={new Date(2019, 6, 18)}
              minimumDate={new Date(this.state.defaultDate.year,this.state.defaultDate.month,this.state.defaultDate.day)}
              //maximumDate={new Date(2019, 5, 31)}
              locale={"en"}
              timeZoneOffsetInMinutes
              modalTransparent={false}
              animationType={"fade"}
              androidMode={"default"}
              placeHolderText={
              this.state.date == "//"? ( globalState.dateError == false
              ? "Select date of event"
              : "Please enter valid event date") :this.state.date 
               
              }
              textStyle={{ color: "green" }}
              placeHolderTextStyle={{ color: "#696969" }}
              onDateChange={this.onChangedEventDate}
              autoCapitalize="none"
            />

            {globalState.dateError == false ? (
              <Text />
            ) : (
              <Icon
                onPress={this.removeDateError}
                type="Ionicons"
                name="close-circle"
                style={{ color: "#00C497" }}
              />
            )}
          </Item>
        
      <Item rounded style={{flexDirection:"row",height:height/17,marginLeft:"1%",marginRight:"1%"}} error={globalState.timeError} >
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
        <Input placeholder="select event time" value={this.state.inputTimeValue} />
        </View>
            
      {this.state.show && <DateTimePicker  mode="time" value={this.state.defaultTime}  display="default" onChange={this.setTime}/>}
       
       <View style={{width:"20%"}} >  
          {globalState.timeError == false ? (
              <Text />
            ) : (
              <Icon
                onPress={this.removeTimeError}
                type="Ionicons"
                name="close-circle"
                style={{ color: "#00C497" }}
              />
            )}
        
        </View>
     </Item>

    </View>



 </Modal>

    )}

    }








/**
 *           recursiveFrequency:"None", 
          reminds: [
            {label:"None", value: 0},
            {label:"Daily", value: 1 },
            {label:"Weekly", value: 2 },
            {label:"Monthly", value: 3}
            ],
            radioValue:0

 *                 <View style={{height:"27%",width:"100%",alignItems:'center'}}>
                  <Text style={{alignSelf:'flex-start',margin:"4%",fontWeight:"400",fontSize:17}} >Recursive Remind Frequency :</Text>
                   <RadioForm
                     radio_props={this.state.reminds}
                     initial={this.state.radioValue}
                     buttonColor={"#1FABAB"}
                     selectedButtonColor={"green"}
                     buttonWrapStyle={{marginRight:20}}
                     formHorizontal={true}
                     labelHorizontal={false}
                     onPress={(value)=>{

                      switch(value){
                        case 1:
                        this.setState({recursiveFrequency:"Daily"})
                        stores.Events.updateRecursiveFrequency("newEventId",this.state.recursiveFrequency,false).then(()=>{});
                        //this.setState({radioValue:1});
                        break
                        case 2:
                          this.setState({recursiveFrequency:"Weekly"})
                          stores.Events.updateRecursiveFrequency("newEventId",this.state.recursiveFrequency,false).then(()=>{});
                          //this.setState({radioValue:2});
                          break
                        case 3:
                          this.setState({recursiveFrequency:"Monthly"})
                          stores.Events.updateRecursiveFrequency("newEventId",this.state.recursiveFrequency,false).then(()=>{});
                          //this.setState({radioValue:3});
                          break 
                        default:
                            this.setState({recursiveFrequency:"None"})
                            stores.Events.updateRecursiveFrequency("newEventId",this.state.recursiveFrequency,false).then(()=>{});
                            //this.setState({radioValue:0});
                            break
                        }                      
                     }}
                     />

                </View>

           <View style={{alignSelf:'flex-end'}}>
             <Button style={{width:"15%",borderRadius:8,marginRight:"3%",backgroundColor:'#1FABAB',justifyContent:'center',alignItems:'center'}} onPress={()=>{}}>
              <Text style={{color:"#FEFFDE"}}>OK</Text>
             </Button> 
           </View>

 */