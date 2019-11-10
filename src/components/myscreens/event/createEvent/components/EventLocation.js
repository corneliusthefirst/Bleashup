import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert
} from "native-base";

import { StyleSheet, View,Image,TouchableOpacity,Dimensions} from 'react-native';
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
           location:request.Location()
        }
        stores.Events.readFromStore().then(Events =>{
            let event = find(Events, { id:"newEventId" }); 
            this.state.location.string= event.location.string;
            this.setState({location:this.state.location});
        
        });
    } 
 

  @autobind
    onChangedLocation(value) {
      
      this.state.location.string = value;
      this.setState({location:this.state.location});
      stores.Events.updateLocation("newEventId",this.state.location,false).then(()=>{});
   }

    render() {
     
    	return(


                <Modal
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                style={{
                    height: height/3, borderRadius: 15,
                    backgroundColor:"#FEFFDE",borderColor:'black',borderWidth:1,width: "98%",flexDirection:'column',
                    marginTop:"-2%"
                }}
                coverScreen={true}
                position={'bottom'}
                backdropPressToClose={false}
                
                >


               <View  style={{height:"100%",width:"100%",alignItems:'center',justifyContent:'center',marginTop:"-3%"}}>
                   <View>
                   <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"400",fontSize:18}} >Event Location:</Text>
                    <Item  style={{borderColor:'black',width:"95%"}} rounded>
                     <Input placeholder='Please enter event Location' keyboardType='email-address' autoCapitalize="none" returnKeyType='next' inverse last
                       value={this.state.location.string} onChangeText={(value) => this.onChangedLocation(value)} />
                     </Item>
                    </View>

                    <View style={{height:"6%",alignSelf:'flex-end'}}>
                   <Button style={{width:"15%",borderRadius:8,marginRight:"3%",marginTop:"4%",backgroundColor:'#1FABAB',justifyContent:'center',alignItems:'center'}} onPress={()=>{}}>
                   <Text style={{color:"#FEFFDE"}}>OK</Text>
                   </Button> 
                   </View>
    
                </View>

                </Modal>

    )}

    }