import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity, DeviceEventEmitter, Image } from 'react-native'
import { Button, Icon, DeckSwiper, Card, CardItem } from 'native-base'
import CacheImages from './CacheImages'

export default class DetailsModal extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        details: undefined,
        isOpen: false,
        created_date: undefined,
        event_organiser_name: undefined,
        location: undefined
    }
    details = []
    created_date = "";
    event_organiser_name = ""
    location = ""
    componentDidMount() {
        this.setState({
            details: this.props.details ? this.props.details : this.details,
            isOpen: this.props.isOpen,
            created_date: this.props.created_date ? this.props.created_date : this.created_date,
            event_organiser_name: this.props.event_organiser_name ? this.props.event_organiser_name : this.event_organiser_name,
            location: this.props.location ? this.props.location : this.location
        })
        this.details = this.props.details ? this.props.details : this.details
        this.created_date = this.props.created_date ? this.props.created_date : this.created_date;
        this.event_organiser_name = this.props.event_organiser_name ? this.props.event_organiser_name : this.event_organiser_name;
        this.location = this.props.location ? this.props.location : this.location;
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            details: nextProps.details ? nextProps.details : this.details,
            isOpen: nextProps.isOpen,
            created_date: this.props.created_date ? this.props.created_date : this.created_date,
            event_organiser_name: this.props.event_organiser_name ? this.props.event_organiser_name : this.event_organiser_name,
            location: this.props.location ? this.props.location : this.location
        })
    }

    Desc(item) {
        if (item.image) {
            //creating the highlights starting and ending data
            const highlightData = item.description
            max_length = highlightData.length
            highlightStartData = highlightData.slice(0, 62)
            highlightEndData = highlightData.slice(62, max_length)

            return (
                <Card style={{ elevation: 3, marginTop: 95 }}>
                    <CardItem style={{ height: 40, marginBottom: -10 }} >

                        <Text style={{ fontSize: 19 }}>{item.title}</Text>
                    </CardItem>
                    <CardItem style={{ height: 16, marginLeft: 25, marginTop: 5 }}>
                        <Text note>highlight:</Text>
                    </CardItem>
                    <CardItem cardBody>
                        <Icon name="caretleft" type="AntDesign" style={{ color: "#1FABAB" }}
                            onPress={() => this._deckSwiper._root.swipeLeft()} />

                        <Image style={{ height: 150, marginTop: 5, flex: 1 }} source={{ uri: item.image }} />

                        <Icon name="caretright" type="AntDesign" style={{ color: "#1FABAB" }} onPress={() => this._deckSwiper._root.swipeRight()} />

                    </CardItem>

                    <CardItem style={{}}>

                        <Text style={{ padding: 10 }} >
                            {<Text style={{ marginBottom: 7 }} note>Description:
                                 </Text>}
                            {highlightStartData}...
                      {<Text style={{ color: "blue" }} onPress={() => this.setState({ highlightEnd: true })}> view all</Text>}
                        </Text>

                    </CardItem>
                    <Modal
                        isOpen={this.state.highlightEnd}
                        onClosed={() => this.setState({ highlightEnd: false })}
                        style={{ padding: 20, alignItems: 'center', height: 220, flex: 1, borderRadius: 15, backgroundColor: '#FEFFDE', width: 330 }}
                        position={'center'}
                    >

                        <Text style={{}}>{highlightEndData}</Text>

                    </Modal>

                </Card>)

        } else {
            const descriptionData = item.event_description
            max_length1 = item.event_description.length
            descriptionStartData = descriptionData.slice(0, 300)
            descriptionEndData = descriptionData.slice(300, max_length1)
            return (
                <Card style={{ elevation: 3, marginTop: 95 }}>
                    <CardItem style={{ height: 40 }}>

                        <Text note>{item.event_title}</Text>

                    </CardItem>
                    <CardItem cardBody>
                        <Icon name="caretleft" type="AntDesign" style={{ color: "#1FABAB" }}
                            onPress={() => this._deckSwiper._root.swipeLeft()} />

                        <Text style={{ height: 230, flex: 1 }} >
                            {<Text style={{ marginBottom: 7 }} note>Description:
                           </Text>}
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

    render() {
        return this.state.details ? (
            <Modal
                isOpen={this.state.isOpen}
                onClosed={() => {
                    this.setState({ isOpen: false })
                    DeviceEventEmitter.emit('DetailsModalClosed', true);
                }
                }
                style={{
                    justifyContent: 'center', alignItems: 'center', height: 510,
                    borderRadius: 10, backgroundColor: '#FEFFDE', width: 350
                }}
                //backdrop={false}
                position={'center'}
            >
                <View style={{ width: 330, height: 280, marginTop: -245 }}>
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
                    <View>
                        <Button style={{ marginLeft: "35%", marginTop: "-80%" }}
                            onPress={() => {
                                this.setState({ isOpen: false })
                                DeviceEventEmitter.emit('DetailsModalClosed', true);
                            }
                            } transparent>
                            <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="cross" type="Entypo" />
                        </Button>
                    </View>
                    <View style={{ marginLeft: 160, marginTop: "30%" }}>
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
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.OpenLink} style={{ marginTop: -20 }}>
                            <Text note> View On Map </Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 35
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
            </Modal>) : null
    }
}

