import React, { Component } from "react";

import imageCacheHoc from "react-native-image-cache-hoc";
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import { activityIndicatorStyle } from "react-native";
import Image from 'react-native-scalable-image';
import {View} from 'react-native'

import { Thumbnail } from "native-base"

class CacheImages extends Component {
  constructor(props) {
    super(props)
  }
  state = {
    CacheableImages: undefined
  } 
  componentDidMount() {
    this.setState({
      CacheableImages: imageCacheHoc(this.props.thumbnails ? Thumbnail : Image, {
        validProtocols: ['http', 'https'],
        defaultPlaceholder: {
          component: () => <View style={{alignSelf: 'center',width:'100%',borderRadius: 5,}}><ImageActivityIndicator rect={this.props.thumbnails && this.props.square}></ImageActivityIndicator></View>,
          props: {
            style: activityIndicatorStyle
          }
        }
      })
    });
  }
  render() {
    return (
      this.state.CacheableImages ?
        <this.state.CacheableImages {...this.props} /> : <ImageActivityIndicator rect={this.props.thumbnails && this.props.square} />
    )
  }
}

export default CacheImages;
