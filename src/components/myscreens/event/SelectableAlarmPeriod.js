import React, { Component } from 'react';
import { View } from "react-native"
import { Button, Icon, Text } from 'native-base';

export default class SelectableAlarmPeriod extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: false
        }
    }
    componentDidMount() {
        this.props.item.autoselected ? setTimeout(() => this.toggleChecked() , this.props.timeoute * 10) : null
    }
    state = {

    }
    toggleChecked() {
        this.state.checked ? this.props.unchecked(this.props.item.id) : this.props.checked(this.props.item)
        this.setState({
            checked: !this.state.checked
        })
    }
    render() {
        return (
            <View>
                <Button onPress={() => this.toggleChecked()} transparent>
                    <Icon name={
                        this.state.checked ? "radio-button-checked" :
                            "radio-button-unchecked"
                    } type={"MaterialIcons"}></Icon>
                    <Text>{this.props.item.text}</Text>
                </Button>
            </View>
        );
    }
}