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
import InvitationModal from './InvitationModal';

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
      this.props.Event.updated !== nextProps.Event.updated ||
      this.props.Event.id !== nextProps.Event.id
  }
  swipperComponent = null
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isMount: true,
        openInviteModal: false
      })
      stores.Events.isMaster(this.props.Event.id, stores.Session.SessionStore.phone).then(master => {
        this.setState({
          master: master,
        })
      })
    }, 12)
  }
  swipeOutSettings(master) {
    return {
      autoClose: true,
      sensitivity: 100,
      left: [
        {
          component: <SwipeOutView openInvitationModal={() => { this.invite() }} master={master} publish={() => this.publish()}
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
    if (this.props.Event.public || this.state.master) {
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
          Requester.publish(this.props.Event.id).then(() => {
            this.setState({
              public: true,
              publishing: false
            })
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
          Toast.show({
            text: "Cannot Publish This Event, you are not a master",
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
  onCloseSwipeout() {
  }
  render() {
    //emitter.emit('notify', "santerss") 
    return (this.state.isMount ? <View style={{ width: "100%", }}>
      <Swipeout onOpen={() => this.openSwipeOut()} onClose={() => this.onCloseSwipeout()} style={{
        width: "100%",
        backgroundColor: this.props.Event.new ? "#cdfcfc" : null
      }} autoClose={true} close={true}
        {...this.swipeOutSettings(this.state.master)}>
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
                  <Spinner size={"small"} color="#7DD2D2"></Spinner></View> : <Icon
                    name="megaphone"
                    type="Entypo"
                    style={{
                      fontSize: 16,
                      color: "#0A4E52"
                    }}
                  />}
                <MenuListView hide={this.state.hide} event_id={this.props.Event.id} published publish={() => this.publish()}
                  showPublishers={() => this.showPublishersList()}
                />
              </View> : null}

            </Left>
            {this.props.Event.updated ? <UpdateStateIndicator /> : null}
            <Right>
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
            </Right>
          </CardItem>
          <CardItem
            style={{
              paddingBottom: 10,
              paddingTop: 10
            }}
          >
            <Left>
              <View style={{ flexDirection: "row", flex: 5 }}>
                <ProfileView joined={() => this.join()} showPhoto={(url) => this.props.showPhoto(url)} hasJoin={this.props.Event.joint || this.state.joint}
                  onOpen={() => this.onOpenDetaiProfileModal()} phone={(this.props.Event.creator_phone)}></ProfileView>
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
              {this.state.isMount ? <PhotoView showPhoto={(url) => this.props.showPhoto(url)} joined={() => this.join()} isToBeJoint hasJoin={this.props.Event.joint || this.state.joint} onOpen={() => this.onOpenPhotoModal()} style={{
                width: "70%",
                marginLeft: "4%"
              }} photo={this.props.Event.background} width={170} height={125} borderRadius={10} /> : null}
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
                <Like id={this.props.Event.id} end={() => this.markAsSeen()} />
              </View> : null}
            </Left>
            <Right>
              {this.state.isMount ? <Join event={this.props.Event}></Join> : null}
            </Right>
          </Footer>
        </Card>
        <InvitationModal public={this.props.Event.public} master={this.props.master} eventID={this.props.Event.id} isOpen={this.state.openInviteModal}
          close={() => this.setState({ openInviteModal: false })}></InvitationModal>
      </Swipeout>
    </View> : <Card style={{ height: 390 }}>
      </Card>)
  }
}
export default PublicEvent
