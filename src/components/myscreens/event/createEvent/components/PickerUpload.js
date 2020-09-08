import React, { Component } from "react";
import PickersMenu from "./PickerMenu";
import FileExachange from "../../../../../services/FileExchange";
import { RNFFmpeg, RNFFprobe} from "react-native-ffmpeg";
import { View } from "react-native";
import Pickers from "../../../../../services/Picker";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import shadower from "../../../../shadower";
import ColorList from "../../../../colorList";
import SearchImage from "./SearchImage";
import rnFetchBlob from "rn-fetch-blob";
import BeComponent from '../../../../BeComponent';
import EvilIcons  from 'react-native-vector-icons/EvilIcons';
import BeNavigator from '../../../../../services/navigationServices';
import { TouchableOpacity } from "react-native-gesture-handler";
import rounder from "../../../../../services/rounder";
import BleashupAlert from "./BleashupAlert";
import Texts from '../../../../../meta/text';

export default class PickersUpload extends BeComponent {
  constructor(props) {
    super(props);
    this.state = {
      downloadProgess: 0,
      newing:false,
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
  clear(stop) {
    this.exchanger &&
      this.exchanger.task &&
      this.exchanger.task.cancel &&
      this.exchanger.task.cancel();
   !stop && this.setStatePure({
      uploading: false
    })
  }
  handleProgress = (reveived, total) => {
    this.setStatePure({
      downloadProgess: reveived / total,
    });
  };
  upload(snaper,isVideo){
    console.warn(snaper,isVideo)
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
          RNFFprobe.getMediaInformation(path).then((info) => {
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
        this.setStatePure({
          uploading: false,
        });
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
  openCamera(){
    BeNavigator.pushTo("CameraScreen", {
      callback: (souce) => setTimeout(() => this.concludePicking(souce)),
      directReturn: false,
      noVideo:true
    })
  }
  concludePicking(snaper){
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
  takeFile(){
    Pickers.TakeFile().then(file => {
      if(file){
        console.warn(file)
        this.setStatePure({
          newing:!this.state.newing,
          uploading:true,
        })
        this.fileExchange = new FileExachange("file://" + file.uri,'/Others/',0,0,
        this.handleProgress,
        (newDir,path,filename) => {

          },null, (error) => {
            this.sayUploadError();
          },file.type,file.name,'/others')
      }
    })
  }
  takeAudio() {
    Pickers.TakeAudio().then((audio) => {
      if (audio) {
        console.warn(audio);
        this.setStatePure({
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
            RNFFprobe.getMediaInformation(path).then((info) => {
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
              this.setStatePure({
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
  hideAlert(){
    this.setStatePure({
      showAlert:false
    })
  }
  showAlert(){
    this.setStatePure({
      alert:{
        title: "Remove Photo",
        message: "Are you sure want to remove this photo"
      },
      showAlert:true
    })
  }
  render() {
    return (

      <View style={{ 
        flexDirection: 'row', 
        alignSelf: 'flex-start',
        alignItems: 'center',
        ...this.props.withTrash || this.state.uploading ? {
          justifyContent: 'space-between',
          width: '100%'}:null 
      }}>


        <View style={{ width: 35,...this.center }}>
          <PickersMenu
            color={this.props.color}
            fontSize={this.props.fontSize}
            menu={[
              {
                title:'Camera',
                condition:true,
                callback:() => this.openCamera()
              },
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

        {!this.props.onlyPhotos && <View style={{ width: 35,...this.center }}>
          <PickersMenu
            menu={[
              {
                title: "Download Photo",
                condition: true,
                callback: () =>
                  this.setStatePure({
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
              }
            ]}
            icon={{
              name: "plus-small",
              type: "Octicons",
            }}
          ></PickersMenu>
        </View>}

        {!this.state.uploading ? null: (
          <View style={{ }}>
            <AnimatedCircularProgress
              size={26}
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
        {this.props.withTrash && <TouchableOpacity 
          onPress={this.showAlert.bind(this)}
          style={{...rounder((this.props.fontSize||30)+5),justifyContent: 'center',}} >
          <EvilIcons style={{ color: 'red', fontSize: this.props.fontSize|| 30 }}
            name="trash" transparent type="EvilIcons" />
          </TouchableOpacity>}

        {this.state.searchImageState && <SearchImage
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
        />}
        {
          this.state.showAlert && <BleashupAlert isOpen={this.state.showAlert}
          title={this.state.alert.title}
          message={this.state.alert.message}
          refuse={Texts.cancel}
          deleteFunction={() => {
            this.props.saveMedia({
              photo:"",
              video:"",
              audio:""
            })
            this.hideAlert()
          }}
          accept={Texts.remove}
          onClosed={this.hideAlert.bind(this)}
          >
          </BleashupAlert>
        }
      </View>

    );
  }
}
