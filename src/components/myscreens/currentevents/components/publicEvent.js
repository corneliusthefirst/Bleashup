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
  Toast
} from "native-base";
import autobind from "autobind-decorator";
import UpdateStateIndicator from "./updateStateIndicator";
import stores from "../../../../stores";
import OptionList from "./OptionList"
import ProfileView from "../../invitations/components/ProfileView";
import MenuListView from "./MenuListView"
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
      event: this.props.Event,
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
      this.props.Event.new !== nextProps.Event.new ||
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
        })
      })
    }, this.props.renderDelay + 20)
  }
  swipeOutSettings(master, joint) {
    return {
      autoClose: true,
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
          autoClose: true,
          backgroundColor: "transparent",
        }
      ],
    }
  }
  componentWillUnmount() {
  }


  showPublishersList() {
    this.setState({
      isPublisherModalOpened: true,
      hide: true
    })
    this.markAsSeen()
  }

  invite() {
    this.setState({
      openInviteModal: true
    })
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
  render() {
    //emitter.emit('notify', "santerss") 
    return (this.state.isMount ? <View style={{ width: "100%", }}>
      <Swipeout {...this.props} onOpen={() => this.openSwipeOut()} onClose={() => this.onCloseSwipeout()} style={{
        width: "100%",
        backgroundColor: this.props.Event.new ? "#cdfcfc" : null
      }} autoClose={true} close={true}
        {...this.swipeOutSettings(this.state.master, this.state.joint)}>
        <Card
          style={{
            borderColor: "#1FABAB",
            border: 100
          }
          }
          bordered
        >
          <CardItem
            style={{
              paddingBottom: 15
            }}
          >
            <Left>
              {this.state.master || this.props.Event.public ? <View>
                {this.state.publishing ? <View style={{ height: 18 }}>
                  <Spinner size={"small"} color="#7DD2D2"></Spinner></View> : null}
                <MenuListView hide={this.state.hide} event_id={this.props.Event.id} published publish={() => this.publish()}
                  showPublishers={() => this.showPublishersList()}
                />
              </View> : null}

            </Left>
            {/*this.props.Event.updated ? <UpdateStateIndicator /> : null*/}
            {/* <Right>
              <View>
                <Icon
                  name="dots-three-vertical"
                  style={{
                    color: "#0A4E52",
                    fontSize: 16
                  }}
                  type="Entypo"
                />
              </View>
                </Right>*/}
          </CardItem>
          <CardItem
            style={{
              paddingBottom: 10,
              paddingTop: 10
            }}
          >
            <Left>
              <View style={{ flexDirection: "row", flex: 5 }}>
                <ProfileSimple joined={() => this.join()} showPhoto={(url) => this.props.showPhoto(url)} hasJoin={this.props.Event.joint || this.state.joint}
                  onOpen={() => this.onOpenDetaiProfileModal()} profile={(this.state.creator)}></ProfileSimple>
              </View>
            </Left>
          </CardItem>
          <CardItem style={{
            justifyContent: "center",
          }}>
            {this.state.isMount ? <TitleView join={() => this.join()} joint={this.state.joint} seen={() => this.markAsSeen()}
              {...this.props}></TitleView> : null}
          </CardItem>
          <CardItem
            style={{
              paddingLeft: 0,
              aspectRatio: 3 / 1,
              paddingRight: 0,
              paddingTop: 20,
              paddingBottom: 10
            }}
            cardBody
          >
            <Left>
              {this.state.isMount ? <PhotoView showPhoto={(url) => url ?
                this.props.showPhoto(url) : null} joined={() => this.join()}
                isToBeJoint hasJoin={this.props.Event.joint || this.state.joint} onOpen={() => this.onOpenPhotoModal()} style={{
                  width: "70%",
                  marginLeft: "4%"
                }} photo={this.props.Event.background} width={170} height={125} borderRadius={6} /> : null}
            </Left>
            <Right >
              {this.state.isMount ? <MapView style={{ marginRight: "11%" }}
                location={this.props.Event.location && (this.props.Event.location.string ||
                  this.props.Event.location.string.length == 0) ? this.props.Event.location.string : this.props.Event.location}></MapView> : null}
            </Right>
          </CardItem>
          <CardItem>
            {this.state.isMount ? <Options seen={() => this.markAsSeen()} {...this.props}></Options> : null}
          </CardItem>
          <Footer>
            <Left>
              {this.state.isMount ? <View style={{ flexDirection: "row" }}>
                <Like id={this.props.Event.id} end={() => this.markAsSeen()} />
              </View> : null}
            </Left>
            <Right>
              {this.state.isMount && !this.state.fresh ? <Join event={this.props.Event} refreshJoint={() => this.refreshJoint()}></Join> : null}
            </Right>
          </Footer>
        </Card>
        <InvitationModal public={this.props.Event.public} master={this.state.master} eventID={this.props.Event.id} isOpen={this.state.openInviteModal}
          close={() => this.setState({ openInviteModal: false })}></InvitationModal>
      </Swipeout>
    </View> : <Card style={{ height: 390 }}>
      </Card>)
  }
}
export default PublicEvent
