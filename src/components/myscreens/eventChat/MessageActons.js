
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
import Feather  from 'react-native-vector-icons/Feather';

export default class MessageActions extends BleashupModal {

    modalHeight = "45%"
    modalWidth = "100%"
    modalMinHieight=50
    borderRadius = 0

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
        switch (type){
           case "Ionicons": return <Ionicons name={iconName} style={style}></Ionicons>;
           case "Entypo": return <Entypo name={iconName} style={style}></Entypo>;
           case "FontAwesome5": return <FontAwesome5 name={iconName} style={style}></FontAwesome5>;
           case "FontAwesome": return <FontAwesome name={iconName} style={style}></FontAwesome>;
           case "SimpleLineIcons": return <SimpleLineIcons name={iconName} style={style}></SimpleLineIcons>;
           case "MaterialIcons": return <MaterialIcons name={iconName} style={style}></MaterialIcons>;
           case "Octicons": return <Octicons name={iconName} style={style}></Octicons>;
           case "AntDesign": return <AntDesign name={iconName} style={style}></AntDesign>;
           case "MaterialCommunityIcons": return <MaterialCommunityIcons name={iconName} style={style}></MaterialCommunityIcons>;
           case "EvilIcons": return <EvilIcons name={iconName} style={style}></EvilIcons>;
           case "Ionicons": <Ionicons name={iconName} style={style}></Ionicons>;
           case "Feather": return <Feather name={iconName} style={style}></Feather>;
           default: return <View><Text style={{...GState.defaultTextStyle}}>{type}</Text></View>
        }
    }
    renderActions(){
        return this.props.actions && this.props.actions().map(ele => ele.condition && ele.condition() && <TouchableOpacity onPress={() => requestAnimationFrame(() =>{
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