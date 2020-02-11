import React, { Component } from "react"
import CacheImages from "../../../CacheImages";
import ImageActivityIndicator from "./imageActivityIndicator";
import { View, TouchableOpacity } from "react-native"
import Image from 'react-native-scalable-image';
import { Thumbnail, Icon } from 'native-base';
import shadower from "../../../shadower";
import stores from '../../../../stores';
import emitter from '../../../../services/eventEmiter';

export default class PhotoView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            image: this.props.photo
        }
    }
    state = {
        ismounted: true,
        isModalOpened: false
    }
    initializeIterator(){
        stores.Highlights.fetchHighlightsFromRemote(this.props.event_id).then(highlights => {
            this.highlights = highlights
            if (this.highlights.length > 0) {
                    this.interval = setInterval(() => {
                        let highlight = this.highlights[this.counter]
                        if (highlight && highlight.url) {
                            this.setState({
                                image: highlight.url.photo,
                                video: highlight.url.video ? true : false,
                                audio: highlight.url.audio ? true : false
                            })
                            this.counter = this.counter + 1
                        } else {
                            this.setState({
                                image: this.props.photo,
                                video: false,
                                audio: false
                            })
                            this.counter = 0
                        }
                    }, 3000 + this.props.renderDelay)
            }
        })
    }
    componentDidMount() {
        this.setState({
            ismounted: true,
            isModalOpened: false
        })
        this.initializeIterator()
    }
    componentDidUpdate(previousProps,previousState){
        if(this.props.photo !== previousProps.photo){
            if(this.highlights.length <= 0 ){
                this.setState({
                    image:this.props.photo
                })
            }
        }
    }
    componentWillMount() {
        emitter.on(`refresh-highlights_${this.props.event_id}`, () => {
            console.warn('receiving refresh highlights message')
            stores.Highlights.fetchHighlights(this.props.event_id).then(Higs => {
                this.highlights = Higs
            })
        })
    }
    componentWillUnmount() {
        emitter.off(`refresh-highlights_${this.props.event_id}`)
        clearInterval(this.interval)
    }
    showPhoto(url) {
        url === this.props.photo && !this.state.audio ? this.props.showPhoto(url) :
            this.props.navigation.navigate("HighLightsDetails", { event_id: this.props.event_id })
    }
    render() {
        return (<View style={{ ...this.props.style }}>
            <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                this.props.video ? this.playVideo(this.state.video) : this.showPhoto(this.state.image)
            })}>
                {!this.state.image ? <Thumbnail style={{
                    height: this.props.height ? this.props.height : 150,
                    width: this.props.width ? this.props.width : "100%",
                    borderRadius: this.props.borderRadius ? this.props.borderRadius : 0
                }} square source={require('../../../../../assets/default_event_image.jpeg')}></Thumbnail> :
                    <CacheImages thumbnails square source={{ uri: this.state.image }}
                        //parmenent={false}
                        style={{
                            height: this.props.height ? this.props.height : 150,
                            width: this.props.width ? this.props.width : "100%",
                            borderRadius: this.props.borderRadius ? this.props.borderRadius : 0
                        }}
                        //resizeMode="contain"
                        width={this.props.width}
                    ></CacheImages>
                }
                {this.state.video || this.state.audio ? <Icon onPress={() => {
                    this.showPhoto(this.state.image)
                }} name={this.state.video ? "play" : "headset"} style={{
                    fontSize: 50, color: '#FEFFDE',
                    position: 'absolute', marginTop: '18%', marginLeft: '50%',
                }} type={this.state.video ? "EvilIcons" : "MaterialIcons"}>
                </Icon> : null}
            </TouchableOpacity>
            {/*<PhotoModal joined={this.props.joined} hasJoin={this.props.hasJoin} isToBeJoin isOpen={this.state.isModalOpened} image={this.props.photo}
                onClosed={() => {
                    this.setState({ isModalOpened: false });
                    this.props.onOpen()
                }}></PhotoModal>*/}
        </View>)
    }
}
