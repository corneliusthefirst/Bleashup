/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

import React, { Component } from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { RNCamera as Camera } from 'react-native-camera';
import propTypes from 'prop-types';
import BleashupModal from '../BleashupModal';
import PickedImage from './pickedImage';
import ZoomView from './zoomView';
import  Stopwatch from './timer/stopwatch';
import Pickers from '../../../services/Picker';
import GState from '../../../stores/globalState/index';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from "react-native-vector-icons/Ionicons"
import  MaterialIconCommunity  from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from "react-native-vector-icons/Feather"
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from "react-native-vector-icons/FontAwesome"

//VARIABLES
const ZOOM = { MIN: 0, MAX: 1.0 };
const { height , width } = Dimensions.get('window');

export default class CameraScreen extends BleashupModal {
  initialize(){
    this.props.navigation ? GState.nav = this.props.navigation : null
    this.state = {
      zoom: 0,
      scale: 0,
      previousScale: 0,
      flashMode: 'off',
      orientation: Camera.Constants.Type.back,
      paused: false,
      videoActivated: false,
      picked: false,
      data: { photo: '', video: '' },
      dataToreturn: {},
      stopwatchStart: false,
      stopwatchReset: false,
      recordOptions: {
        mute: false,
        maxDuration: 10800,
        quality: Camera.Constants.VideoQuality['480p'],
      },
      isRecording: false,
    };
  }
  borderRadius = 0;
  modalHeight = "100%";
  modalWidth = "100%";
  height='100%'
 
  getParam = (route) => this.props.navigation && this.props.navigation.getParam(route)
  callback = this.getParam("callback")
  openGalleryRoute = this.getParam('openGallery')
  directreturn = this.getParam("directReturn")

  onClosedModal() {
    this.callback ? this.goback() : this.props.onClosed();
}
goback(){
  this.props.navigation.goBack()
}
  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: false };
      let result = await this.camera.takePictureAsync(options);
      // console.warn("result is", result);
      this.state.data.photo = result.uri;
      let temp = result.uri.split('/');
      this.setStatePure({data:this.state.data, dataToreturn:{source:result.uri,content_type:'image',filename:temp[temp.length - 1]}});


      if (this.directreturn || this.props.directreturn){
        this.callback?this.callback(this.state.dataToreturn):
        this.props.onCaptureFinish(this.state.data);
        this.onClosedModal()
      }else{
        this.setStatePure({ picked: true });
      }
    }
  };

  takeVideo = async function() {
    if (this.camera) {
      try {
        const promise = this.camera.recordAsync(this.state.recordOptions);

        if (promise) {
          this.setStatePure({ isRecording: true });
          const data = await promise;

          this.state.data.video = data.uri;
          let temp = data.uri.split('/');
          this.setStatePure({data:this.state.data, dataToreturn:{source:data.uri,content_type:'video',filename:temp[temp.length - 1]}});

          this.setStatePure({ isRecording: false });
          //console.warn('takeVideo', data);
          if (this.directreturn || this.props.directreturn){
            this.callback ? this.callback(this.state.dataToreturn):
            this.props.onCaptureFinish(this.state.data);
            this.onClosedModal()
          }else{
            this.setStatePure({ picked: true });
          }
        }
      } catch (e) {
        this.setStatePure({videoActivated:false});
      }
    }
  };

  onPressFlashMode = () => {
    let modeList = [];
    for (const key in Camera.Constants.FlashMode) {
      modeList.push(key);
    }

    for (let i = 0; i < modeList.length; i++) {
      if (modeList[i] === this.state.flashMode) {
        let nextMode;
        if (i + 1 < modeList.length) {
          nextMode = modeList[i + 1];
        } else {
          nextMode = modeList[0];
        }
        this.setStatePure({ flashMode: nextMode });
        break;
      }
    }
  };

  onPressOrientation = () => {
    let { front, back } = Camera.Constants.Type;
    let newOrientation = this.state.orientation === front ? back : front;
    this.setStatePure({ orientation: newOrientation });
  };

  onPressZoom = (command) => {
    let currentZoom = parseFloat(this.state.zoom.toPrecision(1));
    switch (command) {
      case 'PLUS': {
        if (currentZoom < ZOOM.MAX) {
          this.setStatePure({ zoom: currentZoom + 0.1 });
        }
        break;
      }
      case 'MINUS': {
        if (currentZoom > ZOOM.MIN) {
          this.setStatePure({ zoom: currentZoom - 0.1 });
        }
        break;
      }
      default:
        break;
    }
    // (0.9999999999999999).toPrecision(2)
  };

  renderFlashIcon = () => {
    let iconName;
    if (this.state.flashMode !== 'on' && this.state.flashMode !== 'torch') {
      iconName = `flash-${this.state.flashMode}`;
    } else {
      if (this.state.flashMode === 'on') {
        iconName = 'flash';
      } else if (this.state.flashMode === 'torch') {
        iconName = 'flashlight';
      }
    }
    return iconName;
  };

  onCameraReady = () => {
    this.setStatePure({ ready: true });
    if (typeof this.props.onCameraReady === 'function') {
        this.props.onCameraReady && this.props.onCameraReady();
    }
  };

  onMountError = (e) => {
    if (typeof this.props.onMountError === 'function') {
        this.props.onMountError && this.props.onMountError(e);
    }
  };


 openGallery = (option) => {
   if(this.openGalleryRoute){
     this.goback()
     this.openGalleryRoute()
   }else{
     Pickers.SnapPhoto(option).then((data) => {
       //console.warn("from picker is",data);
       let type = data.content_type.slice(0, 5);
       if (type == "video") {
         this.state.data.video = data.source;
         this.setStatePure({ data: this.state.data, dataToreturn: data });

         if (this.directreturn || this.props.directreturn) {
           this.callback ? this.callback(this.state.dataToreturn) : this.props.onCaptureFinish(this.state.dataToreturn);
           this.onClosedModal()
         }
         else {
           this.setStatePure({ picked: true });
         }

       }
       else {

         this.state.data.photo = data.source;
         this.setStatePure({ data: this.state.data, dataToreturn: data });

         if (this.directreturn || this.props.directreturn) {
           this.callback ? this.callback(this.state.dataToreturn) : this.props.onCaptureFinish(this.state.dataToreturn);
           this.onClosedModal();
         }
         else {
           this.setStatePure({ picked: true });
         }

       }
     });

   }
 }



activateVideo = () => {
  this.setStatePure({videoActivated:true});
  this.takeVideo();
  this.toggleStopwatch();
  //console.warn("video activated",this.state.videoActivated);
  //then call required functions
};

deactivateVideo = () => {
  this.camera.stopRecording();  //stop recording
  this.setStatePure({videoActivated:false});
  this.resetStopwatch();
}

pauseVideo = () => {
  this.state.paused ? this.camera.resumePreview() : this.camera.pausePreview();
  this.setStatePure({paused:!this.state.paused});
  this.toggleStopwatch();
}


//for video time recording
toggleStopwatch = () => {
  this.setStatePure({stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false});
}

resetStopwatch = () => {
  this.setStatePure({stopwatchStart: false, stopwatchReset: true});
}

getFormattedTime(time) {
    this.currentTime = time;
};
novideo= this.getParam("noVideo") || this.props.novideo
//close picked

closepicked = (data) => {
  console.warn("data to return is",data);
   if (data.source){
   this.callback?this.callback(data): this.props.onCaptureFinish(data);
    this.setStatePure({picked:false , data:{photo:'',video:''}});
    this.onClosedModal()
   }
   else {

    this.setStatePure({picked:false , data:{photo:'',video:''}});
   }

}
render(){
  return this.callback ? <View style={{height:"100%"}}><StatusBar></StatusBar>{this.modalBody()}</View> : this.modal()
}
  modalBody() {

    return (
        <Animated.View style={[styles.container, { position: 'relative' }]}>

        <Camera
          ref={(ref) => {
            this.camera = ref;
          }}
          zoom={this.state.zoom}
          useNativeZoom={true}
          style={{ flex: 1 }}
          type={this.state.orientation}
          flashMode={this.state.flashMode}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onCameraReady={this.onCameraReady}
          onMountError={this.onMountError}
        />

        <View style={{ position: 'absolute', width: '100%', height: '100%' }}>

          <View style={{ flex: 1 }}>

            <View style={{ flexDirection: 'row',height:50 ,backgroundColor:"rgba(0, 0, 0, 0.2)"}}>


            <View style={{ height:'100%' ,alignItems: 'center' }}>

              <TouchableOpacity
                 onPress={()=>{this.onClosedModal();}}
                 style={{
                  height:'100%' ,
                   alignItems:'center',
                   justifyContent:'center',
                 }}
             >
            <View
             style={{
              height:'100%' ,
              alignItems:'flex-start',
              justifyContent:'center',
              width:width / 3,
           }}>
                  <AntDesign
                    name="close"
                    style={{color:'white', fontSize:25 , marginLeft:15}}
                    type="AntDesign"
                    onPress={()=>{this.onClosedModal();}}
                  />

             </View>

            </TouchableOpacity>

          </View>

              <View style={{ flex: 1, alignItems: 'center' , width:width / 3}} />


              <View style={{height:'100%' , flexDirection:'row', alignSelf:'center',justifyContent:'space-between',width:width / 3 }}>

              <TouchableOpacity onPress={this.onPressOrientation} style={{height:'100%' ,paddingLeft:10,paddingRight:10,marginLeft:20,justifyContent:'center'}} >
                  <Ionicons name="ios-reverse-camera" type="Ionicons" style={{color:'white', fontSize:30 }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={this.onPressFlashMode}   style={{height:'100%' ,paddingLeft:10,justifyContent:'center'}} >
                  <MaterialIconCommunity
                    name={this.renderFlashIcon()}
                    style={{color:'white', fontSize:25,marginRight:10 }}
                  />
                </TouchableOpacity>

              </View>


            </View>

          </View>


          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding: 10}}>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>

                <TouchableOpacity onPress={this.onPressZoom.bind(this, 'PLUS')} style={{padding:5,backgroundColor:"rgba(0, 0, 0, 0.3)",borderRadius:20}}>
                  <Feather size={25} name="zoom-in" type="Feather"  style={{color:'white', fontSize:25 }} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={this.onPressZoom.bind(this, 'MINUS')}
                  style={{padding:5,marginTop:15,backgroundColor:"rgba(0, 0, 0, 0.3)",borderRadius:20}}
                >
                  <Feather size={25} name="zoom-out" type="Feather"   style={{color:'white', fontSize:25 }} />
                </TouchableOpacity>

              </View>
          {/**here close */}
          </View>



          <View  style={{flexDirection:'row', height:75,backgroundColor:"rgba(0, 0, 0, 0.3)",paddingTop:5}}>
          {this.state.videoActivated && this.state.isRecording ? <TouchableOpacity
                 onPress={this.pauseVideo}
                 style={{
                   height:'100%',
                   alignSelf: 'center',
                   alignItems:'flex-start',
                   justifyContent:'center',
                   width:width / 3,
                   marginBottom: 10,
                 }}
             >
            <View
             style={{
              flex: 1,
              alignItems:'flex-start',
              justifyContent:'center',
           }}>
                  <AntDesign
                    name="pausecircle"
                    style={{color:this.state.paused ? 'white' : '#f94c4c', fontSize:35 , marginLeft:15}}
                    onPress={this.pauseVideo}
                  />

             </View>

            </TouchableOpacity> :
            <TouchableOpacity
                 onPress={() => {this.novideo ? this.openGallery('photo') : this.openGallery('all')}}
                 style={{
                   height:'100%',
                   alignSelf: 'center',
                   alignItems:'flex-start',
                   justifyContent:'center',
                   width:width / 3,
                   marginBottom: 10,
                 }}
             >
            <View
             style={{
              flex: 1,
              alignItems:'flex-start',
              justifyContent:'center',
           }}>
                  <MaterialIcons
                    name="photo-library"
                    style={{color:'white', fontSize:35 , marginLeft:15}}
                    onPress={() => {this.novideo ? this.openGallery('photo') : this.openGallery('all')}}
                  />

             </View>

            </TouchableOpacity>}
             {this.state.videoActivated ?
                      <TouchableOpacity
                       onLongPress={() => this.deactivateVideo()}
                       delayLongPress={100}
                       style={{
                        height:'100%',
                         width:width / 3,
                         alignSelf: 'center',
                         marginBottom: 10,
                         //position:'absolute',
                         //bottom:10,
                     }}
                   >
                     <View style={{alignItems:'center',justifyContent:'center'}}>
                     <FontAwesome name="circle-thin" style={{color:'white', fontSize:70 , position:'relative'}} />
                      <View style={{ alignSelf: 'center',alignItems:'center',justifyContent:'center',height:44,width:44,borderRadius:22,backgroundColor:'white',marginTop:-57.5}}>
                        <FontAwesome name="circle"  style={{color:'#f94c4c', fontSize:18 }} />
                      </View>
                     </View>

                   </TouchableOpacity>
                   :
                    <TouchableOpacity
                              onPress={this.takePicture}
                              onLongPress={()=>{ !this.novideo ? this.activateVideo() : null; }}
                              delayLongPress={500}
                              style={{
                                height:'100%',
                                width:width / 3,
                                alignSelf: 'center',
                                alignItems:'center',
                                justifyContent:'center',
                                marginBottom: 10,
                             }}
                          >
                               <FontAwesome name="circle-thin" style={{color:'white', fontSize:70}} />
                     </TouchableOpacity>
           }

            {this.state.videoActivated && this.state.isRecording  ? <View
                 onPress={this.pauseVideo}
                 style={{
                   height:'100%',
                   alignSelf: 'center',
                   alignItems:'flex-end',
                   justifyContent:'center',
                   width:width / 3,
                   marginBottom: 10,
                   paddingRight:15
                 }}
             >
             <Stopwatch laps={false} msecs={false} start={this.state.stopwatchStart}
                 reset={this.state.stopwatchReset}
                 options={options}
                 getTime={this.getFormattedTime} />
            </View> : null}


          </View>

        </View>

        {this.state.picked && <PickedImage   isOpen={this.state.picked} onClosed={(data)=>{this.closepicked(data)}} dataToreturn={this.state.dataToreturn} data={this.state.data} 
        nomessage={this.props.nomessage}
         messagePlaceHolder={this.props.messagePlaceHolder ? this.props.messagePlaceHolder : "write something..."}
         maxLength={this.props.maxLength ? this.props.maxLength : 2000}
         multiline={this.props.multiline ? this.props.multiline : false}
         />}

      </Animated.View>

    );
  };
}

CameraScreen.propTypes = {
  onCameraReady: propTypes.func,
  onMountError: propTypes.func,
  onCaptureFinish: propTypes.func.isRequired,
};

const options = {
  container: {
    backgroundColor: '#f94c4c',
    paddingTop: 4,
    paddingBottom:4,
    borderRadius: 15,
    width: 55,
  },
  text: {
    fontSize: 10,
    color: '#FFF',
    marginLeft: 7,
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});