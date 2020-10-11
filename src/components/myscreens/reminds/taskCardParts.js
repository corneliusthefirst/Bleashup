
import React from "react"
import { View, Text, TouchableOpacity } from 'react-native';
import { writeDateTime } from '../../../services/datesWriter';
import ColorList from '../../colorList';
import TextContent from '../eventChat/TextContent';
import GState from '../../../stores/globalState/index';
import { createOpenLink } from 'react-native-open-maps';
import Texts from '../../../meta/text';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MedaiView from '../event/createEvent/components/MediaView';
import shadower from '../../shadower';
import CreateButton from '../event/createEvent/components/ActionButton';
import Creator from './Creator';
import rounder from "../../../services/rounder";
import replies from '../eventChat/reply_extern';
import stores from "../../../stores";


export function remindTime() {
    return <View
        style={{
            justifyContent: "space-between",
            flexDirection: "row",
        }}
    >
        <View style={{ width: "95%" }}>
            <Text
                style={{
                    width: "100%",
                    fontWeight: "300",
                    fontSize: 14,
                    color: ColorList.bodySubtext,
                    color: this.dateDiff > 0
                        ? ColorList.bodySubtext
                        : ColorList.iconActive,
                    alignSelf: "flex-end",
                }}
            >{`${writeDateTime(this.actualInterval)
                .replace("Starting", this.isLastInterval ? "Ends" : "Due")
                .replace("Ended", "Past")
                .replace("Started", "Past")}`}</Text>
        </View>
    </View>

}
function openLink(link) {
    let Query = { query: link };
    createOpenLink({ ...Query, zoom: 50 })();
}

export function remindLocation() {
    this.item = this.props.item || this.item
    return this.item.location ? (
        <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() =>
                    requestAnimationFrame(() => openLink(this.item.location))
                }
            >
                <Text
                    style={{ ...GState.defaultTextStyle, fontWeight: "bold" }}
                >
                    {`${Texts.venue}: `}
                </Text>
                <TextContent
                    onPress={() => openLink(this.item.location)}
                    searchString={this.props.searchString}

                    style={{
                        ...GState.defaultTextStyle,
                        textDecorationLine: "underline"
                    }}>
                    {this.item.location}
                </TextContent>
            </TouchableOpacity>
        </View>
    ) : null
}

export function remindTitle() {
    this.item = this.props.item || this.item
    return <View style={{ flexDirection: "row" }}>
        <View>
            <TextContent
                tags={this.item.extra && this.item.extra.tags}
                searchString={this.props.searchString}
                ellipsizeMode={"tail"}
                numberOfLines={7}
                style={{
                    ...GState.defaultTextStyle,
                    fontWeight: "500",
                    marginBottom: "1%",
                    fontSize: 17,
                    color: ColorList.bodyText,
                    textTransform: "capitalize",
                }}
            >
                {this.item.title}
            </TextContent>
        </View>
    </View>
}
function updateURL(aid,data){
    stores.Reminds.updateURL(aid,data)
}
export function remindMedia() {
    this.item = this.props.item || this.item
    return this.item.remind_url &&
        (this.item.remind_url.photo ||
            this.item.remind_url.video ||
            this.item.remind_url.source) ? (
            <MedaiView
                data={{ remind_id: this.item.id }}
                activity_id={this.item.event_id}
                updateSource={updateURL}
                height={ColorList.containerHeight * 0.39}
                width={"100%"}
                url={this.item.remind_url}
                showItem={this.showMedia.bind(this)}
            ></MedaiView>
        ) : null
}

export function remindDescription() {
    this.item = this.item || this.props.item
    return this.item.description ? <View
        style={{
            flexDirection: "row",
        }}
    >
        <TextContent
            tags={this.item.extra && this.item.extra.tags}
            animate={this.props.animate}
            searchString={this.props.searchString}
            note
            style={{
                fontSize: 14,
                marginTop: "2%",
                color: ColorList.bodyText,
            }}
        >
            {this.item.description}
        </TextContent>
    </View> : null
}

export function remindMembers() {
    return this.membersCount ? <View style={{
        marginTop: "1%",
    }}>
        <TextContent
            onPress={this.showMembers.bind(this)}
            searchString={this.props.searchString}
            style={{
                color: ColorList.indicatorColor,
                fontStyle: 'italic',
                //fontWeight: 'bold',
                fontSize: 12,
            }}>
            {this.membersCount}
        </TextContent>
    </View> : null
}

export function remindTimeDetail() {
    return <TextContent style={{
        fontSize: 12,
        marginRight: '2%',
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: ColorList.darkGrayText
    }}>
        {this.remindTimeDetails}
    </TextContent>
}

export function remindActons() {
    return !this.member ? (
        this.cannotAssign ? null : (
            <CreateButton
                title={Texts.assign_me}
                style={{
                    borderWidth: 0,
                    borderRadius: 10,
                    maxWidth: 135,
                    alignSelf: "flex-end",
                    height: 35,
                    alignItems: "center",
                    justifyContent: "center",
                    ...shadower(1),
                    backgroundColor: ColorList.bodyDarkWhite,
                }}
                action={this.assignToMe.bind(this)}
            ></CreateButton>
        )
    ) : this.hasDoneForThisInterval ? (
        this.status ? (
            <TouchableOpacity onPress={() => {
                requestAnimationFrame(() => {
                    this.showMembers(replies.confirmed)
                })
            }} style={{
                ...rounder(40, ColorList.bodyDarkWhite),
                justifyContent: 'center',
            }}>
                <MaterialCommunityIcons
                    type="MaterialCommunityIcons"
                    name="check-all"
                    style={{
                        ...GState.defaultIconSize,
                        color: "#54F5CA",
                    }}
                ></MaterialCommunityIcons>
            </TouchableOpacity>
        ) : (
                <TouchableOpacity
                    onPress={() => {
                        requestAnimationFrame(() => {
                            this.showMembers(replies.done)
                        })
                    }} style={{
                        ...rounder(40, ColorList.bodyDarkWhite),
                        justifyContent: 'center',
                    }}
                >
                    <AntDesign
                        type="AntDesign"
                        name="check"
                        style={{
                            ...GState.defaultIconSize,
                            color: ColorList.indicatorColor,
                        }}
                    ></AntDesign>
                </TouchableOpacity>
            )
    ) : this.missed ? null :
                this.canBeDone ? (
                    <CreateButton
                        style={{
                            borderRadius: 10,
                            alignSelf: "flex-end",
                            ...shadower(3),
                            borderWidth: 0,
                            backgroundColor: ColorList.bodyDarkWhite,
                            width: 70,
                            alignItems: "center",
                            justifyContent: "center",
                            height: 35,
                        }}
                        title={Texts.done}
                        action={this.onDone.bind(this)}
                    ></CreateButton>
                ) : null
}

export function remindCreator() {
    this.item = this.props.item || this.item
    return <View
        style={{
            alignItems: "flex-start",
            padding: 2,
        }}
    >
        <Creator
            creator={this.item.creator}
            created_at={this.item.created_at}
        ></Creator>
    </View>
}

export function UnAssignAction() {
    return this.member ? <View style={{
        marginTop: "2%",
        marginBottom: "2%",
        marginLeft: "1%",
    }}>
        <CreateButton
            title={Texts.un_assign_to_me}
            style={{
                borderWidth: 0,
                borderRadius: 10,
                width: 135,
                alignSelf: "flex-end",
                height: 35,
                color: ColorList.bodyBackground,
                alignItems: "center",
                justifyContent: "center",
                ...shadower(3),
                backgroundColor: "orange",
            }}
            action={this.unAssignToMe.bind(this)}
        ></CreateButton>
    </View> : null
}