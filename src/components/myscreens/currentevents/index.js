import React, { Component } from "react";
import {
  View
} from "react-native";
import CurrentEvents from "./components/CurrentEvents";
import { observer } from "mobx-react";
import { sortBy, findIndex } from "lodash"
import stores from "../../../stores";

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
        <CurrentEvents data={stores.Events.events.filter(event => findIndex(event.participant,
          { phone: stores.LoginStore.user.phone }) >= 0 && !event.hiden)} {...this.props}></CurrentEvents>
      </View>
    );
  }
}

export default CurrentEventView
