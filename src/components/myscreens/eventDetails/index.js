/* eslint-disable no-shadow */
/* eslint-disable semi */
/* eslint-disable react/no-string-refs */
/* eslint-disable comma-dangle */
/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, ScrollView, Dimensions } from 'react-native';
import stores from '../../../stores/index';
//import { observer } from 'mobx-react'
import { find, findIndex, reject, } from "lodash";
import request from "../../../services/requestObjects";
import EventHighlights from "../event/createEvent/components/EventHighlights";
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
import ShareWithYourContacts from "../eventChat/ShareWithYourContacts";
import messagePreparer from '../eventChat/messagePreparer';

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
  }
  scrolled = 0
  initializer() {
    let participant = find(this.props.Event.participant, { phone: stores.LoginStore.user.phone });
    this.animateUI()
    this.setStatePure({
      newing: !this.state.newing,
      isMounted: true,
      EventHighlightState: this.props.star ? true : false,
      participant: participant
    });
    if ((!stores.Highlights.highlights[this.props.Event.id] ||
      stores.Highlights.highlights[this.props.Event.id].length <= 1)) {
      stores.Highlights.fetchHighlights(this.props.Event.id).then(() => {

      })
    }
    if (this.props.id) this.waitToScroll = setTimeout(() => {
      let arr = stores.Highlights.highlights[this.props.Event.id].
        filter(el => globalFunctions.filterStars(el, this.state.searchString || ""))
      let scrollIndex = findIndex(arr, { id: this.props.id })
      if (scrollIndex >= 0)
        this.refs.postList && this.refs.postList.scrollToIndex(scrollIndex)

    }, 100)
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
    this.initializer();
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
    this.props.computedMaster ? this.setStatePure({ EventHighlightState: true }) :
      Toaster({ text: Texts.not_enough_previledges_to_perform_action, duration: 4000 })
  }
  mention(replyer) {
    this.props.mention(replyer)
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
    this.setStatePure({
      EventHighlightState: true,
      update: true,
      highlight_id: hid
    })
  }
  share() {
    this.setStatePure({
      isSharing: true
    })
  }
  action = () => [
    {
      title: 'Reply',
      callback: () => this.mention(this.state.selectedItem),
      iconName: Texts.reply,
      condition: () => true,
      iconType: "Entypo",
      color: colorList.replyColor
    },
    {
      title: 'Share',
      callback: () => this.share(this.state.selectedItem),
      iconName: "forward",
      condition: () => true,
      iconType: "Entypo",
      color: colorList.replyColor
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
  renderPosts() {
    let data = (stores.Highlights.highlights[this.props.Event.id] || []).
      filter((ele) => globalFunctions.filterStars(ele, this.state.searchString || ""));
    return (!this.state.isMounted ? <View style={{
      height: colorList.containerHeight,
      backgroundColor: colorList.bodyBackground,
      width: '100%'
    }}></View> :
      <View style={{ flex: 1, width: "100%" }}>
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
            marginRight: '3%',
            backgroundColor: colorList.headerBackground,
            flexDirection: "row",
            alignItems: "center",
          }}>
            <TouchableOpacity onPress={() => requestAnimationFrame(this.props.goback)} style={{ width: "10%", paddingLeft: "3%" }} >
              <MaterialIcons
                style={{ ...GState.defaultIconSize, color: colorList.headerIcon, }} type={"MaterialIcons"}
                name={"arrow-back"} />
            </TouchableOpacity>

            {!this.state.searching ? <View style={{ width: '69%', justifyContent: "center" }}>
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
              width: this.state.searching ? "90%" : 35,
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



        <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <View style={{ minHeight: colorList.containerHeight - colorList.headerHeight, flexDirection: "column", width: "100%", justifyContent: 'center', }} >
            <View style={{
              height: colorList.containerHeight - colorList.headerHeight,
              width: "100%", alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }} >

              <BleashupFlatList
                initialRender={9}
                onScroll={this.onScroll}
                ref={"postList"}
                horizontal={false}
                renderPerBatch={10}
                firstIndex={0}
                getItemLayout={(item, index) => GState.getItemLayout(item, index, data, 70, 0)}
                refHorizontal={(ref) => { this.detail_flatlistRef = ref }}
                keyExtractor={this._keyExtractor}
                dataSource={data}
                numberOfItems={data.length}
                parentComponent={this}
                renderItem={(item, index) => {
                  this.delay = index >= 5 ? 0 : this.delay + 1
                  return (<HighlightCard
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
                    parentComponent={this}
                    item={item}
                  />
                  );
                }}
              >
              </BleashupFlatList>
            </View>


          </View>

        </ScrollView>

        <EventHighlights
          isRelation={this.props.isRelation}
          closeTeporary={() => {
            this.setStatePure({
              EventHighlightState: false,
            })
            this.closeTeporary = setTimeout(() => {
              this.setStatePure({
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
          }}
          star={this.props.star}
          isOpen={this.state.EventHighlightState}
          onClosed={(staring) => {
            this.setStatePure({
              EventHighlightState: false,
              update: false,
              highlight_id: null
            })
          }}
          update={(newHighlight) => this.updateHighlight(newHighlight)}
          participant={this.state.participant}
          parentComponent={this}
          ref={"highlights"}
          event={this.props.Event}
          event_id={this.props.Event.id} />

        <MessageActions title={"star actions"} actions={this.action} onClosed={() => {
          this.setStatePure({
            showActions: false
          })
        }} isOpen={this.state.showActions}></MessageActions>
        <BleashupAlert
          title={Texts.delete_highlight}
          accept={Texts.yes} refuse={Texts.no}
          message={Texts.are_you_sure_to_delete_this_highlight}
          deleteFunction={() => this.deleteHighlight(this.state.current_highlight)}
          isOpen={this.state.isAreYouSureModalOpened} onClosed={() => { this.setStatePure({ isAreYouSureModalOpened: false }) }} />

        <ShareWithYourContacts
          isOpen={this.state.isSharing}
          activity_id={this.props.Event.id}
          sender={request.Message().sender}
          committee_id={this.props.Event.id}
          message={{
            ...messagePreparer.formMessagefromStar(this.state.selectedItem),
            forwarded: true,
            reply: null,
            from_activity: this.props.Event.id,
            from_committee: this.props.Event.id,
            from: null
          }}
          onClosed={this.hideSharing.bind(this)}
        >
        </ShareWithYourContacts>
        {!this.props.isRelation && this.state.isActionButtonVisible ? <SideButton
          buttonColor={colorList.bodyBackground}
          position={"right"}
          //text={"D"}
          renderIcon={() => {
            return <TouchableOpacity
              onPress={() => requestAnimationFrame(this.props.showDescription)}
              style={{
                ...rounder(50, ColorList.bodyBackground),
                ...shadower(4)
              }}>
              <Feather name="file-text" type="Feather" style={{
                ...GState.defaultIconSize,
                color: ColorList.bodyIcon
              }} />
            </TouchableOpacity>
          }}
          offsetY={30}
        /> : null}

        {this.state.isActionButtonVisible ? <SideButton
          buttonColor={ColorList.transparent}
          position={"right"}
          //text={"+"}
          buttonTextStyle={{ color: ColorList.transparent }}
          renderIcon={() => {
            return <TouchableOpacity
              onPress={() => requestAnimationFrame(() => this.newHighlight())}
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
          }}
          offsetY={90}

        /> : null}



      </View>
    )
  }
  renderBody() {
    return this.renderPosts()
  }
  render() {
    return this.renderBody()
  }


}
export default EventDetailView

