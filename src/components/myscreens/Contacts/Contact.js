import React, { Component } from "react";
import { View, Vibration, FlatList, TouchableWithoutFeedback, Dimensions, TouchableOpacity, PermissionsAndroid, ScrollView } from 'react-native';

import {
  Card, CardItem, Text, Label, Spinner, Button, Container, Icon, Thumbnail, Title, Item, Toast
} from 'native-base';
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import Contacts from 'react-native-contacts';
import BleashupFlatList from '../../BleashupFlatList';
import GState from '../../../stores/globalState/index';
import CacheImages from '../../CacheImages';
import stores from "../../../stores";
import { functionDeclaration } from "@babel/types";
import testForURL from '../../../services/testForURL';
import { find, uniqBy, uniq, filter, concat, reject, uniqWith, findIndex } from "lodash";
import request from '../../../services/requestObjects';
import autobind from "autobind-decorator";
import Invite from './invite';
import moment from "moment";
import ColorList from '../../colorList';
import countries from '../login/countries';
import CreateRequest from '../event/createEvent/CreateRequester';
import firebase from 'react-native-firebase';
import shadower from "../../shadower";
import BeNavigator from "../../../services/navigationServices";
import ProfileViewCall from './ProfileViewCall';
import getRelation from './Relationer';




var uuid = require('react-native-uuid');
uuid.v1({
  node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
  clockseq: 0x1234,
  msecs: new Date().getTime(),
  nsecs: Math.floor(Math.random() * 5678) + 50
});





let { height, width } = Dimensions.get('window');
export default class ContactView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMount: false,
      contacts: [],
      user: null,
      invite: false,
      alreadyCreated: false,
      searchArray: [],
      creating: false,
    }

  }
  searchArray = []
  codeObj = find(countries, { id: stores.LoginStore.user.country_code })

  init = () => {

    setTimeout(() => {

      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          'title': 'Contacts',
          'message': 'Bleashup would like to view your contacts.',
          'buttonPositive': 'Please accept bare mortal'
        }
      ).then(() => {
        Contacts.getAll((err, contacts) => {
          if (err === 'denied') {
            // error
          } else {
            this.getValidUsers(contacts)
            this.setState({ isMount: true })
          }
        })
      })


    }, 500)

  }
  componentDidMount() {
    this.init();

  }

  array = [];
  getValidUsers(contacts) {
    //first push contacts from contacts store
    stores.Contacts.contacts && stores.Contacts.contacts.contacts && stores.Contacts.contacts.contacts.forEach((contact) => {
      if (contact.phone) {
        let phoneUser = { nickname: "", phone: contact.phone, profile: "", status: "", found: true }
        this.array.push(phoneUser);
      }
    })
    //then push those from the phone
    contacts.forEach((contact) => {
      var phoneUser = { nickname: contact.displayName, phone: "", profile: contact.thumbnailPath, status: "", found: false }
      contact.phoneNumbers.forEach((subcontact) => {
        subcontact.number.charAt(0) != "+" ? subcontact.number = "00" + this.codeObj.code + subcontact.number : subcontact.number = subcontact.number.replace("+", "00");
        phoneUser.phone = subcontact.number;
        this.array.push(phoneUser);
      })
    })
    console.warn(this.array)
    let cons = uniqBy(this.array, 'phone')
    this.setState({ contacts: cons });
    this.setState({ searchArray: cons })
  }






  invite = () => {
    /*.catch(e => {
      alert("Unable To Verify Your Account", "Please Check Your Internet Connection")
      //console.warn(e, "errr here!!!")
    })*/
    //this.setState({invite:true});
  }

  findIn = (arrayOfObjects, object) => {
    arrayOfObjects.forEach((element) => {
      if (element.phone == object.phone) {
        return true;
      }
    })
    return false;
  }

  createRelation = (user) => {
    getRelation(user).then((relation) => {
      BeNavigator.navigateToActivity('EventChat', relation)
    }).catch((err) => {
      console.warn(error)
    })
  }


  updateContact = (user) => {
    let index = findIndex(this.searchArray, { phone: user.phone });
    if (index >= 0) {
      this.searchArray[index].nickname = user.nickname;
      this.searchArray[index].profile = user.profile;
      this.searchArray[index].status = user.status;
    } else {
      this.searchArray.push(user)
    }
  }

  searchUser = () => {
    this.props.navigation.navigate('SearchUser', { userdata: this.searchArray });
  }



  render() {
    return (
      <View style={{ flex: 1, backgroundColor: ColorList.bodyBackground, flexDirection: "column", width: "100%" }}>

        <View style={{ height: "8%" }}>

          <View style={{ height: ColorList.headerHeight, width: "100%", flexDirection: "row", alignItems: "center", ...bleashupHeaderStyle }}>

            <View style={{ width: "85%", paddingLeft: "4%", flexDirection: "row", alignItems: "center" }}>
              <Icon name="arrow-back" active={true} type="MaterialIcons" style={{ color: ColorList.headerIcon }} onPress={() => this.props.navigation.navigate("Home")} />
              <Text style={{ fontSize: ColorList.headerFontSize, fontWeight: "bold", marginLeft: "7%" }}>Contacts</Text>
            </View>

            <View style={{ width: "15%" }}>
              <TouchableOpacity>
                <Icon name="search" type="EvilIcons" style={{ color: ColorList.headerIcon }} onPress={this.searchUser} />
              </TouchableOpacity>
            </View>


          </View>

        </View>


        <TouchableOpacity style={{ height: "9%" }} onPress={() => this.props.navigation.navigate("NewContact")} >

          <View style={{ flex: 1, width: "100%", paddingLeft: "2%", flexDirection: "row", alignItems: "center" }} >
            <View style={{ width: 45, height: 45, alignItems: "center", justifyContent: "center", marginLeft: "2%" }} >
              <Icon name="adduser" active={true} type="AntDesign" style={{ color: ColorList.bodyIcon, paddingRight: 6 }} />
            </View>
            <View style={{ marginLeft: "4%" }}>
              <Text>New Contact</Text>
            </View>
          </View>

        </TouchableOpacity>

        <TouchableOpacity style={{ height: "8%" }} onPress={this.invite} >
          <View style={{ flex: 1, width: "100%", paddingLeft: "2%", flexDirection: "row", alignItems: "center" }} >
            <View style={{ width: width / 8, height: height / 16, borderRadius: 32, alignItems: "center", justifyContent: "center", marginLeft: "2%" }} >
              <Icon name="sharealt" active={true} type="AntDesign" style={{ color: ColorList.bodyIcon, paddingRight: 6 }} />
            </View>
            <View style={{ marginLeft: "4%" }}>
              <Text>Invite Friends</Text>
            </View>
          </View>

        </TouchableOpacity>

        <View style={{ height: "5%", justifyContent: "center", alignItems: "flex-end", paddingRight: "5%" }}>
          {this.state.creating ? <Spinner></Spinner> : null}
        </View>

        {this.state.isMount ?
          <View style={{ height: "70%", paddingLeft: "2%" }}>

            <BleashupFlatList
              initialRender={15}
              renderPerBatch={15}
              style={{ backgroundColor: ColorList.bodyBackground }}
              firstIndex={0}
              extraData={this.state}
              keyExtractor={(item, index) => item.phone}
              dataSource={this.state.contacts}
              noSpinner={true}
              renderItem={(item, index) => {

                this.delay = this.delay >= 15 ? 0 : this.delay + 1

                return (

                  <View style={{ height: 60, width: "100%", paddingLeft: "1.3%" }}>
                    <ProfileViewCall phoneInfo={item} delay={this.delay} phone={item.phone} updateContact={this.updateContact} createRelation={() => { this.createRelation(item) }}></ProfileViewCall>
                  </View>
                )
              }
              }

            >
            </BleashupFlatList>
            <Invite isOpen={this.state.invite} onClosed={() => { this.setState({ invite: false }) }} />
          </View>
          : <Spinner></Spinner>}





      </View>
    );
  }

}