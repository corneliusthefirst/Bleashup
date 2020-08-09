import React, { Component } from "react";
import {
  View, TouchableOpacity,
  TouchableWithoutFeedback, Dimensions, //Keyboard
} from 'react-native';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";
import stores from '../../../../../stores/index';
import colorList from '../../../../colorList';
import CreateTextInput from './CreateTextInput';
import CreateButton from "./ActionButton";
import BleashupModal from '../../../../mainComponents/BleashupModal';


let { height, width } = Dimensions.get('window');

export default class EventDescription extends BleashupModal {
  initialize() {
    this.state = {
      description: "",
      event_id: "",
      update: false
    }
  }

  @autobind
  init() {
    this.setStatePure({
      description: this.props.event.about.description,
      event_id: this.props.event.id,
      update: this.props.updateDes ? this.props.updateDes : false
    });
  }
  componentDidMount() {
    this.init()
  }
  /*componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow.bind(this));
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide.bind(this));
  }*/
  /*handleKeyboardDidShow() {
    this.keyboardDissmissed = false
  }
  handleKeyboardDidHide() {
    console.warn("hidding keyboard !!")
    this.keyboardDissmissed = true
  }*/
  componentDidUpdate(prevProps, prevState) {
    if (this.props.event.about.description !== prevProps.event.about.description) {
      this.init()
    }
  }
  /*componentWillUnmount() {
    this.keyboardDidHideSub.remove();
    this.keyboardDidShowSub.remove()
  }*/
  @autobind
  onChangedEventDescription(value) {

    this.setStatePure({ description: value });
    if (!this.state.update) {
      stores.Events.updateDescription(this.state.event_id, value, false).then(() => { });
    }
  }
  keyboardDissmissed = false
  @autobind
  updateDescription() {
    /*if (!this.keyboardDissmissed) {
      this.keyboardDissmissed = true
      Keyboard.dismiss()
    } else {*/
      this.state.description !== this.props.event.about.description ? this.props.updateDesc(this.state.description) : null
      this.props.onClosed();
  //  }
  }

  position = "center"
  entry = "top"
  borderRadius = 25
  borderTopLeftRadius = 25
  borderTopRightRadius = 25
  modalHeight = 290
  swipeToClose = false
  modalWidth = "82%"
  borderWidth = 1
  onClosedModal() {
    this.props.onClosed(this.state.description)
  }
  modalBody() {


    return (
      <View style={{ height: "100%", flexDirection: "column" }}>
        <View style={{ height: "70%", borderRadius: 25, marginTop: "5%" }}>
          <CreateTextInput
            height={"100%"}
            multiline
            maxLength={1000}
            style={{
              margin: 1,
              width:'95%',
              alignSelf: 'center',
              textAlignVertical: 'top',  // hack android
              backgroundColor: "#f5fffa", borderRadius: 25,
            }}
            placeholder="activity Description" value={this.state.description} keyboardType="default"
            onChange={(value) => this.onChangedEventDescription(value)} />

        </View>

        <View style={{ height: "25%", justifyContent: "center", }}>
          <CreateButton style={{ width: '90%' }} title={"Update Description"} action={this.updateDescription.bind(this)}></CreateButton>
        </View>

      </View>
    )
  }

}

