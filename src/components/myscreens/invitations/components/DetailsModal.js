
import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity, DeviceEventEmitter, Image } from 'react-native'
<<<<<<< HEAD
import { Button, Icon, Card, CardItem, Right, Left } from 'native-base'
=======
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
>>>>>>> 6a0829809d9399070bd79ee79cdcb02e6d44865a
import CacheImages from '../../../CacheImages'
import autobind from 'autobind-decorator';
import { TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
import ImageActivityIndicator from '../../currentevents/components/imageActivityIndicator';
import DeckSwiperModule from './deckswiper/index';
<<<<<<< HEAD
=======
import MapView from '../../currentevents/components/MapView';
>>>>>>> 6a0829809d9399070bd79ee79cdcb02e6d44865a

export default class DetailsModal extends Component {
    constructor(props) {
        super(props);
<<<<<<< HEAD
=======
        this.state = {}
>>>>>>> 6a0829809d9399070bd79ee79cdcb02e6d44865a
    }
    state = {
        details: undefined,
        isOpen: false,
        created_date: undefined,
        event_organiser_name: undefined,
        location: undefined,
        isJoining: false,
        isToBeJoint: false,
        id: undefined
    }
    transparent = "rgba(52, 52, 52, 0.0)";
    details = []
    created_date = "";
    event_organiser_name = ""
    location = ""
    isToBeJoint = false
    id = ""
    componentDidMount() {
        this.setState({
            details: this.props.details ? this.props.details : this.details,
            isOpen: this.props.isOpen,
            created_date: this.props.created_date ? this.props.created_date : this.created_date,
            event_organiser_name: this.props.event_organiser_name ? this.props.event_organiser_name : this.event_organiser_name,
            location: this.props.location ? this.props.location : this.location,
            isToBeJoint: this.props.isToBeJoint ? this.props.isToBeJoint : false,
            id: this.props.id ? this.props.id : this.id
        })
        this.id = this.props.id ? this.props.id : this.id
        this.details = this.props.details ? this.props.details : this.details
        this.created_date = this.props.created_date ? this.props.created_date : this.created_date;
        this.event_organiser_name = this.props.event_organiser_name ? this.props.event_organiser_name : this.event_organiser_name;
        this.location = this.props.location ? this.props.location : this.location;
        this.isToBeJoint = this.props.isToBeJoint ? this.props.isToBeJoint : false
<<<<<<< HEAD
=======
        this.props.parent ? this.props.parent.onSeen() : null
>>>>>>> 6a0829809d9399070bd79ee79cdcb02e6d44865a
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



    render() {
<<<<<<< HEAD
        return this.state.details ? (
=======
        const accept = this.state.accept
        const deny = this.state.deny

        return this.props.details ? (
>>>>>>> 6a0829809d9399070bd79ee79cdcb02e6d44865a
            <Modal
                backdropPressToClose={false}
                swipeToClose={false}
                backdropOpacity={0.5}
<<<<<<< HEAD
                animationDuration={10}
=======
>>>>>>> 6a0829809d9399070bd79ee79cdcb02e6d44865a
                backButtonClose={true}
                position='bottom'
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                style={{
<<<<<<< HEAD
                    height: this.props.accept || this.props.deny ? "95%" : "98%", width: "98%", flexDirection: 'column', borderRadius: 8, backgroundColor: '#FEFFDE', marginTop: -5
                }}

            >

                <View style={{ margin: 5, alignItems: 'center' }}>
                    <TouchableOpacity style={{}} onPress={this.props.onClosed}>
                        <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="cross" type="Entypo" />
                    </TouchableOpacity>
                </View>

                <DeckSwiperModule details={this.props.details} />




                <View style={{ flexDirection: "column", marginTop: (this.props.accept || this.props.deny) ? "25%" : "22%", marginLeft: "58%" }}>


                    <TouchableOpacity>
                        <Text ellipsizeMode="clip" numberOfLines={3} style={{ fontSize: 14, color: "#1FABAB", marginTop: 15 }}>
                            {this.props.location}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.props.OpenLinkZoom}>
                        <Image
                            source={require("../../../../../Images/google-maps-alternatives-china-720x340.jpg")}
                            style={{
                                height: 50,
                                width: 300,
                                borderRadius: 15,
                                marginLeft: -86,
                                marginTop: 5,
                                marginBottom: 5


                            }}
                            resizeMode="contain"
                            onLoad={() => { }}
                        />

                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.props.OpenLink} style={{}}>
                        <Text note> View On Map </Text>
                    </TouchableOpacity>

                </View>

                {this.props.isJoining ? (this.props.hasJoin ?
                    <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
                        <Icon name="comment" type="FontAwesome5" onPress={{}} style={{ color: "#1FABAB" }} />
                        <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                    </View> :

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Button onPress={this.props.onAccept} style={{ marginLeft: 40, alignItems: 'center', width: 100, marginTop: 4, borderRadius: 5 }} success ><Text style={{ fontSize: 18, fontWeight: "500", marginLeft: 31 }} onPress={this.props.joined}>Join</Text></Button>
                        <View style={{ flexDirection: 'column' }}>
                            <Icon name="comment" type="FontAwesome5" onPress={{}} style={{ marginRight: 40, color: "#1FABAB" }} />
                            <Text style={{ marginTop: 5, color: "#1FABAB", marginRight: 40 }}>chat</Text>
                        </View>
                    </View>)
                    :
                    (this.props.accept || this.props.deny ?
                        <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
                            <Icon name="comment" type="FontAwesome5" onPress={{}} style={{ color: "#1FABAB" }} />
                            <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                        </View> :

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                            <Button onPress={this.props.onAccept} style={{ marginLeft: 40, width: 90, borderRadius: 5 }} success ><Text style={{ marginLeft: 21 }}>Accept</Text></Button>

                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <Icon name="comment" type="FontAwesome5" onPress={{}} style={{ color: "#1FABAB" }} />
                                <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                            </View>

                            <Button onPress={this.props.onDenied} style={{ marginRight: 40, width: 90, borderRadius: 5 }} danger ><Text style={{ marginLeft: 25 }}>Deny</Text></Button>
                        </View>

                    )
                }

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: this.props.location.length > 19 ? 20 : this.props.location.length > 38 ? 10 : 35

                    }}
                >
                    <Text style={{ marginLeft: 10 }} note>
                        {this.props.created_date}
                    </Text>
                    <Text style={{ fontStyle: "italic", marginRight: 7 }} note>
                        Organised by {this.props.event_organiser_name}
                    </Text>
                </View>


=======
                    height: "100%", width: 410, flexDirection: 'column', borderRadius: 8,
                    backgroundColor: '#FEFFDE', marginTop: -5
                }}

            >
                <Header>
                    <TouchableOpacity style={{}} onPress={() => this.props.onClosed()}>
                        <Icon style={{ color: "#FEFFDE", fontSize: 35 ,marginTop: "20%", }} name="close" type="EvilIcons" />
                    </TouchableOpacity>
                </Header>
                <Content>
                    <View style={{ height: "100%", }}>
                        <DeckSwiperModule details={this.props.details} />
                        <ScrollView nestedScrollenabled>
                            <CardItem>
                                <View style={{ marginLeft: "60%" }}>
                                    <MapView location={this.props.location} ></MapView>
                                </View>
                            </CardItem>
                            <CardItem>
                                <View style={{marginTop: "20%",}}>
                                    {this.props.isToBeJoint ? (<View>
                                        <View style={{ marginLeft: "65%",flexDirection: 'column', }}>
                                            <Icon name="comment" type="EvilIcons" onPress={() => this.props.navigateToChat} style={{ color: "#1FABAB" }} />
                                            <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: "20%" }}>
                                            <Button onPress={this.props.join} style={{ marginLeft: 40, alignItems: 'center', width: 100, marginTop: 4, borderRadius: 5 }} success ><Text style={{ fontSize: 18, fontWeight: "500", marginLeft: 31 }}>Join</Text></Button>
                                            <View style={{ flexDirection: 'column' }}></View>
                                        </View></View>)
                                        :
                                        (this.props.accept || this.props.deny ?
                                            <View style={{ flexDirection: 'column', alignItems: 'center',marginLeft: "50%", marginTop: 7 }}>
                                                <Icon name="comment" type="EvilIcons" onPress={{}} style={{ color: "#1FABAB" }} />
                                                <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                                            </View> :

                                            <View style={{ flex: 10, flexDirection: 'row', margin: '5%', }}>
                                                <View style={{ width: "35%", }}>
                                                    <View style={{ }}>
                                                        <Button onPress={this.props.onAccept} style={{ width: 90, borderRadius: 5, justifyContent: 'center' }} success >
                                                            <Text>Accept</Text></Button>
                                                </View>
                                                </View>
                                                <View style={{ width: "35%", }}>
                                                    <View style={{marginLeft: "20%",}}>
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
                            </CardItem>    
                                <View style={{display: 'flex', marginTop:"25%",}} >
                                    <Text style={{}} note>
                                        {this.props.created_date}
                                    </Text>
                                    <Text style={{ fontStyle: "italic", }} note>
                                        Organised by {this.props.event_organiser_name}
                                    </Text>
                                </View>
                        </ScrollView>

                    </View>
                </Content>
>>>>>>> 6a0829809d9399070bd79ee79cdcb02e6d44865a
            </Modal>
        ) : null
    }
}
<<<<<<< HEAD
=======




/*marginTop:this.props.location.length > 19?15:this.props.location.length > 38?5:35*/
>>>>>>> 6a0829809d9399070bd79ee79cdcb02e6d44865a
