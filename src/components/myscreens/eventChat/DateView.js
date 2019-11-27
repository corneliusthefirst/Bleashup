import React, { Component } from "react";

import { View } from "react-native";
import { Text } from "native-base";
import moment from "moment"
import dateDisplayer from '../../../services/dates_displayer';
export default class DateView extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <View style={{ width: 150, height: 30, backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : "#fff", borderRadius: 10, alignSelf: 'center', borderWidth: 1, borderColor: "#fff", }}>
                <Text style={{ fontWeight: 'bold', marginTop: "3%", alignSelf: 'center' }}>{dateDisplayer(this.props.date)}</Text>
            </View>
        );
    }
}