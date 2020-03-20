import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, PanResponder } from 'react-native';
import { Text, Content, Icon, Spinner,Title } from 'native-base';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import firebase from 'react-native-firebase';
import stores from '../../../stores';
import BleashupFlatList from '../../BleashupFlatList';
import CommiteeItem from './CommiteeItem';
import BleashupScrollView from '../../BleashupScrollView';
import { union, uniq } from "lodash";
import GState from '../../../stores/globalState';
import emitter from '../../../services/eventEmiter';
import shadower from '../../shadower';
export default class Commitee extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentRoom: "Generale",
            loaded: false
        }
    }
    state = {}
    componentWillMount() {
        emitter.on('refresh-commitee', () => {
            this.refreshCommitees()
        })
        //console.warn(stores.CommiteeStore.commitees)

    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                loaded: true
            })
        }, 2)
    }
    generalCommitee = {
        id: this.props.event_id,
        name: "Generale",
        member: this.props.participant,
        opened: true,
        public_state: true,
        creator: this.props.creator
    }
    componentWillUnmount() {
        emitter.off('refresh-commitee')

    }
    _keyExtractor(item, index) {
        return item
    }
    refreshCommitees() {
        this.setState({
            refresh: true
        })
        setTimeout(() => {
            this.setState({
                refresh: false
            })
        }, 100)
    }
    render() {
        return (this.state.loaded ?
            <View style={{ height: "100%", }}>
                <View style={{
                    borderTopRightRadius: 5, borderBottomRightRadius: 5,
                    backgroundColor: "#1FABAB", height: 35,
                    width: "95%", display: 'flex', flexDirection: 'row', marginBottom: "5%", 
                   ...shadower(1)
                }}>
                <View style={{ width: "80%",}}>
                        <Title style={{
                            color: "#9EEDD3",
                            fontWeight: 'bold',
                            alignSelf: 'flex-start',
                            fontStyle: 'normal',
                            marginLeft: 10, 
                            fontSize: 20,
                        }}>Committees</Title>
                </View>
                    <View>
                        <TouchableOpacity onPress={() => requestAnimationFrame(() => { this.props.showCreateCommiteeModal() })}>
                            <Icon style={{ marginTop: "20%", color: "#FEFFDE",fontSize:22 }}
                                name="pluscircle" type="AntDesign"></Icon></TouchableOpacity>
                    </View>
                </View>
                <View>{this.state.refresh ? null :
                    <View style={{height:'97%',}}>
                        <BleashupFlatList
                        backgroundColor={'white'}
                        style={{borderTopRightRadius: 5,
                            width: '100%', borderBottomRightRadius: 1, 
                            height:'100%'
                        }}
                            dataSource={union([this.generalCommitee], uniq(this.props.commitees))}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(item, index) =>
                                <CommiteeItem
                                    computedMaster={this.props.computedMaster}
                                    key={index.toString()}
                                    master={this.props.master}
                                    event_id={this.props.event_id}
                                    join={(id) => { this.props.join(id) }}
                                    commitee={item.id ? item : null}
                                    leave={(id) => { this.props.leave(id) }}
                                    removeMember={(id, members) => { this.props.removeMember(id, members) }}
                                    addMembers={(id, currentMembers) => { this.props.addMembers(id, currentMembers) }}
                                    publishCommitee={(id, state) => { this.props.publishCommitee(id, state) }}
                                    editName={this.props.editName}
                                    swapChats={(commitee) => { this.props.swapChats(commitee) }}
                                    phone={this.props.phone}
                                    newMessagesCount={4}
                                    id={item.id ? item.id : item} ></CommiteeItem>
                            }
                            firstIndex={0}
                            renderPerBatch={7}
                            initialRender={5}
                            numberOfItems={this.props.commitees.length}
                        /></View>}
                </View>
            </View> : <Spinner></Spinner>
        );
    }
}