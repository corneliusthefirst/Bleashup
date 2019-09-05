import React, { Component } from 'react';
import {
  Platform, StyleSheet, Image, TextInput, FlatList, TouchableOpacity,
  ActivityIndicator, View, Alert, BackHandler, ToastAndroid
} from 'react-native';

import autobind from "autobind-decorator";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header, Form, Thumbnail, Item,
  Title, Input, Left, Right, H3, H1, H2, Spinner, Button, InputGroup,
  DatePicker, CheckBox, List, Accordion, DeckSwiper
} from "native-base";

import Swipeout from 'react-native-swipeout';
import Modal from 'react-native-modalbox';
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient'
import Svg, { Circle, Rect } from 'react-native-svg'
import styles from './style';
import CacheImages from "../../CacheImages";
import Exstyles from './style';
import { createOpenLink } from "react-native-open-maps";
import ProfileModal from '../invitations/components/ProfileModal';
import PhotoModal from "../invitations/components/PhotoModal";
import globalState from "../../../stores/globalState";
import AccordionModule from "../invitations/components/Accordion";
import DoublePhoto from "../invitations/components/doublePhoto";
import stores from '../../../stores';
import { filter } from 'lodash';


const defaultPlaceholderObject = {
  component: ActivityIndicator,
  props: {
    style: styles.activityIndicatorStyle
  }
};

// We will use this placeholder object to override the default placeholder.
const propOverridePlaceholderObject = {
  component: Image,
  props: {
    style: styles.image,
    // source: {require('../../../../Images/avatar.svg')}
  }
};

swipperComponent = (
  <View style={{ alignItems: "center" }}>
    <Icon name="trashcan" type="Octicons" onPress={{}} style={{ color: "#1FABAB" }} />
  </View>)



//Private class component for a flatLisItem
class CardListItem extends Component {
  constructor(props) {
    super(props);
  }


  state = {
    activeRowKey: null,
    isOpenDetails: false,
    isOpenStatus: false,
    enlargeEventImage: false,
    accept: null,
    deny: null,
    message: "",
    textcolor: "",
    loading: true,
    item: null,
    isJoining: false,
    hasJoin: false
  }

  componentDidMount() {
    stores.Invitations.translateToinvitationData(this.props.item).then(data => {
      let AccordData = data.sender_status
      max_length = data.sender_status.length
      let dataArray = [{ title: AccordData.slice(0, 35), content: AccordData.slice(35, max_length) }]
      this.setState({
        activeRowKey: null,
        isOpenDetails: false,
        isOpenStatus: false,
        enlargeEventImage: false,
        accept: this.props.item.accept,
        deny: this.props.item.deny,
        message: "",
        received : this.props.item.received,
        seen : this.props.item.seen,
        dataArray: dataArray,
        textcolor: "",
        event_id: data.event_id,
        loading: false,
        item: data,
        isJoining: false,
        hasJoin: false,
      });
    })
  }

 componentWillReceiveProps(nextProps) {
   stores.Invitations.translateToinvitationData(nextProps.item).then(data => {
     let AccordData = data.sender_status
     max_length = data.sender_status.length
     let dataArray = [{ title: AccordData.slice(0, 35), content: AccordData.slice(35, max_length) }]
     this.setState({
       activeRowKey: null,
       isOpenDetails: false,
       isOpenStatus: false,
       enlargeEventImage: false,
       accept: nextProps.item.accept,
       deny: nextProps.item.deny,
       message: "",
       received: nextProps.item.received,
       seen: nextProps.item.seen,
       dataArray: dataArray,
       textcolor: "",
       event_id: data.event_id,
       loading: false,
       item: data,
       isJoining: false,
       hasJoin: false,
     });
   })
 }
  //accepted invitation
  @autobind
  onAccept() {
    this.setState({ accept: true })
    this.state.item.accept = true
    //;
  }
  //refused invitation
  @autobind
  onDenied() {
    this.setState({ deny: true })
    this.state.item.deny = true
  }

  swipeSettings = {
    autoClose: true,
    //take this and do something onClose
    onClose: (secId, rowId, direction) => {
      if (this.state.activeRowKey != null) {
        this.setState({ activeRowKey: null });
      }
    },
    //on open i set the activerowkey
    onOpen: (secId, rowId, direction) => {
      this.setState({ activeRowKey: this.state.item.key });
    },

    right: [

      {
        onPress: () => {
          const deletingRow = this.state.activeRowKey;

          Alert.alert(
            'Alert',
            'Are you sure you want to delete ?',
            [
              { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },

              {
                text: 'Yes', onPress: () => {
                  this.props.sendCardListData.splice(this.props.index, 1);
                  //make request to delete to database(back-end)

                  //Refresh FlatList
                  this.props.parentCardList.refreshFlatList(deletingRow);
                }
              },
            ],
            { cancelable: true }
          );

        },
        text: 'Delete', type: 'delete', component: this.swipperComponent

      },

    ],

    rowId: this.props.index,
    sectionId: 1
  }



  render() {
    return (this.state.loading ? <SvgAnimatedLinearGradient primaryColor="#cdfcfc"
      secondaryColor="#FEFFDE" height={200}>
      <Circle cx="30" cy="30" r="30" />
      <Rect x="75" y="13" rx="4" ry="4" width="100" height="13" />
      <Rect x="75" y="37" rx="4" ry="4" width="50" height="8" />
      <Circle cx="30" cy="30" r="30" /><Circle cx="30" cy="30" r="30" />
      <Rect x="0" y="70" rx="5" ry="5" width="400" height="100" />
    </SvgAnimatedLinearGradient> :
      <Swipeout {...this.swipeSettings}>
        <Card style={{}}>
          <CardItem>
            <Left>
              <TouchableOpacity onPress={() => this.setState({ isOpenStatus: true })} >
                <CacheImages small thumbnails source={{ uri: this.state.item.sender_Image }}
                />
              </TouchableOpacity>
              <Body >
                <Text style={styles.flatlistItem} >{this.state.item.sender_name}</Text>

                {this.state.dataArray.content == "" ? <Text style={{
                  color: 'dimgray', padding: 10,
                  fontSize: 16, marginTop: -10, borderWidth: 0
                }} note>{this.state.item.sender_status}</Text> :

                  <AccordionModule dataArray={this.state.dataArray} />

                }
              </Body>
            </Left>
          </CardItem>
          <CardItem cardBody>
            <Left>
              <DoublePhoto enlargeImage={() => this.setState({ enlargeEventImage: true })} LeftImage={this.state.item.receiver_Image}
                RightImage={this.state.item.event_Image} />
            </Left>
            <Body >
              <TouchableOpacity onPress={() => {
                let event = filter(stores.Events.events, { id: this.state.event_id })
                this.props.navigation.navigate("Event", {
                  Event: event[0],
                  tab: "EventDetails"
                })
              }} >
                <Text style={{ marginLeft: -40 }}
                >{this.state.item.event_title}</Text>
                <Text style={{ marginLeft: -40, color: 'dimgray', fontSize: 12 }}> on the {this.state.item.created_date} at {this.state.item.event_time}</Text>
              </TouchableOpacity>
            </Body>
          </CardItem>

          <CardItem>
            {this.state.sent || this.state.item.sent ? (this.state.received || this.state.item.received ? (this.state.seen || this.state.item.seen ?
              <View style={{}}>
                <Icon name="checkcircle" type="AntDesign" onPress={{}} style={{ color: this.state.seen ? "#54F5CA" : "gray", marginLeft: 300 }} />
                {this.state.accept || this.state.item.accept ? <Text style={{ color: "green" }} note>accepted</Text> : null}
                {this.state.item.deny || this.state.deny ? <Text style={{ color: "red" }} note>denied</Text> : null}
              </View> :
              <View style={{}}>
                <Icon name="checkcircle" type="AntDesign" onPress={{}} style={{ color: "gray", marginLeft: 300 }} />
                {this.state.accept || this.state.item.accept ? <Text style={{ color: "green" }} note>accepted</Text> : null}
                {this.state.item.deny || this.state.deny ? <Text style={{ color: "red" }} note>denied</Text> : null}
              </View>
            )
              :
              <View style={{}}>
                <Icon name="checkcircleo" type="AntDesign" onPress={{}} style={{ color: "gray", marginLeft: 300 }} />
              </View>) : <Text note>sending...</Text>}
          </CardItem>

          <CardItem style={{ margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>

            <Text style={{ color: 'dimgray', fontSize: 13 }}>{this.state.item.received_date}</Text>

            <Text style={{ color: 'dimgray', fontSize: 13 }}>{this.state.item.invitation_status}</Text>

          </CardItem>

          <ProfileModal isOpen={this.state.isOpenStatus} profile={{
            nickname: this.state.item.sender_name,
            image: this.state.item.sender_Image,
            status: this.state.item.sender_status
          }} onClosed={() => this.setState({ isOpenStatus: false })} onAccept={this.onAccept} onDenied={this.onDenied} deny={this.state.deny}
            accept={this.state.accept} isJoining={this.state.isJoining} hasJoin={this.state.hasJoin}
            joined={() => this.setState({ hasJoin: true })} />

          <PhotoModal isOpen={this.state.enlargeEventImage} image={this.state.item.event_Image} onClosed={() => this.setState({ enlargeEventImage: false })}
            onAccept={this.onAccept} onDenied={this.onDenied} deny={this.state.deny}
            accept={this.state.accept} isJoining={this.state.isJoining} hasJoin={this.state.hasJoin}
            joined={() => this.setState({ hasJoin: true })} />

        </Card>
      </Swipeout>
    );
  }
}




export default CardListItem





/*
*/



/*
 componentDidMount() {
   BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);

 }
 componentWillUnmount() {
   BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
 }

 handleBackButton() {
   ToastAndroid.show("Back button is pressedee", ToastAndroid.SHORT);
   this.closeAllModals
   return true;
 }
 handleEvent = (event) => {
   this.setState({
     isOpenStatus: false
   })
 }
 handleEvent2 = (event) => {
   this.setState({
     enlargeEventImage: false
   })
 }

 handleEvent3 = (event) => {
   this.setState({
     isOpenDetails: false
   })
 }
 @autobind closeAllModals() {
   return this.setState({
     isOpenDetails: false,
     isOpenStatus: false,
     enlargeEventImage: false
   })
 }
*/




