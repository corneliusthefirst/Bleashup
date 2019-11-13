import React, { Component } from "react";

import { View } from "react-native";
import { Text } from "native-base";
import moment from "moment"
export default class NewSeparator extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <View style={{ width: 300, height: 30, backgroundColor: "#fff", borderRadius: 10, 
            alignSelf: 'center', borderWidth: 1, borderColor: "#fff", }}>
                <Text style={{ fontWeight: 'bold', marginTop: "3%", alignSelf: 'center' }}>{this.props.data}</Text>
            </View>
        );
    }
}