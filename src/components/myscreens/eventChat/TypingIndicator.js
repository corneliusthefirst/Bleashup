import React, { Component } from 'react';
import { View } from 'native-base';
import { DotIndicator } from 'react-native-indicators';

export default class TypingIndicator extends Component {
    constructor(props){
        super(props)
    }
    render(){
        return <View style={{alignSelf: 'flex-start',marginTop: '-10%',}}>
        <DotIndicator size={5} color="#1FABAB"></DotIndicator>
        </View>
    }
}