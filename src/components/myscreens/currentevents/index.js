import React, { Component } from "react";
import {
  View
} from "react-native";
import CurrentEvents from "./components/CurrentEvents";
<<<<<<< HEAD
=======
import stores from "../../../stores"
import { Spinner, Fab, Icon } from "native-base";
>>>>>>> 1e97a9d441b05a372cba36a25998ff64d917be81
import { observer } from "mobx-react";
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
        <CurrentEvents data={stores.Events.events} {...this.props}></CurrentEvents>
      </View>
    );
  }
}

export default CurrentEventView
