import React, { Component } from "react";
import { Content, Card, CardItem, Text, Body } from "native-base";
import storage from "../../../services/store.js";
export default class CurrentEventView extends Component {
  render() {
    //this.storage();
    return (
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
                NativeBase gives you the potential of building applications that
                run on iOS and Android using a single codebase.
              </Text>
            </Body>
          </CardItem>
        </Card>
      </Content>
    );
  }
  storage() {
    storage
      .load({
        key: "loginStaters",
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          extraFetchOptions: {},
          someFlag: true
        }
      })
      .then(ret => {
        console.error(ret.userid);
      })
      .catch(err => {
        console.error(err);
      });
  }
}
