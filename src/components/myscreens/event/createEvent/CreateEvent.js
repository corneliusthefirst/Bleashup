import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Icon1 from "react-native-vector-icons/MaterialIcons"
import Icon2 from "react-native-vector-icons/FontAwesome"
import ActionButton from 'react-native-action-button';
import ColorList from '../../../colorList';
import shadower from "../../../shadower";
import  Feather  from 'react-native-vector-icons/Feather';
import GState from '../../../../stores/globalState/index';
import BeNavigator from '../../../../services/navigationServices';
import Texts from '../../../../meta/text';

export default class CreateEvent extends Component {
  constructor(props) {
    super(props);
    this.onClickNewContact = this.onClickNewContact.bind(this)
    this.onClickNewEvent = this.onClickNewEvent.bind(this)
    this.navigateToQRScanner = this.navigateToQRScanner.bind(this)
  
  }

  onClickNewEvent() {
    BeNavigator.navigateToCreateEvent();
  };

  onClickNewContact() {
    BeNavigator.navigateToContacts();
  }
  navigateToQRScanner() {
    BeNavigator.navigateToQR();
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
        style={{
          marginBottom: "4%",
        }}
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
          title={Texts.contacts} onPress={this.onClickNewContact}
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
          title={Texts.new_activity}
          onPress={this.onClickNewEvent}
          size={65}
        >
          <Feather
            name={'users'}
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>

        <ActionButton.Item
          buttonColor="#cd5c5c"
          title={Texts.join_activity_via_qr} onPress={this.navigateToQRScanner}
          size={55}
        >
          <Icon
            name="barcode-scan"
            active={true}
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
  plusIcon: { color: ColorList.indicatorColor, fontSize: 30 }
});
