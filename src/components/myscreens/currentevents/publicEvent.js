import React, { Component } from "react";
import {
  Image,
  Dimensions,
  View,
  TouchableOpacity,
  ActivityIndicator,
  activityIndicatorStyle
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
  Badge
} from "native-base";
import autobind from "autobind-decorator";
import ImageActivityIndicator from "./imageActivityIndicator";
import { createOpenLink } from "react-native-open-maps";
import UpdateStateIndicator from "./updateStateIndicator";
import SvgUri from "react-native-svg-uri";
import SVGs from "./svgsStrings";
import UserService from "../../../services/userHttpServices";
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

export default class PublicEvent extends Component {
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
    UserService.checkUser(this.props.Event.creator).then(creator => {
      this.setState({
        creator: {
          name: "Fokam Giles",
          status: "One Step Ahead The World",
          profile:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/GDC_onlywayaround.jpg/300px-GDC_onlywayaround.jpg"
        },
        fetching: false
      });
    });
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
          border: 50
        }}
        bordered
      >
        <CardItem
          style={{
            paddingBottom: 15
          }}
        >
          <Left>
            <Icon
              name="forward"
              type="Entypo"
              style={{
                fontSize: 16,
                color: "#0A4E52"
              }}
            />
            <Text note> Published </Text>
          </Left>
          {this.props.Event.updated ? <UpdateStateIndicator /> : null}
          <Right>
            <Icon
              name="dots-three-vertical"
              style={{
                color: "#0A4E52",
                fontSize: 16
              }}
              type="Entypo"
            />
          </Right>
        </CardItem>
        <CardItem>
          <Left>
            {this.props.Event.liked ? (
              <View style={{ flexDirection: "row" }}>
                <View>
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
                  <Text note> {this.props.Event.likes} Likers </Text>
                </View>
              </View>
            ) : (
                <View style={{ flexDirection: "row", flex: 5 }}>
                  <View>
                    <Icon
                      name="thumbs-up"
                      type="Entypo"
                      style={{
                        color: "#0A4E52",
                        fontSize: 23
                      }}
                    />
                  </View>
                  <View style={{ marginTop: 7 }}>
                    <Text note>{this.props.Event.likes} Likers</Text>
                  </View>
                </View>
              )}
          </Left>
          <Right>
            {this.props.Event.joint ? (
              <View>
                <SvgUri width={25} height={30} svgXmlData={SVGs.join} />
                <Text
                  style={{
                    color: "#0A4E52"
                  }}
                >
                  Joint
                </Text>
              </View>
            ) : (
                <View>
                  <SvgUri width={25} height={30} svgXmlData={SVGs.join} />
                  <Text
                    style={{
                      color: "#54F5CA"
                    }}
                  >
                    Join
                </Text>
                </View>
              )}
          </Right>
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
                <View style={{ flexDirection: "row", flex: 5 }}>
                  <View>
                    <Thumbnail
                      source={{
                        uri: this.state.creator.profile
                      }}
                    />
                  </View>
                  <View style={{ marginTop: 9 }}>
                    <Body>
                      <Text> {this.state.creator.name} </Text>
                      <Text note> {this.state.creator.status} </Text>
                    </Body>
                  </View>
                </View>
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
              <CacheableImage
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
              />
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
                <SvgUri style={{ borderRaduis: 20 }} width={22} height={30} svgXmlData={SVGs.event} />
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
                <SvgUri width={22} height={30} svgXmlData={SVGs.remind} />
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
      </Card>
    );
  }
}
