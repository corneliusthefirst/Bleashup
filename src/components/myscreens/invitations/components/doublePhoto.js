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
              <CacheImages thumbnails large source={{ uri: this.props.LeftImage }} />
              <TouchableOpacity onPress={this.props.enlargeImage} >
                <CacheImages thumbnails large source={{ uri: this.props.RightImage}} style={{ marginLeft: -30 }} />
              </TouchableOpacity>
          </Item>

          )
    }

}