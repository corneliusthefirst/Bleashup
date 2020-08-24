import React, { Component } from "react";

import { View, Text } from "react-native";
import moment from "moment"
import dateDisplayer from '../../../services/dates_displayer';
import shadower from "../../shadower";
import ColorList from '../../colorList';
import GState from "../../../stores/globalState";
export default class DateView extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <View style={{ width: 150, height: 20, 
                borderRadius: 10, alignSelf: 'center', backgroundColor: ColorList.bodyDarkWhite,
                justifyContent: 'center',
            display:'flex',
             ...shadower(2) }}>
                <Text style={{...GState.defaultTextStyle, fontStyle: 'italic',  alignSelf: 'center' }}>{dateDisplayer(this.props.date)}</Text>
            </View>
        );
    }
}