import React, { Component } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import CacheImages from "../../../../CacheImages";
import testForURL from "../../../../../services/testForURL";
import buttoner from "../../../../../services/buttoner";
import ColorList from '../../../../colorList';
import BeComponent from '../../../../BeComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FileAttarchementMessaege from '../../../eventChat/FileAttarchtmentMessage';
import { containsFile, containsAudio, containsVideo } from "./mediaTypes.service";
import AudioMessage from "../../../eventChat/AudioMessage";
import BeNavigator from '../../../../../services/navigationServices';
import GState from "../../../../../stores/globalState";

export default class MediaPreviewer extends BeComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.constainsFile = containsFile.bind(this)
    this.containsAudio = containsAudio.bind(this)
  }
  state = {};
  choseAction(url) {
    if(containsVideo(url)) {
      BeNavigator.openVideo(url.video, true)
    } else {
      BeNavigator.openPhoto(url.photo, true)
    }
  }

  render() {
    this.url = this.props.url
    return (
      <View
        style={{
          height: this.constainsFile() || this.containsAudio() ? 65 : (this.props.height || "90%"),
          minHeight: 65,
          width: "100%",
          alignSelf: "center",
          borderColor: "black",
          borderWidth: 0.4,
          borderRadius: 10
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
          {this.constainsFile() ?
            <FileAttarchementMessaege activity_id={this.props.activity_id} updateSource={this.props.updateSource} message={{ total: 0, received: 0, ...this.props.url }}>
            </FileAttarchementMessaege> : this.containsAudio() ?
              <AudioMessage activity_id={this.props.activity_id} updateSource={this.props.updateSource} message={{
                total: 0, recieved: 0, ...this.props.url,
                id: this.props.url.id || this.props.data.id || this.props.remind_id
              }}></AudioMessage> :
              <TouchableOpacity onPress={() => this.choseAction(this.props.url)}>
                {this.props.url &&
                  this.props.url.photo &&
                  testForURL(this.props.url.photo) ? (
                    <CacheImages
                      thumbnails
                      square
                      source={{ uri: this.props.url.photo }}
                      style={{
                        alignSelf: "center",
                        height: '100%',
                        width: "100%",
                        borderColor: ColorList.indicatorColor,
                        borderRadius: 10
                      }}
                    />
                  ) : (
                    <Image
                      resizeMode={"cover"}
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
                        height: '100%',
                        width: "100%",
                        borderColor: ColorList.indicatorColor,
                        borderRadius: this.props.url.photo || this.props.url.video ? 10 : 5,
                      }}
                    ></Image>
                  )}
              </TouchableOpacity>
          }
          {this.props.url && this.props.url.video && !GState.isUndefined(this.props.url.video)
            ? (
              <View
                style={{
                  ...buttoner,
                  alignSelf: "center",
                  position: "absolute",
                }}
              >
                {this.props.url.video ?
                  <Ionicons onPress={() => {
                    this.choseAction(this.props.url);
                  }} name="ios-play" style={{
                    fontSize: 43, color: ColorList.bodyBackground
                  }} type="Ionicons" />
                  :
                  <MaterialIcons onPress={() => {
                    this.choseAction(this.props.url);
                  }} name="headset" style={{
                    fontSize: 40, color: ColorList.bodyBackground
                  }} type="MaterialIcons" />
                }

              </View>
            ) : null}
        </View>

        {this.props.url &&
          (this.props.url.video || this.props.url.photo || this.props.url.source) &&
          !GState.isUndefined(this.props.url.video || this.props.url.photo || this.props.url.source) ? (
            <View style={{
              position: "absolute", alignSelf: this.constainsFile() || this.containsAudio() ?
                "flex-start" : "flex-end", height: 30, width: 30, margin: "1%",
            }}>
              <TouchableOpacity
                onPress={this.props.cleanMedia}
                style={{
                  ...buttoner,
                  width: 30,
                  height: 30,
                  borderRadius: 20,

                }}
              >
                <EvilIcons
                  name={"close"}
                  type="EvilIcons"
                  style={{
                    color: ColorList.bodyBackground,
                    fontSize: 30,
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : null}
      </View>
    );
  }
}


