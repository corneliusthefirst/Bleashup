/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import {
  Button,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

import stores from "../../../stores";
import { functionDeclaration } from "@babel/types";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import testForURL from "../../../services/testForURL";
import GState from "../../../stores/globalState/index";
import PhotoViewer from "../event/PhotoViewer";
import CacheImages from "../../CacheImages";
import EditUserModal from "./editUserModal";
import shadower from "../../../components/shadower";
import ColorList from "../../colorList";
import Pickers from "../../../services/Picker";
import FileExchange from "../../../services/FileExchange";
import rounder from "../../../services/rounder";
import BeNavigator from "../../../services/navigationServices";
import BleashupCamera from "../../mainComponents/BleashupCamera/index";
import SwiperView from "../../mainComponents/swipeViews";
import Toaster from "../../../services/Toaster";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity, Text, Clipboard, ScrollView } from "react-native";
import Spinner from "../../Spinner";
import Entypo from "react-native-vector-icons/Entypo";
import BeComponent from "../../BeComponent";
import { observer } from "mobx-react";
import PickersUpload from "../event/createEvent/components/PickerUpload";
import Texts from "../../../meta/text";
import Vibrator from "../../../services/Vibrator";

let { height, width } = Dimensions.get("window");
@observer
class ProfileView extends BeComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMount: false,
      userInfo: null,
      enlarge: false,
      update: false,
      updatetitle: "",
      position: "",
      coverscreen: true,
      uploading: false,
      photo: "",
      openBCamera: false,
    };
    this.gotobackgroundChanger = this.gotobackgroundChanger.bind(this)
    if (this.props.navigation.getParam("update") == true) {
      this.init();
    }
  }
  init = () => {
    setTimeout(() => {
      this.setStatePure({ isMount: true });
      this.setStatePure({ photo: stores.LoginStore.user.profile });
    }, 50);
  };
  componentDidMount() {
    this.init();
  }
  gotobackgroundChanger() {
    BeNavigator.gotoBackgroundChanger()
  }
  updateName = () => {
    this.setStatePure({ updatetitle: Texts.enter_your_name });
    this.setStatePure({ position: "bottom" });
    this.setStatePure({ coverscreen: true });
    this.setStatePure({ update: true });
  };

  editActu = () => {
    this.props.navigation.navigate("Actu", {
      userInfo: stores.LoginStore.user,
    });
  };

  //for photo

  handleUpload(url) {
    this.setStatePure({ url });
    stores.LoginStore.updateProfile(url.photo).then(() => { });
  }

  uploadError = (e) => {
    this.setStatePure({ uploading: false });
  };
  openPhoto() {
    BeNavigator.openPhoto(stores.LoginStore.user.profile);
  }
  renderPhoto = () => {
    return this.state.uploading ? (
      <Spinner />
    ) : (
        <View
          style={{
            height: 300,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              requestAnimationFrame(() => {
                this.openPhoto();
              });
            }}
          >
            {stores.LoginStore.user.profile &&
              testForURL(stores.LoginStore.user.profile) ? (
                <CacheImages
                  {...this.props}
                  source={{ uri: stores.LoginStore.user.profile }}
                  style={{
                    height: ColorList.containerHeight / 3,
                    width: ColorList.containerHeight / 3,
                    borderRadius: ColorList.containerHeight / 6,
                  }}
                />
              ) : (
                <Image
                  source={require("../../../../Images/images.jpeg")}
                  style={{
                    height: ColorList.containerHeight / 3,
                    width: ColorList.containerHeight / 3,
                    borderRadius: ColorList.containerHeight / 6,
                  }}
                ></Image>
              )}
          </TouchableOpacity>

          <TouchableWithoutFeedback>
            <View
              style={{
                alignItems: "center",
                backgroundColor: ColorList.bodyBackground,
                minWidth: 90,
                maxWidth: 200,
                ...shadower(2),
                borderRadius: 50,
                flexDirection: "row",
                justifyContent: "center",
                position: "absolute",
                right: width / 6,
                bottom: 40,
              }}
            >
              <PickersUpload
                fontSize={35}
                notVideo
                withTrash={stores.LoginStore.user.profile ? true : false}
                color={ColorList.indicatorColor}
                notAudio
                saveMedia={this.handleUpload.bind(this)}
                onlyPhotos
                currentURL={this.state.url}
              ></PickersUpload>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
  };
  copyPhone() {
    Clipboard.setString(stores.LoginStore.user.phone);
    Vibrator.vibrateShort();
    Toaster({ text: Texts.copied });
  }
  renderProfileInfo = () => {
    return (
      <View
        style={{
          height: 300,
          width: "85%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            height: height / 8,
            flexDirection: "row",
            marginTop: 15,
          }}
        >
          <View style={{ width: "80%", flexDirection: "row" }}>
            <AntDesign
              name="user"
              active={true}
              type="AntDesign"
              style={{ ...GState.defaultIconSize, color: ColorList.headerIcon }}
            />
            <View
              style={{ flex: 1, marginLeft: "5%", flexDirection: "column" }}
            >
              <Text
                style={{ ...GState.defaultTextStyle, alignSelf: "flex-start" }}
                note
              >
                {Texts.name}
              </Text>
              <Text
                style={{ ...GState.defaultTextStyle, alignSelf: "flex-start" }}
              >
                {stores.LoginStore.user.nickname}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={this.updateName.bind(this)}
            style={{ width: "10%" }}
          >
            <MaterialIcons
              name="edit"
              type="MaterialIcons"
              style={{
                ...GState.defaultIconSize,
                color: ColorList.bodySubtext,
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: "100%",
            justifyContent: "center",
            height: height / 8,
            flexDirection: "row",
            marginTop: 15,
          }}
        >
          <View style={{ width: "80%", flexDirection: "row" }}>
            <AntDesign
              name="infocirlceo"
              active={true}
              type="AntDesign"
              style={{ ...GState.defaultIconSize, color: ColorList.headerIcon }}
            />

            <View
              style={{ flex: 1, marginLeft: "5%", flexDirection: "column" }}
            >
              <Text
                style={{ ...GState.defaultTextStyle, alignSelf: "flex-start" }}
                note
              >
                {Texts.status}
              </Text>
              <Text
                style={{ ...GState.defaultTextStyle, alignSelf: "flex-start" }}
                numberOfLines={1}
              >
                {GState.isUndefined(stores.LoginStore.user.status) ? '' : stores.LoginStore.user.status}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={this.editActu} style={{ width: "10%" }}>
            <MaterialIcons
              name="edit"
              type="MaterialIcons"
              style={{
                ...GState.defaultIconSize,
                color: ColorList.bodySubtext,
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: "100%",
            justifyContent: "center",
            flexDirection: "row",
            marginTop: height / 30,
          }}
        >
          <View style={{ width: "90%", flexDirection: "row" }}>
            <FontAwesome
              name="phone"
              active={true}
              type="FontAwesome"
              style={{ ...GState.defaultIconSize, color: ColorList.headerIcon }}
            />
            <TouchableOpacity
              onLongPress={() => this.copyPhone()}
              style={{ flex: 1, marginLeft: "5%", flexDirection: "column" }}
            >
              <Text
                style={{ ...GState.defaultTextStyle, alignSelf: "flex-start" }}
                note
              >
                {Texts.telephone}
              </Text>
              <Text
                style={{
                  ...GState.defaultTextStyle,
                  alignSelf: "flex-start",
                  marginLeft: 2,
                }}
              >
                {stores.LoginStore.user.phone}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  extraContainer = {
    width: "80%",
    flexDirection: "row",
  };
  extraTextStyle = {
    ...GState.defaultTextStyle,
    fontSize: 17,
    fontWeight: "400",
    marginLeft: "5%",
                    
  }
  render() {
    return (
      <ScrollView
        keyboardShouldPersistTaps={"handled"}
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: ColorList.bodyBackground,
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <View style={{ height: ColorList.headerHeight }}>
          <View
            style={{
              ...bleashupHeaderStyle,
              height: ColorList.headerHeight,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                width: width / 3,
                marginLeft: width / 25,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <MaterialIcons
                  name="arrow-back"
                  active={true}
                  type="MaterialIcons"
                  style={{
                    ...GState.defaultIconSize,
                    color: ColorList.headerIcon,
                  }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  ...GState.defaultTextStyle,
                  fontSize: 18,
                  fontWeight: "bold",
                  marginRight: "16%",
                }}
              >
                Profile
              </Text>
            </View>
          </View>
        </View>

        {this.state.isMount ? (
          <View
            style={{
              flexDirection: "column",
              height: height - height / 10,
              width: "100%",
            }}
          >
            <SwiperView
              swipeArray={[this.renderPhoto(), this.renderProfileInfo()]}
              backgroundColor="white"
              height={300}
            />

            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <TouchableOpacity
                onPress={this.gotobackgroundChanger}
                style={{
                  ...this.extraContainer,
                  marginTop: 10,
                  width: "90%",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={this.extraTextStyle}
                >
                  {Texts.background_image_settings}
                </Text>
                <View style={GState.buttonStyle}>
                  <Text
                    style={GState.buttonTextStyle}
                  >
                    {Texts.change}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={{ ...this.extraContainer, marginTop: 50 }}>
                <Entypo
                  onPress={() => this.props.navigation.navigate("Settings")}
                  name="sound-mute"
                  active={true}
                  type="Entypo"
                  style={{
                    ...GState.defaultIconSize,
                    color: ColorList.headerIcon,
                  }}
                />
                <TouchableWithoutFeedback
                  style={{ flex: 1 }}
                  onPress={() => BeNavigator.navigateTo("MuteView")}
                >
                  <Text
                    style={this.extraTextStyle}
                  >
                    {Texts.muted}
                  </Text>
                </TouchableWithoutFeedback>
              </View>

              <View style={{ ...this.extraContainer, marginTop: 25 }}>
                <MaterialIcons
                  name="block"
                  active={true}
                  type="MaterialIcons"
                  style={{ ...GState.defaultIconSize, color: "red" }}
                  onPress={() => this.props.navigation.navigate("Settings")}
                />
                <TouchableWithoutFeedback
                  style={{ flex: 1 }}
                  onPress={() => BeNavigator.navigateTo("BlockView")}
                >
                  <Text
                    style={this.extraTextStyle}
                  >
                    {Texts.blocked}
                  </Text>
                </TouchableWithoutFeedback>
              </View>
            </View>

            <EditUserModal
              isOpen={this.state.update}
              onClosed={() => {
                this.setStatePure({ update: false });
              }}
              type="nickname"
              userInfo={stores.LoginStore.user}
              title={this.state.updatetitle}
              position={this.state.position}
              coverscreen={this.state.coverscreen}
              maxLength={GState.nameMaxLength}
            />
          </View>
        ) : null}
      </ScrollView>
    );
  }
}
export default ProfileView;
