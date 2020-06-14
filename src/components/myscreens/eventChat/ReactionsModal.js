import React from "react";

import BleashupModal from "../../mainComponents/BleashupModal";
import { View, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from "react-native";
import CreationHeader from "../event/createEvent/components/CreationHeader";
import { Icon, Text } from "native-base";
import ColorList from "../../colorList";
import shadower from "../../shadower";
import rounder from '../../../services/rounder';

export default class ReactionModal extends BleashupModal {
    coverScreen = false;
    modalHeight = 45;
    position = "top";
    jusify = true
    modalBackground = "rgba(34, 0, 0, 0.1)";
    borderRadius = this.borderTopLeftRadius;
    modalWidth = 300;
    backdropOpacity = 0.01;
    onClosedModal() {
        this.props.onClosed();
    }
    reactionStyle = {
        fontSize: 34,
        textAlign: "center",
    };
    reactions = [
        "👍",
        "❤",
        "💕",
        "😍",
        "😎",
        "😀",
        "🤣",
        "💪",
        "🤝",
        "👌",
        "💯",
        "🤙",
        "😱",
        "😡",
        "💃",
        "♨",
        "🎪",
        "🌛",
    ];
    renderReactions() {
        return this.reactions.map((ele) => (
            <TouchableOpacity
                onPress={() => requestAnimationFrame(() => {
                    this.props.react(ele)
                    this.props.onClosed()
                })}
                style={{
                    ...rounder(40),
                    backgroundColor: ColorList.bodyBackground,
                }}
            >
                <Text style={{ ...this.reactionStyle }}>{ele}</Text>
            </TouchableOpacity>
        ));
    }
    modalBody() {
        return (
            <TouchableWithoutFeedback onPressIn={this.props.pressingIn}>
                <View
                    style={{
                        flexDirection: "row-reverse",
                        marginRight: "1%",
                        justifyContent: "space-between",
                        marginLeft: '1%', marginRight: '1%',
                    }}
                >
                    <View
                        style={{
                            width: "15%",
                            margin: "auto",
                            justifyContent: "center",
                            borderRadius: this.borderRadius,
                            backgroundColor: ColorList.indicatorInverted,
                            height: "100%",
                        }}
                    >
                        <View
                            style={{
                                ...rounder(30),
                                backgroundColor: ColorList.indicatorColor,
                                alignSelf: "center",
                            }}
                        >
                            <Icon
                                onPress={this.onClosedModal.bind(this)}
                                type={"EvilIcons"}
                                name={"close"}
                                style={{ margin: "auto", color: ColorList.bodyBackground }}
                            ></Icon>
                        </View>
                    </View>
                    <View style={{ width: "80%" }}>
                        <ScrollView keyboardShouldPersistTaps={'handled'}
                            horizontal showsHorizontalScrollIndicator={false}>
                            <View style={{ width: "100%", flexDirection: "row" }}>
                                {this.renderReactions()}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
