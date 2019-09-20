import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity } from 'react-native'
import { Button, Icon,Item} from 'native-base'
import CacheImages from '../../../CacheImages';
import PhotoEnlargeModal from './PhotoEnlargeModal';

export default class DoublePhoto extends Component {
    constructor(props) {
        super(props)
    }
 
    render() {
        return (
          <Item style={{borderRadius:0,borderColor:"transparent"}}>
<<<<<<< HEAD
                <CacheImages style={{ borderColor: "#1FABAB",borderWidth: 1,}} thumbnails large source={{ uri: this.props.LeftImage }} />
              <TouchableOpacity onPress={this.props.enlargeImage} >
                    <CacheImages  thumbnails large source={{ uri: this.props.RightImage}} style={{ marginLeft: -30 }} />
=======
              <CacheImages thumbnails large source={{ uri: this.props.LeftImage }} style={{borderWidth:1,borderColor:"#1FABAB"}} />
              <TouchableOpacity onPress={this.props.enlargeImage} >
                <CacheImages thumbnails large source={{ uri: this.props.RightImage}} style={{ marginLeft: -30,borderWidth:1,borderColor:"#1FABAB" }} />
>>>>>>> 1e97a9d441b05a372cba36a25998ff64d917be81
              </TouchableOpacity>
          </Item>

          )
    }

}