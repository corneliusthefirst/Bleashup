import React, { Component } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Icon } from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';
import { Toast } from 'native-base';
import colorList from '../../colorList'
import ColorList from '../../colorList';

export default class QRDisplayer extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return <View style={{flexDirection: 'row',}}>
            <QRCode
                size={110}
                getRef={(c) => (this.svg = c)}
                value={this.props.code}
                color= {ColorList.headerIcon}
                logo={require('../../../../assets/Bleashup.png')}
                backgroundColor= {ColorList.bodyBackground}
            />

            <View style={{margin: '2%',}}>
            <Icon onPress={() => {
                this.svg.toDataURL(data => {
                    RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.DownloadDir + '/Bleashup/'+this.props.title + '_qrcode(Bleashup).jpeg', data, 'base64').then(status => {
                        Toast.show({text:'QR Code save to Downloads/Bleashup',type:'success',duration:5000})
                    })
                })
                }} name="file-download" type="MaterialIcons" style={{color:colorList.bodyIcon}}>
            </Icon>
            </View>
        </View>
    }
}