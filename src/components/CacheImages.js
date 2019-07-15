import React, { Component } from "react";

import imageCacheHoc from "react-native-image-cache-hoc";
import ImageActivityIndicator from "./myscreens/currentevents/imageActivityIndicator";
import { Image, activityIndicatorStyle } from "react-native";
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
        defaultPlaceholder: {
          component: ImageActivityIndicator,
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
        <this.state.CacheableImages {...this.props} /> : <ImageActivityIndicator />
    )
  }
}

export default CacheImages;
