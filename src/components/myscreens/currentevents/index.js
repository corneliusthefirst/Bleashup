import React, { Component } from "react";
import {
  View,
  Dimensions
} from "react-native";
import { forEach } from "lodash"
import NewEvents from "./components/NewEvents";
import CurrentEvents from "./components/CurrentEvents";
import { DataProvider } from "recyclerlistview"
import stores from "../../../stores"
import { Spinner, Fab, Icon } from "native-base";
class CurrentEventView extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    isLoading: true,
    Events: undefined
  }
  componentDidMount() {
    this.changeToRecyclerArray().then((array) => {

      this.setState({
        Events: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(array),
        isLoading: false
      })
    })
  }

  changeToRecyclerArray() {
    return new Promise((resolve, reject) => {
      let result = []
      let i = 0;
      forEach(stores.Events.events, (item) => {
        result[i] = {
          type: "NORMAL",
          item: item,
        }
        if (i == stores.Events.events.length - 1) resolve(result);
        i++;
      })
    })
  }
  render() {
    return (
      this.state.isLoading ? <Spinner></Spinner> :
        <View>
          <CurrentEvents data={this.state.Events} {...this.props}></CurrentEvents>
          <Fab position="topRight" style={{ backgroundColor: "#1FABAB" }} ><Icon type="Entypo" name="plus" style={{ color: "#7DD2D2" }}></Icon></Fab>
        </View>
    );
  }
}

export default CurrentEventView
