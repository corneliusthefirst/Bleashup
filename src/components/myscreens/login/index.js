import React, { Component } from "react";
import autobind from "autobind-decorator";
import {
  Content,
  Card,
  CardItem,
  Text,
  Body,
  Container,
  Header,
  Form,
  Item,
  Title,
  Input,
  Left,
  Right,
  Button
} from "native-base";
//import { Button,View } from "react-native";

import { AsyncStorage } from "react-native";
//import { observable } from 'mobx';
import { observer, extendObservable, inject } from "mobx-react";
import styles from "./styles";
import stores from "../../../stores";
import routerActions from "reazy-native-router-actions";
import { functionDeclaration } from "@babel/types";

const loginStore = stores.LoginStore;

@observer
export default class LoginView extends Component {
  constructor(props) {
    super(props);
    this._onClickContinue = this._onClickContinue.bind(this);
  }

  //@autobind
  _onClickContinue() {
    if (loginStore.checkUser(loginStore.PhoneNumber) == true) {
      this.props.navigation.navigate("SignIn");
    } else {
      this.props.navigation.navigate("SignUP");
    }
  }

  //@autobind
  _onPhoneNumberChanged(phonenumber) {
    this.loginStore.phonenumber = phonenumber;
  }

  render() {
    return (
      <Container>
        <Content>
          <Left />
          <Header style={{ marginBottom: 200 }}>
            <Body>
              <Title>BleashUp </Title>
            </Body>
            <Right />
          </Header>

          <Form style={styles.formstyle}>
            <Header style={{ marginBottom: -90 }}>
              <Left />
              <Body>
                <Title>Phone Number</Title>
              </Body>
            </Header>
            <Right />

            <Item style={{ marginTop: 80 }}>
              <Input
                placeholder="User Phone number"
                onChange={this._onPhoneNumberChanged}
              />
            </Item>

            <Button style={styles.buttonstyle} onPress={this._onClickContinue}>
              <Text style={{ paddingLeft: 40 }}> Continue </Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

/**
 * 
 *      <View>
        <Text> {loginStore.counter} </Text>
     

      <Button
            style={styles.button}
            onPress={() => loginStore.increment()}
            title="Increment"
            color="#805841"
          />
      <Button
            style={styles.button}
            onPress={() => loginStore.decrement()}
            title="Decrement"
            color="#805841"
      />


    </View>
 */

/*
//@inject('loginStore')
//const loginStore = new LoginStore();
//import LoginStore from "../../../stores/login/LoginStore";

 *       <Content padder style={{ marginTop: 0 }}>
      <Card style={{ flex: 0 }}>
        <CardItem>
          <Body>
            <Text>
              NativeBase builds a layer on top of React Native that provides
              you with basic set of components for mobile application
              development. This helps you to build world-class application
              experiences on native platforms.
            </Text>
          </Body>
        </CardItem>
      </Card>
    </Content>
 
  /*constructor(props) {
		extendObservable(this, {prop} )
    //return super(props)
  }

//const loginStore = stores.loginStore;
//const loginStore = React.useContext(LoginStore);

    */

/*
  render() {
    const { loginStore} = this.props;
  
    return (
      <Content padder style={{ marginTop: 0 }}>
        <Card style={{ flex: 0 }}>
          <CardItem>
            <Body>
              <Text>
                NativeBase builds a layer on top of React Native that provides
                you with basic set of components for mobile application
                development. This helps you to build world-class application
                experiences on native platforms.
              </Text>
            </Body>
          </CardItem>
        </Card>
      </Content>
    );
  } */

/*
import React, { Component } from 'react'
import { View, Text, TextInput, TouchableHighlight, StyleSheet } from 'react-native'
import {observer} from 'mobx-react'
import NewItem from '../../components/NewItem.js'

@observer
class TodoList extends Component {
  constructor () {
    super()
    this.state = {
      text: '',
      showInput: false
    }
  }
  toggleInput () {
    this.setState({ showInput: !this.state.showInput })
  }
  addListItem () {
    this.props.store.addListItem(this.state.text)
    this.setState({
      text: '',
      showInput: !this.state.showInput
    })
  }
  removeListItem (item) {
    this.props.store.removeListItem(item)
  }
  updateText (text) {
    this.setState({text})
  }
  addItemToList (item) {
    this.props.navigator.push({
      component: NewItem,
      type: 'Modal',
      passProps: {
        item,
        store: this.props.store
      }
    })
  }
  render() {
    const { showInput } = this.state
    const { list } = this.props.store
    return (
      <View style={{flex:1}}>
        <View style={styles.heading}>
          <Text style={styles.headingText}>My List App</Text>
        </View>
        {!list.length ? <NoList /> : null}
        <View style={{flex:1}}>
          {list.map((l, i) => {
            return <View key={i} style={styles.itemContainer}>
              <Text
                style={styles.item}
                onPress={this.addItemToList.bind(this, l)}>{l.name.toUpperCase()}</Text>
              <Text
                style={styles.deleteItem}
                onPress={this.removeListItem.bind(this, l)}>Remove</Text>
            </View>
          })}
        </View>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={
            this.state.text === '' ? this.toggleInput.bind(this)
            : this.addListItem.bind(this, this.state.text)
          }
          style={styles.button}>
          <Text style={styles.buttonText}>
            {this.state.text === '' && '+ New List'}
            {this.state.text !== '' && '+ Add New List Item'}
          </Text>
        </TouchableHighlight>
        {showInput && <TextInput
          style={styles.input}
          onChangeText={(text) => this.updateText(text)} />}
      </View>
    );
  }
}

const NoList = () => (
  <View style={styles.noList}>
    <Text style={styles.noListText}>No List, Add List To Get Started</Text>
  </View>
)

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
    flexDirection: 'row'
  },
  item: {
    color: '#156e9a',
    fontSize: 18,
    flex: 3,
    padding: 20
  },
  deleteItem: {
    flex: 1,
    padding: 20,
    color: '#a3a3a3',
    fontWeight: 'bold',
    marginTop: 3
  },
  button: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#156e9a'
  },
  buttonText: {
    color: '#156e9a',
    fontWeight: 'bold'
  },
  heading: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#156e9a'
  },
  headingText: {
    color: '#156e9a',
    fontWeight: 'bold'
  },
  input: {
    height: 70,
    backgroundColor: '#f2f2f2',
    padding: 20,
    color: '#156e9a'
  },
  noList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noListText: {
    fontSize: 22,
    color: '#156e9a'
  },
})

export default TodoList*/
