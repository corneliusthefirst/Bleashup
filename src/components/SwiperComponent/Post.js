/* eslint-disable react/no-unused-prop-types */
import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import PropTypes from 'prop-types';
import VideoView from '../myscreens/Viewer/components/videoView';

//const ScreenWidth = Dimensions.get('window').width;
class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showVideo: false,
    };
  }

  render() {
    //this.props.post.type !== 'image' ? this.setState({showVideo:true}) : this.setState({showVideo:false}) ;

    return (
      <View style={styles.container}>
        {this.props.post.type === 'image' ? (
          <Image
            source={{ uri: this.props.post.url }}
            //onLoadEnd={props.onImageLoaded()}
            style={styles.content}
            resizeMode="stretch"
            // width={ScreenWidth}
          />
        ) : (
          <VideoView
            open={true}
            onLoad={(item) => {
              //this.props.onVideoLoaded(item);
            }}
            //onClose={() => this.setState({showVideo:false})}
            video={this.props.post.url}
            //nextVideo ={e => this.props.changePost(e.nativeEvent)}
          />
        )}
      </View>
    );
  }
}

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
