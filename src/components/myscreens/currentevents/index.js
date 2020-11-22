import React, { Component } from "react";
import CurrentEvents from "./components/CurrentEvents";
import { observer } from "mobx-react";
import stores from "../../../stores";
import actFilterFunc from './activityFilterFunc';
import BeComponent from '../../BeComponent';

@observer class CurrentEventView extends BeComponent {
  constructor(props) {
    super(props);
  }
  state = {
    isLoading: true,
    Events: undefined
  }


  render() {
    this.allUsers = stores.TemporalUsersStore.Users
    return (
        <CurrentEvents searchString={this.props.searchString} data={stores.Events.events.filter(actFilterFunc)} {...this.props}></CurrentEvents>
    );
  }
}

export default CurrentEventView
