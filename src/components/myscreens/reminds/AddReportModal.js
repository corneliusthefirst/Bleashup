
import React, { Component } from 'react';

import { Text, View, Dimensions, Keyboard, ScrollView, Textarea, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modalbox';
import ColorList from '../../colorList';
import CreateTextInput from '../event/createEvent/components/CreateTextInput';
import BleashupModal from '../../mainComponents/BleashupModal';
import GState from '../../../stores/globalState';
import Entypo from 'react-native-vector-icons/Entypo';
import Toaster from '../../../services/Toaster';
import Texts from '../../../meta/text';
import PickersUpload from '../event/createEvent/components/PickerUpload';
import MediaPreviewer from '../event/createEvent/components/MediaPeviewer';

let { height, width } = Dimensions.get('window');

export default class AddReport extends BleashupModal {
    initialize() {
        this.state = {
            description: ''
        }
        this.saveURL = this.saveURL.bind(this)
        this.cleanMedia = this.cleanMedia.bind(this)
    }
    saveURL(url) {
        this.setStatePure({
            url
        })
    }
    state = {

    }
    report() {
        this.props.report(this.state.description)
        //Keyboard.dismiss()
    }
    onChangedEventDescription(value) {
        this.setStatePure({ description: value })
    }
    onOpenModal() {
        this.setStatePure({
            description: this.props.currentReport || this.state.description,
            url: this.props.currentReportURL || this.state.url
        })
    }
    onClosedModal() {
        this.props.onClosed(this.state.description)
    }
    cleanMedia() {
        this.refs.picker &&
            this.refs.picker.cleanMedia &&
            this.refs.picker.cleanMedia()
    }
    swipeToClose = false
    modalHeight = 300
    modalWidth = "90%"
    borderTopLeftRadius = 8
    borderTopRightRadius = 8
    position = "bottom"
    entry = "bottom"
    modalBody() {
        let canShowURL = this.state.url && (
            this.state.url.photo ||
            this.state.url.video ||
            this.state.url.source
        )
        let canEdit = (this.state.description &&
            this.state.description !== this.props.currentReport) ||
            (this.state.url && (this.state.url.photo !== this.props.currentReportURL.photo ||
                 this.props.currentReportURL.video 
                !== this.state.url.video ||
                 this.props.currentReportURL.source !== this.state.url.source))
        return (
            <ScrollView keyboardShouldPersistTaps={"handled"}
                nestedScrollEnabled showsVerticalScrollIndicator={false} style={{ flex: 1, flexDirection: "column" }}>
                <PickersUpload
                    ref={"picker"}
                    currentURL={this.state.url}

                    notInternet saveMedia={this.saveURL}></PickersUpload>
                <View style={{ width: '98%', alignSelf: 'center', margin: 'auto', }}>
                    {canShowURL ? <MediaPreviewer
                        data={{ id: this.state.url && this.state.url.id + "_creating" }}
                        updateSource={this.saveURL}
                        cleanMedia={this.cleanMedia}
                        url={this.state.url}
                        height={200}
                    >}
                </MediaPreviewer> : null}
                </View>
                <View style={{ 
                    height: 155, 
                    width: "95%", 
                    alignSelf: 'center', 
                }}>
                    <CreateTextInput
                        height={150}
                        multiline
                        placeholder={Texts.add_report}
                        value={this.state.description} keyboardType="default"
                        onChange={(value) => this.onChangedEventDescription(value)} />

                </View>
                { canEdit ?
                    <View style={{
                        width: width / 4,
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        alignSelf: 'flex-end',
                        marginRight: "1%"
                    }} >
                        <TouchableOpacity onPress={() => this.props.report(this.state.description, this.state.url)} style={{
                            borderRadius: 8,
                            borderWidth: 1, marginRight: "2%", backgroundColor: ColorList.bodyBackground,
                            borderColor: ColorList.bodyIcon, alignSelf: 'flex-end',
                            width: 90, height: 40, justifyContent: "center"
                        }}>
                            <Text style={{ 
                                ...GState.defaultTextStyle, 
                                color: ColorList.bodyIcon, 
                                marginRight: "auto", 
                                marginLeft: "auto", 
                            }}>{Texts.report}</Text>
                        </TouchableOpacity>
                    </View> : null}
            </ScrollView>)
    }
}