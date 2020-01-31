import React, { Component } from "react";
import { BarIndicator } from "react-native-indicators";
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient'
import Svg, { Circle, Rect } from 'react-native-svg'
import { Spinner } from "native-base";
export default class ImageActivityIndicator extends Component {
  render() {
    return (<SvgAnimatedLinearGradient primaryColor="#cdfcfc"
      secondaryColor="#FEFFDE" width={this.props.width ? this.props.width : 60}
      height={this.props.height ? this.props.height : 80}>
      {this.props.rect ? <Spinner size={"small"}></Spinner>:<Circle cx="20" cy="20" r="20" />}
    </SvgAnimatedLinearGradient>);
  }
}
