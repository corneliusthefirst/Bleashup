import React, { Component } from "react";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {
  Text, Platform, View,Dimensions
} from 'react-native';


let {height, width} = Dimensions.get('window')
export default class AccordionModule extends Component {
  constructor(props) {
    super(props);
  }

  _renderHeader(item, expanded) {
    return (
      <View style={{
        flexDirection: "row",
        //padding: 5,
       // justifyContent: "space-between",
        //backgroundColor: "green"
      }}  >
        <Text style={{ fontWeight: "400",fontSize:14, fontStyle: "italic" }} note>
          {item.title}
        </Text>
        {
          this.props.long &&
          (expanded
            ? <View style={{alignSelf:"flex-end" }}><EvilIcons style={{alignSelf:"flex-end",fontSize: 18 }} name="arrow-up" type="EvilIcons" /></View>
            : <EvilIcons style={{alignSelf:"flex-end",fontSize: 18 }} name="arrow-down" type="EvilIcons"/>)

        }
   
      </View>
    );
  }
  _renderContent(item) {
    return (
      <Text
        style={{
          backgroundColor: "#FEFFDE",
          paddingTop: -30,
          paddingLeft: 10,
          paddingBottom: 10,
          fontStyle: "italic",
          fontSize:14
        }}
        note
      >
        {item.content}
      </Text>
    );
  }


  render() {

    return (
      <Accordion
      dataArray={this.props.dataArray}
      animation={true}
      expanded={true}
      renderHeader={this._renderHeader.bind(this)}
      renderContent={this._renderContent}
      style={{ borderWidth:0,width:width-width/8 }}
    />
    
    );
  }
}
