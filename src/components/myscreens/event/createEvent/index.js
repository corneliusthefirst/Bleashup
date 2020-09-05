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

let { height, width } = Dimensions.get("window");

export default class CreateEventView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      colorWhenChoosed: "#1FABAB",
      currentEvent: request.Event(),
      participant: null,
      title: "",
      photo: "",
      DefaultPhoto: require("../../../../../Images/activity_post.png"),
      searchImageState: false,
    };
  }
  componentDidMount() {
    stores.Events.readFromStore().then((Events) => {
      let event = find(Events, { id: "newEventId" });
      this.setState({
        participant: head(event.participant),
        currentEvent: event,
        title: event.about.title,
        photo: event.background,
      });
    });
  }

  back = () => {
    this.props.navigation.navigate("Home");
  };
  navigateToActivity = (event) => {
    this.props.navigation.navigate("Event", {
      Event: event,
      tab: "EventDetails",
    });
  };

  creatEvent = () => {
    if (!this.state.currentEvent.about.title) {
      Toaster({ text: Texts.event_must_have_a_name, duration: 4000 });
    } else {
      this.setState({
        creating: true,
      });
      let event = this.state.currentEvent;
      event.created_at = moment().format();
      event.updated_at = moment().format();
      CreateRequest.createEvent(event)
        .then((res) => {
          stores.Events.delete(request.Event().id).then(() => {
            this.setState({
              currentEvent: request.Event(),
              title: "",
              photo: "",
              creating: false,
            });
            this.navigateToActivity(res);
          });
        })
        .catch(() => {
          this.setState({
            creating: false,
          });
        });
    }
  };

  onChangedTitle = (value) => {
    this.state.currentEvent.about.title = value;
    this.setState({ title: value, currentEvent: this.state.currentEvent });
    stores.Events.updateTitle(request.Event().id, value, false).then(() => {});
  };

  //for photo
  TakePhotoFromCamera = () => {
    Pickers.SnapPhoto(true).then((res) => {
      this.setState({
        uploading: true,
      });
      let exchanger = new FileExchange(
        res.source,
        "/Photo/",
        res.size,
        0,
        null,
        (newDir, path, total) => {
          this.setState({ photo: path });
          this.state.currentEvent.background = path;
          this.setState({ currentEvent: this.state.currentEvent });
          stores.Events.updateBackground("newEventId", path, false).then(() => {
            this.setState({
              uploading: false,
            });
          });
        },
        () => {
          Toaster({ text: Texts.unable_to_upload, position: "top" });
          this.setState({
            uploading: false,
          });
        },
        (error) => {
          Toaster({ text: Texts.unable_to_upload, position: "top" });
          this.setState({
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
      this.setState({
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
        this.setState({ photo: res.path });
        this.state.currentEvent.background = res.path;
        this.setState({ currentEvent: this.state.currentEvent });
        stores.Events.updateBackground(
          request.Event().id,
          res.path,
          false
        ).then(() => {});
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
              height={height / 12}
              value={this.state.title}
              onChange={this.onChangedTitle}
              placeholder={"Activity name"}
            ></CreateTextInput>
          </View>
          <View
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
              @activity photo
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
                this.setState({ searchImageState: true });
              }}
            />
          </View>
          <View style={{ height: 250, justifyContent: "center" }}>
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
                  marginBottom: "60%",
                  marginRight: "10%",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.resetPhoto();
                  }}
                >
                  <EvilIcons
                    name={"close"}
                    type={"EvilIcons"}
                    style={{ ...GState.defaultIconSize, color: "red" }}
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
          </View>

          {this.state.creating ? (
            <Spinner></Spinner>
          ) : (
            <CreateButton
              action={this.creatEvent}
              title={"Create Activity"}
              width={"80%"}
            ></CreateButton>
          )}
          <SearchImage
            h_modal={true}
            accessLibrary={() => {
              this.TakePhotoFromCamera();
            }}
            isOpen={this.state.searchImageState}
            onClosed={(mother) => {
              this.setState({ searchImageState: false });
            }}
          />
        </ScrollView>
      </View>
    );
  }
}
