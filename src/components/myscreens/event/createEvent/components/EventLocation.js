import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert
} from "native-base";

import { StyleSheet, View,Image,TouchableOpacity,TouchableWithoutFeedback,Dimensions,Keyboard} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";
import { filter,uniqBy,orderBy,find,findIndex,reject,uniq,indexOf,forEach,dropWhile } from "lodash";
import request from "../../../../../services/requestObjects";
import  stores from '../../../../../stores/index';

let {height, width} = Dimensions.get('window');

export default class EventLocation extends Component {
    constructor(props) {
        super(props)
        this.state ={
           location:request.Location(),
           event_id:"",
           update:false
        }

    } 
 

  @autobind
  init(){
    stores.Events.readFromStore().then(Events =>{
      let event = find(Events, { id:this.props.eventId });
      this.setState({update:this.props.updateLoc?this.props.updateLoc:false});
      this.state.location.string= event.location.string;
      this.setState({location:this.state.location});
      this.setState({event_id:this.props.eventId});
    });
  }


  @autobind
    onChangedLocation(value) {
      
      this.state.location.string = value;
      this.setState({location:this.state.location});
      if(!this.state.update){
        stores.Events.updateLocation(this.state.event_id,this.state.location,false).then(()=>{});
      }
     
   }

   @autobind
   updateLocation(){
     stores.Events.updateLocation(this.state.event_id,this.state.location,false).then(()=>{});
     this.setState({update:false});
     this.props.parentComp.state.EventData.location.string = this.state.location.string;
     this.props.parentComp.setState({EventData:this.props.parentComp.state.EventData});
     this.setState({location:request.Location()});
     this.props.onClosed();
   }

    render() {
     
    	return(


                <Modal
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                style={{
                    height: height/4+height/24, borderRadius: 15,
                    backgroundColor:"#FEFFDE",borderColor:'black',borderWidth:1,width: "98%",flexDirection:'column'
                  
                }}
                coverScreen={true}
                position={'bottom'}
               //backdropPressToClose={false}
                
                >


               <View  style={{height:"100%",width:"100%",justifyContent:'center'}}>
                   <View>
                   <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"400",fontSize:18}} >Event Location:</Text>
                    <Item  style={{borderColor:'black',width:"95%",alignSelf:'center'}} rounded>
                     <Input placeholder='Please enter event Location' keyboardType='email-address' autoCapitalize="none" returnKeyType='next' inverse last
                       value={this.state.location.string} onChangeText={(value) => this.onChangedLocation(value)} />
                     </Item>
                    </View>

              <TouchableWithoutFeedback  onPress={() => Keyboard.dismiss()}>      
               {this.state.update?     
                  <View style={{height:"20%",marginTop:"5%"}}>
                   <TouchableOpacity style={{width:width/4,height:height/18,alignSelf:"flex-end",marginRight:"2%"}} >
                   <Button style={{borderRadius:8,borderWidth:1,marginRight:"2%",backgroundColor:"#FEFFDE",borderColor:'#1FABAB',alignSelf:'flex-end',width:width/4,height:height/18,justifyContent:"center"}} onPress={()=>{this.updateLocation()}}>
                   <Text style={{color:"#1FABAB"}}>Update</Text>
                   </Button> 
                   </TouchableOpacity>
                   </View> 
                  : <View style={{height:"10%",marginTop:"5%"}}></View>}
              </TouchableWithoutFeedback> 

                </View>

                </Modal>

    )}

    }