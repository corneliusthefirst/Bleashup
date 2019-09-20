import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity,Image } from 'react-native'
import { Button, Icon } from 'native-base'
import CacheImages from '../../../CacheImages';


export default class PhotoEnlargeModal extends Component {
    constructor(props) {
        super(props)
    }
    
   
    transparent = "rgba(52, 52, 52, 0.3)";

    render() {
        return this.props.image|| this.props.photo ? (
            <Modal
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center', height: "99%", borderRadius: 15,
                    backgroundColor: this.transparent, width: "99%"
                }}
                position={'center'}
            >
                <View style={{ flex: 1, alignSelf: 'stretch' }}>
                    <View style={{ flex: 1, flexDirection: 'column', backgroundColor: "black", justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={this.props.onClosed} transparent>
                            <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="cross" type="Entypo" />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 6, flexDirection: 'column' }}>
                        <TouchableOpacity onPress={this.props.onClosed} >
                            <CacheImages thumbnails source={{ uri: this.props.image }} style={{ width: "100%", height: "100%" }} square />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, backgroundColor: "black", flexDirection: 'column' }}>
                    </View>
                </View>
            </Modal>
        ) : null
    }

}