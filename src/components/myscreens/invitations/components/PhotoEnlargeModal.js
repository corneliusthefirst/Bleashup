import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity,Dimensions} from 'react-native'
import { Button, Icon } from 'native-base'
import CacheImages from '../../../CacheImages';

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
                    alignItems: 'center', height:height, borderRadius: 15,
                    backgroundColor: "black", width: "100%"
                }}
                position={'center'}
                
            >
              <View style={{flex:1}}>
                <View style={{height:height/4,flexDirection:'column',backgroundColor: "black",justifyContent:'center',alignItems: 'center' }}>
                    <TouchableOpacity onPress={this.props.onClosed} transparent>
                        <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="cross" type="Entypo" />
                    </TouchableOpacity>
                </View>
            {this.props.image ?
                ( <View style={{height:height-(2*height/6)}}>  
                   <View style={{width:"100%",height:"100%"}}>
                     <TouchableOpacity onPress={this.props.onClosed} >
                        <Image source={{ uri: this.props.image }} width={width}  />
                     </TouchableOpacity>
                    </View>
                </View> ):
                (<View style={{height:height-(2*height/4)}}>  
                    <View style={{width:"100%",height:"100%"}}>
                        <Image  source={{uri:this.props.photo }} width={width}  />
                    </View>
                </View>)

             }

                <View style={{height:height/4, backgroundColor: "black", flexDirection: 'column' }}>
                </View>
                </View>
            </Modal>
        ) : null
    }

}