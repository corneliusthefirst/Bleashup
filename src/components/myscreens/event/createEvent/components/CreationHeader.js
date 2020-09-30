import React, { Component } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import ColorList from "../../../../colorList";
import bleashupHeaderStyle from "../../../../../services/bleashupHeaderStyle";
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import GState from "../../../../../stores/globalState";

export default class CreationHeader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{ height: ColorList.headerHeight, width: "100%" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            ...bleashupHeaderStyle,
            justifyContent: "space-between",
            paddingLeft: "1%",
          }}
        >
          {this.props.back && (
            <TouchableOpacity
              onPress={() => requestAnimationFrame(this.props.back)}
              style={{ width: 30, marginTop: "auto", marginBottom: "auto" }}
            >
              <MaterialIcons
                type="MaterialIcons"
                name="arrow-back"
                style={{...GState.defaultIconSize, color: ColorList.headerIcon }}
              />
            </TouchableOpacity>
          )}

          <View style={{ flex: 1, alignItems: "flex-start", paddingLeft: 20 }}>
            <Text
              elipsizeMode={"tail"}
              numberOfLines={1}
              style={{
                color: ColorList.headerIcon,
                fontWeight: "500",
                marginTop: "auto",
                fontSize: ColorList.headerFontSize,
                marginBottom: "auto",
                //maxWidth: '50%',
              }}
            >
              {this.props.title}
            </Text>
          </View>
          <View style={{ minWidth: "10%",
          flexDirection: 'row',alignItems: 'center'
          , justifyContent: "flex-end",marginRight: '1%', }}>
            {this.props.extra}
          </View>
        </View>
      </View>
    );
  }
}
