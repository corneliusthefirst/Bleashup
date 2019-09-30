import React, { Component } from 'react';
import { BarIndicator } from 'react-native-indicators';


export default class BarIndicat extends Component{
    constructor(props){
        super(props)
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return false         
    }

    render() {
        return (
             <BarIndicator {...this.props}></BarIndicator>
        );
    }
}