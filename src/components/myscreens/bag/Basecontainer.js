import { Body, Button, Container, Header as NBHeader, Icon, Left, Right, Title } from "native-base";
import * as React from "react";
import { Component } from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons';

export default class BaseContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
        
        };
    }

   render() {
    const { title, navigation, scrollable, footer } = this.props;
    return (
      <Container>
        <NBHeader noShadow>
          <Left>
            <Button onPress={this.onDrawerOpenPress} transparent>
              <EvilIcons name="navicon" size={32} color={"grey"} />
            </Button>
          </Left>
          <Body>
                 <Title>{title}</Title>
          </Body>
          <Right style={{ alignItems: "center" }}>
            <Button transparent onPress={this.onCreatePress}>
              <MaterialIcons name="ios-add-outline" style={{ color: "grey", fontSize: 50 }} />
            </Button>
          </Right>
        </NBHeader>
        {scrollable ?
          <ScrollView style={{ backgroundColor: "white" }}>
            <KeyboardAvoidingView behavior="position">{this.props.children}</KeyboardAvoidingView>
          </ScrollView>
          : this.props.children}
        {footer}
      </Container>
    );
  }

  onDrawerOpenPress(){
    this.props.navigation.navigate("DrawerOpen");
  }
  onCreatePress(){
    this.props.navigation.navigate("Create");
  }
}