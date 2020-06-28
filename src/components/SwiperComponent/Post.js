/* eslint-disable react/no-unused-prop-types */
import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import PropTypes from 'prop-types';
import VideoView from '../myscreens/Viewer/components/videoView';
import _ from 'lodash';

//const ScreenWidth = Dimensions.get('window').width;
export default class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPause: true,
    };
  }

  shouldComponentUpdate(nextProps) {
    if (_.isEqual(this.state, nextProps.state)) {
      return false;
    }
    return true;
  }

  onScrollStart = () => {
    if (this.state.isPause === false) {
     // console.warn("here1", this.state.isPause);
      this.setState({ isPause: true });
     // console.warn("here after 1", this.state.isPause);
    }
  };

  onScrollEnd = () => {
    if (this.state.isPause === true) {
      //console.warn("here", this.state.isPause);
      this.setState({ isPause: false });
      //console.warn("here after", this.state.isPause);
    }
  };

  render() {
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
            //isPause={this.state.isPause}
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
