/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import { View, TextInput, Text } from "react-native";
import colorList from "./../../../../colorList";
import GState from "../../../../../stores/globalState";
import Texts from '../../../../../meta/text';
import Entypo from 'react-native-vector-icons/Entypo';
import ColorList from "./../../../../colorList";
import { TouchableOpacity } from 'react-native';
import BePureComponent from '../../../../BePureComponent';
import ImojieSelector from "../../../eventChat/ImojiSelector";
import EmojiModal from './EmojiModal';

export default class CreateTextInput extends BePureComponent {
  constructor(props) {
    super(props);
    this.state = {
      height: this.props.height
        ? this.props.height
        : colorList.containerHeight / 9,
      isEmojiInputOpened: false
    };
    this.showEmojiInpit = this.showEmojiInpit.bind(this)
    this.handleEmojiSelected = this.handleEmojiSelected.bind(this)
  }
  showEmojiInpit() {
    if (this.state.isEmojiInputOpened) {
      this.refs.input.focus()
      this.props.changePosition && this.props.changePosition(false)
    } else {
      if(this.refs && this.refs.input && this.refs.input.blur) this.refs.input.blur()
      this.props.changePosition && this.props.changePosition(true)
    }
    setTimeout(() => {
      this.setStatePure({
        isEmojiInputOpened: !this.state.isEmojiInputOpened
      })
    }, !this.state.isEmojiInputOpened ? 400 : 20)
  }
  updateSize = (height) => {
    if (this.props.multiline == true) {
      this.setStatePure({ height: height >= 300 ? 300 : height });
    }
  };
  handleEmojiSelected(imo) {
    this.props.onChange && this.props.onChange((this.props.value||"") + imo)
  }
  render() {
    return (
      <View
        style={{
          alignItems: 'center',
          margin: 3,
          width: "100%",
          backgroundColor: this.props.backgroundColor
            ? this.props.backgroundColor
            : colorList.bodyBackground,
          ...this.props.style
        }}
      >
        <TextInput
          disabled={this.props.disabled}
          onContentSizeChange={(e) => {
            this.props.autogrow
              ? this.updateSize(e.nativeEvent.contentSize.height)
              : null;
          }}
          autoCorrect={true}
          selectTextOnFocus
          style={{
            height: this.state.height,
            width: '100%',
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
          maxLength={this.props.maxLength || null}
          placeholder={`@${this.props.placeholder}`}
          placeholderTextColor={
            this.props.placeholderTextColor
              ? this.props.placeholderTextColor
              : colorList.bodyText
          }
          ref={"input"}
          autoCapitalize="sentences"
          autoFocus={this.props.autoFocus}
          returnKeyType="next"
          inverse
          last
          onChangeText={this.props.onChange}
          multiline={this.props.multiline ? this.props.multiline : false}
          numberOfLines={
            this.props.numberOfLines ? this.props.numberOfLines : 1
          }
        />
        {this.state.isEmojiInputOpened ? <EmojiModal
          isOpen={this.state.isEmojiInputOpened}
          onClosed={this.showEmojiInpit}
          handleEmojiSelected={this.handleEmojiSelected}
        >
        </EmojiModal> : null}
        <View
          style={{
            position: "absolute",
            backgroundColor: ColorList.descriptionBodyTransparent,
            flexDirection: 'row',
            borderRadius: 5,
            padding: '2%',
            alignItems: 'center',
            height: 20,
            justifyContent: 'flex-end',
            alignSelf: "flex-end",
            marginRight: "1%",
          }}
        >
          <Text
            style={{
              ...GState.defaultTextStyle,
              color: this.props.color
                ? this.props.color
                : colorList.bodySubtext,
              fontSize: 12,
              /*backgroundColor: this.props.multiline
                ? "rgba(0, 0, 0, 0.1)"
                : null,*/
            }}
            note>{`${(this.props.value && this.props.value.length) || 0} / ${
              this.props.maxLength || Texts.infinity
              }`}</Text>
          {!this.props.noEmoji ? <TouchableOpacity
            onPress={this.showEmojiInpit}
          >
            <Entypo
              name={"emoji-happy"}
              style={{
                marginLeft: 6,
                ...GState.defaultIconSize,
                color: ColorList.indicatorColor,
                fontSize: 16,
              }}
            >
            </Entypo>
          </TouchableOpacity> : null}
        </View>
      </View>
    );
  }
}
