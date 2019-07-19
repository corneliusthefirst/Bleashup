import React, { Component } from "react";
import {
  Image,
  Dimensions,
  View,
  TouchableOpacity,
  ActivityIndicator,
  activityIndicatorStyle,
  DeviceEventEmitter
} from "react-native";
import imageCacheHoc from "react-native-image-cache-hoc";
const w = Dimensions.get("window");
import {
  Card,
  CardItem,
  Text,
  Icon,
  Body,
  Left,
  Button,
  Thumbnail,
  DeckSwiper,
  Right,
  Title,
  Badge,
  Footer
} from "native-base";
import autobind from "autobind-decorator";
import ImageActivityIndicator from "./imageActivityIndicator";
import { createOpenLink } from "react-native-open-maps";
import UpdateStateIndicator from "./updateStateIndicator";
import SvgUri from "react-native-svg-uri";
import SVGs from "./svgsStrings";
import DetailsModal from "../../DetailsModal";
import ProfileModal from "../../ProfileModal";
import PhotoModal from "../../PhotoModal";
import UserService from "../../../services/userHttpServices";
import stores from "../../../stores"
import ProfileView from "../../ProfileView"
import CacheImages from "../../CacheImages";
const entireScreenWidth = Dimensions.get("window").width;
const rem = entireScreenWidth / 380;
const CacheableImage = imageCacheHoc(Image, {
  defaultPlaceholder: {
    component: ImageActivityIndicator,
    props: {
      style: activityIndicatorStyle
    }
  }
});

export default class PrivateEvent extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    fetching: true,
    creator: (creator = { name: "", status: "", profile: "" })
  };
  @autobind navigateToEventDetails() {
    this.props.navigation.navigate("Event", {
      Event: this.props.Event,
      tab: "EventDetails"
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
        event_title: this.props.Event.about.title,
        event_description: this.props.Event.description
      }
      this.fetchHightlight(this.props.Event.id).then(Highlights => {
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
  @autobind navigateToReminds() {
    this.props.navigation.navigate("Event", {
      Event: this.props.Event,
      tab: "Reminds"
    });
  }
  @autobind navigateToHighLights() {
    this.props.navigation.navigate("Event", {
      Event: this.props.Event,
      tab: "Highlights"
    });
  }
  @autobind navigateToEventChat() {
    this.props.navigation.navigate("Event", {
      Event: this.props.Event,
      tab: "EventChat"
    });
  }
  @autobind navigateToVotes() {
    this.props.navigation.navigate("Event", {
      Event: this.props.Event,
      tab: "Votes"
    });
  }
  @autobind navigateToContributions() {
    this.props.navigation.navigate("Event", {
      Event: this.props.Event,
      tab: "Contributions"
    });
  }
  Query = { query: this.props.Event.location.string };
  OpenLink = createOpenLink(this.Query);
  OpenLinkZoom = createOpenLink({ ...this.Query, zoom: 50 });
  componentDidMount() {
    this.eventListener = DeviceEventEmitter.addListener('StatusModalClosed', this.handleEvent);
    this.eventListener2 = DeviceEventEmitter.addListener('PhotoModalClosed', this.handleEvent2);
    this.eventListener3 = DeviceEventEmitter.addListener('DetailsModalClosed', this.handleEvent3);
    this.eventListener4 = DeviceEventEmitter.addListener('joining', this.handleEvent4);
    UserService.checkUser(this.props.Event.creator).then(creator => {
      this.formDetailFormData().then((details) => {
        this.setState({
          creator: {
            name: "Fokam Giles",
            status: "One Step Ahead The World",
            image:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/GDC_onlywayaround.jpg/300px-GDC_onlywayaround.jpg"
          },
          fetching: false,
          details: details
        });
      });
    })
  }
  componentWillUnmount() {
    this.eventListener.remove();
    this.eventListener2.remove()
    this.eventListener3.remove()
    this.eventListener4.remove()
  }
  handleEvent = (event) => {
    this.setState({
      isProfileModalOpened: false
    })
  }
  handleEvent2 = (event) => {
    this.setState({
      isPhotoModalOpened: false
    })
  }

  handleEvent3 = (event) => {
    this.setState({
      isDetailsModalOpened: false
    })
  }
  handleEvent4 = (event) => {
    this.props.Event.joint = true
    this.setState({
      isDetailsModalOpened: false
    })
    console.warn('joint!')
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
    return (
      <Card
        style={{
          borderColor: "#1FABAB",
          border: 50,

        }}
        bordered
      >
        <CardItem>
          {this.props.Event.updated ? <UpdateStateIndicator /> : null}

          <View style={{ marginTop: "2%", marginLeft: "97%" }}>
            <Icon
              name="dots-three-vertical"
              style={{ color: "#0A4E52", fontSize: 16, }}
              type="Entypo"
            />
          </View>

        </CardItem>
        <CardItem
          style={{
            paddingBottom: 20,
            paddingTop: 10
          }}
        >
          <Left>
            {this.state.fetching ? (
              <ImageActivityIndicator />
            ) : (
                <TouchableOpacity onPress={() => this.setState({ isProfileModalOpened: true })}>
                  <View style={{ flexDirection: "row", flex: 5 }}>
                    <ProfileView profile={(this.state.creator)}></ProfileView>
                  </View>
                </TouchableOpacity>

              )}
          </Left>
        </CardItem>
        <CardItem
          style={{
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <TouchableOpacity onPress={this.navigateToEventDetails}>
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
                {this.props.Event.about.title}
              </Text>
              <Text
                style={{
                  color: "#1FABAB"
                }}
                note
              >
                {this.props.Event.period.date.year +
                  "-" +
                  this.props.Event.period.date.month +
                  "-" +
                  this.props.Event.period.date.day +
                  "  at " +
                  this.props.Event.period.time.hour +
                  "-" +
                  this.props.Event.period.time.mins +
                  "-" +
                  this.props.Event.period.time.secs}
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
            <View
              style={{
                width: "70%"
              }}
            >
              <TouchableOpacity onPress={() => this.setState({ isPhotoModalOpened: true })}>
                <CacheImages
                  source={{
                    uri: this.props.Event.background
                  }}
                  parmenent={false}
                  style={{
                    height: 125,
                    width: "100%",
                    borderRadius: 15
                  }}
                  resizeMode="contain"
                  onLoad={() => { }}
                /></TouchableOpacity>

            </View>
          </Left>
          <Right>
            <View>
              <TouchableOpacity>
                <Text ellipsizeMode="clip" numberOfLines={2}>
                  {this.props.Event.location.string}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.OpenLinkZoom}>
                <Image
                  source={require("../../../../Images/google-maps-alternatives-china-720x340.jpg")}
                  style={{
                    height: 60,
                    width: "30%",
                    borderRadius: 15
                  }}
                  resizeMode="contain"
                  onLoad={() => { }}
                />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <TouchableOpacity onPress={this.OpenLink}>
                  <Text note> View On Map </Text>
                </TouchableOpacity>
              </View>
            </View>
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
                <SvgUri style={{ borderRaduis: 20 }} width={25} height={30} svgXmlData={SVGs.event} />
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
                <SvgUri width={25} height={30} svgXmlData={SVGs.remind} />
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
                <SvgUri width={25} height={30} svgXmlData={SVGs.chat} />
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
                <SvgUri width={22} height={30} svgXmlData={SVGs.highlight} />
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
                <SvgUri width={25} height={30} svgXmlData={SVGs.vote} />
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
                <SvgUri width={25} height={30} svgXmlData={SVGs.contribution} />
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

          {this.props.Event.liked ? (
            <View style={{ flexDirection: "row" }}>
              <View >
                <Icon
                  name="thumbs-up"
                  type="Entypo"
                  style={{
                    color: "#54F5CA",
                    fontSize: 23
                  }}
                />
              </View>
              <View style={{ marginTop: 7 }}>
                <Text style={{ color: "#54F5CA" }} note> {this.props.Event.likes} Likers </Text>
              </View>
            </View>
          ) : (
              <View style={{ flexDirection: "row", flex: 5 }}>
                <View style={{ marginTop: "3%" }}>
                  <Icon
                    name="thumbs-up"
                    type="Entypo"
                    style={{
                      color: "#0A4E52",
                      fontSize: 23
                    }}
                  />
                </View>
                <View style={{ marginTop: "5%" }}>
                  <Text style={{ color: "#0A4E52" }} note>{this.props.Event.likes} Likers</Text>
                </View>
              </View>
            )}


        </Footer>
        <DetailsModal
          isToBeJoint
          isOpen={this.state.isDetailsModalOpened}
          details={this.state.details}
          created_date={this.props.Event.created_at}
          location={this.props.Event.location.string}
          event_organiser_name={this.state.creator.name}
        />
        <ProfileModal
          isOpen={this.state.isProfileModalOpened}
          profile={this.state.creator} />
        <PhotoModal isOpen={this.state.isPhotoModalOpened} image={this.props.Event.background} />
      </Card>
    );
  }
}
