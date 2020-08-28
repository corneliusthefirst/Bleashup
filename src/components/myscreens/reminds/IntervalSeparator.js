import React, { Component } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import shadower from "../../shadower";
import moment from "moment";
import { format } from "../../../services/recurrenceConfigs";
import ColorList from "../../colorList";
import BePureComponent from "../../BePureComponent";

export default class IntervalSeparator extends BePureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    numberOfLines: 1,
    font: 14,
  };
  adjusFontSize(e) {
    const { lines } = e.nativeEvent;
    if (lines.length > this.state.numberOfLines) {
      this.setStatePure({
        font: this.state.font - 1,
      });
    }
  }
  render() {
    return (
      <TouchableOpacity
        onPress={() =>
          requestAnimationFrame(
            () => this.props.onPress && this.props.onPress()
          )
        }
        style={{
          margin: "4%",
          opacity: 0.7,
          backgroundColor: this.props.actualInterval
            ? ColorList.indicatorInverted
            : ColorList.bodyBackground,
          borderRadius: 5,
          ...shadower(1),
          height: 40,
        }}
      >
        <Text
          numberOfLines={this.state.numberOfLines}
          //adjustsFontSizeToFit
                style={[{
                    fontWeight: "bold",
                    alignSelf: "center",
                    fontSize: this.state.font,
                    marginTop: "2.5%",
                    color: this.props.actualInterval
                        ? ColorList.bodyIcon
                        : ColorList.bodyIcon,
                }]}
          onTextLayout={this.adjusFontSize.bind(this)}
          note
        >
          {this.props.actualInterval
            ? `from ${"now"} -> ${moment(this.props.to, format).calendar()}`
            : this.props.first
            ? `started ${moment(this.props.to, format).calendar()}`
            : `from ${moment(
                this.props.from,
                format
              ).calendar()}   ->  ${moment(this.props.to, format).calendar()}`}
        </Text>
      </TouchableOpacity>
    );
  }
}
