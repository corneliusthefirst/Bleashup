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
import globalState from "../../../stores/globalState";
import DoublePhoto from "../invitations/components/doublePhoto";
import stores from '../../../stores';
import { forEach, filter } from "lodash";
import ImageActivityIndicator from '../currentevents/components/imageActivityIndicator';
import { observer } from 'mobx-react';
import Requester from "../invitations/Requester"
import moment from 'moment';
import { AddParticipant } from '../../../services/cloud_services';
import testForURL from '../../../services/testForURL';
import request from '../../../services/requestObjects';


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
    opening: false,
    actioning: false,
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
    Requester.accept(invitation).then(() => {
      this.setState({ accept: true, actioning: !this.state.actioning })
      let Participant = request.Participant();
      Participant.phone = stores.Session.SessionStore.phone;
      Participant.status = "invited";
      Participant.master = invitation.status;
      Participant.host = stores.Session.SessionStore.host
      AddParticipant(this.props.item.event_id, [Participant]).then((response) => {
        console.warn(response)
      })
    }).catch(error => {
      Toast.show({
        text: 'unable to connect to the server ',
        buttonText: 'Okay'
      })
    })
    //;
  }
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.state.loading !== nextState.loading ||
      nextState.actioning !== this.state.actioning
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      //   accept: nextProps.item.accept,
      //   deny: nextProps.item.deny,
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
      this.setState({ deny: true, isRequesting: false, actioning: !this.state.actioning })
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
      this.props.openDetails(this.state.item.event)
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
    setTimeout(() => {
      stores.Invitations.translateToinvitationData(this.props.item, false).then(data => {
        this.setState({
          activeRowKey: null,
          isOpenDetails: false,
          isOpenStatus: false,
          enlargeEventImage: false,
          accept: this.props.item.accept,
          deny: this.props.item.deny,
          message: "",
          textcolor: "",
          loading: false,
          item: data,
          event_id: this.props.item.event_id,
          seen: false,
          isJoining: false,
          hasJoin: false,
        });
      })
    }, this.props.time_delay + 20)

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
    style: {
      width: "100%",
      backgroundColor: "white"
    },
    rowId: this.props.index,
    sectionId: 1
  }
  render() {
    return this.state.loading ? <Card style={{ height: 230 }}></Card> : <View style={{ width: "98%",alignSelf: 'center', }}>
      <Swipeout style={{ width: "100%", }} {...this.swipeSettings}>
        <Card>
          <CardItem>
            <Text style={{ color: "#A91A84", fontSize: 14, }} note>
              received
        </Text>
          </CardItem>
          <CardItem>
            <Left style={{ margin: '2%' }}>
              <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.showPhoto(this.state.item.sender_Image))} >
                {this.state.loading ? null : testForURL(this.state.item.sender_Image) ? <CacheImages small thumbnails source={{ uri: this.state.item.sender_Image }} /> :
                  <Thumbnail small source={{ uri: this.state.item.sender_Image }}></Thumbnail>}
              </TouchableOpacity>
              <Body>
              <View style={{flexDirection: 'row',alignSelf: 'flex-start',}}>
                {this.state.loading ? null : <Text style={{ fontWeight: 'bold',alignSelf: 'flex-start', }} ellipsizeMode={'tail'} numberOfLines={1}  >{this.state.item.sender_name}</Text>}
                {this.state.item.status && this.state.item.status !== 'undefined'?<Text ellipsizeMode={'tail'} numberOfLines={1}  style={{
                  color: 'dimgray', padding: 10, fontStyle: 'italic',
                  fontSize: 16, marginTop: -10, borderWidth: 0
                }} note>{this.state.item.sender_status}</Text>:null}
                </View>
              </Body>
            </Left>
          </CardItem>

          <CardItem cardBody>
            <Left>
              {this.state.loading ? null : <DoublePhoto showPhoto={(image) => this.props.showPhoto(image)} LeftImage={this.state.item.receiver_Image}
                RightImage={this.state.item.event_Image} />}
            </Left>

            <Body >
              <TouchableOpacity style={{ alignSelf: 'flex-start', marginLeft: '-30%',marginTop: '8%',}} onPress={() => requestAnimationFrame(() => this.openDetails())
              } >
                {this.state.loading ? null : <Title style={{ fontWeight: 'bold', alignSelf: 'flex-start' }}
                >{this.state.item.event_title}</Title>}
                {this.state.loading || !this.state.item.event_time ? null : <Text style={{
                  alignSelf: 'flex-start',
                  color: 'dimgray', fontSize: 12,
                  fontStyle: 'italic',
                }}> {`starts on ${moment(this.state.item.event_time).format("dddd, MMMM Do YYYY, h:mm:ss a")}`}</Text>}
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
                  <Icon name="comment" type="FontAwesome5" style={{ color: "#1FABAB" }} />
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

          <CardItem style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

            {this.state.loading ? null : <Text style={{ color: 'dimgray', fontSize: 13 }}>{moment(this.state.item.received_date).format("dddd, MMMM Do YYYY, h:mm:ss a")}</Text>}

            {this.state.loading ? null : <Text style={{ color: 'dimgray', fontSize: 13 }}>{this.state.item.invitation_status}</Text>}

          </CardItem>

          {this.state.loading ? null : <ProfileModal isOpen={this.state.isOpenStatus} profile={{
            nickname: this.state.item.sender_name,
            profile: this.state.item.sender_Image,
            status: this.state.item.sender_status
          }} onClosed={() => {
            this.setState({ opening: false, isOpenStatus: false, actioning: !this.state.actioning })
            this.onSeen()
          }
          } onAccept={this.onAccept} onDenied={this.onDenied} deny={this.state.deny}
            accept={this.state.accept} isJoining={this.state.isJoining} hasJoin={this.state.hasJoin}
            joined={() => this.setState({ hasJoin: true, actioning: !this.state.actioning })} />}

          {this.state.loading ? null : <PhotoModal isOpen={this.state.enlargeEventImage} image={this.state.item.event_Image} onClosed={() => {
            this.setState({ opening: false, enlargeEventImage: false, actioning: !this.state.actioning })
            this.onSeen()
          }
          }
            onAccept={this.onAccept} onDenied={this.onDenied} deny={this.state.deny}
            accept={this.state.accept} isJoining={this.state.isJoining} hasJoin={this.state.hasJoin}
            joined={() => this.setState({ hasJoin: true, actioning: !this.state.actioning })} />}


          {/*this.state.loading ? null : <DetailsModal isOpen={this.state.isOpenDetails} details={this.state.card} location={this.state.item.location}
            event_organiser_name={this.state.item.event_organiser_name}
            created_date={this.state.item.created_date}
            onClosed={() => {
              this.setState({ opening: false, isOpenDetails: false, actioning: !this.state.actioning })
              this.onSeen()
            }
            } item={this.state.item}
            OpenLinkZoom={this.OpenLinkZoom} OpenLink={this.OpenLink} onAccept={this.onAccept} onDenied={this.onDenied} deny={this.state.deny}
          accept={this.state.accept} isJoining={this.state.isJoining} hasJoin={this.state.hasJoin} joined={() => this.setState({ hasJoin: true, actioning: !this.state.actioning })} />*/}
        </Card>
      </Swipeout>
    </View>


  }
}




export default CardListItem