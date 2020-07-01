import React, { Component } from "react";
import {
  Header,
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Footer,
  BodyTabs,
  Tabs,
  Tab,
  Right,
  FooterTab,
  Button,
  Left,
  Body,
  ScrollableTab,
  Title,
  Icon,
} from "native-base";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import stores from '../../../../stores/index';
import request from '../../../../services/requestObjects';
import {
  filter,
  uniqBy,
  orderBy,
  find,
  findIndex,
  reject,
  uniq,
  indexOf,
  forEach,
  dropWhile,
} from "lodash";
import moment from "moment";
import ColorList from '../../../colorList';
import shadower from "../../../shadower";

export default class CreateEvent extends Component {
  constructor(props) {
    super(props);
  }

  onClickNewEvent = () => {
    this.props.navigation.navigate("CreateEventView");
  };

  onClickNewRemind = () => {
    this.props.navigation.navigate("MyTasksView");
  };

  onClickNewContact() {
    this.props.navigation.navigate("Contacts");
  }
  navigateToQRScanner() {
    this.props.navigation.navigate("QR");
  }
  render() {
    return (
      <ActionButton
        buttonColor={ColorList.bodyBackground}
        position="right"
        backgroundTappable={true}
        btnOutRange={ColorList.bodyText}
        size={52}
        useNativeFeedback={false}
        renderIcon={() => {
          return (
            <View
              style={{
                backgroundColor: ColorList.bodyBackground,
                height: 52,
                width: 52,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                ...shadower(4),
              }}
            >
              <Icon
                name="plus"
                type="AntDesign"
                style={{ color: ColorList.bodyIcon, fontSize: 27 }}
              />
            </View>
          );
        }}
      >
        <ActionButton.Item
          buttonColor="#3D90E3"
          /*title="New Relation"*/ onPress={() => {
            this.onClickNewContact();
          }}
          size={75}
        >
          <Icon
            name="chat-bubble"
            active={true}
            type="MaterialIcons"
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>

        <ActionButton.Item
          buttonColor="#663399"
          /*title=" New Activity  "*/
          onPress={() => {
            this.onClickNewEvent();
          }}
          size={65}
        >
          <Icon
            type={'MaterialIcons'}
            name={'group-add'}
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>

        <ActionButton.Item
          buttonColor="#cd5c5c"
          /*title="Join Activity"*/ onPress={() => {
            this.navigateToQRScanner();
          }}
          size={55}
        >
          <Icon
            name="barcode-scan"
            active={true}
            type="MaterialCommunityIcons"
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>

        <ActionButton.Item
          buttonColor="#1abc9c"
          /*title="All Reminds"*/
          onPress={() => {
            this.onClickNewRemind();
          }}
          size={45}
        >
          <Icon
            name="tasks"
            type="FontAwesome"
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>
      </ActionButton>
    );
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 23,
    height: 22,
    color: 'white',
  },
});
