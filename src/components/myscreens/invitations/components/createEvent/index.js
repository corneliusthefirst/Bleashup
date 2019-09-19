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

import EventTitle from "./components/EventTitle"
import EventPhoto from "./components/EventPhoto"
import EventLocation from "./components/EventLocation"
import EventDescription from "./components/EventDescription"
import EventHighlights from "./components/EventHighlights"

var radio_props = [
  {label: 'Event title', value: 0 },
  {label: 'Add Event Photo', value: 1 },
  {label: 'Add Event Description', value: 2},
  {label: 'Add Location', value: 3},
  {label: 'Add Hightlights', value: 4 },
 
];


const options = {
  title: 'Select Avatar',
  //customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};








export default class CreateEventView extends Component {
  constructor(props){
    super(props)

    this.state = {
      EventTitleState:true,
      EventPhotoState:false,
      EventDescriptionState:false,
      EventLocationState:false,
      EventHighlightState:false,
      colorWhenChoosed:"#1FABAB",

      event_title:'',
      remindFrequency:'Daily',
      reminds: [
       {label: '  Daily  ', value: 0 },
       {label: '  Weekly ', value: 1 },
       {label: '  Monthly', value: 2}
       ]



    }



  }

  @autobind
  onChangedTitle(text) {
    this.setState({ event_title: text });

  }

 @autobind
 onChangedLocation(text) {
    this.setState({EventLocationState: text });

  }

 @autobind
 onChangedEventDescription(text) {
    this.setState({EventDescriptionState: text });

  }




@autobind
TakePhotoFromCamera(){

return new Promise((resolve, reject) => {

ImagePicker.launchCamera(options, (response) => {

  if (response.didCancel) {
    console.log('User cancelled image picker');
  } else if (response.error) {
    console.log('ImagePicker Error: ', response.error);
  } else if (response.customButton) {
    console.log('User tapped custom button: ', response.customButton);
  } else {
    const source = { uri: response.uri };
 
    // You can also display the image using data:
    // const source = { uri: 'data:image/jpeg;base64,' + response.data };
 
   resolve(source)

  }



  })
})

 }

@autobind
TakePhotoFromLibrary(){
return new Promise((resolve, reject) => {
ImagePicker.launchImageLibrary(options, (response) => {
 
  if (response.didCancel) {
    console.log('User cancelled image picker');
  } else if (response.error) {
    console.log('ImagePicker Error: ', response.error);
  } else if (response.customButton) {
    console.log('User tapped custom button: ', response.customButton);
  } else {
    const source = { uri: response.uri };
 
    // You can also display the image using data:
    // const source = { uri: 'data:image/jpeg;base64,' + response.data };
 
       resolve(source)
    }
   
 })

})

}



  @autobind
  back() {
    this.props.navigation.navigate('Invitation');

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
                        break
                        case 3:
                         this.setState({EventLocationState:true})
                        break
                        case 4:
                         this.setState({EventHighlightState:true})
                         this.refs.highlights.setState({animateHighlight:true})
                        break
                        default:
                        this.setState({EventTitleState:true})

                       }
                    }}

                    />
                </View>


              
               <EventTitle        parentComponent={this} />
               <EventPhoto        parentComponent={this}/>
               <EventDescription  parentComponent={this}/>
               <EventLocation     parentComponent={this}/>
               <EventHighlights    parentComponent={this} ref={"highlights"}/>


                  <View style={{alignSelf:'flex-end'}}>
                  <Button style={{width:"35%",borderRadius:8,marginRight:"2%",backgroundColor:'#1FABAB'}} onPress={()=>{ this.setState({HighlightState:true})}}>
                  <Text>Create Event</Text>
                  </Button>
                  </View>


              </View>

          
    );
  }
}



















/*                    <TouchableOpacity style={{}} onPress={this.props.onClosed}>
                        <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="close" type="EvilIcons" />
                    </TouchableOpacity>
*/