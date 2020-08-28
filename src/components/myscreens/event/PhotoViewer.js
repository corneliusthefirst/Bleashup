import React, { Component } from "react";
import { View, Dimensions, StatusBar, Text, StyleSheet,BackHandler } from "react-native";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenheight = Math.round(Dimensions.get("window").height);
import ReactNativeZoomableView from "@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView";
import CacheImages from "../../CacheImages";
import StatusBarWhiter from "./StatusBarWhiter";
import testForURL from "../../../services/testForURL";
import rnFetchBlob from "rn-fetch-blob";
import moment from "moment";
import shadower from "../../shadower";
import buttoner from "../../../services/buttoner";
import BleashupModal from "../../mainComponents/BleashupModal";
import rounder from "../../../services/rounder";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import ColorList from "../../colorList";
import Toaster from "../../../services/Toaster";
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import GState from '../../../stores/globalState/index';
let dirs = rnFetchBlob.fs.dirs;
export default class PhotoViewer extends BleashupModal {
  initialize() {
    this.props.navigation ? GState.nav = this.props.navigation : null
    this.state = {
      hidden: false,
    };
    this.downLoadImage = this.downLoadImage.bind(this);
    this.handleForwardImage = this.handleForwardImage.bind(this);
  }
  handleBackButton(){
    //todo this handler is still call even when the screen is unmounted
    //prooff
    console.warn("handling back press in photo viewer")
    this.routePhoto ? this.props.navigation.goBack(): this.props.hidePhoto()
    return this.mounted?true:false
  }
  isRoutePhoto(){
    return this.routePhoto && typeof this.routePhoto === "string"
  }
  mountingModal(){
  if(this.isRoutePhoto()){
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this));
  } 
  }
  unMountingModal(){
    console.warn("unmounting photo viewer",this.isRoutePhoto())
    if(this.isRoutePhoto()){
      BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton.bind(this));
    }
  }
  downLoadImage() {
    this.props.hidePhoto();
    if (testForURL(this.props.photo)) {
      let path =
        dirs.DownloadDir +
        "/Bleashup/" +
        this.props.photo.split("/")[this.props.photo.split("/").length - 1];
      rnFetchBlob.fs.exists(path).then((status) => {
        if (status) {
          Toaster({
            text: "Image has already been downloaded",
            duration: 4000,
          });
        } else {
          rnFetchBlob
            .config({
              path: path,
              addAndroidDownloads: {
                useDownloadManager: true, // <-- this is the only thing required
                // Optional, override notification setting (default to true)
                notification: false,
                path: path,
                // Optional, but recommended since android DownloadManager will fail when
                // the url does not contains a file extension, by default the mime type will be text/plain
                mime: "text/plain",
                title: "Activity image",
                description: "File Downloaded by Bleashup",
              },
            })
            .fetch("GET", this.props.photo)
            .then((res) => {
              Toaster({
                text: "Image Successfully downloaded",
                type: "success",
                duration: 4000,
              });
            })
            .catch((e) => {
              console.warn(e);
              Toaster({
                text: "unable to download this image",
                duration: 5000,
              });
            });
        }
      });
    }
  }
  handleForwardImage() {
    this.props.hidePhoto();
  }
  onClosedModal() {
    this.props.hidePhoto();
    //StatusBar.setHidden(false, false)
    this.setStatePure({
      message: null,
      title: null,
      callback: null,
    });
  }
  goback(){
    return this.props.navigation && this.props.navigation.goBack()
  }
  date = moment(this.dateRoute || this.props.created_at).calendar();
  modalBackground = "black";
  modalBody() {
    return (
      <View>
        <StatusBarWhiter></StatusBarWhiter>
        <View style={styles.mainContainer}>
          <ReactNativeZoomableView
            style={styles.zoomContainer}
            maxZoom={1.5}
            minZoom={0.5}
            zoomStep={0.5}
            initialZoom={1}
            captureEvent={true}
          >
            <View style={styles.imageContainer}>
              <CacheImages
                style={styles.imageContainerSub}
                resizeMode={"contain"}
                width={screenWidth}
                height={screenheight}
                source={{ uri: this.routePhoto || this.props.photo }}
              ></CacheImages>
            </View>
          </ReactNativeZoomableView>
        </View>
        <View style={styles.metaInfoContainer}>
          <View style={styles.icon1}>
            <MaterialIcons
              onPress={this.routePhoto ? this.goback.bind(this) : this.props.hidePhoto}
              style={styles.iconStyle}
              name={"keyboard-arrow-down"}
            ></MaterialIcons>
          </View>

          {!this.hideActions && <View style={styles.icon2}>
            <Entypo
              onPress={this.handleForwardImage}
              style={styles.iconStyle}
              name={"forward"}
            ></Entypo>
          </View>}

          {!this.hideActions && <View style={styles.icon1}>
            <AntDesign
              onPress={this.downLoadImage}
              style={styles.iconStyle}
              name={"clouddownload"}
            ></AntDesign>
          </View>}
        </View>
        <View style={styles.textContainer}>
          {this.dateRoute || this.props.created_at ? (
            <Text style={styles.text}>{this.date}</Text>
          ) : null}
        </View>
      </View>
    );
  }
  getParam = (param) => this.props.navigation && this.props.navigation.getParam("photo")
  routePhoto = this.getParam("photo")
  hideActions = this.getParam("hideActions")
  dateRoute = this.getParam("date")
  render(){
    return this.routePhoto ? this.modalBody() : this.modal()
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    height: screenheight,
    width: screenWidth,
    backgroundColor: "black",
  },
  zoomContainer: {
    height: "100%",
    width: "100%",
  },
  iconStyle: { 
      color: ColorList.bodyBackground, 
      textAlign: "center",
      fontSize: 35, 
    },
  imageContainer: {
    alignSelf: "center",
    width: screenWidth,
  },
  imageContainerSub: {
    alignSelf: "center",
  },
  icon1: {
    ...rounder(50, true),
  },
  icon2: {
    ...rounder(50, true),
    marginLeft: "55%",
  },
  textContainer: {
    margin: "1%",
    ...buttoner,
    width: 130,
    height: 20,
  },
  text: {
    color: ColorList.bodyBackground,
    fontSize: 12,
    marginBottom: 6,
  },
  metaInfoContainer: {
      flexDirection: "row",
      position: "absolute",
      width: screenWidth,
      justifyContent: "space-between",
  },
});
