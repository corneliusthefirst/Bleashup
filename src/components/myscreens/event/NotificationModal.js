import React, { PureComponent } from 'react';
import Modal from "react-native-modalbox"
import { Header, Left, Icon, Text, Label, Right, Title } from 'native-base';
import {
    View,
    TouchableWithoutFeedback,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native';
//import BleashupFlatList from './BleashupFlatList';
//import ProfileWithCheckBox from './myscreens/currentevents/components/PofileWithCheckbox';
import { indexOf, reject, concat, find } from "lodash"
import CacheImages from '../../CacheImages';
export default class NotificationModal extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            members: []
        }
    }
    state = {

    }
    componentDidMount() {
        setTimeout(() =>
            this.setState({
                checked: this.props.members,
                members: this.props.members,
                check: this.props.notcheckall ? false : true
            })
            , 200)
    }
    _keyExtractor = (item, index) => { return item ? item.phone : null };
    render() {
        return (
            <Modal
                backdropPressToClose={true}
                backdropOpacity={0}
                swipeToClose={true}
                backButtonClose={true}
                position={"top"}
                entry={"top"}
                //coverScreen={false}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.setState({
                        members: [],
                        checked: [],
                        check: true
                    })
                    this.props.close()
                }}
                onOpened={() => {
                    this.setState({

                    })
                }}
                style={{
                    height: "110%",
                    borderRadius: 10,
                    borderWidth: 0.2,
                    marginLeft: "16%",
                    borderColor: "#1FABAB",
                    borderBottomRightRadius: 8,
                    backgroundColor: "#FEFFDE",
                    width: "70%"
                }}
            >
                <TouchableWithoutFeedback onPress={() => requestAnimationFrame(() => {
                    this.props.onPress()
                })
                }>
                    <View style={{ margin: '2%' }}>
                        <View style={{ flexDirection: 'column', }}>
                        <View><Text style={{fontStyle: 'italic',}} note>New Update</Text></View>
                            <View style={{ flexDirection: 'row', }}>
                                <View style={{ width: "20%" }}>
                                    <CacheImages thumbnails
                                        source={{ uri:this.props.change.updater.profile }}>
                                    </CacheImages>
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
                                        <Icon type={"EvilIcons"} name={"close"}></Icon>
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
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
} 