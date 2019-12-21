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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-material-dropdown';
import moment from "moment";

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
        show: false,
        title:"",
        description:"",
        currentRemind:request.remind(),
        date:new Date(),
        time:new Date(),
        defaultDate:new Date(),
        defaultTime:new Date(),
        inputTimeValue:"",
        inputDateValue:"",
        isDateTimePickerVisible: false,
        recurrence:""
      }

    }
   

    componentDidMount(){
        stores.Reminds.readFromStore().then(Reminds =>{
            console.warn("reminds are",Reminds);
            let remind = find(Reminds, { id:"newRemindId" });
            console.warn("remind is",remind );
    
              this.setState({currentRemind:remind});
              this.setState({recurrence:this.state.currentRemind.recurrence.toString()});
             
              
              if(remind.period!=""){
                this.setState({date:remind.period});
                this.setState({time:remind.period});
                this.setState({inputDateValue:moment(remind.period).format().split("T")[0]})
                this.setState({inputTimeValue:moment(remind.period).format().split("T")[1].split("+")[0]});
                console.warn(this.state.time,this.state.date ,"date and time value");
                console.warn(this.state.inputTimeValue,this.state.inputDateValue ,"dateinput and timeinput value");
               }else{
                this.setState({inputDateValue:moment(this.state.defaultDate).format().split("T")[0]})
                this.setState({inputTimeValue:moment(this.state.defaultTime).format().split("T")[1].split("+")[0]});
               }

        })
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
         //this.setState({date:value});
         console.warn("date",date);
         console.warn("date2",moment(date).format().split("T")[0]);
         //deactivate the date picker before setting the obtain time
         this.setState({ isDateTimePickerVisible: false });
      
         this.setState({date:date});
         let period = moment(this.state.date).format().split("T")[0] + "T" +
         moment(this.state.time).format().split("T")[1]
         
        console.warn("period",period);
        this.setState({inputDateValue:moment(period).format().split("T")[0]})
      
        let newRemind = {remind_id:this.state.currentRemind.id,period:period}
        stores.Reminds.updatePeriod(newRemind,false).then(()=>{});
       }
     }
 
     @autobind
     setTime(event, date){
       if (date !== undefined) {
 
         console.warn("time",date);
         console.warn("time2",moment(date).format().split("T")[1]);
         //deactivate the clock before setting the obtain time
         this.setState({show:false});
        
         //set time
         this.setState({time:date});
       
         let period = moment(this.state.date).format().split("T")[0] + "T" +
         moment(this.state.time).format().split("T")[1];
 
         console.warn("period 2",period);
         this.setState({inputTimeValue:moment(period).format().split("T")[1].split("+")[0]});
    
         let newRemind = {remind_id:this.state.currentRemind.id,period:period}
         stores.Reminds.updatePeriod(newRemind,false).then(()=>{});
     
       }
 
     }
  
      @autobind
      onChangedTitle(value) { 
        this.state.currentRemind.title = value;
        this.setState({currentRemind:this.state.currentRemind});
        let NewRemind={remind_id:this.state.currentRemind.id,title:this.state.currentRemind.title}
        stores.Reminds.updateTitle(NewRemind,false).then(()=>{});
      }
     
      @autobind
      onChangedDescription(value) { 
        this.state.currentRemind.description = value;
        this.setState({currentRemind:this.state.currentRemind});
        let NewRemind={remind_id:this.state.currentRemind.id,description:this.state.currentRemind.description}
        stores.Reminds.updateDescription(NewRemind,false).then(()=>{});
      } 
  

  @autobind
   back() {
    this.props.navigation.navigate('MyTasksView');
   }
  @autobind
  setRecursiveFrequency(value){
    this.state.currentRemind.recursive_frequency = value;
    this.setState({currentRemind:this.state.currentRemind});
    let NewRemind={remind_id:this.state.currentRemind.id,recursive_frequency:this.state.currentRemind.recursive_frequency}
    stores.Reminds.updateRecursiveFrequency(NewRemind,false).then(()=>{});
  } 
  @autobind
  onChangedRecurrence(value){
    this.setState({recurrence:value});
    this.state.currentRemind.recurrence = parseInt(value);
    this.setState({currentRemind:this.state.currentRemind});
    let NewRemind={remind_id:this.state.currentRemind.id,recurrence:this.state.currentRemind.recurrence}
    stores.Reminds.updateRecurrence(NewRemind,false).then(()=>{});
  } 
  

  @autobind
  AddNewRemind(){

  }
    

    render(){
        return(
       
     <View style={{height:"100%",backgroundColor:"#FEFFDE",width:"100%"}}>
         

         <View style={{height:"8%",width:"96%",flexDirection:"row",backgroundColor:"#FEFFDE",alignItems:"center",marginLeft:"2%",marginRight:"2%"}}>
           <View >
             <TouchableOpacity>
                <Icon  onPress={this.back} type='MaterialCommunityIcons' name="keyboard-backspace" style={{color:"#1FABAB"}} />
             </TouchableOpacity>
           </View>

             <View style={{marginLeft:"20%"}}>
               <Text style={{fontSize:16}}>New Tasks/Reminds</Text>
             </View>

         </View>

      <ScrollView ref={"scrollView"} >
                <View style={{height:height/8,alignItems:'center'}}>
                   <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"500",fontSize:16}} >Title :</Text>
                    <Item  style={{borderColor:'black',width:"95%"}} rounded>
                     <Input value={this.state.currentRemind.title} maxLength={40}  placeholder='Please enter task title' keyboardType='email-address' autoCapitalize="none" returnKeyType='next' inverse last
                      onChangeText={(value) => this.onChangedTitle(value)} />
                     </Item>
               </View>

      <View style={{height:height/4 + height/24,marginTop:"8%",flexDirection:"column",justifyContent:"space-between"}}>
            
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
            <Input keyboardType = 'numeric'  value={this.state.recurrence} maxLength={3} placeholder='number of repetions'  maxLength={3}  returnKeyType='next' inverse last
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