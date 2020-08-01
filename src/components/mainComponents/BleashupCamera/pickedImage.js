/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
const { height , width } = Dimensions.get('window');

import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback ,
  Dimensions,
} from 'react-native';
import ColorList from '../../colorList';
import BleashupModal from '../BleashupModal';
import VideoView from '../../myscreens/Viewer/components/videoView';
import CreateTextInput from '../../myscreens/event/createEvent/components/CreateTextInput';
import AntDesign  from 'react-native-vector-icons/AntDesign';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import { Feather } from 'react-native-vector-icons/Feather';

const screenHeight  =  Dimensions.get('window').height;
const screenWidth  =  Dimensions.get('window').width;
export default class PickedImage extends BleashupModal {
  initialize(){
    this.state = {
      message: '',
      paused: false,
    };
  }

  borderRadius = 0;
  modalHeight = '100%';
  modalWidth = '100%';
  borderTopLeftRadius = 0
  borderTopRightRadius = 0
  height='100%'


  onClosedModal = () => {
    this.setStatePure({message:''});
    let data = {photo:'',video:'',message:''};
    this.props.onClosed(data);
 }

 onChangedMessage = (value) => {
     this.setStatePure({message:value});
 }

 validate = () => {
   if (this.props.nomessage){
    //console.warn("before return s",this.props.dataToreturn);
    this.props.onClosed(this.props.dataToreturn);
   }
   else {
    this.props.onClosed({...this.props.dataToreturn,message:this.state.message});
    this.setStatePure({message:''});
   }
 }

  modalBody = () => {
    return (
      <View style={[styles.container, { position: 'relative' }]}>

        {this.props.data.photo !== '' ?
         <Image  source={{uri:this.props.data.photo}}  style={{height: screenHeight - 120, width: screenWidth,marginTop: 60 }} resizeMode={"cover"} />
         :
         <View style={{marginTop: 60, height:screenHeight - 120,backgroundColor:'black',width:'100%'}}>
         <VideoView
          open={true}
          onLoad={(item) => {
            this.setState({paused:true});
            //console.warn("item loaded", item);
            //this.props.onVideoLoaded(item);
          }}
          onEnd={() => {
            this.setState({paused:true});
          }}
          paused={this.state.paused}
          video={this.props.data.video}
         />
         </View>
        }
        <View style={{position:'absolute',height:60,width:'100%',top:0,alignItems:'flex-end',
              justifyContent:'center',backgroundColor:this.props.data.photo !== '' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.9)'}}>
              <AntDesign
                    name="close"
                    style={{color:'white', fontSize:25 , marginRight:15}}
                    type="AntDesign"
                    onPress={this.onClosedModal}
               />
       </View>

       <View style={{position:'absolute',width:'100%',bottom:0,paddingBottom:15,paddingTop:15,flexDirection:'row',justifyContent:'flex-end',backgroundColor:this.props.data.photo != '' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.9)' }}>
       {this.props.nomessage === false ? <View style={{width:'80%',paddingLeft:10,alignSelf:'center'}}>
          <CreateTextInput
            height={60}
            value={this.state.message}
            onChange={this.onChangedMessage}
            placeholder={this.props.messagePlaceHolder}
            backgroundColor={ColorList.transparent}
            color={ColorList.bodyBackground}
            placeholderTextColor={'#F5FFFA'}
            multiline={this.props.multiline}
            autogrow= {this.props.multiline ? true : false}
            maxLength={this.props.maxLength}
            />
       </View> : null}

       <View style={{width:'20%',alignItems:'center',justifyContent:'center'}}>
        <TouchableWithoutFeedback onPress={this.validate}>
            <View style={{height:44,width:44,borderRadius:22,backgroundColor:ColorList.indicatorColor,alignItems:'center',justifyContent:'center'}}>
                {this.props.nomessage?<Ionicons
                    name={'ios-arrow-round-forward'}
                    style={{color:'white', fontSize:25 }}
                    type={ "Ionicons"}
                    onPress={this.validate}
                /> : <Feather style={{ color: 'white', fontSize: 25 }} name={'send'}/>}
           </View>
        </TouchableWithoutFeedback>

         </View>

       </View>

      </View>
    );
  };
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    backgroundColor:'black',
  },
});
