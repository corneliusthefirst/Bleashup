import React, { Component } from "react";
import { BarIndicator } from "react-native-indicators";
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient'
import Svg, { Circle, Rect } from 'react-native-svg'
import { Spinner } from "native-base"
export default class ImageActivityIndicator extends Component {
  render() {
    return (<SvgAnimatedLinearGradient primaryColor="#cdfcfc"
      secondaryColor="#FEFFDE" width={this.props.width ? this.props.width : 60}
      height={this.props.height ? this.props.height : 80}>
      <Circle cx="30" cy="30" r="30" />
    </SvgAnimatedLinearGradient>);
  }
}
