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
  Text,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';

import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
import Contacts from 'react-native-contacts';
import BleashupFlatList from '../../BleashupFlatList';
import GState from '../../../stores/globalState/index';
import CacheImages from '../../CacheImages';
import stores from '../../../stores';
import testForURL from '../../../services/testForURL';
import {
  find,
  uniqBy,
  uniq,
  concat,
  findIndex,
} from 'lodash';
import request from '../../../services/requestObjects';
import Invite from './invite';
import ColorList from '../../colorList';
import countries from '../login/countries';
import CreateRequest from '../event/createEvent/CreateRequester';
import firebase from 'react-native-firebase';
import shadower from '../../shadower';
import BeNavigator from '../../../services/navigationServices';
import ProfileViewCall from './ProfileViewCall';
import getRelation from './Relationer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Spinner from '../../Spinner';
import Searcher from './Searcher';
import BeComponent from '../../BeComponent';
import globalFunctions from '../../globalFunctions';
import Texts from '../../../meta/text';
import Toaster from '../../../services/Toaster';
import { justSearch, cancelSearch, startSearching } from '../eventChat/searchServices';
import ActivityPages from '../eventChat/chatPages';
import initAllContacts from './initAllContacts';


let { height, width } = Dimensions.get('window');
export default class ContactView extends BeComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMount: false,
      contacts: [],
      searchString: "",
      user: null,
      invite: false,
      alreadyCreated: false,
      creating: false,
    };
    this.search = justSearch.bind(this)
    this.cancelSearch = cancelSearch.bind(this)
    this.startSearching = startSearching.bind(this)
    this.initAllContacts = initAllContacts.bind(this)
  }
  codeObj = find(countries, { id: stores.LoginStore.user.country_code });

  phoneContacts = [];
  init = () => {
    this.initAllContacts()
    setTimeout(() => {
      this.updatePhoneContacts(true);
    }, 1000)
  };


  updatePhoneContacts = (bool) => {
    this.setStatePure({ creating: bool });
    setTimeout(() => {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: Texts.beup_wants_to_access_your_contacts,
        buttonPositive: Texts.accept,
      }).then(() => {
        Contacts.getAll((err, contacts) => {
          if (err === 'denied') {
            // error
          } else {
            this.getValidUsers(contacts);
            this.setStatePure({ isMount: true, creating: false });
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
    stores.Contacts.setPhoneContacts(uniqBy(this.array, 'phone')).then(() => {
      console.warn('contacts set');
    });

    //first push contacts from contacts store
    let newContacts = stores.Contacts.contacts &&
      stores.Contacts.contacts.contacts &&
      stores.Contacts.contacts.contacts.map((contact) => {
        return {
          nickname: '',
          phone: contact.phone,
          profile: '',
          status: '',
          found: true,
        }
      });
    let cons = uniqBy(newContacts ? newContacts.concat(this.array) : this.array, "phone")
    this.setStatePure({ contacts: cons });
  }

  invite = () => { };
  showInvite(profile) {
    this.setStatePure({
      invite: true,
      currentIvitee: profile
    })
  }
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
        BeNavigator.navigateToActivity(ActivityPages.chat, relation);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  render() {
    let data = this.state.contacts
    data = data.filter(ele => ele.phone && globalFunctions.filterForRelation(ele, this.state.searchString))
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: ColorList.bodyBackground,
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <View style={{ height: ColorList.headerHeight }}>
          <View
            style={{
              height: ColorList.headerHeight,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              ...bleashupHeaderStyle,
            }}
          >
            {!this.state.searching ? <View
              style={{
                flex: 1,
                paddingLeft: '4%',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <MaterialIcons
                name="arrow-back"
                active={true}
                type="MaterialIcons"
                style={{ ...GState.defaultIconSize, color: ColorList.headerIcon }}
                onPress={() => this.props.navigation.navigate('Home')}
              />
              <Text
                style={{
                  ...GState.defaultTextStyle,
                  fontSize: ColorList.headerFontSize,
                  fontWeight: 'bold',
                  paddingLeft: '7%',
                }}
              >
                Relations
              </Text>
            </View> : null
            }

            <View style={{
              width: this.state.searching ? "90%" : 35,
              height: 35,
              marginLeft: "auto",
              marginRight: "1%",
            }}>
              <Searcher
                search={this.search}
                searching={this.state.searching}
                searchString={this.state.searchString}
                startSearching={this.startSearching}
                cancelSearch={this.cancelSearch}
              >
              </Searcher>
            </View>
          </View>
        </View>
        <View style={{
          margin: '2%',
          marginLeft: "3%",
        }}><Text style={{ ...GState.defaultTextStyle, color: ColorList.darkGrayText, fontStyle: 'italic', }}>{Texts.start_a_relation_or_invite_a_contact}</Text></View>
        <View
          style={{
            flexDirection: 'row',
            height: '5%',
            width: '100%',
            padding: '5%',
            alignItems: 'center',
            //justifyContent:'flex-end',

          }}
        >
          <View style={{ flex: 1, width: 50, position: 'absolute', left: 3 }} >
            {this.state.creating ? <Spinner style={{ height: 30 }} /> : null}
          </View>

          <TouchableOpacity style={{ flex: 1, width: 200, position: 'absolute', flexDirection: 'row', right: 0 }}>
            <Text style={{ marginTop: "4%", }}>{Texts.refresh_your_conctacts}</Text>
            <Ionicons
              name="ios-refresh"
              type="Ionicons"
              style={{ ...GState.defaultIconSize, color: ColorList.bodyIcon, marginLeft: 10 }}
              onPress={() => this.updatePhoneContacts(true)}
            />

          </TouchableOpacity>

        </View>

        {this.state.isMount ? (
          <View style={{ height: '80%', paddingLeft: '2%' }}>
            <BleashupFlatList
              //notOptimized={this.state.searching && this.state.searchString}
              initialRender={15}
              renderPerBatch={15}
              style={{ backgroundColor: ColorList.bodyBackground }}
              firstIndex={0}
              numberOfItems={data.length}
              keyExtractor={(item, index) => item.phone}
              dataSource={data}
              noSpinner={true}
              renderItem={(item, index) => {
                this.delay = this.delay >= 15 ? 0 : this.delay + 1;

                return (<View
                  style={{ height: 60, width: 250, paddingLeft: '1.3%' }}
                >
                  <ProfileViewCall
                    showInvite={this.showInvite.bind(this)}
                    phoneInfo={item}
                    searching={this.state.searching && this.state.searchString}
                    searchString={this.state.searchString}
                    delay={this.delay}
                    phone={item.phone}
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
                this.setStatePure({ invite: false });
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
