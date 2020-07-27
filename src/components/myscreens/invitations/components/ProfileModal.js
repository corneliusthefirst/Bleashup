import React, { Component } from "react";
import Modal from "react-native-modalbox";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import CacheImages from "../../../CacheImages";
import PhotoViewer from "../../event/PhotoViewer";
import shadower from "../../../shadower";
import testForURL from "../../../../services/testForURL";
import ColorList from "../../../colorList";
import GState from "../../../../stores/globalState/index";
import Texts from "../../../../meta/text";

export default class ProfileModal extends Component {
  constructor(props) {
    super(props);
    this.enlargeImage = this.enlargeImage.bind(this);
    this.hidePhoto = this.hidePhoto.bind(this);
    this.state = {
      enlargeImage: false,
    };
  }

  transparent = "rgba(52, 52, 52, 0.3)";
  enlargeImage() {
    requestAnimationFrame(() => {
      this.setState({ enlargeImage: true });
    });
  }
  hidePhoto() {
    this.setState({ enlargeImage: false });
  }
  placeHolder = GState.profilePlaceHolder;
  render() {
    return this.props.profile ? (
      <Modal
        coverScreen={true}
        isOpen={this.props.isOpen}
        onClosed={this.props.onClosed}
        style={styles.modalContainer}
        position={"bottom"}
      >
        <View>
          <View style={styles.child1}>
            <View style={styles.child1Sub}>
              <TouchableOpacity onPress={this.props.onClosed} transparent>
                <EvilIcons
                  style={styles.Child1SubIconStyle}
                  name="close"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.child2}>
              <Text style={styles.child2Text}>
                {this.props.profile.nickname}
              </Text>
            </View>

            <View style={styles.child3}>
              <TouchableOpacity onPress={this.enlargeImage}>
                {this.props.profile.profile &&
                testForURL(this.props.profile.profile) ? (
                  <CacheImages
                    thumbnails
                      source={{
                        uri: this.props.profile && this.props.profile.profile,
                      }}
                    square
                    style={styles.child3cacheImages}
                  />
                ) : (
                  <Image
                    resizeMode={"cover"}
                    style={styles.child3placeHolder}
                    source={this.placeHolder}
                  ></Image>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.child4}>
              {this.props.profile.status &&
              this.props.profile.status !== "undefined" ? (
                <Text style={styles.child4text}>
                  {this.props.profile.status}
                </Text>
              ) : null}
            </View>
            {this.state.enlargeImage ? (
              <PhotoViewer
                open={this.state.enlargeImage}
                hidePhoto={this.hidePhoto}
                photo={this.props.profile.profile}
              />
            ) : null}
          </View>
          <View style={styles.child5}>
            <Text style={styles.child5text}>
              {Texts.profile_card}
            </Text>
          </View>
        </View>
      </Modal>
    ) : null;
  }
}
const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: ColorList.bodyBackground,
    height: "80%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: "100%",
    },
  child1: {
    margin: "3%",
    height: "95%",
    width: "95%",
  },
  child1Sub: {
    alignItems: "center",
    justifyContent: "center",
    },
  child2: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 3,
    alignItems: "flex-start",
  },
  child2Text: {
    fontSize: 18,
    fontWeight: "500",
  },
    Child1SubIconStyle: {
      color: ColorList.bodyIcon,
      fontSize: 35,
    },
    child3: {
      flex: 5,
      flexDirection: "column",
      padding: 2,
      ...shadower(),
      backgroundColor: "transparent",
    },
  child3placeHolder: {
    height: "100%",
    width: "100%",
    borderColor: ColorList.bodyIcon,
    borderRadius: 8,
  },
  child3cacheImages: {
    height: "100%",
    width: "100%",
    borderColor: ColorList.bodyIcon,
    borderRadius: 8,
  },
    child5: {
      position: "absolute",
      margin: "4%",

    },
  child4: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 10,
    marginLeft: 3,
  },
  child5text: {
    color: "#1F4237",
    fontWeight: "bold",
  },
  child4text: {
    fontSize: 17,
    fontWeight: "400",
  },
});
