import React, { Component } from "react";
import {View} from "react-native"

import { Spinner, Icon } from "native-base";
import ColorList from '../../../colorList';
export default class ImageActivityIndicator extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (<View style={{justifyContent: 'center',...this.props.style,backgroundColor: ColorList.indicatorInverted,}}>
      <Icon type={"MaterialCommunityIcons"} style={{ fontSize: 40, color:ColorList.indicatorColor,alignSelf: 'center',}} name={"image-filter-vintage"}></Icon>
      </View>);
  }
}
