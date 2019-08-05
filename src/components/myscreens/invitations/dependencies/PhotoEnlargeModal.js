import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity } from 'react-native'
import { Button, Icon } from 'native-base'
import CacheImages from '../../../CacheImages';


export default class PhotoEnlargeModal extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        image: null
    }
    image = null
    componentDidMount() {
        this.setState({
            image: this.props.image ? this.props.image : this.image,
            //isOpen: this.props.isOpen
        })
        this.image = this.props.image ? this.props.image : this.image
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            image: nextProps.image ? nextProps.image : this.image,
            //isOpen: nextProps.isOpen
        })
    }
    transparent = "rgba(52, 52, 52, 0.3)";

    render() {
        return this.state.image ? (
            <Modal
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed }
                style={{
                    justifyContent: 'center',
                    alignItems: 'center', height: "99%", borderRadius: 15,
                    backgroundColor: this.transparent, width: "99%"
                }}
                position={'center'}
            >
            <View style={{backgroundColor:"black",alignItems:'center',height:"100%"}}>
                    <TouchableOpacity style={{}} onPress={this.props.onClosed} transparent>
                        <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="cross" type="Entypo" />
                    </TouchableOpacity>
        
                <TouchableOpacity onPress={this.props.onClosed} style={{marginTop:60}} >
                    <CacheImages thumbnails source={{ uri: this.state.image }} style={{ width:395, height: 520, marginTop: 14 }} square />
                </TouchableOpacity>
            </View>

            </Modal>
        ) : null
    }

}