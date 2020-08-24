import React, { Component } from 'react';
import { View, Text,TouchableOpacity } from "react-native"
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import GState from '../../../stores/globalState';

export default class SelectableAlarmPeriod extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: false
        }
    }
    state = {

    }
    toggleChecked() {
        this.props.mechecked ? this.props.unchecked(this.props.item.id) : this.props.checked(this.props.item)
    }
    render() {
        return (
            <TouchableOpacity style={{
                width: "85%",
                flexDirection: 'row',
                textAlign:'flex-start',
                height:50,
                alignItems: 'center',
            }} onPress={() => this.toggleChecked()} transparent>
            <View style={{width:100}}> 
                    <MaterialIcons style={{...GState.defaultIconSize}} name={
                        this.props.mechecked ? "radio-button-checked" :
                            "radio-button-unchecked"
                    } type={"MaterialIcons"}/>
                </View>
                <View>
                    <Text style={{...GState.defaultTextStyle}}>{this.props.item.text}</Text>
                </View>
                </TouchableOpacity>
        );
    }
}