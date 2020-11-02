/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
import ColorList from '../../colorList';
import TypingIndicator from './TypingIndicator';
import ChatRoomPlus from './ChatRoomPlus';
import ChatroomMenu from './ChatroomMenu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GState from '../../../stores/globalState';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BePureComponent from '../../BePureComponent';
import onlinePart from './parts/onlineParts';
import { checkUserOnlineStatus } from './services';
import Searcher from '../Contacts/Searcher';
import rounder from '../../../services/rounder';
import searchToolsParts from './searchToolsPart';
import CacheImages from '../../CacheImages';
import testForURL from '../../../services/testForURL';
import shadower from '../../shadower';
import TextContent from './TextContent';
import BeComponent from '../../BeComponent';
import Texts from '../../../meta/text';

export default class ChatRoomHeader extends BeComponent {
    constructor(props) {
        super(props);
        this.state = {
            last_seen: Texts.years_ago
        };
        this.searchToolsParts = searchToolsParts.bind(this)
        this.pushUp = this.props.pushUp
        this.pushDown = this.props.pushDown
        this.props.isRelation ? this.onlinePart = onlinePart.bind(this) : null
        this.props.isRelation && !this.checkUseOnlineStatus ?
            this.checkUseOnlineStatus = checkUserOnlineStatus.bind(this) : null
    }
    componentDidMount() {
        if (this.props.isRelation) {
            this.checkUseOnlineStatus(this.props.oponent, this.checker, (checker) => {
                this.checker = checker
            })
        }
    }
    unmountingComponent() {
        if (this.props.isRelation) {
            clearInterval(this.checker)
            this.checker = null
        }
    }
    color = ColorList.colorArray[Math.floor(Math.random() * (ColorList.colorArray.length - 1))]
    render() {
        return <View>
            <View
                style={{
                    ...bleashupHeaderStyle,
                    width: '100%',
                    height: ColorList.headerHeight,
                    backgroundColor: ColorList.headerBackground,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                }}
            >
                <TouchableOpacity style={{
                    width: '10%',
                    alignItems: 'center',
                }} onPress={() => requestAnimationFrame(() => this.props.goback())} >
                    <MaterialIcons
                        style={{
                            ...GState.defaultIconSize,
                            color: ColorList.headerIcon,
                            //marginLeft: '5%',
                        }}
                        type={'MaterialIcons'}
                        name={'arrow-back'}
                    />
                </TouchableOpacity>
                {this.props.searching ? null : <TouchableOpacity
                    style={{
                        ...shadower(),
                        marginHorizontal: '1%',
                        ...rounder(35, ColorList.indicatorColor),
                        justifyContent: 'center',
                    }}
                    onPress={() =>
                        requestAnimationFrame(this.props.showActivityPhotoAction)
                    }
                >
                    {testForURL(this.props.background) ? (
                        <CacheImages
                            style={{
                                ...rounder(30, ColorList.indicatorColor),
                            }}
                            thumbnails
                            source={{ uri: this.props.background }}
                        ></CacheImages>
                    ) : (
                            <View
                                resizeMode={"cover"}
                                style={{ ...rounder(30,this.color),
                                }}
                                source={this.props.isRelation ? GState.profilePlaceHolder : GState.activity_place_holder}
                            >
                            <MaterialIcons
                            style={{
                                ...GState.defaultIconSize,
                                color:ColorList.bodyBackground,
                                        fontSize: 22,
                            }}
                            name={'chat-bubble'}
                            >
                            </MaterialIcons>
                            </View>
                        )}
                </TouchableOpacity>}
                {this.props.searching ? null : <TouchableOpacity onPress={() => {
                   !this.props.isRelation && requestAnimationFrame(this.props.openSettings)
                }} style={{
                    flexDirection: 'column',
                    flex: 1,
                    alignItems: 'flex-start',
                }}>
                    <View>
                        <TextContent
                            numberOfLines={1}
                            onPress={!this.props.isRelation && this.props.openSettings}
                            style={{
                                alignSelf: 'center',
                                color: ColorList.headerText,
                                fontSize: ColorList.headerFontSize,
                                fontWeight: ColorList.headerFontweight,
                            }}
                        >
                            {this.props.roomID === this.props.activity_id ? this.props.activity_name : this.props.roomName}
                        </TextContent>
                        <View style={{ height: 10, position: 'absolute' }}>
                            {this.props.typing ? <TypingIndicator /> : null}
                        </View>
                    </View>
                    <View>
                        {this.onlinePart && this.onlinePart()}
                    </View>
                </TouchableOpacity>}
                <View style={{
                    marginHorizontal: '1%',
                    flex: this.props.searching ? 1 : null,
                    width: this.props.searching ? null : 35,
                    height: 35,
                    justifyContent: 'center',
                    alignSelf: 'center',
                }}>
                    <Searcher
                        startSearching={this.props.startSearching}
                        cancelSearch={this.props.cancelSearch}
                        searchString={this.props.searchString}
                        search={this.props.search}
                        searching={this.props.searching}
                    >
                    </Searcher>
                </View>
                {this.props.searching && this.props.searchResult && this.props.searchResult.length > 0 ?
                    this.searchToolsParts() :
                    <View
                        style={{
                            width: 40,
                            alignSelf: 'flex-end',
                            alignItems: 'center',
                            flexDirection: 'row',
                            paddingHorizontal: 10,
                            justifyContent: 'flex-end',
                            height: 50,
                        }}
                    >
                        <ChatroomMenu
                            openDescription={this.props.openDescription}
                            activity_id={this.props.activity_id}
                            getShareLink={this.props.getShareLink}
                            isRelation={this.props.isRelation}
                            openPage={this.props.openPage}
                            settings={this.props.openSettings}
                        >
                        </ChatroomMenu>
                    </View>}

            </View>
        </View>;
    }
}

