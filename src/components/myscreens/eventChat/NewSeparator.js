import React, { Component } from "react";

import { View } from "react-native";
import { Text } from "native-base";
import moment from "moment"
import shadower from "../../shadower";
export default class NewSeparator extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <View style={{ width: 300, height: 30, backgroundColor: "#fff", borderRadius: 10, 
            alignSelf: 'center', borderWidth: 1, borderColor: "#fff",...shadower(2) }}>
                <Text style={{ fontWeight: 'bold', marginTop: "1%", alignSelf: 'center' }}>{this.props.data}</Text>
            </View>
        );
    }
}