import React, { Component } from "react";
import { Content, Card, CardItem, Container, Text, Body } from "native-base";
import NestedScrollView from "react-native-nested-scroll-view";
import GState from "../../../stores/globalState";
import emitter from "../../../services/eventEmiter";
import stores from "../../../stores";
export default class CurrentEventView extends Component {
  render() {
    /*stores.Session.getSession(session => {
      if (GState.writing) {
        emitter.on("writing", State => {
          if (State == false) {
            session.write(NewEvent);
            GState.writing = true;
            emitter.emit("writing", true);
            emitter.on("successfull", (message, eventID) => {
              NewEvent.event_id = eventID;
              emitter.emit("writing", false);
              stores.events.addEvent(NewEvent).then(() => {});
            });
          }
        });
      } else {
        session.write(NewEvent);
        GState.writing = true;
        emitter.emit("writing", true);
        emitter.on("successfull", (message, eventID) => {
          NewEvent.event_id = eventID;
          emitter.emit("writing", false);
          stores.events.addEvent(NewEvent).then(() => {});
        });
      }
    });*/
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
