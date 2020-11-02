
import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import ActionButton from 'react-native-action-button';
import ColorList from '../../../colorList';
import shadower from "../../../shadower";
import Feather from 'react-native-vector-icons/Feather';
import GState from '../../../../stores/globalState/index';
import BeNavigator from '../../../../services/navigationServices';
import Texts from '../../../../meta/text';
import BeComponent from '../../../BeComponent';
import  AntDesign  from 'react-native-vector-icons/AntDesign';

export default class ConcerneeActions extends BeComponent {
    constructor(props) {
        super(props);
        this.onClickNewContact = this.onClickNewContact.bind(this)
        this.onClickNewEvent = this.onClickNewEvent.bind(this)
        this.navigateToQRScanner = this.navigateToQRScanner.bind(this)

    }

    onClickNewEvent() {
        BeNavigator.navigateToCreateEvent();
    };

    onClickNewContact() {
        BeNavigator.navigateToContacts();
    }
    navigateToQRScanner() {
        BeNavigator.navigateToQR();
    }
    renderIcon() {
        return (
            <View
                style={styles.iconStyle}
            >
                <Icon
                    name="plus"
                    style={styles.plusIcon}
                />
            </View>
        );
    }
    render() {
        return (
            <ActionButton
                buttonColor={ColorList.bodyBackground}
                position="right"
                backgroundTappable={true}
                btnOutRange={ColorList.bodyText}
                size={52}
                useNativeFeedback={false}
                renderIcon={this.renderIcon}
            >
                <ActionButton.Item
                    buttonColor={ColorList.indicatorColor}
                    title={Texts.add_members}
                    onPress={this.props.addMembers}
                    size={60}
                >

                    <AntDesign
                        name="addusergroup"
                        active={true}
                        color={ColorList.bodyBackground}
                        size={styles.actionButtonIcon.fontSize}
                    //style={styles.actionButtonIcon}
                    />
                </ActionButton.Item>
                <ActionButton.Item
                    buttonColor={ColorList.indicatorInverted}
                    title={Texts.export_members}
                    onPress={this.props.exportMembers}
                    size={55}
                >
                    <Icon
                        name={"file-export"}
                        active={true}
                        style={{ 
                            fontSize: 35,
                            color:ColorList.indicatorColor 
                        }}
                    />
                </ActionButton.Item>
            </ActionButton>
        );
    }
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 40,
        height: 22,
        color: 'white',
    },
    iconStyle: {
        backgroundColor: ColorList.bodyBackground,
        height: 52,
        width: 52,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadower(4),
    },
    plusIcon: { color: ColorList.indicatorColor, fontSize: 30 }
});
