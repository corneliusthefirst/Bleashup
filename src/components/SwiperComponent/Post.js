/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import PropTypes from 'prop-types';

//const ScreenWidth = Dimensions.get('window').width;

const Post = (props) => {
  const { post } = props;
  const { url, type } = post || {};

  return (
    <View style={styles.container}>
      {type === 'image' ? (
        <Image
          source={{ uri: url }}
          //onLoadEnd={props.onImageLoaded()}
          style={styles.content}
          resizeMode="stretch"
          // width={ScreenWidth}
        />
      ) : (
        <Video
          source={{ uri: url }}
          //paused={props.pause || props.isNewPost}
          //onLoad={(item) => props.onVideoLoaded(item)}
          style={styles.content}
        />
      )}
    </View>
  );
};

Post.propTypes = {
  post: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { width: '100%', height: '100%', flex: 1 },
  imageContent: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
});

export default Post;
