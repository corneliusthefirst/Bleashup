import React, { Component } from "react";
import { View,TouchableOpacity,Image } from "react-native";
import CacheImages from "../../../../CacheImages";
import testForURL from "../../../../../services/testForURL";
import PhotoViewer from "../../PhotoViewer";
import VideoViewer from "../../../highlights_details/VideoModal";
import buttoner from "../../../../../services/buttoner";
import ColorList from '../../../../colorList';
import BeComponent from '../../../../BeComponent';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import EvilIcons  from 'react-native-vector-icons/EvilIcons';

export default class MediaPreviewer extends BeComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  state = {};
  choseAction(url) {
    if (url.video) {
      this.setStatePure({
          showVideo:true
      })
    } else {
      this.setStatePure({
        enlargeImage: true,
      });
    }
  }
  render() {
    return (
      <View
        style={{
          height: this.props.height || "90%",
          width: "100%",
          alignSelf: "center",
          borderColor:"black",
          borderWidth:0.4,
          borderRadius:10
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
                square
                source={{ uri: this.props.url.photo }}
                style={{
                  alignSelf: "center",
                  height: "100%",
                  width: "100%",
                  borderColor: "#1FABAB",
                  borderRadius:
                    (this.props.url.photo || this.props.url.video) ? 10 : 100,
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
                  height: "100%",
                  width: "100%",
                  borderColor: "#1FABAB",
                  borderRadius:this.props.url.photo || this.props.url.video ? 10 : 5,
                }}
              ></Image>
            )}
          </TouchableOpacity>
          {this.props.url && this.props.url.video ? (
            <View
              style={{
                ...buttoner,
                alignSelf:"center",
                position:"absolute",
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
                    }} name= "headset" style={{
                        fontSize: 40, color: ColorList.bodyBackground
                    }} type="MaterialIcons" />
                    }

            </View>
          ) : null}
        </View>

        {this.props.url && (this.props.url.video || this.props.url.photo) ? (
          <View style={{position: "absolute",alignSelf: "flex-end", height:30,  width:30,margin:"1%",}}>
          <View
            style={{
              ...buttoner,
              width:30,
              height:30,
              borderRadius: 20,
              
            }}
          >
            <EvilIcons
              name={"close"}
              type="EvilIcons"
              onPress={this.props.cleanMedia}
              style={{
                color: ColorList.bodyBackground,
                fontSize: 30,
              }}
            />
          </View>
          </View>
        ) : null}

        {this.state.enlargeImage && this.props.url && this.props.url.photo ? (
          <PhotoViewer
            open={this.state.enlargeImage}
            hidePhoto={() =>
              this.setStatePure({
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
              this.setStatePure({
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


