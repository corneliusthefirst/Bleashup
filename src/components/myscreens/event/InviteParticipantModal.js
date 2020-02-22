import React, { PureComponent } from "react"
import Modal from "react-native-modalbox"
import { View, TouchableOpacity } from 'react-native';
import BleashupFlatList from "../../BleashupFlatList";
import { Spinner, Text, Button, Icon } from 'native-base';
import { findIndex, reject } from "lodash";
import stores from '../../../stores';
import SelectableContactsMaster from "./SelectableContactsMaster";
export default class InviteParticipantModal extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            loaded: false,
            participants: [],
            event_id: null,
            selected: []
        };
    }
    state = {}
    componentDidMount() {
        setTimeout(() => {

        }, 20)
    }
    toggleMaster(memberPhone) {
        this.setState({
            selected: this.state.selected.map(ele => ele.phone === memberPhone ? { ...ele, master: !ele.master } : ele)
        })
    }
    addMember(member) {
        this.setState({
            selected: [...this.state.selected, member]
        })
    }
    remove(memberPhone) {
        this.setState({
            selected: reject(this.state.selected, { phone: memberPhone })
        })
    }
    _keyExtractor(item) {
        return item.phone
    }
    delay = 0
    render() {
        return (
            <Modal
                //backdropPressToClose={false}
                //swipeToClose={false}
                backdropOpacity={0.7}
                backButtonClose={true}
                //entry={"top"}
                position='bottom'
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.props.onClosed()
                    this.setState({
                        participants: [],
                        selected: [],
                        loaded: false,
                        event_id: null,
                        hideTitle: false
                    })
                }}
                onOpened={() => {
                    stores.Contacts.getContacts().then(contacts => {
                        setTimeout(() => {
                            this.setState({
                                contacts: contacts ? contacts.filter(ele => findIndex(this.props.participants, { phone: ele.phone }) < 0):[],
                                event_id: this.props.event_id,
                                loaded: true,
                                hideTitle: this.props.hideTitle
                            })
                        }, 20)
                    })
                }}
                style={{
                    height: "97%",
                    borderRadius: 8, backgroundColor: '#FEFFDE', width: "100%"
                }}>
                <View>{this.state.loaded ? <View>
                    <View style={{
                        width: "99%", height: 44, margin: '2%',
                        borderBottomWidth: .8, borderColor: "#1FABAB", flexDirection: 'row',
                    }}>
                        <View style={{ width: "80%", flexDirection: 'column', }}>
                            <Text style={{
                                fontWeight: 'bold', fontStyle: 'italic',
                                fontSize: 24,
                            }}>{"Select New Members"}</Text><Text note style={{
                                fontSize: 14, fontStyle: 'italic', marginLeft: "3%",
                            }}>{this.state.selected.length}{" members and "}{this.state.selected.filter(ele => ele.master == true).length}{" master"}</Text></View>
                        <View style={{ width: "20%" }}><Button transparent>
                            <View>
                                <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.invite(this.state.selected))}><Icon type={"EvilIcons"} style={{ fontSize: 50, marginBottom: "6%", }} name={"sc-telegram"}></Icon>
                                </TouchableOpacity>
                            </View>
                        </Button></View>
                    </View>
                    <View style={{ height: "90%" }}>
                        <BleashupFlatList
                            firstIndex={0}
                            renderPerBatch={5}
                            initialRender={10}
                            numberOfItems={this.state.contacts.length}
                            keyExtractor={this._keyExtractor}
                            dataSource={this.state.contacts}
                            renderItem={(item, index) => {
                                this.delay = this.delay >= 15 ? 0: this.delay + 1
                               return (<SelectableContactsMaster master={this.props.master} delay={this.delay} toggleMaster={(member) => this.toggleMaster(member)}
                                    selected={member => { this.addMember(member) }}
                                    unselected={(member) => this.remove(member)}
                                    key={index} contact={item}></SelectableContactsMaster>)
                            }}
                        >
                        </BleashupFlatList></View></View> : <Spinner size={"small"}></Spinner>}
                </View>
            </Modal>

        );
    }
}