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
                    borderTopRightRadius: 10, borderBottomRightRadius: 10,
                    backgroundColor: "#1FABAB", height: 35,
                    width: "95%", display: 'flex', flexDirection: 'row', marginBottom: "5%", 
                   ...shadower(3)
                }}>
                <View style={{ width: "80%",}}>
                        <Title style={{
                            color: "#9EEDD3",
                            fontWeight: 'bold',
                            alignSelf: 'flex-start',
                            fontStyle: 'italic',
                            marginLeft: 10, fontSize: 22,
                            marginBottom: "3%",
                        }}>Commitees</Title>
                </View>
                    <View>
                        <TouchableOpacity onPress={() => requestAnimationFrame(() => { this.props.showCreateCommiteeModal() })}>
                            <Icon style={{ marginTop: "10%", color: "#FEFFDE" }}
                                name="pluscircle" type="AntDesign"></Icon></TouchableOpacity>
                    </View>
                </View>
                <View>{this.state.refresh ? null :
                    <View style={{height:'97%',}}>
                        <BleashupScrollView
                        backgroundColor={'#feffde'}
                        style={{
                            width: '98%', borderBottomRightRadius: 8,borderTopRightRadius: 8,margin: '1%', ...shadower(3),
                            height:256
                        }}
                            dataSource={union([this.generalCommitee], uniq(this.props.commitees))}
                            keyExtractor={(item, index) => item}
                            renderItem={(item, index) =>
                                <CommiteeItem
                                    key={index.toString()}
                                    master={this.props.master}
                                    event_id={this.props.event_id}
                                    join={(id) => { this.props.join(id) }}
                                    commitee={item.id ? item : null}
                                    leave={(id) => { this.props.leave(id) }}
                                    removeMember={(id, members) => { this.props.removeMember(id, members) }}
                                    addMembers={(id, currentMembers) => { this.props.addMembers(id, currentMembers) }}
                                    publishCommitee={(id, state) => { this.props.publishCommitee(id, state) }}
                                    editName={(newName, id) => this.props.editName(newName, id)}
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