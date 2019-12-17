import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert,Textarea,List,ListItem,Label
} from "native-base";

import { StyleSheet, View,Image,TouchableOpacity,FlatList,ScrollView, Dimensions} from 'react-native';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";
import CacheImages from "../../CacheImages";
import PhotoEnlargeModal from "../invitations/components/PhotoEnlargeModal";
import  stores from '../../../stores/index';
import {observer} from 'mobx-react'



@observer
export default class MyTasksCard extends Component {
    constructor(props) {
        super(props)
        this.state={
          isOpenTasks:false,
          isDone:this.props.item.isDone
        }

    }


@autobind
onDone(){


}


    /*
       <CardItem>
         <Left>
           <TouchableOpacity onPress={() => this.setState({ isOpenTasks: true })} >
             <CacheImages small thumbnails source={{ uri: this.props.item.sender_Image }}
             />
           </TouchableOpacity>
            <Body>
                  <Text>{this.props.item.name}</Text>
            </Body>
         </Left>
         <Right>
           {this.props.item.EventName != null ? <Text>{this.props.item.EventName}</Text>:<Text>("")</Text>}
         </Right>
       </CardItem>
    */

    render() {
       
       return(
      <Card style={{marginLeft:"2%",marginRight:"2%"}}>

         <CardItem>
           <Left/>
           <Text style={{color:'#1FABAB',fontWeight:"500"}}>{this.props.item.title}</Text>
           <Right/>
         </CardItem>

         <CardItem  carBody>
           <Text style={{alignSelf:"center"}}>{this.props.item.description}</Text>
         </CardItem>

         <CardItem style={{width:"100%"}}>

          {this.state.isDone ?
      
             <Icon type="AntDesign" name="check" style={{ color: "#049F61"}} name="check"></Icon>
          
            :
    
               <Button  style={{borderWidth: 2,borderRadius:10,borderColor: "#049F61",width:"21%",alignItems:'center',justifyContent:'center',marginLeft:"76%"}}
                onPress={() => this.onDone()} transparent >
               <Text style={{fontWeight:"500"}}>Done</Text>
              </Button>
        

          }
         </CardItem>

         <CardItem>
          <Text style={{fontWeight:"500",fontSize:15}} note>On the {this.props.item.period.date} at {this.props.item.period.time}</Text>
         </CardItem>
            <PhotoEnlargeModal isOpen={this.state.isOpenTasks} 
            onClosed={() => this.setState({ isOpenTasks: false })} photo={this.props.image} />
         </Card>


   
   )}

    }