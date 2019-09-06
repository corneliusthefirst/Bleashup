import React, { Component } from "react";
import autobind from "autobind-decorator";
import {
  Content, Card, CardItem, Text, Body, Container, Header, Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner, Button
} from "native-base";
//import { Button,View } from "react-native";

import { AsyncStorage } from "react-native";
import { observer, extendObservable, inject } from "mobx-react";
import styles from "./styles";
import stores from "../../../stores";
import routerActions from "reazy-native-router-actions";
import { functionDeclaration } from "@babel/types";
const loginStore = stores.LoginStore;

@observer
export default class SettingView extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <Text>Settings</Text>
    )
  }
}
