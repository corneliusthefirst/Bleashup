import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert
} from "native-base";

import { StyleSheet, View,Image,TouchableOpacity} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";
import ImagePicker from 'react-native-image-picker';
import moment from "moment";
import EventTitle from "./components/EventTitle"
import EventPhoto from "./components/EventPhoto"
import EventLocation from "./components/EventLocation"
import EventDescription from "./components/EventDescription"
import EventHighlights from "./components/EventHighlights"
import { filter,uniqBy,orderBy,find,findIndex,reject,uniq,indexOf,forEach,dropWhile } from "lodash";
import request from "../../../../services/requestObjects";
import  stores from '../../../../stores/index';

var uuid = require('react-native-uuid');
uuid.v1({
  node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
  clockseq: 0x1234,
  msecs: new Date().getTime(),
  nsecs: Math.floor(Math.random() * 5678)+50
});


var radio_props = [
  {label: 'Event title', value: 0 },
  {label: 'Add Event Photo', value: 1 },
  {label: 'Add Event Description', value: 2},
  {label: 'Add Location', value: 3},
  {label: 'Add Hightlights', value: 4 },
 
];











export default class CreateEventView extends Component {
  constructor(props){
    super(props) 

    this.state = {
      EventTitleState:false,
      EventPhotoState:false,
      EventDescriptionState:false,
      EventLocationState:false,
      EventHighlightState:false,
      colorWhenChoosed:"#1FABAB",
      currentEvent:request.Event()


    }
    stores.Events.readFromStore().then(Events =>{
      let event = find(Events, { id:"newEventId" }); 
       this.state.currentEvent = event;
       //console.warn(this.state.currentEvent );
     });


  }


  @autobind
  back() {
    this.props.navigation.navigate('Invitation');

  }
 
  @autobind
  creatEvent(){
    console.warn("im inside");
    var arr = new Array(32);
    let num = Math.floor(Math.random() * 16)
    uuid.v1(null, arr,num); 
    let New_id = uuid.unparse(arr,num);
    
    console.warn(New_id);
  
    stores.Events.readFromStore().then(Events =>{
      let newEvent = request.Event(); 
      let event = find(Events, { id:"newEventId" }); 
      
      newEvent = event;
      newEvent.id = New_id;
      //gives this new id to all highlights before pushing
      forEach(newEvent.highlights,(highlightId)=>{
        stores.Highlights.readFromStore().then((Highlights)=>{
           let highlight = find(Highlights, { id:highlightId });
           highlight.event_id =  New_id;
           stores.Highlights.updateHighlight(hightlight,false).then(()=>{});
                    
       });

     });

      newEvent.created_at = moment().format("YYYY-MM-DD HH:mm");
      stores.LoginStore.getUser().then((user)=>{
         newEvent.creator_phone = user.creator_phone;
         
      })
      console.warn(newEvent);
      stores.Events.addEvent(newEvent).then(()=>{});

      //reset new Event object
      let reset = request.Event();
      reset.id = "newEventId";
      this.refs.title_ref.setState({title:""});
      this.refs.title_ref.setState({date:""});
      this.refs.title_ref.setState({inputTimeValue:""});

      this.refs.photo_ref.setState({EventPhoto:""});
      this.refs.description_ref.setState({description:""});
      this.refs.location_ref.setState({location:request.Location()});
      this.refs.highlights.setState({highlightData:[]});

      stores.Events.delete(reset.id).then(()=>{});
      stores.Events.addEvent(reset).then(()=>{});
      

    }); 

    stores.Events.readFromStore().then(Events =>{
       console.warn(Events);
    })

  }

  render() {


    return (
 

            <View style={{flex:1,backgroundColor:"#FEFFDE"}}>
            <Header>
            <Body>
              <Title>BleashUp </Title>
            </Body>
            <Right>
              <Button onPress={this.back} transparent>
                <Icon type='Ionicons' name="md-arrow-round-back" />
              </Button>
            </Right>
           </Header>


                <View style={{ margin:"5%", alignItems: 'center' }}>
                  <Text style={{fontSize:18,fontWeight:"500",color:'#1FABAB'}}>Create New Event</Text>
                </View>

   

                <View style={{marginLeft:"5%"}}>
                  <RadioForm
                     radio_props={radio_props}
                     //initial={0}
                     buttonColor={"#1FABAB"}
                     selectedButtonColor={"#1FABAB"}
                     labelStyle={{color:"#0A4E52"}}
                    

                     onPress={(value) => {

                      switch(value){
                        case 0:
                        this.setState({EventTitleState:true})
                        break
                        case 1:
                        this.setState({EventPhotoState:true})
                        break
                        case 2:
                        this.setState({EventDescriptionState:true})
                        this.refs.description_ref.init();
                        break
                        case 3:
                         this.setState({EventLocationState:true})
                         this.refs.location_ref.init();
                        break
                        case 4:
                         this.setState({EventHighlightState:true})
                         this.refs.highlights.setState({animateHighlight:true})
                        break
                        default:
                        this.setState({EventTitleState:false})
                        ;

                       }
                    }}

                    />
                </View>

 
              
               <EventTitle isOpen={this.state.EventTitleState} onClosed={()=>{
                 this.setState({EventTitleState:false}); }} ref={"title_ref"}  />
    

               <EventPhoto  isOpen={this.state.EventPhotoState} onClosed={()=>{this.setState({EventPhotoState:false})}}
                 ref={"photo_ref"} />

               <EventDescription isOpen={this.state.EventDescriptionState} onClosed={()=>{this.setState({EventDescriptionState:false})}}
                 ref={"description_ref"} eventId={"newEventId"} updateDes={false}/>

               <EventLocation  isOpen={this.state.EventLocationState} onClosed={()=>{this.setState({EventLocationState:false})}}
                ref={"location_ref"}  eventId={"newEventId"} updateLoc={false}/>

               <EventHighlights   isOpen={this.state.EventHighlightState} onClosed={()=>{this.setState({EventHighlightState:false})}}
                parentComponent={this} ref={"highlights"}/>


                  <View style={{alignSelf:'flex-end'}}>
                  <TouchableOpacity style={{width:"35%",marginRight:"2%"}} >
                  <Button style={{width:"100%",borderRadius:8,backgroundColor:'#1FABAB'}} onPress={()=>{this.creatEvent()}}>
                  <Text>Create Event</Text>
                  </Button>
                  </TouchableOpacity>
                  </View>


              </View>

          
    );
  }
}



















/*                    <TouchableOpacity style={{}} onPress={this.props.onClosed}>
                        <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="close" type="EvilIcons" />
                    </TouchableOpacity>
*/