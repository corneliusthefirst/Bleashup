import React, { Component } from "react";
import FastImage from 'react-native-fast-image'
import testForURL from '../services/testForURL';
import rounder from "../services/rounder";
import BeComponent from './BeComponent';

class CacheImages extends BeComponent {
  constructor(props) {
    super(props)
  }
  state = {
    CacheableImages: undefined,
    mounted:false
  }
  componentDidMount() {
  this.mountTimeout = setTimeout(() => {
    this.setStatePure({
      mounted:true
    })
  },2000)
  }
  styles = {
    "small": {
      ...this.props.square? {
        height: 40, width: 40, borderRadius: 5,
      } : rounder(40),
      justifyContent: 'center',
      alignItems: 'center',
    },
    "large": {
      ...this.props.square? {
        height: 60, width: 60, borderRadius: this.props.borderRadius||1,
      }:rounder(this.props.dim||60),
      justifyContent: 'center',
      alignItems: 'center',
    }
  }
  getPhotoSmall(source,size) {
    let nameArr = source && source.split(".")
    if(nameArr){
      nameArr[nameArr.length - 2] = nameArr[nameArr.length - 2] + `_${size}x${size}.jpeg`
      //console.error(nameArr.slice(0, nameArr.length - 1))
      return nameArr.slice(0, nameArr.length - 1).join(".")
    }else{
      return ""
    }
  }
  getRealURL(source){
    return source
  }
  render() {
    return <FastImage
      style={{ ...this.props.thumbnails? this.props.small ? this.styles.small : this.styles.large : {height:'100%',width:'100%'} ,...this.props.style ,}}
      resizeMode={this.props.thumbnails ? FastImage.resizeMode.cover : FastImage.resizeMode.contain}
      source={{...this.props.source,
        uri:(testForURL(this.props.source.uri) && !this.state.mounted) || 
        this.props.staySmall || 
          (this.props.thumbnails && !(this.props.style && this.props.style.width))
          || (this.props.source.uri && this.props.source.uri.includes("thumbnail")) ? 
          this.getPhotoSmall(this.props.source.uri, 20):
          this.props.thumbnails && testForURL(this.props.source.uri) ? 
              this.getPhotoSmall(this.props.source.uri,100) : 
          this.getRealURL(this.props.source.uri), 
        priority: FastImage.priority.high,
      }}
      fallback
      defaultSource={1}

    >
    </FastImage>
  }
}

export default CacheImages;
