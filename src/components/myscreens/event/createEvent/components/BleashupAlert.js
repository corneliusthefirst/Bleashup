import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";

import Modal from "react-native-modalbox";
import ColorList from "../../../../colorList";
import shadower from "../../../../shadower";
import BleashupModal from "../../../../mainComponents/BleashupModal";

let { height, width } = Dimensions.get("window");

export default class BleashupAlert extends BleashupModal {
  constructor(props) {
    super(props);
    this.state = {};
  }
  center = {
    marginBottom: "auto",
    marginTop: "auto",
  };
  modalHeight = 200;
  modalWidth = "80%";
  borderRadius = 10;
  position="center"
  swipeToClose = false;
  backdropPressToClose = false;
  render() {
    return this.props.component ? this.modalBody() : this.modal()
  }
  modalBody() {
  return  <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "column",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "500",
            color: ColorList.bodyText,
            alignSelf: "center",
            marginTop: "2%",
            marginRight: "3%",
          }}
        >
          {this.props.title}
        </Text>
      </View>

      <View style={{ flex: 4, justifyContent: "space-between", margin: "4%" }}>
        <Text>{this.props.message}</Text>
      </View>

      <View
        style={{ flex: 3, flexDirection: "row", justifyContent: "flex-end" }}
      >
        <TouchableOpacity style={{ width: "21%", marginRight: "5%" }}>
          <TouchableOpacity
            style={{
              width: "100%",
              height: 40,
              borderRadius: 15,
              padding: 4,
              flexDirection: "row",
              borderColor: "red",
              backgroundColor: ColorList.indicatorColor,
              justifyContent: "center",
              alignItem: "center",
              ...shadower(2),
            }}
            onPress={this.props.onClosed}
          >
            <Text style={{ color: ColorList.bodyBackground, ...this.center }}>
              {this.props.refuse}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={{ minWidth: "20%", marginRight: "4%" }}>
          <TouchableOpacity
            style={{
              width: "100%",
              padding: 4,
              height: 40,
              flexDirection: "row",
              borderRadius: 15,
              borderColor: "green",
              backgroundColor: "salmon",
              justifyContent: "center",
              alignItem: "center",
              ...shadower(2),
            }}
            onPress={this.props.deleteFunction}
          >
            <Text style={{ color: ColorList.bodyBackground, ...this.center }}>
              {this.props.accept}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>;
  }
}
