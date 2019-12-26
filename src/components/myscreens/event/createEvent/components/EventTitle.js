import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, Thumbnail, Alert
} from "native-base";

import { StyleSheet, View,Image,TouchableOpacity,TouchableWithoutFeedback,Dimensions,Keyboard} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";
import { filter,uniqBy,orderBy,find,findIndex,reject,uniq,indexOf,forEach,dropWhile } from "lodash";
import request from "../../../../../services/requestObjects";
import  stores from '../../../../../stores/index';


let {height, width} = Dimensions.get('window')

export default class EventTitle extends Component {
    constructor(props) {
      super(props)
      this.state={
          title:"",
          update:false,
          event_id:""
         }
         
    }

    @autobind
    init(){
      stores.Events.readFromStore().then(Events =>{
        let event = find(Events, { id:this.props.eventId });
        this.state.title= event.about.title;
        this.setState({
          update:this.props.updateTitle?this.props.updateTitle:false,
          title:this.state.title,
          event_id:this.props.eventId
        });
      });
    }

   componentDidMount(){
    stores.Events.readFromStore().then(Events =>{
        let event = find(Events, { id:"newEventId" }); 

          this.setState({title:event.about.title});
         
   });
      
 }


   @autobind
   onChangedTitle(value) { 
     this.setState({title:value});
     if(!this.state.update){
     stores.Events.updateTitle("newEventId",value,false).then(()=>{});
     }
   }
   
   @autobind
   updateTitle(){
     stores.Events.updateTitle(this.state.event_id,this.state.title,false).then(()=>{});
     this.setState({update:false});
     this.props.parentComp.state.EventData.title = this.state.title;
     this.props.parentComp.setState({EventData:this.props.parentComp.state.EventData});
     this.setState({title:""});
     this.props.onClosed();
   }



    render() {
    	return(
          <Modal
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                onClosingState={()=>{this.setState({show:false})}}
                style={{
                    height: height/4  , borderRadius: 15,
                    backgroundColor:"#FEFFDE",borderColor:'black',borderWidth:1,width: "98%",
                    marginTop:"-3%"
                }}
                coverScreen={true}
                position={'bottom'}
                >

          <View  style={{height:"100%",width:"100%",justifyContent:'center'}}>
                   <View>
                   <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"400",fontSize:18}} >Activity Title:</Text>
                    <Item  style={{borderColor:'black',width:"95%",alignSelf:'center'}} rounded>
                     <Input  maxLength={40} placeholder='Please enter event title' keyboardType='email-address' autoCapitalize="none" returnKeyType='next' inverse last
                       value={this.state.title} onChangeText={(value) => this.onChangedTitle(value)} />
                     </Item>
                    </View>

              <TouchableWithoutFeedback  onPress={() => Keyboard.dismiss()}>      
               {this.state.update &&   
                  <View style={{height:"20%",marginTop:"3%"}}>
                   <TouchableOpacity style={{width:width/4,height:height/18,alignSelf:"flex-end",marginRight:"2%"}} >
                   <Button style={{borderRadius:8,borderWidth:1,marginRight:"2%",backgroundColor:"#FEFFDE",borderColor:'#1FABAB',alignSelf:'flex-end',width:width/4,height:height/18,justifyContent:"center"}} onPress={()=>{this.updateTitle()}}>
                   <Text style={{color:"#1FABAB"}}>Update</Text>
                   </Button> 
                   </TouchableOpacity>
                   </View> 
                }
              </TouchableWithoutFeedback> 

           </View>


      </Modal>

    )}

    }
