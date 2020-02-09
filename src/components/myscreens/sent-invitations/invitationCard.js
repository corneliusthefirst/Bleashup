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
import DoublePhoto from "../invitations/components/doublePhoto";
import stores from '../../../stores';
import { filter } from 'lodash';
import moment from "moment"
import testForURL from '../../../services/testForURL';

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
    hasJoin: true
  }
  data = []
  componentDidMount() {
    setTimeout(() => {
      stores.Invitations.translateToinvitationData(this.props.item, true).then(data => {
        this.setState({
          activeRowKey: null,
          isOpenDetails: false,
          isOpenStatus: false,
          enlargeEventImage: false,
          accept: this.props.item.accept,
          deny: this.props.item.deny,
          message: "",
          received: this.props.item.received,
          seen: this.props.item.seen,
          textcolor: "",
          event_id: data.event_id,
          loading: false,
          item: data,
          isJoining: false,
          hasJoin: true,
        });
      })
    }, this.props.time_delay + 20)
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return nextProps.item.invitation_id !== this.props.item.invitation_id ||
      this.state.loading !== nextState.loading ||
      nextProps.item.sent !== this.props.item.sent ||
      nextProps.item.received !== this.props.item.received ||
      nextProps.item.seen !== this.props.item.seen ||
      nextProps.item.accept !== this.props.item.accept ||
      nextProps.item.deny !== this.props.item.deny ||
      this.state.opening !== nextState.opening
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      accept: nextProps.item.accept,
      deny: nextProps.item.deny,
      received: nextProps.item.received,
      seen: nextProps.item.seen,
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
      this.setState({ activeRowKey: 1 });
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
    style: {
      width: "100%",
      backgroundColor: "#FEFFDE"
    },
    rowId: this.props.index,
    sectionId: 1
  }



  render() {
    return (this.state.loading ? <Card style={{ height: 220 }}></Card> : <View style={{ width: "100%", }}>
      <Swipeout style={{ width: "100%", }} {...this.swipeSettings}>
        <Card >
          <CardItem>
            <Text style={{ fontSize: 14, }} note>
              sent
        </Text>
          </CardItem>
          <CardItem>
            <Left style={{margin: '2%'}}>
              <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.showPhoto(this.state.item.sender_Image))} >
                {this.state.loading || !testForURL(this.state.item.sender_Image) ? <CacheImages small thumbnails source={{ uri: this.state.item.sender_Image }} /> :
                  <Thumbnail small source={{ uri: this.state.item.sender_Image }}></Thumbnail>}
              </TouchableOpacity>
              <Body>
                <View style={{flexDirection: 'row',alignSelf: 'flex-start',}}>
                {this.state.loading ? null : <Text ellipsizeMode={'tail'} numberOfLines={1} style={{ fontWeight: 'bold',alignSelf: 'flex-start', }} >{this.state.item.sender_name}</Text>}
                {this.state.item.status && this.state.item.status !== 'undefined' ? <Text ellipsizeMode={'tail'} numberOfLines={1} style={{
                  color: 'dimgray', fontStyle: 'italic',
                  fontSize: 16,  borderWidth: 0
                }} note>{this.state.item.sender_status}</Text> : null}
                </View>
              </Body>
            </Left>
          </CardItem>
          <CardItem cardBody>
            <Left>
              {this.state.loading ? null : <DoublePhoto showPhoto={(image) => this.props.showPhoto(image)}
                enlargeImage={() => this.setState({ opening: true, enlargeEventImage: true })}
                LeftImage={this.state.item.receiver_Image}
                RightImage={this.state.item.event_Image} />}
            </Left>
            <Body >
              {this.state.loading ? null : <TouchableOpacity style={{ alignSelf: 'flex-start', marginLeft: '-30%', marginTop: '8%'}} onPress={() => requestAnimationFrame(() => {
                let event = filter(stores.Events.events, { id: this.state.event_id })
                this.props.navigation.navigate("Event", {
                  Event: event[0],
                  tab: "EventDetails"
                })
              })} >
                <Title style={{alignSelf:'flex-start', fontWeight: 'bold', color: "#0A4E52" }}
                >{this.state.item.event_title}</Title>
                {this.state.item.event_time ? <Text style={{
                  color: 'dimgray', fontSize: 12, color: "#0A4E52", fontStyle:
                    'italic',alignSelf:'flex-start'
                }}> {`starts on ${moment(this.state.item.event_time).format("dddd, MMMM Do YYYY, h:mm:ss a")}`}</Text> : null}
              </TouchableOpacity>}
            </Body>
          </CardItem>

          <CardItem>
            {this.state.loading ? null : this.state.sent || this.state.item.sent ? (this.state.received || this.state.item.received ? (this.state.seen || this.state.item.seen ?
              <View style={{}}>
                <Icon name="checkcircle" type="AntDesign" style={{ color: this.state.seen ? "#54F5CA" : "gray", marginLeft: 300 }} />
                {this.state.accept || this.state.item.accept ? <Text style={{ color: "green" }} note>accepted</Text> : null}
                {this.state.item.deny || this.state.deny ? <Text style={{ color: "red" }} note>denied</Text> : null}
              </View> :
              <View style={{}}>
                <Icon name="checkcircle" type="AntDesign" style={{ color: "gray", marginLeft: "90%" }} />
                {this.state.accept || this.state.item.accept ? <Text style={{ color: "green" }} note>accepted</Text> : null}
                {this.state.item.deny || this.state.deny ? <Text style={{ color: "red" }} note>denied</Text> : null}
              </View>
            )
              :
              <View style={{}}>
                <Icon name="checkcircleo" type="AntDesign" style={{ color: "gray", marginLeft: "90%" }} />
              </View>) : <Text style={{ marginLeft: "90%" }} note>sending...</Text>}
          </CardItem>

          <CardItem style={{ margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            {this.state.loading ? null : <Text style={{ color: 'dimgray', fontSize: 13 }}>{moment(this.state.item.received_date).format("dddd, MMMM Do YYYY, h:mm:ss a")}</Text>}
            {this.state.loading ? null : <Text style={{ color: 'dimgray', fontSize: 13 }}>{this.state.item.invitation_status ? "master" : "member"}
            </Text>}
          </CardItem>

          {this.state.loading ? null : <ProfileModal isToBeJoint={false} isOpen={this.state.isOpenStatus} profile={{
            nickname: this.state.item.sender_name,
            profile: this.state.item.sender_Image,
            status: this.state.item.sender_status
          }} onClosed={() => this.setState({ opening: false, isOpenStatus: false })} onAccept={this.onAccept} onDenied={this.onDenied} deny={false}
            accept={true} isJoining={this.state.isJoining} hasJoin={false}
            joined={() => this.setState({ hasJoin: true })} />}

          {this.state.loading ? null : <PhotoModal reacted isOpen={this.state.enlargeEventImage} image={this.state.item.event_Image} onClosed={() => this.setState({ opening: false, enlargeEventImage: false })}
            onAccept={this.onAccept} onDenied={this.onDenied} deny={this.state.deny}
            accept={this.state.accept} isJoining={this.state.isJoining} hasJoin={this.state.hasJoin}
            joined={() => this.setState({ hasJoin: true })} />}

        </Card>
      </Swipeout>
    </View>
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

