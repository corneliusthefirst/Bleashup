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

import { AsyncStorage, View, TouchableOpacity } from "react-native";
//import { observable } from 'mobx';
import { observer, extendObservable, inject } from "mobx-react";
import styles from "./styles";
import stores from "../../../stores";
import routerActions from "reazy-native-router-actions";
import { functionDeclaration } from "@babel/types";

import PhoneInput from "react-native-phone-input";
import CountryPicker from "react-native-country-picker-modal";

@observer
export default class LoginView extends Component {
  constructor(props) {
    super(props);
    this.onClickContinue = this.onClickContinue.bind(this);
    this.state = {
      cca2: "US",
      valid: "",
      type: "",
      value: ""
    };
  }
  loginStore = stores.LoginStore;
  componentDidMount() {
    this.setState({
      pickerData: this.phone.getPickerData()
    });
  }
  @autobind
  onPressFlag() {
    this.countryPicker.openModal();
  }

  selectCountry(country) {
    this.phone.selectCountry(country.cca2.toLowerCase());
    this.setState({ cca2: country.cca2 });
  }

  @autobind
  async updateInfo() {
    this.setState({
      valid: this.phone.isValidNumber(),
      type: this.phone.getNumberType(),
      value: this.phone.getValue()
    });
  }

  @autobind
  async onClickContinue() {
    try {
      await this.updateInfo();

      if (this.state.value == "") {
        throw new Error("Please provide phone number.");
      }
    } catch (e) {
      alert(e.message);
    }

    console.warn(this.state.valid);
    console.warn(this.state.type);
    console.warn(this.state.value);
    console.warn(this.state.cca2);

    /*  if (loginStore.checkUser(loginStore.phoneNumber) == true){
              this.props.navigation.navigate("SignIn")
        }else{
               this.props.navigation.navigate("SignUp")

        }*/
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
          <Header style={{ marginBottom: 450 }}>
            <Body>
              <Title>BleashUp </Title>
            </Body>
            <Right />
          </Header>

          <Form style={styles.formstyle}>
            <Header>
              <Left />
              <Body>
                <Title>BleashUp </Title>
              </Body>
            </Header>
            <Right />

            <Item style={{ marginTop: 5 }} regular>
              <PhoneInput
                ref={ref => {
                  this.phone = ref;
                }}
                onChange={value => this.updateInfo()}
                onPressFlag={this.onPressFlag}
                value={this.state.value}
              />
            </Item>

            <CountryPicker
              ref={ref => {
                this.countryPicker = ref;
              }}
              onChange={value => this.selectCountry(value)}
              translation="eng"
              cca2={this.state.cca2}
            >
              <View />
            </CountryPicker>

            <Button
              style={styles.buttonstyle}
              onPress={() => {
                this.onClickContinue();
              }}
            >
              <Text style={{ paddingLeft: 40 }}> Continue </Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

//console.warn(this.state.value)
//console.warn(this.state.type)
//console.warn(this.state.valid.toString())

/**
 * import React, { Component } from "react";
import autobind from "autobind-decorator";
import { Content, Card, CardItem, Text, Body,Container, Header, Form, Item,Title, Input, Left,Right,Button} from "native-base";
//import { Button,View } from "react-native";

import { AsyncStorage } from "react-native";
//import { observable } from 'mobx';
import { observer,extendObservable, inject } from "mobx-react";
import styles from "./styles";
import stores from "../../../stores";
import routerActions from 'reazy-native-router-actions';
import { functionDeclaration } from "@babel/types";


const loginStore = stores.loginStore;

@observer
export default class LoginView extends Component {
  constructor(props){
   super(props);
   this._onClickContinue = this._onClickContinue.bind(this);
   this.state = {
       phoneNumber:''
    };
   
 }

@autobind
_onClickContinue() {
        if (loginStore.checkUser(loginStore.phoneNumber) == true){
              this.props.navigation.navigate("SignIn")
        }else{
               this.props.navigation.navigate("SignUp")

            }
        } 
  
      
@autobind
_onPhoneNumberChanged(text) {
          this.setState({phoneNumber: text})
          loginStore.phoneNumber = this.state.phoneNumber
         // console.error( loginStore.phoneNumber)
  
}
 




  
  render() {

    return (
      <Container>
      <Content>
         <Left/>
      <Header style={{marginBottom:450}}>
      <Body>
            <Title>BleashUp </Title>
      </Body>
         <Right/>
      </Header>


        <Form style={styles.formstyle}>
          <Header >
            <Left/>
            <Body>
            <Title>Phone Number</Title>
            </Body>
           </Header>
          <Right/>

        <Item style={{marginTop:5}} regular >
        <Input placeholder="please enter phone number"  
        onChangeText = {this._onPhoneNumberChanged} 
        value = {this.state.phoneNumber} 
        keyboardType={'phone-pad'} />
        </Item>

          <Button   style={styles.buttonstyle}
           onPress={this._onClickContinue}
           >
          <Text style={{ paddingLeft:40}}> Continue </Text>
          </Button>

        </Form>

      </Content>
    </Container>


    );
  }
  
}



 */

/**
 *         <Input placeholder="please enter phone number"  
        onChangeText = {this._onPhoneNumberChanged} 
        value = {this.state.phoneNumber} 
        keyboardType={'phone-pad'} />


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

    


@autobind
renderInfo() {
  if (this.state.value) {
    return (
      <View style={styles.info}>
        <Text>
          Is Valid:{" "}
          <Text style={{ fontWeight: "bold" }}>
            {this.state.valid.toString()}
          </Text>
        </Text>
        <Text>
          Type: <Text style={{ fontWeight: "bold" }}>{this.state.type}</Text>
        </Text>
        <Text>
          Value:{" "}
          <Text style={{ fontWeight: "bold" }}>{this.state.value}</Text>
        </Text>
        <Text>
          Value:{" "}
          <Text style={{ fontWeight: "bold" }}>{this.state.cca2}</Text>
        </Text>
      </View>
    );
  }
}*/

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
