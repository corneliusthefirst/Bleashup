
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

export default class CreateRemind extends BeComponent {
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
                    buttonColor={ColorList.reminds}
                    title={Texts.add_remind} 
                    onPress={this.props.createRemind}
                    size={75}
                >

                    <Icon
                        name="bell-plus"
                        active={true}
                        color={styles.actionButtonIcon.color}
                        size={styles.actionButtonIcon.fontSize}
                    //style={styles.actionButtonIcon}
                    />
                </ActionButton.Item>
                <ActionButton.Item
                    buttonColor="#cd5c5c"
                    title={Texts.join_program_via_qr} 
                    onPress={this.navigateToQRScanner}
                    size={55}
                >
                    <Icon
                        name="barcode-scan"
                        active={true}
                        style={{...styles.actionButtonIcon,fontSize: 23,}}
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
