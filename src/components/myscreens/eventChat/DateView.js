import React, { Component } from "react";

import { View } from "react-native";
import { Text } from "native-base";
import moment from "moment"
import dateDisplayer from '../../../services/dates_displayer';
import shadower from "../../shadower";
export default class DateView extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <View style={{ width: 150, height: 30, 
                backgroundColor: "transparent", 
                borderRadius: 10, alignSelf: 'center', borderWidth: 1,
                justifyContent: 'center',
            display:'flex',
             borderColor: "#fff",...shadower(2) }}>
                <Text style={{ fontWeight: 'bold',  alignSelf: 'center' }}>{dateDisplayer(this.props.date)}</Text>
            </View>
        );
    }
}