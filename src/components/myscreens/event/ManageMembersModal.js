import React, { PureComponent } from "react"
import Modal from "react-native-modalbox"
import { View, TouchableOpacity } from 'react-native';
import BleashupFlatList from "../../BleashupFlatList";
import { Spinner, Text, Button, Icon } from 'native-base';
import { findIndex, reject, uniqBy } from "lodash";
import stores from '../../../stores';
import SelectableContactsMaster from "./SelectableContactsMaster";
import SelectableProfileWithOptions from './SelectableProfileWithOption';
import emitter from '../../../services/eventEmiter';
import CacheImages from '../../CacheImages';
export default class MamageMembersModal extends PureComponent {
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
    apply() {
        this.props.bandMembers(this.state.selected)
        emitter.once("parti_removed", () => {
            this.setState({
                contacts: reject(this.state.contacts, ele => findIndex(this.state.selected, { phone: ele.phone }) >= 0)
            })
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
    render() {
        return (
            <Modal
                backdropPressToClose={false}
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
                        contacts: [],
                        loaded: false,
                        event_id: null,
                        hideTitle: false
                    })
                }}
                onOpened={() => {
                    stores.Contacts.getContacts().then(contacts => {
                        setTimeout(() => {
                            this.setState({
                                contacts: uniqBy(this.props.participants, "phone").filter(ele => !Array.isArray(ele) && ele && ele.phone
                                 !== stores.LoginStore.user.phone),
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
                    }}><CacheImages source={{uri:stores.LoginStore.user.profile}} thumbnails small></CacheImages><Text style={{
                        fontWeight: 'bold', fontStyle: 'italic',marginLeft: "2%",
                        fontSize: 24, width: "65%"
                    }}>{"Manage Participant"}</Text>{this.state.selected.length> 0 && this.props.master ?
                        <TouchableOpacity onPress={() => requestAnimationFrame(() => this.apply())}><View style={{ flexDirection: 'row', marginTop: "2%", }}><Icon name={"trash"}
                            type={"EvilIcons"} style={{ color: "red", fontSize: 40, }}></Icon>
                            <Text style={{ fontStyle: 'italic', color: "red", fontWeight: 'bold', marginTop: "3%", }}>{"Ban"}</Text></View>
                        </TouchableOpacity> : null}</View>
                    <View style={{ height: "90%" }}>
                        <BleashupFlatList
                            firstIndex={0}
                            renderPerBatch={5}
                            initialRender={10}
                            numberOfItems={this.state.contacts.length}
                            keyExtractor={this._keyExtractor}
                            dataSource={this.state.contacts}
                            renderItem={(item, index) =>
                                <SelectableProfileWithOptions toggleMaster={(member) => this.toggleMaster(member)}
                                    selected={member => { this.addMember(member) }}
                                    changeMasterState={(newState) => this.props.changeMasterState(newState) }
                                    checkActivity={(memberPhone) => this.props.checkActivity(memberPhone)}
                                    creator={this.props.creator}
                                    mainMaster={this.props.master}
                                    unselected={(member) => this.remove(member)}
                                    key={index} contact={item}></SelectableProfileWithOptions>
                            }
                        >
                        </BleashupFlatList></View></View> : <Spinner size={"small"}></Spinner>}
                </View>
            </Modal>

        );
    }
}