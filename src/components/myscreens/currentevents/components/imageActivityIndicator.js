import React, { Component } from "react";
import {View} from "react-native"

import ColorList from '../../../colorList';
import MaterialIconCommunity  from 'react-native-vector-icons/MaterialCommunityIcons';
export default class ImageActivityIndicator extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (<View style={{justifyContent: 'center',...this.props.style,backgroundColor: ColorList.indicatorInverted,}}>
      <MaterialIconCommunity type={"MaterialCommunityIcons"} 
      style={{ fontSize: 40, color:ColorList.indicatorColor,
        alignSelf: 'center',}} name={"image-filter-vintage"} />
      </View>);
  }
}
