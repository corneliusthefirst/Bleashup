import React, { Component } from "react";
import { StyleSheet, View ,TouchableOpacity} from 'react-native';
import ActionButton from 'react-native-action-button';




export default class SideButton extends Component {
  constructor(props){
    super(props)
  }
  

  render() {
    return (

 
        <ActionButton buttonColor={this.props.buttonColor} position={this.props.position} backgroundTappable={true}  
        size={this.props.size} useNativeFeedback={false}
        buttonText={this.props.text}
        onPress={this.props.action}
        offsetX={this.props.offsetX}
        buttonTextStyle={this.props.buttonTextStyle}
        degrees={90}
        offsetY={this.props.offsetY}
        shadowStyle={this.props.shadowStyle}
        renderIcon={this.props.renderIcon}
        >
        </ActionButton>

    );
  }
}


const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white'
  }
});




