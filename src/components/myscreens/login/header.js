import React, { Component } from "react";
import { View,}  from 'react-native';
import {Icon,Thumbnail} from "native-base";
import shadower  from "../../shadower";
import ColorList from "../../colorList";

export default class HeaderHome extends Component {
    constructor(props){
        super(props);

    }
    render(){
        return(
          <View style={{ height:ColorList.headerHeight,backgroundColor:ColorList.headerBackground,...shadower(3),flexDirection:"row" }}>
              {this.props.back ?  <View>
                  <Icon type="Ionicons" name="md-arrow-round-back" onPress={this.props.action} style={{color:ColorList.headerIcon}}/>
              </View> :null}
              <View style={{ justifyContent:"center",height:"95%",marginLeft:"5%" }}>
                <Thumbnail source={require("../../../../assets/bleashuptitle1.png")} style={{width:120,height:48}}></Thumbnail>
              </View>

          </View>
        )
    }
} 