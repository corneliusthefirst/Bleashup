import React, {Component} from "react"

import {View, StatusBar } from 'react-native';

export default class StatusBarWhiter extends Component{
    constructor(props){
        super(props)
    }
    render(){
       return <View>
           <StatusBar animated={true} barStyle="light-content" backgroundColor="black"></StatusBar>
        </View>
    }
}