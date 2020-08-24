import React, { Component } from 'react';
import {View} from "react-native"
import { DotIndicator } from 'react-native-indicators';
import ColorList from '../../colorList';

export default class TypingIndicator extends Component {
    constructor(props){
        super(props)
    }
    render(){
        return <View style={{alignSelf: 'flex-start',marginTop: '-10%',}}>
        <DotIndicator size={5} color={ColorList.indicatorColor}></DotIndicator>
        </View>
    }
}