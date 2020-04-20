import React, { Component } from "react";
import { View,TouchableOpacity } from "react-native";
import { Icon, Thumbnail } from "native-base";
import CacheImages from "../../../../CacheImages";
import testForURL from "../../../../../services/testForURL";
import PhotoViewer from "../../PhotoViewer";
import VideoViewer from "../../../highlights_details/VideoModal";
import buttoner from "../../../../../services/buttoner";

export default class MediaPreviewer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  state = {};
  choseAction(url) {
    if (url.video) {
      this.setState({
          showVideo:true
      })
    } else {
      this.setState({
        enlargeImage: true,
      });
    }
  }
  render() {
    return (
      <View
        style={{
          height: this.props.height || "90%",
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
          <TouchableOpacity onPress={() => this.choseAction(this.props.url)}>
            {this.props.url &&
            this.props.url.photo &&
            testForURL(this.props.url.photo) ? (
              <CacheImages
                thumbnails
                source={{ uri: this.props.url.photo }}
                style={{
                  alignSelf: "center",
                  height: "100%",
                  width: "100%",
                  borderColor: "#1FABAB",
                  borderRadius:
                    this.props.url.photo || this.props.url.video ? 10 : 100,
                }}
              />
            ) : (
              <Thumbnail
                square
                source={
                  this.props.url && this.props.url.photo
                    ? {
                        uri: this.props.url.photo,
                      }
                    : this.props.defaultPhoto
                }
                style={{
                  alignSelf: "center",
                  height: "100%",
                  width: "100%",
                  borderColor: "#1FABAB",
                  borderRadius:
                    this.props.url.photo || this.props.url.video ? 10 : 100,
                }}
              ></Thumbnail>
            )}
          </TouchableOpacity>
          {this.props.url && this.props.url.video ? (
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
                  this.choseAction(this.props.url);
                }}
                name={this.props.url.video ? "play" : "headset"}
                style={{
                  backgroundColor: "black",
                  opacity: 0.5,
                  borderRadius: 30,
                  fontSize: 50,
                  color: this.props.url.audio ? "yellow" : "#FEFFDE",
                  alignSelf: "center",
                }}
                type={this.props.url.video ? "EvilIcons" : "MaterialIcons"}
              ></Icon>
            </View>
          ) : null}
        </View>
        {this.props.url && (this.props.url.video || this.props.url.photo) ? (
          <View
            style={{
              ...buttoner,
              position: "absolute",
              alignSelf: "flex-end",
              width:30,
              height:30,
              borderRadius: 20,
            }}
          >
            <Icon
              name={"close"}
              type="EvilIcons"
              onPress={this.props.cleanMedia}
              style={{
                color: "white",
                fontSize: 30,
              }}
            ></Icon>
          </View>
        ) : null}
        {this.state.enlargeImage && this.props.url && this.props.url.photo ? (
          <PhotoViewer
            open={this.state.enlargeImage}
            hidePhoto={() =>
              this.setState({
                enlargeImage: false,
              })
            }
            photo={this.props.url.photo}
          />
        ) : null}
        {this.state.showVideo && this.props.url && this.props.url.video && (
          <VideoViewer
            open={this.state.showVideo}
            hideVideo={() => {
              this.setState({
                showVideo: false,
              });
            }}
            video={this.props.url.video}
          ></VideoViewer>
        )}
      </View>
    );
  }
}
