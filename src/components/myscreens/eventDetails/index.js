/* eslint-disable no-shadow */
/* eslint-disable semi */
/* eslint-disable react/no-string-refs */
/* eslint-disable comma-dangle */
/* eslint-disable prettier/prettier */
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
import ColorList from "../../colorList";
import DescriptionModal from './descriptionModal';
import Drawer from '../../draggableView';
import SideButton from '../../sideButton';
import Share from '../../../stores/share';
import BeNavigator from '../../../services/navigationServices';
import ShareFrame from "../../mainComponents/ShareFram";
import AnimatedComponent from '../../AnimatedComponent';
import MessageActions from '../eventChat/MessageActons';
import Vibrator from '../../../services/Vibrator';
import GState from '../../../stores/globalState/index';

let { height, width } = Dimensions.get('window');

//@observer
export default class EventDetailView extends AnimatedComponent {
  initialize(){
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
      newing: false,
    }
  }
  state = {

  }
  scrolled = 0
  @autobind
  initializer() {
    let participant = find(this.props.Event.participant, { phone: stores.LoginStore.user.phone });
    this.animateUI()
    this.setStatePure({
      newing: !this.state.newing,
      isMounted: true,
      EventHighlightState:this.props.star?true:false,
      participant: participant
    });
   if(this.props.id) this.waitToScroll =  setTimeout(() => {
    this.scrolling = setInterval(() => {
      this.refs.postList && this.refs.postList.scrollToIndex(findIndex(stores.Highlights.highlights[this.props.Event.id], { id: this.props.id }))
       this.scrolled = this.scrolled + 1
       if(this.scrolled >= 5) clearInterval(this.scrolling) 
     },500)
     clearTimeout(this.waitToScroll)
    },1000)
  }
  initialScrollIndexer = 2
  incrementer = 2
  interval = 4000
  handleRefresh() {
    //console.warn('receiving refresh highlights message')
    this.setStatePure({
      newing: !this.state.newing
    })
  }
  componentMounting() {
    emitter.on(`refresh-highlights_${this.props.Event.id}`, this.handleRefresh.bind(this))
  }
  unmountingComponent() {
    emitter.off(`refresh-highlights_${this.props.Event.id}`)
    clearInterval(this.scrolling)
    clearTimeout(this.waitToScroll)
    clearTimeout(this.closeTeporary)
  }
  componentDidMount() {
    this.initializer();
  }
  initShare() {
    this.sharStore = new Share(this.props.share.id)
    this.sharStore.readFromStore().then(() => {
      this.setStatePure({
        isMounted: true
      })
    })
    stores.Highlights.loadHighlightFromRemote(this.props.Event.id, this.props.share.item_id).
      then((post) => {
        stores.Events.loadCurrentEventFromRemote(this.props.share.event_id, true).
          then((event) => {
            this.sharStore.saveCurrentState({ ...this.props.share, post: Array.isArray(post) && post[0] || post, event }).then(() => {
              this.setStatePure({
                isMountedSec: true
              })
            })
          })
      }).catch((error) => {
        console.warn("ERROR: ", error)
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
    this.init()
    this.sendUpdateHighlight()
  }




  @autobind
  back() {
    this.setStatePure({ animateHighlight: false })
    //add backward navigation to calling page
  }

  @autobind
  deleteHighlight(item) {
    if (!this.props.working) {
      this.props.startLoader()
      this.setStatePure({ isAreYouSureModalOpened: false });
      //console.warn("deleting....")
      //remove the higlight id from event then remove the highlight from the higlights store
      if (item.event_id == "newEventId") {
        //console.warn("inside if....")
        //console.warn(this.props.item.id);
        stores.Events.removeHighlight(item.event_id, item.id, false).then(() => {
          stores.Highlights.removeHighlight(this.props.Event.id, item.id).then(() => {
            this.state.highlightData = reject(this.state.highlightData, { id: item.id });
            this.setStatePure({ highlightData: this.state.highlightData });
            this.props.stopLoader()
          });
        });
        //console.warn("inside if 2....");
      } else {
        Requester.deleteHighlight(item.id, item.event_id).then(() => {
          this.props.stopLoader()
          this.state.highlightData = reject(this.state.highlightData, { id: item.id });
          this.setStatePure({ highlightData: this.state.highlightData });
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
  _keyExtractor = (item, index) => {
    return index;
  }

  updateHighlight(newHighlight, previousHighlight) {
    console.warn('entered update h', newHighlight, previousHighlight);
    if (!this.props.working) {
      this.props.startLoader();
      Requester.applyAllHighlightsUpdate(newHighlight, previousHighlight).then((response) => {
        if (response) {
          let index = findIndex(this.state.highlightData, { id: newHighlight.id })
          console.warn('here again', index, newHighlight);
          console.warn('here again 1', this.state.highlightData);
          this.state.highlightData[index] = newHighlight;
          this.setStatePure({
            highlightData: this.state.highlightData
          })
        }
        console.warn('ok');
        this.props.stopLoader();
        this.setStatePure({
          update: false
        })
        this.sendUpdateHighlight()
      })
    } else {
      Toast.show({ text: 'App is Busy' })
    }
  }
  sendUpdateHighlight() {
    //emitter.emit(`refresh-highlights_${this.props.Event.id}`)
  }
  @autobind
  newHighlight() {
    this.props.computedMaster ? this.setStatePure({ EventHighlightState: true }) :
      Toast.show({ text: "you don't have enough priviledges to add a post", duration: 4000 })
  }
  deleteHighlightHighlight(highlights) {

  }
  mention(replyer) {
    this.props.mention(replyer)
  }
  showCreator() {
    this.state.creatorInfo ? this.setStatePure({
      showProfileModal: true,
      profile: this.state.creatorInfo
    }) : null
  }
  relationPost(id) {
    //BeNavigator.navigateTo("HighLightsDetails", { event_id: id })
    return null;
  }
  delay = 1
  sorter = (a, b) => (a.created_at > b.created_at ? -1 :
    a.created_at < b.created_at ? 1 : 0)
showActions(item){
  Vibrator.vibrateShort()
  this.setStatePure({
    selectedItem:item,
    showActions:true
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
action = () => [
   {
    title: 'Reply',
    callback: () => this.mention(this.state.selectedItem),
    iconName: "reply",
    condition: () => true,
    iconType: "Entypo",
    color: colorList.replyColor
  },
  {
    title: "update Star",
    condition: () => this.props.master,
    callback: () => this.preUpdate(this.state.selectedItem.id),
    iconName: "history",
    iconType: "MaterialIcons",
    color: colorList.darkGrayText
  },
  {
    title: "Delete Delete",
    callback: () => this.preDeleteHighlight(this.state.selectedItem),
    condition: () => this.props.master,
    iconName: "delete-forever",
    iconType: "MaterialCommunityIcons",
    color: colorList.delete
  }
]
  renderPosts() {
    let data = stores.Highlights.highlights[this.props.Event.id];
    return (!this.state.isMounted ? <View style={{
      height: colorList.containerHeight,
      backgroundColor: colorList.bodyBackground,
      width: '100%'
    }}></View> :
      <View style={{ flex: 1, width: "100%" }}>

        <View style={{ flexDirection: "row", ...bleashupHeaderStyle, height: colorList.headerHeight, width: colorList.headerWidth, backgroundColor: colorList.headerBackground }}>

          <View style={{
            flex: 1,
            paddingLeft: '1%', paddingRight: '1%', backgroundColor: colorList.headerBackground,
            flexDirection: "row", alignItems: "center",
          }}>
            <TouchableOpacity onPress={() => requestAnimationFrame(this.props.goback)} style={{ width: "10%", paddingLeft: "3%" }} >
              <Icon
                style={{ color: colorList.headerIcon, }} type={"MaterialIcons"} name={"arrow-back"}></Icon>
            </TouchableOpacity>

            <View style={{ width: '69%', paddingLeft: '9%', justifyContent: "center" }}>
              <Title style={{ color: colorList.headerText, fontWeight: 'bold', alignSelf: 'flex-start', fontSize: colorList.headerFontSize }}>{"Star Messages"}</Title>
            </View>
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
                initialRender={4}
                ref={"postList"}
                horizontal={false}
                renderPerBatch={5}
                firstIndex={0}
                getItemLayout={(item,index) => GState.getItemLayout(item,index,data)}
                refHorizontal={(ref) => { this.detail_flatlistRef = ref }}
                keyExtractor={this._keyExtractor}
                dataSource={data}
                numberOfItems={data.length}
                parentComponent={this}
                renderItem={(item, index) => {
                  this.delay = index >= 5 ? 0 : this.delay + 1
                  return (item.id === request.Highlight().id ? null:
                    <HighlightCard
                      onLayout={(layout) => {
                        GState.itemDebounce(item,() => {
                          stores.Highlights.persistDimenssion(index,item.event_id,layout)
                        })
                      }}
                      showActions={() => this.showActions(item)}
                      height={colorList.containerHeight * .45}
                      phone={stores.LoginStore.user.phone}
                      activity_id={this.props.Event.id}
                      activity_name={this.props.Event.about.title}
                      delay={this.delay}
                      computedMaster={this.props.computedMaster}
                      showItem={(item) => {
                        this.props.showHighlight(item)
                      }}
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
              highlight_id: null
            })
            staring && this.props.goback()
          }}
          update={(newHighlight, previousHighlight) => this.updateHighlight(newHighlight, previousHighlight)}
          participant={this.state.participant}
          parentComponent={this}
          ref={"highlights"}
          event={this.props.Event}
          event_id={this.props.Event.id} />

        {/*
        <DescriptionModal Event={this.props.Event} isOpen={this.state.viewdetail} onClosed={() => { this.setStatePure({ viewdetail: false }) }} parent={this}></DescriptionModal>

        <EventDescription updateDesc={(newDesc) => {
          this.props.updateDesc(newDesc)
        }} event={this.props.Event || {}} isOpen={this.state.EventDescriptionState} onClosed={() => { this.setStatePure({ EventDescriptionState: false }) }}
          ref={"description_ref"} eventId={this.props.Event.id} updateDes={true} parentComp={this} />

        <EventLocation updateLocation={(newLoc) => {
          this.props.updateLocation(newLoc)
        }} event={this.props.Event} isOpen={this.state.EventLocationState} onClosed={() => { this.setStatePure({ EventLocationState: false }) }}
          ref={"location_ref"} updateLoc={true} eventId={this.props.Event.id} parentComp={this} />
      */}

        <MessageActions title={"star actions"} actions={this.action} onClosed={() => {
          this.setStatePure({
            showActions:false
          })
        }} isOpen={this.state.showActions}></MessageActions>
        <BleashupAlert title={"Delete Higlight"} accept={"Yes"} refuse={"No"} message={" Are you sure you want to delete these highlight ?"}
          deleteFunction={() => this.deleteHighlight(this.state.current_highlight)}
          isOpen={this.state.isAreYouSureModalOpened} onClosed={() => { this.setStatePure({ isAreYouSureModalOpened: false }) }} />


        {/*<SideButton
          buttonColor={'rgba(52, 52, 52, 0.8)'}
          position={"right"}
          //text={"D"}
          renderIcon={() => {
            return <View style={{ backgroundColor: ColorList.bodyBackground, height: 40, width: 40, borderRadius: 30, justifyContent: "center", alignItems: "center", ...shadower(4) }}>
              <Icon name="file-text" type="Feather" style={{ color: ColorList.bodyIcon, fontSize: 22 }} />
            </View>
          }}
          action={() => requestAnimationFrame(() => { this.setStatePure({ viewdetail: true })})}
          //buttonTextStyle={{color:colorList.bodyBackground}}
          offsetX={10}
          size={40}
          offsetY={30}
        />*/}

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
  }
  renderSharedPost() {
    return this.state.isMounted && <ShareFrame
      share={this.sharStore.share}
      sharer={this.sharStore.share.sharer}
      date={this.sharStore.share.date}
      content={() => <View style={{ width: '98%', height: 300 }}><HighlightCard
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
          || { phone: stores.LoginStore.user.phone, master: false }}
      ></HighlightCard></View>}
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

