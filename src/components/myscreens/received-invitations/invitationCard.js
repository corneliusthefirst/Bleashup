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
import ProfileModal from '../../ProfileModal'
import PhotoModal from "../../PhotoModal"
import DetailModal from "../../DetailsModal"
import globalState from "../../../stores/globalState";

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
    this.state = {
      //this shall be used on choosing a key to delete
      activeRowKey: null,
      isOpen: false,
      isOpenStatus: false,
      enlargeEventImage: false,
      descriptionEnd: false,
      highlightEnd: false,
      accept: false,
      deny: false,
      message: "",
      textcolor: ""

    };
  }
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
      isOpen: false
    })
  }
  @autobind closeAllModals() {
    return this.setState({
      isOpen: false,
      isOpenStatus: false,
      enlargeEventImage: false
    })
  }
  //Maps schedule
  Query = { query: this.props.item.location };
  OpenLink = createOpenLink(this.Query);
  OpenLinkZoom = createOpenLink({ ...this.Query, zoom: 50 });

  _renderHeader(item, expanded) {
    return (
      <View style={{
        flexDirection: "row",
        padding: 5,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FEFFDE"
      }}  >
        <Text style={{ fontWeight: "400", fontStyle: "italic" }} note>
          {item.title}
        </Text>
        {expanded
          ? <Icon style={{ fontSize: 18 }} name="arrow-up" />
          : <Icon style={{ fontSize: 18 }} name="arrow-down" />}

      </View>
    );
  }
  _renderContent(item) {
    return (
      <Text
        style={{
          backgroundColor: "#FEFFDE",
          paddingTop: -30,
          paddingLeft: 10,
          paddingBottom: 10,
          fontStyle: "italic",
        }}
        note
      >
        {item.content}
      </Text>
    );
  }

  render() {
    const AccordData = this.props.item.sender_status
    max_length = this.props.item.sender_status.length
    let dataArray = [{ title: AccordData.slice(0, 35), content: AccordData.slice(35, max_length) }]
    //deck swiper object
    const cards = [];
    item = this.props.item
    //creating the event description starting and ending data
    const descriptionData = item.event_description
    max_length1 = item.event_description.length
    descriptionStartData = descriptionData.slice(0, 300)
    descriptionEndData = descriptionData.slice(300, max_length1)


    Description = { event_title: item.event_title, event_description: descriptionStartData }
    cards.push(Description)


    for (i = 0; i < item.highlight.length; i++) {
      cards.push(item.highlight[i])
    }

    //console.warn(cards)
    const swipeSettings = {
      autoClose: true,
      //take this and do something onClose
      onClose: (secId, rowId, direction) => {
        if (this.state.activeRowKey != null) {
          this.setState({ activeRowKey: null });
        }
      },
      //on open i set the activerowkey
      onOpen: (secId, rowId, direction) => {
        this.setState({ activeRowKey: this.props.item.key });
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
                    cardListData.splice(this.props.index, 1);
                    //make request to delete to database(back-end)
                    /**

                    */
                    //Refresh FlatList
                    this.props.parentCardList.refreshCardList(deletingRow);
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

    return (
      <Swipeout {...swipeSettings}>
        <Card style={{ height: this.state.isOpen || this.state.isOpenStatus || this.state.enlargeEventImage ? 610 : 180 }}>
          <CardItem>
            <Left>
              <TouchableOpacity onPress={() => this.setState({ isOpenStatus: true })} >
                <CacheImages small thumbnails source={{ uri: this.props.item.sender_Image }}
                />
              </TouchableOpacity>
              <Body >
                <Text style={styles.flatlistItem} >{this.props.item.sender_name}</Text>

                {dataArray.content == "" ? <Text style={{
                  color: 'dimgray', padding: 10,
                  fontSize: 16, marginTop: -10, borderWidth: 0
                }} note>{this.props.item.sender_status}</Text> :

                  <Accordion
                    dataArray={dataArray}
                    animation={true}
                    expanded={true}
                    renderHeader={this._renderHeader}
                    renderContent={this._renderContent}
                    style={{ borderWidth: 0 }}
                  />

                }
              </Body>
            </Left>
          </CardItem>

          <CardItem cardBody>
            <Left>
              <CacheImages thumbnails large source={{ uri: this.props.item.receiver_Image }} />
              <TouchableOpacity onPress={() => this.setState({ enlargeEventImage: true })} >
                <CacheImages thumbnails large source={{ uri: this.props.item.event_Image }} style={{ marginLeft: -30 }} />
              </TouchableOpacity>
            </Left>
            <Body >
              <Text style={{ marginLeft: -40 }} onPress={() => this.setState({ isOpen: true })}
              >{this.props.item.event_title}</Text>
              <Text style={{ marginLeft: -40, color: 'dimgray', fontSize: 12 }}
                onPress={() => this.setState({ isOpen: true })}> on the {this.props.item.created_date} at
                    {this.props.item.event_time}</Text>
            </Body>
          </CardItem>
          <CardItem style={{ marginTop: 10 }}>
            <Right>
              <Text style={{
                marginRight: -60, color: 'dimgray', marginBottom: -10,
                fontSize: 13
              }}>{this.props.item.received_date}</Text>
              <Text style={{
                marginRight: 220, marginTop: -10,
                color: 'dimgray', fontSize: 13
              }}>{this.props.item.invitation_status}</Text>
            </Right>
          </CardItem>



          <ProfileModal isOpen={this.state.isOpenStatus} profile={{
            name: this.props.item.sender_name,
            image: this.props.item.sender_Image,
            status: this.props.item.sender_status
          }} onClosed={() => this.setState({ isOpenStatus: false })} />
          <PhotoModal isOpen={this.state.enlargeEventImage} image={this.props.item.event_Image} onClosed={() => this.setState({ enlargeEventImage: false })} />
          <DetailModal isOpen={this.state.isOpen} details={cards} location={this.props.item.location}
            event_organiser_name={this.props.item.event_organiser_name}
            created_date={this.props.item.created_date} isJoining={() => this.join()} onclosed={() => this.setState({ isOpen: false })}
          />
        </Card>
      </Swipeout>
    );
  }
}




export default CardListItem










