import React, { Component } from "react"
import { View, TouchableOpacity } from 'react-native';
import CacheImages from '../../CacheImages';
import { Text, Icon, Spinner, Thumbnail } from "native-base";
import testForURL from '../../../services/testForURL';
import stores from '../../../stores';
import shadower from "../../shadower";
import ChangeBoxMenu from "./ChangeBoxMenu";
import ProfileSimple from "../currentevents/components/ProfileViewSimple";
import GState from '../../../stores/globalState/index';
import colorList from '../../colorList';
import replies from '../eventChat/reply_extern';


export default class ChangeBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            newThing: false
        }
    }
    state = {}
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.loaded !== nextState.loaded ||
            this.state.newThing !== nextState.newThing
    }
    componentDidMount() {
        setTimeout(() => {
            typeof this.props.change.updater === 'string' ? stores.TemporalUsersStore.getUser(this.props.change.updater).then(user => {
                this.setState({
                    loaded: true,
                    changer: user
                })
            }) :
                this.setState({
                    loaded: true,
                    changer: this.props.change.updater
                })
        }, 60 * this.props.delayer)
    }
    containerStyle = { margin: '1%', borderRadius: 3, backgroundColor: colorList.bodyBackground, ...shadower(3), }
    render() {
        return (!this.state.loaded ? <View style={{ ...this.containerStyle, width: '95%', height: 120 }}></View> :
            <View>
                <View style={this.containerStyle}>
                    {!this.props.change ? null : <View style={{ flexDirection: 'column', margin: '1%', }}>
                        <View style={{ flexDirection: 'row', maxHeight: 40,}}>
                        <View style={{ width: '93%', height: '100%',justifyContent: 'space-between', }}>
                        <View style={{width:170,height:'100%'}}><ProfileSimple showPhoto={(url) => {
                                this.props.showPhoto(url)
                            }} delay={this.props.delayer}
                                profile={this.state.changer}>
                                </ProfileSimple></View>
                        </View>
                            <View style={{ alignSelf: 'flex-end', flexDirection: 'row',alignItems:"flex-end" }}>
                                <View style={{alignSelf: 'flex-end',marginTop: 'auto',marginBottom: 'auto',}}>{!this.props.replying ? <ChangeBoxMenu
                                    reply={() => this.props.mention({
                                        id: this.props.change.id,
                                        title: `${this.props.change.changed} :\n ${this.props.change.new_value.new_value}`,
                                        type_extern: this.state.changer.nickname,
                                        new_value: this.props.change.new_value,
                                        updated: this.props.change.updated,
                                        photo: true,
                                        change_date: this.props.change.date,
                                        sourcer: this.state.changer.profile,
                                        replyer_phone: this.state.changer.phone,
                                        replyer_name: this.props.change.title

                                    })}
                                    master={this.props.master}
                                    change={this.props.change}
                                    restore={() => this.props.restore(this.props.change)}
                                ></ChangeBoxMenu> : null}</View>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                        }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Text ellipsizeMode='tail' style={{ fontSize: 14, fontWeight: "800", color:colorList.bodyText }}
                                    numberOfLines={4}>{this.props.change.changed}</Text>
                            </View>
                            <Text ellipsizeMode='tail' style={{ fontSize: 13, color: '#555756', fontStyle: 'italic', }}
                                numberOfLines={6}>{typeof this.props.change.new_value.new_value === "string"
                                    && !testForURL(this.props.change.new_value.new_value, true) ? this.props.change.new_value.new_value : ""}</Text>
                        </View>
                    </View>}
                </View>
            </View>
        )
    }
}