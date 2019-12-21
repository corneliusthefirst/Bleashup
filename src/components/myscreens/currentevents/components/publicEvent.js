import React, { Component } from "react";
import { View, Vibration, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

import {
  Card,
  CardItem,
  Text,
  Icon,
  Left,
  Right,
  Footer,
  List,
  ListItem,
  Label,
  Spinner,
  Toast,
  Button
} from 'native-base';
import autobind from "autobind-decorator";
import UpdateStateIndicator from "./updateStateIndicator";
import stores from "../../../../stores";
import OptionList from "./OptionList"
import ProfileView from "../../invitations/components/ProfileView";
import PublishersView from "./PublishersView"
import PhotoView from "./PhotoView";
import MapView from "./MapView";
import Requester from "../Requester";
import { observer } from "mobx-react";
import Like from "./Like";
import Join from "./Join";
import Options from "./Options";
import TitleView from "./TitleView";
import SwipeOutView from "./SwipeOutView";
import emitter from "../../../../services/eventEmiter";
import Swipeout from '../../../SwipeOut';
import { findIndex, isEqual } from "lodash"
import InvitationModal from './InvitationModal';
import ProfileSimple from './ProfileViewSimple';

class PublicEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      isMount: false,
      isMounting: true,
      public: false,
      notPressing: false,
      publishing: false,
      image: this.props.Event.background,
      //event: this.props.Event,
      swipeClosed: true,
      attempt_to_puplish: false,
      public: false,
      liking: false,
      participant: false,
      master: false,
      hiding: false,
      openInviteModal: false,
      deleting: false,
      swipeOutSettings: null,
      hiden: false,
      joint: false,
      unliking: false,
      liked: false,
      likeIncrelment: 0,
      isPublisherModalOpened: false,
      currentUser: undefined
    };
  }
  state = {
    master: true
  }
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.state.isMount !== nextState.isMount ||
      nextState.joint !== this.state.joint ||
      nextState.openInviteModal !== this.state.openInviteModal ||
      this.props.Event.joint !== nextProps.Event.joint ||
      this.state.image !== nextState.image ||
      this.state.master !== nextState.master ||
      !isEqual(this.props.Event, nextProps.Event) ||
      this.state.fresh !== nextState.fresh
  }
  swipperComponent = null
  componentDidMount() {
    setTimeout(() => {
      stores.TemporalUsersStore.getUser(this.props.Event.creator_phone).then(creator => {
        stores.Events.isMaster(this.props.Event.id, stores.Session.SessionStore.phone).then(master => {
          this.setState({
            master: master,
            joint: findIndex(this.props.Event.participant, { phone: stores.LoginStore.user.phone }) > 0 ? true : false,
            creator: creator,
            isMount: true
          })
          stores.Highlights.fetchHighlightsFromRemote(this.props.Event.id).then(highlights => {
            if (highlights.length > 0) {
              setTimeout(() => {
                this.interval = setInterval(() => {
                  let highlight = highlights[this.counter]
                  if (highlight && highlight.url) {
                    this.setState({
                      image: highlight.url.photo,
                      video: highlight.url.video ? true : false,
                      audio: highlight.url.audio ? true : false
                    })
                    this.counter = this.counter + 1
                  } else {
                    this.setState({
                      image: this.props.Event.background,
                      video: false
                    })
                    this.counter = 0
                  }
                }, 2000 + this.props.renderDelay)
              }
          ,this.props.renderDelay)
            }
          })
        })
      })
    }, this.props.renderDelay + 20)
  }
  counter = 0
  swipeOutSettings(master, joint) {
    return {
      //autoClose: true,
      sensitivity: 100,
      left: [
        {
          component: <SwipeOutView
            openInvitationModal={() => { this.invite() }}
            master={master}
            publish={() => this.publish()}
            joint={joint}
            seen={() => this.markAsSeen()} delete={() => this.delete()
            }
            join={() => this.join()}
            hide={() => this.hide()} {...this.props} ></SwipeOutView >,
          //autoClose: true,
          backgroundColor: "transparent",
        }
      ],
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }


  showPublishersList() {
    this.setState({
      isPublisherModalOpened: true,
      hide: true
    })
    this.markAsSeen()
  }

  invite() {
    this.props.quickInvite({ event: this.props.Event, master: this.state.master })
  }

  publish() {
    if (this.props.Event.public) {
      Requester.publish(this.props.Event.id).then(() => {
        this.setState({
          publishing: false,
          public: true
        })
        Toast.show({ type: "success", text: "successfully published to your contacts", buttonText: "ok" })
      }).catch(error => {
        this.setState({
          publishing: false
        })
        Toast.show({
          text: 'unable to connect to the server ',
          buttonText: 'Okay'
        })
      })
    } else {
      stores.Events.isMaster(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
        if (status) {
          Toast.show({ text: "Please First Configure This Activity As Public In The Settings", duration: 5000 })
        } else {
          Toast.show({
            text: "This Activity Is Not Yet Public",
            buttonText: "OK"
          })
        }
      })
    }
    this.markAsSeen()
  }
  markAsSeen() {
    setTimeout(() => {
      if (this.props.Event.new) {
        stores.Events.markAsSeen(this.props.Event.id).then(() => {
        })
      }
    }, 150)
  }
  onOpenPhotoModal() {
    //  this.markAsSeen()
  }
  onOpenDetaiProfileModal() {
    this.markAsSeen()
  }
  delete() {
    this.setState({
      deleting: true
    })
    Requester.delete(this.props.Event.id).then(() => {
      this.setState({
        deleting: false,
        hiden: true
      })
    })
    this.markAsSeen()
  }
  hide() {
    if (this.props.Event.new) {
      stores.Events.markAsSeen(this.props.Event.id).then(() => {
      })
    }
    this.setState({
      hiding: true
    })
    Requester.hide(this.props.Event.id).then(() => {
      this.setState({
        hiden: true,
        hiding: false
      })
    })
  }
  join() {
    if (!this.props.Event.joint) {
      if (this.props.Event.new) {
        stores.Events.markAsSeen(this.props.Event.id).then(() => {
        })
      }
      this.setState({
        isJoining: true
      })
      Requester.join(this.props.Event.id, this.props.Event.event_host).then((status) => {
        Toast.show({ text: "Event Successfully Joint !", type: "success", buttonText: "ok" })
        this.setState({
          joint: true
        })
        emitter.emit(`left_${this.props.Event.id}`)
      }).catch((error) => {
        this.setState({ isJoining: false })
        Toast.show({
          text: 'unable to connect to the server ',
          buttonText: 'Okay'
        })
      })
    } else {
      Toast.show({ text: "Joint Already !", buttonText: "ok" })
    }
  }
  duration = 10
  openSwipeOut() {
    if (this.state.notPressing) {
      Vibration.vibrate(this.duration)
      clearTimeout(this.timeOut)
      this.setState({ notPressing: false })
    } else {
      this.setState({
        notPressing: true
      })
      this.timeOut = setTimeout(() => {
        this.setState({
          notPressing: false
        })
      }, 500)
    }

  }
  refreshJoint() {
    console.warn("refreshing joint")
    this.setState({
      fresh: true,
      isMount: false
    })
    setTimeout(() => {
      this.setState({
        fresh: false,
        isMount: true
      })
    }, 100)
  }
  onCloseSwipeout() {
  }
  showPhoto(url) {
    url === this.props.Event.background && !this.state.audio ? this.props.showPhoto(url) : 
      this.props.navigation.navigate("HighLightsDetails", { event_id: this.props.Event.id })
  }
  render() {
    //emitter.emit('notify', "santerss") 
    return (this.state.isMount ? <View style={{ width: "100%", }}>
      <Swipeout {...this.props} onOpen={() => this.openSwipeOut()} onClose={() => this.onCloseSwipeout()} style={{
        width: "100%",
        backgroundColor: this.props.Event.new ? "#cdfcfc" : null
      }}
        autoClose={true}
        //close={true}
        {...this.swipeOutSettings(this.state.master, this.state.joint)}>
        <Card
          style={{
            borderColor: "#1FABAB",
          }
          }
          bordered
        >
          <CardItem
            style={{
              paddingBottom: 1,
              paddingTop: 1,
              borderRadius: 5
            }}
          >
            <Left>
              <View style={{ flexDirection: "row", }}>
                <ProfileSimple showPhoto={(url) =>
                  this.props.showPhoto(url)}
                  profile={(this.state.creator)}></ProfileSimple>
              </View>
            </Left>
            <Right>
              <Button onPress={() => this.props.showActions(this.props.Event.id)} transparent>
                <Icon type="Entypo" style={{ fontSize: 24, }} name="dots-three-vertical"></Icon>
              </Button>
            </Right>
          </CardItem>
          <CardItem style={{
            marginLeft: "4%",
          }}>
            {this.state.isMount ? <TitleView openDetail={() => this.props.openDetails(this.props.Event)} join={() => this.join()} joint={this.state.joint} seen={() => this.markAsSeen()}
              {...this.props}></TitleView> : null}
          </CardItem>
          <CardItem
            style={{
              paddingLeft: 0,
              aspectRatio: 3 / 1,
              paddingRight: 0,
              paddingTop: 4,
              paddingBottom: 6
            }}
            cardBody
          >
            <Left>
              {this.state.isMount ? <View><PhotoView showPhoto={(url) => url ?
                this.showPhoto(url) : null} joined={() => this.join()}
                isToBeJoint hasJoin={this.props.Event.joint || this.state.joint} onOpen={() => this.onOpenPhotoModal()} style={{
                  width: "70%",
                  marginLeft: "4%"
                }} photo={this.state.image} width={170} height={100} borderRadius={6} />
                {this.state.video || this.state.audio ? <Icon onPress={() =>{
                  this.showPhoto(this.state.image)
                }} name={this.state.video ? "play" : "headset"} style={{
                  fontSize: 50, color: '#1FABAB',
                  position: 'absolute', marginTop: '18%', marginLeft: '37%',
                }} type={this.state.video ? "EvilIcons" : "MaterialIcons"}>
                </Icon> : null}</View> : null}
            </Left>
            <Right >
              {this.state.isMount ? <MapView style={{ marginRight: "11%" }}
                location={this.props.Event.location.string}></MapView> : null}
            </Right>
          </CardItem>
          <CardItem>
            {this.state.isMount ? <Options seen={() => this.markAsSeen()} {...this.props}></Options> : null}
          </CardItem>
          <Footer>
            <Left>
              {this.state.isMount ? <View style={{ flexDirection: "row" }}>
                <Like showLikers={(likers) => this.props.showLikers(likers)} id={this.props.Event.id} end={() => this.markAsSeen()} />
              </View> : null}
            </Left>
            <Right>
              {this.state.isMount && !this.state.fresh ? <Join event={this.props.Event} refreshJoint={() => this.refreshJoint()}></Join> : null}
            </Right>
          </Footer>
        </Card>
      </Swipeout>
    </View> : <Card style={{ height: 320 }}>
      </Card>)
  }
}
export default PublicEvent
