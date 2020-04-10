import React, { Component } from "react";
import {
  Text, Icon, Header, Title, Spinner,
  Button, Toast,Thumbnail
} from "native-base";

import { StyleSheet, View, Image, TouchableOpacity, Dimensions, BackHandler } from 'react-native';
import autobind from "autobind-decorator";
import moment from "moment";
import EventTitle from "./components/EventTitle"
import EventPeriod from "./components/EventPeriod"
import EventPhoto from "./components/EventPhoto"
import EventLocation from "./components/EventLocation"
import EventDescription from "./components/EventDescription"
import { head, find, } from "lodash";
import request from "../../../../services/requestObjects";
import stores from '../../../../stores/index';
import CreateRequest from './CreateRequester';
import  firebase  from 'react-native-firebase';
import colorList from '../../../colorList';

var uuid = require('react-native-uuid');
uuid.v1({
  node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
  clockseq: 0x1234,
  msecs: new Date().getTime(),
  nsecs: Math.floor(Math.random() * 5678) + 50
});




let { height, width } = Dimensions.get('window');

export default class CreateEventView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      EventTitleState: false,
      EventPeriodState: false,
      EventPhotoState: false,
      EventDescriptionState: false,
      EventLocationState: false,
      EventHighlightState: false,
      colorWhenChoosed: "#1FABAB",
      currentEvent: request.Event(),
      participant: null

    }

  }
  componentWillMount() {
    this.BackHandler = BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this));

  }
  handleBackButton() {
    this.props.navigation.navigate('Home')
    return true
  }
  componentWillUnmount() {
    this.BackHandler.remove()
  }

  componentDidMount() {
    stores.Events.readFromStore().then(Events => {
      let event = find(Events, { id: "newEventId" });
      this.setState({ participant: head(event.participant), currentEvent: event })
      /// TODO: please never remove the line below . it solves a bug which during erronous activity creation
      this.setState({EventTitleState:true})
    });

  }

  @autobind
  back() {
    this.props.navigation.navigate('Home');

  }
  navigateToActivity(event){
    this.props.navigation.navigate('Event',{Event:event,tab:'EventDetails'})
  }

  @autobind
  creatEvent() {
    if (!this.state.currentEvent.about.title) {
      Toast.show({ text: "The activity must have a name", duration: 4000 })
    } else {
      this.setState({
        creating: true
      })
      let event = this.state.currentEvent
      event.created_at = moment().format()
      event.updated_at = moment().format()
      event.recurrence = moment(event.period).add(1, "hours").format()
      let newEvent = event;
      newEvent.id = uuid.v1();
      CreateRequest.createEvent(newEvent).then((res) => {
        //console.warn(res)
        stores.Events.delete("newEventId").then(() => {
          firebase.database().ref(`rooms/${res.id}/${res.id}`).set({ name: 'General', members: res.participant }).then(() => {
            this.setState({
              currentEvent: request.Event(),
              creating: false
            })
            this.navigateToActivity(res)
          })
        });
      }).catch(() => {
        this.setState({
          creating: false
        })
      })
    }
  }

  render() {
    return (
      <View style={{ flex:1, width: "100%" }}>
    
      <View style={{flexDirection: "row",height: colorList.headerHeight,width: colorList.headerWidth,backgroundColor:colorList.headerBackground}}>
        
        <View style={{flex:1,backgroundColor:colorList.headerBackground,flexDirection: "row", alignItems: "flex-start",paddingLeft:"3%"
         }}>
            <View style={{width:"10%",justifyContent:"center",height:"100%"}}>
             <Icon onPress={() => {this.props.navigation.navigate("Home")}}
              style={{ color:colorList.headerIcon}} type={"MaterialIcons"}name={"arrow-back"}></Icon>
            </View>

           <View style={{ justifyContent:"center",height:"100%",width:"37%" }}>
           <Title style={{color:colorList.headerText,fontSize:colorList.headerFontSize,fontWeight:colorList.headerFontweight ,
                                
            }}>New Activity</Title>
           </View>

        </View>
        
    </View>

   <View style={{}}>
   <EventPhoto coverscreen event={this.state.currentEvent} isOpen={this.state.EventPhotoState} onsetImage={(background) => {
        this.setState({currentEvent: {...this.state.currentEvent,background: background}}) }} 
          onsetTitle={(title) => {this.state.currentEvent.about.title = title;
          this.setState({currentEvent:this.state.currentEvent}) }} 
          ref={"photo_ref"} /> 
   </View>




</View>

        
    )
  }

}



















/*   
var radio_props = [
  { label: 'Add activity title', value: 0 },
  { label: 'Add activity period', value: 1 },
  { label: 'Add activity Photo', value: 2 },
  { label: 'Add activity Description', value: 3 },
  { label: 'Add activity Location', value: 4 },
  { label: 'Add activity Hightlights', value: 5 }

];


<TouchableOpacity style={{}} onPress={this.props.onClosed}>
                        <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="close" type="EvilIcons" />
                    </TouchableOpacity>
*/


/**
 * 
      
      <View style={{ height: height, backgroundColor: "#FEFFDE" }}>

        <Header style={{ backgroundColor: "#FEFFDE", width: "100%", justifyContent: "flex-start" }}>
          <Button onPress={this.back} transparent>
            <Icon type='Ionicons' name="md-arrow-round-back" style={{ color: "#1FABAB", marginLeft: "3%" }} />
          </Button>
          <View style={{ margin: "5%", alignItems: 'center' }}>
            <Title style={{ fontSize: 18, fontWeight: "500", }}>New Activity</Title>
          </View>
        </Header>
        <View style={{ margin: "5%", flexDirection: 'column', }}>
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
                      {this.state.creating ? <Spinner></Spinner> : <Button onPress={() => { this.creatEvent() }} rounded>
                        <Text style={{ color: '#FEFFDE', fontWeight: 'bold', }}>Create</Text>
                      </Button>}
                    </TouchableOpacity>
                  </View>
          
                  <EventTitle event={this.state.currentEvent} isOpen={this.state.EventTitleState} onClosed={(title) => {
                    this.setState({
                      EventTitleState: false,
                      currentEvent: {
                        ...this.state.currentEvent,
                        about: { ...this.state.currentEvent.about, title: title }
                      }
                    });
                  }} ref={"title_ref"} />
          
                  <EventPeriod event={this.state.currentEvent} isOpen={this.state.EventPeriodState} onClosed={(period) => {
                    this.setState({
                      EventPeriodState: false,
                      currentEvent: { ...this.state.currentEvent, period: period }
                    });
                  }} ref={"period_ref"} />
          
          
          
                  <EventPhoto closeTemporarily={() => {
                    this.setState({
                      EventPhotoState: false,
                    })
                    setTimeout(() => {
                      this.setState({
                        EventPhotoState: true
                      })
                    }, 600)
                  }}
                    event={this.state.currentEvent} isOpen={this.state.EventPhotoState} onClosed={(background) => {
                      this.setState({
                        EventPhotoState: false,
                        currentEvent: {
                          ...this.state.currentEvent,
                          background: background
                        }
                      }
                      )
                    }}
                    ref={"photo_ref"} />
          
                  <EventDescription event={this.state.currentEvent} isOpen={this.state.EventDescriptionState}
                    onClosed={(dec) => {
                      this.setState({
                        EventDescriptionState: false,
                        currentEvent: {
                          ...this.state.currentEvent,
                          about: {
                            ...this.state.currentEvent.about,
                            description: dec
                          }
                        }
                      })
                    }}
                    ref={"description_ref"} eventId={"newEventId"} updateDes={false} />
          
                  <EventLocation event={this.state.currentEvent} isOpen={this.state.EventLocationState} onClosed={(locat) => {
                    this.setState({
                      EventLocationState: false,
                      currentEvent: {
                        ...this.state.currentEvent,
                        location: locat
                      }
                    })
                  }}
                    ref={"location_ref"} eventId={"newEventId"} updateLoc={false} />
                </View>
          
 */

   
 
 /*<Button transparent onPress={() => {
             this.setState({ EventHighlightState: true })
           }}>
            <Icon name={this.state.currentEvent.highlights.length>0 ? "radio-button-checked" :
               "radio-button-unchecked"} type={type = "MaterialIcons"}></Icon>
             <Text>{"Activity Posts"}</Text>
          </Button>*/
          /*<RadioForm
                     radio_props={radio_props}
                     initial={0}
                     buttonColor={"#1FABAB"}
                     selectedButtonColor={"#1FABAB"}
                     labelStyle={{color:"#0A4E52"}}
                    

                     onPress={(value) => {

                      switch(value){
                        case 0:
                        this.setState({EventTitleState:true})
                        break
                        case 1:
                          this.setState({EventPeriodState:true})
                          break
                        case 2:
                        this.setState({EventPhotoState:true})
                        break
                        case 3:
                        this.setState({EventDescriptionState:true})
                        this.refs.description_ref.init();
                        break
                        case 4:
                         this.setState({EventLocationState:true})
                         this.refs.location_ref.init();
                        break
                        case 5:
                         this.setState({EventHighlightState:true})
                         //this.refs.highlight_ref.setState({animateHighlight:true})
                        break
                        default:
                        this.setState({EventTitleState:true})
                        

                       }
                    }}

                  />*/