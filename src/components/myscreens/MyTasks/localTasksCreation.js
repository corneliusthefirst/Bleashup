import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert,Textarea
} from "native-base";

import { StyleSheet, View,Image,TouchableOpacity,Dimensions,ScrollView} from 'react-native';
import Modal from 'react-native-modalbox';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";
import { filter,uniqBy,orderBy,find,findIndex,reject,uniq,indexOf,forEach,dropWhile } from "lodash";
import request from "../../../services/requestObjects";
import stores from '../../../stores/index';
import globalState from '../../../stores/globalState'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-material-dropdown';


let data = [{
  value: 'none',
}, {
  value: 'Daily',
}, {
  value: 'Monthly',
}, {
  value: 'Yearly',
}];

let {height, width} = Dimensions.get('window')

export default class LocalTasksCreation extends Component {
    constructor(props) {
      super(props)
      this.state={
        period:request.Period(),
        show: false,
        title:"",
        description:"",
        currentRemind:request.remind(),
        date:"",
        defaultDate:{year:2019,month:2,day:16},
        defaultTime:new Date(),
        time:{hours:"",minutes:""},
        inputTimeValue:""
      }

    }

    componentDidMount(){
        stores.Reminds.readFromStore().then(Reminds =>{
            console.warn("reminds are",Reminds);
            let remind = find(Reminds, { id:"newRemindId" });
            console.warn("remind is",remind );
    
              this.setState({currentRemind:remind});
              console.warn("current remind",this.state.currentRemind );
              console.warn("current remind period",this.state.currentRemind.period );
              
             if(remind.period.time.hour!="" && remind.period.time.mins!=""){
              this.setState({inputTimeValue:remind.period.time.hour+" : "+remind.period.time.mins});
              console.warn(this.state.inputTimeValue,"input time value");
              }
              if(remind.period.date.year!=""&&remind.period.date.month!=""&&remind.period.date.day!=""){
                this.setState({date:remind.period.date.year+"/"+remind.period.date.month+"/"+remind.period.date.day});
              }
             

        })
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
        this.state.currentRemind.title = value;
        this.setState({currentRemind:this.currentRemind});
        let NewRemind={remind_id:this.state.currentRemind.id,title:this.state.currentRemind.title}
        stores.Reminds.updatePeriod(NewRemind,false).then(()=>{});
      }
     
      @autobind
      onChangedDescription(value) { 
        this.state.currentRemind.description = value;
        this.setState({currentRemind:this.currentRemind});
        let NewRemind={remind_id:this.state.currentRemind.id,description:this.state.currentRemind.description}
        stores.Reminds.updatePeriod(NewRemind,false).then(()=>{});
      } 
  
  
      @autobind
      onChangedRemindDate(value){
        //this.setState({date:value});
        console.warn(value.getDate(),"day");
        console.warn(value.getFullYear(),"year");
        console.warn(value.getMonth(),"month-1");
        //console.warn(value.getDay(),"month");    
        //functon to decompose the date before storing
        let day = value.getDate();
        let month = value.getMonth();
        let year = value.getFullYear();
        
        this.state.currentRemind.period.date.day = day.toString();
        this.state.currentRemind.period.date.month = month.toString();
        this.state.currentRemind.period.date.year = year.toString();
        this.setState({currentRemind:this.state.currentRemind});
        let NewRemind={remind_id:this.state.currentRemind.id,period:this.state.currentRemind.period}
        stores.Reminds.updatePeriod(NewRemind,false).then(()=>{});
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
  
          this.state.currentRemind.period.time.hour = hours.toString();
          this.state.currentRemind.period.time.mins = minutes.toString();
          this.state.currentRemind.period.time.secs = seconds.toString();
  
          this.setState({currentRemind:this.state.currentRemind});
          
          this.setState({inputTimeValue:hours.toString()+" : "+minutes.toString()});
          let NewRemind={remind_id:this.state.currentRemind.id,period: this.state.currentRemind.period}
          stores.Reminds.updatePeriod(NewRemind,false).then(()=>{});
         
          
        }
  
      }

  @autobind
      back() {
    this.props.navigation.navigate('MyTasksView');
   }
  @autobind
  setRecursiveFrequency(value){
    this.state.currentRemind.recursive_frequency = value;
    this.setState({currentRemind:this.currentRemind});
    let NewRemind={remind_id:this.state.currentRemind.id,recursive_frequency:this.state.currentRemind.recursive_frequency}
    stores.Reminds.updateRecursiveFrequency(NewRemind,false).then(()=>{});
  } 
  @autobind
  onChangedRecurrence(value){
    this.state.currentRemind.recurrence = parseInt(value);
    this.setState({currentRemind:this.currentRemind});
    let NewRemind={remind_id:this.state.currentRemind.id,recurrence:this.state.currentRemind.recurrence}
    stores.Reminds.updateRecurrence(NewRemind,false).then(()=>{});
  } 
  

  @autobind
  AddNewRemind(){

  }
    

    render(){
        return(
       
     <View style={{height:"100%",backgroundColor:"#FEFFDE",width:"100%"}}>
           <ScrollView ref={"scrollView"} >

           <Header style={{backgroundColor:"#FEFFDE"}}>
            <Body>
              <Title style={{fontSize:14,fontWeight:"500",color:"#1FABAB"}}>New Remind/Task </Title>
            </Body>
            <Right>
              <Button onPress={this.back} transparent>
                <Icon type='Ionicons' name="md-arrow-round-back" style={{color:"#1FABAB"}}/>
              </Button>
            </Right>
           </Header>   

                <View style={{height:height/8,alignItems:'center'}}>
                   <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"500",fontSize:16}} >Title :</Text>
                    <Item  style={{borderColor:'black',width:"95%"}} rounded>
                     <Input value={this.state.currentRemind.title} placeholder='Please enter task title' keyboardType='email-address' autoCapitalize="none" returnKeyType='next' inverse last
                      onChangeText={(value) => this.onChangedTitle(value)} />
                     </Item>
               </View>

      <View style={{height:height/4 + height/24,marginTop:"8%",flexDirection:"column",justifyContent:"space-between"}}>
            
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
              this.state.date == ""? "click this input to select date":this.state.date}
              textStyle={{ color: "green" }}
              placeHolderTextStyle={{ color: "#696969" }}
              onDateChange={this.onChangedRemindDate}
              autoCapitalize="none"
            />

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
       

     </Item>
  <View style={{width:"100%",flexDirection:"row",justifyContent:"space-between",marginTop:"3%"}}>
    <View style={{marginLeft:"1%",width:width/2,height:height/18}}>
     <Dropdown label='Recursive Remind' 
     data={data}
     baseColor={"#1FABAB"}
     selectedItemColor={"#1FABAB"}
     labelFontSize={15}
     value={this.state.currentRemind.recursive_frequency}
     onChangeText={this.setRecursiveFrequency}
     pickerStyle={{width:width/2-width/20,marginLeft:width/2,borderRadius:5,backgroundColor:"#FEFFDE",borderWidth:1,borderColor:"#1FABAB"}}
     containerStyle={{borderWidth:1,borderColor:"gray",borderRadius:6,justifyContent:"center",paddingLeft:2}}
      />
   </View>
     <View style={{height:height/18,width:width/2-width/28,alignItems:'center',marginTop:-26}}>
        <Text style={{alignSelf:'flex-start',margin:"3%",marginLeft:"6%",fontWeight:"400",fontSize:15,color:"#1FABAB"}} >recurrence :</Text>
           <Item  style={{borderColor:'black',width:"95%",borderRadius:5}} rounded>
            <Input keyboardType = 'numeric'  value={this.state.currentRemind.recurrence.toString()} placeholder='number of repetions'  maxLength={3}  returnKeyType='next' inverse last
            onChangeText={(value) => this.onChangedRecurrence(value)} />
       </Item>
     </View>
 </View>

    </View>



       <View  style={{height:height/2 - height/25,alignItems:'flex-start',justifyContent:'center'}}>
            <View style={{width:"100%",height:"100%"}}>
                  
             <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"500",fontSize:16}} >Description :</Text>
             <Textarea value={this.state.currentRemind.description}  style={{width:"94%",margin:"3%",height:"70%",borderRadius:15,borderWidth:2,borderColor:"#9E9E9E",backgroundColor:"#f5fffa"}}  placeholder="Please enter highlight description"  onChangeText={(value) => this.onChangedDescription(value)} />

          </View>
        </View>

        <TouchableOpacity style={{width:"90%",alignSelf:'center',marginTop:"1%",marginBottom:"1%"}}>
            <Button style={{width:"100%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"#1FABAB",justifyContent:'center',alignItem:'center'}}
               onPress={()=>{this.AddNewRemind()}}>
               <Text style={{color:"#FEFFDE"}}> Add Local Remind </Text>
             </Button> 
        </TouchableOpacity>

    </ScrollView>
 </View>

        );
    }
}