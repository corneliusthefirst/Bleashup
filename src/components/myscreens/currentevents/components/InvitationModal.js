import React, { PureComponent } from "react";

import {
  TouchableOpacity, 
  View,  
  ScrollView,
  Text,
 } from "react-native";
import { concat, indexOf, forEach, reject,  } from "lodash"
import stores from "../../../../stores";
import ProfileView from "../../invitations/components/ProfileView";
import ProfileWithCheckBox from "./PofileWithCheckbox";
import Request from "../Requester";
import request from "../../../../services/requestObjects";
import moment from "moment"
import BleashupFlatList from '../../../BleashupFlatList';
import Menu, { MenuDivider, MenuItem } from 'react-native-material-menu';
//import Mailer from 'react-native-mail';
import bleashupHeaderStyle from "../../../../services/bleashupHeaderStyle";
import BleashupModal from '../../../mainComponents/BleashupModal';
import CreationHeader from "../../event/createEvent/components/CreationHeader";
import Spinner from '../../../Spinner';
import Toaster from "../../../../services/Toaster";
import  EvilIcons  from 'react-native-vector-icons/EvilIcons';
import IDMaker from '../../../../services/IdMaker';
export default class InvitationModal extends BleashupModal {
  initialize(){
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
    this.setStatePure({ refreshing: true })
    //call your callback function here
    this.addInvitation()
    this.setStatePure({ refreshing: false })
  }
  invite(members, status) {
    this.props.close()
    if (members.length <= 0) {
      Toaster({ text: "no contacts selected to be invited" })
    } else {
      if (this.props.master) {
        this.prepareInvites(members, status).then(invites => {
          Request.invite(invites, this.props.eventID).then((response => {
            this.setStatePure({
              checked: [],
              inviting: false,
              masterStatus: false
            })
            Toaster({ type: "success", text: "invitations successfully sent !", position: "bottom", buttonText: "OK" })
          })).catch(eror => {
            this.setStatePure({
              checked: [],
              inviting: false,
              masterStatus: false
            })
            Toaster({ type: "default", text: "could not connect to the server !", position: "bottom", buttonText: "OK" })
          })
        })
      } else {

        Toaster({ type: "default", text: "sorry! you cannont invite for event", position: "bottom", buttonText: "OK" })
      }
    }
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
        invitation_id: IDMaker.make(),
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
  swipeToClose=false
  backdropOpacity=false
  onOpenModal(){
    setTimeout(() => {
      stores.Contacts.getContacts(stores.Session.SessionStore.phone).then(
        contacts => {
          if (contacts == "empty") {
            this.setStatePure({
              isEmpty: true,
              loading: false
            })
          } else {
            this.setStatePure({ contacts: contacts, loading: false });
          }
        }
      );
    }, 20)
  }
  onClosedModal(){
    this.props.close()
    this.setStatePure({
      contacts: null,
      check: [],
      loading: true
    })
  }
  modalBody() {
    return <View>
      <CreationHeader back={this.onClosedModal.bind(this)} title={"Quick Invite"} 
      extra={this.state.checked.length > 0 ? <View style={{ width: "100%",marginTop: 'auto',marginBottom: 'auto', }}>
        <EvilIcons 
        onPress={() => requestAnimationFrame(() => {
          this.invite(this.state.checked, false)
        })}
        style={{
            fontSize: 45,
            //fontWeight: "bold",
            color: "#1FABAB"
          }} name="sc-telegram"/>
      </View> : null}></CreationHeader>
       {this.state.loading ? <Spinner size={"small"}></Spinner> :
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
              renderItem={(item, index) => {
                this.delay = this.delay >= 15 ? 0 : this.delay + 1
                return (<View style={{ margin: 4 }}>
                  <ProfileWithCheckBox delay={this.delay} checked={false}
                    index={indexOf(this.state.checked, item.phone)} phone={item.phone} check={(phone) =>
                      this.setStatePure({
                        checked: concat(this.state.checked, [item]),
                      })
                    }
                    uncheck={(phone) =>
                      this.setStatePure({ checked: reject(this.state.checked, ele => ele && ele.phone == phone) })
                    }></ProfileWithCheckBox>
                  <MenuDivider color="#1FABAB" />
                </View>)
              }
              }
            ></BleashupFlatList></View>}
          </View>}
      </View>
  }
}
