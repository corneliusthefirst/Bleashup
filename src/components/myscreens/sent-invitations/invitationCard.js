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
    accept: true,
    deny: false,
    message: "",
    textcolor: "",
    loading: true,
    item: null,
    isJoining: false,
    hasJoin: false,
    hiding: false,
    deleting: false,
    swipeOutSettings: null,
    hiden: false
  }
  data = []
  componentDidMount() {
    setTimeout(()=>{
    stores.Invitations.translateToinvitationData(this.props.item).then(data => {
      this.data = data
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
        received: this.props.item.received,
        seen: this.props.item.seen,
        dataArray: dataArray,
        textcolor: "",
        event_id: data.event_id,
        loading: false,
        item: data,
        isJoining: false,
        hasJoin: false,
        hiding: false,
        deleting: false,
        hiden: false
      });
    })
<<<<<<< HEAD
  },20)
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
=======


  setTimeout(() => {
      this.formCard(this.props.Invitations).then(details => {
        let swipeOut = (<View>
          <List style={{
            backgroundColor: "#FFFFF6",
            height: "100%"
          }}>
           
            <ListItem style={{ alignSelf: 'flex-start' }}>
              <TouchableOpacity onPress={() => {
                return this.hide()
              }}>
                {this.state.hiding ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : null}
                <Icon style={{ fontSize: 16, color: "#1FABAB" }} name="archive" type="EvilIcons">
                </Icon>
                <Label style={{ fontSize: 12, color: "#1FABAB" }}>Hide</Label>
              </TouchableOpacity>
            </ListItem>

            <ListItem>
              <TouchableOpacity onPress={() => {
                return this.delete()
              }}>
                {this.state.deleting ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : null}
                <Icon name="trash" style={{ fontSize: 16, color: "red" }} type="EvilIcons">
                </Icon>
                <Label style={{ fontSize: 12, color: "red" }} >Delete</Label>
              </TouchableOpacity>
            </ListItem>
          </List>
        </View>)
        this.setState({
          swipeOutSettings: {
            autoClose: true,
            sensitivity: 100,
            right: [
              {
                component: swipeOut
              }
            ],
          },
          details: details
        })
      })
    }, 20)


  }


  formCard(item) {
    return new Promise((resolve, reject) => {
      let card = [];
      let i = 0;
      Description = { event_title: item.event_title, event_description: item.event_description }
      card.push(Description)
      if (item.highlight.length !== 0) {
        forEach(item.highlight, hightlight => {
          card.push(hightlight);
          if (i === item.highlight.length - 1) {

            resolve(card)
          }
          i++
        })
      } else {
        resolve(card)
      }
    })
}

@autobind
delete() {
    this.setState({
      deleting: true
    })
    Requester.delete(this.props.Invitations.invitation_id).then(() => {
      this.setState({
        deleting: false,
        hiden: true
      })
    })
  }

@autobind
hide() {
    this.setState({
      hiding: true
    })
    Requester.hide(this.props.Invitations.invitation_id).then(() => {
      this.setState({
        hiden: true,
        hiding: false
      })
    })
  }









>>>>>>> 1e97a9d441b05a372cba36a25998ff64d917be81
  //accepted invitation
  @autobind
  onAccept() {
    this.setState({ accept: true })
    this.state.item.accept = true
    
  }
  //refused invitation
  @autobind
  onDenied() {
    this.setState({ deny: true })
    this.state.item.deny = true
  }

<<<<<<< HEAD
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
=======
>>>>>>> 1e97a9d441b05a372cba36a25998ff64d917be81


<<<<<<< HEAD
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
    style : {
      width: "100%",
      backgroundColor: "#FEFFDE"
    },
    rowId: this.props.index,
    sectionId: 1
  }
=======
>>>>>>> 1e97a9d441b05a372cba36a25998ff64d917be81



  render() {
<<<<<<< HEAD
    return (this.state.loading ? <Card style={{ height: 220 }}></Card>:<View style={{ width: "100%",}}>
      <Swipeout style={{ width: "100%",}} {...this.swipeSettings}>
        <Card style={{ height: 220 }}>
        <CardItem>
        <Text note>
        sent
        </Text>
        </CardItem>
=======
    return (this.state.loading ? <SvgAnimatedLinearGradient primaryColor="#cdfcfc"
      secondaryColor="#FEFFDE" height={200}>
      <Circle cx="30" cy="30" r="30" />
      <Rect x="75" y="13" rx="4" ry="4" width="100" height="13" />
      <Rect x="75" y="37" rx="4" ry="4" width="50" height="8" />
      <Circle cx="30" cy="30" r="30" /><Circle cx="30" cy="30" r="30" />
      <Rect x="0" y="70" rx="5" ry="5" width="400" height="100" />
    </SvgAnimatedLinearGradient> :
      <Swipeout {...this.swipeOutSettings}>
        <Card style={{}}>
>>>>>>> 1e97a9d441b05a372cba36a25998ff64d917be81
          <CardItem>
            <Left>
              <TouchableOpacity onPress={() => this.setState({ opening: true, isOpenStatus: true })} >
                {this.state.loading ? null : <CacheImages small thumbnails source={{ uri: this.state.item.sender_Image }}
                />}
              </TouchableOpacity>
              <Body >
                {this.state.loading ? null : <Text style={styles.flatlistItem} >{this.state.item.sender_name}</Text>}

                {this.state.loading ? null : this.state.dataArray.content == "" ? <Text style={{
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
              {this.state.loading ? null : <DoublePhoto enlargeImage={() => this.setState({ opening: true, enlargeEventImage: true })} LeftImage={this.state.item.receiver_Image}
                RightImage={this.state.item.event_Image} />}
            </Left>
            <Body >
              {this.state.loading ? null : <TouchableOpacity onPress={() => {
                let event = filter(stores.Events.events, { id: this.state.event_id })
                this.props.navigation.navigate("Event", {
                  Event: event[0],
                  tab: "EventDetails"
                })
              }} >
                <Text style={{ marginLeft: -40 }}
                >{this.state.item.event_title}</Text>
                <Text style={{ marginLeft: -40, color: 'dimgray', fontSize: 12 }}> on the {this.state.item.created_date} at {this.state.item.event_time}</Text>
              </TouchableOpacity>}
            </Body>
          </CardItem>

          <CardItem>
            {this.state.loading ? null : this.state.sent || this.state.item.sent ? (this.state.received || this.state.item.received ? (this.state.seen || this.state.item.seen ?
              <View style={{}}>
                <Icon name="checkcircle" type="AntDesign" onPress={{}} style={{ color: this.state.seen ? "#54F5CA" : "gray", marginLeft: 300 }} />
                {this.state.accept || this.state.item.accept ? <Text style={{ color: "green" }} note>accepted</Text> : null}
                {this.state.item.deny || this.state.deny ? <Text style={{ color: "red" }} note>denied</Text> : null}
              </View> :
              <View style={{}}>
                <Icon name="checkcircle" type="AntDesign" onPress={{}} style={{ color: "gray", marginLeft: "90%" }} />
                {this.state.accept || this.state.item.accept ? <Text style={{ color: "green" }} note>accepted</Text> : null}
                {this.state.item.deny || this.state.deny ? <Text style={{ color: "red" }} note>denied</Text> : null}
              </View>
            )
              :
              <View style={{}}>
                <Icon name="checkcircleo" type="AntDesign" onPress={{}} style={{ color: "gray", marginLeft: "90%" }} />
              </View>) : <Text style={{ marginLeft: "90%"}} note>sending...</Text>}
          </CardItem>

          <CardItem style={{ margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            {this.state.loading ? null : <Text style={{ color: 'dimgray', fontSize: 13 }}>{this.state.item.received_date}</Text>}
            {this.state.loading ? null : <Text style={{ color: 'dimgray', fontSize: 13 }}>{this.state.item.invitation_status}</Text>}
          </CardItem>

          {this.state.loading ? null : <ProfileModal isOpen={this.state.isOpenStatus} profile={{
            nickname: this.state.item.sender_name,
            image: this.state.item.sender_Image,
            status: this.state.item.sender_status
          }} onClosed={() => this.setState({ opening: false, isOpenStatus: false })} onAccept={this.onAccept} onDenied={this.onDenied} deny={this.state.deny}
            accept={this.state.accept} isJoining={this.state.isJoining} hasJoin={this.state.hasJoin}
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




