/* eslint-disable prettier/prettier */
import React, { PureComponent } from 'react';
import { View, TouchableOpacity, ScrollView} from "react-native"
import AreYouSure from './AreYouSureModal';
import CacheImages from '../../CacheImages';
import shadower from '../../shadower';
import BleashupModal from '../../mainComponents/BleashupModal';
import PickersUpload from './createEvent/components/PickerUpload';
import EvilIcons  from 'react-native-vector-icons/EvilIcons';
import Entypo  from 'react-native-vector-icons/Entypo';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import ColorList from '../../colorList';
import PhotoPreview from '../eventChat/PhotoPreviewer';
import PhotoViewer from './PhotoViewer';

export default class PhotoInputModal extends BleashupModal {
    initialize() {
        this.state = {
        }
    }
    onClosedModal() {
        this.props.closed()
        this.setStatePure({
            message: null,
            title: null,
            callback: null,
        })
    }
    swipeToClose=false
    modalHeight = 340
    modalWidth = 300
    borderRadius = 5
    position = "center"
    modalBody() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={{ flexDirection: 'column', }}>
                <TouchableOpacity onPress={() => this.setStatePure({
                    showPhoto:true
                })} style={{
                    backgroundColor: ColorList.indicatorColor,
                    ...shadower(2),
                    alignSelf: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    width:300,
                    height: 300
                }}>
                    <CacheImages source={{ uri: this.props.photo }} style={{
                        width: 300,
                        height: 290,
                        borderRadius: 5
                    }} thumbnails square></CacheImages>
                </TouchableOpacity>



                <View style={{ 
                    flexDirection: 'row', 
                    alignSelf: 'center',
                    alignItems:'center', 
                    marginLeft: "1%",
                    borderRadius: 4, width:'100%',height:40,}}>
                  {!this.props.isRelation && <View style={{width:'50%',
                  borderRadius:35,
                        ...shadower(1), 
                        backgroundColor: ColorList.bodyBackground,
                    }}>
                        <PickersUpload withTrash={!this.props.isRelation && this.props.photo } currentURL={{ photo:this.props.photo }} saveMedia={(url) => this.props.saveBackground(url.photo)} creating={false} notVideo notAudio></PickersUpload>
                   </View>}
                 
                   <View style={{flexDirection:'row',flex:1,justifyContent:'flex-end', alignItems:'center'}}>
                   
                    <Entypo name="sound-mute" active={true} style={{ color: 'black',fontSize:22 }} onPress={() => {}} />
                    <MaterialIcons name="block" active={true}  style={{ color: 'red',fontSize:22,marginLeft:15 , marginRight:5 }} onPress={() => {}} />
                   </View>
                </View>
                {this.state.showPhoto?<PhotoViewer
                    open={this.state.showPhoto}
                    photo={this.props.photo}
                    hidePhoto={() =>{
                        this.setStatePure({
                            showPhoto:false
                        })
                    }}
                    >
                </PhotoViewer>:null}
            </ScrollView>
        );
    }
}