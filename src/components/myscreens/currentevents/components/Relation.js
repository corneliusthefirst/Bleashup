import React, { Component } from "react";
import { View, TouchableOpacity } from 'react-native';
import { CardItem } from 'native-base';
import PublicEvent from './publicEvent';


export default class Relation extends PublicEvent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  state = {} 
  renderTitle() {
    return null
  }
  renderMap() {
    return null
  }

  renderBody() {
    return this.renderprofile()
  }

  renderMarkAsSeen() {
    return null
  }
  renderFooter() {
    return null
  }

}
