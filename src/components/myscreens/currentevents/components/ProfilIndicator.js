import React, { Component } from "react";
import {View} from "react-native"
import  AntDesign  from 'react-native-vector-icons/AntDesign';
export default class ProfileIdicator extends Component {
    render() {
        return (<View>
            <AntDesign name={"profile"} type={"AntDesign"} style={{color:'#1fabab',fontSize: 40,}}/>
            </View>);
    }
}