import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity,Dimensions} from 'react-native'
import { Button, Icon } from 'native-base'
import CacheImages from '../../../CacheImages';
import Image from 'react-native-scalable-image';

let {height, width} = Dimensions.get('window');

export default class PhotoEnlargeModal extends Component {
    constructor(props) {
        super(props)
    }
    
   
    transparent = "rgba(52, 52, 52, 0.3)";

    render() {
        return this.props.image|| this.props.photo ? (
            <Modal
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center', height: "100%", borderRadius: 15,
                    backgroundColor: "black", width: "100%"
                }}
                position={'center'}
            >
              <View style={{flex:1,alignSelf:'stretch'}}>
                <View style={{ flex:1,flexDirection:'column',backgroundColor: "black",justifyContent:'center',alignItems: 'center' }}>
                    <TouchableOpacity onPress={this.props.onClosed} transparent>
                        <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="cross" type="Entypo" />
                    </TouchableOpacity>
                </View>
            {this.props.image ?
                ( <View style={{flex:6,flexDirection:'column'}}>  
                    <TouchableOpacity onPress={this.props.onClosed} >
                        <Image source={{ uri: this.props.image }} style={{ width:height, height:width}}   />
                    </TouchableOpacity>
                </View> ):
                (<View style={{flex:6,flexDirection:'column'}}>  
                    <TouchableOpacity onPress={this.props.onClosed} >
                        <Image  source={{uri:this.props.photo }} style={{ width:height, height:width}} />
                    </TouchableOpacity>
                </View>)

             }

                <View style={{ flex: 1, backgroundColor: "black", flexDirection: 'column' }}>
                </View>
                </View>
            </Modal>
        ) : null
    }

}