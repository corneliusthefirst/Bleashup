import React from "react";

import { StyleSheet, Text, View, Button } from "react-native";
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import ColorList from "../colorList";
import AnimatedComponent from "../AnimatedComponent";

export default class BottomTabs extends AnimatedComponent {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
    };
    this.initialize();
  }
  initialize() {}
  options = () => {
    return {
      initialRouteName: this.initialTab,
      activeColor: ColorList.bodyBackground,
      inactiveColor: ColorList.bodyDarkWhite,
      barStyle: { backgroundColor: ColorList.bodyBackground },
    };
  };
  initialTab = "One";
  tabs = {
    One: {
      screen: () => <View></View>,
      navigationOptions: {
        tabBarLabel: "One",
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon style={[{ color: tintColor }]} size={25} name={"ios-home"} />
          </View>
        ),
        activeColor: "#f60c0d",
        inactiveColor: "#f65a22",
        barStyle: {
          backgroundColor: "#f69b31",
        },
      },
    },
  };
  initializeTabs() {
    let TabNavigator = createBottomTabNavigator(this.tabs, this.options());
    this.Tabs = createAppContainer(TabNavigator);
  }
  componentDidMount() {
    this.initializeTabs();
    this.setStatePure({
      mounted: true,
    });
  }
  componentDidUpdate() {
    this.initializeTabs();
  }
  render() {
    return (
      <View style={{ flex: 1 }}>{this.Tabs && <this.Tabs></this.Tabs>}</View>
    );
  }
}
