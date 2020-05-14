import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import ProgressBar from './ProgressBar';

const ProgressArray = (props) => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (props.pause) {
      Animated.timing(opacity, {
        toValue: 0,
        timing: 300,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 1,
        timing: 300,
      }).start();
    }
  }, [props.pause]);

  //console.warn(props.post_index,props.post_index_index,props.currentIndex)
  return (
    <Animated.View style={[styles.progressBarArray, { opacity }]}>
        <ProgressBar
          index={props.post_index}
          duration={props.duration || 3}
          isNewPost={props.isNewPost}
          currentIndex={props.currentIndex}
          next={props.next}
          length={props.posts.length}
          active={props.post_index_index  === props.currentIndex ? 1 : (props.post_index_index  < props.currentIndex ? 2 : 0)}
          isLoaded={props.isLoaded}
          pause={props.pause}
        />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  progressBarArray: {
    flexDirection: 'row',
    position: 'absolute',
    top: 30,
    width: '98%',
    height: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default ProgressArray;


/**   {props.length.map((i, index) => (
        <ProgressBar
          index={index}
          duration={props.duration || 3}
          isNewPost={props.isNewPost}
          currentIndex={props.currentIndex}
          next={props.next}
          length={props.posts.length}
          active={i === props.currentIndex ? 1 : (i < props.currentIndex ? 2 : 0)}
          isLoaded={props.isLoaded}
          pause={props.pause}
        /> */