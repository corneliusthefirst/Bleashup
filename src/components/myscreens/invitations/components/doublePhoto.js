import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity } from 'react-native'
import { Button, Icon, Item, Thumbnail } from 'native-base';
import CacheImages from '../../../CacheImages';
import testForURL from '../../../../services/testForURL';

export default class DoublePhoto extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Item style={{ borderRadius: 0, borderColor: "transparent" }}>
                {testForURL(this.props.LeftImage) ? <CacheImages style={{ borderColor: "#1FABAB", borderWidth: 1, }}
                    thumbnails large source={{ uri: this.props.LeftImage }} /> : <Thumbnail large source={{uri:this.props.LeftImage}}></Thumbnail>}
                <TouchableOpacity onPress={() => this.props.showPhoto(this.props.RightImage)} >
                    {testForURL(this.props.RightImage) ? <CacheImages thumbnails large source={{ uri: this.props.RightImage }} style={{ marginLeft: -30 }} />
                        : <Thumbnail large source={{uri:this.props.RightImage}}></Thumbnail>}
                </TouchableOpacity>
            </Item>

        )
    }

}