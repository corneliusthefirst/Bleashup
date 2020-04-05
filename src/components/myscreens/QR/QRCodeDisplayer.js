import React, { Component } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Icon } from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';
import { Toast } from 'native-base';

export default class QRDisplayer extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return <View style={{flexDirection: 'row',}}>
            <QRCode
                size={100}
                getRef={(c) => (this.svg = c)}
                value={this.props.code}
                color='#0A4E52'
                logo={require('../../../../assets/Bleashup.png')}
                backgroundColor='#FEFFDE'
            />
            <View style={{margin: '3%',}}>
            <Icon onPress={() => {
                this.svg.toDataURL(data => {
                    RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.DownloadDir + '/Bleashup/'+this.props.title + '_qrcode(Bleashup).jpeg', data, 'base64').then(status => {
                        Toast.show({text:'QR Code save to downloads as image',type:'success',duration:3000})
                    })
                })
                }} name={"sharealt"} type={"AntDesign"} style={{color:'gray'}}>
            </Icon>
            </View>
        </View>
    }
}