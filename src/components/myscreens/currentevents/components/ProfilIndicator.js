import React, { Component } from "react";
import { BarIndicator } from "react-native-indicators";
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient'
import Svg, { Circle, Rect } from 'react-native-svg'
import { Spinner } from "native-base"
export default class ProfileIdicator extends Component {
    render() {
        return (<SvgAnimatedLinearGradient primaryColor="#cdfcfc"
            secondaryColor="#FEFFDE" height={80}>
            <Circle cx="30" cy="30" r="30" />
            <Rect x="75" y="13" rx="4" ry="4" width="100" height="13" />
            <Rect x="75" y="37" rx="4" ry="4" width="50" height="8" />
        </SvgAnimatedLinearGradient>);
    }
}