import React, { Component } from "react";
import PickersMenu from "./PickerMenu";
import FileExachange from "../../../../../services/FileExchange";
import { RNFFmpeg, RNFFprobe } from "react-native-ffmpeg";
import { View, TouchableOpacity } from "react-native";
import Pickers from "../../../../../services/Picker";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import shadower from "../../../../shadower";
import ColorList from "../../../../colorList";
import SearchImage from "./SearchImage";
import rnFetchBlob from "rn-fetch-blob";
import BeComponent from '../../../../BeComponent';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import BeNavigator from '../../../../../services/navigationServices';
import rounder from "../../../../../services/rounder";
import BleashupAlert from "./BleashupAlert";
import Texts from '../../../../../meta/text';
import AudioRecorder from '../../../eventChat/AudioRecorder';
import IDMaker from '../../../../../services/IdMaker';
import MessageActions from "../../../eventChat/MessageActons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GState from "../../../../../stores/globalState";
import Entypo from 'react-native-vector-icons/Entypo';

export default class PickersUpload extends BeComponent {
  constructor(props) {
    super(props);
    this.state = {
      downloadProgess: 0,
      newing: false,
    };
    this.hideActions = this.hideActions.bind(this)
    this.showActions = this.showActions.bind(this)
    this.actions = this.actions.bind(this)
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
  clear(stop) {
    this.exchanger &&
      this.exchanger.task &&
      this.exchanger.task.cancel &&
      this.exchanger.task.cancel();
    !stop && this.hideProgress()
  }
  handleProgress = (reveived, total) => {
    this.setStatePure({
      downloadProgess: reveived / total,
    });
  };
  deleteFile(file) {
    let deleter = new FileExachange()
    console.warn("deleting: ", file)
    deleter.deleteFile(file, true)
    this.resetPreviousVal()
  }
  resetPreviousVal() {
    this.previousAudio = null
    this.previousFile = null
    this.previousPhoto = null
    this.previousVideo = null
  }
  cleanMedia() {
    this.deletePreviousVals()
    this.cancelAllUploads()
  }
  cancelAllUploads() {
    this.clearAudio()
    this.clearFile()
    this.cleanMedia()
  }
  deletePreviousVals() {
    if (this.previousPhoto) {
      this.deleteFile(this.previousPhoto)
    }
    if (this.previousVideo) {
      this.deleteFile(this.previousVideo)
    }
    if (this.previousAudio) {
      this.deleteFile(this.previousAudio)
    }
    if (this.previousFile)
      this.deleteFile(this.previousFile)
  }
  unlinkNewDir(newDir) {
    rnFetchBlob.fs.unlink(newDir)
  }
  compressVideoAndSend(path, filename, baseURL) {
    RNFFprobe.getMediaInformation(path).then((info) => {
      let photoVid = baseURL + filename.split(".")[0] + "_thumbnail.jpeg"
      this.props.saveMedia({
        photo: photoVid,
        video: path,
        video_duration: Math.ceil(info.duration / 1000),
      });
      this.previousPhoto = photoVid
      this.previousVideo = path
    });
  }
  upload(snaper, isVideo) {
    this.exchanger = new FileExachange(
      snaper.source,
      isVideo ? "/Video/" : "/Photo/",
      0,
      0,
      this.handleProgress,
      (newDir, path, filename, baseURL) => {
        this.unlinkNewDir(newDir)
        this.deletePreviousVals()
        if (isVideo) {
          this.compressVideoAndSend(path, filename, baseURL)
        } else {
          this.props.saveMedia({
            photo: path,
          });
        }
        this.previousPhoto = path
        this.hideProgress()
      },
      null,
      (error) => {
        this.sayUploadError();
        this.setStatePure({
          newing: !this.state.newing,
        });
        console.warn(error);
      },
      snaper.content_type,
      snaper.filename,
      isVideo ? "/video" : "/photo"
    );
    this.exchanger.upload();
  }
  iconStyle = {
    ...GState.defaultIconSize,
    color: ColorList.indicatorColor
  }
  openCamera() {
    BeNavigator.pushTo("CameraScreen", {
      callback: (souce) => setTimeout(() => this.concludePicking(souce)),
      directReturn: false,
      noVideo: true
    })
  }
  concludePicking(snaper) {
    console.warn(snaper, "oooo")
    this.setStatePure({
      newing: !this.state.newing,
      uploading: true,
    });
    this.clear(true);
    this.cancelUploadError();
    //Pickers.CompressVideo(snaper).then(snap => {
    let isVideo = snaper.content_type.includes("video");
    if (!isVideo) {
      Pickers.resizePhoto(snaper.source).then(source => {
        this.upload({ ...snaper, source }, isVideo)
      })
    } else {
      this.upload(snaper, isVideo)
    }
  }
  TakePhotoFromLibrary(vid) {
    Pickers.SnapPhoto(!vid).then((snaper) => {
      this.concludePicking(snaper)
    });
  }
  clearAudio() {
    this.audioExchanger &&
      this.audioExchanger.task &&
      this.audioExchanger.task.cancel &&
      this.audioExchanger.task.cancel();
  }
  clearFile() {
    this.fileExchange &&
      this.fileExchange.task &&
      this.fileExchange.task.cancel &&
      this.fileExchange.task.cancel()
  }
  takeFile() {
    Pickers.TakeFile().then(file => {
      if (file) {
        console.warn(file)
        this.setStatePure({
          newing: !this.state.newing,
          uploading: true,
        })
        this.clearFile()
        this.cancelUploadError()
        this.fileExchange = new FileExachange("file://" + file.uri, '/Others/', 0, 0,
          this.handleProgress,
          (newDir, path, filename) => {
            console.warn("uploaded file: ", path)
            this.unlinkNewDir(newDir)
            this.deletePreviousVals()
            this.props.saveMedia({
              source: path,
              file_name: file.name,
              total: file.size
            })
            this.previousFile = path
            this.hideProgress()
          }, null, (error) => {
            this.sayUploadError();
          }, file.type, file.name, '/other')
        this.fileExchange.upload()
      }
    })
  }
  hideProgress() {
    this.setStatePure({
      uploading: false,
    });
  }
  takeAudio() {
    Pickers.TakeAudio().then((audio) => {
      if (audio) {
        console.warn(audio);
        this.clearAudio();
        this.cancelUploadError();
        this.uplaodAudio(audio)
      }
    });
  }
  uplaodAudio(audio) {
    this.setStatePure({
      newing: !this.state.newing,
      uploading: true,
    });
    this.audioExchanger = new FileExachange(
      "file://" + audio.uri,
      "/Sound/",
      0,
      0,
      this.handleProgress,
      (newDir, path, filename) => {
        RNFFprobe.getMediaInformation(path).then((info) => {
          console.warn("sound duration is: ", info.duration, path)
          this.unlinkNewDir(newDir)
          this.deletePreviousVals()
          this.props.saveMedia({
            source: path,
            id: audio.name,
            duration: Math.ceil(info.duration / 1000),
          });
          this.previousAudio = path
          this.hideProgress()
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

  sayUploadError() {
    this.setStatePure({
      uploadError: true,
    });
  }
  cancelUploadError() {
    this.setStatePure({
      uploadError: false,
    });
  }
  state = {};
  cancelAllTasks() {
    this.clear();
    this.clearAudio();
  }
  unmountingComponent() {
    this.cancelAllTasks();
  }
  center = {
    marginTop: "auto",
    marginBottom: "auto",
  }
  hideAlert() {
    this.setStatePure({
      showAlert: false
    })
  }
  showAlert() {
    this.setStatePure({
      alert: {
        title: Texts.remove_photo,
        message: Texts.are_you_sure_to_remove_photo
      },
      showAlert: true
    })
  }
  toggleAudio() {
    this.setStatePure({
      showAudioRecorder: !this.state.showAudioRecorder,
    });
  }
  toggleAudioRecorder() {
    this.toggleAudio()
    this.toggleAudioTimeout = setTimeout(() => {
      if (!this.state.showAudioRecorder) {
        this.refs.AudioRecorder && this.refs.AudioRecorder.stopRecordSimple();
      } else {
        this.refs.AudioRecorder && this.refs.AudioRecorder.startRecorder();
      }
      clearTimeout(this.toggleAudioTimeout)
    }, 50);
  }
  sendAudioFile(filename, duration, dontsend) {
    this.toggleAudio()
    if (!dontsend) {
      this.uplaodAudio({
        uri: filename,
        type: "audio/mp3",
        name: IDMaker.make()
      })
    }
  }
  hideRecorder() {
    this.setStatePure({
      showAudioRecorder: false,
    });
  }
  audioRecorder() {
    return (
      <View style={{
        margin: 2,
        flex: 1,
      }}>
        <AudioRecorder
          justHideMe={this.hideRecorder.bind(this)}
          showAudioRecorder={this.state.showAudioRecorder}
          sendAudioMessge={this.sendAudioFile.bind(this)}
          ref={"AudioRecorder"}
          toggleAudioRecorder={this.toggleAudioRecorder.bind(this)}
        ></AudioRecorder>
      </View>
    );
  }
  get_random_color() {
    return ColorList.colorArray[Math.floor(Math.random() * (ColorList.colorArray.length - 1))]
  }
  hideActions() {
    this.setStatePure({
      showMediaPossibilities: false
    })
  }
  showActions() {
    this.setStatePure({
      showMediaPossibilities: true
    })
  }
  actions() {
    return [
      {
        iconName: 'camera',
        iconType: 'Entypo',
        color: this.get_random_color(),
        title: Texts.camera,
        condition: () => this.props.notCamera ? false : true,
        callback: () => this.openCamera()
      },
      {
        iconName: 'ios-albums',
        iconType: 'Ionicons',
        color: this.get_random_color(),
        title: Texts.galery,
        condition: () => this.props.notGalery ? false : true,
        callback: () => this.TakePhotoFromLibrary(false),
      },
      {
        iconName: 'web',
        iconType: 'Foundation',
        color: this.get_random_color(),
        title: Texts.take_photo_from_internet,
        condition: () => this.props.notInternet ? false : true,
        callback: () =>
          this.setStatePure({
            searchImageState: true,
          }),
      },
      {
        iconName: 'folder-video',
        iconType: 'Entypo',
        color: this.get_random_color(),
        title: Texts.add_video,
        condition: () => this.props.notVideo || this.props.onlyPhotos ? false : true,
        callback: () => this.TakePhotoFromLibrary(true),
      },
      {
        iconName: 'sound',
        iconType: 'Entypo',
        color: this.get_random_color(),
        title: Texts.add_audio,
        condition: () => (this.props.notAudio||this.props.onlyPhotos) ? false : true,
        callback: () => this.takeAudio(),
      },
      {
        iconName: 'microphone',
        iconType: 'FontAwesome',
        color: this.get_random_color(),
        title: Texts.record_audio,
        condition: () => (this.props.notAudio || this.props.onlyPhotos) ? false : true,
        callback: () => this.toggleAudioRecorder()
      },
      {
        iconName: 'file',
        iconType: 'FontAwesome',
        color: this.get_random_color(),
        title: Texts.add_file,
        condition: () => (this.props.notFile || this.props.onlyPhotos) ? false : true,
        callback: () => this.takeFile(),
      }
    ]
  }
  render() {
    return (

      <View style={{
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        ...this.props.withTrash || this.state.uploading ? {
          //justifyContent: 'space-between',
        } : null
      }}>


        <TouchableOpacity onPress={this.showActions}
          style={{
            width: 45,
            ...this.center,
            alignSelf: 'flex-start',
            marginRight: 10,
          }}>
          <View style={{
            ...rounder(40, ColorList.descriptionBody),
            justifyContent: 'center',
          }}>
            {this.props.onlyPhotos ||
              (this.props.notAudio && this.props.notFile) ?
              <MaterialIcons
                name={'insert-photo'}
                style={this.iconStyle}
              >
              </MaterialIcons> :
              <Entypo
                style={this.iconStyle}
                name={"attachment"}>
              </Entypo>}
          </View>
        </TouchableOpacity>
        {this.state.showAudioRecorder ? this.audioRecorder() : null}
        {!this.state.uploading ? null : (
          <View style={{ ...rounder((this.props.fontSize || 26) || 5, ColorList.bodyBackground),marginRight: 10, }}>
            <AnimatedCircularProgress
              size={this.props.fontSize || 26}
              width={2}
              backgroundColor={ColorList.indicatorInverted}
              tintColor={
                !this.state.uploadError ? ColorList.indicatorColor : "red"
              }
              fill={parseFloat(this.state.downloadProgess * 100)}
            >
              {(fill) => (
                <View>

                  <EvilIcons
                    name="close"
                    onPress={() => this.cancelAllTasks()}
                    style={{ color: ColorList.headerIcon, fontSize: 20 }}
                    type={"EvilIcons"}
                  />
                </View>
              )}
            </AnimatedCircularProgress>
          </View>
        )}
        {this.props.withTrash ? <TouchableOpacity
          onPress={this.showAlert.bind(this)}
          style={{ ...rounder((this.props.fontSize || 30) + 5), justifyContent: 'center', }} >
          <EvilIcons style={{ color: 'red', fontSize: this.props.fontSize || 30 }}
            name="trash" transparent type="EvilIcons" />
        </TouchableOpacity> : null}

        {this.state.searchImageState ? <SearchImage
          openPicker={() => {
            this.TakePhotoFromLibrary();
          }}
          h_modal={true}
          isOpen={this.state.searchImageState}
          onClosed={(mother) => {
            this.setStatePure({
              searchImageState: false,
            });
          }}
        /> : null}
        {this.state.showMediaPossibilities ? <MessageActions
          actions={this.actions}
          isOpen={this.state.showMediaPossibilities}
          onClosed={this.hideActions}
          title={Texts.uploads_possibilities}
        ></MessageActions> : null}
        {
          this.state.showAlert ? <BleashupAlert isOpen={this.state.showAlert}
            title={this.state.alert.title}
            message={this.state.alert.message}
            refuse={Texts.cancel}
            deleteFunction={() => {
              this.props.saveMedia({
                photo: "",
                video: "",
                audio: ""
              })
              this.hideAlert()
            }}
            accept={Texts.remove}
            onClosed={this.hideAlert.bind(this)}
          >
          </BleashupAlert> : null
        }
      </View>

    );
  }
}
