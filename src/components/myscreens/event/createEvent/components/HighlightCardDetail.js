import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert,Textarea,List,ListItem,Label
} from "native-base";

import { StyleSheet, View,Image,TouchableOpacity,FlatList,ScrollView,Dimensions} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";
import CacheImages from "../../../../CacheImages";
import Swipeout from 'react-native-swipeout';
 

let {height, width} = Dimensions.get('window')

export default class HighlightCardDetail extends Component {
    constructor(props) {
        super(props)
        this.state={

         }
    }

    render(){
      return(
     <Modal
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                style={{
                    height:height,borderRadius: 3,margin:2,
                    backgroundColor:"#FEFFDE",borderColor:'black',borderWidth:1,width: "99%",flexDirection:'column'
                }}

                coverScreen={true}
            >
           
            <ScrollView>
            <View style={{flex:1}}>
            <View style={{alignItems:'center',justifyContent:'center',height:height/7}}>
               <Text style={{color:'green',fontSize:20,fontWeight:"400"}}>{this.props.item.title}</Text>
            </View>
            <View>
              <Image source={{uri:this.props.item.url}} style={{width:"92%",marginLeft:"4%",marginRight:"4%",marginBottom:"4%",borderRadius:5,height:height/3}}></Image>
            </View>
            <View style={{margin:"5%",fontStyle:'italic'}}>
             <Text>{this.props.item.description}</Text>
            </View>
            </View>
            </ScrollView>
        
            </Modal>



        )
    }
}