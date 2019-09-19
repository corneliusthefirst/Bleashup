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


export default class EventLocation extends Component {
    constructor(props) {
        super(props)

    } 

    render() {
    	return(


                <Modal
                isOpen={this.props.parentComponent.state.EventLocationState}
                onClosed={()=>{this.props.parentComponent.setState({EventLocationState:false})}}
                style={{
                    height: "35%", borderRadius: 15,
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
                      onChangeText={(value) => this.props.parentComponent.onChangedLocation(value)} />
                     </Item>
                    </View>
    
                </View>

                </Modal>

    )}

    }