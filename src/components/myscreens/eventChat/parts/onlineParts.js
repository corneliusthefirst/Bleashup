import React from "react";
import { View, Text } from "react-native";
import ColorList from "../../../colorList";
import shadower from "../../../shadower";
import GState from "../../../../stores/globalState";
import TextContent from '../TextContent';
import Texts from '../../../../meta/text';

export default function onlinePart() {
  let isOnline = this.state.online;
  return (
    <View
      style={{
        minWidth: 150,
        height: 20,       
        flexDirection: "row",
        alignItems: "center",
        textAlign: "flex-start",
        paddingHorizontal: "2%",
        justifyContent: "flex-start",
      }}
    >
      <TextContent
        style={{
            ...GState.defaultTextStyle,
          fontSize: 12,
          fontWeight: "bold",
          fontStyle: "italic",
        }}
      >
        {Texts.last_seen}
      </TextContent>
      <TextContent
        style={{
          ...GState.defaultTextStyle,
          color: isOnline ? ColorList.greenColor : ColorList.indicatorColor,
          fontSize: isOnline ? 12 : 13,
          fontStyle: isOnline ? "italic" : "normal",
        }}
      >
        {this.state.last_seen}
      </TextContent>
    </View>
  );
}
