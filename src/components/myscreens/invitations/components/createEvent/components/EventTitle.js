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

 
export default class EventTitle extends Component {
    constructor(props) {
        super(props)

    }

    render() {
    	return(
          <Modal
                isOpen={this.props.parentComponent.state.EventTitleState}
                onClosed={()=>{this.props.parentComponent.setState({EventTitleState:false})}}
                style={{
                    height: "45%", borderRadius: 15,
                    backgroundColor:"#FEFFDE",borderColor:'black',borderWidth:1,width: "98%",flexDirection:'column',
                    marginTop:"-2%"
                }}
                coverScreen={true}
                position={'bottom'}
                backdropPressToClose={false}
                >

               <View  style={{height:"50%",width:"100%",alignItems:'center',justifyContent:'center'}}>
                   <View>
                   <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"400",fontSize:18}} >Event Title :</Text>
                    <Item  style={{borderColor:'black',width:"95%"}} rounded>
                     <Input placeholder='Please enter event title' keyboardType='email-address' autoCapitalize="none" returnKeyType='next' inverse last
                      onChangeText={(value) => this.props.parentComponent.onChangedTitle(value)} />
                     </Item>
                    </View>
    
                </View>

                <View style={{height:"50%",width:"100%",alignItems:'center'}}>
                  <Text style={{alignSelf:'flex-start',margin:"4%",fontWeight:"400",fontSize:18}} >Remind Frequency :</Text>
                   <RadioForm
                     radio_props={this.props.parentComponent.state.reminds}
                     initial={0}
                     buttonColor={"#1FABAB"}
                     selectedButtonColor={"green"}
                     formHorizontal={true}
                     labelHorizontal={false}
                     onPress={(value)=>{

                      switch(value){
                        case 0:
                        this.props.parentComponent.setState({remindFrequency:'Daily'})
                        break
                        case 1:
                        this.props.parentComponent.setState({remindFrequency:'Weekly'})
                        break
                        case 2:
                        this.props.parentComponent.setState({remindFrequency:'Monthly'})
                        break  
                        }                      
                     }}
                     />

                </View>

                </Modal>

    )}

    }