import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert,Textarea,List,ListItem,Label
} from "native-base";

import { StyleSheet, View,Image,TouchableOpacity,FlatList,ScrollView,Dimensions} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";
import Swipeout from 'react-native-swipeout';
import HighlightCardDetail from "./HighlightCardDetail";
import  stores from '../../../../../stores/index';
import {observer} from 'mobx-react'
import moment from "moment"
import { filter,uniqBy,orderBy,find,findIndex,reject,uniq,indexOf,forEach,dropWhile } from "lodash";
import request from "../../../../../services/requestObjects";
import EventHighlights from "./EventHighlights"
import BleashupAlert from './BleashupAlert';
import testForURL from '../../../../../services/testForURL';
import CacheImages from '../../../../CacheImages';


let {height, width} = Dimensions.get('window')

export default class HighlightCard extends Component {
    constructor(props) {
        super(props)
        this.state={
          updating:false,
          deleting:false,
          isOpen:false,
          highlight_id:this.props.item.id,
          check:false,
          EventHighlightState:false,
          master:this.props.participant.master==false?this.props.participant.master:true
         }
        
    }


@autobind
update(){
  if(this.props.ancien==true){
    this.refs.highlights.state.currentHighlight = this.props.item;
    this.refs.highlights.setState({update:true});
    this.setState({EventHighlightState:true}); 
    this.refs.highlights.setState({highlightData:[]});
  }else{
      //new highlight update when event is not yet created but highlight already created
      this.props.parentComponent.state.currentHighlight = this.props.item;
      this.props.parentComponent.setState({update:true});
      
  }


}

@autobind
delete(){
  return new Promise((resolve,rejectPromise)=>{
    //console.warn("deleting....")
    //remove the higlight id from event then remove the highlight from the higlights store
    if(this.props.item.event_id == "newEventId"){
      //console.warn("inside if....")
      //console.warn(this.props.item.id);
      stores.Events.removeHighlight(this.props.item.event_id,this.props.item.id,false).then(()=>{});
      //console.warn("inside if 2....");
    }else{
      //console.warn(this.props.item.event_id,"inside if 3....");
      //console.warn( this.props.item.id,"inside if 4....");
      stores.Events.removeHighlight(this.props.item.event_id,this.props.item.id,false).then(()=>{});
    }

    stores.Highlights.removeHighlight(this.props.item.id).then(()=>{});

    this.setState({check:false});
    //reset higlight data
    this.props.deleteHighlight(this.props.item.id);
   
    //console.warn("inside if 5....");

  });
 
}

componentDidMount(){
}



    render() {

      return(
          
          <Card style={{width:width/2 - width/40}}>

          <TouchableOpacity onPress={() => {this.setState({isOpen:true}) }} >
           <CardItem style={{margin:3,height:height/30}}> 
            <Text>{this.props.item.title.length>16?this.props.item.title.slice(0,16)+"..":this.props.item.title}</Text>
           </CardItem>
           <CardItem>
             <View style={{width:"100%",height:height/7}}>
                {testForURL(this.props.item.url.photo) ? <CacheImages thumbnails square style={{ width: "100%", height: height / 7,borderRadius: 8,}} source={{ uri: this.props.item.url.photo}}></CacheImages>:<Thumbnail source={{uri:this.props.item.url.photo}} style={{ flex: 1, width:null,height:null,
              borderRadius:8}} large ></Thumbnail>}
            </View>
           </CardItem>
           <CardItem style={{height:height/18}}>
            <Text>{this.props.item.description.length>18?this.props.item.description.slice(0,18)+"...":this.props.item.description}</Text>
           </CardItem>
            </TouchableOpacity>

           {this.props.participant.master &&
                <CardItem style={{height:height/18}}>
                <Left>
                 <TouchableOpacity onPress={() => {return this.update()}}  style={{marginRight:"15%"}}>
    
                    {this.state.updating ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : 
                    <Icon style={{ fontSize: 16, color: "#1FABAB" }} name="update" type="MaterialCommunityIcons">
                    </Icon>}
                    <Label style={{ fontSize: 12, color: "#1FABAB" }}>Update</Label>
                  </TouchableOpacity>
                 </Left>
                 <Right>
                   <TouchableOpacity onPress={() => {this.setState({check:true})}} style={{marginRight:"15%"}}>
    
                    {this.state.deleting ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : 
                    <Icon name="trash" style={{ fontSize: 16, color: "red" }} type="EvilIcons">
                    </Icon>}
                    <Label style={{ fontSize: 12, color: "red" }} >Delete</Label>
                  </TouchableOpacity>
                 </Right>
               </CardItem> }
      

           <HighlightCardDetail isOpen={this.state.isOpen} item={this.props.item} onClosed={()=>{this.setState({isOpen:false})}}/>
     
           <BleashupAlert  title={"Delete Higlight"}   accept={"Yes"} refuse={"No"} message={" Are you sure you want to delete these highlight ?"} deleteFunction={this.delete} isOpen={this.state.check} onClosed={()=>{this.setState({check:false})}}/>
         
          {this.props.ancien==true &&
           <EventHighlights   isOpen={this.state.EventHighlightState} onClosed={()=>{this.setState({EventHighlightState:false})}}
           parentComponent={this} ref={"highlights"} participant={this.props.participant} event_id={this.props.item.event_id} highlight_id={this.props.item.highlight_id}/>
          }

       </Card>  
        
    )}

    }


