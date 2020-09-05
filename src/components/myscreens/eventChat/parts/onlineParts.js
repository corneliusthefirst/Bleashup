import React from "react";
import { View, Text } from "react-native";
import ColorList from "../../../colorList";
import shadower from "../../../shadower";
import GState from "../../../../stores/globalState";

export default function onlinePart() {
  let isOnline = this.state.online;
  return (
    <View
      style={{
        minWidth: 150,
        height: 20,
        borderRadius: 5,
        backgroundColor: ColorList.bodyDarkWhite,
        ...shadower(1),
        flexDirection: "row",
        alignItems: "center",
        textAlign: "flex-start",
        paddingHorizontal: "2%",
        justifyContent: "flex-start",
      }}
    >
      <Text
        style={{
            ...GState.defaultTextStyle,
          fontSize: 12,
          fontWeight: "bold",
          fontStyle: "italic",
        }}
      >
        {"last seen: "}
      </Text>
      <Text
        style={{
          ...GState.defaultTextStyle,
          color: isOnline ? ColorList.greenColor : ColorList.indicatorColor,
          fontSize: isOnline ? 12 : 13,
          fontStyle: isOnline ? "italic" : "normal",
        }}
      >
        {this.state.last_seen}
      </Text>
    </View>
  );
}
