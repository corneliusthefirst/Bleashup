import React, { Component } from 'react';
import { View, TouchableOpacity, Text, } from 'react-native';
import ColorList from '../../../../colorList';
import shadower from '../../../../shadower';

export default class CreateButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View
        style={{
          width: this.props.width,
          alignItems: 'center',
          width: "100%" 
        }}
      >
        <TouchableOpacity style={{
          borderWidth: 1,
          borderColor: ColorList.bodyIcon,
          borderRadius: 20,
          width: 200,
          alignItems: 'center',
          justifyContent: 'center',
          height:40, 
          backgroundColor: ColorList.bodyBackground,
          ...this.props.style,
        }}
          onPress={() => requestAnimationFrame(this.props.action)}
        >
          <Text style={{ 
            color:(this.props.style && this.props.style.color)||ColorList.bodyText, 
            fontWeight: 'bold',
          textAlign:"center" }}>
            {this.props.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
