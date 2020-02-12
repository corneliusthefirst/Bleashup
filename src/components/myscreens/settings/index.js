import React, { Component } from "react";
import autobind from "autobind-decorator";
import {
  Content, Card, CardItem, Text, Body, Container, Header, Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner, Button
} from "native-base";
//import { Button,View } from "react-native";

import styles from "./styles";
import stores from "../../../stores";
import { functionDeclaration } from "@babel/types";
const loginStore = stores.LoginStore;

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
