import React, { PureComponent } from 'react';
import Modal from "react-native-modalbox"
import { Header, Left, Icon, Text, Label, Right, Title, Button } from 'native-base';
import { View, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity } from 'react-native';
import BleashupFlatList from './BleashupFlatList';
import ProfileWithCheckBox from './myscreens/currentevents/components/PofileWithCheckbox';
import { indexOf, reject, concat, find } from "lodash"
import Menu, { MenuDivider, MenuItem } from 'react-native-material-menu';
import bleashupHeaderStyle from '../services/bleashupHeaderStyle';

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
    delay = 0
    render() {
        return (
            <Modal
                backdropPressToClose={true}
                backdropOpacity={0.5}
                swipeToClose={true}
                backButtonClose={true}
                position={"bottom"}
                //entry={"top"}
                coverScreen={true}
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
                        members: this.props.members ? this.props.members.filter(ele => ele.phone !== this.props.phone) : [],
                        checked: this.props.notcheckall ? [] :
                            this.props.members ?
                                this.props.members.filter(ele => ele.phone !== this.props.phone) : [],
                        check: this.props.notcheckall ? false : true
                    })
                }}
                style={{
                    height: this.state.inviteViaEmail ? "30%" : "95%",
                    width: "100%"
                }}
            ><View style={{ height:50 }}>
                    <View style={{ flexDirection: 'row',...bleashupHeaderStyle,padding: '2%', }}>
                        <View style={{ width: "85%" }}>
                            <Text style={{ fontWeight: 'bold', fontStyle: 'italic', fontSize: 20, }}>{this.props.title}</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                                this.props.removing ? this.props.saveRemoved(this.state.checked) :
                                    this.props.adding ? this.props.addMembers(this.state.checked) :
                                        this.props.takecheckedResult(this.state.checked)
                                this.setState({ checked: [] })
                                this.props.close();
                            })
                            }>
                                <Text style={{ fontWeight: 'bold', color: '#1FABAB',fontSize:22 }}>{"OK"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{height:'91%'}}>
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
                            this.delay = this.delay >= 15 ? 0 : this.delay + 1
                            return item ?
                                <View style={{ margin: '2%', }}>
                                    <ProfileWithCheckBox delay={this.delay} checked={this.state.check}
                                        index={indexOf(this.state.checked, item.phone)} phone={item.phone} check={(phone) =>
                                            this.setState({
                                                checked: concat(this.state.checked, [find(this.state.members, { phone: phone })]),
                                                check: true
                                            })
                                        }
                                        uncheck={(phone) =>
                                            this.setState({ checked: reject(this.state.checked, { phone: phone }), check: false })
                                        }></ProfileWithCheckBox>
                                    <MenuDivider color="#1FABAB" />
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