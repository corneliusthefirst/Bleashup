import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity, DeviceEventEmitter, Image } from 'react-native'
import { Button, Icon, DeckSwiper, Card, CardItem, Right } from 'native-base'
import CacheImages from './CacheImages'
import autobind from 'autobind-decorator';
import { TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
import ImageActivityIndicator from './myscreens/currentevents/imageActivityIndicator';

export default class DetailsModal extends Component {
    constructor(props) {
        super(props);
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

    Desc(item) {
        if (item.image) {
            //creating the highlights starting and ending data
            const highlightData = item.description
            max_length = highlightData.length
            highlightStartData = highlightData.slice(0, 250)
            highlightEndData = highlightData.slice(250, max_length)

            return (
                <Card style={{ elevation: 3, marginTop: 50 }} >
                    <CardItem >
                        <Text note>highlight</Text>
                    </CardItem>
                    <CardItem  >
                        <Text style={{ fontSize: 19, height: 40, color: "#1FABAB" }}>{item.title}</Text>
                    </CardItem>
                    <CardItem cardBody>
                        <Icon name="caretleft" type="AntDesign" style={{ color: "#1FABAB" }}
                            onPress={() => this._deckSwiper._root.swipeLeft()} />

                        <Image style={{ height: 150, flex: 1 }} source={{ uri: item.image }} />

                        <Icon name="caretright" type="AntDesign" style={{ color: "#1FABAB" }} onPress={() =>
                            this._deckSwiper._root.swipeRight()} />

                    </CardItem>

                    <CardItem style={{}}>

                        <Text style={{ height: 140 }} >
                            {highlightStartData}...
                      {<Text style={{ color: "blue" }} onPress={() => this.setState({ highlightEnd: true })}> view all</Text>}
                        </Text>

                    </CardItem>
                    <Modal
                        isOpen={this.state.highlightEnd}
                        onClosed={() => this.setState({ highlightEnd: false })}
                        style={{
                            padding: 20, alignItems: 'center', height: 220, flex: 1, borderRadius: 15,
                            backgroundColor: '#FEFFDE', width: 330
                        }}
                        position={'center'}
                    >

                        <Text style={{}}>{highlightEndData}</Text>

                    </Modal>

                </Card>)

        } else {
            const descriptionData = item.event_description
            max_length1 = item.event_description.length
            descriptionStartData = descriptionData.slice(0, 250)
            descriptionEndData = descriptionData.slice(250, max_length1)
            return (
                <Card style={{ elevation: 3, marginTop: 50 }}>
                    <CardItem>
                        <Text note>description</Text>
                    </CardItem>
                    <CardItem style={{ height: 40 }}>
                        <Text style={{ color: "#1FABAB", fontSize: 19 }}>{item.event_title}</Text>
                    </CardItem>
                    <CardItem cardBody>
                        <Icon name="caretleft" type="AntDesign" style={{ color: "#1FABAB" }}
                            onPress={() => this._deckSwiper._root.swipeLeft()} />

                        <Text style={{ height: 300, flex: 1 }} >
                            {item.event_description}...
                      {<Text style={{ color: "blue" }} onPress={() => this.setState({ descriptionEnd: true })}> view all</Text>}
                        </Text>
                        <Icon name="caretright" style={{ color: "#1FABAB" }} type="AntDesign"
                            onPress={() => this._deckSwiper._root.swipeRight()} />

                    </CardItem>
                    <Modal
                        isOpen={this.state.descriptionEnd}
                        onClosed={() => this.setState({ descriptionEnd: false })}
                        style={{ padding: 20, alignItems: 'center', height: 220, flex: 1, borderRadius: 15, backgroundColor: '#FEFFDE', width: 330 }}
                        position={'center'}
                    >

                        <Text style={{}}>{descriptionEndData}</Text>

                    </Modal>


                </Card>)

        }

    }
    @autobind close() {
        DeviceEventEmitter.emit('DetailsModalClosed', true);
    }
    @autobind join() {
        this.setState({ isJoining: true })
        DeviceEventEmitter.emit(this.state.id + "joining", true)
    }
    render() {
        return this.state.details ? (
            <Modal
                backdropPressToClose={false}
                swipeToClose={false}
                backdropOpacity={0.5}
                animationDuration={100}
                backButtonClose={true}
                position='bottom'
                coverScreen={true}
                isOpen={this.state.isOpen}
                onClosed={ 
                    this.props.onclosed
                    /*() => {
                   
                   this.setState({
                        isOpen: false
                    })
                    //DeviceEventEmitter.emit('DetailsModalClosed', true);
                }*/

                }
                style={{
                    justifyContent: 'center', alignItems: 'center', height: 620, display: 'flex', flexDirection: 'column',
                    borderRadius: 8, backgroundColor: '#FEFFDE', width: 420
                }}
            >
                <View style={{ height: "5%", marginTop: "10%" }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ marginLeft: "40%" }}>
                            <TouchableOpacity
                                onPress={this.close} transparent>
                                <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="cross" type="Entypo" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginLeft: "25%" }}>
                            {this.state.isToBeJoint ?
                                <Right>{this.state.isJoining ? <ImageActivityIndicator /> : <TouchableOpacity
                                    onPress={this.join}
                                    transparent><Text style={{
                                        fontWeight: "bold",
                                        fontSize: 20, color: "#54F5CA"
                                    }}>JOIN</Text></TouchableOpacity>}</Right> :
                                <Button transparent><Text style={{
                                    fontWeight: "bold", fontSize: 20,
                                    color: this.transparent
                                }}>JOIN</Text></Button>}
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text style={{ marginLeft: 7 }} note>
                            {this.state.created_date}
                        </Text>
                        <Text style={{ marginLeft: "-30%", fontStyle: "italic" }} note>
                            Organised by {this.state.event_organiser_name}
                        </Text>
                    </View>
                </View>

                <View style={{ width: 400, height: "80%" }}>
                    <DeckSwiper
                        ref={(c) => this._deckSwiper = c}
                        dataSource={this.state.details}
                        renderEmpty={() =>
                            <View style={{ alignSelf: "center" }}>
                                <Text>Over</Text>
                            </View>
                        }
                        renderItem={item => this.Desc(item)}
                    />
                </View>
                <View style={{ height: "20%" }}>
                    <View style={{ marginLeft: 160, }}>
                        <TouchableOpacity>
                            <Text ellipsizeMode="clip" numberOfLines={3} style={{ fontSize: 14, color: "#1FABAB" }}>
                                {this.state.location}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.OpenLinkZoom}>
                            <Image
                                source={require("../../Images/google-maps-alternatives-china-720x340.jpg")}
                                style={{
                                    height: 100,
                                    width: "70%",
                                    borderRadius: 15,
                                    marginTop: -10

                                }}
                                resizeMode="contain"
                                onLoad={() => { }}
                            />
                            <Text note> View On Map </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.OpenLink} style={{}}>

                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        ) : null
    }
}

