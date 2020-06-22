/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
const { height , width } = Dimensions.get('window');

import React from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import {Icon} from 'native-base';
import ColorList from '../../colorList';
import BleashupModal from '../BleashupModal';

export default class PickedImage extends BleashupModal {
  constructor(props) {
    super(props);
    this.state = {
      message:'',
    };
  }

  borderRadius = 0;
  modalHeight = '100%';
  modalWidth = '100%';
  height='100%'


  onClosedModal() {
    this.props.onClosed();
 }

 componentDidMount(){
  //console.warn("here we are",this.props.data);
 }

  sendBackSelected = () => {
    if (typeof this.props.onCaptureFinish  === 'function') {
         this.props.onCaptureFinish({...this.props.data,message:this.state.message});
      }
  }


  modalBody = () => {
    return (
      <View style={[styles.container, { position: 'relative' }]}>

         <Image  source={{uri:this.props.data.photo}}  style={{height: height, width: width }} />

      </View>
    );
  };
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
