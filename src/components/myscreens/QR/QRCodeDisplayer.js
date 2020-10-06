import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons"
import RNFetchBlob from 'rn-fetch-blob';
import colorList from '../../colorList'
import ColorList from '../../colorList';
import Toaster from '../../../services/Toaster';
import GState from '../../../stores/globalState';
import rounder from '../../../services/rounder';
export default class QRDisplayer extends Component{
    constructor(props){
        super(props)
    }
    saveQR(){
        this.svg.toDataURL(data => {
            RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.DownloadDir + '/Bleashup/' + this.props.title + '_qrcode(Bleashup).jpeg', data, 'base64').then(status => {
                Toaster({ text: 'QR Code save to Downloads/Bleashup', type: 'success', duration: 5000 })
            })
        })
    }
    render(){
        return <View style={{flexDirection: 'row',alignItems: 'center',}}>
        <View style={{
            ...rounder(120,ColorList.bodyDarkWhite),
            justifyContent: 'center',
        }}>
            <QRCode
                size={80}
                getRef={(c) => (this.svg = c)}
                value={this.props.code}
                color= {ColorList.headerIcon}
                logo={require('../../../../assets/Bleashup.png')}
                backgroundColor= {ColorList.bodyBackground}
            />
            </View>

            <View style={{margin: '2%',}}>
                <TouchableOpacity style={{
                    ...rounder(30,ColorList.bodyDarkWhite),
                    justifyContent: 'center',
                }} onPress={this.saveQR.bind(this)}>
                <MaterialIconCommunity name="download-outline" 
                style={{...GState.defaultIconSize,color:colorList.indicatorColor}}>
                </MaterialIconCommunity>
            </TouchableOpacity>
            </View>
        </View>
    }
}