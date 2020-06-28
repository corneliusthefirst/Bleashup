/* eslint-disable react-native/no-inline-styles */
import { Accordion, Icon, Text, Content } from "native-base";
import React, { Component } from "react";
import { ScrollView, View, Dimensions, TouchableOpacity } from "react-native";
import BleashupAccordion from "../../MyTasks/BleashupAccordion";
import Hyperlink from "react-native-hyperlink";

let { height, width } = Dimensions.get("window");

export default class SwipeAccordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starselect: false,
    };
  }

  componentDidMount() {
    //console.warn("here we are", this.props.dataArray);
  }

  starClick = () => {
    this.setState({ starselect: !this.state.starselect });
  };

  _renderHeader = (item, index, toggle, expanded) => {
    //console.warn("here i see", item, index, expanded);
    return (
      <View
        style={{
          height: 60,
          width: width,
          flexDirection: "row",
          borderColor: "black",
        }}
      >
        <View
          style={{
            width: width / 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {this.state.starselect ? (
            <Icon
              style={{ fontSize: 30, color: "white" }}
              type="Entypo"
              name="star"
              onPress={() => this.starClick()}
            />
          ) : (
            <Icon
              style={{ fontSize: 30, color: "white" }}
              type="Entypo"
              name="star-outlined"
              onPress={() => this.starClick()}
            />
          )}
        </View>

        <View
          style={{
            width: width / 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={toggle}>
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
                  onPress={toggle}
                />
              ) : (
                <Icon
                  style={{ fontSize: 30, color: "white" }}
                  type="FontAwesome"
                  name="angle-double-down"
                  onPress={toggle}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={this.props.reply}
          style={{
            width: width / 3,
            borderWidth: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
        </TouchableOpacity>
      </View>
    );
  };

  _renderContent = (item) => {
    return item.message ? (
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
          <Hyperlink linkDefault={true} linkStyle={{ color: '#2980b9' }}>
            <Text style={{ padding: 8, color: 'white' }}>{item.message}</Text>
          </Hyperlink>
        </ScrollView>
      </View>
    ) : null;
  };

  _keyExtractor = (item, index) => item.id;

  render() {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          //backgroundColor: 'rgba(52,52,52,0.1)',
          width: width,
          borderColor: "black",
          alignItems: "center",
        }}
      >
        <BleashupAccordion
          keyExtractor={this._keyExtractor}
          dataSource={[this.props.dataArray]}
          _renderHeader={this._renderHeader}
          _renderContent={this._renderContent}
          backgroundColor={'rgba(52,52,52,0.1)'}
        />
      </View>
    );
  }
}

/**
import React, { Component } from 'react';
import {
  View,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import ColorList from '../../colorList';

export default class AccordionModuleNative extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  render() {
    return this.props.accordionView ? (
      <View style={{flexDirection:'column'}}>
        {this.props._renderHeader()}
      <ScrollView style={{height:this.state.expanded ? 300 : 0}} nestedScrollEnabled={true} showsVerticalScrollIndicator={false} >
        {this.state.expanded && (
          <View>{this.props._renderContent()}</View>
        )}
      </ScrollView>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <TouchableOpacity onPress={() => this.toggleExpand()}>
            {this.state.expanded ? (
              <Text style={{ padding: 5, color: 'blue' }}>View less</Text>
            ) : (
              <Text style={{ paddingLeft: 5, paddingTop: 5, color: 'blue' }}>
                View More
              </Text>
            )}
          </TouchableOpacity>
        </View>

      </View>
    ) : (
      <View>
        {this.props._renderHeader(
          this.props.dataArray,
          this.state.expanded,
          this.toggleExpand
        )}
        <View style={styles.parentHr} />
        {this.state.expanded && (
          <View>{this.props._renderContent(this.props.dataArray)}</View>
        )}
      </View>
    );
  }

  toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: !this.state.expanded });
  };
}

const styles = StyleSheet.create({
  parentHr: {
    height: 1,
    color: ColorList.bodySubtext,
    width: '100%',
  },
});
 */
