import React, { PureComponent } from 'react';
import Modal from "react-native-modalbox"
import { Header, Left, Icon, Text, Label, Right, Title } from 'native-base';
import { View, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity } from 'react-native';
import BleashupFlatList from './BleashupFlatList';
import ProfileWithCheckBox from './myscreens/currentevents/components/PofileWithCheckbox';
import { indexOf, reject, concat, find } from "lodash"
export default class SelectableContactList extends PureComponent {
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
                backdropPressToClose={false}
                backdropOpacity={0.7}
                swipeToClose={false}
                backButtonClose={true}
                position={"top"}
                entry={"top"}
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.setState({
                        members: [],
                        checked: [],
                        check:true
                    })
                    this.props.close()
                }}
                onOpened={() => {
                    this.setState({
                        members: this.props.members ? this.props.members.filter(ele => ele.phone !== this.props.phone) : [],
                        checked: this.props.notcheckall ? [] :
                            this.props.members ?
                                this.props.members.filter(ele => ele.phone !== this.props.phone) : [],
                        check: this.props.notcheckall ? false : true
                    })
                }}
                style={{
                    height: this.state.inviteViaEmail ? "30%" : "100%",
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    backgroundColor: "#FEFFDE",
                    width: "100%"
                }}
            ><View style={{ display: 'flex', flexDirection: 'row', marginTop: "4%", marginLeft: "2%", }}>
                    <View style={{ width: "90%" }}>
                        <Text style={{ fontWeight: '400', fontSize: 25, }}>{this.props.title} </Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                            this.props.removing ? this.props.saveRemoved(this.state.checked) :
                                this.props.adding ? this.props.addMembers(this.state.checked) :
                                    this.props.takecheckedResult(this.state.checked)
                            this.setState({
                                checked: [],

                            })
                        })
                        }>
                            <View>
                                <Icon
                                    style={{ color: "#1FABAB", }}
                                    type="AntDesign"
                                    name="checkcircle"
                                />
                                <Label style={{ color: "#1FABAB", marginLeft: "10%",fontWeight: 'bold', }}>Go</Label>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    {this.state.members.length <= 0 ? <Text style={{
                        margin: '10%',
                    }} note>{"sory! could not load members"}</Text> : <BleashupFlatList
                        listKey={"contacts"}
                        keyExtractor={this._keyExtractor}
                        dataSource={this.state.members}
                        firstIndex={0}
                        renderPerBatch={7}
                        initialRender={15}
                        numberOfItems={this.state.members.length}
                        renderItem={(item, index) => {
                            // console.error(item, "pppppp")
                            return item ?
                                <View>
                                    <ProfileWithCheckBox checked={this.state.check}
                                        index={indexOf(this.state.checked, item.phone)} phone={item.phone} check={(phone) =>
                                            this.setState({
                                                checked: concat(this.state.checked, [find(this.state.members, { phone: phone })]),
                                                check: true
                                            })
                                        }
                                        uncheck={(phone) =>
                                            this.setState({ checked: reject(this.state.checked, { phone: phone }), check: false })
                                        }></ProfileWithCheckBox>
                                </View> : null
                        }
                        }
                    /* refreshControl={
                       <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
                     }*/
                    ></BleashupFlatList>}
                </View>
            </Modal>
        );
    }
} 