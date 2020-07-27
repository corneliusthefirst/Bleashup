import React, { Component } from "react";
import { View, StyleSheet}  from 'react-native';
import Icon from "react-native-vector-icons/Ionicons"
import shadower  from "../../shadower";
import ColorList from "../../colorList";
import GState from '../../../stores/globalState/index';

export default class HeaderHome extends Component {
    constructor(props){
        super(props);

    }
    render(){
        return(
          <View style={styles.container}>
              {this.props.back ?  <View>
                  <Icon type="Ionicons" name="md-arrow-round-back" onPress={this.props.action} 
                  style={styles.icon}/>
              </View> :null}
              <View style={styles.image}>
                <Image resizeMode={"cover"} source={GState.bleashupImage} style={{width:120,height:48}}></Image>
              </View>

          </View>
        )
    }
}
const styles = StyleSheet.create({
    container: { 
        height: ColorList.headerHeight, 
        backgroundColor: ColorList.headerBackground, 
        ...shadower(3), 
        flexDirection: "row",
    },
     icon: {
        color: ColorList.headerIcon
    },
    image: {
        justifyContent: "center",
        height: "95%",
        marginLeft: "5%"
    }
})