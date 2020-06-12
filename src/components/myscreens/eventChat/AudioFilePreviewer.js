import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Icon, Text, Toast } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Sound from 'react-native-sound';
import shadower from '../../shadower';
import rnFetchBlob from 'rn-fetch-blob';
import FileExachange from '../../../services/FileExchange';
import ColorList from '../../colorList';

export default class AudioFilePreviewer extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            playing:false
        }
    }
    componentWillMount() {
        this.initalizePlayer()
    }
    componentWillUnmount() {
        this.player && this.player.stop()
        rnFetchBlob.fs.unlink(this.tempDir).then(() => {

        })
    }
    playAudio() {
        this.player && this.setState({
            playing: true
        })
        this.player && this.player.play((state) => {
            console.warn("finishing playing audio player")
             this.setState({
                 playing:fasle
             })
        })
    }
    pauseAudio() {
        this.player && this.player.pause()
        this.setState({
            playing: false
        })
    }
    initalizePlayer() {
        let ext = new FileExachange()
        this.appdir = ext.appDir + '/cache/'
        this.tempDir = this.appdir + this.props.source.split('/').pop()
        rnFetchBlob.fs.exists(this.props.source).then((state) => {
            console.warn("existence state ", state)
            if (state) {
                rnFetchBlob.fs.exists(this.appdir).then(() => {
                    if (!state) {
                        rnFetchBlob.fs.mkdir(this.appdir).then(() => {
                            rnFetchBlob.fs.cp(this.props.source, this.tempDir).then(() => {
                                this.player = new Sound(this.tempDir, '/', err => {
                                    console.warn(err)
                                })
                            })
                        })
                    } else {
                        rnFetchBlob.fs.cp(this.props.source, this.tempDir).then(() => {
                            this.player = new Sound(this.tempDir, '/', err => {
                                console.warn(err)
                            })
                        })
                    }
                })
            } else {
                Toast.show({ text: "Audio Picking failed", duration: 4000 })
            }
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
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            flexDirection: 'row',
            backgroundColor: ColorList.buttonerBackground,
            alignSelf: 'center',
            justifyContent: 'space-between',
        }}>
            <View
                style={{
                    width: '70%',
                    ...this.center,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: '3%',
                }}>
                <Icon type="Entypo" name="sound" style={{ 
                    color:ColorList.bodyBackground,
                    fontSize: 30,
                 }}></Icon>
               
            </View>
            <TouchableOpacity
                onPress={() => requestAnimationFrame(() => {
                    !this.state.playing ? this.playAudio() : this.pauseAudio()
                })} style={{
                    width: '10%',
                    alignItems: 'flex-end',
                    ...this.center
                }}>
                <Icon style={{
                    color: ColorList.bodyBackground,
                    fontSize:30
                }}  name={this.state.playing ? "play" : "pause"} type="AntDesign">
                </Icon>
            </TouchableOpacity>
        </View>
    }
}
