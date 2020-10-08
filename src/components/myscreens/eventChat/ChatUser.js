
import { observer } from "mobx-react";
import BePureComponent from '../../BePureComponent';
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import stores from "../../../stores";
import ColorList from '../../colorList';
import BeComponent from '../../BeComponent';
import TextContent from './TextContent';

@observer class ChatUser extends BeComponent {
    constructor(props) {
        super(props)
    }

    render() {
        let phone = this.props.phone && this.props.phone.replace && this.props.phone.replace("+", "00")
        let user = (phone && stores.TemporalUsersStore.Users[phone]) || {}
        let isMe = stores.LoginStore.user.phone == phone
        user = { ...user, nickname: isMe ? "You " : user.nickname }
        return <TouchableOpacity
            onPress={this.props.showProfile}
            onPressIn={this.props.onPressIn}
        >
            <TextContent
                searchString={this.props.searchString}
                onPress={this.props.showProfile}
                foundString={this.props.foundString}
                style={{
                    color: ColorList.iconActive,
                    maxWidth: 150,
                    fontWeight: "bold",
                    fontSize: 10,
                }}
                ellipsizeMode="tail"
                numberOfLines={1}
            >
                {this.props.activity_name ? `${user.nickname} @ ${this.props.activity_name}` : `${user.nickname}`}
            </TextContent>
        </TouchableOpacity>
    }
}

export default ChatUser