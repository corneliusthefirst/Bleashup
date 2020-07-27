import React, { Component } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import ProfileModal from "../invitations/components/ProfileModal";
import moment from "moment";
import { format } from "../../../services/recurrenceConfigs";
import BleashupModal from "../../mainComponents/BleashupModal";
import ColorList from "../../colorList";
import Texts from '../../../meta/text';

export default class CreatorModal extends BleashupModal {
  initialize() {
    this.state = {};
    this.showProfileModal = this.showProfileModal.bind(this);
    this.onClosedProfileModal = this.onClosedProfileModal.bind(this);
  }
  state = {};
  onClosedModal() {
    this.props.onClosed();
  }
  position = "bottom";
  entry = "bottom";
  modalBackground = this.props.color
    ? this.props.color
    : ColorList.bodyBackground;
  modalHeight = 76;
  unmountingComponent() {
    clearTimeout(this.closeTimeout);
  }
  showProfileModal() {
    this.setStatePure({
      showProfileModal: true,
    });
  }
  onClosedProfileModal() {
    this.setStatePure({
      showProfileModal: false,
    });
    this.closeTimeout = setTimeout(() => {
      this.onClosedModal();
    }, 100);
  }
  date = moment(this.props.created_at).format(format)
  modalBody() {
    return (
      <View>
        <View>
          <TouchableOpacity onPress={this.showProfileModal}>
            <Text style={styles.mainText} note>
              {this.props.intro && this.props.intro}
            </Text>
            {this.props.creator.nickname ? (
              <Text style={styles.subMainText}>
                by {this.props.creator.nickname}{" "}
              </Text>
            ) : null}
            <Text style={styles.subMainText}>
              {Texts.on}
              {this.date}
            </Text>
          </TouchableOpacity>
          {this.state.showProfileModal && this.props.creator.profile ? (
            <ProfileModal
              isOpen={this.state.showProfileModal}
              onClosed={this.onClosedProfileModal}
              profile={this.props.creator}
              color={this.props.color}
            ></ProfileModal>
          ) : null}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  mainText: {
    fontWeight: "bold",
    fontSize: 11,
    margin: "1%",
    color: ColorList.bodySubtext,
  },
  subMainText: {
    margin: "1%",
    fontSize: 11,
    color: ColorList.bodySubtext,
    fontStyle: "normal",
  },
});
