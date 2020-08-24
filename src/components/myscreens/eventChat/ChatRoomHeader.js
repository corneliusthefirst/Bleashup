/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Text  } from 'react-native';
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
import ColorList from '../../colorList';
import TypingIndicator from './TypingIndicator';
import ChatRoomPlus from './ChatRoomPlus';
import ChatroomMenu from './ChatroomMenu';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import GState from '../../../stores/globalState';
import Entypo  from 'react-native-vector-icons/Entypo';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import BePureComponent from '../../BePureComponent';

export default class ChatRoomHeader extends BePureComponent {
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
                            {this.props.typing ? <TypingIndicator />:null}
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
                        <Entypo
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

