import React, { Component } from "react";
import autobind from "autobind-decorator";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header, Form, Thumbnail, Item,
  Title, Input, Left, Right, H3, H1, H2, Spinner, Button, InputGroup,
  DatePicker, CheckBox, List, Accordion, DeckSwiper
} from "native-base";
import {
  Platform, StyleSheet, Image, TextInput, FlatList, TouchableOpacity,
  ActivityIndicator, View, Alert, BackHandler, ToastAndroid
} from 'react-native';



export default class AccordionModule extends Component {
  constructor(props) {
    super(props);
  }

  _renderHeader(item, expanded) {
    return (
      <View style={{
        flexDirection: "row",
        padding: 5,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FEFFDE"
      }}  >
        <Text style={{ fontWeight: "400", fontStyle: "italic" }} note>
          {item.title}
        </Text>
        {expanded
          ? <Icon style={{ fontSize: 18 }} name="arrow-up" type="EvilIcons" />
          : <Icon style={{ fontSize: 18 }} name="arrow-down" type="EvilIcons"/>}

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
      renderHeader={this._renderHeader}
      renderContent={this._renderContent}
      style={{ borderWidth:0 }}
    />
    
    );
  }
}
