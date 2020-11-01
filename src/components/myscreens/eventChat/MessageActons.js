
import BleashupModal from "../../mainComponents/BleashupModal";
import React from 'react';
import { TouchableOpacity, View, ScrollView, Text} from "react-native";
import ColorList from '../../colorList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import  Octicons from 'react-native-vector-icons/Octicons';
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import  SimpleLineIcons  from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome  from 'react-native-vector-icons/FontAwesome';
import FontAwesome5  from 'react-native-vector-icons/FontAwesome5';
import  Entypo  from 'react-native-vector-icons/Entypo';
import GState from "../../../stores/globalState";
import Fontisto from "react-native-vector-icons/Fontisto"
import Feather  from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';

export default class MessageActions extends BleashupModal {

    modalHeight = "45%"
    modalWidth = "100%"
    modalMinHieight=50
    borderRadius = 0
    backdropOpacity=.3
    actionsContainerStyles = {
        width: '95%',
        height: 60,
        margin: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
    actionIconContainerStyle = {
        marginBottom: 'auto',
        marginTop: 'auto',
        width: '10%',
        justifyContent: 'center',
        textAlign: 'center'
    }
    textContainerStyle = {
        width: '85%',
        marginBottom: 'auto',
        marginTop: 'auto',
        justifyContent: 'flex-start',
        textAlign: 'flex-start'
    }
    onClosedModal() {
        this.props.onClosed()
    }
    icons(name,type,color){
        let style = {
            ...GState.defaultIconSize,
            color: color || ColorList.bodyIcon
        }
        let iconName = name
        const types = {
           ["Ionicons"]: () => <Ionicons name={iconName} style={style}></Ionicons>,
           ["Entypo"]: () => <Entypo name={iconName} style={style}></Entypo>,
           ["FontAwesome5"]: () => <FontAwesome5 name={iconName} style={style}></FontAwesome5>,
           ["FontAwesome"]: () => <FontAwesome name={iconName} style={style}></FontAwesome>,
           ["SimpleLineIcons"]: () => <SimpleLineIcons name={iconName} style={style}></SimpleLineIcons>,
           ["MaterialIcons"]: () => <MaterialIcons name={iconName} style={style}></MaterialIcons>,
           ["Octicons"]: () => <Octicons name={iconName} style={style}></Octicons>,
            ["AntDesign"]: () => <AntDesign name={iconName} style={style}></AntDesign>,
           ["MaterialCommunityIcons"]:() => <MaterialCommunityIcons name={iconName} 
           style={style}></MaterialCommunityIcons>,
           ["EvilIcons"]: () => <EvilIcons name={iconName} style={style}></EvilIcons>,
           ["Ionicons"]: () => <Ionicons name={iconName} style={style}></Ionicons>,
           ["Fontisto"]: () => <Fontisto name={iconName} style={style}></Fontisto>,
           ["Feather"]:  () => <Feather name={iconName} style={style}></Feather>,
            ["Foundation"]: () => <Foundation name={iconName} style={style}></Foundation>
        }
        const defaultVal = <View><Text style={{ ...GState.defaultTextStyle }}>{type}</Text></View>
        return (types[type] && types[type]()) || defaultVal
           
        
    }
    renderActions(){
        return this.props.actions && 
        this.props.actions().map((ele,index) => ele.condition && 
            ele.condition() && 
        <TouchableOpacity key={ele.title+index} onPress={() => requestAnimationFrame(() =>{
            this.onClosedModal()
            ele.callback()
        })} style={{
            ...this.actionsContainerStyles
        }}>
            <View style={{ ...this.actionIconContainerStyle }}>
                {this.icons(ele.iconName, ele.iconType,ele.color)}
            </View>
            <View style={{ ...this.textContainerStyle }}>
                <Text style={{ ...GState.defaultTextStyle }}>{ele.title}</Text>
            </View>
        </TouchableOpacity>)
    }
    modalBody() {
        return <View style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
        }}><View 
        style={{
            height:10,
            justifyContent: 'center',
            flexDirection: 'row',}}>
        <Text style={{ fontSize: 8, }} note>{this.props.title}</Text></View><ScrollView showsVerticalScrollIndicator={false}>
            <View style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignSelf: 'center',
                width: '95%',
                height: '80%',
                margin: 'auto'
            }}>
                {this.renderActions()}
            </View>
        </ScrollView>
        </View>
    }
}