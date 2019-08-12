import React, { Component } from "react";
import { PulseIndicator } from "react-native-indicators";

export default class updateStateIndicator extends Component {
  render() {
    return (
      <PulseIndicator
        size={this.props.size ? this.props.size : 20}
        color={this.props.color ? this.props.color : "#54F5CA"}
      />
    );
  }
}
