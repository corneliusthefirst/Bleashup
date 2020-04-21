import React from "react";
import { View, Dimensions } from "react-native";
import { Text, Container, Tabs, Tab, TabHeading } from "native-base";
import ColorList from "../colorList";
import bleashupHeaderStyle from "../../services/bleashupHeaderStyle";
import BleashupModal from "./BleashupModal";
import shadower from "../shadower";
const screenheight = Math.round(Dimensions.get("window").height);
export default class TabModal extends BleashupModal {
  TabHeader() {
    return (
      <View style={{ height: ColorList.headerHeight }}>
        <View style={{ ...bleashupHeaderStyle }}>
          {this.tabHeaderContent()}
        </View>
      </View>
    );
  }
  state = {

  }
  initialize() {
    this.state = {

    }
  }
  tabHeaderContent() {
    return null
  }
  onOpenModal() {
    setTimeout(() => {
      this.setState({
        content: this.props.content,
      });
    }, 20);
  }
  onClosedModal() {
    this.props.closed();
    this.setState({
      content: null,
    });
  }
  isCurrentTab(index) {
    return this.state.currentTab === index
  }
  borderTopLeftRadius = 1
  borderTopRightRadius = 1
  tabs = [
    {
      heading: () => (
        <View>
          <Text>Sample</Text>
        </View>
      ),
      body: () => <View></View>,
    },
  ];
  renderTabs() {
    return this.tabs.map((ele) => {
      return (
        <Tab heading={<TabHeading>{ele.heading()}</TabHeading>}>
          {ele.body()}
        </Tab>
      );
    });
  }
  isOpened = this.props.isOpen;
  modalBody() {
    return (
      <Container style={{ margin: "1%" }}>
        {this.TabHeader()}
        <Tabs onChangeTab={({ i }) => {
          this.setState({
            currentTab: i
          })
        }} tabContainerStyle={{
          ...shadower(8),
          borderRadius: 8,
        }}>{this.renderTabs()}</Tabs>
      </Container>
    );
  }
}
