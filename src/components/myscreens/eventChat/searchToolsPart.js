import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import GState from "../../../stores/globalState/index";
import rounder from "../../../services/rounder";
import ColorList from "../../colorList";

export default function searchToolsParts() {
  return (
    <View
      style={{
        maxWidth: 150,
        flexDirection: "row",
        marginRight: "2%",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View
        style={{
          height: ColorList.headerHeight - 5,
          paddingVertical: "1%",
          flexDirection: "column",
          width: 60,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={this.pushUp}
          style={{
            ...rounder(20, ColorList.bodyDarkWhite),
            justifyContent: "center",
          }}
        >
          <Entypo
            style={{ ...GState.defaultIconSize, fontSize: 16 }}
            name={"chevron-up"}
          ></Entypo>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.pushDown}
          style={{
            ...rounder(20, ColorList.bodyDarkWhite),
            justifyContent: "center",
          }}
        >
          <Entypo
            style={{ ...GState.defaultIconSize, fontSize: 16 }}
            name={"chevron-down"}
          ></Entypo>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ ...GState.defaultTextStyle }}>
          {(this.props.currentSearchIndex >= 0 ?
            this.props.currentSearchIndex:
            this.state.currentSearchIndex) + 1 || 0}
        </Text>
        <Text style={{ ...GState.defaultTextStyle }}>--</Text>
        <Text style={{ ...GState.defaultTextStyle }}>
          {(this.state.searchResult || this.props.searchResult).length}
        </Text>
      </View>
    </View>
  );
}
