import React, { Component } from "react";
import { Text } from "react-native";
import { Container, Header, Body, Title, Left, Button, Icon, View, Right } from "native-base";
import autobind from "autobind-decorator";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class ChangeLogs extends Component {
  constructor(props) {
    super(props);
  }
  @autobind goBack() {
    this.props.navigation.goBack()
  }
  render() {
    return (<Container>
      <Header>
        <Left>
          <TouchableOpacity onPress={this.goBack} >
            <Icon style={{ color: "#FEFFDE" }} name="arrow-left" type="EvilIcons"></Icon>
          </TouchableOpacity>
        </Left>
        <Body><View><Title>
          Change Logs
          </Title></View></Body>
        <Right>
          <Button transparent>
            <Icon style={{ color: "#FEFFDE" }} name="dots-three-vertical" type="Entypo"></Icon>
          </Button>
        </Right>
      </Header>
      <Text> sample Event ChangeLogs </Text>
    </Container>
    )
  }
}
