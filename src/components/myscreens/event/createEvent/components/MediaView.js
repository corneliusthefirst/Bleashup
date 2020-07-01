import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import testForURL from '../../../../../services/testForURL';
import shadower from '../../../../shadower';
import CacheImages from '../../../../CacheImages';
import buttoner from '../../../../../services/buttoner';
import ColorList from '../../../../colorList';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default class MedaiView extends Component {
    constructor(props) {
        super(props)
    }
    containsMedia() {
        return this.props.url.video || this.props.url.audio || this.props.url.photo ? true : false
    }
    render() {
        return this.containsMedia() ? <TouchableOpacity style={{ 
            justifyContent: "center", 
            backgroundColor: "lightgrey", 
            width: this.props.width,
            justifyContent: 'center', }} onPress={() => requestAnimationFrame(() => this.props.showItem(this.props.url))} >
                    <CacheImages thumbnails square style={{
                        width: this.props.width ? this.props.width : "100%",
                        alignSelf: 'center', height: this.props.height * .7
                    }} source={{ uri: this.props.url.photo }}></CacheImages>
                {this.props.url && (this.props.url.video || this.props.url.audio) ?
                    <View style={{
                        ...buttoner,
                        alignSelf: "center",
                        position: "absolute",
                    }}>
                        {this.props.url.video ?
                            <Icon onPress={() => {
                                this.props.showItem(this.props.url)
                            }} name="ios-play" style={{
                                fontSize: 43, color: ColorList.bodyBackground
                            }} type="Ionicons" />
                            :

                            <Icon onPress={() => {
                                this.props.showItem(this.props.url)
                            }} name="headset" style={{
                                fontSize: 40, color: ColorList.bodyBackground
                            }} type="MaterialIcons" />
                        }
                    </View> : null}
        </TouchableOpacity>:null
    }
}