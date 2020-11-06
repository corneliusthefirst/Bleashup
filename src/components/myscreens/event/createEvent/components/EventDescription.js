import React, { Component } from "react";
import {
  View, TouchableOpacity, ScrollView,
  TouchableWithoutFeedback, Dimensions, //Keyboard
} from 'react-native';
import Modal from 'react-native-modalbox';
import stores from '../../../../../stores/index';
import colorList from '../../../../colorList';
import CreateTextInput from './CreateTextInput';
import CreateButton from "./ActionButton";
import BleashupModal from '../../../../mainComponents/BleashupModal';
import Texts from '../../../../../meta/text';


let { height, width } = Dimensions.get('window');

export default class EventDescription extends BleashupModal {
  initialize() {
    this.state = {
      description: "",
      event_id: "",
      update: false
    }
  }

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

  componentDidUpdate(prevProps, prevState) {
    if (this.props.event.about.description !== prevProps.event.about.description) {
      this.init()
    }
  }

  onChangedEventDescription(value) {
    this.setStatePure({ description: value });
    if (!this.state.update) {
      stores.Events.updateDescription(this.state.event_id, value, false).then(() => { });
    }
  }
  keyboardDissmissed = false
  updateDescription() {
    this.state.description !== this.props.event.about.description ? this.props.updateDesc(this.state.description) : null
    this.props.onClosed();
  }

  position = "center"
  entry = "top"
  borderRadius = 0
  backdropOpacity=.3
  borderTopLeftRadius = 0
  borderTopRightRadius = 0
  modalHeight = 295
  swipeToClose = false
  modalWidth = "100%"
  borderWidth = 1
  onClosedModal() {
    this.props.onClosed(this.state.description)
  }
  modalBody() {


    return (
      <View style={{ height: "100%", flexDirection: "column",justifyContent: 'space-between', }}>
        <ScrollView keyboardShouldPersistTaps={"handled"}
          style={{ height: "60%", borderRadius: 0, marginTop: "5%" }}>
          <CreateTextInput
            height={200}
            multiline
            maxLength={1000}
            style={{
              margin: 1,
              width: '95%',
              alignSelf: 'center',
              textAlignVertical: 'top',  // hack android
              backgroundColor: "#f5fffa", borderRadius: 0,
            }}
            placeholder={Texts.activity_description} value={this.state.description} keyboardType="default"
            onChange={(value) => this.onChangedEventDescription(value)} />

        </ScrollView>

        <View style={{ height: "25%", justifyContent: "center", }}>
          <CreateButton style={{ width: '90%' }} title={Texts.edit} action={this.updateDescription.bind(this)}></CreateButton>
        </View>

      </View>
    )
  }

}

