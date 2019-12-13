
import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity, DeviceEventEmitter, Image } from 'react-native'
import {
    Button,
    Icon,
    Card,
    CardItem,
    Right,
    Left,
    Spinner,
    Header,
    Content,
    Footer,
    Container
} from 'native-base';
import CacheImages from '../../../CacheImages'
import autobind from 'autobind-decorator';
import { TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
import ImageActivityIndicator from '../../currentevents/components/imageActivityIndicator';
import DeckSwiperModule from './deckswiper/index';
import MapView from '../../currentevents/components/MapView';
import stores from '../../../../stores';
import moment from "moment"
import {forEach} from "lodash"
export default class DetailsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: undefined,
            isOpen: false,
            created_date: undefined,
            event_organiser_name: undefined,
            location: undefined,
            isJoining: false,
            isToBeJoint: false,
            id: undefined,
            loaded: false
        }
    }
    state = {

    }
    transparent = "rgba(52, 52, 52, 0.0)";
    details = []
    created_date = "";
    event_organiser_name = ""
    location = ""
    isToBeJoint = false
    id = ""
    componentDidMount() {
        this.props.parent ? this.props.parent.onSeen() : null
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            details: nextProps.details ? nextProps.details : this.details,
            isOpen: nextProps.isOpen,
            created_date: this.props.created_date ? this.props.created_date : this.created_date,
            event_organiser_name: this.props.event_organiser_name ? this.props.event_organiser_name : this.event_organiser_name,
            location: this.props.location ? this.props.location : this.location,
            isToBeJoint: this.props.isToBeJoint ? this.props.isToBeJoint : this.isToBeJoint,
            id: this.props.id ? this.props.id : this.id
        })
    }
    formCreator() {
        return new Promise((resolve, reject) => {
            stores.TemporalUsersStore.getUser(this.props.event.creator_phone).then((user) => {
                resolve({ name: user.nickname, status: user.status, image: user.profile })
            })
        })
    }

    formDetailModal(event) {
        return new Promise((resolve, reject) => {
            stores.Highlights.fetchHighlights(event.id).then(highlights => {
                console.warn(highlights,"ppp")
                let card = [];
                let i = 0;
                Description = { event_title: event.about.title, event_description: event.about.description }
                card.push(Description)
                if (highlights.length !== 0) {
                    forEach(highlights, hightlight => {
                        card.push(hightlight);
                        if (i === highlights.length - 1) {
                            resolve(card)
                        }
                        i++
                    })
                } else {
                    resolve(card)
                }
            })
        })
    }
    render() {
        const accept = this.state.accept
        const deny = this.state.deny

        return (
            <Modal
                backdropPressToClose={false}
                swipeToClose={true}
                backdropOpacity={0.5}
                backButtonClose={true}
                position='bottom'
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.props.onClosed()
                }}
                style={{
                    height: "70%", width: "98%", flexDirection: 'column', borderRadius: 8,
                    backgroundColor: '#FEFFDE', marginTop: -5
                }}
                onOpened={() => {
                    setTimeout(() =>
                        this.formDetailModal(this.props.event).then(details => {
                            this.formCreator().then((creator) => {
                                this.setState({
                                    event:this.props.event,
                                    details: details,
                                    creator: creator,
                                    loaded: true,
                                    location: this.props.event.location
                                })
                            })
                        })
                        , 100)
                }}

            >
                {!this.state.loaded ? <Spinner size={'small'}></Spinner> : <Content>
                    <View style={{ height: "98%", }}>
                        <DeckSwiperModule details={this.state.details} />
                            <CardItem>
                                <View style={{ marginLeft: "60%" }}>
                                    <MapView location={this.state.location.string} ></MapView>
                                </View>
                            </CardItem>
                            {/*<CardItem>
                                <View style={{ marginTop: "20%", }}>
                                    {this.props.isToBeJoint ? (<View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: "20%" }}>
                                            <Button onPress={this.props.join} style={{ marginLeft: 40, alignItems: 'center', width: 100, marginTop: 4, borderRadius: 5 }} success ><Text style={{ fontSize: 18, fontWeight: "500", marginLeft: 31 }}>Join</Text></Button>
                                            <View style={{ flexDirection: 'column' }}></View>
                                        </View></View>)
                                        :
                                        (this.props.accept || this.props.deny ?
                                            null :

                                            <View style={{ flex: 10, flexDirection: 'row', margin: '5%', }}>
                                                <View style={{ width: "35%", }}>
                                                    <View style={{}}>
                                                        <Button onPress={this.props.onAccept} style={{ width: 90, borderRadius: 5, justifyContent: 'center' }} success >
                                                            <Text>Accept</Text></Button>
                                                    </View>
                                                </View>
                                                <View style={{ width: "35%", }}>
                                                    <View style={{ marginLeft: "20%", }}>
                                                        <Icon name="comment" type="EvilIcons" onPress={{}} style={{ color: "#1FABAB" }} />
                                                        <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                                                    </View>
                                                </View>
                                                <View style={{ width: "35%", }}>
                                                    <View style={{}}>
                                                        <Button onPress={this.props.onDenied} style={{ width: 90, borderRadius: 5, justifyContent: 'center' }} danger ><Text>Deny</Text></Button>
                                                    </View>
                                                </View>
                                            </View>

                                        )
                                    }

                                </View>
                                </CardItem>*/}
                            <View style={{ display: 'flex', marginTop: "4%", flexDirection: 'row',}} >
                                <Text style={{ width:'60%'}} note>
                                    {moment(this.state.event.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a")}
                                </Text>
                                <Text style={{ fontStyle: "italic", }} note>
                                    Organised by {this.state.creator.name}
                                </Text>
                            </View>
                    </View>
                </Content>}
            </Modal>
        )
    }
}





/*marginTop:this.props.location.length > 19?15:this.props.location.length > 38?5:35*/