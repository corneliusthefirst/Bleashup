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
    containerStyle = { margin: '2%', borderRadius: 6, backgroundColor: "#9EEDD3", ...shadower(4),height:110 }
    render() {
        return (!this.state.loaded ? <View style={{ ...this.containerStyle, width: '95%', height: 110 }}></View> :
            <View>
                <View style={this.containerStyle}>
                    {!this.props.change ? null : <View style={{ flexDirection: 'column', margin: '2%', }}>
                        <View style={{ flexDirection: 'row', height: '45%'}}>
                            <View style={{ width: '93%', height: '100%' }}><ProfileSimple showPhoto={(url) => {
                                GState.ShowingPhoto = true
                                this.props.showPhoto(url)
                            }} delay={this.props.delayer}
                                profile={this.state.changer}></ProfileSimple>
                                {/*<View style={{ flexDirection: 'row', }}>
                                    <View style={{ width: "25%" }}>
                                        {this.props.change.updater.profile && testForURL(this.props.change.updater.profile, true) ?
                                            <CacheImages thumbnails
                                                source={{ uri: this.props.change.updater.profile }}>
                                            </CacheImages> : <Thumbnail source={{ uri: this.props.change.updater.profile ? this.props.change.updater.profile : '' }}></Thumbnail>}
                                    </View>
                                    <View style={{ marginTop: "5%", marginLeft: "4%", flexDirection: 'column', width: "65%" }}>
                                        <Text style={{ marginBottom: "2%", fontWeight: 'bold', }}>{this.props.change.updater.phone === stores.LoginStore.user.phone ? "You" : this.props.change.updater.nickname}</Text>
                                        <Text style={{ marginLeft: "2%" }} note>{this.props.change.updater.status}</Text>
                                    </View>
                                        </View>*/}</View>
                            <View style={{ alignSelf: 'flex-start', marginTop: "-5%", marginRight: "3%",width:'7%' }}>
                                {!this.props.replying ? <ChangeBoxMenu
                                    master={this.props.master}
                                    change={this.props.change}
                                    mention={() => this.props.mention({
                                        id:this.props.change.id,
                                        title: `${this.props.change.changed}`,
                                        type_extern: this.props.change.title,
                                        new_value:this.props.change.new_value,
                                        updated:this.props.change.updated,
                                        photo: true,
                                        change_date:this.props.change.date,
                                        sourcer: this.state.changer.profile,
                                        replyer_phone: this.state.changer.phone,
                                        replyer_name: this.state.changer.nickname

                                    })}
                                    restore={() => this.props.restore(this.props.change)}
                                ></ChangeBoxMenu> : null}
                            </View>
                            <View style={{ width: "13%" }}>
                                <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                                    console.warn("pressing !!!")
                                    this.props.close()
                                })}>
                                    <View></View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                        }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Text ellipsizeMode='tail' style={{ fontSize: 16, fontWeight: 'bold',color:'darkGray' }} 
                                numberOfLines={2}>{this.props.change.changed}</Text>
                            </View>
                            <Text ellipsizeMode='tail' style={{ fontSize: 14, color: 'darkGray', fontStyle: 'italic',}} 
                            numberOfLines={1}>{typeof this.props.change.new_value.new_value === "string" 
                            && !testForURL(this.props.change.new_value.new_value, true) ? this.props.change.new_value.new_value : ""}</Text>
                        </View>
                    </View>}
                </View>
            </View>
        )
    }
}