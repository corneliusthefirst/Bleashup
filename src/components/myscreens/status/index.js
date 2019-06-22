import React, { Component } from "react";
import { Content, Card, CardItem, Container, Text, Body } from "native-base";
import NestedScrollView from "react-native-nested-scroll-view";
import GState from "../../../stores/globalState";
import autobind from "autobind-decorator";
import {
  Content,
  Card,
  CardItem,
  Text,
  Body,
  Container,
  Header,
  Form,
  Item,
  Title,
  Input,
  Left,
  Right,
  H3,
  H1,
  H2,
  Spinner,
  Button
} from "native-base";

import { AsyncStorage } from "react-native";
import { observer, extendObservable, inject } from "mobx-react";
import styles from "./styles";
import stores from "../../../stores";

const loginStore = stores.LoginStore;

@observer
export default class StatusView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <Text>Status</Text>;
  }
}
