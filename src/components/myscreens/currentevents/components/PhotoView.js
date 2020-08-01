import React, { Component } from "react"
import CacheImages from "../../../CacheImages";
import ImageActivityIndicator from "./imageActivityIndicator";
import { View, TouchableOpacity,Image} from "react-native"
import shadower from "../../../shadower";
import stores from '../../../../stores';
import emitter from '../../../../services/eventEmiter';
import GState from '../../../../stores/globalState';
import buttoner from "../../../../services/buttoner";
import ColorList from '../../../colorList';
import BeNavigator from '../../../../services/navigationServices';
import  Ionicons  from 'react-native-vector-icons/Ionicons';

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
    initializeIterator() {
        this.outerMostinterval = setInterval(() => {
            if(GState.initialized){
                clearInterval(this.outerMostinterval)
                stores.Highlights.fetchHighlightsFromRemote(this.props.event_id).then(highlights => {
                    this.highlights = highlights
                    if (this.highlights && this.highlights.length > 0) {
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
                                this.counter = 0
                            }
                        }, 2000 + this.props.renderDelay)
                    }
                })
            }
        },500)
    }
    componentDidMount() {
        this.setState({
            ismounted: true,
            isModalOpened: false
        })
        this.initializeIterator()
    }
    componentDidUpdate(previousProps, previousState) {
        if (this.props.photo !== previousProps.photo) {
            if (this.highlights && this.highlights.length <= 0) {
                this.setState({
                    image: this.props.photo
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
            BeNavigator.navigateTo("HighLightsDetails", { event_id: this.props.event_id })
    }
    eventPhoto = require('../../../../../assets/default_event_image.jpeg')
    render() {
        return (<View>

                
                <TouchableOpacity style={{ ...shadower() }} onPress={() => requestAnimationFrame(() => {
                    this.props.video ? this.playVideo(this.state.video) : this.showPhoto(this.state.image)
                })}>
                  <View style={{ ...this.props.style,alignItems:"center",justifyContent:"center", height: this.props.height ? this.props.height : 150 }}>
                    <View style={{flex:1}}>
                    {!this.state.image ? <Image resizeMode={"cover"} style={{
                        //...shadower(),
                        height: this.props.height ? this.props.height : 150,
                        width: this.props.width ? this.props.width : "100%",alignSelf: 'center',
                        borderRadius: this.props.borderRadius ? this.props.borderRadius : 0
                    }} square source={this.eventPhoto}></Image> :
                        <CacheImages thumbnails square source={{ uri: this.state.image }}
                            //parmenent={false}
                            style={{
                                //...shadower(),
                                height: this.props.height ? this.props.height : 150,
                                width: this.props.width ? this.props.width : "100%",alignSelf: 'center',
                                borderRadius: this.props.borderRadius ? this.props.borderRadius : 0
                            }}
                            //resizeMode="cover"
                            width={this.props.width}
                        ></CacheImages>
                    }
                      </View>
                   
                  
                    {this.state.video || this.state.audio ?
                            <View
                                style={{
                                  ...buttoner,
                                  position:"absolute",
                                }}
                              >
                                  {this.state.video ?
                                      <Ionicons onPress={() => {
                                        this.showPhoto(this.state.image)
                                      }} name="ios-play" style={{marginLeft:12,
                                          fontSize: 42, color: ColorList.bodyBackground
                                      }} type="Ionicons" />
                                       :
                                        <Ionicons onPress={() => {
                                         this.showPhoto(this.state.image)
                                      }} name= "headset" style={{marginRight:5,
                                          fontSize: 36, color: ColorList.bodyBackground
                                      }} type="MaterialIcons" />
                                    }
                  
                              </View> : null}

                          </View>
                </TouchableOpacity>

        </View>)
    }
}
