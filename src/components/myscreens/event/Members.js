import React, { Component } from "react";
import Modal from "react-native-modalbox";
import { View, TouchableOpacity } from "react-native";
import BleashupFlatList from "../../BleashupFlatList";
import { Spinner, Text, Button, Icon } from "native-base";
import { findIndex, reject, uniqBy } from "lodash";
import stores from "../../../stores";
import SelectableContactsMaster from "./SelectableContactsMaster";
import SelectableProfileWithOptions from "./SelectableProfileWithOption";
import emitter from "../../../services/eventEmiter";
import CacheImages from "../../CacheImages";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
export default class Members extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      loaded: false,
      participants: [],
      event_id: null,
      selected: [],
    };
  }
  state = {};
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        contacts: uniqBy(this.props.participants, "phone").filter(
          (ele) =>
            !Array.isArray(ele) &&
            ele &&
            ele.phone !== stores.LoginStore.user.phone
        ),
        event_id: this.props.event_id,
        loaded: true,
        hideTitle: this.props.hideTitle,
      });
    }, 10);
  }
  toggleMaster(memberPhone) {
    this.setState({
      selected: this.state.selected.map((ele) =>
        ele.phone === memberPhone ? { ...ele, master: !ele.master } : ele
      ),
    });
  }
  apply() {
    this.props.bandMembers(this.state.selected);
    emitter.once("parti_removed", () => {
      this.setState({
        contacts: reject(
          this.state.contacts,
          (ele) => findIndex(this.state.selected, { phone: ele.phone }) >= 0
        ),
      });
    });
  }
  addMember(member) {
    this.setState({
      selected: [...this.state.selected, member],
    });
  }
  remove(memberPhone) {
    this.setState({
      selected: reject(this.state.selected, { phone: memberPhone }),
    });
  }
  _keyExtractor(item) {
    return item.phone;
  }
  delay = 0;
  render() {
    return this.state.loaded ? (
      <View style={{ height: "100%" }}>
        <BleashupFlatList
          firstIndex={0}
          renderPerBatch={5}
          initialRender={10}
          numberOfItems={this.props.participants.length}
          keyExtractor={this._keyExtractor}
          dataSource={this.props.participants}
          renderItem={(item, index) => {
            this.delay = this.delay >= 15 ? 0 : this.delay + 1;
            return (
              <SelectableProfileWithOptions
                simplyMembers
                delay={this.delay}
                toggleMaster={(member) => this.toggleMaster(member)}
                selected={(member) => {
                  this.addMember(member);
                }}
                changeMasterState={(newState) =>
                  this.props.changeMasterState(newState)
                }
                leaveActivity={this.props.leaveActivity}
                currentPhone={this.props.currentPhone}
                checkActivity={(member) => this.props.checkActivity(member)}
                creator={this.props.creator}
                mainMaster={this.props.master}
                unselected={(member) => this.remove(member)}
                key={index}
                contact={item}
              ></SelectableProfileWithOptions>
            );
          }}
        ></BleashupFlatList>
      </View>
    ) : (
      <Spinner size={"small"}></Spinner>
    );
  }
}
