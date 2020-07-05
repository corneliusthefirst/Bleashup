/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
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
        super(props);
        this.state = {};
    }
    render(){
        return <View>
            <View
                style={{
                    ...bleashupHeaderStyle,
                    width: '100%',
                    height: ColorList.headerHeight,
                    backgroundColor: ColorList.headerBackground,
                    flexDirection: 'row',
                }}
            >
                 <View
                    style={{
                        flex:1,
                        height: ColorList.headerHeight,
                        flexDirection: 'row',
                        alignSelf: 'flex-start',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity style={{
                        width: '20%',
                        alignItems: 'center',
                    }} onPress={() => requestAnimationFrame(() => this.props.goback())} >
                        <Icon
                            style={{
                                color: ColorList.headerIcon,
                                //marginLeft: '5%',
                            }}
                            type={'MaterialIcons'}
                            name={'arrow-back'}
                         />
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
                        <View style={{ height: 10, position: 'absolute' }}>
                            {this.props.typing && <TypingIndicator />}
                        </View>
                    </View>

                    {
                        //!! you can add the member last seen here if the room has just one member */
                    }
                </View>

                <View
                    style={{
                        width: 90,
                        paddingRight:15,
                        alignSelf:'flex-end',
                        alignItems: 'center',
                        flexDirection:'row',
                        justifyContent:'space-between',
                        height: 50,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            requestAnimationFrame(() => this.props.openMenu());
                        }}
                        style={{
                            height: ColorList.headerHeight,
                            justifyContent: 'center',
                        }}
                    >
                        <Icon
                            style={{ color: ColorList.likeActive, fontSize: 25 }}
                            type={'Entypo'}
                            name={'phone'}
                         />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            requestAnimationFrame(() => this.props.openMenu());
                        }}
                        style={{
                            height: ColorList.headerHeight,
                            justifyContent: 'center',
                        }}
                    >
                        <Icon
                            style={{ color: ColorList.headerIcon, fontSize: 30 }}
                            type={'Ionicons'}
                            name={'ios-menu'}
                         />
                    </TouchableOpacity>

                </View>

            </View>
        </View>;
    }
}


                    /*<View style={{ height: ColorList.headerHeight, marginLeft: "10%" }}>
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
                        </View>*/

                    /*<View style={{ height: ColorList.headerHeight }}>
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
                         />
                    </View>*/
