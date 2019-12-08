import React, { Component } from "react"
import { List, ListItem, Body, Left, Right, Text, Header, Title, Spinner } from "native-base"
import { View, FlatList } from "react-native"
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import stores from "../stores";
import UserService from "../services/userHttpServices"
import Menu, { MenuDivider, MenuItem } from 'react-native-material-menu';
import ProfileView from "./myscreens/invitations/components/ProfileView";
import BleashupFlatList from './BleashupFlatList';
import moment from "moment";
export default class ContactList extends Component {

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
    writeDateTime(period) {
        return moment(period).format("dddd, MMMM Do YYYY, h:mm:ss a")
    }

    componentDidMount() {
        setTimeout(() => {
            stores.Publishers.getPublishers(this.props.event_id).then(publisher => {
                if (publisher == 'empty') {
                    this.setState({
                        isEmpty: true,
                        isloaded: true
                    })
                } else {
                    this.setState({
                        publishers: publisher,
                        isloaded: true,
                    });
                }
            })
        }, 3)
    }
    _keyExtractor = (item, index) => item.phone
    render() {
        return <View style={{}}>
            <View style={{ width: "90%", margin: 4, height: 44, }}>
                <View style={{ flexDirection: 'row', }}>
                    <Text style={{
                        fontSize: 22, fontStyle: 'italic',
                        fontWeight: 'bold', width: "80%", marginLeft: "5%",
                    }}>{"Publishers"}</Text>
                </View></View>
            {this.state.isloaded ? (
                <View>
                    {this.state.isEmpty ? <Text style={{
                        margin: '10%',
                    }} note>{"sory! there's no connction to the server"}</Text> : <BleashupFlatList
                        firstIndex={0}
                        renderPerBatch={7}
                        initialRender={15}
                        numberOfItems={this.state.publishers.length}
                        keyExtractor={this._keyExtractor}
                        dataSource={this.state.publishers}
                        renderItem={(item, index) => {
                            console.warn(item.period)
                          return <View style={{ margin: 10 }}>
                                <View>
                                    <View style={{ display: 'flex', flexDirection: 'row', }} >
                                        <View style={{ width: "50%" }}>
                                            <ProfileView phone={item.phone}></ProfileView>
                                        </View>
                                        <View style={{
                                            width: "50%"
                                        }}>
                                            <Text style={{
                                            }} note>{this.writeDateTime(item.period.date)}</Text>
                                        </View>
                                    </View>
                                </View>
                                <MenuDivider color="#1FABAB" />
                            </View>
                        }
                        }
                    ></BleashupFlatList>}
                </View>) : <Spinner size="small"></Spinner>}
        </View>

    }
}