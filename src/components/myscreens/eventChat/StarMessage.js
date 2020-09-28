import BeComponent from '../../BeComponent';
import  React  from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import GState from '../../../stores/globalState';
import ColorList from '../../colorList';
import Texts from '../../../meta/text';
import TextContent from './TextContent';
import  AntDesign  from 'react-native-vector-icons/AntDesign';
export default class StarMessage extends BeComponent {
    constructor(props) {
        super(props)
    }
    render() {
        let remind_date = this.props.message.remind_date
        let text = this.props.message.text
        let tags = this.props.message.tags
        return <TouchableOpacity onPress={this.props.onPress} style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            minHeight: 100,
            minWidth: 150,
            margin: '1%',
        }}>
            <View style={{
                alignSelf: 'center',
            }}>
                <AntDesign
                name={"star"}
                    style={{
                        ...GState.defaultIconSize,
                        color: ColorList.post,
                        fontSize: 60,
                    }}
                ></AntDesign>
            </View>
            <View>
                <TextContent
                    tags={tags}
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