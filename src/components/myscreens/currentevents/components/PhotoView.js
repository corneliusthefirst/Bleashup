import React, { Component } from "react"
import CacheImages from "../../../CacheImages";
import ImageActivityIndicator from "./imageActivityIndicator";
import { View, TouchableOpacity } from "react-native"
import PhotoModal from "../../invitations/components/PhotoModal";

export default class PhotoView extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        ismounted: false,
        isModalOpened: false
    }
    componentDidMount() {
        this.setState({
            ismounted: true,
            isModalOpened: false
        })
    }

    render() {
        return !this.state.ismounted ? <ImageActivityIndicator width={this.props.width} height={this.props.height}>
        </ImageActivityIndicator> : (<View style={this.props.style}>
            <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                this.setState({ isModalOpened: true })
            })}>
                <CacheImages source={{
                    uri: this.props.photo
                }
                }
                    parmenent={false}
                    style={{
                        height: this.props.height ? this.props.height : 180,
                        width: this.props.width ? this.props.width : "100%",
                        borderRadius: this.props.borderRadius ? this.props.borderRadius : 0
                    }}
                    resizeMode="contain"
                ></CacheImages>
            </TouchableOpacity>
            <PhotoModal joined={this.props.joined} hasJoin={this.props.hasJoin} isToBeJoin isOpen={this.state.isModalOpened} image={this.props.photo}
                onClosed={() => {
                    this.setState({ isModalOpened: false });
                    this.props.onOpen()
                }}></PhotoModal>
        </View>)
    }
}
