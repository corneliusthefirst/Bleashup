/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  View,
  Vibration,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';

import {
  Card,
  CardItem,
  Text,
  Label,
  Spinner,
  Button,
  Container,
  Icon,
  Thumbnail,
  Title,
  Item,
  Toast,
} from 'native-base';
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
import Contacts from 'react-native-contacts';
import BleashupFlatList from '../../BleashupFlatList';
import GState from '../../../stores/globalState/index';
import CacheImages from '../../CacheImages';
import stores from '../../../stores';
import { functionDeclaration } from '@babel/types';
import testForURL from '../../../services/testForURL';
import {
  find,
  uniqBy,
  uniq,
  filter,
  concat,
  reject,
  uniqWith,
  findIndex,
} from 'lodash';
import request from '../../../services/requestObjects';
import autobind from 'autobind-decorator';
import Invite from './invite';
import moment from 'moment';
import ColorList from '../../colorList';
import countries from '../login/countries';
import CreateRequest from '../event/createEvent/CreateRequester';
import firebase from 'react-native-firebase';
import shadower from '../../shadower';
import BeNavigator from '../../../services/navigationServices';
import ProfileViewCall from './ProfileViewCall';
import getRelation from './Relationer';

var uuid = require('react-native-uuid');
uuid.v1({
  node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
  clockseq: 0x1234,
  msecs: new Date().getTime(),
  nsecs: Math.floor(Math.random() * 5678) + 50,
});

let { height, width } = Dimensions.get('window');
export default class ContactView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMount: false,
      contacts: [],
      user: null,
      invite: false,
      alreadyCreated: false,
      searchArray: [],
      creating: false,
    };
  }
  searchArray = [];
  codeObj = find(countries, { id: stores.LoginStore.user.country_code });

  phoneContacts = [];
  init = () => {
    if (stores.Contacts.contacts.phoneContacts && stores.Contacts.contacts.phoneContacts.length > 0){
      console.warn('here1',stores.Contacts.contacts.phoneContacts);

      stores.Contacts.contacts &&
      stores.Contacts.contacts.contacts &&
      stores.Contacts.contacts.contacts.forEach((contact) => {
        if (contact.phone) {
          let phoneUser = {
            nickname: '',
            phone: contact.phone,
            profile: '',
            status: '',
            found: true,
          };
          this.phoneContacts.push(phoneUser);
        }
      });

      console.warn('here they are',this.phoneContacts);
       this.phoneContacts = concat(this.phoneContacts,stores.Contacts.contacts.phoneContacts);

       this.setState({ contacts: this.phoneContacts , searchArray: this.phoneContacts });

       this.setState({ isMount: true });

    } else {
       this.updatePhoneContacts(false);
   }
  };


updatePhoneContacts = (bool) => {
  this.setState({creating: bool});
  setTimeout(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'Bleashup would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    }).then(() => {
      console.warn('here');
        Contacts.getAll((err, contacts) => {
          if (err === 'denied') {
            // error
          } else {
            this.getValidUsers(contacts);
            this.setState({ isMount: true , creating:false});
          }
        });

    });
  }, 500);
}


  componentDidMount() {
    this.init();
  }

  array = [];
  getValidUsers(contacts) {

     //then push those from the phone
      contacts.forEach((contact) => {
          var phoneUser = {
            nickname: contact.displayName,
            phone: '',
            profile: contact.thumbnailPath,
            status: '',
            found: false,
          };
          contact.phoneNumbers.forEach((subcontact) => {
            subcontact.number.charAt(0) != '+'
              ? (subcontact.number = '00' + this.codeObj.code + subcontact.number)
              : (subcontact.number = subcontact.number.replace('+', '00'));
            phoneUser.phone = subcontact.number;
            this.array.push(phoneUser);
          });
        });

    //set phoneContacts in the store
    stores.Contacts.setPhoneContacts(uniqBy(this.array, 'phone')).then(()=>{
        console.warn('contacts set');
    });

    //first push contacts from contacts store
    stores.Contacts.contacts &&
      stores.Contacts.contacts.contacts &&
      stores.Contacts.contacts.contacts.forEach((contact) => {
        if (contact.phone) {
          let phoneUser = {
            nickname: '',
            phone: contact.phone,
            profile: '',
            status: '',
            found: true,
          };
          this.array.push(phoneUser);
        }
      });

    //console.warn(this.array);
    let cons = uniqBy(this.array, 'phone');
    this.setState({ contacts: cons });
    this.setState({ searchArray: cons });
  }

  invite = () => {};

  findIn = (arrayOfObjects, object) => {
    arrayOfObjects.forEach((element) => {
      if (element.phone === object.phone) {
        return true;
      }
    });
    return false;
  };

  createRelation = (user) => {
    getRelation(user)
      .then((relation) => {
        BeNavigator.navigateToActivity('EventChat', relation);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  updateContact = (user) => {
    let index = findIndex(this.state.searchArray, { phone: user.phone });
    if (index >= 0) {
      this.state.searchArray[index].nickname = user.nickname;
      this.state.searchArray[index].profile = user.profile;
      this.state.searchArray[index].status = user.status;
    } else {
      this.state.searchArray.push(user);
    }
  };

  searchUser = () => {
    this.props.navigation.navigate('SearchUser', {
      userdata: this.state.searchArray,
    });
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: ColorList.bodyBackground,
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <View style={{ height: '8%' }}>
          <View
            style={{
              height: ColorList.headerHeight,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              ...bleashupHeaderStyle,
            }}
          >
            <View
              style={{
                flex:1,
                paddingLeft: '4%',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Icon
                name="arrow-back"
                active={true}
                type="MaterialIcons"
                style={{ color: ColorList.headerIcon }}
                onPress={() => this.props.navigation.navigate('Home')}
              />
              <Text
                style={{
                  fontSize: ColorList.headerFontSize,
                  fontWeight: 'bold',
                  paddingLeft: '7%',
                }}
              >
                Contacts
              </Text>
            </View>

            <View style={{ width:45 }}>
              <TouchableOpacity>
                <Icon
                  name="search"
                  type="EvilIcons"
                  style={{ color: ColorList.headerIcon }}
                  onPress={this.searchUser}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={{ height: '9%' }}
          onPress={() => this.props.navigation.navigate('NewContact')}
        >
          <View
            style={{
              flex: 1,
              width: '100%',
              paddingLeft: '2%',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 45,
                height: 45,
                alignItems: 'center',
                justifyContent: 'center',
                //marginLeft: '2%',
              }}
            >
              <Icon
                name="adduser"
                active={true}
                type="AntDesign"
                style={{ color: ColorList.bodyIcon, paddingRight: 6 }}
              />
            </View>
            <View style={{ marginLeft: '4%' }}>
              <Text>New Contact</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ height: '8%' }} onPress={this.invite}>
          <View
            style={{
              flex: 1,
              width: '100%',
              paddingLeft: '2%',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: width / 8,
                height: height / 16,
                borderRadius: 32,
                alignItems: 'center',
                justifyContent: 'center',
                //marginLeft: '2%',
              }}
            >
              <Icon
                name="sharealt"
                active={true}
                type="AntDesign"
                style={{ color: ColorList.bodyIcon, paddingRight: 6 }}
              />
            </View>
            <View style={{ marginLeft: '4%' }}>
              <Text>Invite Friends</Text>
            </View>
          </View>
        </TouchableOpacity>


        <View
          style={{
            flexDirection:'row',
            height: '5%',
            width:'100%',
            padding: '5%',
            alignItems:'center',
            //justifyContent:'flex-end',

          }}
        >
          <View style={{ flex:1,width:50,position:'absolute',left:3}} >
           {this.state.creating ? <Spinner style={{height:30}} /> : null}
        </View>

         <TouchableOpacity style={{flex:1,width:55,position:'absolute',right:0}}>

               <Icon
                name="ios-refresh"
                type="Ionicons"
                style={{ color: ColorList.bodyIcon,marginLeft:10 }}
                onPress={()=>this.updatePhoneContacts(true)}
              />

         </TouchableOpacity>

        </View>

        {this.state.isMount ? (
          <View style={{ height: '70%', paddingLeft: '2%' }}>
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
                this.delay = this.delay >= 15 ? 0 : this.delay + 1;

                return (
                  <View
                    style={{ height: 60, width: '100%', paddingLeft: '1.3%' }}
                  >
                    <ProfileViewCall
                      phoneInfo={item}
                      delay={this.delay}
                      phone={item.phone}
                      updateContact={this.updateContact}
                      createRelation={() => {
                        this.createRelation(item);
                      }}
                    />
                  </View>
                );
              }}
            />
            <Invite
              isOpen={this.state.invite}
              onClosed={() => {
                this.setState({ invite: false });
              }}
            />
          </View>
        ) : (
          <Spinner />
        )}
      </View>
    );
  }

}
