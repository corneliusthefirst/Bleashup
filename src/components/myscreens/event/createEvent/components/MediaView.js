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
        return <View style={{justifyContent:"center",backgroundColor:"gray",width:this.props.width}}>
            <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.showItem(this.props.url))} >
                {this.containsMedia() ? <View style={{ width:"100%", backgroundColor: 'transparent', alignSelf: 'center',flex: 1, justifyContent: 'center', }}>
                    <View style={{ width: "100%", height: this.props.height * .695 }}>
                        {this.props.url && this.props.url.photo && testForURL(this.props.url.photo) ?
                            <CacheImages thumbnails square style={{
                                width: this.props.width,
                                alignSelf: 'center', height: this.props.height * .7
                            }} source={{ uri: this.props.url.photo }}></CacheImages> :
                            <Thumbnail source={{ uri: this.props.url.photo }} style={{
                                flex: 1, width: null, height: null,
                            }} large ></Thumbnail>}
                    </View>
                </View> : null}
            </TouchableOpacity>
            {this.props.url && (this.props.url.video || this.props.url.audio) ?
                <View style={{
                    ...buttoner,
                }}>{this.props.url.video ?
                    <Icon onPress={() => {
                     this.props.showItem(this.props.url)
                    }} name="ios-play" style={{
                        fontSize: 43, color: ColorList.bodyBackground
                    }} type="Ionicons" />
                     :
                 
                      <Icon onPress={() => {
                        this.props.showItem(this.props.url)
                    }} name= "headset" style={{
                        fontSize: 40, color: ColorList.bodyBackground
                    }} type="MaterialIcons" />
                    }
                </View> : null}
        </View>
    }
}