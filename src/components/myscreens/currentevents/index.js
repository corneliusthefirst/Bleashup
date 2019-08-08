import React, { Component } from "react";
import {
  View
} from "react-native";

import NestedScrollView from "react-native-nested-scroll-view";
import NewEvents from "./components/NewEvents";
import CurrentEvents from "./components/CurrentEvents";

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
            <CurrentEvents {...this.props}></CurrentEvents>
          </View>
        </NestedScrollView>
      </View>
    );
  }
}

export default CurrentEventView
