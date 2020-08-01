import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import shadower from '../../shadower';
import moment from 'moment';
import { format } from '../../../services/recurrenceConfigs';
import ColorList from '../../colorList';

export default class IntervalSeparator extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.onPress && this.props.onPress())} style={{ margin: '4%', opacity: .7, backgroundColor: this.props.actualInterval ? ColorList.indicatorInverted : ColorList.bodyBackground, borderRadius: 5, ...shadower(1), height: 40 }}>
            <Text style={{ fontWeight: 'bold', alignSelf: 'center', fontSize: 14, marginTop: '2.5%', color: this.props.actualInterval ? ColorList.bodyIcon : ColorList.bodyIcon}} note >{this.props.actualInterval ?  `from ${'now'} -> ${moment(this.props.to, format).calendar()}` :  this.props.first?`started ${moment(this.props.to, format).calendar()}`:`from ${moment(this.props.from,format).calendar()}   ->  ${moment(this.props.to, format).calendar()}`}</Text>
        </TouchableOpacity>
    }
}