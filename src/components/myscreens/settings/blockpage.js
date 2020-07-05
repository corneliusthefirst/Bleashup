/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import {View,Dimensions,TouchableWithoutFeedback,Text} from "react-native";
import stores from "../../../stores";
import {Icon} from "native-base";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import ColorList from '../../colorList';

let { height, width } = Dimensions.get('window');
export default class BlockView extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(){

  }

  render() {
    return (
      <View style={{ backgroundColor: ColorList.bodyBackground,flexDirection:"column",width:"100%",height:"100%" }}>

      <View style={{ height:ColorList.headerHeight}}>
           <View style={{
                ...bleashupHeaderStyle,
                height:ColorList.headerHeight
              }}>
                 <View style={{flex:1,flexDirection:"row",marginLeft:10,justifyContent:"flex-start",alignItems:'center'}}>
                 <Icon name="arrow-back" active={true} type="MaterialIcons" style={{ color: ColorList.headerIcon}} onPress={() => this.props.navigation.goBack()} />
                 <Text style={{fontSize:16,fontWeight:"bold",marginLeft:10,color:ColorList.bodyText}}>Block Settings</Text>
                 </View>
          </View>
        </View>


      </View>
    );
  }
}
