import React, { Component } from "react";
import {
  Content, Card, CardItem, Toast, Text, Spinner, Title, Icon
} from "native-base";

import { Linking, StyleSheet, View, Image, TouchableOpacity, FlatList, ScrollView, Dimensions } from 'react-native';
import autobind from "autobind-decorator";
import CacheImages from "../../CacheImages";
import PhotoEnlargeModal from "../invitations/components/PhotoEnlargeModal";
import ImagePicker from 'react-native-image-picker';
import stores from '../../../stores/index';
//import { observer } from 'mobx-react'
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
import BleashupAlert from '../event/createEvent/components/BleashupAlert';
import emitter from '../../../services/eventEmiter';
import PhotoViewer from "../event/PhotoViewer";
import HighlightCard from "../event/createEvent/components/HighlightCard"
import MapView from "../currentevents/components/MapView";
import Creator from "../reminds/Creator";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import HighLightsDetails from '../highlights_details/index';
import QRDisplayer from "../QR/QRCodeDisplayer";
import colorList from '../../colorList'
import { round } from "react-native-reanimated";

let { height, width } = Dimensions.get('window');

//@observer
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
      defaultDetail: "No Description Provided !!",
      defaultLocation: "no location given !",
      username: "",
      EventDescriptionState: false,
      EventLocationState: false,
      creation_date: "",
      creation_time: "",
      participant: request.Participant(),
      EventHighlightState: false,
      updateTitleState: false

    }

  }
  state = {

  }

  @autobind
  initializer() {
    let participant = find(this.props.Event.participant, { phone: stores.LoginStore.user.phone });
    stores.Highlights.fetchHighlights(this.props.Event.id).then(Highlights => {
      this.setState({
        highlightData: Highlights,
        creation_date: this.props.Event.created_at,
        isMounted: true,
        EventData: this.props.Event,
        participant: participant
      })
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
    emitter.on(`refresh-highlights_${this.props.Event.id}`, this.handleRefresh.bind(this))
  }
  componentWillUnmount() {
    emitter.off(`refresh-highlights_${this.props.Event.id}`)
  }
  componentDidMount() {
    //this.setState({ animateHighlight: true });
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
    this.sendUpdateHighlight()
  }




  @autobind
  back() {
    this.setState({ animateHighlight: false })
    //add backward navigation to calling page
  }

  @autobind
  deleteHighlight(item) {
    if (!this.props.working) {
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
        Requester.deleteHighlight(item.id, item.event_id).then(() => {
          this.props.stopLoader()
          this.state.highlightData = reject(this.state.highlightData, { id: item.id });
          this.setState({ highlightData: this.state.highlightData });
          this.sendUpdateHighlight()
        }).catch((error) => {
          this.props.stopLoader()
        })
      }
      //console.warn("inside if 5....");
    } else {
      Toast.show({ text: 'App is Busy' })
    }
  }



  width = width / 2 - width / 40
  _getItemLayout = (data, index) => (
    { length: 100, offset: 100 * index, index }
  )
  _keyExtractor = (item, index) => item.id.toString();

  /*
  _renderItem = ({ item, index }) => (

    <HighlightCard item={item} deleteHighlight={(id) => { this.deleteHighlight(id) }} ancien={true} participant={this.state.participant} />

  );*/

  updateHighlight(newHighlight, previousHighlight) {
    if (!this.props.working) {
      this.props.startLoader()
      Requester.applyAllHighlightsUpdate(newHighlight,
        previousHighlight).then((response) => {
          if (response) {
            //Toast.show({ text: 'aupdate was successful', type: 'success' })
            let index = findIndex(this.state.highlightData, { id: newHighlight.id })
            this.state.highlightData[index] = newHighlight
            this.setState({
              highlightData: this.state.highlightData
            })
          }
          this.props.stopLoader()
          this.sendUpdateHighlight()
        })
    } else {
      Toast.show({ text: 'App is Busy' })
    }
  }
  sendUpdateHighlight() {
    emitter.emit(`refresh-highlights_${this.props.Event.id}`)
  }
  @autobind
  newHighlight() {
    this.props.computedMaster ? this.setState({ EventHighlightState: true }) :
      Toast.show({ text: "you don't have enough priviledges to add a post", duration: 4000 })
  }
  deleteHighlightHighlight(highlights) {

  }
  mention(replyer) {
    this.props.mention(replyer)
  }
  showCreator() {
    this.state.creatorInfo ? this.setState({
      showProfileModal: true,
      profile: this.state.creatorInfo
    }) : null
  }
  relationPost(id) {
    return this.props.navigation.navigate("HighLightsDetails", { event_id: id });
  }
  delay = 1
  sorter = (a, b) => (a.created_at > b.created_at ? -1 :
    a.created_at < b.created_at ? 1 : 0)
  render() {
    return (
      !this.state.isMounted ? <View style={{ height: colorList.containerHeight, backgroundColor: colorList.bodyBackground, width: '100%' }}></View> :
        (this.state.EventData.type == "relation" ?
          (this.relationPost(this.state.EventData.id))
          :
          <View style={{ flex: 1, width: "100%" }}>

            <View style={{ flexDirection: "row", ...bleashupHeaderStyle, height: colorList.headerHeight, width: colorList.headerWidth, backgroundColor: colorList.headerBackground }}>

              <View style={{
                flex: 1,
                paddingLeft: '1%', paddingRight: '1%', backgroundColor: colorList.headerBackground,
                flexDirection: "row", alignItems: "center",
              }}>
                <View style={{ width: "10%", paddingLeft: "1%" }} >
                  <Icon onPress={() => { this.props.navigation.navigate("Home") }}
                    style={{ color: colorList.headerIcon, marginLeft: "5%", marginRight: "5%" }} type={"MaterialIcons"} name={"arrow-back"}></Icon>
                </View>

                <View style={{ width: '70%', paddingLeft: '2%', justifyContent: "center" }}>
                  <Title style={{ color: colorList.headerText, fontWeight: 'bold', alignSelf: 'flex-start' }}>{this.props.Event.about.title}</Title>
                </View>

                <View style={{ width: '10%', paddingRight: '3%' }}>
                  <Icon onPress={() => requestAnimationFrame(() => this.newHighlight())} type='AntDesign'
                    name="plus" style={{ color: colorList.headerIcon, alignSelf: 'center', }} />
                </View>

                <View style={{ width: '10%', paddingLeft: '1%' }}>
                  <Icon onPress={() => {
                    this.props.openMenu()
                  }} style={{ color: colorList.headerIcon }} type={"Ionicons"} name={"ios-menu"}></Icon>
                </View>

              </View>
            </View>
            <ScrollView nestedScrollEnabled>
              <View style={{ minHeight: colorList.containerHeight - colorList.headerHeight, flexDirection: "column", width: "100%" }} >
                <View style={{ height: this.state.highlightData.length == 0 ? 0 : colorList.containerHeight*.45, width: "95%",alignSelf: 'center',justifyContent: 'center', }} >
                  {this.state.refresh ? <BleashupFlatList
                    initialRender={4}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    renderPerBatch={5}
                    firstIndex={0}
                    refHorizontal={(ref) => { this.detail_flatlistRef = ref }}
                    keyExtractor={this._keyExtractor}
                    dataSource={this.state.highlightData.sort(this.sorter)}
                    numberOfItems={this.state.highlightData.length}
                    parentComponent={this}
                    //getItemLayout={this._getItemLayout}
                    renderItem={(item, index) => {
                      this.delay = index >= 5 ? 0 : this.delay + 1
                      return (
                        <HighlightCard
                          height={colorList.containerHeight*.45}
                          phone={stores.LoginStore.user.phone}
                          delay={this.delay}
                          update={(hid) => {
                            this.setState({
                              EventHighlightState: true,
                              update: true,
                              highlight_id: hid
                            })
                          }}
                          mention={(replyer) => {
                            this.mention(replyer)
                          }}
                          deleteHighlight={(item) => {
                            this.setState({
                              current_highlight: item,
                              isAreYouSureModalOpened: true,
                            })
                          }}
                          computedMaster={this.props.computedMaster}
                          showItem={(item) => {
                            this.props.showHighlight(item)
                          }} participant={this.state.participant} parentComponent={this} item={item} ancien={true}
                          ref={"higlightcard"} />
                      );
                    }}
                  >
                  </BleashupFlatList> : null}
                </View>


                <View style={{
                  height: colorList.containerHeight * .4,
                  borderRaduis:5,
                  ...shadower(2),
                  margin: '1%', padding: '1.5%',
                  marginBottom: '3%',
                  backgroundColor: colorList.bodyBackground,
                }}>
                  <View style={{
                    height: "100%", width: "100%",
                    alignSelf: "center"
                  }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}><Text note>activity description</Text>
                      {this.props.computedMaster ? <Icon name={"pencil"} type={"EvilIcons"} onPress={() => {
                        this.setState({
                          EventDescriptionState: true
                        })
                      }}></Icon> : null}</View>
                    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                      <View>
                        {this.props.Event.about.description != "" ?
                          <Hyperlink onPress={(url) => { Linking.openURL(url) }} linkStyle={{ color: '#48d1cc', fontSize: 16 }}>
                            <Text dataDetectorType={'all'} style={{ fontSize: 16, fontWeight: "400", margin: "1%", color: '#555756' }} delayLongPress={800}>{this.props.Event.about.description}</Text>
                          </Hyperlink> :
                          <Text style={{
                            fontWeight: "400", fontSize: 25,
                            alignSelf: 'center', marginTop: (colorList.containerHeight) / 8
                          }}
                            delayLongPress={800}>{this.state.defaultDetail}</Text>}
                      </View>
                    </ScrollView>

                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: "center", marginTop: 'auto', marginBottom: 'auto', height: colorList.containerHeight * .15 }}>
                  <QRDisplayer code={this.props.Event.id} title={this.props.Event.about.title}></QRDisplayer>
                </View>
                <View style={{ margin: '1%', marginLeft: '2%' }}>
                  <Creator color={colorList.bodyBackground} creator={this.props.Event.creator_phone}
                    created_at={this.props.Event.created_at} />
                </View>
              </View>
            </ScrollView>
            {this.state.EventDescriptionState ? <EventDescription updateDesc={(newDesc) => {
              this.props.updateDesc(newDesc)
            }} event={this.props.Event} isOpen={this.state.EventDescriptionState} onClosed={() => { this.setState({ EventDescriptionState: false }) }}
              ref={"description_ref"} eventId={this.props.Event.id} updateDes={true} parentComp={this} /> : null}

            {this.state.EventLocationState ? <EventLocation updateLocation={(newLoc) => {
              this.props.updateLocation(newLoc)
            }} event={this.props.Event} isOpen={this.state.EventLocationState} onClosed={() => { this.setState({ EventLocationState: false }) }}
              ref={"location_ref"} updateLoc={true} eventId={this.props.Event.id} parentComp={this} /> : null}
            <EventHighlights
              closeTeporary={() => {
                this.setState({
                  EventHighlightState: false,
                })
                setTimeout(() => {
                  this.setState({
                    EventHighlightState: true
                  })
                }, 600)
              }}
              startLoader={() => {
                this.props.startLoader()
              }} stopLoader={() => {
                this.props.stopLoader()
              }} playVideo={(vid) => {
                //this.wasEventHiglightOpened = true
                this.setState({
                  showVideo: true,
                  video: vid,
                  //EventHighlightState: false
                })
              }}
              updateState={this.state.update}
              highlight_id={this.state.highlight_id}
              reinitializeHighlightsList={(newHighlight) => {
                this.reinitializeHighlightsList(newHighlight)
              }} isOpen={this.state.EventHighlightState} onClosed={() => {
                this.setState({
                  EventHighlightState: false,
                  highlight_id: null
                })
              }}
              update={(newHighlight, previousHighlight) => this.updateHighlight(newHighlight, previousHighlight)}
              participant={this.state.participant} parentComponent={this} ref={"highlights"} event_id={this.props.Event.id} />


            {this.state.isAreYouSureModalOpened ? <BleashupAlert title={"Delete Higlight"} accept={"Yes"} refuse={"No"} message={" Are you sure you want to delete these highlight ?"}
              deleteFunction={() => this.deleteHighlight(this.state.current_highlight)}
              isOpen={this.state.isAreYouSureModalOpened} onClosed={() => { this.setState({ isAreYouSureModalOpened: false }) }} /> : null}

            {this.state.showPhoto ? <PhotoViewer photo={this.state.photo} open={this.state.showPhoto} hidePhoto={() => {
              this.setState({
                showPhoto: false,
                isHighlightDetailsModalOpened: true
              })
            }}></PhotoViewer> : null}
            {this.state.showVideo ? <VideoViewer open={this.state.showVideo} hideVideo={() => {
              this.setState({
                showVideo: false,
                //EventHighlightState: this.wasEventHiglightOpened ? true : false,
                isHighlightDetailsModalOpened: this.wasDetailOpened ? true : false,
              })
              this.wasEventHiglightOpened = false;
              this.wasDetailOpened = false
            }} video={this.state.video}
            ></VideoViewer> : null}
          </View>
        )

    )
  }

}

