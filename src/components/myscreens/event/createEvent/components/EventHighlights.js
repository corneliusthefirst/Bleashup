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
      defaultUrl: require("../../../../../../Images/highlightphoto.jpg"),
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
          let highlight = find(Highlights, {
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
        let highlight = find(Highlights, {
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
      stores.Highlights.updateHighlightTitle(
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
      stores.Highlights.updateHighlightDescription(
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
      stores.Highlights.updateHighlightPublicState({
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
      stores.Highlights.addHighlight(newHighlight).then(() => {
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
            stores.Highlights.removeHighlight("newHighlightId").then(() => {
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
        Requester.createHighlight(newHighlight)
          .then(() => {
            this.props.reinitializeHighlightsList(newHighlight);
            this.resetHighlight();
            stores.Highlights.removeHighlight("newHighlightId").then(() => {
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
  choseAction(url) {
    if (url.video) {
      this.props.playVideo(url.video);
    } else {
      this.setState({
        newing: !this.state.newing,
        enlargeImage: true,
      });
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
      stores.Highlights.updateHighlightUrl(
        this.state.currentHighlight,
        false
      ).then(() => { });
    }
  }

  cleanAudio() {
    if (!this.props.updateState) {
      stores.Highlights.updateHighlightUrl({
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
        stores.Highlights.updateHighlightUrl({
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
  modalBody() {
    return this.state.isMounted ? (
      <View>
        <View style={{ height: ColorList.headerHeight, width: "100%" }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              ...bleashupHeaderStyle,
              paddingLeft: "2%",
            }}
          >
            <TouchableOpacity
              style={{ width: "20%", marginTop: "auto", marginBottom: "auto" }}
            >
              <Icon
                onPress={this.back}
                type="MaterialCommunityIcons"
                name="keyboard-backspace"
                style={{ color: ColorList.headerIcon }}
              />
            </TouchableOpacity>
            <Text
              elipsizeMode={"tail"}
              numberOfLines={1}
              style={{
                fontWeight: "500",
                width: "80%",
                marginTop: "auto",
                marginBottom: "auto",
              }}
            >
              {this.props.updateState ? "Update post" : "Add post"}
            </Text>
          </View>
        </View>
        <View
          style={{
            height: ColorList.containerHeight - (ColorList.headerHeight + 10),
            width: "90%",
            alignSelf: "center",
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false} ref={"scrollView"}>
            <View style={{ height: "100%" }}>
              <View
                style={{
                  height: height / 14,
                  alignItems: "center",
                  margin: "2%",
                }}
              >
                <Item
                  style={{
                    borderColor: "#1FABAB",
                    width: "95%",
                    margin: "2%",
                    height: height / 17,
                  }}
                  rounded
                >
                  <TextInput
                    maxLength={20}
                    style={{
                      width: "100%",
                      height: "100%",
                      margin: "2%",
                      marginBottom: "5%",
                    }}
                    value={
                      this.state.currentHighlight.title
                        ? this.state.currentHighlight.title
                        : ""
                    }
                    maxLength={40}
                    placeholder="Post Title"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    inverse
                    last
                    onChangeText={(value) => this.onChangedTitle(value)}
                  />
                </Item>
              </View>
              <View
                style={{
                  height: ColorList.containerHeight * .2,
                  width: "90%",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItem: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        newing: !this.state.newing,
                        enlargeImage: true,
                      })
                    }
                  >
                    {this.state.currentHighlight.url &&
                      this.state.currentHighlight.url.photo &&
                      testForURL(this.state.currentHighlight.url.photo) ? (
                        <CacheImages
                          thumbnails
                          source={{ uri: this.state.currentHighlight.url.photo }}
                          style={{
                            alignSelf: "center",
                            height: "100%",
                            width: "100%",
                            borderColor: "#1FABAB",
                            borderRadius:
                              this.state.currentHighlight.url.photo ||
                                this.state.currentHighlight.url.video
                                ? 10
                                : 100,
                          }}
                        />
                      ) : (
                        <Thumbnail
                          square
                          source={
                            this.state.currentHighlight.url &&
                              this.state.currentHighlight.url.photo
                              ? {
                                uri: this.state.currentHighlight.url.photo,
                              }
                              : this.state.defaultUrl
                          }
                          style={{
                            alignSelf: "center",
                            height: "100%",
                            width: "100%",
                            borderColor: "#1FABAB",
                            borderRadius:
                              this.state.currentHighlight.url.photo ||
                                this.state.currentHighlight.url.video
                                ? 10
                                : 100,
                          }}
                        ></Thumbnail>
                      )}
                  </TouchableOpacity>
                  {this.state.currentHighlight.url.video ? (
                    <View
                      style={{
                        position: "absolute",
                        marginTop: "15%",
                        marginLeft: "36%",
                        opacity: 0.9,
                      }}
                    >
                      <Icon
                        onPress={() => {
                          this.choseAction(this.state.currentHighlight.url);
                        }}
                        name={
                          this.state.currentHighlight.url.video
                            ? "play"
                            : "headset"
                        }
                        style={{
                          backgroundColor: "black",
                          opacity: 0.5,
                          borderRadius: 30,
                          fontSize: 50,
                          color: this.state.currentHighlight.url.audio
                            ? "yellow"
                            : "#FEFFDE",
                          alignSelf: "center",
                        }}
                        type={
                          this.state.currentHighlight.url.video
                            ? "EvilIcons"
                            : "MaterialIcons"
                        }
                      ></Icon>
                    </View>
                  ) : null}
                </View>
                {this.state.currentHighlight.url.video ||
                  this.state.currentHighlight.url.photo ? (
                    <View
                      style={{
                        ...buttoner,
                        position: "absolute",
                        alignSelf: "flex-end",
                      }}
                    >
                      <Icon
                        name={"close"}
                        type="EvilIcons"
                        onPress={() => this.cleanMedia()}
                        style={{
                          color: "white",
                          fontSize: 20,
                        }}
                      ></Icon>
                    </View>
                  ) : null}
              </View>
              {this.state.enlargeImage &&
                this.state.currentHighlight.url.photo ? (
                  <PhotoViewer
                    open={this.state.enlargeImage}
                    hidePhoto={() =>
                      this.setState({
                        newing: !this.state.newing,
                        enlargeImage: false,
                      })
                    }
                    photo={this.state.currentHighlight.url.photo}
                  />
                ) : null}
              <View style={{ marginTop: 5, marginBottom: 5, marginLeft: '5%', }}>
                <PickersUpload
                  currentURL={this.state.currentHighlight.url}
                  id={this.state.currentHighlight.id}
                  saveMedia={(url) => {
                    this.applySave(url);
                  }}
                ></PickersUpload>
              </View>
              {this.state.currentHighlight.url.audio ? (
                <View
                  style={{
                    height: height / 11,
                    alignSelf: "center",
                    backgroundColor: ColorList.bodyDarkWhite,
                    ...shadower(2),
                    margin: "3%",
                    width: "80%",
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
              <View
                style={{
                  height: height / 4.5,
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{ width: "90%", height: "90%", alignSelf: "center" }}
                >
                  {/* <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"500",fontSize:16}} >Description :</Text>*/}
                  <Textarea
                    value={this.state.currentHighlight.description}
                    containerStyle={{
                      width: "100%",
                      margin: "1%",
                      height: 130,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#1FABAB",
                      backgroundColor: "#f5fffa",
                    }}
                    placeholder="Post Content"
                    style={{
                      textAlignVertical: "top", // hack android
                      height: "100%",
                      fontSize: 14,
                      color: "#333",
                    }}
                    maxLength={3000}
                    onChangeText={(value) => this.onChangedDescription(value)}
                  />
                </View>
              </View>
              <Button
                transparent
                onPress={() => {
                  this.onchangeHighLightPublicState(
                    this.state.currentHighlight.public_state === "public"
                      ? "private"
                      : "public"
                  );
                }}
              >
                <Icon
                  name={
                    this.state.currentHighlight.public_state === "public"
                      ? "radio-button-checked"
                      : "radio-button-unchecked"
                  }
                  type={"MaterialIcons"}
                ></Icon>
                <Text>{`${this.state.currentHighlight.public_state}`}</Text>
              </Button>
              <View
                style={{
                  height: height / 10,
                  justifyContent: "space-between",
                  alignItem: "center",
                }}
              >
                {this.state.creating ? (
                  <Spinner></Spinner>
                ) : <View style={{ alignSelf: "flex-end" ,marginTop: 15,}}>
                    <TouchableOpacity
                      style={{ width: 100, minHeight: 40, borderRadius: 8, ...shadower(2), backgroundColor: ColorList.headerIcon, justifyContent: 'center', }}
                      onPress={() => {
                        !this.props.updateState ? this.AddHighlight() : this.updateHighlight();
                      }}
                    >
                      <Text
                        style={{
                          alignSelf: 'center',
                          color: ColorList.headerBackground,
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        {!this.state.updateState ? "Add Post" : "Update Post"}
                      </Text>
                    </TouchableOpacity>
                  </View>}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    ) : (
        <Spinner size={"small"} style={{ alignSelf: "center" }}></Spinner>
      );
  }
}
