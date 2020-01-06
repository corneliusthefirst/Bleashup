import React, { Component } from "react";
import {
  Content, Card, CardItem, Toast, Text, Spinner, Title, Icon
} from "native-base";

import { Linking, StyleSheet, View, Image, TouchableOpacity, FlatList, ScrollView, Dimensions } from 'react-native';
import ActionButton from 'react-native-action-button';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";
import CacheImages from "../../CacheImages";
import PhotoEnlargeModal from "../invitations/components/PhotoEnlargeModal";
import ImagePicker from 'react-native-image-picker';
import stores from '../../../stores/index';
import { observer } from 'mobx-react'
import { filter, uniqBy, concat, head, orderBy, find, findIndex, reject, uniq, indexOf, forEach, dropWhile } from "lodash";
import request from "../../../services/requestObjects";

import EventTitle from "../event/createEvent/components/EventTitle";
import EventPhoto from "../event/createEvent/components/EventPhoto";
import EventLocation from "../event/createEvent/components/EventLocation";
import EventDescription from "../event/createEvent/components/EventDescription";
import EventHighlights from "../event/createEvent/components/EventHighlights";
import Hyperlink from 'react-native-hyperlink';
import moment from 'moment';
import shadower from "../../shadower";
import VideoViewer from "../highlights_details/VideoModal";
import BleashupFlatList from '../../BleashupFlatList';
import Requester from '../event/Requester';
import HighlightCardDetail from '../event/createEvent/components/HighlightCardDetail';
import BleashupAlert from '../event/createEvent/components/BleashupAlert';
import emitter from '../../../services/eventEmiter';
import PhotoViewer from "../event/PhotoViewer";
import HighlightCard from "../event/createEvent/components/HighlightCard"
let { height, width } = Dimensions.get('window');

@observer
export default class EventDetailView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      enlargeImage: false,
      initialScrollIndex: 2,
      refresh: true,
      highlightData: [],
      EventData: request.Event(),
      isMounted: false,
      update: false,
      highlight_id: null,
      animateHighlight: false,
      defaultDetail: "No  Event Decription !!",
      defaultLocation: "No event location given !",
      username: "",
      EventDescriptionState: false,
      EventLocationState: false,
      creation_date: "",
      creation_time: "",
      participant: request.Participant(),
      EventHighlightState: false,
      updateTitleState:false

    }

  }
  state = {

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

          /*this.intervalID = setInterval(() => {
            if ((this.state.animateHighlight == true || this.state.showTimmer !== true) && (this.state.highlightData.length > this.incrementer)) {
              this.detail_flatlistRef.scrollToIndex({ animated: true, index: this.initialScrollIndexer, viewOffset: 0, viewPosition: 0 });

              if (this.initialScrollIndexer >= (this.state.highlightData.length) - this.incrementer) {
                this.initialScrollIndexer = 0
              } else {
                this.initialScrollIndexer = this.initialScrollIndexer + this.incrementer
              }
            }
          }, this.interval)*/
        })
      }
    })

  }
  initialScrollIndexer = 2
  incrementer = 2
  interval = 4000
  handleRefresh() {
    console.warn('receiving refresh highlights message')
    stores.Highlights.fetchHighlights(this.props.Event.id).then(Higs => {
      this.setState({
        highlightData: Higs
      })
    })
  }
  componentWillMount() {
    emitter.on('refresh-highlights', this.handleRefresh.bind(this))
  }
  componentWillUnmount() {
    emitter.off('refresh-highlights')
  }
  componentDidMount() {
    this.setState({ animateHighlight: true });
    this.initializer();
  }

  componentWillUnmount() {
    this.animateHighlight = false;
    //clearInterval(this.intervalID)
  }
  reinitializeHighlightsList(newHighlight) {
    this.setState({
      highlightData: [newHighlight].concat(this.state.highlightData)
    })

  }




  @autobind
  back() {
    this.setState({ animateHighlight: false })
    //add backward navigation to calling page
  }

  @autobind
  deleteHighlight(item) {
    this.props.startLoader()
    this.setState({ isAreYouSureModalOpened: false });
    //console.warn("deleting....")
    //remove the higlight id from event then remove the highlight from the higlights store
    if (item.event_id == "newEventId") {
      //console.warn("inside if....")
      //console.warn(this.props.item.id);
      stores.Events.removeHighlight(item.event_id, item.id, false).then(() => {
        stores.Highlights.removeHighlight(item.id).then(() => { 
          this.state.highlightData = reject(this.state.highlightData, { id: item.id });
          this.setState({ highlightData: this.state.highlightData });
          this.props.stopLoader()
        });
      });
      //console.warn("inside if 2....");
    } else {
      Requester.deleteHighlight(item.id,item.event_id).then(() => {
        this.props.stopLoader()
        this.state.highlightData = reject(this.state.highlightData, { id: item.id });
        this.setState({ highlightData: this.state.highlightData });
      }).catch((error) => {

      })
    }
    //console.warn("inside if 5....");
  }



  width = width / 2 - width / 40
  _getItemLayout = (data, index) => (
    { length: 100, offset: 100 * index, index }
  )
  _keyExtractor = (item, index) => item.id;

  /*
  _renderItem = ({ item, index }) => (

    <HighlightCard item={item} deleteHighlight={(id) => { this.deleteHighlight(id) }} ancien={true} participant={this.state.participant} />

  );*/

  updateHighlight(newHighlight, previousHighlight) {
    this.props.startLoader()
    Requester.applyAllHighlightsUpdate(newHighlight,
      previousHighlight).then((response) => {
        if (response) {
          Toast.show({ text: 'aupdate was successful', type: 'success' })
          this.setState({
            highlightData: [newHighlight].concat(this.state.highlightData.filter(ele => ele.id !== newHighlight.id))
          })
        }
        this.props.stopLoader()
      })

  }
  @autobind
  newHighlight() {
    this.setState({ EventHighlightState: true })
    this.refs.highlights.setState({ animateHighlight: true })
  }
  deleteHighlightHighlight(highlights) {

  }

  render() {
    return (
      !this.state.isMounted ? <Spinner size={'small'}></Spinner> : <View style={{ height: "100%", backgroundColor: "#FEFFDE", width: "100%" }}>
        <View>
          <View style={{
            height: 44,
            ...shadower(6),
            width: "100%",
            justifyContent: "space-between",
            flexDirection: "row",
            backgroundColor: "#FEFFDE",
            alignItems: "center",
          }}>
            <View style={{ marginLeft: "4%", ...shadower(6), }}>
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
              {this.state.refresh ? <BleashupFlatList
                initialRender={4}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                renderPerBatch={5}
                firstIndex={0}
                refHorizontal={(ref) => { this.detail_flatlistRef = ref }}
                keyExtractor={this._keyExtractor}
                dataSource={this.state.highlightData}
                parentComponent={this}
                //getItemLayout={this._getItemLayout}
                renderItem={(item, index) => {
                  return (
                    <HighlightCard update={(hid) => {
                      this.setState({
                        EventHighlightState: true,
                        update: true,
                        highlight_id: hid
                      })
                    }}
                      deleteHighlight={(item) => {
                        this.setState({
                          current_highlight: item,
                          isAreYouSureModalOpened: true,
                        })
                      }}
                      showItem={(item) => {
                        this.setState({
                          highlightItem: item,
                          isHighlightDetailsModalOpened: true
                        })
                      }} participant={this.state.participant} parentComponent={this} item={item} ancien={true}
                      ref={"higlightcard"} />
                  );
                }}
              >
              </BleashupFlatList> : null}
            </View>

            <View style={{
              height: !(this.state.highlightData &&
                this.state.highlightData.length) > 0 ? "70%" :
                this.props.Event.about.description.length > 500 ?
                  height / 3 + height / 16 : height / 3, width: "96%",
              borderRadius: 8,
              borderColor: "#1FABAB", margin: "2%", borderWidth: 1,
            }}>
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
                      height: height / 24,
                      width: width / 4,
                      borderRadius: 10,


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
              <Text style={{ margin: "1%", fontSize: 11, fontStyle: 'normal', }} note>by {this.state.username} </Text>
            </View>


          </View>
          <EventDescription isOpen={this.state.EventDescriptionState} onClosed={() => { this.setState({ EventDescriptionState: false }) }}
            ref={"description_ref"} eventId={this.props.Event.id} updateDes={true} parentComp={this} />

          <EventLocation isOpen={this.state.EventLocationState} onClosed={() => { this.setState({ EventLocationState: false }) }}
            ref={"location_ref"} updateLoc={true} eventId={this.props.Event.id} parentComp={this} />
          {this.state.showVideo ? <VideoViewer open={this.state.showVideo} hideVideo={() => {
            this.setState({
              showVideo: false,
              EventHighlightState: this.wasEventHiglightOpened?true:false,
              isHighlightDetailsModalOpened:this.wasDetailOpened?true:false
            })
            this.wasEventHiglightOpened = false;
            this.wasDetailOpened = false
          }} video={this.state.video}
          ></VideoViewer> : null}
          <EventHighlights showTrimer={(source) => {
            this.setState({
              EventHighlightState: false,
              showTimmer: true,
              source: source
            })
          }} startLoader={() => {
            this.props.startLoader()
          }} stopLoader={() => {
            this.props.stopLoader()
          }} playVideo={(vid) => {
            this.wasEventHiglightOpened = true
            this.setState({
              showVideo: true,
              video: vid,
              EventHighlightState: false
            })
          }}
            update={this.state.update}
            highlight_id={this.state.highlight_id}
            reinitializeHighlightsList={(newHighlight) => {
              this.reinitializeHighlightsList(newHighlight)
            }} isOpen={this.state.EventHighlightState} onClosed={() => {
              this.setState({ EventHighlightState: false, update: false, highlight_id: null })
            }}
            update={(newHighlight, previousHighlight) => this.updateHighlight(newHighlight, previousHighlight)}
            participant={this.state.participant} parentComponent={this} ref={"highlights"} event_id={this.props.Event.id} />
          {this.state.isHighlightDetailsModalOpened ? <HighlightCardDetail showVideo={(video) => {
            this.wasDetailOpened=true
            this.setState({
              showVideo:true,
              video:video,
              isHighlightDetailsModalOpened:false
            })
          }} showPhoto={(photo) => {
            this.setState({
              showPhoto: true,
              isHighlightDetailsModalOpened: false,
              photo: photo
            })
          }} isOpen={this.state.isHighlightDetailsModalOpened} item={this.state.highlightItem} onClosed={() => { this.setState({ isHighlightDetailsModalOpened: false }) }} /> : null}
          {this.state.isAreYouSureModalOpened ? <BleashupAlert title={"Delete Higlight"} accept={"Yes"} refuse={"No"} message={" Are you sure you want to delete these highlight ?"}
            deleteFunction={() => this.deleteHighlight(this.state.current_highlight)}
            isOpen={this.state.isAreYouSureModalOpened} onClosed={() => { this.setState({ isAreYouSureModalOpened: false }) }} /> : null}
          {this.state.showPhoto ? <PhotoViewer photo={this.state.photo} open={this.state.showPhoto} hidePhoto={() => {
            this.setState({
              showPhoto: false,
              isHighlightDetailsModalOpened: true
            })
          }}></PhotoViewer> : null}
        </View>
      </View>
    )
  }

}

