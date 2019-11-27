import React, { Component } from "react"
import { List, ListItem, Body, Left, Right, Text, Header, Title, Spinner } from "native-base"
import { View, FlatList } from "react-native"
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import stores from "../stores";
import UserService from "../services/userHttpServices"
import ProfileView from "./myscreens/invitations/components/ProfileView";
import BleashupFlatList from './BleashupFlatList';
export default class ParticipantList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            publishers: []
        }
    }
    state = {
        isOpen: false,
        isloaded: false
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isOpen !== this.state.isOpen || nextState.isloaded !== this.state.isloaded ? true : false
    }
    writeParticant(participant) {
        return participant.master == true ? "Master" : "Simple Member"
    }
    componentDidMount() {
        setTimeout(() => {
            if (!this.props.participants) {
                stores.Events.getPaticipants(this.props.event_id).then(participants => {
                    this.setState({
                        participants: participants,
                        isloaded: true,
                    });
                })
            } else {
                this.setState({
                    participants: this.props.participants,
                    isloaded: true
                })
            }
        }, 3)
    }
    _keyExtractor = (item, index) => item.phone
    render() {
        return <View>
            <View style={{ margin: '6%', }}>
                <Text style={{ fontWeight: "bold", fontSize: 22, }}>{this.props.hide ? "" : "Participants List"}</Text>
            </View>
            {this.state.isloaded ? (
                <View>
                    {this.state.isEmpty ? <Text style={{
                        margin: '10%',
                    }} note>{"sory! there's no connction to the server"}</Text> : <BleashupFlatList
                        firstIndex={0}
                        renderPerBatch={7}
                        initialRender={15}
                        numberOfItems={this.state.participants.length}
                        keyExtractor={this._keyExtractor}
                        dataSource={this.state.participants}
                        renderItem={(item, index) =>
                            <View style={{ display: 'flex', flexDirection: 'row', }} >
                                <View style={{ margin: '2%', }}>
                                    <ProfileView phone={item.phone.replace("+", "00")}></ProfileView>
                                </View>
                                <View style={{
                                    marginLeft: "40%",
                                    marginTop: "5%",
                                }}>
                                    <Text style={{
                                    }} note>{this.writeParticant(item)}</Text>
                                </View>
                            </View>
                        }
                    ></BleashupFlatList>}
                </View>) : <Spinner size="small"></Spinner>}
        </View>

    }
}