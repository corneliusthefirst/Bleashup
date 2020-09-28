import BeComponent from '../../BeComponent';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import GState from '../../../stores/globalState';
import ColorList from '../../colorList';
import Texts from '../../../meta/text';
import TextContent from './TextContent';
import moment from 'moment';

export default class RemindMessage extends BeComponent {
    constructor(props) {
        super(props)
    }
    isPast(date) {
        let currentDate = moment().format("x")
        let remindDate = moment(date).format("x")
        return currentDate > remindDate
    }
    render() {
        let remind_date = this.props.message.remind_date
        let enddate = this.props.message.end_date || moment().format()
        let text = this.props.message.text
        let tags = this.props.message.tags
        tags = tags && tags.length > 0 ? tags : null
        return <TouchableOpacity
            onPress={this.props.onPress}
            style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                margin: '1%',
            }}>
            <View style={{
                alignSelf: 'center',
            }}>
                <Entypo
                    name={"bell"}
                    style={{
                        ...GState.defaultIconSize,
                        color: ColorList.reminds,
                        fontSize: 60,
                    }}
                ></Entypo>
            </View>
            <View>
                <TextContent
                    onPress={this.props.onPress}
                    searchString={this.props.searchString}
                    foundString={this.props.foundString}
                    style={{
                        ...GState.defaultTextStyle,
                        color: this.isPast(remind_date) ? ColorList.darkGrayText : ColorList.indicatorColor
                    }}>
                    {`${this.isPast(remind_date) ? Texts.started : Texts.deu} ${moment(remind_date).calendar()}`}
                </TextContent>
            </View>
            <View>
                <TextContent
                    onPress={this.props.onPress}
                    searchString={this.props.searchString}
                    foundString={this.props.foundString}
                    style={{
                        ...GState.defaultTextStyle,
                        color: this.isPast(enddate) ? ColorList.darkGrayText : ColorList.indicatorColor
                    }}>
                    {`${this.isPast(enddate) ? Texts.past_since : Texts.ends} ${moment(enddate).calendar()}`}
                </TextContent>
            </View>
            <View>
                <TextContent
                    tags={tags}
                    onPress={this.props.onPress}
                    numberOfLines={5}
                    searchString={this.props.searchString}
                    foundString={this.props.foundString}
                >
                    {text}
                </TextContent>
            </View>
        </TouchableOpacity>
    }
}