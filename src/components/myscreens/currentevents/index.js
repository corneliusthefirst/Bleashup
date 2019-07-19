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
    id: "1",
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
    created_at: "16-11-2018",
    description: `Job Description Writing Process
The process of writing a job description requires having a clear understanding of the job’s duties and responsibilities. The job posting should also include a concise picture of the skills required for the position to attract qualified job candidates. Organize the job description into five sections: Company Information, Job Description, Job Requirements, Benefits and a Call to Action. Be sure to include keywords that will help make your job posting searchable. A well-defined job description will help attract qualified candidates as well as help reduce employee turnover  in the long run.

Use the sample job postings below to help write your job description and improve your job posting results. Then when you're ready, post your job on Monster to reach the right talent – act now and save 20% when you buy a 60-day job ad!`,
    liked: true,
    updated: true,
    highlights: [87, 11, 10, 9],
    contribution_updated: true,
    vote_updated: true,
    past: false,
    highlight_updated: true,
    remind_upated: true,
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
    id: "2",
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
    created_at: "12-11-2015",
    description: `his account development manager sample job description can assist in your creating a job application that will attract job candidates who are qualified for the job. Feel free to revise this job description to meet your specific job duties and job requirements.

Account Development Manager Job Responsibilities:
Develops new business by analyzing account potential; initiating, developing, and closing sales; recommending new applications and sales strategies.

 

Account Development Manager Job Duties:
Identifies development potential in accounts by studying current business; interviewing key customer personnel and company personnel who have worked with customer; identifying and evaluating additional needs; analyzing opportunities.
Initiates sales process by building relationships; qualifying potential; scheduling appointments.
Develops sales by making initial presentation; explaining product and service enhancements and additions; introducing new products and services.`,
    event_update: true,
    contribution_updated: true,
    vote_updated: true,
    past: false,
    highlight_updated: true,
    highlights: [4, 7, 6, 5],
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
    id: "3",
    about: {
      title: "This is a sample Event",
      description: ""
    },
    highlights: [1, 2, 3, 4],
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
    update: true,
    description: `What Is a Job Description?
A job description is an internal document that clearly states the essential job requirements, job duties, job responsibilities, and skills required to perform a specific role. A more detailed job description will cover how success is measured in the role so it can be used during performance evaluations.

They are also known as a job specification, job profiles, JD, and position description (job PD).`,
    contribution_updated: true,
    vote_updated: true,
    past: true,
    created_at: "12-12-2014",
    highlight_updated: true,
    remind_upated: true,
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
import routerActions from "reazy-native-router-actions";
const Query = { query: "central hospital Bertoua" };
const OpenLink = createOpenLink(Query);
const OpenLinkZoom = createOpenLink({ ...Query, zoom: 50 });
export default class CurrentEventView extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    stores.Events.readFromStore().then(Events => {
      console.warn(Events, "****")
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
        <PublicEvent key={event.id} {...this.props} Event={event} />
      ) : (
          <PrivateEvent key={event.id} {...this.props} Event={event} />
        );
    });
  }
  render() {
    return this.state.loadingEvents ? (
      <ImageActivityIndicator />
    ) : (
        <Container>
          <NestedScrollView
            /*  onScroll={nativeEvent => {
                GState.scrollOuter = true;
              }}*/
            alwaysBounceHorizontal={true}
          // scrollEventThrottle={16}
          >
            <Content>{this._renderItem()}</Content>
          </NestedScrollView>
        </Container>
      );
  }
}
