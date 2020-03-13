import React, { Component } from "react"
import { List, ListItem, Body, Left, Right, Text, Header, Title, Spinner } from "native-base"
import { View, FlatList } from "react-native"
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import stores from "../stores";
import UserService from "../services/userHttpServices"
import ProfileView from "./myscreens/invitations/components/ProfileView";
import BleashupFlatList from './BleashupFlatList';
import Menu, { MenuDivider, MenuItem } from 'react-native-material-menu';
import bleashupHeaderStyle from "../services/bleashupHeaderStyle";

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
        return this.props.creator === participant.phone ? "creator" : participant.master == true ? "Master" : "Simple Member"
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
                console.warn(this.props.participants)
                this.setState({
                    participants: this.props.participants ? this.props.participants : [],
                    isloaded: true
                })
            }
        }, 3)
    }
    delay = 0
    _keyExtractor = (item, index) => item.phone
    render() {
        return <View>
            <View style={{ height: 53 }}>
                <View style={{padding: '3%', flexDirection: 'row',...bleashupHeaderStyle}}>
                    <Text style={{ fontWeight: "bold", fontSize: 20, width: "70%" }}>{this.props.hide ? "" : "Participants List"}</Text>
                    <Text style={{ marginTop: "1%", }} note>{this.state.participants ? this.state.participants.filter(ele => ele.phone).length : 0}{" member(s)"}</Text>
            </View>
            </View>
            {this.state.isloaded ? (
                <View>
                    {this.state.isEmpty ? <Text style={{
                        margin: '4%',
                    }} note>{"sory! there's no connction to the server"}</Text> : <View style={{ hight: "93%" }}><BleashupFlatList
                        firstIndex={0}
                        renderPerBatch={7}
                        initialRender={15}
                        numberOfItems={this.state.participants ? this.state.participants.length : 0}
                        keyExtractor={this._keyExtractor}
                        dataSource={this.state.participants ? this.state.participants : []}
                        renderItem={(item, index) => {
                            this.delay = this.delay >= 15 ? 0 : this.delay + 1
                            return item.phone ?
                                <View style={{ margin: '3%', }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', }} >
                                        <View style={{}}>
                                            <ProfileView delay={this.delay} phone={item.phone ? item.phone.replace("+", "00") : null}></ProfileView>
                                        </View>
                                        <View style={{
                                            marginLeft: "40%",
                                            marginTop: "5%",
                                        }}>
                                            <Text style={{
                                                fontWeight: this.props.creator == item.phone ? 'bold' : 'normal',
                                                fontStyle: this.props.creator == item.phone ? 'italic' : 'normal',
                                                color: this.props.creator == item.phone ? "#54F5CA" : "gray"
                                            }} note>{this.writeParticant(item)}</Text>
                                        </View>
                                    </View>
                                    <MenuDivider color="#1FABAB" />
                                </View> : null
                        }}
                    ></BleashupFlatList></View>}
                </View>) : <Spinner size="small"></Spinner>}
        </View>

    }
}