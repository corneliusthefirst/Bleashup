import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import PostView from './postView'

const SCREEN_WIDTH = Dimensions.get('window').width;

const PostContainer = (props) => {
  const { activity,onClose,isNewPost } = props;
  const { posts = [] } = activity || {};
  const {about_activity} = activity;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setModal] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(3);
  const post = posts.length ? posts[currentIndex] : {};
  const { isReadMore, url } = post || {};


  // const onVideoLoaded = (length) => {
  //   props.onVideoLoaded(length.duration);
  // };

  const changePost = (evt) => {
    if (evt.locationX > SCREEN_WIDTH / 2) {
      nextPost();
    } else {
      prevPost();
    }
  };

  const nextPost = () => {
    if (posts.length - 1 > currentIndex) {
      setCurrentIndex(currentIndex + 1);
      setLoaded(false);
      setDuration(3);
    } else {
      setCurrentIndex(0);
      props.onPostNext();
    }
  };

  const prevPost = () => {
    if (currentIndex > 0 && posts.length) {
      setCurrentIndex(currentIndex - 1);
      setLoaded(false);
      setDuration(3);
    } else {
      setCurrentIndex(0);
      props.onPostPrevious();
    }
  };

  const onImageLoaded = () => {
    setLoaded(true);
  };

  const onVideoLoaded = (length) => {
    setLoaded(true);
    setDuration(length.duration);
  };

  const onPause = (result) => {
    setIsPause(result);
  };

  const onReadMoreOpen = () => {
    setIsPause(true);
    setModal(true);
  };
  const onReadMoreClose = () => {
    setIsPause(false);
    setModal(false);
  };

  const loading = () => {
    if (!isLoaded) {
      return (
        <View style={styles.loading}>
          {/*<View style={{ width: 1, height: 1 }}>
            <Post onImageLoaded={onImageLoaded} pause onVideoLoaded={onVideoLoaded} post={post} />
          </View>*/}
          <ActivityIndicator color="white" />
        </View>
      );
    }
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const onSwipeDown = () => {
    if (!isModalOpen) {
      props.onClose();
    } else {
      setModal(false);
    }
  };

  const onSwipeUp = () => {
    if (!isModalOpen && isReadMore) {
      setModal(true);
    }
  };

  return (
    <GestureRecognizer
      onSwipeDown={onSwipeDown}
      onSwipeUp={onSwipeUp}
      config={config}
      style={styles.container}
    >
      <PostView 
       about_activity={about_activity}
       changePost = {changePost}
       nextPost={nextPost}
       prevPost={prevPost}
       onPause={onPause}
       onImageLoaded = {onImageLoaded}
       onVideoLoaded={onVideoLoaded}
       onReadMoreOpen = {onReadMoreOpen}
       onReadMoreClose = {onReadMoreClose}
       isPause={isPause}
       isReadMore={isReadMore}
       isModalOpen={isModalOpen}
       isNewPost={isNewPost}
       isLoaded={isLoaded}
       post={post}
       posts={posts}
       loading = {loading}
       duration = {duration}
       currentIndex={currentIndex}
       //activity={activity}
       onClose = {onClose}
       />

    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    height:"100%",
    width: "100%",
    //justifyContent: 'flex-start',
    alignItems: 'center',
    // paddingTop: 30,
    //backgroundColor: '#1a1212',
  },

  loading: {
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default PostContainer;
