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
  Toast
} from "native-base";
import { without, concat, indexOf, forEach, find,reject } from "lodash"
import stores from "../../../../stores";
import { MenuDivider } from 'react-native-material-menu'
import ProfileView from "../../invitations/components/ProfileView";
import { FlatList, TouchableWithoutFeedback, ScrollView } from "react-native-gesture-handler";
import ListItem from "../../../../native-base-theme/components/ListItem";
import ProfileWithCheckBox from "./PofileWithCheckbox";
import Request from "../Requester";
import request from "../../../../services/requestObjects";
import moment from "moment"
import BleashupFlatList from '../../../BleashupFlatList';
export default class InvitationModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inviteViaEmail: false,
      contacts: [],
      selectedContacts: [],
      checked: [],
      isEmty :false,
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
    this.prepareInvites(members,status).then(invites => {
      Request.invite(invites,this.props.eventID).then((response => {
        this.setState({
          checked : [],
          inviting :false,
          masterStatus: false
        })
        Toast.show({type:"success",text:"invitations successfully sent !",position:"bottom",buttonText:"OK"})
      })).catch(eror => {
        this.setState({
          checked: [],
          inviting: false,
          masterStatus:false
        })
        Toast.show({ type: "default", text: "could not connect to the server !", position: "bottom", buttonText: "OK" })
      })
    })
  }
  componentDidMount() {
    setTimeout(() => {
      stores.Contacts.getContacts(stores.Session.SessionStore.phone).then(
        contacts => {
          if(contacts == "empty"){
            this.setState({
              isEmpty:true
            })
          }else{
            this.setState({ contacts: contacts });
          }
        }
      );
    }, 20)
  }
  inviteWithEmail(contacts, status) {

  }
  prepareInvites(contacts, status) {
    return new Promise((resolve, reject) => {
      let result = [];
      let i = 0
      contacts.forEach(contact => {
       this.translate(contact,status).then(invite => {
        result = result.concat([invite])
        invite = null
        if (i == contacts.length - 1) resolve(result)
        i++;
       })
      })
    });
  }
  translate(contact,status){
    return new Promise((resolve,reject)=>{
      let sample = request.Invite()
      let invite = sample
      invite.invitee = contact.phone
      invite.host = contact.host
      invite.invitation = {
        inviter: stores.Session.SessionStore.phone,
        invitee: contact.phone,
        invitation_id: this.props.eventID + "_" + contact.phone,
        host: stores.Session.SessionStore.host,
        period: request.Period(),
        event_id: this.props.eventID,
        status: status,    
      }
      resolve(invite)
    })
  }
  _keyExtractor = (item, index) => item.phone;
  render() {
    return (!this.state.masterModalOpened ?
      <Modal
        backdropOpacity={0.7}
        swipeToClose={false}
        backButtonClose={true}
        position={"top"}
        coverScreen={true}
        isOpen={this.props.isOpen}
        onClosed={() => this.props.close()}
        style={{
          height: this.state.inviteViaEmail ? "30%" : "100%",
          borderRadius: 8,
          backgroundColor: "#FEFFDE",
          width: "100%"
        }}
      ><Header>
          <Left>
            <TouchableOpacity
              onPress={() => {
                this.setState({ inviteViaEmail: !this.state.inviteViaEmail });
              }}
            ><Icon
                style={{ color: "#FEFFDE", paddingLeft: "5%" }}
                type={"Entypo"}
                name={this.state.inviteViaEmail ? "users" : "mail"}
              />
              <Label style={{ fontSize: 12, color: "#FEFFDE" }}>
                {this.state.inviteViaEmail ? "Contacts" : "Via Mail"}
              </Label>
            </TouchableOpacity>
          </Left>
          {this.state.inviteViaEmail ? null : (this.state.checked.length == 0 ?
            <Text
              style={{
                marginTop: "4%",
                marginLeft: "4%",
                fontWeight: "bold",
                color: "#FEFFDE"
              }}
            >
              Select contacts
              </Text>
            : <TouchableOpacity onPress={() => requestAnimationFrame(() => {
              if (this.state.checked.length == 1) {
                this.setState({ masterModalOpened: true })
              } else {
                this.props.close()
                this.invite(this.state.checked, this.state.masterStatus)
              }
            })}>
              <Icon type="EvilIcons"
                style={{
                  marginTop: "2%",
                  marginLeft: "50%",
                  fontSize: 50,
                  //fontWeight: "bold",
                  color: "#cdfcfc"
                }} name="sc-telegram"></Icon>
            </TouchableOpacity>)}
          <Right>
            <TouchableOpacity onPress={() => requestAnimationFrame(() => {
              this.props.close()
              this.setState({
                checked :[]
              })
            })
            }>
              <Icon
                style={{ color: "#FEFFDE" }}
                type="EvilIcons"
                name="close"
              />
            </TouchableOpacity>
          </Right>
        </Header>
        {this.state.inviteViaEmail ? (
          <View>
            <Item>
              <Input placeholder="phone/email" />
            </Item>
            <Item>
              <View style={{ margin: '3%', }}>
                <View style={{
                  display: "flex",
                  flexDirection: 'row',
                }}>
                  <TouchableOpacity onPress={() => requestAnimationFrame(() => this.setState({ masterStatus: !this.state.masterStatus }))}>
                    <Icon style={{ color: "#1FABAB" }} name={this.state.masterStatus ? "radio-button-checked" :
                      "radio-button-unchecked"} type="MaterialIcons"></Icon>
                  </TouchableOpacity>
                  <Text style={{ marginLeft: "10%", marginTop: "1%", fontWeight: "bold" }}>
                    MASTER
                      </Text>
                </View>
              </View>
            </Item>
            <Right>
              <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                this.inviteWithEmail(this.state.checked, this.state.masterStatus)
              })}>
                <Icon name="sc-telegram" style={{
                  color: "#1FABAB",
                  fontSize: 50,
                }} type="EvilIcons"></Icon>
              </TouchableOpacity>
            </Right>
          </View>
        ) : (
           
              <View >
                {this.state.isEmpty ? <Text style={{
                  margin: '10%',
                }} note>{"sory! could not load contacts; there's no connction to the server"}</Text> :  <BleashupFlatList
                  listKey={"contacts"}
                  keyExtractor={this._keyExtractor}
                  dataSource={this.state.contacts}
                  firstIndex={0}
                  renderPerBatch={7}
                  initialRender={15}
                  numberOfItems={this.state.contacts.length}
                  renderItem={(item, index ) =>
                    <View>
                      <ProfileWithCheckBox
                        index={indexOf(this.state.checked, item.phone)} phone={item.phone} check={(phone) =>
                          this.setState({
                            checked: concat(this.state.checked, [find(this.state.contacts,{phone:phone})])
                          })
                        }
                        uncheck={(phone) =>
                          this.setState({ checked: reject(this.state.checked, {phone:phone}) })
                        }></ProfileWithCheckBox>
                    </View>
                  }
                /* refreshControl={
                   <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
                 }*/
                ></BleashupFlatList>}
              </View>
          )}
      </Modal> :
      <Modal
        backdropOpacity={0.7} 
        swipeToClose={false}
        backButtonClose={true}
        position={"top"}
        coverScreen={true}
        isOpen={this.state.MasterModalOpened}
        onClosed={() => {this.setState({checked :[]}); this.setState({ masterModalOpened: false })}}
        style={{
          height: "35%",
          borderRadius: 8,
          backgroundColor: "#FEFFDE",
          width: "100%"
        }}
      >
        <View>
          <Header>
            <Left><Text style={{ fontWeight: "bold", color: "#FEFFDE" }}>Set MASTER</Text></Left>
            <Right><TouchableOpacity onPress={() => requestAnimationFrame(() =>{
              this.setState({ masterModalOpened: false, masterStatus: false, checked: [] })})}><Icon style={{
                color: "#FEFFDE"
              }} type="EvilIcons"
                name="close"></Icon></TouchableOpacity></Right>
          </Header>
          <View style={{
            display: "flex",
          }}>
            <View style={{ display: 'flex' }}>
              <View style={{margin: "2%",}}>
                <ProfileView phone={this.state.checked.length>=1?this.state.checked[0].phone:null}></ProfileView>
              </View>
              <View><MenuDivider></MenuDivider></View>
              <View style={{
                margin: '2%',
              }}>
                  <TouchableOpacity onPress={() => requestAnimationFrame(() => this.setState({ masterStatus: 
                    !this.state.masterStatus }))}>
                  <View style={{
                    display: "flex",
                    flexDirection: 'row',
                  }}>
                    <Icon style={{ color: "#1FABAB" }} name={this.state.masterStatus ? "radio-button-checked" :
                      "radio-button-unchecked"} type="MaterialIcons"></Icon>
                    <Text style={{ marginLeft: "10%", marginTop: "1%", fontWeight: "bold" }}>
                      MASTER
                      </Text>
                  </View>
                  </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{
            paddingTop: "1%",
            paddingLeft: "50%",
          }}>
          <TouchableOpacity onPress={() => requestAnimationFrame(() => {
            this.setState({
              masterModalOpened:false
            })
            this.props.close()
              this.invite(this.state.checked, this.state.masterStatus)
            })}>
              <Icon name="sc-telegram" style={{
                color: "#1FABAB",
                fontSize: 50,
              }} type="EvilIcons"></Icon>
            </TouchableOpacity>    
          </View>
        </View>
      </Modal>
    );
  }
}
