import React from "react";
import { View, Dimensions, Text, } from "react-native";
import { Container, Tabs, Tab, TabHeading } from "native-base";
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
   this.openModalTimeout = setTimeout(() => {
      this.setStatePure({
        content: this.props.content,
      });
    }, 20);
  }
  onClosedModal() {
    this.props.closed();
    this.setStatePure({
      content: null,
    });
  }
  isCurrentTab(index) {
    return this.state.currentTab === index;
  }
  borderTopLeftRadius = 1;
  borderTopRightRadius = 1;
  tabs = [
    {
      heading: () => (
        <View>
          <Text style={{...GState.defaultTextStyle}}>Sample</Text>
        </View>
      ),
      body: () => <View></View>,
    },
  ];
  renderTabs() {
    return this.tabs.map((ele) => {
      return (
        <Tab
          heading={<TabHeading>{ele.heading()}</TabHeading>}
        >
          {ele.body()}
        </Tab>
      );
    });
  }
  tabHeight = ColorList.headerHeight;
  tabPosition = "top";
  activeTextStyle = null;
  underlineStyle = {
    backgroundColor: ColorList.bodyIcon,
  };
  inialPage = 0;
  isOpened = this.props.isOpen;
  modalBody() {
    return (
      <Container style={{ margin: !this.searching ? "1%" : null }}>
        {this.TabHeader()}
        <Tabs
          tabBarPosition={this.tabPosition}
          page={this.state.currentTab}
          initialPage={this.inialPage}
          tabBarUnderlineStyle={{
            ...this.underlineStyle,
            backgroundColor:
              this.tabs[this.state.currentTab] &&
              this.tabs[this.state.currentTab].tabBarColor
                ? this.tabs[this.state.currentTab].tabBarColor
                : ColorList.bodyIcon,
          }}
          onChangeTab={({ i }) => {
            this.inialPage !== 0 && i == 0 ? this.onClosedModal() : null;
            this.setStatePure({
              currentTab: this.inialPage !== 0 && i === 0 ? i + 1 : i,
            });
          }}
          tabContainerStyle={{
            height: this.tabHeight,
            ...shadower(8),
            borderRadius: 8,
          }}
        >
          {this.renderTabs()}
        </Tabs>
      </Container>
    );
  }
}
