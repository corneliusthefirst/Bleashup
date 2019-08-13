import React, { Component } from "react";
import { Content, Card, CardItem, Icon, Container, DeckSwiper, Text, Body } from "native-base";
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modalbox';



export default class SwiperHighlight extends Component {
    constructor(props) {
        super(props);
    }


    render() {


        return (

            <Card style={{ elevation: 3, marginTop: 50 }} >
                <CardItem >
                    <Text note>highlight</Text>
                </CardItem>
                <CardItem  >
                    <Text style={{ fontSize: 19, height: 40, color: "#1FABAB" }}>{this.props.item.title}</Text>
                </CardItem>
                <CardItem cardBody>
                    <Icon name="caretleft" type="AntDesign" style={{ color: "#1FABAB" }}
                        onPress={this.props.swipeleft} />

                    <Image style={{ height: 150, flex: 1 }} source={{ uri: this.props.item.url }} />

                    <Icon name="caretright" type="AntDesign" style={{ color: "#1FABAB" }} onPress={this.props.swiperight} />

                </CardItem>

                <CardItem style={{}}>

                    <Text style={{ height: 140, fontStyle: 'italic', fontWeight: "600" }} >
                        {this.props.highlightStartData}
                        {this.props.highlightEndData != "" ? <Text style={{ color: "blue" }} onPress={this.props.onOpen}>...view all</Text> :
                            ("")}
                    </Text>

                </CardItem>
                <Modal
                    isOpen={this.props.highlightEnd}
                    onClosed={this.props.onClosed}
                    style={{
                        padding: 20, alignItems: 'center', height: 220, flex: 1, borderRadius: 15,
                        backgroundColor: '#FEFFDE', width: 330
                    }}
                    position={'center'}
                    swipeArea={210}
                    backdropOpacity={0.1}
                >

                    <Text style={{ fontStyle: 'italic', fontWeight: "600" }}></Text>
                    <ScrollView style={{}}>
                        <TouchableOpacity onPress={this.props.onClosed}>
                            <Text style={{ fontStyle: 'italic', fontWeight: "600", color: "green" }}>{this.props.highlightStartData}...</Text>
                            <Text style={{ fontStyle: 'italic', fontWeight: "600" }}>...{this.props.highlightEndData}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </Modal>

            </Card>)
    }
}
