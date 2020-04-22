import React, { Component } from "react"
import { List, ListItem, Body, Left, Right, Text, Header, Title, Spinner } from "native-base"
import { View, FlatList } from "react-native"
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import stores from "../stores";
import UserService from "../services/userHttpServices"
import ProfileView from "./myscreens/invitations/components/ProfileView";
import BleashupFlatList from './BleashupFlatList';
import moment from "moment";
import dateDisplayer from '../services/dates_displayer';
import bleashupHeaderStyle from "../services/bleashupHeaderStyle";
import CreationHeader from "./myscreens/event/createEvent/components/CreationHeader";
import ColorList from './colorList';
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
    delay = 0
    _keyExtractor = (item, index) => item.phone
    render() {
        return <View>
        <CreationHeader
        back={this.props.close}
        title={this.props.title}
        ></CreationHeader>
            {this.state.isloaded ? (
                <View style={{height:ColorList.containerHeight - (ColorList.headerHeight + 20)}}>
                    {this.state.isEmpty ? <Text style={{
                        margin: '10%',
                    }} note>{"sory! there's no connction to the server"}</Text> : <BleashupFlatList
                        firstIndex={0}
                        renderPerBatch={7}
                        initialRender={15}
                        numberOfItems={this.state.contacts.length}
                        keyExtractor={this._keyExtractor}
                        dataSource={this.state.contacts}
                        renderItem={(item, index) => {
                            this.delay = this.delay >= 15 ? 0 : this.delay + 1
                            return <View style={{ display: 'flex', flexDirection: 'row', }} >
                                <View style={{ margin: '2%', }}>
                                    <ProfileView delay={this.delay} phone={item.phone}></ProfileView>
                                </View>
                                <View style={{
                                    marginLeft: "40%",
                                    marginTop: "5%",
                                }}>
                                    {item.date ? <Text style={{
                                    }} note>{dateDisplayer(moment(item.date).format("YYYY/MM/DD"))}{" at "}
                                        {moment(item.date).format("HH:mm")}</Text> : null}
                                </View>
                            </View>
                        }}
                    ></BleashupFlatList>}
                </View>) : <Spinner size="small"></Spinner>}
        </View>

    }
}