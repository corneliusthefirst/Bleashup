/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import { View, TextInput } from "react-native";
import { Input, Text } from "native-base";
import colorList from "./../../../../colorList";

export default class CreateTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: this.props.height
        ? this.props.height
        : colorList.containerHeight / 9,
    };
  }

  updateSize = (height) => {
    if (this.props.multiline == true) {
      this.setState({ height: height >= 300 ? 300 : height });
    }
  };

  render() {
    return (
      <View
        style={{
          height: this.state.height,
          alignItems: 'center',
          width: "100%",
          backgroundColor: this.props.backgroundColor
            ? this.props.backgroundColor
            : colorList.bodyBackground,
        }}
      >
        <Input
          disabled={this.props.disabled}
          onContentSizeChange={(e) => {
            this.props.autogrow
              ? this.updateSize(e.nativeEvent.contentSize.height)
              : null;
          }}
          autoCorrect={true}
          selectTextOnFocus
          style={{
            width: '100%',
            height: '100%',

            borderBottomWidth: 1,
            borderColor: this.props.color
              ? this.props.color
              : colorList.bodyIcon,
            color: this.props.color ? this.props.color : colorList.bodyText,
            textAlignVertical: 'top',
            borderRadius: 5,
            backgroundColor: this.props.backgroundColor
              ? this.props.backgroundColor
              : colorList.bodyBackground,
          }}
          value={this.props.value}
          maxLength={this.props.maxLength || 100}
          placeholder={`@${this.props.placeholder}`}
          placeholderTextColor={
            this.props.placeholderTextColor
              ? this.props.placeholderTextColor
              : colorList.bodyText
          }
          autoCapitalize="sentences"
          returnKeyType="next"
          inverse
          last
          onChangeText={this.props.onChange}
          multiline={this.props.multiline ? this.props.multiline : false}
          numberOfLines={
            this.props.numberOfLines ? this.props.numberOfLines : 1
          }
        />
        <View
          style={{
            position: "absolute",
            alignSelf: "flex-end",
            marginRight: "1%",
          }}
        >
          <Text
            style={{
              color: this.props.color
                ? this.props.color
                : colorList.bodySubtext,
              /*backgroundColor: this.props.multiline
                ? "rgba(0, 0, 0, 0.1)"
                : null,*/
            }}
          note>{`${(this.props.value && this.props.value.length) || 0} / ${
            this.props.maxLength || 100
          }`}</Text>
        </View>
      </View>
    );
  }
}
