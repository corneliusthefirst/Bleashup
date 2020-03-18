import React, { Component } from "react";
import GState from "../../../stores/globalState";
import autobind from "autobind-decorator";
import {Item,Title,Input,Left,Right,Button,Icon} from "native-base";

import { Image,StyleSheet,Text, TouchableOpacity, View,Dimensions,ScrollView } from "react-native";
import { observer, extendObservable, inject } from "mobx-react";
import stores from "../../../stores";
import { find, findIndex, uniqBy, reject,filter,forEach } from "lodash";

let { height, width } = Dimensions.get('window');
@observer
export default class StatusView extends Component {
  constructor(props) {
    super(props);

  }



  render() {
    return(
      <View style={{flex:1,backgroundColor:"#FEFFDE"}}>

    
      </View>
     
    )
  }
}
 



const styles = StyleSheet.create({
  circle: {
    width: 66,
    margin: 4,
    height: 66,
    borderRadius: 33,
  },
});

























