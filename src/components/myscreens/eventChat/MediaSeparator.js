import React, { PureComponent } from 'react';
import  moment from 'moment';
import { View } from 'react-native';
import { Text } from 'native-base';
import shadower from '../../shadower';
export default class MediaSeparator extends PureComponent{
    constructor(props){
        super(props)
    }
    render(){
        return <View style={{
            width: '22%',
            height: 80, backgroundColor: '#0A4E52',
            borderRadius: 5, padding: '2%', margin: '2%', ...shadower(1)
        }}><Text style={{ fontWeight: 'bold', alignSelf: 'center', color: '#FEFFDE', marginTop: '15%', }}>{`from ${moment(this.props.item.id).fromNow()}`}</Text></View>
    }
}