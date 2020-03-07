import React, { Component } from "react";
import {View} from "react-native"

import { Spinner, Icon } from "native-base";
export default class ImageActivityIndicator extends Component {
  render() {
    return (<View>
      <Icon type={"MaterialCommunityIcons"} style={{ fontSize: 40, color:'#1fabab'}} name={"image-filter-vintage"}></Icon>
      </View>);
  }
}
