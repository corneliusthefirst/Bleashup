import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity, DeviceEventEmitter } from 'react-native'
import { Button, Icon } from 'native-base'
import CacheImages from './CacheImages'

export default class PhotoModal extends Component {
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
            isOpen: this.props.isOpen
        })
        this.image = this.props.image ? this.props.image : this.image
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            image: nextProps.image ? nextProps.image : this.image,
            isOpen: nextProps.isOpen
        })
    }
    transparent = "rgba(52, 52, 52, 0.3)";

    render() {
        return this.state.image ? (
            <Modal
                isOpen={this.state.isOpen}
                onClosed={() => {
                    this.setState({ isOpen: false })
                    DeviceEventEmitter.emit('PhotoModalClosed', true);
                }
                }
                style={{ justifyContent: 'center', alignItems: 'center', height: 420, borderRadius: 15, backgroundColor: this.transparent, width: 330 }}
                position={'center'}
            >
                <View>
                    <Button style={{}} onPress={() => {
                        this.setState({ isOpen: false })
                        DeviceEventEmitter.emit('PhotoModalClosed', true);
                    }
                    } transparent>
                        <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="cross" type="Entypo" />
                    </Button>
                </View>
                <TouchableOpacity onPress={() => {
                    this.setState({ isOpen: false })
                    DeviceEventEmitter.emit('PhotoModalClosed', true);
                }
                } >
                    <CacheImages thumbnails source={{ uri: this.state.image }} style={{ width: 310, height: 330, marginTop: 14 }} square />
                </TouchableOpacity>


            </Modal>
        ) : null
    }

}