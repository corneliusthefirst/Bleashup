import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Thumbnail, Icon } from 'native-base';
import testForURL from '../../../../../services/testForURL';
import shadower from '../../../../shadower';
import CacheImages from '../../../../CacheImages';
import buttoner from '../../../../../services/buttoner';
import ColorList from '../../../../colorList';

export default class MedaiView extends Component {
    constructor(props) {
        super(props)
    }
    containsMedia() {
        return this.props.url.video || this.props.url.audio || this.props.url.photo ? true : false
    }
    render() {
        return <View>
            <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.showItem(this.props.url))} >
                {this.containsMedia() ? <View style={{ width: "97%", backgroundColor: 'transparent', borderRadius: 5, ...shadower(2), alignSelf: 'center',flex: 1, justifyContent: 'center', }}>
                    <View style={{ width: "100%", height: this.props.height * .695 }}>
                        {this.props.url && this.props.url.photo && testForURL(this.props.url.photo) ?
                            <CacheImages thumbnails square style={{
                                width: this.props.width || "103%",
                                alignSelf: 'center', height: this.props.height * .7, borderRadius: 5,
                            }} source={{ uri: this.props.url.photo }}></CacheImages> :
                            <Thumbnail source={{ uri: this.props.url.photo }} style={{
                                flex: 1, width: null, height: null,
                                borderRadius: 8
                            }} large ></Thumbnail>}
                    </View>
                </View> : null}
            </TouchableOpacity>
            {this.props.url && (this.props.url.video || this.props.url.audio) ?
                <View style={{
                    position: 'absolute',
                    ...buttoner,
                    paddingLeft: '-20%',
                    marginTop: '20%',
                    marginLeft: '35%',
                    height: 40,
                    width: 5,
                }}><Icon onPress={() => {
                    this.props.showItem(this.props.url)
                }} name={this.props.url.video ? "play" : "headset"} style={{
                    fontSize: 50, color: ColorList.headerBackground, margin: 'auto',
                }} type={this.props.url.video ? "EvilIcons" : "MaterialIcons"}>
                    </Icon></View> : null}
        </View>
    }
}