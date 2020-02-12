import React, { Component } from "react";
import {View} from "react-native"
import { BarIndicator } from "react-native-indicators";
import { Spinner, Icon } from "native-base"
export default class ProfileIdicator extends Component {
    render() {
        return (<View>
            <Icon name={"profile"} type={"AntDesign"} style={{color:'#1fabab',fontSize: 40,}}></Icon>
            </View>);
    }
}