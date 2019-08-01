import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity } from 'react-native'
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
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.isOpen !== this.state.isOpen) return true
        else return false
    }
    componentDidUpdate(PreviousProps) {
        if (this.props.isOpen !== this.state.isOpen) {
            this.setState({
                isOpen: this.props.isOpen
            })
        }
    }
    transparent = "rgba(52, 52, 52, 0.3)";

    render() {
        return this.state.image ? (
            <Modal
                coverScreen={true}
                isOpen={this.state.isOpen}
                backButtonClose={true}
                onClosed={() =>
                    this.props.onClosed()
                }
                style={{
                    justifyContent: 'center',
                    alignItems: 'center', height: 420, borderRadius: 15,
                    backgroundColor: this.transparent, width: 350
                }}
                position={'center'}
            >
                <View>
                    <TouchableOpacity style={{}} onPress={() => requestAnimationFrame(() => {
                        this.props.onClosed()
                    })} transparent>
                        <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="close" type="EvilIcons" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() =>
                    requestAnimationFrame(() => {
                        this.props.onClosed()
                    })
                } >
                    <CacheImages source={{ uri: this.state.image }} style={{ width: 350, height: 260, marginTop: 14 }} square />
                </TouchableOpacity>
            </Modal>
        ) : null
    }

}