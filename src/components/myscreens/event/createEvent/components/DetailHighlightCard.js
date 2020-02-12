import React, { Component } from "react";
import {
  Card, CardItem, Text, Body, Icon, Item, Input, Left, Right, Spinner,
   Button, Thumbnail,Label
 } from "native-base";

import { StyleSheet, View,Image,TouchableOpacity,FlatList,ScrollView,Dimensions} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
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


let {height, width} = Dimensions.get('window')

export default class DetailHighlightCard extends Component {
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
    this.refs.highlights.state.currentHighlight = this.props.item;
    this.refs.highlights.setState({update:true});
    this.setState({EventHighlightState:true}); 
}

@autobind
delete(){
  return new Promise((resolve,rejectPromise)=>{
    if(this.props.item.event_id == "newEventId"){
      stores.Events.removeHighlight(this.props.item.event_id,this.props.item.id,false).then(()=>{});
    }else{
      stores.Events.removeHighlight(this.props.item.event_id,this.props.item.id,false).then(()=>{});
    }
    stores.Highlights.removeHighlight(this.props.item.id).then(()=>{});
    this.setState({check:false});
    this.props.deleteHighlight(this.props.item.id);
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
             <View style={{width:width/2-width/16,height:height/7}}>
            <Thumbnail source={{uri:this.props.item.url.photo}} style={{ flex: 1, width:null,height:null,
              borderRadius:8}} large ></Thumbnail>
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
           <EventHighlights   isOpen={this.state.EventHighlightState} onClosed={()=>{this.setState({EventHighlightState:false})}}
           parentComponent={this} ref={"highlights"} participant={this.props.participant} event_id={this.props.item.event_id} highlight_id={this.props.item.id}/>
          
       </Card>  
        
    )}

    }


