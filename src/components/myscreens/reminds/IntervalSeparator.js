import React, { Component } from 'react';
import { View } from 'react-native';
import shadower from '../../shadower';
import { Text } from 'native-base';
import moment from 'moment';
import { format } from '../../../services/recurrenceConfigs';

export default class IntervalSeparator extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <View style={{ margin: '4%',opacity:.7, backgroundColor: this.props.actualInterval ? '#54F5CA' : '#1FABAB', borderRadius: 5, ...shadower(4), height: 40 }}>
            <Text style={{ color: '#FEFFDE', fontWeight: 'bold', alignSelf: 'center', fontSize: 14, marginTop: '2.5%'}} note >{this.props.actualInterval ?  `from ${'now'} -> ${moment(this.props.to, format).calendar()}` :  this.props.first?`started ${moment(this.props.to, format).calendar()}`:`from ${moment(this.props.from,format).calendar()}   ->  ${moment(this.props.to, format).calendar()}`}</Text>
        </View>
    }
}