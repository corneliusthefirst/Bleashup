import React, { Component } from "react";
import {
  Content, Card, CardItem, Toast, Text, Spinner, Title, Icon
} from "native-base";

import { StyleSheet, View, Image, TouchableOpacity, FlatList, ScrollView, Dimensions } from 'react-native';
import autobind from "autobind-decorator";
import stores from '../../../stores/index';
//import { observer } from 'mobx-react'
import { filter, uniqBy, concat, head, orderBy, find, findIndex, reject, uniq, indexOf, forEach, dropWhile } from "lodash";
import request from "../../../services/requestObjects";

import EventLocation from "../event/createEvent/components/EventLocation";
import EventDescription from "../event/createEvent/components/EventDescription";
import EventHighlights from "../event/createEvent/components/EventHighlights";
import moment from 'moment';
import shadower from "../../shadower";
import BleashupFlatList from '../../BleashupFlatList';
import Requester from '../event/Requester';
import BleashupAlert from '../event/createEvent/components/BleashupAlert';
import emitter from '../../../services/eventEmiter';
import HighlightCard from "../event/createEvent/components/HighlightCard"
import MapView from "../currentevents/components/MapView";
import Creator from "../reminds/Creator";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import HighLightsDetails from '../highlights_details/index';
import QRDisplayer from "../QR/QRCodeDisplayer";
import colorList from '../../colorList'
import { round } from "react-native-reanimated";
import ColorList from "../../colorList";
import DescriptionModal from './descriptionModal';
import Drawer from '../../draggableView';
import SideButton from '../../sideButton';
import Share from '../../../stores/share';
import BeNavigator from '../../../services/navigationServices';
import ShareFrame from "../../mainComponents/ShareFram";

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
      updateTitleState: false,
      viewdetail: false,

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
    this.init()
  }
  initShare() {
    this.sharStore = new Share(this.props.share.id)
    this.sharStore.readFromStore().then(()=>{
      this.setState({
        isMounted:true
      })
    })
    stores.Highlights.loadHighlightFromRemote(this.props.share.item_id).
      then((post) => {
        stores.Events.loadCurrentEventFromRemote(this.props.share.event_id,true).
          then((event) => {
            this.sharStore.saveCurrentState({ ...this.props.share, post: Array.isArray(post) && post[0] || post, event }).then(() => {
              this.setState({
                isMountedSec: true
              })
            })
          })
      })
  }
  init() {
    !this.props.shared ? this.initializer() : this.initShare()
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
    } else {
      Toast.show({ text: 'App is Busy' })
    }
  }



  width = width / 2 - width / 40
  _getItemLayout = (data, index) => (
    { length: 100, offset: 100 * index, index }
  )
  _keyExtractor = (item, index) => item.id.toString();

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
    return BeNavigator.navigateTo("HighLightsDetails", { event_id: id });
  }
  delay = 1
  sorter = (a, b) => (a.created_at > b.created_at ? -1 :
    a.created_at < b.created_at ? 1 : 0)

  renderPosts() {
    return (!this.state.isMounted ? <View style={{ height: colorList.containerHeight, backgroundColor: colorList.bodyBackground, width: '100%' }}></View> :
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
              <View style={{ width: "10%", paddingLeft: "3%" }} >
                <Icon onPress={() => { BeNavigator.goBack() }}
                  style={{ color: colorList.headerIcon, }} type={"MaterialIcons"} name={"arrow-back"}></Icon>
              </View>

              <View style={{ width: '69%', paddingLeft: '9%', justifyContent: "center" }}>
                <Title style={{ color: colorList.headerText, fontWeight: 'bold', alignSelf: 'flex-start' }}>{this.props.Event.about.title}</Title>
              </View>
              <View style={{ width: '20%', alignItems: "flex-end" }}>
                <Icon onPress={() => {
                  this.props.openMenu()
                }} style={{ color: colorList.headerIcon, marginRight: "18%" }} type={"Ionicons"} name={"ios-menu"}></Icon>
              </View>

            </View>
          </View>



          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
            <View style={{ minHeight: colorList.containerHeight - colorList.headerHeight, flexDirection: "column", width: "100%", justifyContent: 'center', }} >
              <View style={{
                height: this.state.highlightData.length == 0 ? 0 :
                  colorList.containerHeight - colorList.headerHeight,
                width: "100%", alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }} >

                {this.state.refresh ? <BleashupFlatList
                  initialRender={4}
                  horizontal={false}
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
                        height={colorList.containerHeight * .45}
                        phone={stores.LoginStore.user.phone}
                        activity_id={this.props.Event.id}
                        activity_name={this.props.Event.about.title}
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
                        }}
                        participant={this.state.participant}
                        parentComponent={this}
                        item={item}
                        ancien={true}
                        ref={"higlightcard"} />
                    );
                  }}
                >
                </BleashupFlatList> : null}
              </View>


            </View>

          </ScrollView>

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


          <DescriptionModal Event={this.props.Event} isOpen={this.state.viewdetail} onClosed={() => { this.setState({ viewdetail: false }) }} parent={this}></DescriptionModal>

          {this.state.EventDescriptionState ? <EventDescription updateDesc={(newDesc) => {
            this.props.updateDesc(newDesc)
          }} event={this.props.Event} isOpen={this.state.EventDescriptionState} onClosed={() => { this.setState({ EventDescriptionState: false }) }}
            ref={"description_ref"} eventId={this.props.Event.id} updateDes={true} parentComp={this} /> : null}

          {this.state.EventLocationState ? <EventLocation updateLocation={(newLoc) => {
            this.props.updateLocation(newLoc)
          }} event={this.props.Event} isOpen={this.state.EventLocationState} onClosed={() => { this.setState({ EventLocationState: false }) }}
            ref={"location_ref"} updateLoc={true} eventId={this.props.Event.id} parentComp={this} /> : null}


          {this.state.isAreYouSureModalOpened ? <BleashupAlert title={"Delete Higlight"} accept={"Yes"} refuse={"No"} message={" Are you sure you want to delete these highlight ?"}
            deleteFunction={() => this.deleteHighlight(this.state.current_highlight)}
            isOpen={this.state.isAreYouSureModalOpened} onClosed={() => { this.setState({ isAreYouSureModalOpened: false }) }} /> : null}


          <SideButton
            buttonColor={'rgba(52, 52, 52, 0.8)'}
            position={"right"}
            //text={"D"}
            renderIcon={() => {
              return <View style={{ backgroundColor: ColorList.bodyBackground, height: 40, width: 40, borderRadius: 30, justifyContent: "center", alignItems: "center", ...shadower(4) }}>
                <Icon name="file-text" type="Feather" style={{ color: ColorList.bodyIcon, fontSize: 22 }} />
              </View>
            }}
            action={() => { this.setState({ viewdetail: true }) }}
            //buttonTextStyle={{color:colorList.bodyBackground}}
            offsetX={10}
            size={40}
            offsetY={30}
          />

          <SideButton
            //buttonColor={'rgba(52, 52, 52, 0.8)'}
            position={"right"}
            //text={"+"}
            action={() => requestAnimationFrame(() => this.newHighlight())}
            buttonTextStyle={{ color: "white" }}
            renderIcon={() => {
              return <View style={{ backgroundColor: ColorList.bodyBackground, height: 40, width: 40, borderRadius: 30, justifyContent: "center", alignItems: "center", ...shadower(4) }}>
                <Icon name="plus" type="AntDesign" style={{ color: ColorList.bodyIcon, fontSize: 22 }} />
              </View>
            }}
            size={40}
            offsetX={10}
            offsetY={90}

          />



        </View>
      )

    )
  }
  renderSharedPost() {
    return this.state.isMounted && <ShareFrame
      share={this.sharStore.share}
      sharer={this.sharStore.share.sharer}
      date={this.sharStore.share.date}
      content={() => <HighlightCard
        height={colorList.containerHeight * .45}
        shadowless
        phone={stores.LoginStore.user.phone}
        showItem={this.props.showHighlight}
        activity_id={this.props.Event.id}
        activity_name={this.props.Event.about.title}
        delay={this.delay}
        item={this.sharStore.share.post}
        participant={this.sharStore.share &&
          this.sharStore.share.event &&
          this.sharStore.share.event.participant &&
          find(this.sharStore.share.event.participant,
            (ele => ele.phone === stores.LoginStore.user.phone))
          || {phone:stores.LoginStore.user.phone,master:false}}
      ></HighlightCard>}
    >
    </ShareFrame>
  }
  renderBody() {
    return !this.props.shared ? this.renderPosts() : this.renderSharedPost()
  }
  render() {
    return this.renderBody()
  }


}

