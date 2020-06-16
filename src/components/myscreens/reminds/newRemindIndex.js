import React, { Component } from 'react';
import { Icon, Item, Title, Spinner, Button } from 'native-base';

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import autobind from 'autobind-decorator';
import TasksCard from './TasksCard'
import stores from "../../../stores/index";
import BleashupFlatList from "../../BleashupFlatList";
import TasksCreation from "./TasksCreation";
import { find, findIndex, uniqBy, reject, filter } from 'lodash';
import shadower from "../../shadower";

//const MyTasksData = stores.Reminds.MyTasksData

export default class Reminds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventRemindData: [],
      mounted: false,
      newing: false,
      event_id: this.props.event_id,
      RemindCreationState: false,
    };
    console.warn("running remind index con");
  }
  //manual event_id

  updateData = (newremind) => {
    //console.warn("come back value",newremind)
    this.setState({
      eventRemindData: [...this.state.eventRemindData, newremind],
    });
  };
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.mounted !== nextState.mounted ||
      this.state.newing !== nextState.newing;
    );
  }
  componentDidMount() {
    console.warn(this.props.event_id, "mounting!!!");
    stores.Reminds.readFromStore().then((Reminds) => {
      let reminds = filter(Reminds, { event_id: this.props.event_id });
      this.setState({ eventRemindData: reminds, mounted: true });
      console.warn("ok", reminds);
    });
  }

  @autobind
  AddRemind() {
    //this.props.navigation.navigate("TasksCreation",{eventRemindData:this.state.eventRemindData,updateData:this.updateData,event_id:this.state.event_id});
    this.setState({
      RemindCreationState: true,
      newing: !this.state.newing,
    });
  }

  @autobind
  back() {
    this.props.navigation.navigate("Home");
  }

  _keyExtractor = (item, index) => item.id;

  render() {
    return !this.state.mounted ? null : (
      <View style={{ flex: 1, backgroundColor: "#FEFFDE" }}>
        <View
          style={{
            height: 44,
            width: "100%",
            padding: "2%",
            justifyContent: "space-between",
            flexDirection: "row",
            backgroundColor: "#FEFFDE",
            alignItems: "center",
            ...shadower(),
          }}
        >
          <View>
            <Title style={{ fontSize: 20, fontWeight: "bold" }}>
              Tasks / Reminds
            </Title>
          </View>

          <View>
            <TouchableOpacity>
              <Icon
                type="AntDesign"
                name="pluscircle"
                style={{ color: "#1FABAB" }}
                onPress={() => this.AddRemind()}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <BleashupFlatList
            initialRender={5}
            renderPerBatch={5}
            //onScroll={this._onScroll}
            firstIndex={0}
            //showVerticalScrollIndicator={false}
            keyExtractor={this._keyExtractor}
            dataSource={this.state.eventRemindData}
            renderItem={(item, index) => {
              return (
                <TasksCard
                  {...this.props}
                  item={item}
                  key={index}
                  parentCardList={this}
                ></TasksCard>
              );
            }}
            numberOfItems={this.state.eventRemindData.length}
          ></BleashupFlatList>
        </View>

        <TasksCreation
          event_id={this.props.event_id}
          isOpen={this.state.RemindCreationState}
          onClosed={() => {
            this.setState({ RemindCreationState: false });
          }}
          parentComp={this}
          eventRemindData={this.state.eventRemindData}
        ></TasksCreation>
      </View>
    );
  }
}
