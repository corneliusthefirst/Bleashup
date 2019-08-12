import React, { Component } from "react";
import {
  Image,
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
import Requester from "../Requester";
let scaleValue = new Animated.Value(0)
const cardScale = scaleValue.interpolate({
  inputRange: [0, 0.5, 1],
  outputRange: [1, 1.15, 1.2],

})

class PublicEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      creator: (creator = { name: "", status: "", image: "" }),
      details: [],
      isDetailsModalOpened: false,
      isMount: true,
      public: false,
      publishing: false,
      event: this.props.Event,
      swipeClosed: true,
      attempt_to_puplish: false,
      public: false,
      liking: false,
      hiding: false,
      deleting: false,
      swipeOutSettings: null,
      hiden: false,
      isjoint: false,
      liked: false,
      likeIncrelment: 0,
      isPublisherModalOpened: false,
      currentUser: undefined
    };
  }

  @autobind navigateToEventDetails() {
    if (!this.state.event.joint) {
      this.setState({ isDetailsModalOpened: true })
    } else {
      this.props.navigation.navigate("Event", {
        Event: this.state.event,
        tab: "EventDetails"
      });
    }
  }
  swipperComponent = null
  @autobind navigateToReminds() {
    this.props.navigation.navigate("Event", {
      Event: this.state.event,
      tab: "Reminds"
    });
  }
  @autobind fetchHightlight(EventID) {
    return new Promise((resolve, reject) => {
      stores.Highlights.fetchHighlights(EventID).then(Hightlihgts => {
        if (Hightlihgts.length == 0) {
          resolve([{
            title: "Sample Highlight",
            description: `It doesn’t matter what you do for a living; when you decide to look for work, you instantly become a marketer.

As a job seeker, you are required to advertise your qualifications and professional reputation — in other words, your personal brand— to employers and recruiters in your desired field online, in person, and on paper.

One of the most important documents you'll need to update or create for this process is your professional resume. A great resume is written with a specific job goal in mind. It should be tailored for each job application by showcasing your most valuable and relevant skills in a way that positions you as an ideal candidate for the job you want.

In order to ensure that your professional resume is supporting your career goals, gather a few sample job descriptions that describe the type of position you're interested in and qualified for. Then, compare the skills and qualifications on your resume with the desired qualifications in the sample job descriptions.`
            ,
            image: `https://d3kqdc25i4tl0t.cloudfront.net/articles/content/364_843132_160805jobdescription_Augustine_hero.jpg`
          },
          {
            title: 'Sample Highlihgt 2',
            description: `This will aid your job search in many ways. First, it will help you determine if you're missing any important skills that recruiters are looking for. Once you have this information, then you can take steps to build up those skill sets with courses, certification programs, side projects, or internships to become a more attractive job candidate.

Second, these sample job descriptions will help you decide which of your current qualifications should be highlighted throughout your professional resume and cover letter.

And finally, you can use example job descriptions to find the right words to describe the roles and responsibilities you held in each job listed in your work history.

To help you get started, take a look at the sample job descriptions below. For additional example job descriptions, search for listings on your favorite online job boards, and check out the following links from Workable.com and Monster.com.

Search for two types of sample job descriptions:

Job posts that are similar to roles you've previously held; and

Listings that represent the type of position you're currently targeting.

In both of these instances, don't worry about the job's location. For the purpose of this exercise, instead only focus on the job description and its requirements.

Use the sample job descriptions that match titles in your work history to beef up your professional resume's Employment History section. Click on the following link to learn how to use these job listings to brag about your experience.

Once you've found three to five sample listings that describe your job goals, copy and paste the text of each job description into a Word document and bold any phrases that routinely pop up. Then, highlight each term that describes a qualification you possess. Use this information to edit your resume and cover letter so that your key accomplishments and skills match those desired by your target employer. Your end result should be a professional resume that mirrors the employer's requirements.`
            ,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWJbtGFelIkuleZLnVnvIyNQJ5R9HPT6CRty-VFN_vVk253n8i'
          }])
        } else {
          resolve(Hightlihgts)
        }
      })
    })
  }
  @autobind formDetailFormData() {
    return new Promise((resolve, reject) => {
      let details = [];
      details[0] = {
        event_title: this.state.event.about.title,
        event_description: this.state.event.description
      }
      this.fetchHightlight(this.state.event.id).then(Highlights => {
        let i = 0;
        Highlights.map(High => {
          details[i + 1] = High
          i++;
          if (i == Highlights.length - 1) {
            resolve(details)
          }
        })
      })
    })
  }
  writeDateTime() {
    this.state.event.period.date.year +
      "-" +
      this.state.event.period.date.month +
      "-" +
      this.state.event.period.date.day +
      "  at " +
      this.state.event.period.time.hour +
      "-" +
      this.state.event.period.time.mins +
      "-" +
      this.state.event.period.time.secs
  }

  @autobind navigateToHighLights() {
    this.props.navigation.navigate("Event", {
      Event: this.state.event,
      tab: "Highlights"
    });
  }
  @autobind navigateToEventChat() {
    this.props.navigation.navigate("Event", {
      Event: this.state.event,
      tab: "EventChat"
    });
  }
  @autobind navigateToVotes() {
    this.props.navigation.navigate("Event", {
      Event: this.state.event,
      tab: "Votes"
    });
  }
  @autobind navigateToContributions() {
    this.props.navigation.navigate("Event", {
      Event: this.state.event,
      tab: "Contributions"
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.Event ? nextProps.Event.id !== this.state.event.id : false) ||
      this.state.isMount !== nextState.isMount ||
      this.state.isjoint !== nextState.isJoint ||
      this.state.liked !== nextState.liked ||
      this.state.isJoining !== nextState.isJoining
      ? true : false
  }
  componentDidUpdate() {
    if (this.props.Event) {
      if (this.props.Event.id !== this.state.event.id) {
        this.setState({
          event: this.props.Event
        })
      } else {

      }
    }
  }

  componentDidMount() {
    let swipeOut = (<View>
      <List style={{
        backgroundColor: "#FFFFF6",
        height: "100%"
      }}>
        <ListItem style={{ alignSelf: 'flex-start' }}>
          {this.state.public || this.state.event.public ? (<TouchableOpacity onPress={() => {
            this.publish()
          }}>
            {this.state.publishing ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : null}
            <Icon style={{ fontSize: 16, color: "#bfc6ea" }} name="forward" type="Entypo">
            </Icon>
            <Label style={{ fontSize: 12, color: "#bfc6ea" }}>Publish</Label>
          </TouchableOpacity>) : (<TouchableOpacity onPress={() => {
            this.publish()
          }
          }>
            {this.state.publishing ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : null}
            <Icon style={{ fontSize: 16, color: "#7DD2D2" }} name="forward" type="Entypo">
            </Icon>
            <Label style={{ fontSize: 12, color: "#7DD2D2" }}>Publish</Label>
          </TouchableOpacity>)}
        </ListItem>
        <ListItem>
          {this.state.isJoin || this.state.event.joint ? (<TouchableOpacity>
            <Icon style={{ fontSize: 16, color: "#7DD2D2" }} name="universal-access" type="Foundation">
            </Icon>
            <Label style={{
              color: "#7DD2D2",
              fontSize: 12
            }}
            >
              Joint
              </Label>
          </TouchableOpacity>) : (<TouchableOpacity onPress={() => {
            this.join()
          }}>
            {this.state.isJoining ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : null}
            <Icon style={{ fontSize: 16, color: "#bfc6ea" }} name="universal-access" type="Foundation">
            </Icon>
            <Label style={{
              color: "#bfc6ea",
              fontSize: 12
            }}
            >
              Join
              </Label>
          </TouchableOpacity>)}

        </ListItem>
        <ListItem style={{ alignSelf: 'flex-start' }}>
          <TouchableOpacity onPress={() => {
            this.navigateToEventDetails()
          }}>
            <Icon style={{ fontSize: 16, color: "#1FABAB" }} name="calendar" type="EvilIcons">
            </Icon>
            {this.state.event.updated ? (
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
            <Label style={{ fontSize: 12, color: "#1FABAB" }}>Detail</Label>
          </TouchableOpacity>
        </ListItem>
        <ListItem style={{ alignSelf: 'flex-start' }}>
          <TouchableOpacity onPress={() => {
            this.navigateToEventChat()
          }}>
            <Icon style={{ fontSize: 16, color: "#1FABAB" }} name="comment" type="EvilIcons">
            </Icon>
            {this.state.event.chat_upated ? (
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
            <Label style={{ fontSize: 12, color: "#1FABAB" }}>chat</Label>
          </TouchableOpacity>
        </ListItem>
        <ListItem style={{ alignSelf: 'flex-start' }}>
          <TouchableOpacity onPress={() => {
            this.navigateToLogs()
          }}>
            <Icon style={{ fontSize: 16, color: "#1FABAB" }} name="exclamation" type="EvilIcons">
            </Icon>
            {this.state.event.upated ? (
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
            <Label style={{ fontSize: 12, color: "#1FABAB" }}>Logs</Label>
          </TouchableOpacity>
        </ListItem>
        <ListItem style={{ alignSelf: 'flex-start' }}>
          <TouchableOpacity onPress={() => {
            return this.hide()
          }}>
            {this.state.hiding ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : null}
            <Icon style={{ fontSize: 16, color: "#1FABAB" }} name="archive" type="EvilIcons">
            </Icon>
            <Label style={{ fontSize: 12, color: "#1FABAB" }}>Hide</Label>
          </TouchableOpacity>
        </ListItem>
        <ListItem>
          <TouchableOpacity onPress={() => {
            return this.delete()
          }}>
            {this.state.deleting ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : null}
            <Icon name="trash" style={{ fontSize: 16, color: "red" }} type="EvilIcons">
            </Icon>
            <Label style={{ fontSize: 12, color: "red" }} >Delete</Label>
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
      }

    })
  }

  componentWillUnmount() {
  }


  showPublishersList() {
    this.setState({
      isPublisherModalOpened: true,
      hide: true
    })
  }

  like() {
    setState({
      liking: true
    })
    Requester.like(this.state.event.id).then(response => {
      this.setState({
        liked: true,
        likeIncrelment: 1,
        liking: false
      })
    })
  }
  unlike() {
    this.setState({
      liking: true
    })
    Requester.unlike(this.state.event.id).then(response => {
      this.setState({
        liked: false,
        likeIncrelment: 0,
        liking: false
      })
    })
  }
  publish() {
    this.setState({
      publishing: true
    })
    if (this.state.event.public) {
      Requester.publish(this.state.event.id).then(() => {
        this.setState({
          publishing: false,
          public: true
        })
      })
    } else {
      stores.Events.isMaster(this.state.event.id, stores.Session.SessionStore.phone).then(status => {
        if (status) {
          Requester.publish(this.state.event.id).then(() => {
            this.setState({
              public: true,
              publishing: false
            })
          })
        } else {
          this.setState({
            publishing: false,
            attempt_to_puplish: true,
            public: true
          })
        }
      })
    }
  }
  delete() {
    this.setState({
      deleting: true
    })
    Requester.delete(this.state.event.id).then(() => {
      this.setState({
        deleting: false,
        hiden: true
      })
    })
  }
  hide() {
    this.setState({
      hiding: true
    })
    Requester.hide(this.state.event.id).then(() => {
      this.setState({
        hiden: true,
        hiding: false
      })
    })
  }
  join() {
    this.setState({
      isJoining: true
    })
    this.state.event.joint = true
    this.setState({
      isDetailsModalOpened: false
    })
    Requester.join(this.state.event.id, this.state.event.event_host).then((status) => {
      this.setState({ isJoint: true, isJoining: false });
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
    return this.state.event.hiden || this.state.hiden ? null :
      (this.state.event ? (this.state.isMount ? (
        <Swipeout style={{ backgroundColor: this.state.event.new ? "#cdfcfc" : null }}  {...this.state.swipeOutSettings}>
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
                  {this.state.publishing ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : null}
                  <Icon
                    name="forward"
                    type="Entypo"
                    style={{
                      fontSize: 16,
                      color: "#0A4E52"
                    }}
                  />
                  <MenuListView hide={this.state.hide} event_id={this.state.event.id} published publish={() => this.publish()}
                    showPublishers={() => this.showPublishersList()}
                  />
                </View>
              </Left>
              {this.state.event.updated ? <UpdateStateIndicator /> : null}
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
                  <ProfileView phone={(this.state.event.creator_phone)}></ProfileView>
                </View>
              </Left>
            </CardItem>
            {this.state.event.recursive ? <CardItem>
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
                      {this.state.event.recursion.type}
                    </Text>
                  </View>

                  <View>
                    <Text note>
                      {this.state.event.recursion.days}
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
              <TouchableOpacity onPress={() => requestAnimationFrame(() =>
                this.navigateToEventDetails()
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
                    {this.state.event.about.title}
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
                <PhotoView style={{
                  width: "70%",
                  marginLeft: "4%"
                }} photo={this.state.event.background} width={170} height={125} borderRadius={10} />
              </Left>
              <Right >
                <MapView style={{ marginRight: "11%" }} location={this.state.event.location.string}></MapView>
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
                    {this.state.event.updated ? (
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
                    {this.state.event.remind_upated ? (
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
                    {this.state.event.chat_updated ? (
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
                    {this.state.event.highlight_updated ? (
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
                    {this.state.event.vote_updated ? (
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
                    {this.state.event.contribution_updated ? (
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
                {this.state.event.liked || this.state.liked ? (

                  <View style={{ flexDirection: "row" }}>
                    <TouchableWithoutFeedback onPressIn={() => {
                      scaleValue.setValue(0);
                      Animated.timing(scaleValue, {
                        toValue: 1,
                        duration: 250,
                        easing: Easing.linear,
                        userNativeDriver: true
                      }).start()
                    }} onPressOut={() => {
                      Animated.timing(scaleValue, {
                        toValue: 1,
                        duration: 100,
                        easing: Easing.linear,
                        userNativeDriver: true
                      }).start()
                      return this.unlike()
                    }} >
                      <Animated.View style={{ transform: [{ scale: cardScale }] }} >
                        <Icon
                          name="thumbs-up"
                          type="Entypo"
                          style={{
                            color: "#7DD2D2",
                            fontSize: 23
                          }}
                        />
                      </Animated.View>

                    </TouchableWithoutFeedback>
                    <View style={{ marginTop: 7 }}>
                      <Text style={{ color: "#7DD2D2" }} note> {this.state.event.likes + this.state.likeIncrelment} Likers </Text>
                    </View>
                  </View>
                ) : (
                    <View style={{ flexDirection: "row" }}>
                      {this.state.liking ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : null}
                      <TouchableWithoutFeedback onPressIn={() => {
                        scaleValue.setValue(0);
                        Animated.timing(scaleValue, {
                          toValue: 1,
                          duration: 250,
                          easing: Easing.linear,
                          userNativeDriver: true
                        }).start()
                        return this.like()
                      }} onPressOut={() => {
                        Animated.timing(scaleValue, {
                          toValue: 1,
                          duration: 100,
                          easing: Easing.linear,
                          userNativeDriver: true
                        }).start()
                      }} >
                        <Animated.View style={{ transform: [{ scale: cardScale }] }} >
                          <Icon
                            name="thumbs-up"
                            type="Entypo"
                            style={{
                              color: "#bfc6ea",
                              fontSize: 23
                            }}
                          />
                        </Animated.View>

                      </TouchableWithoutFeedback>
                      <View style={{ marginTop: 7 }}>
                        <Text style={{ color: "#bfc6ea" }} note>{this.state.event.likes + this.state.likeIncrelment} Likers</Text>
                      </View>
                    </View>
                  )}
              </Left>
              <Right>
                <View style={{ padding: "-5%", marginLeft: "-25%" }}>
                  {this.state.event.joint || this.state.isjoint ? (
                    <View style={{ flexDirection: "row" }}>
                      <TouchableWithoutFeedback onPressIn={() => {
                        scaleValue.setValue(0);
                        Animated.timing(scaleValue, {
                          toValue: 1,
                          duration: 250,
                          easing: Easing.linear,
                          userNativeDriver: true
                        }).start()
                      }} onPressOut={() => {
                        Animated.timing(scaleValue, {
                          toValue: 1,
                          duration: 100,
                          easing: Easing.linear,
                          userNativeDriver: true
                        }).start()
                      }} >
                        <Animated.View style={{ transform: [{ scale: cardScale }] }} >
                          <Icon
                            name="universal-access"
                            type="Foundation"
                            style={{
                              color: "#7DD2D2",
                              fontSize: 23
                            }}
                          />
                        </Animated.View>
                      </TouchableWithoutFeedback>
                      <View style={{ marginTop: 1 }}>
                        <Text style={{ color: "#7DD2D2" }} note> joint </Text>
                      </View>
                    </View>
                  ) : (
                      <View style={{ flexDirection: "row" }}>
                        {this.state.isJoining ? <Spinner size={"small"} color="#7DD2D2"></Spinner> : null}
                        <TouchableWithoutFeedback onPressIn={() => {
                          scaleValue.setValue(0);
                          Animated.timing(scaleValue, {
                            toValue: 1,
                            duration: 250,
                            easing: Easing.linear,
                            userNativeDriver: true
                          }).start()
                          return this.join()
                        }} onPressOut={() => {
                          Animated.timing(scaleValue, {
                            toValue: 1,
                            duration: 100,
                            easing: Easing.linear,
                            userNativeDriver: true
                          }).start()
                        }} >
                          <Animated.View style={{ transform: [{ scale: cardScale }] }}>
                            <Icon name="universal-access" style={{
                              color: "#bfc6ea",
                              fontSize: 23
                            }} type="Foundation" />
                          </Animated.View>
                        </TouchableWithoutFeedback>
                        <View style={{ marginTop: 1 }}>
                          <Text style={{ color: "#bfc6ea" }} note> joint </Text>
                        </View>
                      </View>
                    )}
                </View>
              </Right>
            </Footer>
            <DetailsModal
              isToBeJoint
              isOpen={this.state.isDetailsModalOpened}
              isJoining={() => this.join()}
              details={this.state.details}
              created_date={this.state.event.created_at}
              location={this.state.event.location.string}
              event_organiser_name={this.state.creator.name}
              onClosed={() => this.setState({ isDetailsModalOpened: false })}
            />
          </Card>
        </Swipeout >
      ) : <SvgAnimatedLinearGradient primaryColor="#cdfcfc"
        secondaryColor="#FEFFDE" height={300}>
          <Circle cx="30" cy="30" r="30" />
          <Rect x="75" y="13" rx="4" ry="4" width="100" height="13" />
          <Rect x="75" y="37" rx="4" ry="4" width="50" height="8" />
          <Rect x="0" y="70" rx="5" ry="5" width="400" height="200" />
          <Spinner style={{ marginTop: "40%" }}></Spinner>
        </SvgAnimatedLinearGradient>) : null);
  }
}
export default PublicEvent
