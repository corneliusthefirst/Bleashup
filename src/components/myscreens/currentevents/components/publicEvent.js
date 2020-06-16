import React, { Component } from "react";
import { View, Vibration, TouchableWithoutFeedback, TouchableOpacity, Dimensions } from 'react-native';
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
  Thumbnail,
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
import { findIndex, isEqual, find } from "lodash"
import InvitationModal from './InvitationModal';
import ProfileSimple from './ProfileViewSimple';
import shadower from "../../../shadower";
import colorList from "../../../colorList";
import CacheImages from "../../../CacheImages";
import PhotoViewer from "../../event/PhotoViewer"
import ActivityProfile from "./ActivityProfile";
import GlobalFunctions from '../../../globalFunctions';
import {MenuDivider } from 'react-native-material-menu';
import BeNavigator from '../../../../services/navigationServices';
import RelationProfile from '../../../RelationProfile';

let globalFunctions =  GlobalFunctions;
let { height, width } = Dimensions.get('window');
class PublicEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMount: false,
      joint:true,
      swipeClosed: true,
      master: false,
    };
  }

  /*shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.state.isMount !== nextState.isMount ||
      !isEqual(this.props.Event, nextProps.Event) || 
      this.props.Event.background !== nextProps.Event.background ||
      this.state.fresh !== nextState.fresh
  }*/
  swipperComponent = null
  componentDidMount() { 
      setTimeout(() => {
        this.setState({
          isMount: true,
        })
      }, this.props.renderDelay)
  }
  counter = 0

  invite() {
    stores.Events.isMaster(this.props.Event.id, stores.LoginStore.user.phone).then(mas => {
    this.props.quickInvite({ event: this.props.Event, master: mas })
    })
  }

  publish() {
    if (this.props.Event.public) {
      Requester.publish(this.props.Event.id).then(() => {
        this.setState({
          publishing: false,
          public: true
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
    if (findIndex(this.props.Event.participant, { phone: stores.LoginStore.user.phone }) < 0) {
      if (this.props.Event.new) {
        stores.Events.markAsSeen(this.props.Event.id).then(() => {
        })
      }
      this.setState({
        isJoining: true
      })
      Requester.join(this.props.Event.id, this.props.Event.event_host, this.props.Event.participant).then((status) => {
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
  renderMap() {
    return this.state.isMount && this.props.Event.location.string ?
      <View style={{ alignSelf: 'center', }}><MapView card
        location={this.props.Event.location.string}></MapView></View> : null
  }
  renderprofile() {
    return <RelationProfile Event={this.props.Event} />;
  }

  renderTitle() {
    return (<View style={{ marginBottom: '2%', 
    backgroundColor: colorList.bodyBackground, 
    width: "100%",
    flexDirection: 'row', }}>
      <View style={{ flexDirection: 'row', width: '100%', alignItems: "center",marginLeft: "2%", }}>
        <View style={{ width: '90%'}}>
          <ActivityProfile
            join={this.join.bind(this)}
            showPhoto={this.props.showPhoto}
            openDetails={this.props.openDetails}
            markAsSeen={this.markAsSeen.bind(this)}
            Event={this.props.Event||{}}
            ></ActivityProfile>
        </View>
      </View>
    </View>
    )
  }

  renderBody() {
    return (<View
      style={{
        paddingTop: 4,
        paddingBottom: 6,
        flexDirection: 'row',
        backgroundColor: colorList.bodyBackground,
        width: "100%",
        height: 200
      }}
    >
    </View>)
  }

  renderMarkAsSeen() {
    return null
  }
  render() {
    return (this.state.isMount ? <View style={{
      backgroundColor: colorList.bodyBackground,
      width: colorList.containerWidth, alignSelf: "center"
    }}>
        <View
          style={{
            backgroundColor: colorList.bodyBackground,
            width: "100%",
            alignSelf: 'center',
          }}
          bordered
        >
          {this.renderTitle()}
        </View>
        <MenuDivider></MenuDivider>
    </View> : <View style={{}}><View style={{
      height: 120, 
      alignSelf: 'center', 
      backgroundColor: colorList.bodyBackground,
      width: "100%"
    }}></View></View>
    )
  }
}
export default PublicEvent


/* {this.renderMap()} */