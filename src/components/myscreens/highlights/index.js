import React, { Component } from "react";
import { Content, Card, CardItem, Text, Body, Icon, Header ,Button} from "native-base";
import GState from "../../../stores/globalState";
import { View ,Linking,Alert} from "react-native"
import { ScrollView, TouchableOpacity} from "react-native";
import Swipeout from "react-native-swipeout";



export default class Highlights extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
    <View style={{justifyContent:"center",alignItems:"center"}}>
             <Text>OpenLink</Text>
    </View>
    );
  }
}
