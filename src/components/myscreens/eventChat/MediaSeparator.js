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
            ...this.props.style,
            backgroundColor: '#0A4E52',
            justifyContent:"center",alignItems:"center" 
        }}><Text   numberOfLine={2}  style={{ fontWeight: 'bold', color: '#FEFFDE',fontSize:15,alignSelf:"center",padding:"8%" }}>{`from ${moment(this.props.item.id).fromNow()}`}</Text></View>
    }
}