import React, { Component } from "react";
import { Content, Card, CardItem, Container, Text, Body } from "native-base";
import NestedScrollView from "react-native-nested-scroll-view";
import GState from "../../../stores/globalState";
import requestObjects from "../../../services/requestObjects";
import tcpRequestData from "../../../services/tcpRequestData";
import stores from "../../../stores";
import emitter from "../../../services/eventEmiter";
export default class CurrentEventView extends Component {
  render() {
    let Remind = requestObjects.remind();
    Remind.event_id = "gROHjPU89tj2i2AhYzC2Kh5mCpQFELhkRS7d";
    Remind.id = "my_remind";
    Remind.title = "test_remind";
    Remind.description = "test remind description";
    Remind.creator = "00237650594916";
    tcpRequestData.addRemind(Remind).then(JSONData => {
      stores.Session.getSession().then(session => {
        console.warn("creating new remind");
        emitter.on("successful", message => {
          console.warn(message, "---------");
        });
        session.socket.write(JSONData);
      });
    });
    return (
      <Container>
        <NestedScrollView
          onScroll={nativeEvent => {
            GState.scrollOuter = true;
          }}
          alwaysBounceHorizontal={true}
          scrollEventThrottle={16}
        >
          <Content>
            <Card style={{ padding: 10 }}>
              <CardItem
                style={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  paddingTop: 0,
                  paddingBottom: 10
                }}
              >
                <Body>
                  <Text>what a fuck!!!!</Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Body>
                  <Text>
                    NativeBase gives you the potential of building applications
                    that run on iOS and Android using a single codebase.
                  </Text>
                </Body>
              </CardItem>
            </Card>
          </Content>
        </NestedScrollView>
      </Container>
    );
  }
}
