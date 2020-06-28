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
import {Icon} from 'native-base';
import propTypes from 'prop-types';
//import ColorList from '../../colorList';
import BleashupModal from '../BleashupModal';
import PickedImage from './pickedImage';
import ZoomView from './zoomView';
import  Stopwatch from './timer/stopwatch';
//import ImagePicker from 'react-native-image-crop-picker';
import Pickers from '../../../services/Picker';

//VARIABLES
const ZOOM = { MIN: 0, MAX: 1.0 };
const { height , width } = Dimensions.get('window');

export default class CameraScreen extends BleashupModal {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 0,
      scale: 0,
      previousScale: 0,
      flashMode: 'off',
      orientation: Camera.Constants.Type.back,
      paused:false,
      videoActivated:false,
      picked:false,
      data:{photo:'',video:''},
      dataToreturn:{},
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


  onClosedModal() {
    this.props.onClosed();
}

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: false };
      let result = await this.camera.takePictureAsync(options);
      // console.warn("result is", result);
      this.state.data.photo = result.uri;
      let temp = result.uri.split('/');
      this.setState({data:this.state.data, dataToreturn:{source:result.uri,content_type:'image',filename:temp[temp.length - 1]}});


      if (this.props.directreturn){
        this.props.onCaptureFinish(this.state.data);
        this.props.onClosed();
      }

      this.setState({picked:true});

    }
  };

  takeVideo = async function() {
    if (this.camera) {
      try {
        const promise = this.camera.recordAsync(this.state.recordOptions);

        if (promise) {
          this.setState({ isRecording: true });
          const data = await promise;

          this.state.data.video = data.uri;
          let temp = data.uri.split('/');
          this.setState({data:this.state.data, dataToreturn:{source:data.uri,content_type:'video',filename:temp[temp.length - 1]}});

          this.setState({ isRecording: false });
          //console.warn('takeVideo', data);
          if (this.props.directreturn){
            this.props.onCaptureFinish(this.state.data);
            this.props.onClosed();
          }
        }
      } catch (e) {
        this.setState({videoActivated:false});
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
        this.setState({ flashMode: nextMode });
        break;
      }
    }
  };

  onPressOrientation = () => {
    let { front, back } = Camera.Constants.Type;
    let newOrientation = this.state.orientation === front ? back : front;
    this.setState({ orientation: newOrientation });
  };

  onPressZoom = (command) => {
    let currentZoom = parseFloat(this.state.zoom.toPrecision(1));
    switch (command) {
      case 'PLUS': {
        if (currentZoom < ZOOM.MAX) {
          this.setState({ zoom: currentZoom + 0.1 });
        }
        break;
      }
      case 'MINUS': {
        if (currentZoom > ZOOM.MIN) {
          this.setState({ zoom: currentZoom - 0.1 });
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
    this.setState({ ready: true });
    if (typeof this.props.onCameraReady === 'function') {
        this.props.onCameraReady && this.props.onCameraReady();
    }
  };

  onMountError = (e) => {
    console.log(e);
    if (typeof this.props.onMountError === 'function') {
        this.props.onMountError && this.props.onMountError(e);
    }
  };


 openGallery = () => {
  Pickers.SnapPhoto('all').then((data)=>{
    //console.warn("from picker is",data);
    let type = data.content_type.slice(0,5);
    if(type == "video"){
      this.state.data.video = data.source;
      this.setState({data:this.state.data,dataToreturn:data});

      if(this.props.directreturn){
       this.props.onCaptureFinish(this.state.dataToreturn);
       this.props.onClosed();
      }
      else{
        this.setState({picked:true});
      }

    }
    else{

     this.state.data.photo =  data.source;
     this.setState({data:this.state.data,dataToreturn:data});

     if(this.props.directreturn){
       this.props.onCaptureFinish(this.state.dataToreturn);
       this.props.onClosed();
      }
      else{
        this.setState({picked:true});
      }

    }
  });

 }



activateVideo = () => {
  this.setState({videoActivated:true});
  this.takeVideo();
  this.toggleStopwatch();
  //console.warn("video activated",this.state.videoActivated);
  //then call required functions
};

deactivateVideo = () => {
  this.camera.stopRecording();  //stop recording
  this.setState({videoActivated:false});
  this.setState({picked:true});
  this.resetStopwatch();
}

pauseVideo = () => {
  this.state.paused ? this.camera.resumePreview() : this.camera.pausePreview();
  this.setState({paused:!this.state.paused});
  this.toggleStopwatch();
}


//for video time recording
toggleStopwatch = () => {
  this.setState({stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false});
}

resetStopwatch = () => {
  this.setState({stopwatchStart: false, stopwatchReset: true});
}

getFormattedTime(time) {
    this.currentTime = time;
};

//close picked

closepicked = (data) => {
  console.warn("data to return is",data);
   if (data.source){
    this.props.onCaptureFinish(data);
    this.setState({picked:false , data:{photo:'',video:''}});
    this.props.onClosed();
   }
   else {

    this.setState({picked:false , data:{photo:'',video:''}});
   }

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
                 onPress={()=>{this.props.onClosed();}}
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
                  <Icon
                    name="close"
                    style={{color:'white', fontSize:25 , marginLeft:15}}
                    type="AntDesign"
                    onPress={()=>{this.props.onClosed();}}
                  />

             </View>

            </TouchableOpacity>

          </View>

              <View style={{ flex: 1, alignItems: 'center' , width:width / 3}} />


              <View style={{height:'100%' , flexDirection:'row', alignSelf:'center',justifyContent:'space-between',width:width / 3 }}>

              <TouchableOpacity onPress={this.onPressOrientation} style={{height:'100%' ,paddingLeft:10,paddingRight:10,marginLeft:20,justifyContent:'center'}} >
                  <Icon name="ios-reverse-camera" type="Ionicons" style={{color:'white', fontSize:30 }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={this.onPressFlashMode}   style={{height:'100%' ,paddingLeft:10,justifyContent:'center'}} >
                  <Icon
                    name={this.renderFlashIcon()}
                    style={{color:'white', fontSize:25,marginRight:10 }}
                    type="MaterialCommunityIcons"
                  />
                </TouchableOpacity>

              </View>


            </View>

          </View>


          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding: 10}}>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>

                <TouchableOpacity onPress={this.onPressZoom.bind(this, 'PLUS')} style={{padding:5,backgroundColor:"rgba(0, 0, 0, 0.3)",borderRadius:20}}>
                  <Icon size={25} name="zoom-in" type="Feather"  style={{color:'white', fontSize:25 }} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={this.onPressZoom.bind(this, 'MINUS')}
                  style={{padding:5,marginTop:15,backgroundColor:"rgba(0, 0, 0, 0.3)",borderRadius:20}}
                >
                  <Icon size={25} name="zoom-out" type="Feather"   style={{color:'white', fontSize:25 }} />
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
                  <Icon
                    name="pausecircle"
                    style={{color:this.state.paused ? 'white' : '#f94c4c', fontSize:35 , marginLeft:15}}
                    type="AntDesign"
                    onPress={this.pauseVideo}
                  />

             </View>

            </TouchableOpacity> :

            <TouchableOpacity
                 onPress={this.openGallery}
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
                  <Icon
                    name="photo-library"
                    style={{color:'white', fontSize:35 , marginLeft:15}}
                    type="MaterialIcons"
                    onPress={this.openGallery}
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
                     <Icon name="circle-thin" type="FontAwesome" style={{color:'white', fontSize:70 , position:'relative'}} />
                      <View style={{ alignSelf: 'center',alignItems:'center',justifyContent:'center',height:44,width:44,borderRadius:22,backgroundColor:'white',marginTop:-57.5}}>
                            <Icon name="circle" type="FontAwesome" style={{color:'#f94c4c', fontSize:18 }} />
                      </View>
                     </View>

                   </TouchableOpacity>
                   :
                    <TouchableOpacity
                              onPress={this.takePicture}
                              onLongPress={()=>this.activateVideo()}
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
                               <Icon name="circle-thin" type="FontAwesome" style={{color:'white', fontSize:70}} />
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

        {this.state.picked && <PickedImage   isOpen={this.state.picked} onClosed={(data)=>{this.closepicked(data)}} dataToreturn={this.state.dataToreturn} data={this.state.data} nomessage={this.props.nomessage} />}

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


  /*
  componentWillMount = () => {
    //StatusBar.setHidden(true);
    //StatusBar.setBackgroundColor('#000000', true);
  };

  componentWillUnmount(){
    //StatusBar.setHidden(false);
    //StatusBar.setBackgroundColor('#FFFFFF', true);
  }*/

        /*
          <Icon name="ios-camera" type="Ionicons" style={{color:'black', fontSize:45 }} />
        <TouchableOpacity
           onPress={this.openGalerie}
           style={{
             alignSelf: 'flex-start',
             alignItems:'center',
             backgroundColor: 'white',
             borderTopLeftRadius: 8,
             borderBottomLeftRadius: 8,
             height:50,
             width:100,
             marginVertical: 10,
           }}
        >
            <View
             style={{
             flex:1,
             alignItems:'center',
             justifyContent:'center',
             backgroundColor: 'white',
            }}>
              <Text style={{fontSize:18,fontWeight:'700'}}>Video</Text>
            </View>


        </TouchableOpacity>*/


        /* <TouchableOpacity
           onPress={this.openPhoto}
           style={{
             alignSelf: 'flex-start',
             alignItems:'center',
             backgroundColor: 'white',
             height:50,
             width:100,
             borderTopRightRadius: 8,
             borderBottomRightRadius: 8,
             marginVertical: 10,
           }}
         >
             <View
             style={{
             flex:1,
             alignItems:'center',
             backgroundColor: 'white',
             justifyContent:'center',
           }}>
                <Text style={{fontSize:18,fontWeight:'700'}} >Photo</Text>
             </View>

          </TouchableOpacity>*/
