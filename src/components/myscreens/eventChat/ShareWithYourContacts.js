import React, { Component } from "react";
import stores from "../../../stores";
import {  View, Text,TouchableOpacity } from "react-native";
import TabModal from "../../mainComponents/TabModal";
import actFilterFunc from "../currentevents/activityFilterFunc";
import Texts from '../../../meta/text';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import rounder from '../../../services/rounder';
import ColorList from '../../colorList';
import GState from '../../../stores/globalState/index';
import SearchContent from './SearchContent';
export default class ShareWithYourContacts extends TabModal {
  initialize() {
    this.state = {
      searchString: "",
      users: [],
      activity: [],
    };
  }
  state = {
    searchString: "",
    users: [],
    activity: [],
  };
  shouldComponentUpdate(prevprops,prevState){
    return prevState.mounted !== this.state.mounted || 
    this.props.isOpen !== prevprops.isOpen || 
    this.state.users.length !== prevState.users.length
  }
  onOpenModal() {
    stores.Contacts.getContacts().then((contacts) => {
      stores.TemporalUsersStore.getUsers(
        contacts.map((ele) => ele.phone),
        [],
        (users) => {
          setTimeout(() => {
            this.setState({
              users: users,
              activity: stores.Events.events.filter(
                (ele) => actFilterFunc(ele) && ele.type
                  !== "relation" && ele.id
                  !== this.props.activity_id
              ),
              mounted: true,
            });
          });
        }
      );
    });
  }

  swipeToClose = false;
  entry = "top";
  position = "center";
  borderTopLeftRadius = 0;
  borderTopRightRadius = 0;
  borderRadius = 10;
  modalHeight = 400;
  modalWidth = "98%";
  onClosedModal() {
    this.props.onClosed();
  }
 tabStyle = {
   width:80
 }
  tabs = {
    1: {
      navigationOptions: {
        tabBarIcon: () => (
          <View style={this.tabStyle}>
            <Text>{Texts.contacts}</Text>
          </View>
        ),
      },
      screen: () => <SearchContent 
      message={this.props.message}
      users={this.state.users} 
      activity={this.state.activity} >
      </SearchContent>,
    },
    2: {
      navigationOptions: {
        tabBarIcon: () => (
          <View style={this.tabStyle}>
            <Text>{Texts.activity}</Text>
          </View>
        ),
      },
      screen: () => <SearchContent
      message={this.props.message}
      users={this.state.users} 
      activity={this.state.activity} 
      type={"activity"} ></SearchContent>,
    },
    Back:{
      navigationOptions: {
        tabBarIcon: () => <TouchableOpacity style={{ 
          ...rounder(40, 
            ColorList.bodyDarkWhite) }} >
          <MaterialIcons
            name="close"
            style={{ ...GState.defaultIconSize, color: ColorList.headerIcon }}
          /></TouchableOpacity>,
      },
      screen: () => {
        this.onClosedModal()
        return <View></View>
      }
    }
  };
  tabHeight = 40;
  tabPosition = "bottom";
}
