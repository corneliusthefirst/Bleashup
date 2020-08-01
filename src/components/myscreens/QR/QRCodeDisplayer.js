import React, { Component } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons"
import RNFetchBlob from 'rn-fetch-blob';
import colorList from '../../colorList'
import ColorList from '../../colorList';
import Toaster from '../../../services/Toaster';
import { TouchableOpacity } from 'react-native-gesture-handler';
import GState from '../../../stores/globalState';
export default class QRDisplayer extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return <View style={{flexDirection: 'row',marginBottom:"6%"}}>
            <QRCode
                size={70}
                getRef={(c) => (this.svg = c)}
                value={this.props.code}
                color= {ColorList.headerIcon}
                logo={require('../../../../assets/Bleashup.png')}
                backgroundColor= {ColorList.bodyBackground}
            />

            <View style={{margin: '2%',}}>
                <TouchableOpacity onPress={() => {
                    this.svg.toDataURL(data => {
                        RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.DownloadDir + '/Bleashup/' + this.props.title + '_qrcode(Bleashup).jpeg', data, 'base64').then(status => {
                            Toaster({ text: 'QR Code save to Downloads/Bleashup', type: 'success', duration: 5000 })
                        })
                    })
                }}>
                <MaterialIconCommunity name="download-outline" style={{...GState.defaultIconSize,color:colorList.bodyIcon}}>
                </MaterialIconCommunity>
            </TouchableOpacity>
            </View>
        </View>
    }
}