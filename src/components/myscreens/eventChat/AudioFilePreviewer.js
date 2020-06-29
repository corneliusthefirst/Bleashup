import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Icon, Text, Toast } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Sound from 'react-native-sound';
import shadower from '../../shadower';
import FileExachange from '../../../services/FileExchange';
import ColorList from '../../colorList';

export default class AudioFilePreviewer extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            playing: false
        }
    }
    componentWillMount() {
        this.initalizePlayer()
    }
    componentDidUpdate(previousProps,prevState){
        if(previousProps.source !== this.props.source){
            this.player && this.player.stop && this.player.stop()
            this.setState({
                playing:false
            })
            this.initalizePlayer()
        }
    }
    componentWillUnmount() {
        this.player && this.player.stop()
       this.ext.clearCache(this.props.source)
    }
    mbSize = this.props.size / (1000 * 1000);
    playAudio() {
        this.player && this.setState({
            playing: true
        })
        this.player && this.player.play && this.player.play((state) => {
            console.warn("finishing playing audio player")
            this.setState({
                playing: false
            })
        })
    }
    pauseAudio() {
        this.player && this.player.pause  && this.player.pause()
        this.setState({
            playing: false
        })
    }
    initalizePlayer() {
         this.ext = new FileExachange()
        this.ext.cachFile(this.props.source).then(tempDir => {
            this.player = new Sound(tempDir, '/', err => {
                
            })
        })
    }
    center = {
        marginBottom: 'auto',
        marginTop: 'auto',
    }
    render() {
        return <View style={{
            padding: '1%',
            width: '100%',
            height: 70,
            ...shadower(.5),
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            flexDirection: 'row',
            backgroundColor: ColorList.buttonerBackground,
            alignSelf: 'center',
            justifyContent: 'space-between',
        }}>
            <View
                style={{
                    width: '10%',
                    ...this.center,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: '3%',
                }}>
                <Icon type="Entypo" name="sound" style={{
                    color: ColorList.bodyBackground,
                    fontSize: 30,
                }}></Icon>

            </View>
            <View
                style={{
                    marginBottom: "auto",
                    width: "60%",
                    marginTop: "auto",
                }}
            >
                <Text style={{ color: ColorList.bodyBackground }}>
                    {this.props.filename +
                        (isNaN(this.mbSize)
                            ? ""
                        : " (" + this.mbSize.toFixed(2).toString() + "Mb)")}
                </Text>
            </View>
            <TouchableOpacity
                onPress={() => requestAnimationFrame(() => {
                    !this.state.playing ? this.playAudio() : this.pauseAudio()
                })} style={{
                    alignItems: 'flex-end',
                    ...this.center
                }}>
                <Icon style={{
                    color: ColorList.bodyBackground,
                    fontSize: 30
                }} name={this.state.playing ? "pause" : "play"} type="AntDesign">
                </Icon>
            </TouchableOpacity>
        </View>
    }
}
