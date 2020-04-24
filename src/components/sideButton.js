import React, { Component } from "react";
import {Icon } from "native-base";
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






/**     <ActionButton.Item buttonColor='#1CDBAB' title="New Relation" onPress={()=>{this.onClickNewContact()}} size={75}>
            <Icon name="person-add" active={true} type="MaterialIcons" style={styles.actionButtonIcon} />
          </ActionButton.Item>   
          <ActionButton.Item buttonColor='#9b59b6' title=" New Activity  " onPress={()=>{this.onClickNewEvent().then(()=>{})}} size={65}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>   
        <ActionButton.Item buttonColor='#3D90E3' title="Join Activity" onPress={() => { this.navigateToQRScanner() }} size={55}>
          <Icon name="barcode-scan" active={true} type="MaterialCommunityIcons" style={{ color: "#FEFFDE", }} />
        </ActionButton.Item> 
          <ActionButton.Item buttonColor='#1abc9c' title="My Tasks" onPress={() => {this.onClickNewRemind()}} size={45}>
            <Icon name="tasks" type="FontAwesome" style={styles.actionButtonIcon} />
          </ActionButton.Item> */