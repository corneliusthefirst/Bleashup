import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert,Textarea
} from "native-base";

import { StyleSheet, View,Image,TouchableOpacity} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";


 
export default class EventDescription extends Component {
    constructor(props) {
        super(props)

    }

    render() {
    	return(


                <Modal
                isOpen={this.props.parentComponent.state.EventDescriptionState}
                onClosed={()=>{this.props.parentComponent.setState({EventDescriptionState:false})}}
                style={{
                    height: "50%", borderRadius: 15,
                    backgroundColor:"#FEFFDE",borderColor:'black',borderWidth:1,width: "98%",flexDirection:'column'
                }}
                position={'bottom'}
                backdropPressToClose={false}
                coverScreen={true}
                >

                 <View  style={{flex:1,alignItems:'flex-start',justifyContent:'center'}}>

                   <View style={{width:"100%",height:"100%"}}>

                   <View style={{flexDirection:'row',justifyContent:'space-between'}}>

                   <Text style={{alignSelf:'flex-start',marginLeft:"3%",marginTop:"3%",fontWeight:"400",fontSize:18}} >Event Description:</Text>
                  

                   <Button style={{width:"15%",borderRadius:8,marginRight:"2%",marginTop:"2%",backgroundColor:'#1FABAB',justifyContent:'center',alignItems:'center'}} onPress={()=>{}}>
                   <Text style={{color:"#FEFFDE"}}>OK</Text>
                   </Button> 
                   

                   </View>
                   <Textarea style={{width:"94%",marginLeft:"3%",marginRight:"3%",marginTop:"4%",height:"65%"}} bordered placeholder="Please enter event Description"  onChangeText={(value) => this.props.parentComponent.onChangedEventDescription(value)} />

                   </View>

                  <View style={{flex:1,alignSelf:'flex-end'}}>

                   </View>

                  </View>


                </Modal>
    )}

    }