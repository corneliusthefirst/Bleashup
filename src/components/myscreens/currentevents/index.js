import React, { Component } from "react";
import {
  View,
  Dimensions
} from "react-native";
import { forEach } from "lodash"
import NewEvents from "./components/NewEvents";
import CurrentEvents from "./components/CurrentEvents";
import stores from "../../../stores"
import { Spinner, Fab, Icon } from "native-base";
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
