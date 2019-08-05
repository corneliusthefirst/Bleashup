import React, { Component } from "react";
import {
  View
} from "react-native";

import NestedScrollView from "react-native-nested-scroll-view";
import NewEvents from "./NewEvents";
import CurrentEvents from "./CurrentEvents";

class CurrentEventView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

      <View>
        <NestedScrollView
          alwaysBounceHorizontal={true}
        >
          <View>
            <CurrentEvents></CurrentEvents>
          </View>
        </NestedScrollView>
      </View>
    );
  }
}

export default CurrentEventView
