import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert,Textarea,List,ListItem,Label
} from "native-base";
 
import { StyleSheet, View,Image,TouchableOpacity,FlatList,ScrollView, Dimensions} from 'react-native';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";
import CacheImages from "../../CacheImages";
import PhotoEnlargeModal from "../invitations/components/PhotoEnlargeModal";
import  stores from '../../../stores/index';
import {observer} from 'mobx-react'
import moment from 'moment';
import { head, filter, uniqBy, find } from "lodash";
import AccordionModule from '../invitations/components/Accordion';
import TasksCreation from './TasksCreation';

let {height, width} = Dimensions.get('window')

@observer
export default class EventTasksCard extends Component {
    constructor(props) {
        super(props)
        this.state={
          isOpenTasks:false,
          isDone:this.props.item.isDone,
          created_date:"",
          created_time:"",
          period_date:"",
          period_time:"",
          cardData:this.props.item,
          assignToMe:false,
          userphone:"",
          accordData:{title:"",content:""},
          RemindCreationState:false,
          long:false
        }

    }

@autobind
updateCardData(newRemind){
 //console.warn("update card data",newRemind)
 this.setState({cardData:newRemind});
 let period = moment(this.state.cardData.period).format().split("T");
 this.setState({
   period_date:  period[0] ? period[0] : null,
   period_time:  period[1] ? period[1].split("+")[0] : null
 })
   //console.warn("updated data")
   //setting description data
   if(this.state.cardData.description.length>103){
    this.setState({long:true})
    }
   this.state.accordData.title = this.state.cardData.description.slice(0,103)
   this.state.accordData.content = this.state.cardData.description.slice(103,this.state.cardData.description.length)
   this.setState({accordData:this.state.accordData})

}

componentDidMount(){
  stores.LoginStore.getUser().then((user)=>{
     //console.warn("member is 1",this.state.cardData.members)
     let member = find(this.state.cardData.members,{phone:user.phone})
     //console.warn("member is",member)
     if(!member){
       this.setState({assignToMe:true});
       this.setState({userphone:user.phone});
     }
  })
  let res = moment(this.state.cardData.created_at).format().split("T");
  let period = moment(this.state.cardData.period).format().split("T");
  //console.warn("res is",res);
  this.setState({
    created_date: res[0] ? res[0] : null,
    created_time: res[1] ? res[1].split("+")[0] : null,
    period_date:  period[0] ? period[0] : null,
    period_time:  period[1] ? period[1].split("+")[0] : null
  })

  //setting description data
  if(this.state.cardData.description.length>103){
      this.setState({long:true})
  }
  this.state.accordData.title = this.state.cardData.description.slice(0,103)
  this.state.accordData.content = this.state.cardData.description.slice(103,this.state.cardData.description.length)
  this.setState({accordData:this.state.accordData})
}
 
@autobind
onDone(){
 let newRemind = {remind_id:this.props.item.id,isDone:true}
 stores.Reminds.updateIsDoneState(newRemind).then(()=>{})
 this.setState({isDone:true})
}

@autobind
update(){
  //this.props.navigation.navigate("TasksCreation",{remind_id:this.props.item.id,update_remind:true,updateCardData:this.updateCardData})
  this.refs.task_creation.init();
  this.setState({RemindCreationState:true})
}

@autobind
assignToMe(){
  stores.Events.getPaticipants(this.state.cardData.event_id).then((participants)=>{
  let currentParticipant = find(participants,{phone:this.state.userphone})
  this.state.cardData.members.push( currentParticipant )
  this.setState({cardData:this.state.cardData})
  let newRemind = {remind_id:this.state.cardData.id,members:this.state.cardData.members}
  stores.Reminds.updateMembers(newRemind,true).then(()=>{});
  })
}

    render() {
       
       return(
      <TouchableOpacity  delayLongPress={1000} onLongPress={this.update}>
      <Card style={{marginLeft:"2%",marginRight:"2%"}}>
         <CardItem>
           <Text style={{fontWeight:"500",fontSize:11,color:"#1FABAB",marginLeft:width/2-width/9}} note>Occurs on the {this.state.period_date} at {this.state.period_time}</Text>
         </CardItem>
         
         <CardItem>
           <Left>
           <Text style={{fontWeight:"500",marginLeft:-1,fontSize:17,color:"#696969"}}>{this.state.cardData.title}</Text>
           </Left>
         </CardItem>



         <CardItem  carBody>
           <AccordionModule dataArray={[this.state.accordData]} long={this.state.long}></AccordionModule>
         </CardItem>

         <CardItem style={{width:"100%"}}>
         {this.state.assignToMe?
            <Button  style={{borderWidth: 2,borderRadius:10,borderColor: "#1FABAB",width:"32%",alignItems:'center',justifyContent:'center',marginLeft:"67%"}}
               onPress={() => this.assignToMe()} transparent >
               <Text style={{fontWeight:"500",color:"#696969",fontSize:11}}>Assign To Me</Text>
             </Button>
             :
            (this.state.isDone ?
      
              <Icon type="AntDesign" name="check" style={{ color: "#049F61",marginLeft:"90%"}} name="check"></Icon>
             :
             <Button  style={{borderWidth: 2,marginTop:5,borderRadius:10,borderColor: "#1FABAB",width:"21%",alignItems:'center',justifyContent:'center',marginLeft:"78%"}}
               onPress={() => this.onDone()} transparent >
               <Text style={{fontWeight:"500",color:"#696969",fontSize:12}}>Done</Text>
             </Button>
                   
           
                     )
            
            }
          

         </CardItem>

         <CardItem>
          <Text style={{fontWeight:"500",fontSize:12}} note>Created on the {this.state.created_date} at {this.state.created_time}</Text>
         </CardItem>

         <TasksCreation  ref={"task_creation"} isOpen={this.state.RemindCreationState} onClosed={()=>{this.setState({RemindCreationState:false})}} 
           parentComp={this}  remind_id={this.props.item.id} update={true} 
           updateCardData={this.updateCardData}></TasksCreation>
 
         </Card>
        </TouchableOpacity>

   
   )}

    }