import React, { Component } from "react";
import { View, Vibration, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

import {
  Card,
  CardItem,
  Text,
  Icon,
  Left,
  Right,
  Footer,
  List,
  ListItem,
  Label,
  Spinner,
  Toast,
  Button
} from 'native-base';
import ProfileSimple from './ProfileViewSimple';
import PublicEvent from './publicEvent';

export default class Relation extends PublicEvent{
constructor(props){
  super(props)
}
  renderTitle(){
    return null
  }
  renderMap(){
        return null
    }
    
    renderBody(){
      return this.renderprofile()
    }
    
    renderMarkAsSeen(){
      return null
    }
    renderFooter(){
      return null
    }
   
}
