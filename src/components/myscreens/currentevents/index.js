import React, { Component } from "react";
import CurrentEvents from "./components/CurrentEvents";
import { observer } from "mobx-react";
import stores from "../../../stores";
import actFilterFunc from './activityFilterFunc';

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
        <CurrentEvents searchString={this.props.searchString} data={stores.Events.events.filter(actFilterFunc)} {...this.props}></CurrentEvents>
    );
  }
}

export default CurrentEventView
