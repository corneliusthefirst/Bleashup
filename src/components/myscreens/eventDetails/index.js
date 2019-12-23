import React, { Component } from "react";
import {
  Content, Card, CardItem, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner, Root,
  Button, InputGroup, DatePicker, Thumbnail, Alert, Textarea, List, ListItem, Label
} from "native-base";

import { Linking, Text, StyleSheet, View, Image, TouchableOpacity, FlatList, ScrollView, Dimensions } from 'react-native';
import ActionButton from 'react-native-action-button';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";
import CacheImages from "../../CacheImages";
import HighlightCard from "../event/createEvent/components/HighlightCard"
import PhotoEnlargeModal from "../invitations/components/PhotoEnlargeModal";
import ImagePicker from 'react-native-image-picker';
import stores from '../../../stores/index';
import { observer } from 'mobx-react'
import { filter, uniqBy, head, orderBy, find, findIndex, reject, uniq, indexOf, forEach, dropWhile } from "lodash";
import request from "../../../services/requestObjects";

import EventTitle from "../event/createEvent/components/EventTitle";
import EventPhoto from "../event/createEvent/components/EventPhoto";
import EventLocation from "../event/createEvent/components/EventLocation";
import EventDescription from "../event/createEvent/components/EventDescription";
import EventHighlights from "../event/createEvent/components/EventHighlights";
import Hyperlink from 'react-native-hyperlink';
import moment from 'moment';
import  BleashupHorizontalFlatList from '../../BleashupHorizotalFlatList';

let { height, width } = Dimensions.get('window');

@observer
export default class EventDetailView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      enlargeImage: false,
      initialScrollIndex: 2,
      highlightData: [],
      EventData: request.Event(),
      isMounted: false,
      animateHighlight:false,
      defaultDetail: "No  Event Decription !!",
      defaultLocation: "No event location given !",
      username: "",
      EventDescriptionState: false,
      EventLocationState: false,
      creation_date: "",
      creation_time: "",
      participant: request.Participant(),
      EventHighlightState: false

    }

  }


  @autobind
  initializer() {

    stores.Highlights.fetchHighlights(this.props.Event.id).then(Highlights => {
      let res = moment(this.props.Event.created_at).format().split("T");
      let participant = find(this.props.Event.participant, { phone: stores.LoginStore.user.phone });
      if (this.props.Event.creator_phone != "") {
        stores.TemporalUsersStore.getUser(this.props.Event.creator_phone).then((creatorInfo) => {
          this.setState({
            highlightData: Highlights,
            creation_date: res[0] ? res[0] : null,
            isMounted: true,
            username: creatorInfo.nickname,
            creation_time: res[1] ? res[1].split("+")[0] : null,
            EventData: this.props.Event, 
            participant: participant
          })
        })
      }
    })

  }



  componentDidMount() {
    this.setState({animateHighlight:true});
    this.initializer();

    setInterval(() => {
      if ((this.state.animateHighlight == true) && (this.state.highlightData.length > 2)) {
        this.detail_flatlistRef.scrollToIndex({ animated: true, index: this.state.initialScrollIndex, viewOffset: 0, viewPosition: 0 });

        if (this.state.initialScrollIndex >= (this.state.highlightData.length) - 2) {
          this.setState({ initialScrollIndex: 0 });
        } else {
          this.setState({ initialScrollIndex: this.state.initialScrollIndex + 2 })
        }
      }
    }, 4000)
    console.warn(this.props.Event)

  }

  componentWillUnmount(){
    this.state.animateHighlight = false;
  }
  



  @autobind
  back() {
    this.setState({ animateHighlight: false })
    //add backward navigation to calling page
  }

  @autobind
  deleteHighlight(id) {
    this.state.highlightData = reject(this.state.highlightData, { id, id });
    console.warn(this.state.highlightData, "highlight data state");
    this.setState({ highlightData: this.state.highlightData });
  }




  _getItemLayout = (data, index) => (
    { length: 100, offset: 100 * index, index }
  )
  _keyExtractor = (item, index) => item.id;

  /*
  _renderItem = ({ item, index }) => (

    <HighlightCard item={item} deleteHighlight={(id) => { this.deleteHighlight(id) }} ancien={true} participant={this.state.participant} />

  );*/


  @autobind
  newHighlight() {
    this.setState({ EventHighlightState: true })
    this.refs.highlights.setState({animateHighlight:true})
  }  


  render() {
    return (
      !this.state.isMounted ? <Spinner size={'small'}></Spinner> : <View style={{ height: "100%", backgroundColor: "#FEFFDE", width: "100%" }}>
        <View style={{
          height: 44,
          shadowOpacity: 1,
          shadowOffset: {
            height: 1,
          },
          shadowRadius: 10, elevation: 6,
          width: "100%",
          justifyContent: "space-between",
          flexDirection: "row",
          backgroundColor: "#FEFFDE",
          alignItems: "center",
        }}>
          <View style={{marginLeft:"4%"}}>
            <Title style={{ color: "#0A4E52", fontWeight: 'bold', }}>{this.props.Event.about.title}</Title>
          </View>
          <View >
            <TouchableOpacity style={{}}>
              <Icon type='AntDesign' name="pluscircle" style={{ color: "#1FABAB", fontSize: 25, alignSelf: 'center', marginRight: "5%", }} onPress={this.newHighlight} />
            </TouchableOpacity>
          </View>

        </View>

        <View style={{ height: "92%", flexDirection: "column", width: "100%" }} >
          <View style={{ height: this.state.highlightData.length == 0 ? 0 : height / 4 + height / 14, width: "100%" }} >
          <BleashupHorizontalFlatList
          initialRender={4}
          renderPerBatch={5}
          firstIndex={0}
          refHorizontal={(ref) => { this.detail_flatlistRef = ref }}
          keyExtractor={this._keyExtractor}
          dataSource={this.state.highlightData}
          parentComponent={this}
          getItemLayout={this._getItemLayout}
          renderItem={(item, index) => {
            return (
                <HighlightCard   participant={this.state.participant}  parentComponent={this} item={item} ancien={true} 
                   deleteHighlight={(id)=>{this.deleteHighlight(id)}} ref={"higlightcard"}/>
            );
          }} 
        >
        </BleashupHorizontalFlatList>
          </View>

          <View style={{ height: !(this.state.highlightData && this.state.highlightData.length) > 0 ? "70%" : this.props.Event.about.description.length > 500 ? height / 3 + height / 16 : height / 3, width: "96%", borderWidth: 1, borderRadius: 8, borderColor: "#1FABAB", margin: "2%" }}>
            <ScrollView showsVerticalScrollIndicator={false}
              nestedScrolEnabled={true}>
              <View style={{ flex: 1 }}>
                {this.props.Event.about.description != "" ?
                  <Hyperlink onPress={(url) => { Linking.openURL(url) }} linkStyle={{ color: '#48d1cc', fontSize: 16 }}>
                    <Text dataDetectorType={'all'} style={{ fontSize: 16, fontWeight: "500", margin: "1%" }} delayLongPress={800} onLongPress={() => {
                      if (this.state.participant.master == true) {
                        this.setState({ EventDescriptionState: true })
                        this.refs.description_ref.init();
                      }
                    }}>{this.props.Event.about.description}</Text>
                  </Hyperlink> :
                  <Text style={{ fontWeight: "500", margin: "1%", fontSize: 30, alignSelf: 'center', marginTop: (height) / 8 }} delayLongPress={800} onLongPress={() => {
                    if (this.state.participant.master == true) { this.setState({ EventDescriptionState: true }) }
                  }}>{this.state.defaultDetail}</Text>}
              </View>
            </ScrollView>
          </View>




          {this.props.Event.location.string != "" ?
            <View style={{ flexDirection: "column", height: height / 5, alignItems: "flex-end", marginRight: "3%", marginBottom: "5%", }}>


              <TouchableOpacity delayLongPress={800} onLongPress={() => {
                if (this.state.participant.master == true) {
                  this.setState({ EventLocationState: true })
                  this.refs.location_ref.init();
                }
              }} >
                <Text ellipsizeMode="clip" numberOfLines={3} style={{ fontSize: 14, color: "#1FABAB", margin: "1%" }}>
                  {this.props.Event.location.string}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={this.props.OpenLinkZoom}>
                <Image
                  source={require("../../../../Images/google-maps-alternatives-china-720x340.jpg")}
                  style={{
                    height: height / 10,
                    width: width / 3,
                    borderRadius: 15,


                  }}
                  resizeMode="contain"
                  onLoad={() => { }}
                />

              </TouchableOpacity>

              <TouchableOpacity onPress={this.props.OpenLink} style={{ margin: "1%" }}>
                <Text note> View On Map </Text>
              </TouchableOpacity>

            </View> :
            <TouchableOpacity delayLongPress={1000} onLongPress={() => {
              if (this.state.participant.master == true) {
                this.setState({ EventLocationState: true })
              }
            }}>
              <View>
                <Text ellipsizeMode="clip" numberOfLines={3} style={{ alignSelf: 'flex-end', fontSize: 14, color: "#1FABAB", margin: "2%" }}>
                  {this.state.defaultLocation}</Text>
              </View>
            </TouchableOpacity>}
          <View style={{ flexDirection: "row", position: 'absolute', justifyContent: "space-between", bottom: 0, margin: 3, width: "98%" }}>
            <Text style={{ margin: "1%", fontSize: 11, color: "gray" }} >on the {this.state.creation_date} at {this.state.creation_time}</Text>
            <Text style={{ margin: "1%", fontSize: 11 }} note>by {this.state.username} </Text>
          </View>


        </View>





        <EventDescription isOpen={this.state.EventDescriptionState} onClosed={() => { this.setState({ EventDescriptionState: false }) }}
          ref={"description_ref"} eventId={this.props.Event.id} updateDes={true} parentComp={this} />

        <EventLocation isOpen={this.state.EventLocationState} onClosed={() => { this.setState({ EventLocationState: false }) }}
          ref={"location_ref"} updateLoc={true} eventId={this.props.Event.id} parentComp={this} />

        <EventHighlights update={false} isOpen={this.state.EventHighlightState} onClosed={() => { this.setState({ EventHighlightState: false }) }}
           participant={this.state.participant} parentComponent={this} ref={"highlights"} event_id={this.props.Event.id} />

      </View>



    )
  }

}

