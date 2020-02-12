import React, { Component } from "react";
import GState from "../../../stores/globalState";
import autobind from "autobind-decorator";
import {
  Content,Card,CardItem,Text,Body,Container,Header,Form,Item,Title,Input,Left,Right,
  Spinner,Button
} from "native-base";

import { AsyncStorage } from "react-native";
//import { observer, extendObservable, inject } from "mobx-react";
import styles from "./styles";
import stores from "../../../stores";
import Story from 'react-native-story'


/*@observer*/
export default class StatusView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <Text>Status Page</Text>
  }
}
 