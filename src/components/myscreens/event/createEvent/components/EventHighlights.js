import React, { Component } from "react";
import {
  Content,
  Card,
  CardItem,
  Text,
  Body,
  Container,
  Icon,
  Header,
  Form,
  Item,
  Title,
  Input,
  Left,
  Right,
  H3,
  H1,
  H2,
  Spinner,
  Root,
  Button,
  InputGroup,
  DatePicker,
  Thumbnail,
  Alert,
  List,
  ListItem,
  Label,
  Toast,
} from "native-base";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import ActionButton from "react-native-action-button";
import Modal from "react-native-modalbox";
import autobind from "autobind-decorator";
import CacheImages from "../../../../CacheImages";
import Textarea from "react-native-textarea";
import HighlightCard from "./HighlightCard";
import stores from "../../../../../stores/index";
import { observer } from "mobx-react";
import moment from "moment";
import { find, reject } from "lodash";
import request from "../../../../../services/requestObjects";
import SearchImage from "./SearchImage";
import BleashupHorizontalFlatList from "../../../../BleashupHorizotalFlatList";
import testForURL from "../../../../../services/testForURL";
import SimpleAudioPlayer from "../../../highlights_details/SimpleAudioPlayer";
import Pickers from "../../../../../services/Picker";
import FileExachange from "../../../../../services/FileExchange";
import PhotoViewer from "../../PhotoViewer";
import { RNFFmpeg } from "react-native-ffmpeg";
import shadower from "../../../../shadower";
import Requester from "../../Requester";
import buttoner from "../../../../../services/buttoner";
import ColorList from "../../../../colorList";
import BleashupModal from "../../../../mainComponents/BleashupModal";
import bleashupHeaderStyle from "../../../../../services/bleashupHeaderStyle";
import PickersUpload from "./PickerUpload";
import MediaPreviewer from "./MediaPeviewer";
import CreationHeader from "./CreationHeader";
import CreateButton from './ActionButton';
import CreateTextInput from './CreateTextInput';

//create an extension to toast so that it can work in my modal

var uuid = require("react-native-uuid");
uuid.v1({
  node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
  clockseq: 0x1234,
  msecs: new Date().getTime(),
  nsecs: Math.floor(Math.random() * 5678) + 50,
});

const options = {
  title: "Select Avatar",
  //customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: "images",
    maxWidth: 600,
    maxHeight: 500,
    noData: true,
    allowEditing: true,
    quality: 0.8,
  },
};

let { height, width } = Dimensions.get("window");

export default class EventHighlights extends BleashupModal {
  initialize() {
    this.state = {
      enlargeImage: false,
      title: "",
      description: "",
      url: "",
      defaultUrl: require("../../../../../../Images/post.png"),
      initialScrollIndex: 2,
      highlightData: [],
      animateHighlight: false,
      currentHighlight: request.Highlight(),
      update: false,
      audioState: false,
      searchImageState: false,
      participant: null,
      isMounted: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.highlight_id !== this.props.highlight_id) {
      setTimeout(() => {
        stores.Highlights.readFromStore().then((Highlights) => {
          let highlight = find(Highlights[this.props.event_id], {
            id: this.props.highlight_id
              ? this.props.highlight_id
              : "newHighlightId",
          });
          this.previoushighlight = JSON.stringify(highlight);
          if (!this.props.event_id) {
            let event_id = "newEventId";
            stores.Highlights.fetchHighlights(event_id).then((Highlights) => {
              this.setState({
                newing: !this.state.newing,
                highlightData: Highlights,
                isMounted: true,
                currentHighlight: highlight ? highlight : request.Highlight(),
                update: this.props.highlight_id ? true : false,
              });
            });
          } else {
            this.setState({
              newing: !this.state.newing,
              isMounted: true,
              currentHighlight: highlight ? highlight : request.Highlight(),
              update: this.props.highlight_id ? true : false,
            });
          }
        });
        /*setInterval(() => {
          if ((this.state.animateHighlight == true) && (this.state.highlightData.length > 2)) {
            this.highlight_flatlistRef.scrollToIndex({ animated: true, index: this.state.initialScrollIndex, viewOffset: 0, viewPosition: 0 });
  
            if (this.state.initialScrollIndex >= (this.state.highlightData.length) - 2) {
              this.setState({ newing: !this.state.newing, initialScrollIndex: 0 })
            } else {
              this.setState({ newing: !this.state.newing, initialScrollIndex: this.state.initialScrollIndex + 2 })
            }
          }
        }, 4000)*/
      }, 100);
    }
  }

  componentDidMount() {
    setTimeout(() => {
      stores.Highlights.readFromStore().then((Highlights) => {
        let highlight = find(Highlights[this.props.event_id], {
          id: this.props.highlight_id
            ? this.props.highlight_id
            : "newHighlightId",
        });
        if (!this.props.event_id) {
          let event_id = "newEventId";
          stores.Highlights.fetchHighlights(event_id).then((Highlights) => {
            this.setState({
              newing: !this.state.newing,
              highlightData: Highlights,
              isMounted: true,
              currentHighlight: highlight ? highlight : request.Highlight(),
              update: this.props.highlight_id ? true : false,
            });
          });
        } else {
          this.setState({
            newing: !this.state.newing,
            isMounted: true,
            currentHighlight: highlight ? highlight : request.Highlight(),
            update: this.props.highlight_id ? true : false,
          });
        }
      });
    }, 100);
  }


  @autobind
  back() {
    this.setState({ newing: !this.state.newing, animateHighlight: false });
    this.props.onClosed();
  }

  @autobind
  resetHighlight() {
    this.state.currentHighlight = request.Highlight();
    this.state.currentHighlight.id = "newHighlightId";
    this.setState({
      newing: !this.state.newing,
      currentHighlight: this.state.currentHighlight,
    });
  }

  @autobind
  onChangedTitle(value) {
    //this.setState({newing:!this.state.newing,title:value})
    this.state.currentHighlight.title = value;
    this.setState({
      newing: !this.state.newing,
      currentHighlight: this.state.currentHighlight,
    });
    if (!this.props.updateState) {
      stores.Highlights.updateHighlightTitle(this.props.event_id,
        this.state.currentHighlight,
        false
      ).then(() => { });
    }
  }
  @autobind
  onChangedDescription(value) {
    //this.setState({newing:!this.state.newing,description:value})
    this.state.currentHighlight.description = value;
    this.setState({
      newing: !this.state.newing,
      currentHighlight: this.state.currentHighlight,
    });

    if (!this.props.updateState) {
      stores.Highlights.updateHighlightDescription(this.props.event_id,
        this.state.currentHighlight,
        false
      ).then(() => { });
    }
  }

  @autobind
  onchangeHighLightPublicState(value) {
    this.setState({
      currentHighlight: { ...this.state.currentHighlight, public_state: value },
      newing: !this.state.newing,
    });
    if (this.props.updateState === false) {
      stores.Highlights.updateHighlightPublicState(this.props.event_id, {
        highlight_id: this.state.currentHighlight.id,
        public_state: value,
      }).then((ele) => ele);
    }
  }

  @autobind
  AddHighlight() {
    var arr = new Array(32);
    let num = Math.floor(Math.random() * 16);
    uuid.v1(null, arr, num);
    let New_id = uuid.unparse(arr, num);
    let newHighlight = this.state.currentHighlight;
    newHighlight.id = New_id;
    newHighlight.event_id = this.props.event_id
      ? this.props.event_id
      : "newEventId"; //new event id
    //add the new highlights to global highlights
    newHighlight.creator = stores.LoginStore.user.phone;
    newHighlight.created_at = moment().format();
    if (!this.props.event_id) {
      stores.Highlights.addHighlight(newHighlight.event_id, newHighlight).then(() => {
        stores.Events.addHighlight(newHighlight.id, newHighlight.event_id).then(
          () => {
            this.setState(
              {
                newing: !this.state.newing,
                highlightData: [...this.state.highlightData, newHighlight],
              },
              () => {
                console.log("after", this.state.highlightData);
              }
            );
            this.resetHighlight();
            stores.Highlights.removeHighlight(newHighlight.event_id, "newHighlightId").then(() => {
              this.setState({
                creating: false,
              });
            });
          }
        );
      });
    } else {
      this.props.startLoader();
      this.props.onClosed();
      if (
        newHighlight.title ||
        newHighlight.url.audio ||
        newHighlight.url.photo ||
        newHighlight.url.video
      ) {
        this.setState({
          creating: true,
        });
        Requester.createHighlight(newHighlight,this.props.event.about.title)
          .then(() => {
            this.props.reinitializeHighlightsList(newHighlight);
            this.resetHighlight();
            stores.Highlights.removeHighlight(newHighlight.event_id, "newHighlightId").then(() => {
              this.props.stopLoader();
              this.setState({
                creating: false,
              });
            });
          })
          .catch(() => {
            this.props.stopLoader();
            this.setState({
              creating: false,
            });
          });
      } else {
        Toast.show({
          text: "Post Must include at least a media or title",
          duration: 5000,
          buttonText: "ok",
        });
        this.props.stopLoader();
      }
    }
  }

  @autobind
  updateHighlight() {
    this.setState({ newing: !this.state.newing, update: false });
    if (this.props.highlight_id) {
      this.props.update(this.state.currentHighlight, this.previoushighlight);
      this.props.onClosed();
      //this.resetHighlight();
    }
  }
  applySave(url) {
    this.setState({
      newing: !this.state.newing,
      currentHighlight: {
        ...this.state.currentHighlight,
        url: url
      },
    });
    if (!this.props.updateState) {
      stores.Highlights.updateHighlightUrl(this.props.event_id,
        this.state.currentHighlight,
        false
      ).then(() => { });
    }
  }

  swipeToClose=false
  cleanAudio() {
    if (!this.props.updateState) {
      stores.Highlights.updateHighlightUrl(this.props.event_id, {
        ...this.state.currentHighlight,
        url: {
          ...this.state.currentHighlight.url,
          audio: null,
          duration: null
        },
      },
        false
      ).then(() => {
        this.setState({
          newing: !this.state.newing,
          currentHighlight: {
            ...this.state.currentHighlight,
            url: {
              ...this.state.currentHighlight.url,
              audio: null,
              duration: null
            },
          },
        });
      });
    } else {
      this.setState({
        newing: !this.state.newing,
        currentHighlight: {
          ...this.state.currentHighlight,
          url: {
            ...this.state.currentHighlight.url,
            audio: null,
            duration: null
          },
        },
      });
    }
  }
  exchanger = null;
  cleanMedia() {
    if (!this.props.updateState) {
      this.setState({
        newing: !this.state.newing,
        currentHighlight: {
          ...this.state.currentHighlight,
          url: {
            ...this.state.currentHighlight.url,
            photo: null,
            video: null,
            //audio: null,
            //duration: null
          },
        },
      });
      !this.props.updateState &&
        stores.Highlights.updateHighlightUrl(this.props.event_id, {
          ...this.state.currentHighlight,
          url: {
            ...this.state.currentHighlight.url,
            photo: null,
            video: null,
          },
        });
    } else {
      this.setState({
        newing: !this.state.newing,
        currentHighlight: {
          ...this.state.currentHighlight,
          url: {
            ...this.state.currentHighlight.url,
            photo: null,
            video: null,
          },
        },
      });
    }
  }
  @autobind
  deleteHighlight(id) {
    this.state.highlightData = reject(this.state.highlightData, { id, id });
    this.setState({
      newing: !this.state.newing,
      highlightData: this.state.highlightData,
    });
  }

  _keyExtractor = (item, index) => item.id;

  _getItemLayout = (data, index) => ({
    length: 100,
    offset: 100 * index,
    index,
  });
  rendering = 0;
  onClosedModal() {
    this.props.onClosed();
    this.setState({
      animateHighlight: false,
    });
  }
  center={marginBottom: 'auto',marginTop: 'auto',}
  width='90%'
  modalBody() {
    return this.state.isMounted ? (
      <View>
       <CreationHeader
       back={this.back}
        title={this.props.updateState ? "Update Post" : "Add New Post"}
       >
       </CreationHeader>
        <View
          style={{
            height: ColorList.containerHeight - (ColorList.headerHeight + 10),
            width: '100%',
            alignSelf: "center",
          }}
        >
          <ScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false} ref={"scrollView"}>
            <View style={{ height: "100%" }}>
            <View style={{width:this.width,alignSelf: 'center',}}>
            <CreateTextInput
                height={height/11}
                value={this.state.currentHighlight.title
                  ? this.state.currentHighlight.title
                  : ""}
                onChange={this.onChangedTitle}
                placeholder={"title"}
            >
            </CreateTextInput>
            </View>
            <View style={{width:this.width,alignSelf: 'center',}}>
            <CreateTextInput
                height={height/6}
                value={this.state.currentHighlight.description
                  ? this.state.currentHighlight.description
                  : ""}
                onChange={this.onChangedDescription}
                placeholder={"description"}
                maxLength={3000}
                numberOfLines={5}
                multiline={true}
                backgroundColor={"#fbfafd"}
            >
            </CreateTextInput>
              </View>
              <View style={{ marginTop: 5, marginBottom: 5,width:this.width,alignSelf:"center",alignItems:"flex-start" }}>
                <PickersUpload
                notAudio
                  creating={!this.props.updateState}
                  currentURL={this.state.currentHighlight.url}
                  id={this.state.currentHighlight.id}
                  saveMedia={(url) => {
                    this.applySave(url);
                  }}
                ></PickersUpload>
              </View>
                <View style={{width:this.width,alignSelf: 'center',}}>
              <MediaPreviewer
                height={ColorList.containerHeight * 0.22}
                defaultPhoto={this.state.defaultUrl}
                url={this.state.currentHighlight.url}
                cleanMedia={() => this.cleanMedia()}
              ></MediaPreviewer>
              </View>
              {this.state.currentHighlight.url.audio ? (
                <View
                  style={{
                    height: height / 11,
                    alignSelf: "center",
                    backgroundColor: ColorList.bodyDarkWhite,
                    ...shadower(2),
                    margin: "3%",
                    width: this.width, 
                  }}
                >
                  <SimpleAudioPlayer
                    url={this.state.currentHighlight.url}
                  ></SimpleAudioPlayer>

                  <Icon
                    name={"close"}
                    type="EvilIcons"
                    onPress={() => this.cleanAudio()}
                    style={{
                      color: "red",
                      position: "absolute",
                      alignSelf: "flex-end",
                      fontSize: 20,
                    }}
                  ></Icon>
                </View>
              ) : null}
              
              <TouchableOpacity
                transparent
                onPress={() => {
                  this.onchangeHighLightPublicState(
                    this.state.currentHighlight.public_state === "public"
                      ? "private"
                      : "public"
                  );
                }}
                style={{marginTop:"3%",flexDirection:"row",height:40,alignItems:"center",
                width:this.width,
                alignSelf: 'center',
                marginBottom: '3%',}}
              >
                <Icon
                  name={
                    this.state.currentHighlight.public_state === "public"
                      ? "radio-button-checked"
                      : "radio-button-unchecked"
                  }
                  type={"MaterialIcons"}
                  style={{fontSize:22,width:'15%',...this.center}}
                ></Icon>
                <Text style={{color:ColorList.bodyText,...this.center}}>{`${this.state.currentHighlight.public_state}`}</Text>
              </TouchableOpacity>


                {this.state.creating ? (
                  <Spinner></Spinner>
                ) :<CreateButton
                    action={!this.props.updateState ? this.AddHighlight : this.updateHighlight}
                    title={!this.props.updateState ? "Add New Post" : "Update Post"}
                    width={this.width}
                >
                </CreateButton>}
             
            </View>
          </ScrollView>
        </View>
      </View>
    ) : (
        <Spinner size={"small"} style={{ alignSelf: "center" }}></Spinner>
      );
  }
}