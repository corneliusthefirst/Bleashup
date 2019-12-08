import React, { Component } from "react"
import { View, TouchableOpacity } from 'react-native';
import CacheImages from '../../CacheImages';
import { Text, Icon, Spinner,Thumbnail } from "native-base";
import testForURL from '../../../services/testForURL';
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
            this.setState({
                loaded: true
            })
        }, 200 * this.props.delayer)
    }
    render() {
        return (!this.state.loaded ? <Spinner size={'small'}></Spinner> :
            <View>
                <View style={{ margin: '2%', borderRadius: 6, backgroundColor: "#9EEDD3", }}>
                    <View style={{ flexDirection: 'column', margin: '2%', }}>
                        <View style={{ flexDirection: 'row', }}>
                            <View style={{ width: "20%" }}>
                                 {this.props.change.updater.profile && testForURL(this.props.change.updater.profile) ?
                                    <CacheImages thumbnails
                                        source={{ uri: this.props.change.updater.profile }}>
                                    </CacheImages> : <Thumbnail small source={{ uri: this.props.change.updater.profile ? this.change.updater.profile : '' }}></Thumbnail>}
                            </View>
                            <View style={{ marginTop: "3%", marginLeft: "4%", flexDirection: 'column', width: "65%" }}>
                                <Text style={{ marginBottom: "2%", fontWeight: 'bold', }}>{this.props.change.updater.nickname}</Text>
                                <Text style={{ marginLeft: "2%" }} note>{this.props.change.updater.status}</Text>
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
                                <Text>{this.props.change.changed}</Text>
                            </View>
                            <Text style={{ fontStyle: 'italic', }}>{typeof this.props.change.new_value.new_value === "string" ? this.props.change.new_value.new_value : ""}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}