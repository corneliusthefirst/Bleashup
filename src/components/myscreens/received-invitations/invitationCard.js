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
import styles from './style';
import CacheImages from "../../CacheImages";
import Exstyles from './style';
import svg from '../../../../svg/svg';
import { createOpenLink } from "react-native-open-maps";
import ProfileModal from '../invitations/components/ProfileModal';
import PhotoModal from "../invitations/components/PhotoModal";
import DetailsModal from "../invitations/components/DetailsModal";
import globalState from "../../../stores/globalState";
import AccordionModule from "../invitations/components/Accordion";
import DoublePhoto from "../invitations/components/doublePhoto";
import stores from '../../../stores';
import { forEach } from "lodash";
import ImageActivityIndicator from '../currentevents/components/imageActivityIndicator';


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
  Query = { query: this.state.item.location };
  OpenLink = createOpenLink(this.Query);
  OpenLinkZoom = createOpenLink({ ...this.Query, zoom: 50 });

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
    item: data,
    isJoining: false,
    hasJoin: false
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
  componentDidMount() {
    stores.Invitations.translateToinvitationData(this.state.item).then(data => {
      console.error(data)
      let AccordData = this.state.item.sender_status
      max_length = this.state.item.sender_status.length
      let dataArray = [{ title: AccordData.slice(0, 35), content: AccordData.slice(35, max_length) }]
      this.formCard().then(card => {
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
          isJoining: false,
          hasJoin: false,
          card: card
        });
      })
    })

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

    rowId: this.props.index,
    sectionId: 1
  }
  formCard() {
    return new Promise((resolve, reject) => {
      let card = [];
      let i = 0;
      Description = { event_title: item.event_title, event_description: item.event_description }
      cards.push(Description)

      this.props.item.hightlight.forEach(hightlight => {
        cards.push(hightlight);
        if (i === this.props.item.hightlight.length - 1) resolve(card)
        i++
      })
    })
  }

  render() {
    return (this.state.loading ? <ImageActivityIndicator></ImageActivityIndicator> :
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

                  <AccordionModule dataArray={dataArray} />

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
              <TouchableOpacity onPress={() => this.setState({ isOpenDetails: true })} >
                <Text style={{ marginLeft: -40 }}
                >{this.state.item.event_title}</Text>
                <Text style={{ marginLeft: -40, color: 'dimgray', fontSize: 12 }}> on the {this.state.item.created_date} at {this.state.item.event_time}</Text>
              </TouchableOpacity>
            </Body>
          </CardItem>

          <CardItem>
            {this.state.accept || this.state.deny ?
              (this.state.accept ? <View style={{}}><Text style={{ marginTop: 5, marginLeft: 265, fontSize: 17, fontWeight: "600", color: "forestgreen" }} note>Accepted</Text></View> :
                <View style={{}} ><Text style={{ marginTop: 5, marginLeft: 270, fontSize: 17, fontWeight: "600", color: "darkorange" }} note>Denied</Text></View>) :

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <Button onPress={this.onAccept} style={{ marginLeft: 40, borderRadius: 5 }} success ><Text>Accept</Text></Button>

                <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 40 }}>
                  <Icon name="comment" type="FontAwesome5" onPress={{}} style={{ color: "#1FABAB" }} />
                  <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                </View>

                <Button onPress={this.onDenied} style={{ borderRadius: 5, marginLeft: 40 }} danger ><Text>Deny</Text></Button>
              </View>

            }

          </CardItem>

          <CardItem style={{ margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>

            <Text style={{ color: 'dimgray', fontSize: 13 }}>{this.state.item.received_date}</Text>

            <Text style={{ color: 'dimgray', fontSize: 13 }}>{this.state.item.invitation_status}</Text>

          </CardItem>

          <ProfileModal isOpen={this.state.isOpenStatus} profile={{
            nickname: this.state.item.sender_name,
            profile: this.state.item.sender_Image,
            status: this.state.item.sender_status
          }} onClosed={() => this.setState({ isOpenStatus: false })} onAccept={this.onAccept} onDenied={this.onDenied} deny={this.state.deny}
            accept={this.state.accept} isJoining={this.state.isJoining} hasJoin={this.state.hasJoin}
            joined={() => this.setState({ hasJoin: true })} />

          <PhotoModal isOpen={this.state.enlargeEventImage} image={this.state.item.event_Image} onClosed={() => this.setState({ enlargeEventImage: false })}
            onAccept={this.onAccept} onDenied={this.onDenied} deny={this.state.deny}
            accept={this.state.accept} isJoining={this.state.isJoining} hasJoin={this.state.hasJoin}
            joined={() => this.setState({ hasJoin: true })} />


          <DetailsModal isOpen={this.state.isOpenDetails} details={this.state.cards} location={this.state.item.location}
            event_organiser_name={this.state.item.event_organiser_name}
            created_date={this.state.item.created_date}
            onClosed={() => this.setState({ isOpenDetails: false })} item={this.state.item}
            OpenLinkZoom={this.OpenLinkZoom} OpenLink={this.OpenLink} onAccept={this.onAccept} onDenied={this.onDenied} deny={this.state.deny}
            accept={this.state.accept} isJoining={this.state.isJoining} hasJoin={this.state.hasJoin} joined={() => this.setState({ hasJoin: true })} />

        </Card>
      </Swipeout>
    );
  }
}




export default CardListItem


