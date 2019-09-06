import React, { Component } from "react";
import {
  View
} from "react-native";
import CurrentEvents from "./components/CurrentEvents";
import { observer } from "mobx-react";
@observer class CurrentEventView extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    isLoading: true,
    Events: undefined
  }


  render() {
    return (
      <View>
        <CurrentEvents data={stores.Events.events} {...this.props}></CurrentEvents>
      </View>
    );
  }
}

export default CurrentEventView
