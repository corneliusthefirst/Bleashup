import React, { Component } from "react"
import { List, ListItem, Body, Left, Right, Text, Header, Title, Spinner } from "native-base"
import { View, FlatList } from "react-native"
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import stores from "../stores";
import UserService from "../services/userHttpServices"
import ProfileView from "./myscreens/invitations/components/ProfileView";
import BleashupFlatList from './BleashupFlatList';
import moment from "moment";
export default class Contacts extends Component {

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
    dateDisplayer(date) {
        let statDate = moment(date, "YYYY/MM/DD")
        let end = moment()
        let daysDiff = moment.duration(end.diff(statDate)).asDays()
        switch (Math.floor(daysDiff)) {
            case 0:
                return "Today";
            case 1:
                return "Yesterday"
            case 2:
                return "3 Days Ago"
            case 3:
                return "4 Days Ago"
            case 4:
                return "5 Days Ago"
            case 5:
                return "6 Days Ago"
            case 7:
                return "1 Week Ago"
            default:
                return moment(date, "YYYY/MM/DD").format("YYYY/MM/DD")
        }
    }
    componentDidMount() {
        setTimeout(() => {
            if (this.props.contacts == []) {
                this.setState({
                    isEmpty: true,
                    isloaded: true
                })
            } else {
                this.setState({
                    contacts: this.props.contacts,
                    isloaded: true,
                });
            }
        }, 3)
    }
    _keyExtractor = (item, index) => item.phone
    render() {
        return <View>
            <Header>
                <Title>
                    {this.props.title}
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
                        numberOfItems={this.state.contacts.length}
                        keyExtractor={this._keyExtractor}
                        dataSource={this.state.contacts}
                        renderItem={(item, index) =>
                            <View style={{ display: 'flex', flexDirection: 'row', }} >
                                <View style={{ margin: '2%', }}>
                                    <ProfileView phone={item.phone}></ProfileView>
                                </View>
                                <View style={{
                                    marginLeft: "40%",
                                    marginTop: "5%",
                                }}>
                                    <Text style={{
                                    }} note>{this.dateDisplayer(moment(item.date).format("YYYY/MM/DD"))}{" at "}
                                    {moment(item.date).format("HH:mm")}</Text>
                                </View>
                            </View>
                        }
                    ></BleashupFlatList>}
                </View>) : <Spinner size="small"></Spinner>}
        </View>

    }
}