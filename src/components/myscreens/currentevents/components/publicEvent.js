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
import { findIndex, isEqual,find } from "lodash"
import InvitationModal from './InvitationModal';
import ProfileSimple from './ProfileViewSimple';
import shadower from "../../../shadower";


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
      opponent: null
    };
  }

  /*state = {
    master: true
  }*/

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
    if(this.props.Event.type == "relation"){
        //console.warn("here2",this.props.Event.participant);
        this.props.Event.participant.forEach((participant)=>{
             if(participant.phone !=  stores.LoginStore.user.phone){
               stores.TemporalUsersStore.Users.forEach((user)=>{
                  if(participant.phone == user.phone){
                    this.setState({ opponent:user});
                  }
               })

             }
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
          //autoClose: true,
          backgroundColor: "white",
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

          {this.state.opponent ? <View style={{ width: "60%" }}>
            <ProfileSimple showPhoto={(url) =>
              this.props.showPhoto(url)}
              profile={this.state.opponent}>
            </ProfileSimple>
          </View> : null}

          <View style={{ height: "100%", width: "40%", ...shadower() }}>
            {this.state.isMount ? <Options seen={() => this.markAsSeen()} {...this.props}></Options> : null}
          </View>

        </View>
      </CardItem>);

  }


  renderTitle() {
    return (<CardItem style={{
      marginLeft: '2%',
      marginBottom: '3%',
    }}>
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <View style={{ width: '90%' }}>
          {this.state.isMount ? <TitleView openDetail={() => this.props.openDetails(this.props.Event)} join={() => this.join()} joint={this.state.joint} seen={() => this.markAsSeen()}
            {...this.props}></TitleView> : null}
        </View>
        <View style={{ width: '15%', justifyContent: 'flex-end', alignItems: 'flex-end', }}>
          <Icon onPress={() => this.props.showActions(this.props.Event.id)} type="Entypo" style={{ fontSize: 24, color: "#555756", alignSelf: 'flex-end' }} name="dots-three-vertical"></Icon>
        </View>
      </View>
    </CardItem>)
  }
  renderBody() {
    return (<CardItem
      style={{
        paddingLeft: 0,
        aspectRatio: 3 / 1,
        paddingRight: 0,
        paddingTop: 4,
        paddingBottom: 6
      }}
      cardBody
    >
      <View style={{ flexDirection: 'row', }}>
        <View style={{ width: '65%' }}>{this.state.isMount ? <View style={{ alignSelf: 'flex-start' }}><CardItem
          style={{
            ...shadower(),
            backgroundColor: '#1FABAB',
            height: '90%',
            width: "60%",
            borderRadius: 5,
            marginLeft: "4%"
          }}><PhotoView
            navigation={this.props.navigation} renderDelay={this.props.renderDelay} showPhoto={(url) => url ?
              this.showPhoto(url) : null} joined={() => this.join()}
            isToBeJoint hasJoin={this.props.Event.joint || this.state.joint} onOpen={() => this.onOpenPhotoModal()} style={{
              marginLeft: '-1%',
            }} photo={this.props.Event.background} event_id={this.props.Event.id} width={170} height={100} borderRadius={6} />
        </CardItem></View> : null}</View>
        <View style={{ width: '35%', }}>{this.renderMap()}</View>
      </View>
    </CardItem>)
  }

  renderMarkAsSeen() {
    return (
      <CardItem>
        {this.state.isMount ? <Options seen={() => this.markAsSeen()} {...this.props}></Options> : null}
      </CardItem>)
  }
  renderFooter() {
    return (
      <Footer style={{ height: 40 }}>
        <View style={{ width: "100%", flexDirection: "row", }}>

          <View style={{ alignSelf: "flex-start", width: "60%", paddingLeft: "2%" }}>
            {this.state.isMount && !this.state.fresh ? <Join event={this.props.Event} refreshJoint={() => this.refreshJoint()}></Join> : null}
          </View>


          {this.state.isMount ? <View style={{ flexDirection: "row", width: "40%" }}>
            {/*<Like showLikers={(likers) => this.props.showLikers(likers)} id={this.props.Event.id} end={() => this.markAsSeen()} />*/}
            {this.renderMarkAsSeen()}
          </View> : null}

        </View>
      </Footer>
    )
  }


  render() {
    return (this.state.isMount ? <View style={{ width: "100%", paddingLeft: '2%', paddingRight: '2%', alignSelf: 'center', }}>
      <Swipeout {...this.props} onOpen={() => this.openSwipeOut()} onClose={() => this.onCloseSwipeout()} style={{
        width: "100%", ...shadower(1),
        backgroundColor: this.props.Event.new ? "#cdfcfc" : null
      }}
        autoClose={true}
        //close={true}
        {...this.swipeOutSettings(this.state.master, this.state.joint)}>
        <Card
          style={{
            margin: '1%',
          }}
          bordered
        >
          {this.renderTitle()}
          {this.renderBody()}
          {this.renderFooter()}

        </Card>
      </Swipeout>
    </View> : <View style={{ paddingLeft: '2%', paddingRight: '2%', }}><Card style={{
      height: 230,
      padding: '1%', margin: '1%', alignSelf: 'center', width: '97%'
    }}></Card></View>
    )
  }
}
export default PublicEvent
