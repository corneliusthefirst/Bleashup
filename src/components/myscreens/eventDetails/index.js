/* eslint-disable no-shadow */
/* eslint-disable semi */
/* eslint-disable react/no-string-refs */
/* eslint-disable comma-dangle */
/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ImageBackground, FlatList, ScrollView, Dimensions } from 'react-native';
import stores from '../../../stores/index';
//import { observer } from 'mobx-react'
import { find, findIndex, reject, } from "lodash";
import request from "../../../services/requestObjects";
import moment from 'moment';
import shadower from "../../shadower";
import BleashupFlatList from '../../BleashupFlatList';
import Requester from '../event/Requester';
import BleashupAlert from '../event/createEvent/components/BleashupAlert';
import emitter from '../../../services/eventEmiter';
import HighlightCard from "../event/createEvent/components/HighlightCard"
import Creator from "../reminds/Creator";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import QRDisplayer from "../QR/QRCodeDisplayer";
import colorList from '../../colorList'
import SideButton from '../../sideButton';
import Share from '../../../stores/share';
import BeNavigator from '../../../services/navigationServices';
import ShareFrame from "../../mainComponents/ShareFram";
import AnimatedComponent from '../../AnimatedComponent';
import MessageActions from '../eventChat/MessageActons';
import Vibrator from '../../../services/Vibrator';
import GState from '../../../stores/globalState/index';
import Toaster from "../../../services/Toaster";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import ColorList from '../../colorList';
import { observer } from "mobx-react";
import Texts from '../../../meta/text';
import globalFunctions from '../../globalFunctions';
import Searcher from '../Contacts/Searcher';
import { _onScroll } from '../currentevents/components/sideButtonService';
import rounder from '../../../services/rounder';
import { justSearch, cancelSearch, startSearching } from '../eventChat/searchServices';
import messagePreparer from '../eventChat/messagePreparer';
import { constructStarLink } from '../eventChat/services';
import MessageRequester from '../eventChat/Requester';
import Spinner from "../../Spinner";

let { height, width } = Dimensions.get('window');

//@observer
@observer class EventDetailView extends AnimatedComponent {
  initialize() {
    this.state = {
      enlargeImage: false,
      initialScrollIndex: 2,
      refresh: true,
      highlightData: [],
      EventData: request.Event(),
      isMounted: false,
      update: false,
      selectedItem: {},
      highlight_id: null,
      animateHighlight: false,
      username: "",
      searchString: "",
      EventDescriptionState: false,
      EventLocationState: false,
      creation_date: "",
      creation_time: "",
      isActionButtonVisible: true,
      participant: request.Participant(),
      EventHighlightState: false,
      updateTitleState: false,
      viewdetail: false,
      newing: false,
    }
    this.onScroll = _onScroll.bind(this)
    this.search = justSearch.bind(this)
    this.cancleSearch = cancelSearch.bind(this)
    this.startSearching = startSearching.bind(this)
    this.newHighlight = this.newHighlight.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.defaultItem = this.defaultItem.bind(this)
    this.hideActions = this.hideActions.bind(this)
  }
  scrolled = 0
  initializer() {
    let participant = find(this.props.Event.participant, { phone: stores.LoginStore.user.phone });
    this.animateUI()
    setTimeout(() => {
      this.setStatePure({
        newing: !this.state.newing,
        isMounted: true,
        participant: participant
      }, () => {
        if (this.props.star || this.props.autoStar) {
          this.newHighlight()
        }
        this.concludeInitialization()
      });
    })
  }
  concludeInitialization() {
    if ((!stores.Highlights.highlights[this.props.Event.id] ||
      stores.Highlights.highlights[this.props.Event.id].length <= 1)) {
      stores.Highlights.fetchHighlights(this.props.Event.id).then(() => {

      })
    }
    if (this.props.id) {
      let arr = stores.Highlights.highlights[this.props.Event.id].
        filter(el => globalFunctions.filterStars(el, this.state.searchString || ""))
      let scrollIndex = findIndex(arr, { id: this.props.id })
      if (scrollIndex >= 0)
        this.refs.postList && this.refs.postList.scrollToIndex(scrollIndex)
      else Toaster({ text: Texts.not_found_item })
    }
  }
  initialScrollIndexer = 2
  incrementer = 2
  interval = 4000
  handleRefresh() {
    this.setStatePure({
      newing: !this.state.newing
    })
  }
  componentMounting() {
  }
  unmountingComponent() {
    clearInterval(this.scrolling)
    clearTimeout(this.waitToScroll)
    clearTimeout(this.closeTeporary)
  }
  componentDidMount() {
    this.init();
  }
  init() {
    this.initializer()
  }
  componentWillUnmount() {
    this.animateHighlight = false;
    //clearInterval(this.intervalID)
  }
  reinitializeHighlightsList(newHighlight) {
    this.init()
  }




  back() {
    this.setStatePure({ animateHighlight: false })
    //add backward navigation to calling page
  }

  deleteHighlight(item) {
    if (!this.props.working) {
      this.props.startLoader()
      this.setStatePure({ isAreYouSureModalOpened: false });
      Requester.deleteHighlight(item.id, item.event_id).then(() => {
      }).catch((error) => {
        this.props.stopLoader()
      })
    } else {
      this.sayAppBusy()
    }
  }

  sayAppBusy() {
    Toaster({ text: Texts.app_busy })
  }

  width = width / 2 - width / 40
  _keyExtractor = (item, index) => {
    return item.id;
  }

  updateHighlight(newHighlight) {
    if (!this.props.working) {
      this.props.startLoader();
      Requester.applyAllHighlightsUpdate(newHighlight, this.previousHighlight).then((response) => {
        this.props.stopLoader();
      })
    } else {
      this.sayAppBusy()
    }
  }
  sendUpdateHighlight() {
    //emitter.emit(`refresh-highlights_${this.props.Event.id}`)
  }
  newHighlight() {
    BeNavigator.gotoCreateStar(this.prepareRouteActions())
  }
  mention(replyer) {
    this.props.mention(replyer)
  }
  mentionPrivately(item) {
    this.props.mentionPrivately(item)
  }
  delay = 1
  sorter = (a, b) => (a.created_at > b.created_at ? -1 :
    a.created_at < b.created_at ? 1 : 0)
  showActions(item) {
    Vibrator.vibrateShort()
    this.previousHighlight = JSON.stringify(item)
    this.setStatePure({
      selectedItem: item,
      showActions: true
    })
  }
  preDeleteHighlight = (item) => {
    this.setStatePure({
      current_highlight: item,
      isAreYouSureModalOpened: true,
    })
  }
  preUpdate = (hid) => {
    BeNavigator.gotoCreateStar(this.prepareRouteActions(hid, true))
  }
  createStar(newHighlight) {
    Requester.createHighlight(newHighlight, this.props.isRelation ? false : this.props.Event.about.title)
      .then(() => {
        MessageRequester.sendMessage(messagePreparer.formMessagefromStar(newHighlight),
          this.props.Event.id, this.props.Event.id,
          true,
          this.props.Event.about.title)
        this.resetHighlight();
        stores.Highlights.removeHighlight(newHighlight.event_id, request.Highlight().id).then(() => {
          this.props.stopLoader();

        });
      })
      .catch(() => {
        this.props.stopLoader();
      });
  }
  share() {
    this.props.showShare && this.props.showShare({
      ...messagePreparer.formMessagefromStar(this.state.selectedItem),
      forwarded: true,
      reply: null,
      from_activity: this.props.Event.id,
      from_committee: this.props.Event.id,
      from: null
    })
  }
  shareLink(item) {
    this.props.shareLink(constructStarLink(item.event_id, item.id), {}, null, true)
  }
  prepareRouteActions(h_id, update) {
    return {
      isRelation: this.props.isRelation,
      updateState: update,
      highlight_id: h_id,
      star: this.props.star,
      createStar: this.createStar.bind(this),
      update: this.updateHighlight.bind(this),
      event_id: this.props.Event.id,
    }
  }
  action = () => [
    {
      title: Texts.reply,
      callback: () => this.mention(this.state.selectedItem),
      iconName: "reply",
      condition: () => true,
      iconType: "Entypo",
      color: colorList.replyColor
    },
    {
      title: Texts.reply_privately,
      callback: () => this.mentionPrivately(this.state.selectedItem),
      iconName: 'reply',
      condition: () => !this.props.isRelation || this.props.Event.participant.length > 1,
      iconType: "Entypo",
      color: colorList.replyColor
    },
    {
      title: Texts.share,
      callback: () => this.share(this.state.selectedItem),
      iconName: "forward",
      condition: () => true,
      iconType: "Entypo",
      color: colorList.indicatorColor
    },
    {
      title: Texts.get_share_link,
      callback: () => this.shareLink(this.state.selectedItem),
      iconName: "ios-link",
      condition: () => true,
      iconType: "Ionicons",
      color: colorList.indicatorColor
    },
    {
      title: Texts.update,
      condition: () => this.props.master || globalFunctions.isMe(this.state.selectedItem.creator),
      callback: () => this.preUpdate(this.state.selectedItem.id),
      iconName: "history",
      iconType: "MaterialIcons",
      color: colorList.darkGrayText
    },
    {
      title: Texts.delete_,
      callback: () => this.preDeleteHighlight(this.state.selectedItem),
      condition: () => this.props.master || globalFunctions.isMe(this.state.selectedItem.creator),
      iconName: "delete-forever",
      iconType: "MaterialCommunityIcons",
      color: colorList.delete
    }
  ]
  hideSharing() {
    this.setStatePure({
      isSharing: false
    })
  }
  renderItem(item, index) {
    this.delay = index >= 5 ? 0 : this.delay + 1
    let updateState = moment(item.update).format("x")
    return (<HighlightCard
      updateState={updateState}
      searchString={this.state.searchString}
      isPointed={item.id === GState.currentID}
      onLayout={(layout) => {
        GState.itemDebounce(item, () => {
          index = findIndex(stores.Highlights.highlights[item.event_id], { id: item.id })
          stores.Highlights.persistDimenssion(index, item.event_id, layout)
        })
      }}
      showActions={() => this.showActions(item)}
      animate={this.animateUI.bind(this)}
      height={colorList.containerHeight * .45}
      phone={stores.LoginStore.user.phone}
      activity_id={this.props.Event.id}
      mention={this.mention.bind(this)}
      activity_name={this.props.Event.about.title}
      delay={this.delay}
      computedMaster={this.props.computedMaster}
      showItem={this.props.showHighlight}
      participant={this.state.participant}
      item={item}
    />
    );
  }
  defaultItem() {
    return <View style={GState.descriptBoxStyle}>
      <View style={{ alignSelf: 'center', marginBottom: '3%', }}>
        <Text style={GState.featureBoxTitle}>{Texts.beup_highlight}</Text>
      </View>
      <View>
        <Text style={{
          ...GState.defaultTextStyle,
          fontWeight: 'bold',
          marginBottom: '3%',
        }}>
          {Texts.beup_highlight_description}
        </Text>
      </View>
      <View style={{alignSelf: 'center',}}>
        {this.plusButton()}
      </View>
    </View>
  }
  plusButton(){
    return <TouchableOpacity
      onPress={this.newHighlight}
      style={{
        backgroundColor: ColorList.bodyBackground,
        ...rounder(50, ColorList.bodyBackground),
        ...shadower(4)
      }}>
      <AntDesign name="star" type="AntDesign" style={{
        ...GState.defaultIconSize,
        color: ColorList.post,
      }} />
    </TouchableOpacity>
  }
  hideActions(){
    this.setStatePure({
      showActions: false
    })
  }
  getItemLayout = (item, index) => GState.getItemLayout(item, index, this.data, 70, 0)
  renderPosts() {
    this.data = (stores.Highlights.highlights[this.props.Event.id] || []).
      filter((ele) => globalFunctions.filterStars(ele, this.state.searchString || ""));
    return <ImageBackground
      style={GState.imageBackgroundContainer}
      source={GState.backgroundImage}
    >
      <View style={{ flex: 1, width: "100%", }}>
        <View
          style={{
            flexDirection: "row",
            ...bleashupHeaderStyle,
            alignSelf: 'center',
            height: colorList.headerHeight,
            backgroundColor: colorList.headerBackground
          }}>

          <View style={{
            flex: 1,
            justifyContent: 'space-between',
            marginHorizontal: '1%',
            backgroundColor: colorList.headerBackground,
            flexDirection: "row",
            alignItems: "center",
          }}>
            <TouchableOpacity onPress={() => requestAnimationFrame(this.props.goback)} style={{
              width: 30,
              marginRight: '2%',
            }} >
              <MaterialIcons
                style={{ ...GState.defaultIconSize, color: colorList.headerIcon, }} type={"MaterialIcons"}
                name={"arrow-back"} />
            </TouchableOpacity>

            {!this.state.searching ? <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={{
                color: colorList.headerText, fontWeight: 'bold',
                alignSelf: 'flex-start',
                fontSize: colorList.headerFontSize
              }}>
                {Texts.star_messages_at + " " + this.props.Event.about.title}</Text>
            </View> : null}
            <View style={{
              flexDirection: 'column',
              justifyContent: 'center',
              flex: this.state.searching ? 1 : null,
              width: this.state.searching ? null : 35,
              height: 35
            }}>
              <Searcher
                searching={this.state.searching}
                search={this.search.bind(this)}
                startSearching={this.startSearching.bind(this)}
                cancelSearch={this.cancleSearch.bind(this)}
                searchString={this.state.searchString}
              >
              </Searcher></View>
          </View>
        </View>
        {!this.state.isMounted ? <View style={{
          height: colorList.containerHeight,
          backgroundColor: colorList.bodyBackground,
          flex: 1,
          width: '100%'
        }}>
          <Spinner></Spinner>
        </View> :
          <View style={{
            flex: 1,
            width: "100%", alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }} >

            <BleashupFlatList
              backgroundColor={"transparent"}
              initialRender={9}
              onScroll={this.onScroll}
              ref={"postList"}
              horizontal={false}
              renderPerBatch={10}
              defaultItem={this.defaultItem}
              firstIndex={0}
              getItemLayout={this.getItemLayout}
              keyExtractor={this._keyExtractor}
              dataSource={this.data}
              numberOfItems={this.data.length}
              renderItem={this.renderItem}
            >
            </BleashupFlatList>
          </View>}
        {this.state.showActions ? <MessageActions title={"star actions"} actions={this.action} onClosed={this.hideActions} isOpen={this.state.showActions}></MessageActions> : null}
        {this.props.isAreYouSureModalOpened ? <BleashupAlert
          title={Texts.delete_highlight}
          accept={Texts.yes} refuse={Texts.no}
          message={Texts.are_you_sure_to_delete_this_highlight}
          deleteFunction={() => this.deleteHighlight(this.state.current_highlight)}
          isOpen={this.state.isAreYouSureModalOpened} onClosed={() => { this.setStatePure({ isAreYouSureModalOpened: false }) }} /> : null}
        {this.state.isActionButtonVisible && this.props.computedMaster ? <SideButton
          buttonColor={ColorList.transparent}
          position={"right"}
          //text={"+"}
          buttonTextStyle={{ color: ColorList.transparent }}
          renderIcon={() => {
            return this.plusButton()
          }}

        /> : null}
      </View>
    </ImageBackground>
  }
  renderBody() {
    return this.renderPosts()
  }
  render() {
    return this.renderBody()
  }


}
export default EventDetailView

