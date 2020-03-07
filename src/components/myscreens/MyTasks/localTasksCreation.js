import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,Toast,
  Button, InputGroup, DatePicker, Thumbnail, Alert
} from "native-base";

import { StyleSheet, View,Image,TouchableOpacity,Dimensions,ScrollView} from 'react-native';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";
import { filter,uniqBy,orderBy,find,findIndex,reject,uniq,indexOf,forEach,dropWhile } from "lodash";
import request from "../../../services/requestObjects";
import stores from '../../../stores/index';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-material-dropdown';
import moment from "moment";
import Textarea from 'react-native-textarea';


var uuid = require('react-native-uuid');
uuid.v1({
  node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
  clockseq: 0x1234,
  msecs: new Date().getTime(),
  nsecs: Math.floor(Math.random() * 5678)+50
});

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
        currentRemind:request.Remind(),
        date:"",
        time:"",
        defaultDate:new Date(),
        defaultTime:new Date(),
       //update:this.props.update_remind?this.props.update_remind:false,
        inputTimeValue:"",
        inputDateValue:"",
        isDateTimePickerVisible: false
        //recurrence:""
      }

    }
   
    @autobind
    init(){
      stores.Reminds.readFromStore().then(Reminds =>{
        //console.warn("reminds are",Reminds);
        let remind = find(Reminds, { id:this.props.remind_id?this.props.remind_id:"newRemindId" });
        //console.warn("remind is",remind );

          this.setState({currentRemind:remind});
         // this.setState({recurrence:this.state.currentRemind.recurrence.toString()});
          
          
          if(remind.period!=""){
            this.setState({date:remind.period});
            this.setState({time:remind.period});
            this.setState({inputDateValue:moment(remind.period).format().split("T")[0]})
            this.setState({inputTimeValue:moment(remind.period).format().split("T")[1].split("+")[0]});
            //console.warn(this.state.time,this.state.date ,"date and time value");
            //console.warn(this.state.inputTimeValue,this.state.inputDateValue ,"dateinput and timeinput value");
           }

    })
    }

    componentDidMount(){
       this.init();
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
         //console.warn("date",date);
         //console.warn("date2",moment(date).format().split("T")[0]);
         //deactivate the date picker before setting the obtain time
         this.setState({ isDateTimePickerVisible: false });
      
         this.setState({date:date});
         if(this.state.time==""){
         let period = moment(this.state.date).format().split("T")[0] + "T" +
         moment().format().split("T")[1]

         this.state.currentRemind.period = period;
         this.setState({currentRemind:this.state.currentRemind})

         this.setState({inputDateValue:moment(period).format().split("T")[0]})
         let newRemind = {remind_id:this.state.currentRemind.id,period:period}
         if(!this.props.update){
            stores.Reminds.updatePeriod(newRemind,false).then(()=>{});
          }

         }else{
          let period = moment(this.state.date).format().split("T")[0] + "T" +
          moment(this.state.time).format().split("T")[1]

          this.state.currentRemind.period = period;
          this.setState({currentRemind:this.state.currentRemind})

          this.setState({inputDateValue:moment(period).format().split("T")[0]})
          let newRemind = {remind_id:this.state.currentRemind.id,period:period}
       
          if(!this.props.update){
           stores.Reminds.updatePeriod(newRemind,false).then(()=>{});
          }
        }
     }
    }
 
     @autobind
     setTime(event, date){
       if (date !== undefined) {
 
         //console.warn("time",date);
         //console.warn("time2",moment(date).format().split("T")[1]);
         //deactivate the clock before setting the obtain time
         this.setState({show:false});
         //set time
         this.setState({time:date});

         if(this.state.date==""){
         let period = moment().format().split("T")[0] + "T" +
         moment(this.state.time).format().split("T")[1];

         this.state.currentRemind.period = period;
         this.setState({currentRemind:this.state.currentRemind})
 
         this.setState({inputTimeValue:moment(period).format().split("T")[1].split("+")[0]});
         let newRemind = {remind_id:this.state.currentRemind.id,period:period}
         if(!this.props.update){
         stores.Reminds.updatePeriod(newRemind,false).then(()=>{});
         }
         }else{
          let period = moment(this.state.date).format().split("T")[0] + "T" +
          moment(this.state.time).format().split("T")[1];

          this.state.currentRemind.period = period;
          this.setState({currentRemind:this.state.currentRemind})
  
          this.setState({inputTimeValue:moment(period).format().split("T")[1].split("+")[0]});
          let newRemind = {remind_id:this.state.currentRemind.id,period:period}
          if(!this.props.update){
          stores.Reminds.updatePeriod(newRemind,false).then(()=>{});
          }
         }
     
       }
 
     }
  
      @autobind
      onChangedTitle(value) { 
        console.warn("here is the update state",this.props.update)
        this.state.currentRemind.title = value;
        this.setState({currentRemind:this.state.currentRemind});
        let NewRemind={remind_id:this.state.currentRemind.id,title:this.state.currentRemind.title}
        if(!this.props.update){
          stores.Reminds.updateTitle(NewRemind,false).then(()=>{});
         }
      }
     
      @autobind
      onChangedDescription(value) { 
        this.state.currentRemind.description = value;
        this.setState({currentRemind:this.state.currentRemind});
        let NewRemind={remind_id:this.state.currentRemind.id,description:this.state.currentRemind.description}
        if(!this.props.update){
          stores.Reminds.updateDescription(NewRemind,false).then(()=>{});
        }
      } 
  

  @autobind
   back() {
    this.props.onClosed();
   }
  @autobind
  setRecursiveFrequency(value){
    this.state.currentRemind.recursive_frequency = value;
    this.setState({currentRemind:this.state.currentRemind});
    let NewRemind={remind_id:this.state.currentRemind.id,recursive_frequency:this.state.currentRemind.recursive_frequency}
    if(!this.props.update){
    stores.Reminds.updateRecursiveFrequency(NewRemind,false).then(()=>{});
    }
  }

  /* 
  @autobind
  onChangedRecurrence(value){
    this.setState({recurrence:value});
    this.state.currentRemind.recurrence = parseInt(value);
    this.setState({currentRemind:this.state.currentRemind});
    let NewRemind={remind_id:this.state.currentRemind.id,recurrence:this.state.currentRemind.recurrence}
     if(!this.props.update){
    stores.Reminds.updateRecurrence(NewRemind,false).then(()=>{});
     }
  } */
  
  @autobind
  resetRemind(){
    this.state.currentRemind = request.Remind();
    this.state.currentRemind.id = "newRemindId";
    this.setState({
      currentRemind:this.state.currentRemind,
      inputDateValue:"",
      inputTimeValue:""
    });
  }

  
  @autobind
  addNewRemind(){

    if(this.state.date == "" || this.state.time==""){
  
      Toast.show({
          text: "Remind date or time cannot be empty !",
          buttonText: "Okay",
          duration:6000,
          buttonTextStyle: { color: "#008000" },
          buttonStyle: { backgroundColor: "#5cb85c" },
          textStyle:{color:"salmon",fontSize:15}
        })
    
      }
      else{

        var arr = new Array(32);
        let num = Math.floor(Math.random() * 16)
        uuid.v1(null, arr,num); 
        let New_id = uuid.unparse(arr,num);
    
        stores.Reminds.readFromStore().then((Reminds)=>{
          let newRemind = request.Remind();
          let remind = find(Reminds, { id:"newRemindId" }); 
          newRemind =  remind;
          console.warn(New_id,"id is")
          newRemind.id = New_id;
         
          stores.LoginStore.getUser().then((user)=>{
            newRemind.creator = user.name;
            newRemind.event_id = user.phone; //user phone is use to uniquely identify locals
            newRemind.created_at = moment().format("YYYY-MM-DD HH:mm");
          })

          //update on screen
           this.props.parentComp.updateData(newRemind);
         
           //add new remind
           stores.Reminds.addReminds(newRemind).then(()=>{});
    
          //reset remind both in store and on screen
           this.resetRemind();
           stores.Reminds.removeRemind("newRemindId").then(()=>{});
           stores.Reminds.addReminds(this.state.currentRemind).then(()=>{});
    
          stores.Reminds.readFromStore().then((reminds)=>{
             console.warn("reminds are",reminds);
          })
        })
    
      }
  
  }
   
  @autobind
  updateRemind(){
   let newRemind={
      remind_id:this.state.currentRemind.id,
      title:this.state.currentRemind.title,
      description:this.state.currentRemind.description,
      recursive_frequency:this.state.currentRemind.recursive_frequency,
      period:this.state.currentRemind.period,
      members:[]
    }
    
    //navigate back to myTasks with updated data
    this.props.parentComp.updateCardData(this.state.currentRemind);
    stores.Reminds.updateAll(newRemind,true).then(()=>{});
    this.resetRemind();
    this.back();
  }

    render(){
        return(
          <Modal
          isOpen={this.props.isOpen}
          onClosed={() => {this.props.onClosed()}}
          style={{
            height:"82%", width: "95%", borderRadius: 10,
            backgroundColor: "#FEFFDE", borderColor: 'black', flexDirection: 'column'
          }}
          coverScreen={true}
          position={'center'}
          swipeToClose={false}
        >
     <View style={{height:"100%",backgroundColor:"#FEFFDE",width:"100%", borderRadius: 10}}>
         

       {/*  <View style={{height:"8%",width:"96%",flexDirection:"row",backgroundColor:"#FEFFDE",alignItems:"center",marginLeft:"2%",marginRight:"2%"}}>
           <View >
             <TouchableOpacity>
                <Icon  onPress={this.back} type='MaterialCommunityIcons' name="keyboard-backspace" style={{color:"#1FABAB"}} />
             </TouchableOpacity>
           </View>

             <View style={{marginLeft:"20%"}}>
               <Text style={{fontSize:16}}>New Tasks/Reminds</Text>
             </View>

         </View>*/}

      <ScrollView ref={"scrollView"}  showsVerticalScrollIndicator={false} >
                <View  style={{height:height/8,alignItems:'center',marginBottom:"-7%"}}>
                   {/*<Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"500",fontSize:16}} >Title :</Text>*/}
                    <Item  style={{borderColor:'black',width:"95%",marginTop:"3%"}} rounded>
                     <Input  maxLength={40} value={this.state.currentRemind.title} maxLength={40}  placeholder='Please enter task title' keyboardType='email-address' returnKeyType='next' inverse last
                      onChangeText={(value) => this.onChangedTitle(value)} />
                     </Item>
               </View>

      <View style={{height:height/4,marginTop:"8%",flexDirection:"column",justifyContent:"space-between"}}>
            
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
    <View style={{marginLeft:"1%",width:width/2-width/8,height:height/18}}>
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
   
   {}

 </View>

    </View>



       <View  style={{height:height/3 + height/26,alignItems:'flex-start',justifyContent:'center'}}>
            <View style={{width:"100%",height:"100%"}}>
                  
             <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"500",fontSize:16}} >Description :</Text>
             <Textarea value={this.state.currentRemind.description} 
             containerStyle={{
              width: "94%", margin: "1%",
              height: height/4,
              borderRadius: 15, borderWidth: 1,
              borderColor: "#9E9E9E",
              backgroundColor: "#f5fffa"
            }}
            placeholder="Highlight Description"
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
       { !this.props.update?
        <TouchableOpacity  style={{width:"20%",alignSelf:'center',marginBottom:"3%",marginLeft:"69%",marginTop:"-8%"}}>
            <Button style={{width:"100%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"#1FABAB",justifyContent:'center',alignItem:'center'}}
               onPress={()=>{this.addNewRemind()}}>
               <Text style={{color:"#FEFFDE",fontSize:12}}> Add </Text>
             </Button> 
        </TouchableOpacity>:
                <TouchableOpacity style={{width:"22%",marginBottom:"1%",marginLeft:"72%",marginTop:"-8%"}}>
                <Button style={{width:"100%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"#1FABAB",justifyContent:'center',alignItem:'center'}}
                   onPress={()=>{this.updateRemind()}}>
                    <Text style={{color:"#FEFFDE",fontSize:12}}>Update</Text>
                 </Button> 
            </TouchableOpacity>
        }

    </ScrollView>
 </View>
</Modal>
        );
    }
}

   /* <View style={{height:height/18,width:width/2-width/28,alignItems:'center',marginTop:-26}}>
        <Text style={{alignSelf:'flex-start',margin:"3%",marginLeft:"6%",fontWeight:"400",fontSize:15,color:"#1FABAB"}} >recurrence :</Text>
           <Item  style={{borderColor:'black',width:"95%",borderRadius:5}} rounded>
            <Input keyboardType = 'numeric'  value={this.state.recurrence} maxLength={3} placeholder='number of repetions'  maxLength={3}  returnKeyType='next' inverse last
            onChangeText={(value) => this.onChangedRecurrence(value)} />
       </Item>
          </View>*/