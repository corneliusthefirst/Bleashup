import React, { Component } from "react";
import PickersMenu from "./PickerMenu";
import FileExachange from "../../../../../services/FileExchange";
import { RNFFmpeg } from "react-native-ffmpeg";
import { View } from "react-native";
import Pickers from "../../../../../services/Picker";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import shadower from "../../../../shadower";
import ColorList from "../../../../colorList";
import { Icon } from "native-base";
import SearchImage from "./SearchImage";
import rnFetchBlob from "rn-fetch-blob";

export default class PickersUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadProgess: 0,
    };
  }
  componentDidMount() {
    if (this.props.creating) {
      if (this.props.currentURL.duration) {
        this.previousAudio = this.props.currentURL.audio;
      }
      if (this.props.currentURL.video) {
        this.previousVideo = this.props.currentURL.video;
      }
      if (this.props.currentURL.photo) {
        this.previousPhoto = this.props.currentURL.photo;
      }
    } else {
    }
  }
  state = {
    downloadProgess: 0,
  };
  clear() {
    this.exchanger &&
      this.exchanger.task &&
      this.exchanger.task.cancel &&
      this.exchanger.task.cancel();
  }
  handleProgress = (reveived, total) => {
    this.setState({
      downloadProgess: reveived / total,
    });
  };
  TakePhotoFromLibrary(vid) {
    Pickers.SnapPhoto(!vid).then((snaper) => {
      this.setState({
        newing: !this.state.newing,
        uploading: true,
      });
      this.clear();
      this.cancelUploadError();
      //Pickers.CompressVideo(snaper).then(snap => {
      let isVideo = snaper.content_type.includes("video");
      this.exchanger = new FileExachange(
        snaper.source,
        isVideo ? "/Video/" : "/Photo/",
        0,
        0,
        this.handleProgress,
        (newDir, path, filename, baseURL) => {
          rnFetchBlob.fs.unlink(newDir).then(() => {
          });
          if (this.previousPhoto) {
            let deleter = new FileExachange()
            deleter.deleteFile(this.previousPhoto, true).then(() => {

            })
          }
          if (this.previousVideo) {
            let deleter = new FileExachange()
            deleter.deleteFile(this.previousVideo, true)
          }
          if (isVideo) {
            RNFFmpeg.getMediaInformation(path).then((info) => {
              let photoVid = baseURL + filename.split(".")[0] + "_thumbnail.jpeg"
              this.props.saveMedia({
                ...this.props.currentURL,
                photo: isVideo
                  ? photoVid
                  : path,
                video: isVideo && path,
                video_duration: Math.ceil(info.duration / 1000),
              });
              this.previousPhoto = photoVid
              this.previousVideo = path
            });
          } else {
            this.props.saveMedia({
              ...this.props.currentURL,
              photo: path,
              video: isVideo && path,
            });
          }
          this.previousPhoto = path
          this.setState({
            uploading: false,
          });
        },
        null,
        (error) => {
          this.sayUploadError();
          this.setState({
            newing: !this.state.newing,
          });
          console.warn(error);
        },
        snaper.content_type,
        snaper.filename,
        isVideo ? "/video" : "/photo"
      );
      this.exchanger.upload();
    });
  }
  clearAudio() {
    this.audioExchanger &&
      this.audioExchanger.task &&
      this.audioExchanger.task.cancel &&
      this.audioExchanger.task.cancel();
  }
  takeAudio() {
    Pickers.TakeAudio().then((audio) => {
      if (audio) {
        console.warn(audio);
        this.setState({
          newing: !this.state.newing,
          uploading: true,
        });
        this.clearAudio();
        this.cancelUploadError();
        this.audioExchanger = new FileExachange(
          "file://" + audio.uri,
          "/Sound/",
          0,
          0,
          this.handleProgress,
          (newDir, path, filename) => {
            RNFFmpeg.getMediaInformation(path).then((info) => {
              rnFetchBlob.fs.unlink(newDir).then(() => { });
              if (this.previousAudio) {
                let deleter = new FileExachange()
                deleter.deleteFile(this.previousAudio, true).then(() => {

                })
              }
              this.props.saveMedia({
                ...this.props.currentURL,
                audio: path,
                duration: Math.ceil(info.duration / 1000),
              });
              this.previousAudio = path
              this.setState({
                uploading: false,
              });
            });
          },
          null,
          (error) => {
            this.sayUploadError();
          },
          audio.type,
          audio.name,
          "/sound"
        );
        this.audioExchanger.upload();
      }
    });
  }
  sayUploadError() {
    this.setState({
      uploadError: true,
    });
  }
  cancelUploadError() {
    this.setState({
      uploadError: false,
    });
  }
  state = {};
  cancelAllTasks() {
    this.clear();
    this.clearAudio();
  }
  componentWillUnmount() {
    this.cancelAllTasks();
  }
  render() {
    return (
      <View style={{width: 120, alignItems:"flex-end"}}>
        <View
          style={{
            flex:1,
            flexDirection: "row",
          }}
        >
          <View style={{ width: "33.333%",justifyContent: "center",alignItems:"flex-end" }}>
            {this.state.uploading && (
              <View style={{}}>
                <AnimatedCircularProgress
                  size={30}
                  width={2}
                  backgroundColor={ColorList.headerBackground}
                  tintColor={
                    !this.state.uploadError ? ColorList.iconActive : "red"
                  }
                  fill={parseFloat(this.state.downloadProgess * 100)}
                >
                  {(fill) => (
                    <View>
                      <Icon
                        name="close"
                        onPress={() => this.cancelAllTasks()}
                        style={{ color: ColorList.headerIcon }}
                        type={"EvilIcons"}
                      ></Icon>
                    </View>
                  )}
                </AnimatedCircularProgress>
              </View>
            )}
          </View>

          <View style={{ width: "33.333%",justifyContent: "center",alignItems:"flex-end" }}>
            <PickersMenu
              menu={[
                {
                  title: "Gallery",
                  condition: true,
                  callback: () => this.TakePhotoFromLibrary(false),
                },
              ]}
              icon={{
                name: "camera",
                type: "EvilIcons",
              }}
            ></PickersMenu>
          </View>

          <View style={{ width: "33.333%", justifyContent: "center",alignItems:"flex-end",paddingRight:5 }}>
            <PickersMenu
              menu={[
                {
                  title: "Download Photo",
                  condition: true,
                  callback: () =>
                    this.setState({
                      searchImageState: true,
                    }),
                },
                {
                  title: "Video",
                  condition: this.props.notVideo ? false : true,
                  callback: () => this.TakePhotoFromLibrary(true),
                },
                {
                  title: "Add Audio",
                  condition: this.props.notAudio ? false : true,
                  callback: () => this.takeAudio(),
                },
              ]}
              icon={{
                name: "plus-small",
                type: "Octicons",
              }}
            ></PickersMenu>
          </View>



        </View>
        <SearchImage
          openPicker={() => {
            this.TakePhotoFromLibrary();
          }}
          h_modal={true}
          isOpen={this.state.searchImageState}
          onClosed={(mother) => {
            this.setState({
              searchImageState: false,
            });
          }}
        />
      </View>
    );
  }
}
