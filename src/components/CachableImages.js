import React, { component } from "react";

import imageCacheHoc from "react-native-image-cache-hoc";
import ImageActivityIndicator from "./myscreens/currentevents/imageActivityIndicator";
import { Image, activityIndicatorStyle } from "react-native";
class CacheableImages extends component {
  constructor(ImageType) {
    this.CacheableImage = imageCacheHoc(ImageType, {
      defaultPlaceholder: {
        component: ImageActivityIndicator,
        props: {
          style: activityIndicatorStyle
        }
      }
    });
  }
}

const CacheImage = new CacheableImages(Image);
export default CacheImage;
