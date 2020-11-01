import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import testForURL from '../../../../../services/testForURL';
import shadower from '../../../../shadower';
import CacheImages from '../../../../CacheImages';
import buttoner from '../../../../../services/buttoner';
import ColorList from '../../../../colorList';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FileAttarchementMessaege from '../../../eventChat/FileAttarchtmentMessage';
import AudioMessage from '../../../eventChat/AudioMessage';
import { containsAudio, containsMedia, containsFile } from './mediaTypes.service';

export default class MedaiView extends Component {
    constructor(props) {
        super(props)
        this.containsMedia = containsMedia.bind(this)
        this.containsAudio = containsAudio.bind(this)
        this.containsFile = containsFile.bind(this)
    }

    render() {
        this.url = this.props.url
        return this.containsFile() ? <FileAttarchementMessaege
            data={this.props.data}
            activity_id={this.props.activity_id}
            updateSource={this.props.updateSource}
            message={{ total: 0, received: 0, ...this.props.url }}>
        </FileAttarchementMessaege> : this.containsAudio() ? <AudioMessage
            message={{
                received: 0, sent: 0, ...this.props.url,
                id: this.props.url.id || this.props.data.id || this.props.data.remind_id
            }}
            data={this.props.data}
            updateSource={this.props.updateSource}
            activity_id={this.props.activity_id}
        ></AudioMessage> : this.containsMedia() ?
                    <TouchableOpacity style={{
                        justifyContent: "center",
                        borderRadius: this.props.style && this.props.style.borderRadius,
                        backgroundColor: "lightgrey",
                        width: this.props.width,
                        justifyContent: 'center',
                    }} onPress={() => requestAnimationFrame(() => this.props.showItem(this.props.url))} >
                        <CacheImages thumbnails square style={{
                            width: this.props.width ? this.props.width : "100%",
                            alignSelf: 'center', height: this.props.height * .7,...this.props.style
                        }} source={{ uri: this.props.url.photo }}></CacheImages>
                        {this.props.url && (this.props.url.video || this.props.url.audio) ?
                            <View style={{
                                ...buttoner,
                                alignSelf: "center",
                                position: "absolute",
                            }}>
                                {this.props.url.video ?
                                    <Ionicons onPress={() => {
                                        this.props.showItem(this.props.url)
                                    }} name="ios-play" style={{
                                        fontSize: 43, color: ColorList.bodyBackground
                                    }} type="Ionicons" />
                                    :

                                    <MaterialIcons onPress={() => {
                                        this.props.showItem(this.props.url)
                                    }} name="headset" style={{
                                        fontSize: 40, color: ColorList.bodyBackground
                                    }} type="MaterialIcons" />
                                }
                            </View> : null}
                    </TouchableOpacity> : null
    }
}