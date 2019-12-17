import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,Root,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,Textarea,
  Button, InputGroup, DatePicker, Thumbnail, Alert
} from "native-base";

import {Linking,StyleSheet, View,Image,TouchableOpacity,TouchableWithoutFeedback, Dimensions,TextInput, Keyboard} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";
import { filter,uniqBy,orderBy,find,findIndex,reject,uniq,indexOf,forEach,dropWhile } from "lodash";
import request from "../../../../../services/requestObjects";
import  stores from '../../../../../stores/index';
//import { TextInput } from "react-native-gesture-handler";


 
let {height, width} = Dimensions.get('window');

export default class EventDescription extends Component {
    constructor(props) {
        super(props)
        this.state ={
           description:"",
           event_id:"",
           update:false
        }
        //this.initialisation();     
    }
    
    @autobind
    init(){
      stores.Events.readFromStore().then(Events =>{
        //console.warn("this is my event id",this.state.event_id); 
        //console.warn("this is also my event id",this.props.eventId); 
        let event = find(Events, { id:this.props.eventId });
        //console.warn("this is my event",event); 
        this.setState({description: event.about.description});
        this.setState({event_id:this.props.eventId});
        this.setState({update:this.props.updateDes?this.props.updateDes:false});
       });
    }

    @autobind
    onChangedEventDescription(value) {
    
      this.setState({description:value});
      if(!this.state.update){
        stores.Events.updateDescription(this.state.event_id,this.state.description ,false).then(()=>{});
      }
    }

    @autobind
    updateDescription(){
      stores.Events.updateDescription(this.state.event_id,this.state.description ,false).then(()=>{});
      this.props.parentComp.state.EventData.about.description = this.state.description;
      this.props.parentComp.setState({EventData:this.props.parentComp.state.EventData});
      this.setState({description:""});
      this.setState({update:false});
      this.props.onClosed();
    }
 
     
    render() {
     

    	return(

           
            <Modal
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                style={{
                    height: height/2+height/30, borderRadius: 15,marginTop:"-3%",
                    backgroundColor:"#FEFFDE",borderColor:'black',borderWidth:1,width: "98%",
                }}
                position={'bottom'}
                backdropPressToClose={false}
                coverScreen={true}
                >
           
                 <View  style={{flex:1,flexDirection:"column"}}>

                   <View style={{height:"10%"}}>
                    <Text style={{alignSelf:'flex-start',marginLeft:"1%",marginTop:"4%",fontWeight:"400",fontSize:18}} >Event Description:</Text>              
                   </View>

                    <View style={{height:"71%"}}>
                    
                      <Textarea style={{borderRadius: 15 ,borderWidth:2,borderColor: '#9E9E9E', backgroundColor : "#f5fffa",height:"100%",width:"98%",marginLeft:"1%",marginRight:"1%",marginTop:"3%"}}
                       placeholder="Please enter event Description"  value={this.state.description}  keyboardType="default" 
                        onChangeText={(value) => this.onChangedEventDescription(value)}/>
                      
                    </View>
             <TouchableWithoutFeedback  onPress={() => Keyboard.dismiss()}>      
               {this.state.update?     
                  <View style={{height:"10%",marginTop:"5%"}}>
                   <TouchableOpacity style={{width:width/4,height:height/18,alignSelf:"flex-end",marginRight:"1%"}} >
                   <Button style={{borderRadius:8,borderWidth:1,marginRight:"2%",backgroundColor:"#FEFFDE",borderColor:'#1FABAB',alignSelf:'flex-end',width:width/4,height:height/18,justifyContent:"center"}} onPress={()=>{this.updateDescription()}}>
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

