import React, { Component } from "react";
import {View} from "react-native"

import { Spinner, Icon } from "native-base";
import ColorList from '../../../colorList';
export default class ImageActivityIndicator extends Component {
  render() {
    return (<View>
      <Icon type={"MaterialCommunityIcons"} style={{ fontSize: 40, color:ColorList.indicatorColor}} name={"image-filter-vintage"}></Icon>
      </View>);
  }
}
