/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
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

export default class ChatRoomHeader extends BePureComponent {
    constructor(props) {
        super(props);
        this.state = {
            last_see: "..."
        };
        this.props.isRelation ? this.onlinePart = onlinePart.bind(this) : null
    }
    componentMounting() {
        this.props.isRelation && !this.checkUseOnlineStatus ? this.checkUseOnlineStatus = checkUserOnlineStatus.bind(this) : null
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
                {this.props.searching ? null : <View style={{
                    flexDirection: 'column',
                    width: "60%",
                    alignItems: 'flex-start',
                }}>
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
                            {this.props.typing ? <TypingIndicator /> : null}
                        </View>
                    </View>
                    <View>
                        {this.onlinePart && this.onlinePart()}
                    </View>
                </View>}
                <View style={{
                    marginHorizontal: '1%',
                    width: this.props.searching ? "75%" : 35,
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
                <View
                    style={{
                        width: 55,
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingRight: '2%',
                        justifyContent: 'flex-end',
                        height: 50,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            requestAnimationFrame(() => this.props.openMenu());
                        }}
                        style={{
                            alignSelf: 'flex-end',
                            height: ColorList.headerHeight,
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons
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

