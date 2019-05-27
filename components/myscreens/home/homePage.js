import React, { Component } from "react";
import { Image, View, TouchableHighlight, Platform } from "react-native";
import {
  Container,
  Header,
  Title,
  Button,
  Content,
  Icon,
  Text,
  Footer,
  FooterTab,
  Tabs,
  Tab,
  Right,
  Left,
  Body,
  TabHeading
} from "native-base";
import Status from "./../status/index";
import InvitationView from "./../invitations/index";
import PersonalEventView from "./../personalevents/index";
import Chats from "../poteschat";
import Settings from "./../settings/index";
import {
  setCustomView,
  setCustomTextInput,
  setCustomText,
  setCustomImage,
  setCustomTouchableOpacity
} from "react-native-global-props";
const customViewProps = {
  style: {}
};

const customTextInputProps = {
  underlineColorAndroid: "rgba(0,0,0,0)",
  style: {
    borderWidth: 1,
    borderColor: "gray",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "white"
  }
};

const customTextProps = {
  style: {
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "HelveticaNeue" : "sans-serif",
    color: "wheat"
  }
};

const customImageProps = {
  resizeMode: "cover"
};

// Adds a bigger hit box for all TouchableOpacity's.
const customTouchableOpacityProps = {
  hitSlop: {
    top: 15,
    right: 15,
    left: 15,
    bottom: 15
  }
};
setCustomView(customViewProps);
setCustomTextInput(customTextInputProps);
setCustomText(customTextProps);
setCustomImage(customImageProps);
setCustomTouchableOpacity(customTouchableOpacityProps);
class Home extends Component {
  render() {
    return (
      <Container
        style={{
          backgroundColor: "#1FABAB"
        }}
      >
        <Header
          style={{
            backgroundColor: "#1FABAB",
            height: 70
          }}
          hasTabs
        >
          <Body>
            <Title
              style={{
                color: "#FEFFDE",
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
        <Tabs
          tabBarPosition="overlayBottom"
          tabBarUnderlineStyle={{
            borderBottomWidth: 0,
            backgroundColor: "transparent"
          }}
        >
          <Tab
            tabStyle={{
              borderRadius: 0
            }}
            heading="Events"
            tabStyle={{
              borderRadius: 0,
              backgroundColor: "#1FABAB"
            }}
            textStyle={{
              color: "#FEFFDE"
            }}
            activeTabStyle={{
              backgroundColor: "#1FABAB"
            }}
            activeTextStyle={{
              color: "white",
              fontWeight: "bold"
            }}
          >
            <PersonalEventView />
          </Tab>
          <Tab
            heading="Invitations"
            tabStyle={{
              borderRadius: 0,
              backgroundColor: "#1FABAB"
            }}
            textStyle={{
              color: "#FEFFDE"
            }}
            activeTabStyle={{
              backgroundColor: "#1FABAB"
            }}
            activeTextStyle={{
              color: "white",
              fontWeight: "bold"
            }}
          >
            <InvitationView />
          </Tab>
          <Tab
            heading="Chats"
            tabStyle={{
              borderRadius: 0,
              backgroundColor: "#1FABAB"
            }}
            textStyle={{
              color: "#FEFFDE"
            }}
            activeTabStyle={{
              backgroundColor: "#1FABAB"
            }}
            activeTextStyle={{
              color: "white",
              fontWeight: "bold"
            }}
          >
            <Chats />
          </Tab>
          <Tab
            heading="Status"
            tabStyle={{
              borderRadius: 0,
              backgroundColor: "#1FABAB"
            }}
            textStyle={{
              color: "#FEFFDE"
            }}
            activeTabStyle={{
              backgroundColor: "#1FABAB"
            }}
            activeTextStyle={{
              color: "white",
              fontWeight: "bold"
            }}
          >
            <Status />
          </Tab>
        </Tabs>
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
