import React from "react";
import { View, TouchableOpacity } from "react-native";
import BleashupFlatList from "../../BleashupFlatList";
import { Spinner, Text, Button, Icon } from "native-base";
import { findIndex, reject } from "lodash";
import stores from "../../../stores";
import SelectableContactsMaster from "./SelectableContactsMaster";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import BleashupModal from "../../mainComponents/BleashupModal";
export default class InviteParticipantModal extends BleashupModal {
  initialize() {
    this.state = {
      isOpen: false,
      loaded: false,
      participant: [],
      event_id: null,
      selected: [],
    };
  }
  toggleMaster(memberPhone) {
    this.setState({
      selected: this.state.selected.map((ele) =>
        ele.phone === memberPhone ? { ...ele, master: !ele.master } : ele
      ),
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
  onClosedModal() {
    this.props.onClosed();
    this.setState({
      participant: [],
      selected: [],
      loaded: false,
      event_id: null,
      hideTitle: false,
    });
  }
  onOpenModal() {
    stores.Contacts.getContacts().then((contacts) => {
      setTimeout(() => {
        this.setState({
          contacts: contacts
            ? contacts.filter((ele) => findIndex(this.props.participant, { phone: ele.phone }) < 0)
            : [],
          event_id: this.props.event_id,
          loaded: true,
          hideTitle: this.props.hideTitle,
        });
      }, 20);
    });
  }
  saveStyles = { fontSize: 40, color: "#1FABAB" }
  delay = 0;
  modalBody() {
    return (
      <View>
        {this.state.loaded ? (
          <View>
            <View
              style={{
                width: "100%",
                height: 53,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  ...bleashupHeaderStyle,
                  padding: "2%",
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flexDirection: "column" }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 18,
                    }}
                  >
                    {"Select New Members"}
                  </Text>
                  <Text
                    note
                    style={{
                      fontSize: 14,
                      fontStyle: "italic",
                    }}
                  >
                    {this.state.selected.length}
                    {" members and "}
                    {
                      this.state.selected.filter((ele) => ele.master == true)
                        .length
                    }
                    {" master"}
                  </Text>
                </View>
                {this.state.selected.length > 0 && <View>
                  <TouchableOpacity
                    onPress={() =>
                      requestAnimationFrame(() =>
                        this.props.invite(this.state.selected)
                      )
                    }
                  >
                    {this.props.adding ? <Icon type="Entypo" style={this.saveStyles} name="check"></Icon>:<Icon
                      type={"EvilIcons"}
                      style={this.saveStyles}
                      name={"sc-telegram"}
                    ></Icon>}
                  </TouchableOpacity>
                </View>}
              </View>
            </View>
            <View style={{ height: "90%" }}>
              <BleashupFlatList
                firstIndex={0}
                renderPerBatch={5}
                initialRender={10}
                numberOfItems={this.state.contacts.length}
                keyExtractor={this._keyExtractor}
                dataSource={this.state.contacts}
                renderItem={(item, index) => {
                  this.delay = this.delay >= 15 ? 0 : this.delay + 1;
                  return (
                    <SelectableContactsMaster
                      master={this.props.master}
                      delay={this.delay}
                      toggleMaster={(member) => this.toggleMaster(member)}
                      selected={(member) => {
                        this.addMember(member);
                      }}
                      unselected={(member) => this.remove(member)}
                      key={index}
                      contact={item}
                    ></SelectableContactsMaster>
                  );
                }}
              ></BleashupFlatList>
            </View>
          </View>
        ) : (
          <Spinner size={"small"}></Spinner>
        )}
      </View>
    );
  }
}
