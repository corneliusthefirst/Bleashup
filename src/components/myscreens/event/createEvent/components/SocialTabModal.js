import React, { Component } from 'react';
import BleashupModal from '../../../../mainComponents/BleashupModal';
import TabModal from '../../../../mainComponents/TabModal';
import { Icon } from 'native-base';
import Likers from '../../../../Likers';
import { View } from 'react-native';
import ColorList from '../../../../colorList';

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
          heading: () => <Icon name="thumbs-up" type={"Entypo"} style={{ fontSize: this.returnFontSize(0)}}></Icon>,
          body : () =>  <Likers id={this.props.id}></Likers>
      },
      {
          heading: () => <Icon name="comment-alt" type={"FontAwesome5"} style={{ fontSize: this.returnFontSize(1)}}></Icon>,
          body : () => <View></View>
      }, 
      {
          heading: () => <Icon name={"support"} type={"FontAwesome"} style={{ fontSize: this.returnFontSize(2)}}></Icon>,
          body : () => <View></View>
      }
  ]
}