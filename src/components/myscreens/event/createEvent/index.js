import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert, Toast
} from "native-base";

import {StyleSheet, View,Image,TouchableOpacity, Dimensions} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";
import ImagePicker from 'react-native-image-picker';
import moment from "moment";
import EventTitle from "./components/EventTitle"
import EventPeriod from "./components/EventPeriod"
import EventPhoto from "./components/EventPhoto"
import EventLocation from "./components/EventLocation"
import EventDescription from "./components/EventDescription"
import EventHighlights from "./components/EventHighlights"
import { head,filter,uniqBy,orderBy,find,findIndex,reject,uniq,indexOf,forEach,dropWhile } from "lodash";
import request from "../../../../services/requestObjects";
import  stores from '../../../../stores/index';
import CreateRequest from './CreateRequester';

var uuid = require('react-native-uuid');
uuid.v1({
  node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
  clockseq: 0x1234,
  msecs: new Date().getTime(),
  nsecs: Math.floor(Math.random() * 5678)+50
});


let {height, width} = Dimensions.get('window');

export default class CreateEventView extends Component {
  constructor(props){
    super(props) 

    this.state = {
      EventTitleState:false,
      EventPeriodState:false,
      EventPhotoState:false,
      EventDescriptionState:false,
      EventLocationState:false,
      EventHighlightState:false,
      colorWhenChoosed:"#1FABAB",
      currentEvent:request.Event(),
      participant:null

    }

  }

componentDidMount(){
  stores.Events.readFromStore().then(Events =>{
    let event = find(Events, { id:"newEventId" }); 
    this.setState({ participant: head(event.participant), currentEvent: event})
     console.warn("participant",this.state.participant,this.state.currentEvent );
   });

}

  @autobind
  back() {
    this.props.navigation.navigate('Home');

  }
 
  @autobind
  creatEvent(){
    if(!this.state.currentEvent.about.title){
      Toast.show({text:"An Activity must have a name",duration:5000})
    }else{
      this.setState({
        creating:true
      })
      var arr = new Array(32);
      let num = Math.floor(Math.random() * 16)
      uuid.v1(null, arr, num);
      let New_id = uuid.unparse(arr, num);
        let event = this.state.currentEvent
        event.created_at = moment().format()
        event.updated_at = moment().format()
        let newEvent = event;
        newEvent.id = New_id;
      CreateRequest.createEvent(newEvent).then((res) => {
        console.warn(res)

        //reset new Event object
        stores.Events.delete("newEventId").then(() => {
            this.setState({
              currentEvent:request.Event(),
              creating:false
            })
            this.back()
        });
      /* this.refs.title_ref.setState({ title: "" });
       this.refs.title_ref.setState({ date: "" });
       this.refs.title_ref.setState({ inputTimeValue: "" });
       this.refs.title_ref.setState({ inputDateValue: "" });

       this.refs.photo_ref.setState({ EventPhoto: "" });
       this.refs.description_ref.setState({ description: "" });
       this.refs.location_ref.setState({ location: request.Location() });
       this.refs.highlight_ref.setState({ highlightData: [] });

       stores.Events.readFromStore().then(Events => {
         console.warn(Events);
       })*/

     // })
      }).catch(() => {
        this.setState({
          creating:false
        })
      })
    }
  }

  render() {
     return(
 
        <View style={{height:height,backgroundColor:"#FEFFDE"}}>
          
            <Header style={{backgroundColor:"#FEFFDE",width:"100%",justifyContent:"flex-start"}}> 
              <Button onPress={this.back} transparent>
                <Icon type='Ionicons' name="md-arrow-round-back" style={{color:"#1FABAB",marginLeft:"3%"}} />
              </Button> 
           <View style={{ margin: "5%", alignItems: 'center' }}>
             <Title style={{ fontSize: 18, fontWeight: "500", }}>New Activity</Title>
           </View>  
           </Header>
                <View style={{margin:"5%",flexDirection: 'column',}}>
                <Button transparent onPress={() => {
               this.setState({ EventTitleState: true })

                }}>
             <Icon name={this.state.currentEvent.about.title ? "radio-button-checked" : 
             "radio-button-unchecked"} type={type = "MaterialIcons"}></Icon>
             <Text>{"Activity Name"}</Text>
                </Button>
           <Button transparent onPress={() => {
             this.setState({ EventPeriodState: true })
           }}>
             <Icon name={this.state.currentEvent.period ? "radio-button-checked" :
               "radio-button-unchecked"} type={type = "MaterialIcons"}></Icon>
             <Text>{"Activity Period"}</Text>
           </Button>
           <Button transparent onPress={() => {
             this.setState({ EventDescriptionState: true })
           }}>
             <Icon name={this.state.currentEvent.about.description ? "radio-button-checked" :
               "radio-button-unchecked"} type={type = "MaterialIcons"}></Icon>
             <Text>{"Activity Description"}</Text>
           </Button>
           <Button transparent onPress={() => {
             this.setState({ EventPhotoState: true })
           }}>
             <Icon name={this.state.currentEvent.background ? "radio-button-checked" :
               "radio-button-unchecked"} type={type = "MaterialIcons"}></Icon>
             <Text>{"Activity Photo"}</Text>
           </Button>
           <Button transparent onPress={() => {
             this.setState({ EventLocationState: true })
           }}>
             <Icon name={this.state.currentEvent.location.string ? "radio-button-checked" :
               "radio-button-unchecked"} type={type = "MaterialIcons"}></Icon>
             <Text>{"Activity Location"}</Text>
           </Button>
                </View>

 
         <View style={{ alignSelf: 'flex-end' }}>
           <TouchableOpacity style={{ width: "35%", marginRight: "2%" }} >
            {this.state.creating?<Spinner></Spinner>:<Button onPress={() => { this.creatEvent() }} rounded>
               <Text style={{ color: '#FEFFDE', fontWeight: 'bold', }}>Create</Text>
             </Button>}
           </TouchableOpacity>
         </View>
              
          <EventTitle event={this.state.currentEvent} isOpen={this.state.EventTitleState} onClosed={(title)=>{
                 this.setState({
                   EventTitleState:false,
                   currentEvent:{...this.state.currentEvent,
                    about:{...this.state.currentEvent.about,title:title}}
                  }); }} ref={"title_ref"}  />
              
         <EventPeriod event={this.state.currentEvent} isOpen={this.state.EventPeriodState} onClosed={(period) => {
           this.setState({
             EventPeriodState: false,
             currentEvent: { ...this.state.currentEvent, period: period }
           });
         }} ref={"period_ref"} />
    
    

         <EventPhoto event={this.state.currentEvent}  isOpen={this.state.EventPhotoState} onClosed={(background)=>{
           this.setState({
             EventPhotoState:false,
             currentEvent:{...this.state.currentEvent,
              background:background}
            }
            )}}
                 ref={"photo_ref"} />

         <EventDescription event={this.state.currentEvent} isOpen={this.state.EventDescriptionState}
           onClosed={(dec) => {
             this.setState({
               EventDescriptionState: false,
               currentEvent: {
                 ...this.state.currentEvent,
                 about: {...this.state.currentEvent.about,
                 description: dec }
               }
             })
           }}
           ref={"description_ref"} eventId={"newEventId"} updateDes={false} />

         <EventLocation event={this.state.currentEvent}  isOpen={this.state.EventLocationState} onClosed={(locat)=>{
           this.setState({
             EventLocationState:false,
             currentEvent:{...this.state.currentEvent,
              location:locat}
            })}}
                ref={"location_ref"}  eventId={"newEventId"} updateLoc={false}/>

         <EventHighlights   isOpen={this.state.EventHighlightState} onClosed={()=>{this.setState({EventHighlightState:false})}}
                parentComponent={this} ref={"highlight_ref"} participant={this.state.participant}/>

          </View>
  
          
    )}

}



















/*                    <TouchableOpacity style={{}} onPress={this.props.onClosed}>
                        <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="close" type="EvilIcons" />
                    </TouchableOpacity>
*/