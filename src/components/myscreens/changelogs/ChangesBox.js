import React, { Component } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import CacheImages from "../../CacheImages";
import testForURL from "../../../services/testForURL";
import stores from "../../../stores";
import shadower from "../../shadower";
import ChangeBoxMenu from "./ChangeBoxMenu";
import ProfileSimple from "../currentevents/components/ProfileViewSimple";
import GState from "../../../stores/globalState/index";
import colorList from "../../colorList";
import replies from "../eventChat/reply_extern";
import AnimatedComponent from "../../AnimatedComponent";
import Swipeout from "../eventChat/Swipeout";
import TextContent from "../eventChat/TextContent";
import AnimatedPureComponent from '../../AnimatedPureComponent';
import { writeChange } from './change.services';

export default class ChangeBox extends AnimatedComponent {
  initialize() {
    this.state = {
      loaded: true,
      newThing: false,
      changer:
        typeof this.props.change.updater === "string"
          ? stores.TemporalUsersStore.Users[this.props.change.updater]
          : this.props.change.updater,
    };
    this.writeChange = writeChange.bind(this)
  }
  state = {
    changer:
      typeof this.props.change.updater === "string"
        ? stores.TemporalUsersStore.Users[this.props.change.updater]
        : this.props.change.updater,
  };
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.state.newThing !== nextState.newThing ||
      this.props.searchString !== nextProps.searchString ||
      this.props.foundString !== nextProps.foundString
  }
  mention(changer) {
    this.props.mention({ ...this.props.change }, changer);
  }
  containerStyle = {
    margin: "1%",
    borderRadius: 5,
    backgroundColor: colorList.bodyBackground,
    ...shadower(1),
  };
  render() {
    return (
      <Swipeout
        disabled={false}
        onLongPress={() => this.props.onLongPress(this.state.changer)}
        swipeRight={() => {
          this.mention(this.state.changer);
        }}
      >
        <View
          style={this.containerStyle}
        >
          {!this.props.change ? null : (
            <View style={{ flexDirection: "column", margin: "1%" }}>
              <View
                style={{
                  flexDirection: "row",
                  maxHeight: 20,
                }}
              >
                <View
                  style={{
                    width: "97%",
                    height: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ width: "100%", height: "100%" }}>
                    <ProfileSimple
                      foundString={this.props.foundString}
                      searchString={this.props.searchString}
                      hidePhoto
                      showPhoto={(url) => {
                        this.props.showPhoto(url);
                      }}
                      delay={this.props.delayer}
                      profile={this.state.changer || {}}
                    ></ProfileSimple>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "column",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <TextContent
                    onPress={this.props.onPress}
                    ellipsizeMode="tail"
                    foundString={this.props.foundString}
                    searchString={this.props.searchString}
                    style={{
                      fontSize: 14,
                      fontWeight: "800",
                      color: colorList.bodyText,
                    }}
                    numberOfLines={2}
                  >
                    {this.props.change.changed}
                  </TextContent>
                </View>
                <TextContent
                  onPress={this.props.onPress}
                  searchString={this.props.searchString}
                  foundString={this.props.foundString}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 13,
                    color: colorList.darkGrayText,
                    fontStyle: "italic",
                  }}
                  numberOfLines={2}
                >
                  {this.writeChange()}
                </TextContent>
              </View>
            </View>
          )}
        </View>
      </Swipeout>
    );
  }
}
