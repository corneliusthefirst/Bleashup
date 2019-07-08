import React, { Component } from "react";
import {
  Image,
  Dimensions,
  View,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  activityIndicatorStyle
} from "react-native";
import imageCacheHoc from "react-native-image-cache-hoc";
const w = Dimensions.get("window");
import EStyleSheet from "react-native-extended-stylesheet";
import {
  Content,
  Card,
  CardItem,
  Container,
  Text,
  Icon,
  Item,
  Body,
  Left,
  Button,
  Thumbnail,
  DeckSwiper,
  Right,
  Title,
  Badge
} from "native-base";
import ImageActivityIndicator from "./imageActivityIndicator";
import NestedScrollView from "react-native-nested-scroll-view";
import GState from "../../../stores/globalState";
import emitter from "../../../services/eventEmiter";
import stores from "../../../stores";
import { createOpenLink } from "react-native-open-maps";
import UpdateStateIndicator from "./updateStateIndicator";
import SvgUri from "react-native-svg-uri";
import RequestObject from "../../../services/requestObjects";
import PrivateEvent from "./PrivateEvent";
import PublicEvent from "./publicEvent";
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

const Events = [
  {
    about: {
      title: "This is a sample Event",
      description: ""
    },
    period: {
      date: {
        year: "2018",
        month: "April",
        day: "25"
      },
      time: {
        hour: "12",
        mins: "45",
        secs: "15 GMT"
      }
    },
    event_update: true,
    contribution_updated: true,
    vote_updated: true,
    highlight_updated: true,
    remind_updated: true,
    background:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/GDC_onlywayaround.jpg/300px-GDC_onlywayaround.jpg",
    creator: "650594616",
    location: {
      string: "General Hospital Bertoua",
      url: "some url"
    },
    liked: true,
    joint: true,
    public: true,
    likes: 12
  },
  {
    about: {
      title: "This is a sample Event",
      description: ""
    },
    period: {
      date: {
        year: "2018",
        month: "April",
        day: "25"
      },
      time: {
        hour: "12",
        mins: "45",
        secs: "15 GMT"
      }
    },
    event_update: true,
    contribution_updated: true,
    vote_updated: true,
    highlight_updated: true,
    remind_updated: true,
    background:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/GDC_onlywayaround.jpg/300px-GDC_onlywayaround.jpg",
    creator: "650594616",
    location: {
      string: "General Hospital Bertoua",
      url: "some url"
    },
    liked: false,
    joint: true,
    public: false,
    likes: 12
  },
  {
    about: {
      title: "This is a sample Event",
      description: ""
    },
    period: {
      date: {
        year: "2018",
        month: "April",
        day: "25"
      },
      time: {
        hour: "12",
        mins: "45",
        secs: "15 GMT"
      }
    },
    liked: true,
    event_update: true,
    contribution_updated: true,
    vote_updated: true,
    highlight_updated: true,
    remind_updated: true,
    background:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/GDC_onlywayaround.jpg/300px-GDC_onlywayaround.jpg",
    creator: "650594616",
    location: {
      string: "General Hospital Bertoua",
      url: "some url"
    },
    joint: false,
    public: true,
    likes: 12
  }
];

const Query = { query: "central hospital Bertoua" };
const OpenLink = createOpenLink(Query);
const OpenLinkZoom = createOpenLink({ ...Query, zoom: 50 });
export default class CurrentEventView extends Component {
  componentDidMount() {
    stores.Events.readFromStore().then(Events => {
      this.setState({
        loadingEvents: false,
        Events: Events
      });
    });
  }
  state = {
    currentIndex: 0,
    loadingEvents: true,
    Events: undefined
  };
  _renderItem() {
    return Events.map(event => {
      return event.public ? (
        <PublicEvent key={event.id} Event={event} />
      ) : (
        <PrivateEvent key={event.id} Event={event} />
      );
    });
  }
  render() {
    return this.state.loadingEvents ? (
      <ImageActivityIndicator />
    ) : (
      <Container>
        <NestedScrollView
          onScroll={nativeEvent => {
            GState.scrollOuter = true;
          }}
          alwaysBounceHorizontal={true}
          scrollEventThrottle={16}
        >
          <Content>{this._renderItem()}</Content>
        </NestedScrollView>
      </Container>
    );
  }
}
