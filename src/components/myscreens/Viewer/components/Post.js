/* eslint-disable react/no-unused-prop-types */
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, View,Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import UserView from './UserView';
import VideoViewer from '../../highlights_details/VideoModal';

const ScreenWidth = Dimensions.get('window').width;

const Post = (props) => {
  const { post} = props;
  const { url } = post || {};

  return (
    <View style={styles.container}>
        <Image
          source={{ uri: url }}
          onLoadEnd={()=>props.onImageLoaded()}
          style={styles.content}
          resizeMode="stretch"
        />
    </View>
  );
};


Post.propTypes = {
  post: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { width: '100%',
    height: '100%',
    flex: 1,
  },
  imageContent: {
    width: '100%',
    height: '100%',
    flex: 1,
  },


});

export default Post;



    /*
    import Video from 'react-native-video';
   //import Image from 'react-native-scalable-image';
    
    {!props.isLoaded && (
      <View style={styles.loading}>
        <ActivityIndicator color="white" /> 
      </View>
      )} 
      loading: {
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },*/

/*
  <Video
  source={{ uri: url }}
  paused={props.pause || props.isNewPost}
  onLoad={item => props.onVideoLoaded(item)}
  style={styles.content}
/>
*/