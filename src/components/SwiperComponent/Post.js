/* eslint-disable react/no-unused-prop-types */
import React, { useState} from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import PropTypes from 'prop-types';
import VideoView from '../myscreens/Viewer/components/videoView';
import  ReactNativeZoomableView  from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import CacheImages from '../CacheImages';

//const ScreenWidth = Dimensions.get('window').width;
const Post = (props) => {
  const [isPause, setPause] = useState(false);

  const onScrollStart = () => {
    if (isPause === false) {
      setPause(true);
    }
  };

  const onScrollEnd = () => {
    if (isPause === true) {
      setPause(false);
    }
  };
  return (
    <View style={styles.container}>
      {props.post.type === 'image' ? (
        <View style={{
          width:"100%",
          flex: 1,
          transform: [{ rotate: `${props.rotation}deg` }],
          height: "100%"
        }}>
        <ReactNativeZoomableView
          style={{
            height: "100%",
            width: "100%",
            
            }}
          maxZoom={2}
          minZoom={0.5}
          zoomStep={0.5}
          initialZoom={1}
          captureEvent={true}
        >
        <CacheImages
          source={{ uri: props.post.url }}
          //onLoadEnd={props.onImageLoaded()}
          style={[styles.content]}
          // width={ScreenWidth}
          /></ReactNativeZoomableView>
          </View>

      ) : (
        <VideoView
          //isPause={this.state.isPause}
          open={true}
          onLoad={(item) => {
            //this.props.onVideoLoaded(item);
          }}
          //onClose={() => this.setState({showVideo:false})}
          video={props.post.url}
          //nextVideo ={e => this.props.changePost(e.nativeEvent)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignSelf: "center",
    flex: 1,
    width: "100%"},
  imageContent: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
});

export default Post;


/*
  shouldComponentUpdate(nextProps){
    if (_.isEqual(this.state, nextProps.state)) {
      return false;
    }
    return true;
}*/
