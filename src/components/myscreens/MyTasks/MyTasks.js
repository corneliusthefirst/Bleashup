import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert,Textarea,List,ListItem,Label
} from "native-base";

import { StyleSheet, View,Image,TouchableOpacity,FlatList,ScrollView, Dimensions,LayoutAnimation} from 'react-native';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";
import CacheImages from "../../CacheImages";
import MyTasksCard from "./MyTasksCard"
import PhotoEnlargeModal from "../invitations/components/PhotoEnlargeModal";
import  stores from '../../../stores/index';
import {observer} from 'mobx-react'
import BleashupFlatList from '../../BleashupFlatList';
import CreateEvent from '../event/createEvent/CreateEvent';

const MyTasksData = stores.Reminds.MyTasksData


@observer
export default class MyTasksView extends Component {
    constructor(props) {
        super(props)
        this.state={}
    }

@autobind
AddRemind(){
  this.props.navigation.navigate("LocalTasksCreation");
}



@autobind
back() {
  this.props.navigation.navigate('Home');

}

_keyExtractor = (item, index) => item.id

    render() {
       
       return(

      <View style={{flex:1,backgroundColor:'#FEFFDE'}}>
          <Header>
            <Body>
              <Title style={{fontSize:14,fontWeight:"500"}}>Tasks/Reminds </Title>
            </Body>
            <Right>
              <Button onPress={this.back} transparent>
                <Icon type='Ionicons' name="md-arrow-round-back" />
              </Button>
            </Right>
           </Header>

           <TouchableOpacity style={{width:"90%",alignSelf:'center',marginTop:"1%",marginBottom:"1%"}}>
            <Button style={{width:"100%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"#1FABAB",justifyContent:'center',alignItem:'center'}}
               onPress={()=>{this.AddRemind()}}>
               <Text style={{color:"#FEFFDE"}}> Add Local Remind / Task </Text>
             </Button> 
            </TouchableOpacity>

      <View style={{height:"90%"}}>
        <BleashupFlatList 
          initialRender={5}
          renderPerBatch={5}
          onScroll={this._onScroll}
          firstIndex={0}
          keyExtractor={this._keyExtractor}
          dataSource={ MyTasksData}
          renderItem={(item, index) => {
            return (
              <MyTasksCard {...this.props} item={item} key={index} parentCardList={this}>
              </MyTasksCard>
            );
          }}
        >
        </BleashupFlatList >
  

      </View>
   </View>

   
   )}

 }