import React, { Component } from "react";

import { View, Text } from "react-native";
import shadower from "../../shadower";
export default class NewSeparator extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <View style={{ width: 200, height: 30, 
            backgroundColor: 'transparent', 
            borderRadius: 10,
            display:'flex',
            justifyContent: 'center',
            alignSelf: 'center', borderWidth: 1, borderColor: "#fff",...shadower(2) }}>
                <Text style={{ fontWeight: 'bold', marginTop: "1%", alignSelf: 'center' }}>{this.props.newCount && `(${this.props.newCount}) `}  {this.props.data}</Text>
            </View>
        );
    }
}