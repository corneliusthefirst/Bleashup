
import BleashupModal from "../../mainComponents/BleashupModal";
import React from 'react';
import { TouchableOpacity, View, ScrollView } from "react-native";
import { Icon, Text } from "native-base";
import ColorList from '../../colorList';


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
    renderActions(){
        return this.props.actions && this.props.actions().map(ele => ele.condition && ele.condition() && <TouchableOpacity onPress={() => requestAnimationFrame(() =>{
            this.onClosedModal()
            ele.callback()
        })} style={{
            ...this.actionsContainerStyles
        }}>
            <View style={{ ...this.actionIconContainerStyle }}>
                <Icon name={ele.iconName} type={ele.iconType} style={{
                    color: ele.color||ColorList.bodyIcon
                }}></Icon>
            </View>
            <View style={{ ...this.textContainerStyle }}>
                <Text>{ele.title}</Text>
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