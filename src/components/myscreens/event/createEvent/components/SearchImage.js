import React, { Component } from "react";
import {
  Text,
  View,
  Linking,
  Alert,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import InAppBrowser from "react-native-inappbrowser-reborn";
import Modal from "react-native-modalbox";
import colorList from "../../../../colorList";
import openLink from "./openLinkOnBrowser";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import GState from "../../../../../stores/globalState";
import rounder from "../../../../../services/rounder";

let { height, width } = Dimensions.get("window");
export default class SearchImage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  open(url) {
    this.props.onClosed(true);
    if (this.props.h_modal) {
      setTimeout(() => {
        this.props.openPicker
          ? this.props.openPicker()
          : this.props.accessLibrary();
        openLink(url);
      }, 250);
    } else {
      this.props.openPicker
        ? this.props.openPicker()
        : this.props.accessLibrary();
      openLink(url);
    }
  }
  textStyle = {
    alignSelf: "flex-start",
    ...GState.defaultTextStyle,
    textDecorationLine: "underline",
  };
  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onClosed={this.props.onClosed}
        style={{
          height: 290,
          borderRadius: 25,
          backgroundColor: colorList.bodyBackground,
          borderColor: "black",
          width: "75%",
          flexDirection: "column",
          marginRight: "2%",
        }}
        position={"center"}
        //backdropPressToClose={false}
        //swipeToClose={false}
        entry={"top"}
        coverScreen={true}
      >
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            justifyContent: "space-between",
            alignItem: "center",
            margin: "5%",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                this.props.onClosed();
              }}
              style={{
                alignSelf: "flex-start",
                width: "100%",
                ...rounder(40, colorList.bodyBackground),
              }}
            >
              <EvilIcons
                style={{
                  ...GState.defaultIconSize,
                  fontSize: 25,
                  fontWeight: "500",
                }}
                name={"close"}
                type={"EvilIcons"}
              />
            </TouchableOpacity>

            {/*<TouchableOpacity style={{ alignSelf: "flex-end", margin: "0%", }}>
              <Text style={{ color: "darkgreen", fontSize: 20, fontWeight: "500" }} onPress={() => {
                this.props.accessLibrary()
                this.props.onClosed()
              }} >Go</Text>
            </TouchableOpacity>*/}
          </View>
          <Text
            style={{
              alignSelf: "center",
              color: colorList.bodyText,
              fontSize: 15,
            }}
          >
            @Some suggested free sites
          </Text>

          <TouchableOpacity
            style={{
              alignSelf: "center",
              width: "80%",
              borderRadius: 15,
              borderColor: "#1FABAB",
              backgroundColor: "transparent",
              justifyContent: "center",
              alignItem: "center",
              marginTop: "5%",
            }}
            onPress={() => {
              this.open("https://www.pixabay.com");
            }}
          >
            <Text style={this.textStyle}>Pixabay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              alignSelf: "center",
              width: "80%",
              borderRadius: 15,
              borderColor: "#1FABAB",
              backgroundColor: "transparent",
              justifyContent: "center",
              alignItem: "center",
              marginTop: "5%",
            }}
            onPress={() => {
              this.open("https://www.pixels.com");
            }}
          >
            <Text style={this.textStyle}> Pixels </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              alignSelf: "center",
              width: "80%",
              borderRadius: 15,
              borderColor: "#1FABAB",
              backgroundColor: "transparent",
              justifyContent: "center",
              alignItem: "center",
              marginTop: "5%",
            }}
            onPress={() => {
              this.open("https://www.pexels.com");
            }}
          >
            <Text style={this.textStyle}>Pexels</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text
              style={{
                alignSelf: "flex-start",
                color: "darkturquoise",
                margin: "5%",
                marginLeft: "9%",
                fontSize: 15,
              }}
              onPress={() => {
                this.open("https://www.google.com");
              }}
            >
              Others..
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}
