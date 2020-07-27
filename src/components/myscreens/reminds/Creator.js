import React, { Component } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import ProfileModal from "../invitations/components/ProfileModal";
import stores from "../../../stores";
import CreatorModal from "./CreatorModal";
import ColorList from "../../colorList";
import rounder from "../../../services/rounder";

export default class Creator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
    };
    this.showCreatorModal = this.showCreatorModal.bind(this);
    this.pressingIn = this.pressingIn.bind(this);
    this.oncolosedModal = this.oncolosedModal.bind(this);
  }
  state = {};
  componentDidMount() {
    this.setState({
      mounted: true,
    });
    this.props.giveCreator
      ? this.props.giveCreator(
          stores.TemporalUsersStore.Users[this.props.creator]
        )
      : null;
  }
  infoTextStyle = {
    fontWeight: "bold",
    fontStyle: "italic",
    alignSelf: "center",
    textAlign: "center",
    color: ColorList.bodyBackground,
  };
  oncolosedModal() {
    this.setState({
      showCreatorModal: false,
    });
  }
  showCreatorModal() {
    requestAnimationFrame(() => {
      this.setState({
        showCreatorModal: true,
      });
    });
  }
  pressingIn() {
    this.props.pressingIn ? this.props.pressingIn() : null;
  }
  render() {
    return !this.state.mounted ? (
      <Text style={this.infoTextStyle}>{"i"}</Text>
    ) : (
      <TouchableOpacity
        style={rounder(15, ColorList.bodySubtext)}
        onPressIn={this.pressingIn}
        onPress={this.showCreatorModal}
      >
        <Text style={this.infoTextStyle}>{"i"}</Text>
        {this.state.showCreatorModal ? (
          <CreatorModal
            intro={this.props.intro}
            isOpen={this.state.showCreatorModal}
            onClosed={this.oncolosedModal}
            creator={stores.TemporalUsersStore.Users[this.props.creator] || {}}
            created_at={this.props.created_at}
            color={this.props.color}
          ></CreatorModal>
        ) : null}
      </TouchableOpacity>
    );
  }
}
