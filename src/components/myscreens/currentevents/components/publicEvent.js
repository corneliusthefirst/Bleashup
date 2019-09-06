import React, { Component } from "react";
import { View} from "react-native";

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
import Swipeout from 'react-native-swipeout';
import PhotoView from "./PhotoView";
import MapView from "./MapView";
import Requester from "../Requester";
import { observer } from "mobx-react";
import Like from "./Like";
import Join from "./Join";
import Options from "./Options";
import TitleView from "./TitleView";
import SwipeOutView from "./SwipeOutView";

class PublicEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      isMount: false,
      isMounting: true,
      public: false,
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
      isjoint: false,
      unliking: false,
      liked: false,
      likeIncrelment: 0,
      isPublisherModalOpened: false,
      currentUser: undefined
    };
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.state.isMount !== nextState.isMount ||
      this.state.openInviteModal !== nextState.openInviteModal ||
      this.state.master !== nextState.master
  }
  swipperComponent = null
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        swipeOutSettings: {
          autoClose: true,
          sensitivity: 100,
          right: [
            {
              component: <SwipeOutView publish={() => this.publish()}
                seen={() => this.markAsSeen()} delete={() => this.delete()}
                join={() => this.join()}
                hide={() => this.hide()} {...this.props} ></SwipeOutView>
            }
          ],
        },
        isMount: true,
        openInviteModal: false
      })
    })
    stores.Events.isMaster(this.props.Event.id, stores.Session.SessionStore.phone).then(master => {
      this.setState({
        master: master,
      })
    })
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
    this.setState({
      publishing: true
    })
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

  render() {
    return <Swipeout style={{ backgroundColor: this.props.Event.new ? "#cdfcfc" : null }}
      {...this.state.swipeOutSettings}>
      <Card
        style={{
          borderColor: "#1FABAB",
          border: 50,
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
            {this.state.isMaster || this.props.Event.public ? <View>
              {this.state.publishing ? <View style={{ height: 18 }}>
                <Spinner size={"small"} color="#7DD2D2"></Spinner></View> : <Icon
                  name="forward"
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
            {this.state.isMount ? <View style={{ flexDirection: "row", flex: 5 }}>
              <ProfileView joined={() => this.join()} hasJoin={this.props.Event.joint}
                onOpen={() => this.onOpenDetaiProfileModal()} phone={(this.props.Event.creator_phone)}></ProfileView>
            </View> : null}
          </Left>
        </CardItem>
        <CardItem style={{
          justifyContent: "center",
        }}>
          {this.state.isMount ? <TitleView seen={() => this.markAsSeen()}
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
            {this.state.isMount ? <PhotoView joined={() => this.join()} isToBeJoint hasJoin={this.props.Event.joint} onOpen={() => this.onOpenPhotoModal()} style={{
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
    </Swipeout >
  }
}
export default PublicEvent
