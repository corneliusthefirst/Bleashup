import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert,Textarea
} from "native-base";

import { StyleSheet, View,Image,TouchableOpacity, Dimensions} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";
import { filter,uniqBy,orderBy,find,findIndex,reject,uniq,indexOf,forEach,dropWhile } from "lodash";
import request from "../../../../../services/requestObjects";
import  stores from '../../../../../stores/index';


 
let {height, width} = Dimensions.get('window');

export default class EventDescription extends Component {
    constructor(props) {
        super(props)
        this.state ={
           description:""
        }
       
        stores.Events.readFromStore().then(Events =>{
          let event = find(Events, { id:"newEventId" }); 
          this.setState({description: event.about.description});
         });
        
    }

    @autobind
    onChangedEventDescription(value) {
      this.setState({description:value});
      stores.Events.updateDescription("newEventId",this.state.description ,false).then(()=>{});
    }

     
    render() {
    	return(


                <Modal
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                style={{
                    height: height/2, borderRadius: 15,
                    backgroundColor:"#FEFFDE",borderColor:'black',borderWidth:1,width: "98%",flexDirection:'column'
                }}
                position={'bottom'}
                backdropPressToClose={false}
                coverScreen={true}
                >

                 <View  style={{flex:1,alignItems:'flex-start',justifyContent:'center'}}>

                   <View style={{width:"100%",height:"100%"}}>

                   <View style={{flexDirection:'row',justifyContent:'space-between'}}>

                   <Text style={{alignSelf:'flex-start',marginLeft:"1%",marginTop:"3%",fontWeight:"400",fontSize:18}} >Event Description:</Text>
                                
                   </View>
                   <Textarea style={{width:"98%",marginLeft:"1%",marginRight:"1%",marginTop:"4%",height:"68%"}} bordered
                     placeholder="Please enter event Description"  value={this.state.description}
                     onChangeText={(value) => this.onChangedEventDescription(value)} />

                  

                  <View style={{flex:1,alignSelf:'flex-end'}}>
                   <Button style={{width:"15%",borderRadius:8,marginRight:"1%",marginTop:"4%",backgroundColor:'#1FABAB',justifyContent:'center',alignItems:'center'}} onPress={()=>{}}>
                   <Text style={{color:"#FEFFDE"}}>OK</Text>
                   </Button> 
                   </View>

                  </View>
                </View>

             </Modal>
    )}

    }