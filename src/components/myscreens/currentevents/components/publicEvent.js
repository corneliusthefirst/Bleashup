import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  activityIndicatorStyle,
  Animated,
  Easing,
} from "react-native";

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
import DetailsModal from "../../invitations/components/DetailsModal";
import OptionList from "./OptionList"
import ProfileView from "../../invitations/components/ProfileView";
import MenuListView from "./MenuListView"
import Swipeout from 'react-native-swipeout';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient'
import Svg, { Circle, Rect } from 'react-native-svg'
import PhotoView from "./PhotoView";
import {forEach} from "lodash"
import MapView from "./MapView";
import Requester from "../Requester";
import { observer } from "mobx-react";
import Like from "./Like";
import InvitationModal from "./InvitationModal";
scaleValue = new Animated.Value(0)
cardScale = this.scaleValue.interpolate({
  inputRange: [0, 0.5, 1],
  outputRange: [1, 1.15, 1.2],

})
@observer class PublicEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      creator: (creator = { name: "", status: "", image: "" }),
      details: [],
      isDetailsModalOpened: false,
      isMount: false,
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

  @autobind navigateToEventDetails() {
    stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
      if (status) {
        this.props.navigation.navigate("Event", {
          Event: this.props.Event,
          tab: "EventDetails"
        });
      } else {
        this.setState({ isDetailsModalOpened: true })
      }
      this.markAsSeen()
    })
  }
  swipperComponent = null
  @autobind navigateToReminds() {
    stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
      if (status) {
        this.props.navigation.navigate("Event", {
          Event: this.props.Event,
          tab: "Reminds"
        });
      } else {
        Toast.show({
          text: "please join the event to see the updates about !",
          buttonText: "ok"
        })
      }
      this.markAsSeen()
    })
  }

  formDetailModal(event) {
    return new Promise((resolve, reject) => {
      stores.Highlights.fetchHighlights(event.id).then(highlights => {
        let card = [];
        let i = 0;
        Description = { event_title: event.about.title, event_description: event.about.description }
        card.push(Description)
        if (highlights.length !== 0) {
          forEach(highlights, hightlight => {
            card.push(hightlight);
            if (i === highlights.length - 1) {
              resolve(card)
            }
            i++
          })
        } else {
          resolve(card)
        }
      })
    })
  }
  writeDateTime() {
    return "on the " + this.props.Event.period.date.year +
      "/" +
      this.props.Event.period.date.month +
      "/" +
      this.props.Event.period.date.day +
      "  at " +
      this.props.Event.period.time.hour +
      ":" +
      this.props.Event.period.time.mins +
      ":" +
      this.props.Event.period.time.secs
  }

  @autobind navigateToHighLights() {
    stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then((status) => {
      if (status) {
        this.props.navigation.navigate("Event", {
          Event: this.props.Event,
          tab: "Highlights"
        });
      } else {
        Toast.show({
          text: "please join the event to see the updates about !",
          buttonText: "ok"
        })
      }
      this.markAsSeen()
    })
  }
  @autobind navigateToEventChat() {
    stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
      if (status) {
        this.props.navigation.navigate("Event", {
          Event: this.props.Event,
          tab: "EventChat"
        });
      } else {
        Toast.show({
          text: "please join the event to see the updates about !",
          buttonText: "ok"
        })
      }
      this.markAsSeen()
    })
  }
  @autobind navigateToVotes() {
    stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then((status) => {
      if (status) {
        this.props.navigation.navigate("Event", {
          Event: this.props.Event,
          tab: "Votes"
        });
      } else {
        Toast.show({
          text: "please join the event to see the updates about !",
          buttonText: "ok"
        })
      }
      this.markAsSeen()
    })
  }
  width = "9%"
  padding = "9%"
  @autobind navigateToContributions() {
    stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
      if (status) {
        this.props.navigation.navigate("Event", {
          Event: this.props.Event,
          tab: "Contributions"
        });
      } else {
        Toast.show({
          text: "please join the event to see the updates about !",
          buttonText: "ok"
        })
      }
      this.markAsSeen()
    })
  }

  @autobind navigateToLogs() {
    stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
      if (status) {
        this.props.navigation.navigate("ChangeLogs", { ...this.props })
      } else {
        Toast.show({
          text: "please join the event to see the updates about !",
          buttonText: "ok"
        })
      }
      this.markAsSeen()
    })
  }
  componentDidMount() {
    setTimeout(() => {
      stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
        stores.Events.isMaster(this.props.Event.id, stores.Session.SessionStore.phone).then(master => {
          this.formDetailModal(this.props.Event).then(details => {
            let swipeOut = (<View>
              <List style={{
                backgroundColor: "#FFFFF6",
                height: "100%"
              }}>
                <ListItem style={{height:this.width, margin:this.padding, alignSelf: 'flex-start' }}>
                  {this.props.Event ? (this.state.public || this.props.Event.public ? (<TouchableOpacity onPress={() => {
                    this.publish()
                  }}>
                    {this.state.publishing ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : null}
                    <Icon style={{ fontSize: 20, color: "#bfc6ea" }} name="forward" type="Entypo">
                    </Icon>
                    <Label style={{ fontSize: 12, color: "#bfc6ea" }}>Publish</Label>
                  </TouchableOpacity>) :
                    (<TouchableOpacity onPress={() => {
                      this.publish()
                    }
                    }>
                      {this.state.publishing ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : null}
                      <Icon style={{ fontSize: 20, color: "#7DD2D2" }} name="forward" type="Entypo">
                      </Icon>
                      <Label style={{ fontSize: 14, color: "#7DD2D2" }}>Publish</Label>
                    </TouchableOpacity>)) : null}
                </ListItem>
                <ListItem style={{ height:this.width, margin:this.padding,alignSelf: 'flex-start' }}>
                  {this.props.Event ? (<TouchableOpacity onPress={() => {
                    this.invite()
                  }}>
                    <Icon style={{ fontSize: 20, color: "#7DD2D2" }} name="sc-telegram" type="EvilIcons">
                    </Icon>
                    <Label style={{ fontSize: 14, color: "#7DD2D2" }}>Invite</Label>
                  </TouchableOpacity>) : null}
                </ListItem>
                <ListItem style={{height:this.width,margin:this.padding,}}>
                  {this.props.Event ? (this.state.isjoint || status ? (<TouchableOpacity onPress={() => Toast.show({
                    text: 'Joint already!',
                    buttonText: 'Okay'
                  })} >
                    <Icon style={{ fontSize: 20, color: "#7DD2D2" }} name="universal-access" type="Foundation">
                    </Icon>
                    <Label style={{
                      color: "#7DD2D2",
                      fontSize: 14
                    }}
                    >
                      Joint
              </Label>
                  </TouchableOpacity>) : (<TouchableOpacity onPress={() => {
                    if (!this.state.participant) {
                      this.join()
                    } else {
                      Toast.show({
                        text: "Joint Already !"
                      })
                    }
                  }}>
                    {this.state.isJoining ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : null}
                    <Icon style={{ fontSize: 20, color: "#bfc6ea" }} name="universal-access" type="Foundation">
                    </Icon>
                    <Label style={{
                      color: "#bfc6ea",
                      fontSize: 14
                    }}
                    >
                      Join
              </Label>
                  </TouchableOpacity>)) : null}

                </ListItem>
                <ListItem style={{ height:this.width,margin:this.padding,alignSelf: 'flex-start' }}>
                  <TouchableOpacity onPress={() => {
                    this.navigateToEventDetails()
                  }}>
                    <Icon style={{ fontSize: 20, color: "#1FABAB" }} name="calendar" type="EvilIcons">
                    </Icon>
                    {this.props.Event ? (this.props.Event.updated ? (
                      <View style={this.indicatorMargin}>
                        <UpdateStateIndicator size={this.blinkerSize} />
                      </View>
                    ) : (
                        <View style={this.indicatorMargin}>
                          <UpdateStateIndicator
                            size={this.blinkerSize}
                            color={this.transparent}
                          />
                        </View>
                      )) : null}
                    <Label style={{ fontSize: 14, color: "#1FABAB" }}>Detail</Label>
                  </TouchableOpacity>
                </ListItem>
                <ListItem style={{height:this.width, margin:this.padding,alignSelf: 'flex-start' }}>
                  <TouchableOpacity onPress={() => {
                    this.navigateToEventChat()
                  }}>
                    <Icon style={{ fontSize: 20, color: "#1FABAB" }} name="comment" type="EvilIcons">
                    </Icon>
                    {this.props.Event ? (this.props.Event.chat_upated ? (
                      <View style={this.indicatorMargin}>
                        <UpdateStateIndicator size={this.blinkerSize} />
                      </View>
                    ) : (
                        <View style={this.indicatorMargin}>
                          <UpdateStateIndicator
                            size={this.blinkerSize}
                            color={this.transparent}
                          />
                        </View>
                      )) : null}
                    <Label style={{ fontSize: 14, color: "#1FABAB" }}>chat</Label>
                  </TouchableOpacity>
                </ListItem>
                <ListItem style={{ height:this.width, margin:this.padding,alignSelf: 'flex-start' }}>
                  <TouchableOpacity onPress={() => {
                    this.navigateToLogs()
                  }}>
                    <Icon style={{ fontSize: 20, color: "#1FABAB" }} name="exclamation" type="EvilIcons">
                    </Icon>
                    {this.props.Event ? (this.props.Event.upated ? (
                      <View style={this.indicatorMargin}>
                        <UpdateStateIndicator size={this.blinkerSize} />
                      </View>
                    ) : (
                        <View style={this.indicatorMargin}>
                          <UpdateStateIndicator
                            size={this.blinkerSize}
                            color={this.transparent}
                          />
                        </View>
                      )) : null}
                    <Label style={{ fontSize: 14, color: "#1FABAB" }}>Logs</Label>
                  </TouchableOpacity>
                </ListItem >
                <ListItem style={{ height:this.width,margin:this.padding,alignSelf: 'flex-start' }}>
                  <TouchableOpacity onPress={() => {
                    return this.hide()
                  }}>
                    {this.state.hiding ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : null}
                    <Icon style={{ fontSize: 20, color: "#1FABAB" }} name="archive" type="EvilIcons">
                    </Icon>
                    <Label style={{ fontSize: 14, color: "#1FABAB" }}>Hide</Label>
                  </TouchableOpacity>
                </ListItem>
                <ListItem style={{height:this.width,margin:this.padding,}}>
                  <TouchableOpacity onPress={() => {
                    return this.delete()
                  }}>
                    {this.state.deleting ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : null}
                    <Icon name="trash" style={{ fontSize: 20, color: "red" }} type="EvilIcons">
                    </Icon>
                    <Label style={{ fontSize: 14, color: "red" }} >Delete</Label>
                  </TouchableOpacity>
                </ListItem>
              </List>
            </View>)
            this.setState({
              swipeOutSettings: {
                autoClose: true,
                sensitivity: 100,
                right: [
                  {
                    component: swipeOut
                  }
                ],
              },
              details: details,
              participant: status,
              master: master,
              isMount:true,
              openInviteModal:false
            })
          })
        })
      })

    }, 100)
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

  invite(){
    this.setState({
      openInviteModal:true
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
           text:"Cannot Publish This Event, you are not a master",
           buttonText : "OK"
         })
        }
      })
    }
    this.markAsSeen()
  }
  markAsSeen(){
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
    if (this.props.Event.new) {
      stores.Events.markAsSeen(this.props.Event.id).then(() => {
      })
    }
    this.setState({
      isJoining: true
    })
    this.setState({
      isDetailsModalOpened: false
    })
    Requester.join(this.props.Event.id, this.props.Event.event_host).then((status) => {
      this.setState({ participant: true, isJoining: false });
    }).catch((error) => {
      this.setState({ isJoining: false })
      Toast.show({
        text: 'unable to connect to the server ',
        buttonText: 'Okay'
      })
    })
  }
  indicatorMargin = {
    marginLeft: "5%",
    marginTop: "-7%",
    position: 'absolute',

  };


  transparent = "rgba(52, 52, 52, 0.0)";
  svgStyle = {
  }
  blinkerSize = 26;
  render() {
    return (this.state.isMount ? this.props.Event ? (this.props.Event.hiden || this.state.hiden ? null :(
      <Swipeout style={{ backgroundColor: this.props.Event.new ? "#cdfcfc" : null }}  {...this.state.swipeOutSettings}>
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
              <View>
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
              </View>
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
                <ProfileView joined={() => this.join()} hasJoin={this.state.participant} onOpen={() => this.onOpenDetaiProfileModal()} phone={(this.props.Event.creator_phone)}></ProfileView>
              </View>
            </Left>
          </CardItem>
          {this.props.Event.recursive ? <CardItem>
            <Left>
              <View style={
                {
                  flexDirection: "column"
                }
              }>
                <View>
                  <Text style={{
                    color: "#54F5CA"
                  }} note>
                    {this.props.Event.recursion.type}
                  </Text>
                </View>

                <View>
                  <Text note>
                    {this.props.Event.recursion.days}
                  </Text>
                </View>
              </View>
            </Left>
          </CardItem> : null}
          <CardItem
            style={{
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <TouchableOpacity onPress={() => requestAnimationFrame(() => {
              this.navigateToEventDetails()
            }
            )}>
              <View>
                <Text
                  adjustsFontSizeToFit={true}
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                    textAlignVertical: "center",
                    fontFamily: "Roboto"
                  }}
                >
                  {this.props.Event.about.title}{/*{" "}{this.props.Event.id}*/}
                </Text>
                <Text
                  style={{
                    color: "#1FABAB"
                  }}
                  note
                >
                  {this.writeDateTime()}
                </Text>
              </View>
            </TouchableOpacity>
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
              <PhotoView joined={() => this.join()} isToBeJoint hasJoin={this.state.participant} onOpen={() => this.onOpenPhotoModal()} style={{
                width: "70%",
                marginLeft: "4%"
              }} photo={this.props.Event.background} width={170} height={125} borderRadius={10} />
            </Left>
            <Right >
              <MapView style={{ marginRight: "11%" }} location={this.props.Event.location.string}></MapView>
            </Right>
          </CardItem>
          <CardItem
            style={{
              flexDirection: "row"
            }}
          >
            <View
              style={{
                width: "19%"
              }}
            >
              <TouchableOpacity onPress={this.navigateToEventDetails}>
                <View style={this.svgStyle}>
                  <Icon type="EvilIcons" name="calendar" style={
                    {
                      color: "#1FABAB"
                    }
                  }></Icon>
                  <Label style={{
                    marginLeft: "-8%"
                  }}>details</Label>
                  {this.props.Event.updated ? (
                    <View style={this.indicatorMargin}>
                      <UpdateStateIndicator size={this.blinkerSize} />
                    </View>
                  ) : (
                      <View style={this.indicatorMargin}>
                        <UpdateStateIndicator
                          size={this.blinkerSize}
                          color={this.transparent}
                        />
                      </View>
                    )}
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: "19%"
              }}
            >
              <TouchableOpacity onPress={this.navigateToReminds}>
                <View style={this.svgStyle}>
                  <Icon type="EvilIcons" name="bell" style={
                    {
                      color: "#1FABAB"
                    }
                  }></Icon>
                  <Label style={{
                    marginLeft: "-20%"
                  }} > reminds</Label>
                  {this.props.Event.remind_upated ? (
                    <View style={this.indicatorMargin}>
                      <UpdateStateIndicator size={this.blinkerSize} />
                    </View>
                  ) : (
                      <View style={this.indicatorMargin}>
                        <UpdateStateIndicator
                          size={this.blinkerSize}
                          color={this.transparent}
                        />
                      </View>
                    )}
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: "19%"
              }}
            >
              <TouchableOpacity onPress={this.navigateToEventChat}>
                <View style={this.svgStyle}>
                  <Icon name="comment" type="EvilIcons" style={
                    {
                      color: "#1FABAB"
                    }
                  }></Icon>
                  <Label style={{
                    marginLeft: "-5%"
                  }}>chats</Label>
                  {this.props.Event.chat_updated ? (
                    <View style={this.indicatorMargin}>
                      <UpdateStateIndicator size={22} />
                    </View>
                  ) : (
                      <View style={this.indicatorMargin}>
                        <UpdateStateIndicator
                          size={this.blinkerSize}
                          color={this.transparent}
                        />
                      </View>
                    )}
                </View >
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: "19%"
              }}
            >
              <TouchableOpacity onPress={this.navigateToHighLights}>
                <View style={this.svgStyle}>
                  <Icon name="star" type="EvilIcons" style={
                    {
                      color: "#1FABAB"
                    }
                  }></Icon>
                  <Label style={{
                    marginLeft: "-12%"
                  }} >highlts</Label>
                  {this.props.Event.highlight_updated ? (
                    <View style={this.indicatorMargin}>
                      <UpdateStateIndicator size={this.blinkerSize} />
                    </View>
                  ) : (
                      <View style={this.indicatorMargin}>
                        <UpdateStateIndicator
                          size={this.blinkerSize}
                          color={this.transparent}
                        />
                      </View>
                    )}
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: "19%"
              }}
            >
              <TouchableOpacity onPress={this.navigateToVotes}>
                <View style={this.svgStyle}>
                  <Icon type="AntDesign" name="totop" style={
                    {
                      color: "#1FABAB"
                    }
                  }></Icon>
                  <Label>votes</Label>
                  {this.props.Event.vote_updated ? (
                    <View style={this.indicatorMargin}>
                      <UpdateStateIndicator size={this.blinkerSize} />
                    </View>
                  ) : (
                      <View style={this.indicatorMargin}>
                        <UpdateStateIndicator
                          size={this.blinkerSize}
                          color={this.transparent}
                        />
                      </View>
                    )}
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: "19%"
              }}
            >
              <TouchableOpacity onPress={this.navigateToContributions}>
                <View style={this.svgStyle}>
                  <Icon type="Foundation" name="dollar" style={
                    {
                      color: "#1FABAB"
                    }
                  }></Icon>
                  <Label style={{
                    marginLeft: "-30%"
                  }}>contrbs</Label>
                  {this.props.Event.contribution_updated ? (
                    <View style={this.indicatorMargin}>
                      <UpdateStateIndicator size={this.blinkerSize} />
                    </View>
                  ) : (
                      <View style={this.indicatorMargin}>
                        <UpdateStateIndicator
                          size={this.blinkerSize}
                          color={this.transparent}
                        />
                      </View>
                    )}
                </View>
              </TouchableOpacity>
            </View>
          </CardItem>
          <Footer>
            <Left>
              <View style={{ flexDirection: "row" }}>
                <Like id={this.props.Event.id} end={() => this.markAsSeen()} />
              </View>
            </Left>
            <Right>
              <View style={{ padding: "-5%", marginLeft: "-25%" }}>
                {this.props.Event.joint || this.state.participant ? (
                  <View style={{ flexDirection: "row" }}>
                    <TouchableWithoutFeedback onPress={() => Toast.show({
                      text: 'Joint already!',
                      buttonText: 'Okay'
                    })} >
                      <View >
                        <Icon
                          name="universal-access"
                          type="Foundation"
                          style={{
                            color: "#54F5CA",
                            fontSize: 23
                          }}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                    <View style={{ marginTop: 1 }}>
                      <Text style={{ color: "#54F5CA" }} note> joint </Text>
                    </View>
                  </View>
                ) : (
                    <View style={{ flexDirection: "row" }}>
                      <TouchableWithoutFeedback onPressIn={() => {
                        scaleValue.setValue(0);
                        Animated.timing(scaleValue, {
                          toValue: 1,
                          duration: 300,
                          easing: Easing.linear,
                          userNativeDriver: true
                        }).start()
                      }} onPressOut={() => {
                        Animated.timing(scaleValue, {
                          toValue: 1,
                          duration: 200,
                          easing: Easing.linear,
                          userNativeDriver: true
                        }).start()
                        return this.join()
                      }} >
                        <Animated.View style={{ transform: [{ scale: cardScale }] }}>
                          <Icon name="universal-access" style={{
                            color: "#bfc6ea",
                            fontSize: 27
                          }} type="Foundation" />
                        </Animated.View>
                      </TouchableWithoutFeedback>
                      <View style={{ marginTop: 4 }}>
                        <Text style={{ fontSize: 13, color: "#bfc6ea" }} note> {" "}join </Text>
                      </View>
                    </View>
                  )}
              </View>
            </Right>
          </Footer>
          <DetailsModal
            isToBeJoint={!(this.state.isJoin || this.props.Event.joint)}
            join={() => this.join()}
            isOpen={this.state.isDetailsModalOpened}
            isJoining={this.state.isJoining}
            details={this.state.details}
            created_date={this.props.Event.created_at}
            location={this.props.Event.location.string}
            event_organiser_name={this.state.creator.name}
            onClosed={() => this.setState({ isDetailsModalOpened: false })}
          />
        </Card>
        <InvitationModal eventID = {this.props.Event.id} isOpen={this.state.openInviteModal} close={()=> this.setState({openInviteModal:false})}></InvitationModal>
      </Swipeout >
    )) : <SvgAnimatedLinearGradient primaryColor="#cdfcfc"
      secondaryColor="#FEFFDE" height={300}>
        <Circle cx="30" cy="30" r="30" />
        <Rect x="75" y="13" rx="4" ry="4" width="100" height="13" />
        <Rect x="75" y="37" rx="4" ry="4" width="50" height="8" />
        <Rect x="0" y="70" rx="5" ry="5" width="400" height="200" />
        <Spinner style={{ marginTop: "40%" }}></Spinner>
      </SvgAnimatedLinearGradient> : null);
  }
}
export default PublicEvent
