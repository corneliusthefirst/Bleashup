import React from "react";
import BleashupModal from "../../mainComponents/BleashupModal";
import { View, TouchableOpacity, Clipboard, Linking,ScrollView } from "react-native";
import Fontisto from "react-native-vector-icons/Fontisto";
import Ionicons from "react-native-vector-icons/Ionicons";
import rounder from "../../../services/rounder";
import ColorList from "../../colorList";
import GState from "../../../stores/globalState";
import shadower from "../../shadower";
import TextContent from "../eventChat/TextContent";
import Vibrator from "../../../services/Vibrator";
import Toaster from "../../../services/Toaster";
import { copyText } from "../eventChat/services";
import QRDisplayer from "../QR/QRCodeDisplayer";

export default class ShareAsLink extends BleashupModal {
    initialize() { }
    iconContainerStyle = {
        ...rounder(50, ColorList.bodyDarkWhite),
        marginHorizontal: "1%",
        justifyContent: "center",
    };
    onClosedModal() {
        this.props.onClosed();
    }
    iconStyle = { ...GState.defaultIconSize, color: ColorList.indicatorColor };
    modalHeight = 350;
    borderTopLeftRadius = 20;
    modalMinHieight = 90;
    borderTopRightRadius = 20;
    position = "center";
    entry = "top";
    modalWidth = "80%";
    borderRadius = 20;
    copy() {
        copyText(this.props.link);
        //this.onClosedModal();
    }
    share() {
        this.props.share(this.props.link);
    }
    openLink() {
        Linking.openURL(this.props.link);
        this.onClosedModal();
    }
    modalBody() {
        return (
            <ScrollView
                style={{
                    margin: "3%",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    <TouchableOpacity
                        onPress={this.share.bind(this)}
                        style={this.iconContainerStyle}
                    >
                        <Fontisto name={"share"} style={this.iconStyle}></Fontisto>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={this.iconContainerStyle}
                        onPress={this.copy.bind(this)}
                    >
                        <Ionicons style={this.iconStyle} name={"ios-copy"}></Ionicons>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.openLink.bind(this)}
                        style={this.iconContainerStyle}
                    >
                        <Ionicons style={this.iconStyle} name={"ios-open"}></Ionicons>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        backgroundColor: ColorList.bodyBackground,
                        ...shadower(1),
                        textAlign: "center",
                        flexDirection: "row",
                        marginTop: "5%",
                        width: "100%",
                        minHeight: 30,
                        justifyContent: "center",
                        borderRadius: 20,
                    }}
                >
                    <TextContent
                        style={{
                            textAlign: "center",
                            alignSelf: "center",
                            margin: "1%",
                            ...GState.defaultTextStyle,
                            fontSize: 16,
                        }}
                    >
                        {this.props.link}
                    </TextContent>
                </View>
                {this.props.qrCode && this.props.qrTitle ? <View style={{
                    marginTop: 10,
                    alignSelf: 'center',
                }}>
                    <QRDisplayer
                        code={this.props.qrCode}
                        title={this.props.qrTitle}
                    ></QRDisplayer>
                </View> : null}
            </ScrollView>
        );
    }
}
