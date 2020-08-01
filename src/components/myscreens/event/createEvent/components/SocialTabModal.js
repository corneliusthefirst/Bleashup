import React, { Component } from 'react';
import BleashupModal from '../../../../mainComponents/BleashupModal';
import TabModal from '../../../../mainComponents/TabModal';
import Likers from '../../../../Likers';
import { View } from 'react-native';
import ColorList from '../../../../colorList';
import Entypo  from 'react-native-vector-icons/Entypo';
import FontAwesome  from 'react-native-vector-icons/FontAwesome';

export default class SocialTabModal extends TabModal{
  initialize(){
      this.state = {}
  }
  TabHeader(){
      return null
  }
  underlineStyle={
      height:0,
      color:'transparent'
  }
  returnFontSize(index){
      return this.isCurrentTab(index) ? 40 : 18
  }
activeTextStyle={color:ColorList.likeActive}
  backdropOpacity=false
  state = {}
  tabs = [
      {
          heading: () => <Entypo name="thumbs-up" type={"Entypo"} style={{ fontSize: this.returnFontSize(0)}}/>,
          body : () =>  <Likers id={this.props.id}></Likers>
      },
      {
          heading: () => <FontAwesome name={"support"} type={"FontAwesome"} style={{ fontSize: this.returnFontSize(1)}}/>,
          body : () => <View></View>
      }
  ]
}