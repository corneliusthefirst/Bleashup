import React, { Component } from "react";

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
} from "react-native";
import Modal from "react-native-modalbox";
import stores from "../../../../../stores/index";
import SearchImage from "./SearchImage";
import Pickers from "../../../../../services/Picker";
import FileExachange from "../../../../../services/FileExchange";
import testForURL from "../../../../../services/testForURL";
import shadower from "../../../../shadower";
import CacheImages from "../../../../CacheImages";
import Toaster from "../../../../../services/Toaster";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Foundation from "react-native-vector-icons/Foundation";
import GState from "../../../../../stores/globalState";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import ColorList from "../../../../colorList";
import Spinner from "../../../../Spinner";
import BeNavigator from "../../../../../services/navigationServices";

let { height, width } = Dimensions.get("window");

export default class EventPhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enlargeImage: false,
      EventPhoto: "",
      DefaultPhoto: require("../../../../../../assets/default_event_image.jpeg"),
      searchImageState: false,
    };
  }
  openPhoto(){
    BeNavigator.openPhoto(this.state.EventPhoto)
  }
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (this.props.event.background !== prevProps.event.background) {
      this.setState({ EventPhoto: this.props.event.background });
    }
  }

  TakePhotoFromCamera() {
    Pickers.SnapPhoto(true).then((res) => {
      this.setState({
        uploading: true,
      });
      let exchanger = new FileExachange(
        res.source,
        "/Photo/",
        res.size,
        0,
        null,
        (newDir, path, total) => {
          this.setState({ EventPhoto: path });
          stores.Events.updateBackground("newEventId", path, false).then(() => {
            this.setState({
              uploading: false,
            });
          });
        },
        () => {
          Toaster({ text: "Unable To upload photo", position: "top" });
          this.setState({
            uploading: false,
          });
        },
        (error) => {
          Toaster({ text: "Unable To upload photo", position: "top" });
          this.setState({
            uploading: false,
          });
        },
        res.content_type,
        res.filename,
        "/photo"
      );
      this.state.EventPhoto
        ? exchanger.deleteFile(this.state.EventPhoto)
        : null;
      exchanger.upload(0, res.size);
    });
  }
  resetPhoto() {
    let exchanger = new FileExachange();
    exchanger.deleteFile(this.state.EventPhoto);
    stores.Events.updateBackground("newEventId", null).then(() => {
      this.setState({
        EventPhoto: null,
      });
    });
  }
  TakePhotoFromLibrary() {
    return new Promise((resolve, reject) => {
      ImagePicker.openPicker({
        cropping: true,
        quality: "medium",
      }).then((response) => {
        let res = head(response);
        this.setState({ EventPhoto: res.path });
        stores.Events.updateBackground(
          "newEventId",
          res.path,
          false
        ).then(() => {});
        resolve(res.path);
      });
    });
  }
  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onClosed={() => this.props.onClosed(this.state.EventPhoto)}
        style={{
          height: height / 2 + height / 9,
          borderRadius: 15,
          backgroundColor: "#FEFFDE",
          borderColor: "black",
          borderWidth: 1,
          width: "98%",
          flexDirection: "column",
          marginTop: "-8%",
        }}
        position={"bottom"}
        backButtonClose={true}
        //backdropPressToClose={false}
        coverScreen={true}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{ justifyContent: "space-between", alignItem: "center" }}
          >
            <TouchableOpacity
              style={{
                alignSelf: "center",
                width: "90%",
                borderRadius: 15,
                backgroundColor: "transparent",
                justifyContent: "center",
                alignItem: "center",
                marginTop: "5%",
              }}
              onPress={() => {
                this.TakePhotoFromCamera();
              }}
            >
              <View style={{ flexDirection: "row", marginBottom: "4%" }}>
                <MaterialIcons
                  name="photo-camera"
                  active={true}
                  style={{
                    ...GState.defaultIconSize,
                    color: "#0A4E52",
                    alignSelf: "flex-start",
                  }}
                />
                <Text style={{ alignSelf: "center" }}>Add Photo</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignSelf: "center",
                width: "90%",
                borderRadius: 15,
                borderColor: "#1FABAB",
                backgroundColor: "transparent",
                justifyContent: "center",
                alignItem: "center",
                marginTop: "3%",
              }}
              onPress={() => {
                this.setState({ searchImageState: true });
              }}
            >
              <View style={{ flexDirection: "row", marginBottom: "1%" }}>
                <Foundation
                  name="web"
                  active={true}
                  type="Foundation"
                  style={{
                    ...GState.defaultIconSize,
                    color: ColorList.bodyIcon,
                    alignSelf: "flex-start",
                    marginLeft: 5,
                  }}
                />
                <Text style={{ alignSelf: "center" }}> Download photo</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 3,
              flexDirection: "column",
              justifyContent: "center",
              alignItem: "center",
              marginTop: "8%",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                this.state.EventPhoto && testForURL(this.state.EventPhoto)
                  ? this.openPhoto()
                  : null
              }
            >
              {this.state.EventPhoto && testForURL(this.state.EventPhoto) ? (
                <CacheImages
                  thumbnails
                  square
                  source={{ uri: this.state.EventPhoto }}
                  style={{
                    alignSelf: "center",
                    height: "90%",
                    width: "90%",
                    borderRadius: 10,
                  }}
                />
              ) : (
                <Image
                  resizeMode={"cover"}
                  source={
                    this.state.EventPhoto
                      ? { uri: this.state.EventPhoto }
                      : this.state.DefaultPhoto
                  }
                  style={{
                    alignSelf: "center",
                    height: "90%",
                    width: "90%",
                    borderRadius: 100,
                  }}
                ></Image>
              )}
            </TouchableOpacity>
            {this.state.EventPhoto ? (
              <View
                style={{
                  position: "absolute",
                  alignSelf: "flex-end",
                  margin: "2%",
                  marginBottom: "70%",
                  marginRight: "5%",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.resetPhoto();
                  }}
                >
                  <EvilIcons
                    name={"close"}
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
                <Spinner color={"#FEDDFE"}></Spinner>
              </View>
            ) : null}
          </View>
          <SearchImage
            h_modal={true}
            accessLibrary={() => {
              this.TakePhotoFromCamera();
            }}
            isOpen={this.state.searchImageState}
            onClosed={(mother) => {
              this.setState({ searchImageState: false });
              mother ? this.props.closeTemporarily() : null;
            }}
          />
        </View>
      </Modal>
    );
  }
}

/**  

const options = {
    title: 'Select Avatar',
    //customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
      maxWidth:600,
      maxHeight:500,
      noData:true,
      allowEditing:true,
      quality:0.7
    },
  };

        TakePhotoFromCamera(){
    
      return new Promise((resolve, reject) => {
      
      ImagePicker.launchCamera(options, (response) => {
      
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          
          //const source = { uri: response.uri };
          // You can also display the image using data:
          // const source = { uri: 'data:image/jpeg;base64,' + response.data };
       
         resolve(response.uri);
         stores.Events.updateBackground("newEventId",response.uri,false).then(()=>{});
        }
      
      
      
        })
      }) 
      
       }
      
      @autobind
      TakePhotoFromLibrary(){
      return new Promise((resolve, reject) => {
      ImagePicker.launchImageLibrary(options, (response) => {
       
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          //const source = { uri: response.uri };
          // You can also display the image using data:
          // const source = { uri: 'data:image/jpeg;base64,' + response.data };
       
             resolve(response.uri);
             stores.Events.updateBackground("newEventId",response.uri,false).then(()=>{});
          }
         
       })
      
      })
      
      }

 */
