import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert,Textarea,List,ListItem,Label
} from "native-base";
import { StyleSheet, View,Image,TouchableOpacity,FlatList,ScrollView,Dimensions} from 'react-native';

import Modal from 'react-native-modalbox';

let {height, width} = Dimensions.get('window');

export default class BleashupAlert extends Component {
    constructor(props){
        super(props);
        this.state={
        }
    }

    render(){
        return(

     <Modal
            isOpen={this.props.isOpen}
            onClosed={this.props.onClosed}
            style={{ height:height/4, borderRadius:10,
            backgroundColor:"#FEFFDE",borderColor:'black',width: "80%",flexDirection:'column'  }}
            coverScreen={true}
            position={'center'}
            swipeToClose={false}
            //backdropPressToClose={false}
          > 

         
           <View style={{flex:1,justifyContent:"space-between",flexDirection:"column"}}>
              <View style={{flex:1}} >
                <Text style={{fontSize:17,fontWeight:"500",color:"#1FABAB",alignSelf:"center",marginTop:"2%",marginRight:"3%"}}>
                  {this.props.title}
                </Text>
              </View>

             <View style={{flex:4,justifyContent:"space-between",margin:"4%"}}>
               <Text>
                 {this.props.message}
               </Text>
             </View>

            <View style={{flex:3,flexDirection:"row",justifyContent:"flex-end"}}>
            <TouchableOpacity style={{width:"21%",marginRight:"5%"}}>
            <Button style={{width:"100%",borderRadius:15,borderColor:"red",backgroundColor:"#1FABAB",justifyContent:'center',alignItem:'center'}}
               onPress={this.props.onClosed}>
                    <Text style={{color:"#FEFFDE"}}>{this.props.refuse}</Text>
            </Button> 
            </TouchableOpacity>
            <TouchableOpacity style={{width:"20%",marginRight:"4%"}}>
            <Button style={{width:"100%",borderRadius:15,borderColor:"green",backgroundColor:"salmon",justifyContent:'center',alignItem:'center'}}
               onPress={this.props.deleteFunction}>
                    <Text style={{color:"#FEFFDE"}}>{this.props.accept}</Text>
            </Button> 
            </TouchableOpacity>

            </View>

           </View>
         </Modal>

        );
    }
}