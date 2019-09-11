import React, { Component } from "react";
import { View } from "react-native";

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
  Spinner
} from "native-base";
import autobind from "autobind-decorator";
import UpdateStateIndicator from "./updateStateIndicator";
import SvgUri from "react-native-svg-uri";
import SVGs from "./svgsStrings";
import stores from "../../../../stores";
import DetailsModal from "../../../DetailsModal";
import OptionList from "./OptionList"
import ProfileView from "../../invitations/components/ProfileView";
import CacheImages from "../../../CacheImages";
import MenuListView from "./MenuListView"
import Swipeout from 'react-native-swipeout';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient'
import Svg, { Circle, Rect } from 'react-native-svg'
import PhotoView from "./PhotoView";
import MapView from "./MapView";
import SwipeOutView from "./SwipeOutView";
<<<<<<< HEAD
import Requester from "../Requester";
let scaleValue = new Animated.Value(0)
const cardScale = scaleValue.interpolate({
  inputRange: [0, 0.5, 1],
  outputRange: [1, 1.15, 1.2],

})
=======
import emitter from "../../../../services/eventEmiter";
>>>>>>> 63175a4ebac6797f0b37a50f3b055b52ced2e30b

class PublicEvent extends Component {
  constructor(props) {
    super(props);
<<<<<<< HEAD
  }
  state = {
    fetching: true,
    creator: (creator = { name: "", status: "", image: "" }),
    details: [],
    isDetailsModalOpened: false,
    isMount: false,
    swipeClosed: true,
    isjoint: false,
    isPublisherModalOpened: false,
    currentUser: undefined
  };
  @autobind navigateToEventDetails() {
    if (!this.props.Event.joint) {
      this.setState({ isDetailsModalOpened: true })
    } else {
      this.props.navigation.navigate("Event", {
        Event: this.props.Event,
        tab: "EventDetails"
      });
    }
  }
  sampelPublishers = [{
    name: "Fokam Giles",
    status: "One Step Ahead The World",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/GDC_onlywayaround.jpg/300px-GDC_onlywayaround.jpg"

  }, {
    name: "CorneLius Mboupda",
    status: "One Step Ahead The World",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/GDC_onlywayaround.jpg/300px-GDC_onlywayaround.jpg"

  },
  {
    name: "Fokou Soh",
    status: "One Step Ahead The World",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/GDC_onlywayaround.jpg/300px-GDC_onlywayaround.jpg"

  },
  ]

=======
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
>>>>>>> 63175a4ebac6797f0b37a50f3b055b52ced2e30b
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.state.isMount !== nextState.isMount ||
      nextState.joint !== this.state.joint ||
      this.props.Event.joint !== nextProps.Event.joint ||
      this.props.Event.new !== nextProps.Event.new ||
      this.props.Event.updated !== nextProps.Event.updated ||
      this.props.Event.id !== nextProps.Event.id
  }
  swipperComponent = null
  componentDidMount() {
    setTimeout(() => {
      stores.Events.isMaster(this.props.Event.id, stores.Session.SessionStore.phone).then(master => {
        this.setState({
          master: master,
          isMount: true,
          openInviteModal: false
        })
      })
    }, 34)
  }
  swipeOutSettings(master) {
    return {
      autoClose: true,
      sensitivity: 100,
      right: [
        {
          component: <SwipeOutView master={master} publish={() => this.publish()}
            seen={() => this.markAsSeen()} delete={() => this.delete()
            }
            join={() => this.join()}
            hide={() => this.hide()} {...this.props} ></SwipeOutView >
        }
      ],
    }
  }
  componentWillUnmount() {
  }
  swipeSettings = {
    autoClose: true,
    sensitivity: 100,
    right: [
      {
        component: <SwipeOutView></SwipeOutView>
      }
    ],
  }

  showPublishersList() {
    this.setState({
      isPublisherModalOpened: true,
      hide: true
    })
  }

<<<<<<< HEAD
  join() {
=======
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
>>>>>>> 63175a4ebac6797f0b37a50f3b055b52ced2e30b
    this.setState({
      isJoining: true
    })
    this.props.Event.joint = true
    this.setState({
      isDetailsModalOpened: false
    })
    Requester.join(this.props.Event.id, this.props.Event.event_host).then((status) => {
      this.setState({ isJoint: true, isJoining: false });
    })
  }
<<<<<<< HEAD
  indicatorMargin = {
    marginLeft: "5%",
    marginTop: "-7%",
    position: 'absolute',

  };
=======
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
>>>>>>> 63175a4ebac6797f0b37a50f3b055b52ced2e30b

  transparent = "rgba(52, 52, 52, 0.0)";
  svgStyle = {
  }
  blinkerSize = 26;
  render() {
    //emitter.emit('notify', "santerss") 
    return (this.state.isMount ? <View style={{ width: "100%", }}>
      <Swipeout style={{ backgroundColor: this.props.Event.new ? "#cdfcfc" : null }}
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
                <ProfileView joined={() => this.join()} hasJoin={this.props.Event.joint || this.state.joint}
                  onOpen={() => this.onOpenDetaiProfileModal()} phone={(this.props.Event.creator_phone)}></ProfileView>
              </View> : null}
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
              {this.state.isMount ? <PhotoView joined={() => this.join()} isToBeJoint hasJoin={this.props.Event.joint || this.state.joint} onOpen={() => this.onOpenPhotoModal()} style={{
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
      </Swipeout>
    </View> : <Card style={{ height: 390 }}>
      </Card>)
  }
}
export default PublicEvent
