import React, { Component } from "react"
import { List, ListItem, Body, Left, Right, Text, Header, Title,Spinner } from "native-base"
import { View, FlatList } from "react-native"
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import stores from "../stores";
import UserService from "../services/userHttpServices"
import ProfileView from "./myscreens/invitations/components/ProfileView";
import BleashupFlatList from './BleashupFlatList';
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
        return period.date.year +
            "-" +
            period.date.month +
            "-" +
            period.date.day +
            "    " +
            period.time.hour +
            "-" +
            period.time.mins +
            "-" +
            period.time.secs
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
        return <View>
            <Header>
                <Title>
                    Publishers List
                        </Title>
            </Header>
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
                        renderItem={(item, index) =>
                            <View style={{ display: 'flex', flexDirection: 'row', }} >
                                <View>
                                    <ProfileView phone={item.phone}></ProfileView>
                                </View>
                                <View style={{
                                    marginLeft: "40%",
                                    marginTop: "5%",
                                }}>
                                    <Text style={{
                                    }} note>{this.writeDateTime(item.period)}</Text>
                                </View>
                            </View>
                        }
                    ></BleashupFlatList>}
                </View>) : <Spinner size="small"></Spinner>}
        </View>

    }
}