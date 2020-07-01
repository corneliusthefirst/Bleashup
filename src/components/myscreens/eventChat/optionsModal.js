/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity, StyleSheet} from 'react-native';
import rounder from "../../../services/rounder";
import ColorList from "../../colorList";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);

import { Icon, Text } from 'native-base';
import BleashupModal from '../../mainComponents/BleashupModal';
import BeNavigator from '../../../services/navigationServices';

export default class OptionsModal extends BleashupModal {

  onClosedModal() {
    this.props.onClosed();
  }
  backdropOpacity = 0.01
  borderRadius = 10
  modalBackground = "rgba(255,255,255,0.8)";
  entry = 'bottom';
  position = 'bottom';
  modalWidth = '96%'
  modalHeight = 220;
  style = {bottom:60}
  coverScreen= true;

  addRemind = () => {
    setTimeout(()=>{this.props.onClosed();},100);
    this.props.addRemind();
  }

  openFilePicker = () => {
    setTimeout(()=>{this.props.onClosed();},100);
    this.props.openFilePicker();
  }

  openPhotoSelector = () => {
    setTimeout(()=>{this.props.onClosed();},100);
    this.props.openPhotoSelector();
  }

  openAudioPicker = () => {
    setTimeout(()=>{this.props.onClosed();},100);
    this.props.openAudioPicker();
  }


  onClickContact = () => {
    setTimeout(()=>{this.props.onClosed();},100);
    BeNavigator.navigateTo("Contacts");
  }
  navigateToQRScanner = () => {
    setTimeout(()=>{this.props.onClosed();},100);
    BeNavigator.navigateTo("QR");
  }

  onClickNewEvent = () => {
    setTimeout(()=>{this.props.onClosed();},100);
    BeNavigator.navigateTo("CreateEventView");
  }

  onClickAllRemind = () => {
    setTimeout(()=>{this.props.onClosed();},100);
    BeNavigator.navigateTo("MyTasksView");
  }


  modalBody() {
    return (
<View style={{flex:1,flexDirection:'column',borderRadius:10,justifyContent:'space-between'}}>

<View style={{height:210,flexDirection:'column',borderRadius:10,justifyContent:'space-between'}}>

   <View style={{height:100,width:'100%',flexDirection:'row',borderRadius:10,justifyContent:'space-between',padding:10}}>

  <View style={{height:'98%',flexDirection:'column',justifyContent:'center',alignItems:'center',width:screenWidth / 4}}>
    <TouchableOpacity
         onPress={() => requestAnimationFrame(() => this.addRemind() )}
                style={{
                    width: 40,
                    bottom: 2,
                    padding: "1%",
                    justifyContent:'center',alignItems:'center'}} >


                <View
                    style={{
                        alignItems: "center",
                        ...rounder(55, '#1e90ff'),
                    }}
                >
                    <Icon
                        style={{
                            color: 'white',
                            fontSize: 25,
                        }}
                        type={"Entypo"}
                        name={"bell"}
                    ></Icon>
                </View>
        </TouchableOpacity>

            <Text style={styles.textStyle} >Remind Message</Text>
</View>


<View style={{height:'100%',flexDirection:'column',justifyContent:'center',alignItems:'center',width:screenWidth / 5}}>
    <TouchableOpacity
         onPress={() => requestAnimationFrame(() => { this.openFilePicker(); } )}
                style={{
                    width: 40,
                    bottom: 2,
                    padding: "1%",
                    justifyContent:'center',alignItems:'center'
                }}
     >
                <View
                    style={{
                        alignItems: "center",
                        ...rounder(55, ColorList.indicatorColor),
                    }}
                >
                    <Icon
                        style={{
                            color: ColorList.bodyBackground,
                            fontSize: 20,
                        }}
                        type={"AntDesign"}
                        name={"addfile"}
                    ></Icon>
                </View>
            </TouchableOpacity>

    <Text style={styles.textStyle} >Files</Text>
</View>

<View style={{height:'100%',flexDirection:'column',justifyContent:'center',alignItems:'center',width:screenWidth/4}}>
    <TouchableOpacity
         onPress={() => requestAnimationFrame(() => this.openPhotoSelector() )}
                style={{
                    width: 40,
                    bottom: 2,
                    padding: "1%",
                    justifyContent:'center',
                    alignItems:'center',
                }}
     >
                <View
                    style={{
                        alignItems: "center",
                        ...rounder(55, '#8b008b'),
                    }}
                >
                    <Icon
                        style={{
                            color: ColorList.bodyBackground,
                            fontSize: 23,
                        }}
                        type={"Ionicons"}
                        name={"md-photos"}
                    ></Icon>
                </View>
            </TouchableOpacity>

    <Text style={styles.textStyle}  >Add Photos</Text>
</View>

<View style={{height:'100%',flexDirection:'column',justifyContent:'center',alignItems:'center',width:screenWidth/5}}>
 <TouchableOpacity
         onPress={() => requestAnimationFrame(() => this.openAudioPicker() )}
                style={{
                    width: 40,
                    bottom: 2,
                    padding: "1%",
                    justifyContent:'center',alignItems:'center',
                }}
     >
       <View style={{ alignItems: "center", ...rounder(55, '#ff8c00') }} >

               <View
                    style={{
                        alignItems: "center",
                        ...rounder(40, '#ffd707'),
                    }}
                >
                   <Icon
                        style={{
                            color: ColorList.bodyBackground,
                            fontSize: 20,
                        }}
                        type={"MaterialCommunityIcons"}
                        name={"microphone-plus"}
                    ></Icon>

                </View>

        </View>
 </TouchableOpacity>

    <Text style={styles.textStyle}  >Audio</Text>
</View>


</View>



<View style={{height:100,width:'100%',flexDirection:'row',borderRadius:10,justifyContent:'space-between',padding:10}}>

<View style={{height:'98%',flexDirection:'column',justifyContent:'center',alignItems:'center',width:screenWidth / 4}}>
<TouchableOpacity
onPress={() => requestAnimationFrame(() => this.navigateToQRScanner() )}
    style={{
        width: 40,
        bottom: 2,
        padding: "1%",
        justifyContent:'center',alignItems:'center'}} >


    <View
        style={{
            alignItems: "center",
            ...rounder(55, '#cd5c5c'),
        }}
    >
        <Icon
            style={{
                color: 'white',
                fontSize: 22,
            }}
            type={"MaterialCommunityIcons"}
            name={"qrcode-scan"}
        ></Icon>
    </View>
</TouchableOpacity>

<Text style={styles.textStyle} >QR Scanner</Text>
</View>


<View style={{height:'100%',flexDirection:'column',justifyContent:'center',alignItems:'center',width:screenWidth / 4.5}}>
<TouchableOpacity
onPress={() => requestAnimationFrame(() => { this.onClickAllRemind(); } )}
    style={{
        width: 40,
        bottom: 2,
        padding: "1%",
        justifyContent:'center',alignItems:'center'
    }}
>
    <View
        style={{
            alignItems: "center",
            ...rounder(55, '#66cdaa'),
        }}
    >
        <Icon
            style={{
                color: ColorList.bodyBackground,
                fontSize: 22,
            }}
            type={"SimpleLineIcons"}
            name={"list"}
        ></Icon>
    </View>
</TouchableOpacity>

<Text style={styles.textStyle} >All Reminds</Text>
</View>


<View style={{height:'100%',flexDirection:'column',justifyContent:'center',alignItems:'center',width:screenWidth/4}}>
<TouchableOpacity
onPress={() => requestAnimationFrame(() => this.onClickContact() )}
    style={{
        width: 40,
        bottom: 2,
        padding: "1%",
        justifyContent:'center',
        alignItems:'center',
    }}
>
    <View
        style={{
            alignItems: "center",
            ...rounder(55, '#48d1cc'),
        }}
    >
        <Icon
            style={{
                color: ColorList.bodyBackground,
                fontSize: 25,
            }}
            type={"Feather"}
            name={"user"}
        ></Icon>
    </View>
</TouchableOpacity>

<Text style={styles.textStyle}  >Contacts</Text>
</View>

<View style={{height:'100%',flexDirection:'column',justifyContent:'center',alignItems:'center',width:screenWidth/5}}>
<TouchableOpacity
onPress={() => requestAnimationFrame(() => this.onClickNewEvent() )}
    style={{
        width: 40,
        bottom: 2,
        padding: "1%",
        justifyContent:'center',alignItems:'center',
    }}
>

   <View
        style={{
            alignItems: "center",
         ...rounder(55, '#663399'),
        }}
    >
       <Icon
            style={{
                color: ColorList.bodyBackground,
                fontSize: 25,
            }}
            type={"MaterialIcons"}
            name={"group-add"}
        ></Icon>

    </View>


   </TouchableOpacity>

 <Text style={styles.textStyle}  >New Activity</Text>
</View>

</View>

</View>

<View style={styles.TriangleShapeView} />


</View>
    );
  }
}

const styles = StyleSheet.create({
     textStyle: {
        fontSize:10,
        color:'black',
     },
     TriangleShapeView: {
        //To make Triangle Shape
        marginTop:9,
        width: 0,
        height: 0,
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderTopWidth: 15,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: "rgba(255,255,255,0.8)",
        marginLeft:'11%',
     },
});
