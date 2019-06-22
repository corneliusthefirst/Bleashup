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
import StatusView from "./../status/index";
import InvitationView from "./../invitations/index";
import PersonalEventView from "./../personalevents/index";
import Chats from "../poteschat";
import SettingView from "./../settings/index";
import { CollapsibleHeaderScrollView } from "react-native-collapsible-header-views";
import GState from "../../../stores/globalState";
import { observer } from "mobx-react";
import UserHttpServices from "../../../services/userHttpServices";
import routerActions from "reazy-native-router-actions";
import autobind from "autobind-decorator";


@observer
class Home extends Component {
  constructor(props) {
    super(props);
   this.state={}
  }
 
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
@autobind
settings(){
  
}

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
                 onPress = { this.settings()}
              >
              </Icon>

            </Header>
          }
          headerHeight={50}
          scrollEnabled={GState.scrollOuter}
          onScroll={nativeEvent => {
            if (this.isCloseToBottom(nativeEvent.nativeEvent)) {
              GState.scrollOuter = false;
            }
            if (this.ifCloseToTop(nativeEvent.nativeEvent)) {
              GState.scrollOuter = false;
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
                  <Icon name="user"/>
                </TabHeading>
              }
            >
            <StatusView />
            </Tab>
          </Tabs>
        </CollapsibleHeaderScrollView>
      </Container>
    );
  }
}

export default Home;


//  onPress = {this.props.navigation.navigate('Settings')}