import React, { Component } from "react"
import { View, TouchableOpacity } from 'react-native';
import CacheImages from '../../CacheImages';
import TextContent from './TextContent';
import testForURL from '../../../services/testForURL';
import active_types from './activity_types';
import ColorList from '../../colorList';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Texts from '../../../meta/text';
import shadower from "../../shadower";
import GState from "../../../stores/globalState";
import { observer } from "mobx-react";
import stores from "../../../stores";

@observer class RelationMessage extends Component {
    constructor(props) {
        super(props)
        this.press = this.press.bind(this)
    }
    iconStyle = {
        fontSize: 13,
        color: ColorList.indicatorColor
    }
    choseIcon() {
        switch (this.props.message.relation_type) {
            case active_types.activity:
                return <AntDesign name={"addusergroup"} style={this.iconStyle} />
            default:
                return <AntDesign name={"user"} style={this.iconStyle}></AntDesign>
        }
    }
    choseText() {
        switch (this.props.message.relation_type) {
            case active_types.activity:
                return Texts.activity
            default:
                return Texts.contacts
        }
    }
    press(){
        requestAnimationFrame(() => this.props.onPress({
            type: this.props.message.relation_type,
            item: this.props.message.item
        }))
    }
    isRelation(){
        const message = this.props.message
      return message && message.relation_type == active_types.activity
    }
    userExist(){
        return stores.TemporalUsersStore.Users[this.props.message.item]
    }
    render() {
        this.photo = this.props.message.source
        this.name = this.props.message.name
        if (this.isRelation() && this.userExist()){
            const user = stores.TemporalUsersStore.Users[this.props.message.item]
            this.photo =  user.profile
            this.name = user.nickname 
        }
        return <View style={{
            marginVertical: '1%',
            flex: this.props.compose ? null : 1,
            //width: "100%",
            minWidth: 200,
        }}><TouchableOpacity onPress={this.press.bind(this)} style={{
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            backgroundColor: ColorList.bottunerLighter,
        }} >
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',

                }}>
                    <View style={{ marginHorizontal: '1%', }}>{this.choseIcon()}</View>
                    <View><TextContent onPress={this.press} numberOfLines={1} style={{
                        color: ColorList.indicatorColor,
                        fontSize: 13,
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                    }}>{this.choseText()}</TextContent></View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    marginBottom: '2%',
                    minHeight: 50,
                    alignItems: 'center',
                    //flex: 1,
                    //width: '98%',
                    alignSelf: 'flex-start',
                }}>
                    {<CacheImages
                        style={{ marginHorizontal: '2%', }}
                        source={{ uri: this.photo }}
                        thumbnails small>
                    </CacheImages>}
                    <View><TextContent
                        onPress={this.press}
                        style={{
                            ...GState.defaultTextStyle,
                            fontWeight: 'bold',
                        }}
                        numberOfLines={1}
                        searchString={this.props.searchString}
                        foundString={this.props.foundString}
                        tags={this.props.message.tags}
                    >
                        {this.name}
                    </TextContent></View></View>
            </TouchableOpacity>
            {this.props.message.text ?
                <TextContent
                    onPress={this.press}
                    searchString={this.props.searchString}
                    foundString={this.props.foundString}
                    tags={this.props.message.tags}
                >{this.props.message.text}</TextContent> : null}
        </View>
    }
}

export default RelationMessage