import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  BackHandler,
  Text,
} from "react-native";
import moment from "moment";
import { head, find } from "lodash";
import request from "../../../../services/requestObjects";
import stores from "../../../../stores/index";
import CreateRequest from "./CreateRequester";
import firebase from "react-native-firebase";
import colorList from "../../../colorList";
//for photos
import SearchImage from "./components/SearchImage";
import Pickers from "../../../../services/Picker";
import FileExchange from "../../../../services/FileExchange";
import testForURL from "../../../../services/testForURL";
import shadower from "../../../shadower";
import CacheImages from "../../../CacheImages";
import CreateTextInput from "../../event/createEvent/components/CreateTextInput";
import bleashupHeaderStyle from "../../../../services/bleashupHeaderStyle";
import CreateButton from "../../event/createEvent/components/ActionButton";
import Toaster from "../../../../services/Toaster";
import Ionicons from "react-native-vector-icons/Ionicons";
import GState from "../../../../stores/globalState/index";
import Spinner from "../../../Spinner";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Texts from "../../../../meta/text";
import BeNavigator from "../../../../services/navigationServices";
import ActivityPages from '../../eventChat/chatPages';
import ColorList from "../../../colorList";
import rounder from "../../../../services/rounder";
import AntDesign from 'react-native-vector-icons/AntDesign';
import BeComponent from '../../../BeComponent';
import AnimatedComponent from '../../../AnimatedComponent';

let { height, width } = Dimensions.get("window");

export default class CreateEventView extends AnimatedComponent {
  initialize() {
    this.state = {
      colorWhenChoosed: ColorList.indicatorColor,
      currentEvent: request.Event(),
      participant: null,
      title: "",
      showMore: false,
      photo: "",
      DefaultPhoto: require("../../../../../Images/activity_post.png"),
      searchImageState: false,
    };
    this.togglMore = this.togglMore.bind(this)
  }
  togglMore() {
    this.setStatePure({
      showMore: !this.state.showMore
    })
  }
  componentDidMount() {
    stores.Events.readFromStore().then((Events) => {
      let event = find(Events, { id: request.Event().id });
      this.setStatePure({
        showMore: false,
        participant: this.isRemind ? request.Event().participant : head(event.participant),
        currentEvent: event,
        title: this.isRemind ? Texts.my_activity : event.about.title,
        photo: this.isRemind ? null : event.background,
      });
    });
  }
  getParam = (param) => this.props.navigation.getParam(param)
  isRemind = this.getParam("remind")
  back = () => {
    this.props.navigation.navigate("Home");
  };
  navigateToActivity = (event) => {
    this.props.navigation.navigate("Event", {
      Event: event,
      tab: this.isRemind ? ActivityPages.reminds : ActivityPages.chat,
      currentRemindMembers: request.Event().participant
    });
  };

  creatEvent = () => {
    if (!this.state.currentEvent.about.title) {
      Toaster({ text: Texts.event_must_have_a_name, duration: 4000 });
    } else {
      this.setStatePure({
        creating: true,
      });
      let event = this.state.currentEvent;
      event.created_at = moment().format();
      event.participant = this.state.participant
      event.updated_at = moment().format();
      CreateRequest.createEvent(event)
        .then((res) => {
          this.setStatePure({
            currentEvent: request.Event(),
            title: "",
            photo: "",
            creating: false,
          });
          stores.Events.delete(request.Event().id).then(() => {
            this.navigateToActivity(res);
          });
        })
        .catch(() => {
          this.setStatePure({
            creating: false,
          });
        });
    }
  };

  onChangedTitle = (value) => {
    this.state.currentEvent.about.title = value;
    this.setStatePure({ title: value, currentEvent: this.state.currentEvent });
    stores.Events.updateTitle(request.Event().id, value, false).then(() => { });
  };

  //for photo
  TakePhotoFromCamera = () => {
    Pickers.SnapPhoto(true).then((res) => {
      this.setStatePure({
        uploading: true,
      });
      let exchanger = new FileExchange(
        res.source,
        "/Photo/",
        res.size,
        0,
        null,
        (newDir, path, total) => {
          this.setStatePure({ photo: path });
          this.state.currentEvent.background = path;
          this.setStatePure({ currentEvent: this.state.currentEvent });
          stores.Events.updateBackground("newEventId", path, false).then(() => {
            this.setStatePure({
              uploading: false,
            });
          });
        },
        () => {
          Toaster({ text: Texts.unable_to_upload, position: "top" });
          this.setStatePure({
            uploading: false,
          });
        },
        (error) => {
          Toaster({ text: Texts.unable_to_upload, position: "top" });
          this.setStatePure({
            uploading: false,
          });
        },
        res.content_type,
        res.filename,
        "/photo"
      );
      this.state.photo ? exchanger.deleteFile(this.state.photo) : null;
      exchanger.upload(0, res.size);
    });
  };

  resetPhoto = () => {
    let exchanger = new FileExchange();
    exchanger.deleteFile(this.state.photo);
    stores.Events.updateBackground("newEventId", null).then(() => {
      this.setStatePure({
        photo: null,
      });
    });
  };

  TakePhotoFromLibrary = () => {
    return new Promise((resolve, reject) => {
      ImagePicker.openPicker({
        cropping: true,
        quality: "medium",
      }).then((response) => {
        let res = head(response);
        this.setStatePure({ photo: res.path });
        this.state.currentEvent.background = res.path;
        this.setStatePure({ currentEvent: this.state.currentEvent });
        stores.Events.updateBackground(
          request.Event().id,
          res.path,
          false
        ).then(() => { });
        resolve(res.path);
      });
    });
  };
  openPhoto() {
    BeNavigator.openPhoto(this.state.photo);
  }

  render() {
    return (
      <View style={{ height: "100%", width: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            height: colorList.headerHeight,
            width: colorList.headerWidth,
            backgroundColor: colorList.headerBackground,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: colorList.headerBackground,
              flexDirection: "row",
              alignItems: "flex-start",
              paddingLeft: "3%",
              ...bleashupHeaderStyle,
            }}
          >
            <View
              style={{ width: "10%", justifyContent: "center", height: "100%" }}
            >
              <MaterialIcons
                onPress={() => {
                  this.props.navigation.navigate("Home");
                }}
                style={{
                  ...GState.defaultIconSize,
                  color: colorList.headerIcon,
                }}
                name={"arrow-back"}
              />
            </View>
            <View
              style={{ justifyContent: "center", height: "100%", width: "37%" }}
            >
              <Text
                style={{
                  color: colorList.headerText,
                  fontSize: colorList.headerFontSize,
                  fontWeight: colorList.headerFontweight,
                }}
              >
                {Texts.new_activity}
              </Text>
            </View>
          </View>
        </View>
        <ScrollView style={{ height: "92%", flexDirection: "column" }}>
          <View style={{ marginTop: "5%", width: "80%", alignSelf: "center" }}>
            <CreateTextInput
              maxLength={100}
              autoFocus={this.isRemind}
              height={height / 12}
              value={this.state.title}
              onChange={this.onChangedTitle}
              placeholder={Texts.activity_name}
            ></CreateTextInput>
          </View>
          {this.state.showMore ? <View
            style={{
              height: colorList.containerHeight / 16,
              alignItems: "flex-end",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItem: "center",
              marginRight: "8%",
            }}
          >
            <Text
              style={{
                left: 0,
                position: "absolute",
                marginLeft: "12.5%",
                color: colorList.bodyText,
              }}
            >
              @{Texts.activity_photo}
            </Text>
            <EvilIcons
              name="camera"
              active={true}
              type="EvilIcons"
              style={{ color: colorList.bodyIcon, fontSize: 36 }}
              onPress={() => {
                this.TakePhotoFromCamera();
              }}
            />

            <MaterialIconCommunity
              name="download-outline"
              active={true}
              type="MaterialCommunityIcons"
              style={{ ...GState.defaultIconSize, color: colorList.bodyIcon }}
              onPress={() => {
                this.setStatePure({ searchImageState: true });
              }}
            />
          </View> : null}
          {this.state.showMore ? <View style={{ height: GState.height * .24, justifyContent: "center" }}>
            <TouchableOpacity
              onPress={() =>
                this.state.photo && testForURL(this.state.photo)
                  ? this.openPhoto()
                  : null
              }
            >
              {this.state.photo && testForURL(this.state.photo) ? (
                <CacheImages
                  thumbnails
                  square
                  source={{ uri: this.state.photo }}
                  style={{
                    height: "90%",
                    width: "81%",
                    borderRadius: 5,
                    alignSelf: "center",
                  }}
                />
              ) : (
                  <Image
                    resizeMode={"cover"}
                    source={
                      this.state.photo
                        ? { uri: this.state.photo }
                        : this.state.DefaultPhoto
                    }
                    style={{
                      alignSelf: "center",
                      height: "90%",
                      width: "81%",
                      borderRadius: 5,
                    }}
                  ></Image>
                )}
            </TouchableOpacity>
            {this.state.photo ? (
              <View
                style={{
                  position: "absolute",
                  alignSelf: "flex-end",
                  marginBottom: "33%",
                  paddingRight: "11%",
                }}
              >
                <TouchableOpacity
                  style={{
                    ...rounder(40, ColorList.buttonerBackground),
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    this.resetPhoto();
                  }}
                >
                  <EvilIcons
                    name={"close"}
                    type={"EvilIcons"}
                    style={{ ...GState.defaultIconSize, color: ColorList.bodyBackground }}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
            {this.state.uploading ? (
              <View
                style={{
                  marginTop: "30%",
                  marginLeft: "37%",
                  position: "absolute",
                }}
              >
                <Spinner color={colorList.headerBackground}></Spinner>
              </View>
            ) : null}
          </View> : null}
          <TouchableOpacity onPress={this.togglMore} style={{
            width: '80%',
            alignSelf: 'center',
            height: 35,
            marginVertical: '5%',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <View style={{ width: 30 }}>
              <AntDesign
                style={{
                  ...GState.defaultIconSize,
                  color: ColorList.likeActive,
                  fontSize: 18,
                }} name={this.state.showMore ? "upcircle" : "downcircle"} >

              </AntDesign>
            </View>
            <View>
              <Text style={{ 
                ...GState.defaultTextStyle,
                fontStyle: 'italic',
               }}>{this.state.showMore ? Texts.show_less : Texts.show_more}</Text>
            </View>
          </TouchableOpacity>
          {this.state.creating ? (
            <Spinner></Spinner>
          ) : (
              <View style={{
                width: '100%',
              }}>
                <CreateButton
                  action={this.creatEvent}
                  title={Texts.add_activity}
                  width={"80%"}
                ></CreateButton></View>
            )}
          <SearchImage
            h_modal={true}
            accessLibrary={() => {
              this.TakePhotoFromCamera();
            }}
            isOpen={this.state.searchImageState}
            onClosed={(mother) => {
              this.setStatePure({ searchImageState: false });
            }}
          />
        </ScrollView>
      </View>
    );
  }
}
