import React, { Component } from "react";
import {
   Card, CardItem, Text,  Icon, Label,
   Title, Input, Left, Right,
  Button, Thumbnail, 
} from "native-base";

import {  View,TouchableOpacity,Dimensions} from 'react-native';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";
import Swipeout from 'react-native-swipeout';
//import HighlightCardDetail from "./HighlightCardDetail";
import moment from "moment"
import {isEqual } from "lodash";
//import EventHighlights from "./EventHighlights"
import BleashupAlert from './BleashupAlert';
import testForURL from '../../../../../services/testForURL';
import CacheImages from '../../../../CacheImages';
import shadower from "../../../../shadower";


let {height, width} = Dimensions.get('window')

export default class HighlightCard extends Component {
    constructor(props) {
        super(props)
        this.state={
          updating:false,
          deleting:false,
          isOpen:false,
          check:false,
          master:this.props.participant.master==false?this.props.participant.master:true
         }
        
    }


@autobind
update(){
      //new highlight update when event is not yet created but highlight already created
      this.props.parentComponent.state.currentHighlight = this.props.item;
      this.props.parentComponent.setState({update:true});
}
shouldComponentUpdate(nextProps, nextState, nextContext) {
   return this.state.mounted !== nextState.mounted || !isEqual(this.props.item,nextProps.item)
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
    //reset higlight data
    this.props.deleteHighlight(this.props.item.id);
  });
 
}

componentDidMount(){
  setTimeout(() => {
    this.setState({
      mounted:true
    })
  },100)
}


    render() {

      return(
          
          this.state.mounted?<Card style={{width:width/2 - width/40}}>

          <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.showItem(this.props.item)) } >
           <CardItem style={{margin:3,height:height/30}}> 
              <Title style={{ fontSize: 14, color:"#0A4E52",fontWeight: 'bold',}}>{this.props.item.title?this.props.item.title:""}</Title>
           </CardItem>
            <CardItem style={{ width: "90%",backgroundColor: 'transparent', borderRadius: 8, ...shadower(7), alignSelf: 'center',}}>
             <View style={{width:"100%",height:height/7,}}>
                {this.props.item.url && testForURL(this.props.item.url.photo) ? <CacheImages thumbnails square style={{ width: "106%",alignSelf: 'center', height: height / 7,borderRadius: 8,}} source={{ uri: this.props.item.url.photo}}></CacheImages>:
                <Thumbnail source={{uri:this.props.item.url.photo}} style={{ flex: 1, width:null,height:null,
              borderRadius:8}} large ></Thumbnail>}
                {this.props.item.url && (this.props.item.url.video || this.props.item.url.audio) ? <Icon onPress={() => {
                  this.props.showItem(this.props.item)
                }} name={this.props.item.url.video ? "play" : "headset"} style={{
                  fontSize: 50, color: '#1FABAB',
                  position: 'absolute', marginTop: '18%', marginLeft: '35%',
                }} type={this.props.item.url.video ? "EvilIcons" : "MaterialIcons"}>
                </Icon> : null}
            </View>
           </CardItem>
           <CardItem style={{height:height/18}}>
              <Text ellipsizeMode='tail' style={{fontSize: 12,}} numberOfLines={2}>{this.props.item.description?this.props.item.description:null}</Text>
           </CardItem>
            </TouchableOpacity>

           {this.props.participant.master &&
                <CardItem style={{height:height/18}}>
                <Left>
                 <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.update(this.props.item.id))}  style={{marginRight:"15%"}}>
    
                    {this.state.updating ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : 
                    <Icon style={{ fontSize: 16, color: "#1FABAB" }} name="update" type="MaterialCommunityIcons">
                    </Icon>}
                    <Label style={{ fontSize: 12, color: "#1FABAB" }}>Update</Label>
                  </TouchableOpacity>
                 </Left>
                 <Right>
                   <TouchableOpacity onPress={() =>  requestAnimationFrame(() => this.props.deleteHighlight(this.props.item) )} style={{marginRight:"15%"}}>
    
                    {this.state.deleting ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : 
                    <Icon name="trash" style={{ fontSize: 16, color: "red" }} type="EvilIcons">
                    </Icon>}
                    <Label style={{ fontSize: 12, color: "red" }} >Delete</Label>
                  </TouchableOpacity>
                 </Right>
               </CardItem> }
      

           {/*<HighlightCardDetail isOpen={this.state.isOpen} item={this.props.item} onClosed={()=>{this.setState({isOpen:false})}}/>*/}
     
           {/*<BleashupAlert  title={"Delete Higlight"}   accept={"Yes"} refuse={"No"} message={" Are you sure you want to delete these highlight ?"} deleteFunction={this.delete} isOpen={this.state.check} onClosed={()=>{this.setState({check:false})}}/>*/}
         
          {
            /*this.props.ancien==true &&
           <EventHighlights   isOpen={this.state.EventHighlightState} onClosed={()=>{this.setState({EventHighlightState:false})}}
           parentComponent={this} ref={"highlights"} participant={this.props.participant} event_id={this.props.item.event_id} highlight_id={this.props.item.highlight_id}/>
          */
         }

        </Card> : <Card style={{ width: width / 2 - width / 44,height:height/3.5}}></Card>
        
    )}

    }


