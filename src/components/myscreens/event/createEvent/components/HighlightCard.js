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
import CacheImages from "../../../../CacheImages";
import Swipeout from 'react-native-swipeout';
import HighlightCardDetail from "./HighlightCardDetail";
import  stores from '../../../../../stores/index';
import {observer} from 'mobx-react'
import moment from "moment"
import { filter,uniqBy,orderBy,find,findIndex,reject,uniq,indexOf,forEach,dropWhile } from "lodash";
import request from "../../../../../services/requestObjects";

import BleashupAlert from './BleashupAlert';


let {height, width} = Dimensions.get('window')

export default class HighlightCard extends Component {
    constructor(props) {
        super(props)
        this.state={
          updating:false,
          deleting:false,
          isOpen:false,
          check:false
         }
        
    }


@autobind
update(){
//new highlight update when event is not yet created but highlight already created
this.props.parentComponent.state.currentHighlight = this.props.item;
this.props.parentComponent.setState({update:true});

}

@autobind
delete(){
  return new Promise((resolve,reject)=>{
    console.warn("deleting....")
    //remove the higlight id from event then remove the highlight from the higlights store
    if(this.props.item.event_id==""){
      console.warn("inside if....")
      console.warn(this.props.item.id);
      stores.Events.removeHighlight("newEventId",this.props.item.id,false).then(()=>{resolve()});
      console.warn("inside if 2....");
    }else{
      console.warn("inside if 3....")
      stores.Events.removeHighlight(this.props.item.event_id,this.props.item.id,false).then(()=>{resolve()});
    }

    stores.Highlights.removeHighlight(this.props.item.id).then(()=>{resolve()});

    this.setState({check:false});
    console.warn("inside if 4....");

  });
 
}

componentDidMount(){
  this.decriptionCut = this.props.item.description.slice(0,25)
}



    render() {

      return(
          
          <Card style={{width:170}}>

          <TouchableOpacity onPress={() => {this.setState({isOpen:true}) }} >
           <CardItem style={{margin:5}}>
            <Text>{this.props.item.title}</Text>
           </CardItem>
           <CardItem>
            <Image source={{uri:this.props.item.url}} style={{width:160,height:100,borderRadius:8}}></Image>
           </CardItem>
           <CardItem>
            <Text>{ this.decriptionCut}...</Text>
           </CardItem>
            </TouchableOpacity>

           <CardItem >
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
           </CardItem>

           <HighlightCardDetail isOpen={this.state.isOpen} item={this.props.item} onClosed={()=>{this.setState({isOpen:false})}}/>
     
           <BleashupAlert   deleteFunction={this.delete} isOpen={this.state.check} onClosed={()=>{this.setState({check:false})}}/>
          
       
         
       </Card>  
        
    )}

    }


