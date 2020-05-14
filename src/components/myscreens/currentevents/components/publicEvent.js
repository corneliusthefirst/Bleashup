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

let globalFunctions = new GlobalFunctions();
let { height, width } = Dimensions.get('window');
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
      currentUser: undefined,
      opponent: null,
      showPhoto: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.state.isMount !== nextState.isMount ||
      nextState.joint !== this.state.joint ||
      nextState.openInviteModal !== this.state.openInviteModal ||
      this.props.Event.joint !== nextProps.Event.joint ||
      this.state.master !== nextState.master ||
      !isEqual(this.props.Event, nextProps.Event) ||
      this.state.fresh !== nextState.fresh
  }
  swipperComponent = null
  componentDidMount() { 
    //this is done to use as default for my test
    if (this.props.Event.type == "relation") {
      globalFunctions.getOpponent(this.props.Event).then((user)=>{
        this.setState({ opponent: user });
      })

    }
    setTimeout(() => {
      this.setState({
        isMount: true,
      })
    }, this.props.renderDelay + 20)
    setTimeout(() => {
      stores.TemporalUsersStore.getUser(this.props.Event.creator_phone).then(creator => {
        stores.Events.isMaster(this.props.Event.id, stores.LoginStore.user.phone).then(master => {
          this.setState({
            master: master,
            joint: findIndex(this.props.Event.participant, { phone: stores.LoginStore.user.phone }) > 0 ? true : false,
            creator: this.state.creator == null ? creator : this.state.creator,
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
          backgroundColor: colorList.bodyBackground,
        }
      ],
    }
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
  renderMap() {
    return this.state.isMount && this.props.Event.location.string ?
      <View style={{ alignSelf: 'center', }}><MapView card
        location={this.props.Event.location.string}></MapView></View> : null
  }
  renderprofile() {
    return (
      <CardItem
        style={{
          paddingBottom: 1,
          paddingTop: 1,
          borderRadius: 5,
          height: height / 8,
          width: "100%"
        }}
      >
        <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>

          {this.state.opponent ? <View style={{ width: "65%" }}>
            <ProfileSimple showPhoto={(url) =>
              this.props.showPhoto(url)}
              profile={this.state.opponent}
              relation
              style={{height:50,width:50,borderRadius:25}}
              >
            </ProfileSimple>
          </View> : null}

          <View style={{ height: "100%", width: "35%" }}>
            {this.state.isMount ? <Options seen={() => this.markAsSeen()} {...this.props}></Options> : null}
          </View>

        </View>
      </CardItem>);

  }


  renderTitle() {
    return (<CardItem style={{ marginBottom: '3%', backgroundColor: colorList.bodyBackground, width: "100%" }}>

      <View style={{ flexDirection: 'row', width: '100%', alignItems: "center" }}>
        
        <View style={{ width: '90%'}}>
          <ActivityProfile
            join={this.join.bind(this)}
            showPhoto={this.props.showPhoto}
            joint={this.state.joint}
            openDetails={this.props.openDetails}
            markAsSeen={this.markAsSeen.bind(this)}
            Event={this.props.Event||{}}
            ></ActivityProfile>
        </View>

        <View style={{ width: '10%', justifyContent: 'center', marginLeft: "2%",marginTop:"2%" }}>
          <Icon onPress={() => this.props.showActions(this.props.Event.id)} type="Entypo" style={{ fontSize: 24, color: "#555756"}} name="dots-three-vertical"></Icon>
        </View>


      </View>
      <PhotoViewer open={this.state.showPhoto} photo={this.props.Event.background}
        hidePhoto={() => { this.setState({ showPhoto: false }) }} ></PhotoViewer>

    </CardItem>

    )
  }

  renderBody() {
    return (<CardItem
      style={{
        paddingTop: 4,
        paddingBottom: 6,
        backgroundColor: colorList.bodyBackground,
        width: "100%",
        height: 200
      }}
      cardBody
    >
      <View style={{}}>
        <View style={{ flex: 1, width: "100%", alignSelf: "center", alignItems: 'center', }}>{this.state.isMount ? <View style={{ alignSelf: 'flex-start' }}>
          <PhotoView
            navigation={this.props.navigation} renderDelay={this.props.renderDelay} showPhoto={(url) => url ?
              this.showPhoto(url) : null} joined={() => this.join()}
            isToBeJoint hasJoin={this.props.Event.joint || this.state.joint} onOpen={() => this.onOpenPhotoModal()} style={{}} photo={this.props.Event.background}
            event_id={this.props.Event.id} width={colorList.containerWidth} height={200} borderRadius={0} />
        </View> : null}</View>
      </View>
    </CardItem>)
  }

  renderMarkAsSeen() {
    return (
      <CardItem style={{ backgroundColor: colorList.bodyBackground }}>
        {this.state.isMount ? <Options seen={() => this.markAsSeen()} {...this.props}></Options> : null}
      </CardItem>)
  }
  renderFooter() {
    return (
      <Footer style={{ height: height / 15, backgroundColor: colorList.bodyBackground, width: "100%" }}>
        <View style={{ width: "100%", flexDirection: "row", }}>

          <View style={{ alignSelf: "flex-start", width: "60%" }}>
            <View style={{ width: "35%" }}>
              {this.state.isMount && !this.state.fresh ? <Join event={this.props.Event} refreshJoint={() => this.refreshJoint()}></Join> : null}
            </View>
          </View>


          {this.state.isMount ? <View style={{ flexDirection: "row", width: "40%" }}>
            {this.renderMarkAsSeen()}
          </View> : null}

        </View>
      </Footer>
    )
  }
  render() {
    //emitter.emit('notify', "santerss") 
    return (this.state.isMount ? <View style={{
      backgroundColor: colorList.bodyBackground,
      width: colorList.containerWidth, alignSelf: "center"
    }}>
      <Swipeout {...this.props} onOpen={() => this.openSwipeOut()} onClose={() => this.onCloseSwipeout()} style={{
        width: "97%", ...shadower(1),
        backgroundColor: this.props.Event.new ? "#cdfcfc" : null
      }}
        disabled={!this.props.Event.public}
        autoClose={true}
        //close={true}
        {...this.swipeOutSettings(this.state.master, this.state.joint)}>
        <Card
          style={{
            backgroundColor: colorList.bodyBackground,
            width: "100%",
            alignSelf: 'center',
          }}
          bordered
        >
          {this.renderTitle()}
          {!this.props.Event.highlights || this.props.Event.highlights.length < 1 ? (this.props.Event.type=="relation"? this.renderBody():null) : this.renderBody()}
          {this.renderFooter()}

        </Card>
      </Swipeout>
    </View> : <View style={{}}><Card style={{
      height: this.props.Event.highlights && this.props.Event.highlights.length > 0 ? 310 : 130, alignSelf: 'center', backgroundColor: colorList.bodyBackground,
      width: "100%"
    }}></Card></View>
    )
  }
}
export default PublicEvent


/* {this.renderMap()} */