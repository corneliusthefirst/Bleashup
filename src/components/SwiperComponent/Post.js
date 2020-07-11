/* eslint-disable react/no-unused-prop-types */
import React, { useState} from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import PropTypes from 'prop-types';
import VideoView from '../myscreens/Viewer/components/videoView';

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
        <Image
          source={{ uri: props.post.url }}
          //onLoadEnd={props.onImageLoaded()}
          style={styles.content}
          resizeMode="stretch"
          // width={ScreenWidth}
        />
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
  content: { width: '100%', height: '100%', flex: 1 },
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
