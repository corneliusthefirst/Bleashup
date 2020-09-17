import React, { Component } from "react"
import { View, StatusBar, Text, } from "react-native"
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import stores from "../stores";
import UserService from "../services/userHttpServices"
import Menu, { MenuDivider, MenuItem } from 'react-native-material-menu';
import ProfileView from "./myscreens/invitations/components/ProfileView";
import BleashupFlatList from './BleashupFlatList';
import moment from "moment";
import bleashupHeaderStyle from "../services/bleashupHeaderStyle";
import CreationHeader from "./myscreens/event/createEvent/components/CreationHeader";
import ColorList from './colorList';
import rounder from "../services/rounder";
import Spinner from './Spinner';
import GState from "../stores/globalState";
import Texts from '../meta/text';
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
        return moment(period).calendar()
    }

    componentDidMount() {

        !this.props.reaction ? setTimeout(() => {
            stores.Publishers.getPublishers(this.props.event_id).then(publisher => {
                if (publisher == 'empty') {
                    this.setState({
                        isEmpty: true,
                        isloaded: true
                    })
                } else {
                    this.setState({
                        publishers: publisher.data ? publisher.data : publisher,
                        isloaded: true,
                    });
                }
            })
        }, 3) : setTimeout(() => {
            this.setState({
                publishers: this.props.reacters,
                isloaded: true
            })
        },30) 
    }
    delay = 0
    _keyExtractor = (item, index) => item.phone
    render() {
        StatusBar.setBarStyle('dark-content', true)
        return <View >
            {!this.props.reaction ? <CreationHeader
                back={this.props.back}
                title={"Shared By "}
                extra={<Text style={{ ...GState.defaultTextStyle, marginTop: 'auto', marginBottom: 'auto', }} note>{this.state.publishers.length}{" sharer(s)"}</Text>}
            >
            </CreationHeader> : <View style={{width:'100%',
                    justifyContent: 'center',
                }}><View style={{marginTop: '-10%',}}><View style={{ alignSelf: 'center', backgroundColor: ColorList.bodyBackground,
                        alignSelf: 'center', ...rounder(100)}}>
                        <Text style={{...GState.defaultTextStyle,textAlign:'center',fontSize: 75,}}>{this.props.reaction}
                        </Text></View></View></View>}
            {this.state.isloaded ? (
                <View style={{height:this.props.reaction?'85%':'93%'}}>
                    {this.state.isEmpty ? <Text style={{
                        ...GState.defaultTextStyle,
                        margin: '10%',
                    }} note>{Texts.no_connection_to_server}</Text> : <BleashupFlatList
                        firstIndex={0}
                        renderPerBatch={7}
                        initialRender={15}
                        numberOfItems={this.state.publishers.length}
                        keyExtractor={this._keyExtractor}
                        dataSource={this.state.publishers}
                        renderItem={(item, index) => {
                            this.delay = this.delay >= 15 ? 0 : this.delay + 1
                            return <View style={{ margin: 10 }}>
                                <View>
                                    <View style={{ 
                                        display: 'flex',
                                        width:"100%", 
                                    flexDirection: 'row', 
                                    height: 50,
                                    justifyContent: 'space-between',
                                    alignItems: 'center', }} >
                                        <View style={{ width: "60%" }}>
                                            <ProfileView delay={this.delay} phone={item.phone}></ProfileView>
                                        </View>
                                        <View style={{
                                            width: "30%",
                                            justifyContent: 'flex-end',
                                        }}>
                                            <Text style={{
                                                ...GState.defaultTextStyle
                                            }} note>{this.writeDateTime(item.date) || item.period && this.writeDateTime(item.period.date)}</Text>
                                        </View>
                                    </View>
                                </View>
                                <MenuDivider color={ColorList.indicatorColor} />
                            </View>
                        }
                        }
                    ></BleashupFlatList>}
                </View>) : <Spinner size="small"></Spinner>}
        </View>

    }
}