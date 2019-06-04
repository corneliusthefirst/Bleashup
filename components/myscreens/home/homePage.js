import React, { Component } from "react";
import { Platform, ScrollView } from "react-native";
import {
  Container,
  Header,
  Title,
  Icon,
  Tabs,
  Tab,
  Body,
  TabHeading
} from "native-base";
import Status from "./../status/index";
import InvitationView from "./../invitations/index";
import PersonalEventView from "./../personalevents/index";
import Chats from "../poteschat";
import Settings from "./../settings/index";
import { CollapsibleHeaderScrollView } from "react-native-collapsible-header-views";

class Home extends Component {
  isCloseToBottom(nativeEvent) {
    return (
      nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
      nativeEvent.contentSize.height - 20
    );
  }

  ifCloseToTop(nativeEvent) {
    return nativeEvent.contentOffset.y == 0;
  }
  state = {
    scroll: true
  };
  render() {
    return (
      <Container>
        <CollapsibleHeaderScrollView
          CollapsibleHeaderComponent={
            <Header hasTabs>
              <Body>
                <Title
                  style={{
                    fontWeight: "bold"
                  }}
                >
                  Bleashup
                </Title>
              </Body>
              <Icon
                name="cog"
                active={true}
                type="FontAwesome"
                style={{
                  padding: 15,
                  paddingLeft: 100,
                  color: "#FEFFDE"
                }}
              />
            </Header>
          }
          headerHeight={50}
          scrollEnabled={this.state.scroll}
          onScroll={nativeEvent => {
            if (this.isCloseToBottom(nativeEvent.nativeEvent)) {
              this.setState(previousState => ({ scroll: false }));
            }
            if (this.ifCloseToTop(nativeEvent.nativeEvent)) {
              this.setState(previousState => ({ scroll: false }));
            }
          }}
          statusBarHeight={Platform.OS === "ios" ? 20 : 0}
        >
          <Tabs
            tabBarPosition="overlayTop"
            tabBarUnderlineStyle={{
              borderBottomWidth: 0,
              backgroundColor: "transparent"
            }}
          >
            <Tab
              tabStyle={{
                borderRadius: 0
              }}
              heading={
                <TabHeading>
                  <Icon name="calendar" />
                </TabHeading>
              }
            >
              <PersonalEventView />
            </Tab>
            <Tab
              heading={
                <TabHeading>
                  <Icon name="sc-telegram" />
                </TabHeading>
              }
            >
              <InvitationView />
            </Tab>
            <Tab
              heading={
                <TabHeading>
                  <Icon name="comment" />
                </TabHeading>
              }
            >
              <Chats />
            </Tab>
            <Tab
              heading={
                <TabHeading>
                  <Icon name="user" />
                </TabHeading>
              }
            >
              <Status />
            </Tab>
          </Tabs>
        </CollapsibleHeaderScrollView>
      </Container>
    );
  }
}

export default Home;

/*
<Left>
<Icon
  active="true"
  style={{
    color: "antiquewhite"
  }}
  type="Foundation"
  name="home"
  onPress={() => this.props.navigation.openDrawer()}
/>
</Left>

 onPress = {this._onPressAdd}
*/
