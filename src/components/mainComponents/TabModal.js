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
      <View>
        {this.tabHeaderContent()}
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
  activeTextStyle = null
  underlineStyle = {
    backgroundColor: ColorList.bodyIcon,
  }
  inialPage = 0
  isOpened = this.props.isOpen;
  modalBody() {
    return (
      <Container style={{ margin: "1%" }}>
        {this.TabHeader()}
        <Tabs page={this.state.currentTab} initialPage={this.inialPage} tabBarUnderlineStyle={this.underlineStyle} onChangeTab={({ i }) => {
          this.inialPage !== 0 && i == 0 ? this.onClosedModal() : null
          this.setState({
            currentTab: this.inialPage !== 0 && i === 0 ? i + 1 : i
          })
        }} tabContainerStyle={{
          ...shadower(8),
          borderRadius: 8,
        }}>{this.renderTabs()}</Tabs>
      </Container>
    );
  }
}
