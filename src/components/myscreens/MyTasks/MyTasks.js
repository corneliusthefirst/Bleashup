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
import MyTasksCard from "./MyTasksCard"
import PhotoEnlargeModal from "../invitations/components/PhotoEnlargeModal";
import  stores from '../../../stores/index';
import {observer} from 'mobx-react'
import BleashupScrollView from '../../BleashupScrollView';


const MyTasksData = stores.Reminds.MyTasksData


@observer
export default class MyTasksView extends Component {
    constructor(props) {
        super(props)
        this.state={
         

        }

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
      <View style={{height:"95%"}}>
        <BleashupScrollView
          initialRender={5}
          renderPerBatch={5}
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
        </BleashupScrollView>

      </View>
   </View>

   
   )}

 }