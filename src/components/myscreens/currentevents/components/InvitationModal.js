import React, { PureComponent } from "react";

import { TouchableOpacity, View, RefreshControl, Image } from "react-native";
import Modal from "react-native-modalbox";
import {
  Content,
  Header,
  Item,
  Input,
  Left,
  Right,
  Icon,
  Body,
  Title,
  Label,
  Text,
  Container,
  CheckBox,
  Footer,
  Toast,
  Spinner
} from "native-base";
import { without, concat, indexOf, forEach, find, reject } from "lodash"
import stores from "../../../../stores";
import ProfileView from "../../invitations/components/ProfileView";
import { FlatList, TouchableWithoutFeedback, ScrollView } from "react-native-gesture-handler";
import ListItem from "../../../../native-base-theme/components/ListItem";
import ProfileWithCheckBox from "./PofileWithCheckbox";
import Request from "../Requester";
import request from "../../../../services/requestObjects";
import moment from "moment"
import BleashupFlatList from '../../../BleashupFlatList';
import Menu, { MenuDivider, MenuItem } from 'react-native-material-menu';
import Mailer from 'react-native-mail';
import uuid from 'react-native-uuid';
export default class InvitationModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inviteViaEmail: false,
      contacts: [],
      selectedContacts: [],
      checked: [],
      check: false,
      loading: false,
      isEmty: false,
      masterModalOpened: false,
      masterStatus: false
    };
    this.contacts = [];
    this.previousState = this.state.inviteViaEmail;
  }
  onRefresh() {
    this.setState({ refreshing: true })
    //call your callback function here
    this.addInvitation()
    this.setState({ refreshing: false })
  }
  invite(members, status) {
    this.props.close()
    if (members.length <= 0) {
      Toast.show({ text: "no contacts selected to be invited" })
    } else {
      if (this.props.master) {
        this.prepareInvites(members, status).then(invites => {
          Request.invite(invites, this.props.eventID).then((response => {
            this.setState({
              checked: [],
              inviting: false,
              masterStatus: false
            })
            Toast.show({ type: "success", text: "invitations successfully sent !", position: "bottom", buttonText: "OK" })
          })).catch(eror => {
            this.setState({
              checked: [],
              inviting: false,
              masterStatus: false
            })
            Toast.show({ type: "default", text: "could not connect to the server !", position: "bottom", buttonText: "OK" })
          })
        })
      } else {

        Toast.show({ type: "default", text: "sorry! you cannont invite for event", position: "bottom", buttonText: "OK" })
      }
    }
  }
  componentDidMount() {

  }

  inviteWithEmail(email, status) {
    Mailer.mail({
      subject: 'need help',
      recipients: ['fokam.giles@yahoo.com'],
      ccRecipients: ['supportCC@example.com'],
      bccRecipients: ['supportBCC@example.com'],
      body: '<b>A Bold Body</b>',
      isHTML: true,
      attachment: {
        path: '',  // The absolute path of the file from which to read data.
        type: '',   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
        name: '',   // Optional: Custom filename for attachment
      }
    }, (error, event) => {
      Alert.alert(
        error,
        event,
        [
          { text: 'Ok', onPress: () => console.log('OK: Email Error Response') },
          { text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response') }
        ],
        { cancelable: true }
      )
    });
  }
  prepareInvites(contacts, status) {
    return new Promise((resolve, reject) => {
      let result = [];
      let i = 0
      contacts.forEach(contact => {
        this.translate(contact, status).then(invite => {
          result = result.concat([invite])
          invite = null
          if (i == contacts.length - 1) resolve(result)
          i++;
        })
      })
    });
  }
  translate(contact, status) {
    return new Promise((resolve, reject) => {
      let sample = request.Invite()
      let invite = sample
      invite.invitee = contact.phone
      invite.host = contact.host
      invite.invitation = {
        inviter: stores.Session.SessionStore.phone,
        invitee: contact.phone,
        invitation_id: uuid.v1(),
        host: stores.Session.SessionStore.host,
        period: moment().format(),
        event_id: this.props.eventID,
        status: status,
      }
      resolve(invite)
    })
  }
  delay = 0
  _keyExtractor = (item, index) => item.phone;
  render() {
    return <Modal
      backdropPressToClose={false}
      //swipeToClose={false}
      backdropOpacity={0.7}
      backButtonClose={true}
      //entry={"top"}
      position='bottom'
      coverScreen={true}
      isOpen={this.props.isOpen}
      onClosed={() => {
        this.props.close()
        this.setState({
          contacts: null,
          check: [],
          loading: true
        })
      }
      }
      onOpened={() => {
        setTimeout(() => {
          stores.Contacts.getContacts(stores.Session.SessionStore.phone).then(
            contacts => {
              if (contacts == "empty") {
                this.setState({
                  isEmpty: true,
                  loading: false
                })
              } else {
                this.setState({ contacts: contacts, loading: false });
              }
            }
          );
        }, 20)
      }}
      style={{
        height: "97%",
        borderRadius: 8, backgroundColor: '#FEFFDE', width: "100%"
      }}
    ><View>
        <View style={{ margin: "2%", width: "96%", flexDirection: 'row', height: 44 }}>
          <View style={{ width: "70%" }}>
            <Text
              style={{
                fontSize: 23,
                fontStyle: 'italic',
                fontWeight: "bold",
                //color: "#1FABAB"
              }}
            >
              Quick Invite
              </Text>
          </View>
          {this.state.checked.length > 0 ? <View style={{ width: "30%" }}><TouchableOpacity onPress={() => requestAnimationFrame(() => {
            this.invite(this.state.checked, false)
          })}>
            <Icon type="EvilIcons"
              style={{
                marginLeft: "50%",
                fontSize: 50,
                //fontWeight: "bold",
                color: "#1FABAB"
              }} name="sc-telegram"></Icon>
          </TouchableOpacity>
          </View> : null}
        </View>{this.state.loading ? <Spinner size={"small"}></Spinner> :
          <View>
            {this.state.isEmpty ? <Text style={{
              margin: '10%',
            }} note>{"sory! could not load contacts; there's no connction to the server"}</Text> : <View style={{ height: "93%" }}><BleashupFlatList
              listKey={"contacts"}
              keyExtractor={this._keyExtractor}
              dataSource={this.state.contacts}
              firstIndex={0}
              renderPerBatch={7}
              initialRender={15}
              numberOfItems={this.state.contacts.length}
              renderItem={(item, index) =>{
                this.delay = this.delay >= 15 ? 0:this.delay + 1
                return (<View style={{ margin: 4 }}>
                  <ProfileWithCheckBox delay={this.delay} checked={false}
                    index={indexOf(this.state.checked, item.phone)} phone={item.phone} check={(phone) =>
                      this.setState({
                        checked: concat(this.state.checked, [item]),
                      })
                    }
                    uncheck={(phone) =>
                      this.setState({ checked: reject(this.state.checked, ele => ele.phone == phone) })
                    }></ProfileWithCheckBox>
                  <MenuDivider color="#1FABAB" />
                </View>)}
              }
            /* refreshControl={
               <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
             }*/
            ></BleashupFlatList></View>}
          </View>}
      </View>
    </Modal>
  }
}
