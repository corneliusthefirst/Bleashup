import React from "react";
import { View, Dimensions, Text, } from "react-native";
import { createAppContainer, createMaterialTopTabNavigator, createNavigationContainer } from "react-navigation"
import ColorList from "../colorList";
import bleashupHeaderStyle from "../../services/bleashupHeaderStyle";
import BleashupModal from "./BleashupModal";
import shadower from "../shadower";
import GState from "../../stores/globalState";
const screenheight = Math.round(Dimensions.get("window").height);
export default class TabModal extends BleashupModal {
  TabHeader() {
    return <View>{this.tabHeaderContent()}</View>;
  }
  state = {};
  initialize() {
    this.state = {};
  }
  tabHeaderContent() {
    return null;
  }
  onOpenModal() {
    
  }
  componentDidUpdate(){
    this.initRoutes()
  }
  initRoutes(){
    this.AppNavigator = createMaterialTopTabNavigator(
      this.tabs,
      {
        tabBarOptions: {
          activeTintColor: ColorList.indicatorColor,
          showIcon: true,
          showLabel: false,
          indicatorStyle:{
            backgroundColor:ColorList.indicatorColor
          },
          style: {
            backgroundColor: ColorList.bodyBackground
          },
        },
        initialRouteName:this.inialPage,
        lazy:true,
      }
    )
    this.Tabs = createAppContainer(this.AppNavigator)
  }
  componentDidMount(){
    this.initRoutes()
  }
  onClosedModal() {
    this.props.closed();
  }
  isCurrentTab(index) {
    return this.state.currentTab === index;
  }
  borderTopLeftRadius = 1;
  borderTopRightRadius = 1;
  tabs = {
    One: {
      navigationOptions: {
        tabBarIcon: () => (
          <View>
            <Text style={{ ...GState.defaultTextStyle }}>Sample</Text>
          </View>
        ),
      },
      screen: () => <View><Text>Hello, this is a tab content</Text></View>,
    },
  };
  tabHeight = ColorList.headerHeight;
  tabPosition = "top";
  activeTextStyle = null;
  underlineStyle = {
    backgroundColor: ColorList.bodyIcon,
  };
  inialPage = 0;
  isOpened = this.props.isOpen;
  modalBody() {
    return <View style={{
      flex: 1,
    }}>
      <View>{this.TabHeader()}</View>
    {this.Tabs && <this.Tabs></this.Tabs>}
    </View>
  }
}
