import React, { Component } from 'react';
import Modal from "react-native-modalbox"
import {View,Text,TextInput as Input} from "react-native"
import globalState from '../../../../stores/globalState/globalState';
import styles from "./styles"
import CreateButton from '../../event/createEvent/components/ActionButton';
import Texts from '../../../../meta/text';
import Spinner from '../../../Spinner';
import Ionicons  from 'react-native-vector-icons/Ionicons';
import  TouchableOpacity  from 'react-native-gesture-handler';
import GState from '../../../../stores/globalState';
import ColorList from '../../../colorList';
import BleashupModal from '../../../mainComponents/BleashupModal';
import CreationHeader from '../../event/createEvent/components/CreationHeader';
export default class VerificationModal extends BleashupModal{
    initialize() {
        this.state = {
            code : null
        }
    }
    backdropPressToClose = false
    state = {}
    removeError() {
        globalState.error = false;
    }
    onClosedModal(){
        this.props.onClose()
    }
    onChangedCode(value){
        this.setState({
            code:value
        })
    }
    verifyNumber(){
        this.props.verifyCode(this.state.code)
    }
    modalBody() {
        return (
                <View>
                <CreationHeader title={Texts.phone_number_verify} back={this.onClosedModal.bind(this)}>
                </CreationHeader>
                    <View
                    style={{ margin: "3%", marginTop: 50, marginLeft: 10 }}
                    >
                        <Text>{Texts.phone_number_verification} {"    "}{this.props.phone.replace("00", "+")} </Text>
                    </View>

                    <Text style={{ color: "skyblue", marginTop: 20 }}>
                        {Texts.confirm_you_account}</Text>
                    <View  style={[styles.input, globalState.error?
                        {borderColor: ColorList.errorColor,}:{}]}>
                        <Ionicons style={{...GState.defaultIconSize,alignSelf: 'center',margin: 2,}} name="md-code" />
                        <Input
                            placeholder={
                                !globalState.error
                                    ? Texts.enter_verification_code
                                    : Texts.invalide_verification_code
                            }
                            keyboardType="number-pad"
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="go"
                            inverse
                            last
                            onChangeText={value => this.onChangedCode(value)}
                        />
                        {!globalState.error  ? (
                            <Text />
                        ) : (
                                <TouchableOpacity style={{ ...styles.close_button }} onPress={this.removeError.bind(this)} >
                                <Ionicons
                                style={{...GState.defaultIconSize,fontSize: 15,}}
                                    name="ios-close-circle"
                                    style={{ color: ColorList.errorColor }}
                                />
                            </TouchableOpacity>
                            )}
                    </View>
                    {!this.state.loading?<CreateButton
                    title={Texts.ok}
                    action={this.verifyNumber.bind(this)}
                    >
                    </CreateButton> : <Spinner />}
                </View>
        );
    }
}