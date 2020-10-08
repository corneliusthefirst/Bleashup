import React, { Component } from "react";
import { MaterialIndicator } from "react-native-indicators";
import ColorList from "./colorList";
import BeComponent from './BeComponent';
export default class Spinner extends BeComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <MaterialIndicator
        color={this.props.color || ColorList.indicatorColor}
        size={
          this.props.big || this.props.size ? 30 : this.props.small ? 10 : 15
        }
      ></MaterialIndicator>
    );
  }
}
