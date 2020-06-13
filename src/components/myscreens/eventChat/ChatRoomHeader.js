import React, { PureComponent } from 'react';
import { View, TouchableOpacity  } from 'react-native';
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
import ColorList from '../../colorList';
import { Icon, Text } from 'native-base';
import TypingIndicator from './TypingIndicator';
import ChatRoomPlus from './ChatRoomPlus';
import ChatroomMenu from './ChatroomMenu';

export default class ChatRoomHeader extends PureComponent {
    constructor(props){
        super(props)
        this.state = {}
    }
    render(){
        return <View>
            <View
                style={{
                    ...bleashupHeaderStyle,
                    width: ColorList.containerWidth,
                    height: ColorList.headerHeight,
                    backgroundColor: ColorList.headerBackground,
                    flexDirection: "row",
                }}
            >
                <View
                    style={{
                        width: "65%",
                        height: ColorList.headerHeight,
                        flexDirection: "row",
                        alignSelf: "flex-start",
                        alignItems: "center",
                    }}
                >
                    <TouchableOpacity style={{
                        width: "20%",
                        alignItems: 'flex-start',
                    }} onPress={() => requestAnimationFrame(() => this.props.goback())} >
                        <Icon
                            style={{
                                color: ColorList.headerIcon,
                                marginLeft: "13%",
                            }}
                            type={"MaterialIcons"}
                            name={"arrow-back"}
                        ></Icon>
                    </TouchableOpacity>
                    <View>
                        <Text
                            style={{
                                alignSelf: 'center',
                                color: ColorList.headerText,
                                fontSize: ColorList.headerFontSize,
                                fontWeight: ColorList.headerFontweight,
                            }}
                        >
                            {this.props.roomID === this.props.activity_id ? this.props.activity_name : this.props.roomName}
                        </Text>
                        <View style={{ height: 10, position: "absolute" }}>
                            {this.props.typing && <TypingIndicator></TypingIndicator>}
                        </View>
                    </View>

                    {
                        //!! you can add the member last seen here if the room has just one member */
                    }
                </View>

                <View
                    style={{
                        width: "35%",
                        flexDirection: "row",
                        alignSelf: "flex-end",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: 50,
                    }}
                >
                    <View style={{ height: ColorList.headerHeight, marginLeft: "10%" }}>
                        <ChatRoomPlus
                            computedMaster={this.props.computedMaster}
                            master={this.props.master}
                            eventID={this.props.activity_id}
                            roomID={this.props.firebaseRoom}
                            public={this.props.public_state}
                            addAudio={() => {
                                this.props.openAudioPicker();
                                this.props.markAsRead();
                            }}
                            addFile={() => this.props.openFilePicker()}
                            showVote={() => this.props.openVoteCreation()}
                            showReminds={() => {
                                this.props.addRemind(this.props.members);
                            }}
                            addPhotos={() => this.props.openPhotoSelector()}
                            addMembers={() => this.props.addMembers()}
                        ></ChatRoomPlus>
                    </View>
                    <View style={{ height: ColorList.headerHeight }}>
                        <ChatroomMenu
                            showMembers={() => this.props.showMembers()}
                            addMembers={() => this.props.addMembers()}
                            closeCommitee={() => this.props.close()}
                            openCommitee={() => this.props.open()}
                            leaveCommitee={() => this.props.leave()}
                            showRoomMedia={() => this.props.showRoomMedia()}
                            removeMembers={() => this.props.removeMembers()}
                            publishCommitee={() => this.props.publish()}
                            master={this.props.master}
                            eventID={this.props.activity_id}
                            roomID={this.props.firebaseRoom}
                            public={this.props.public_state}
                            opened={this.props.opened}
                            settings={this.props.activity_id === this.props.roomID ? this.props.openSettings : this.props.editCommitteeName}
                        ></ChatroomMenu>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            requestAnimationFrame(() => this.props.openMenu())
                        }}
                        style={{
                            height: ColorList.headerHeight,
                            justifyContent: "center",
                            marginRight: "10%",
                        }}
                    >
                        <Icon
                            style={{ color: ColorList.headerIcon, fontSize: 35 }}
                            type={"Ionicons"}
                            name={"ios-menu"}
                        ></Icon>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    }
}