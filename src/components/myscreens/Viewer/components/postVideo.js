/* eslint-disable react/no-unused-prop-types */
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    View,
    Platform,
  } from 'react-native';
import Video from 'react-native-video';
// import Image from 'react-native-scalable-image';
import PropTypes from 'prop-types';
import UserView from './UserView';

const ScreenWidth = Dimensions.get('window').width;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

  const MyStatusBar = ({backgroundColor, ...props}) => (
    
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor}  {...props} />
  </View>
 )

  const PostVideo = (props) => (
       <View style={styles.container} >
        <MyStatusBar backgroundColor="red" barStyle="light-content" />
       </View>
    )






const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});



export default PostVideo;