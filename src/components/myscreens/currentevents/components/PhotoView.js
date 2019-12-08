import React, { Component } from "react"
import CacheImages from "../../../CacheImages";
import ImageActivityIndicator from "./imageActivityIndicator";
import { View, TouchableOpacity } from "react-native"
import Image from 'react-native-scalable-image';

export default class PhotoView extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        ismounted: true,
        isModalOpened: false
    }
    componentDidMount() {
        this.setState({
            ismounted: true,
            isModalOpened: false
        }) 
    }
    render() {
        return (<View style={this.props.style}>
            <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                this.props.video?this.props.playVideo():this.props.showPhoto(this.props.photo)
            })}>
                <Image source={!this.props.photo ? require('../../../../../assets/default_event_image.jpeg'):{
                    uri: this.props.photo
                }
                }
                    //parmenent={false}
                    style={{
                        height: this.props.height ? this.props.height : 180,
                        width: this.props.width ? this.props.width : "100%",
                        borderRadius: this.props.borderRadius ? this.props.borderRadius : 0
                    }}
                    //resizeMode="contain"
                    width={this.props.width}
                ></Image>
            </TouchableOpacity>
            {/*<PhotoModal joined={this.props.joined} hasJoin={this.props.hasJoin} isToBeJoin isOpen={this.state.isModalOpened} image={this.props.photo}
                onClosed={() => {
                    this.setState({ isModalOpened: false });
                    this.props.onOpen()
                }}></PhotoModal>*/}
        </View>)
    }
}
