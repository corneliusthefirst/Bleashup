import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Icon1 from "react-native-vector-icons/MaterialIcons"
import Icon2 from "react-native-vector-icons/FontAwesome"
import ActionButton from 'react-native-action-button';
import ColorList from '../../../colorList';
import shadower from "../../../shadower";

export default class CreateEvent extends Component {
  constructor(props) {
    super(props);
    this.onClickNewContact = this.onClickNewContact.bind(this)
    this.onClickNewEvent = this.onClickNewEvent.bind(this)
    this.onClickNewRemind = this.onClickNewRemind.bind(this)
    this.navigateToQRScanner = this.navigateToQRScanner.bind(this)
  
  }

  onClickNewEvent() {
    this.props.navigation.navigate("CreateEventView");
  };

  onClickNewRemind(){
    this.props.navigation.navigate("MyTasksView");
  };

  onClickNewContact() {
    this.props.navigation.navigate("Contacts");
  }
  navigateToQRScanner() {
    this.props.navigation.navigate("QR");
  }
  renderIcon(){
  return (
    <View
      style={styles.iconStyle}
    >
      <Icon
        name="plus"
        style={styles.plusIcon}
      />
    </View>
  );
}
  render() {
    return (
      <ActionButton
        buttonColor={ColorList.bodyBackground}
        position="right"
        backgroundTappable={true}
        btnOutRange={ColorList.bodyText}
        size={52}
        useNativeFeedback={false}
        renderIcon={this.renderIcon}
      >
        <ActionButton.Item
          buttonColor="#3D90E3"
          /*title="New Relation"*/ onPress={this.onClickNewContact}
          size={75}
        >
        
          <Icon1
            name="chat-bubble"
            active={true}
            color={styles.actionButtonIcon.color}
            size={styles.actionButtonIcon.fontSize}
            //style={styles.actionButtonIcon}
          />
        </ActionButton.Item>

        <ActionButton.Item
          buttonColor="#663399"
          /*title=" New Activity  "*/
          onPress={this.onClickNewEvent}
          size={65}
        >
          <Icon1
            name={'group-add'}
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>

        <ActionButton.Item
          buttonColor="#cd5c5c"
          /*title="Join Activity"*/ onPress={this.navigateToQRScanner}
          size={55}
        >
          <Icon
            name="barcode-scan"
            active={true}
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>

        <ActionButton.Item
          buttonColor="#1abc9c"
          /*title="All Reminds"*/
          onPress={this.onClickNewRemind}
          size={45}
        >
          <Icon2
            name="tasks"
            type="FontAwesome"
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>
      </ActionButton>
    );
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 23,
    height: 22,
    color: 'white',
  },
  iconStyle: {
    backgroundColor: ColorList.bodyBackground,
    height: 52,
    width: 52,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadower(4),
  },
  plusIcon: { color: ColorList.bodyIcon, fontSize: 27 }
});
