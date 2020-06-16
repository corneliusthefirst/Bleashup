/* eslint-disable react-native/no-inline-styles */
import { Accordion, Icon, Text, Content } from "native-base";
import React, { Component } from "react";
import { ScrollView, View, Dimensions } from "react-native";
import BleashupAccordion from "../../MyTasks/BleashupAccordion";
import Hyperlink from "react-native-hyperlink";

let { height, width } = Dimensions.get("window");

export default class TransparentAccordion extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.warn("here we are", this.props.dataArray);
  }

  _renderHeader(item, expanded, toggle) {
    return (
      <View
        style={{
          height: 60,
          width: width,
          flexDirection: "row",
          borderColor: "black",
        }}>

        <View
          style={{
            width: width / 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        ></View>

        <View
          style={{
            width: width / 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 45,
              height: 45,
              borderRadius: 23,
              borderWidth: 0.2,
              borderColor: "white",
              justifyContent: "center",
              alignItems: "center",
              //alignSelf: 'center',
            }}
          >
            {expanded ? (
              <Icon
                style={{ fontSize: 30, color: "white" }}
                type="FontAwesome"
                name="angle-double-up"
                onPress={() => toggle()}
              />
            ) : (
              <Icon
                style={{ fontSize: 30, color: "white" }}
                type="FontAwesome"
                name="angle-double-down"
                onPress={() => toggle()}
              />
            )}
          </View>
        </View>

        <View
          style={{
            width: width / 3,
            borderWidth: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon
            style={{ fontSize: 30, color: "white" }}
            type="SimpleLineIcons"
            name="action-redo"
          />
        </View>
      </View>
    );
  }
  _renderContent = (item) => {
    return (
      <View
        style={{
          height: item.message.length > 0 ? height / 4 : 0,
          marginBottom: 0,
        }}
      >
        <ScrollView
          style={{
            height: item.message.length > 0 ? height / 4 : 0,
          }}
        >
          <Hyperlink linkDefault={true}  linkStyle={ { color: '#2980b9' } }>
            <Text style={{ padding: 10, color:'white' }}>{item.message}</Text>
          </Hyperlink>

        </ScrollView>
      </View>
    );
  };
  render() {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 10,
          left: 0,
          right: 0,
          width: width,
          borderColor: "black",
          alignItems: "center",
        }}
      >
        <BleashupAccordion
          dataArray={this.props.dataArray}
          _renderHeader={this._renderHeader}
          _renderContent={this._renderContent}
        />
      </View>
    );
  }
}
