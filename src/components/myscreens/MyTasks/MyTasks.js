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
        <View style={{height:"8%",width:"96%",justifyContent:"space-between",flexDirection:"row",backgroundColor:"#FEFFDE",alignItems:"center",marginLeft:"2%",marginRight:"2%"}}>
           <View >
             <TouchableOpacity>
                <Icon  onPress={this.back} type='MaterialCommunityIcons' name="keyboard-backspace" style={{color:"#1FABAB"}} />
             </TouchableOpacity>
           </View>

             <View >
               <Text style={{fontSize:18}}>Tasks / Reminds</Text>
             </View>

              <View >           
               <TouchableOpacity>  
                <Icon type='AntDesign' name="pluscircle" style={{color:"#1FABAB"}} onPress={this.AddRemind} />
               </TouchableOpacity>
             </View>

         </View>

      <View style={{height:"92%"}}>
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