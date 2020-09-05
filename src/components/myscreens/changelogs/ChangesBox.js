import React, { Component } from "react"
import { View, TouchableOpacity, Text } from 'react-native';
import CacheImages from '../../CacheImages';
import testForURL from '../../../services/testForURL';
import stores from '../../../stores';
import shadower from "../../shadower";
import ChangeBoxMenu from "./ChangeBoxMenu";
import ProfileSimple from "../currentevents/components/ProfileViewSimple";
import GState from '../../../stores/globalState/index';
import colorList from '../../colorList';
import replies from '../eventChat/reply_extern';
import AnimatedComponent from '../../AnimatedComponent';
import Swipeout from '../eventChat/Swipeout';


export default class ChangeBox extends AnimatedComponent {
    initialize(){
        this.state = {
            loaded: true,
            newThing: false,
            changer: typeof this.props.change.updater === 'string' ?
            stores.TemporalUsersStore.Users[this.props.change.updater]:
            this.props.change.updater
        }
    }
    state = {
        changer: typeof this.props.change.updater === 'string' ?
            stores.TemporalUsersStore.Users[this.props.change.updater] :
            this.props.change.updater
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.newThing !== nextState.newThing
    }
   mention(changer){
       this.props.mention({...this.props.change},changer)
   }
    containerStyle = { margin: '1%', borderRadius: 5, backgroundColor: colorList.bodyBackground, ...shadower(2), }
    render() {
        return <Swipeout disabled={false} onLongPress={() => this.props.onLongPress(this.state.changer)} swipeRight={() => {
                this.mention(this.state.changer)
            }}>
                <View onLayout={(e) => this.props.takeNewLayout(e.nativeEvent.layout)} style={this.containerStyle}>
                    {!this.props.change ? null : <View style={{ flexDirection: 'column', margin: '1%', }}>
                        <View style={{ flexDirection: 'row', maxHeight: 20,marginLeft: "-5%", }}>
                            <View style={{ width: '97%', height: '100%', justifyContent: 'space-between', }}>
                                <View style={{ width: "100%", height: '100%', }}><ProfileSimple hidePhoto showPhoto={(url) => {
                                    this.props.showPhoto(url)
                                }} delay={this.props.delayer}
                                    profile={this.state.changer||{}}>
                                </ProfileSimple></View>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                        }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Text ellipsizeMode='tail' style={{ fontSize: 14, fontWeight: "800", color: colorList.bodyText }}
                                    numberOfLines={2}>{this.props.change.changed}</Text>
                            </View>
                            <Text ellipsizeMode='tail' style={{ fontSize: 13, color: '#555756', fontStyle: 'italic', }}
                                numberOfLines={2}>{typeof this.props.change.new_value.new_value === "string"
                                    && !testForURL(this.props.change.new_value.new_value, true) ? this.props.change.new_value.new_value : ""}</Text>
                        </View>
                    </View>}
                </View>
            </Swipeout>
    }
}