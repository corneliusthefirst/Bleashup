import React, { Component } from 'react';
import {
  Platform, StyleSheet, Image, TextInput, FlatList, TouchableOpacity,
  ActivityIndicator, View, Alert, BackHandler, ToastAndroid
} from 'react-native';
import autobind from "autobind-decorator";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header, Form, Thumbnail, Item,
  Title, Input, Left, Right, H3, H1, H2, Spinner, Button, InputGroup,
  DatePicker, CheckBox, List, Accordion, DeckSwiper, Label, Toast
} from "native-base";

import Swipeout from 'react-native-swipeout';
import styles from './style';
import CacheImages from "../../CacheImages";
import Exstyles from './style';
import svg from '../../../../svg/svg';
import { createOpenLink } from "react-native-open-maps";
import ProfileModal from '../invitations/components/ProfileModal';
import PhotoModal from "../invitations/components/PhotoModal";
import DetailsModal from "../invitations/components/DetailsModal";
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient'
import Svg, { Circle, Rect } from 'react-native-svg'
import globalState from "../../../stores/globalState";
import AccordionModule from "../invitations/components/Accordion";
import DoublePhoto from "../invitations/components/doublePhoto";
import stores from '../../../stores';
import { forEach, filter } from "lodash";
import ImageActivityIndicator from '../currentevents/components/imageActivityIndicator';
import { observer } from 'mobx-react';
import Requester from "../invitations/Requester"
import BleashupNotification from '../../../services/Notifications';


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


  //Maps schedule
  Query = { query: this.props.location };
  OpenLink = createOpenLink(this.Query);
  OpenLinkZoom = createOpenLink({ ...this.Query, zoom: 50 });
  isSeen = false
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
    opening : false,
    item: null,
    isJoining: false,
    isRequesting: false,
    hasJoin: false
  }
  //accepted invitation
  @autobind
  onAccept() {
    let invitation = {
      inviter: this.props.item.inviter,
      invitee: this.props.item.invitee,
      invitation_id: this.props.item.invitation_id,
      host: this.props.item.host,
      period: this.props.item.period,
      event_id: this.props.item.event_id,
      status: this.props.item.status
    }
    Requester.accept(invitation).then(response => {
      this.setState({ accept: true })
    }).catch(error => {
      Toast.show({
        text: 'unable to connect to the server ',
        buttonText: 'Okay'
      })
    })
    //;
  }
   shouldComponentUpdate(nextProps, nextState, nextContext) {
     return nextProps.item.invitation_id !== this.props.item.invitation_id ||
       this.state.loading !== nextState.loading ||
       nextState.accept !== this.state.accept ||
       nextState.deny !== this.state.deny ||
       this.state.opening !== nextState.opening ||
       this.state.hasJoin !== nextState.hasJoin 
   }
   componentWillReceiveProps(nextProps) {
     this.setState({
       accept: nextProps.item.accept,
       deny: nextProps.item.deny,
       received: nextProps.item.received,
       seen: nextProps.item.seen,
     })
   }
  //refused invitation
  @autobind
  onDenied() {
    this.setState({
      isRequesting: true
    })
    let invitation = {
      inviter: this.props.item.inviter,
      invitee: this.props.item.invitee,
      invitation_id: this.props.item.invitation_id,
      host: this.props.item.host,
      period: this.props.item.period,
      event_id: this.props.item.event_id,
      status: this.props.item.status
    }
    Requester.denie(invitation).then(response => {
      this.setState({ deny: true, isRequesting: false })
    }).catch(error => {
      this.setState({
        isRequesting: false
      })
      Toast.show({
        text: 'unable to connect to the server ',
        buttonText: 'Okay'
      })
    })
  }
  openDetails() {
    if (this.props.item.accept || this.state.accept) {
      let event = filter(stores.Events.events, { id: this.state.event_id })
      this.props.navigation.navigate("Event", {
        Event: event[0],
        tab: "EventDetails"
      })
    } else {
      this.setState({
        opening :true,
        isOpenDetails: true
      })
    }
  }
  onSeen() {
    if (this.isSeen || this.props.item.seen) {
    } else {
      let invitation = {
        inviter: this.props.item.inviter,
        invitee: this.props.item.invitee,
        invitation_id: this.props.item.invitation_id,
        host: this.props.item.host,
        period: this.props.item.period,
        event_id: this.props.item.event_id,
        status: this.props.item.status
      }
      Requester.seen(invitation).then(resposne => {
        this.isSeen = true;
      }).catch((error) => {

      })
    }
  }
  componentDidMount() {
    setTimeout(()=>{
    stores.Invitations.translateToinvitationData(this.props.item).then(data => {
      let AccordData = data.sender_status
      max_length = data.sender_status.length
      let dataArray = [{ title: AccordData.slice(0, 35), content: AccordData.slice(35, max_length) }]
      this.formCard(data).then(card => {
        //testing notifications
        //BleashupNotification.sendNotification("my test notification", "you received a new invitation")
        this.setState({
          activeRowKey: null,
          isOpenDetails: false,
          isOpenStatus: false,
          enlargeEventImage: false,
          accept: this.props.item.accept,
          deny: this.props.item.deny,
          message: "",
          dataArray: dataArray,
          textcolor: "",
          loading: false,
          item: data,
          event_id: this.props.item.event_id,
          seen: false,
          isJoining: false,
          hasJoin: false,
          card: card
        });
      })
    })
  },20)

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
                  this.props.cardListData.splice(this.props.index, 1);
                  //make request to delete to database(back-end)

                  //Refresh FlatList
                  this.props.parentCardList.refreshFlatList(deletingRow);
                }
              },
            ],
            { cancelable: true }
          );

        },
        text: 'Delete', type: 'delete'

      }
    ],
    style:{
      width: "100%",
      backgroundColor: "#FEFFDE"
    },
    rowId: this.props.index,
    sectionId: 1
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
  render() {
    return this.state.loading ? <Card style={{ height: 230}}></Card>:<View style={{ width: "100%",}}>
    <Swipeout style={{ width: "100%", backgroundColor: "#FEFFDE"}} {...this.swipeSettings}>
        <Card style={{ height: 250}}>
        <CardItem>
            <Text style={{ color:"#54F5CA"}} note>
            received
        </Text>
        </CardItem>
          <CardItem>
            <Left>
              <TouchableOpacity onPress={() => this.setState({ opening:true,isOpenStatus: true })} >
                {this.state.loading ? null : <CacheImages small thumbnails source={{ uri: this.state.item.sender_Image }}
                />}
              </TouchableOpacity>
              <Body >
                {this.state.loading ? null : <Text style={styles.flatlistItem} >{this.state.item.sender_name}</Text>}

                {this.state.loading ? null :
                  this.state.dataArray.content == "" ? <Text style={{
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
              {this.state.loading ? null : <DoublePhoto enlargeImage={() => this.setState({opening:true, enlargeEventImage: true })} LeftImage={this.state.item.receiver_Image}
                RightImage={this.state.item.event_Image} />}
            </Left>

            <Body >
              <TouchableOpacity onPress={() => this.openDetails()
              } >
                {this.state.loading ? null : <Text style={{ marginLeft: -40 }}
                >{this.state.item.event_title}</Text>}
                {this.state.loading ? null : <Text style={{ marginLeft: -40, color: 'dimgray', fontSize: 12 }}> on the {this.state.item.event_time}</Text>}
              </TouchableOpacity>
            </Body>
          </CardItem>

          <CardItem>
            {this.state.loading ? null : this.state.accept || this.state.deny ?
              (this.state.accept ?
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Text style={{ marginTop: 5, fontSize: 17, fontWeight: "600", color: "forestgreen" }} note>Accepted</Text>
                </View> :
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }} >
                  <Text style={{ marginTop: 5, marginRight: 13, fontSize: 17, fontWeight: "600", color: "darkorange" }} note>Denied</Text>
                </View>) :

              <Item style={{ flex: 1, justifyContent: 'space-between', marginLeft: 20, marginRight: 20, marginTop: 10, borderRadius: 0, borderColor: "transparent" }}>
                <Button rounded onPress={() => this.onDenied()} style={{ borderWidth: 2, borderColor: "#FF0055" }} transparent ><Icon name="close" type="EvilIcons" style={{
                  color: "#FF0055"
                }}></Icon></Button>{this.state.isRequesting ? <Spinner size="small"></Spinner> : null}
                <Item style={{ flexDirection: 'column', alignItems: 'center', borderRadius: 0, borderColor: "transparent" }}>
                  <Icon name="comment" type="FontAwesome5" onPress={{}} style={{ color: "#1FABAB" }} />
                  <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                </Item>
                <Button rounded style={{
                  borderWidth: 2,
                  borderColor: "#049F61"
                }} onPress={() => this.onAccept()} transparent ><Icon type="AntDesign" name="check" style={{
                  color: "#049F61"
                }} name="check"></Icon></Button>
              </Item>

            }

          </CardItem>

          <CardItem style={{ margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>

            {this.state.loading ? null : <Text style={{ color: 'dimgray', fontSize: 13 }}>{this.state.item.received_date}</Text>}

            {this.state.loading ? null : <Text style={{ color: 'dimgray', fontSize: 13 }}>{this.state.item.invitation_status}</Text>}

          </CardItem>

          {this.state.loading ? null : <ProfileModal isOpen={this.state.isOpenStatus} profile={{
            nickname: this.state.item.sender_name,
            profile: this.state.item.sender_Image,
            status: this.state.item.sender_status
          }} onClosed={() => {
            this.setState({opening:false, isOpenStatus: false })
            this.onSeen()
          }
          } onAccept={this.onAccept} onDenied={this.onDenied} deny={this.state.deny}
            accept={this.state.accept} isJoining={this.state.isJoining} hasJoin={this.state.hasJoin}
            joined={() => this.setState({ hasJoin: true })} />}

          {this.state.loading ? null : <PhotoModal isOpen={this.state.enlargeEventImage} image={this.state.item.event_Image} onClosed={() => {
            this.setState({opening:false, enlargeEventImage: false })
            this.onSeen()
          }
          }
            onAccept={this.onAccept} onDenied={this.onDenied} deny={this.state.deny}
            accept={this.state.accept} isJoining={this.state.isJoining} hasJoin={this.state.hasJoin}
            joined={() => this.setState({ hasJoin: true })} />}


          {this.state.loading ? null : <DetailsModal isOpen={this.state.isOpenDetails} details={this.state.card} location={this.state.item.location}
            event_organiser_name={this.state.item.event_organiser_name}
            created_date={this.state.item.created_date}
            onClosed={() => {
              this.setState({opening:false, isOpenDetails: false })
              this.onSeen()
            }
            } item={this.state.item}
            OpenLinkZoom={this.OpenLinkZoom} OpenLink={this.OpenLink} onAccept={this.onAccept} onDenied={this.onDenied} deny={this.state.deny}
            accept={this.state.accept} isJoining={this.state.isJoining} hasJoin={this.state.hasJoin} joined={() => this.setState({ hasJoin: true })} />}
      </Card>
      </Swipeout>
    </View>
   

  }
}




export default CardListItem


