import React, { Component } from "react"
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View,Vibration } from 'react-native';
import { Text } from "native-base"
export default class TextMessage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sender: false,
            splicer: 500,
            showTime: false,
            creator: false,
            text: "",
            time: ""
        };
    }


    componentDidMount() {
        this.setState({
            text: this.props.message.text,
            sender_name: this.props.message.sender.nickname,
            sender: !(this.props.message.sender.phone == this.props.user),
            time: this.props.message.created_at.split(" ")[1],
            creator: (this.props.message.sender.phone == this.props.creator)
        })
    }

    duration = 10
    pattern = [1000, 0, 0]
    render() {
        topMostStyle = {
            margin: '3%',
            alignSelf: this.state.sender ? 'flex-start' : 'flex-end',
        }
        GeneralMessageBoxStyle = {
            maxWidth: 330, flexDirection: 'column', minWidth: "10%",
            minHeight: 10, overflow: 'hidden', borderBottomLeftRadius: this.state.sender ? 0 : 20,
            borderTopLeftRadius: this.state.sender ? 0 : 20, backgroundColor: this.state.sender ? '#FFBFB2' : '#1EF1D1',
            borderTopRightRadius: 20, borderBottomRightRadius: this.state.sender ? 20 : 0,
        }
        return (
            <View style={topMostStyle}>
                <View style={GeneralMessageBoxStyle}>
                    <View style={{ flexDirection: 'row' }}>
                        {this.state.sender ? <View style={{
                            backgroundColor: '#FEFFDE', height: "100%",
                            width: "2%",
                            borderBottomRightRadius: 3,
                            marginTop: 1,
                            borderTopRightRadius: 15,
                        }}>
                        </View> : null}
                        <View style={{
                            maxWidth: this.state.sender ? "98%" : "100%",
                            padding: 4,
                            borderBottomLeftRadius: 40,
                        }} >
                            {this.state.sender ? <View style={{
                                marginTop: -3, paddingBottom: 5,
                                flexDirection: "column"
                            }}>{this.state.creator ? <Text style={{
                                color: "#1EDEB6"
                            }} note>creator</Text> : null}<TouchableOpacity onPress={() => {
                                console.warn('humm ! you want to know that contact !')
                            }}><Text style={{ color: '#1EDEB6', fontSize: 13, }}
                                note>@{this.state.sender_name}</Text></TouchableOpacity></View> : null}
                            <View style={{ margin: '2%',}}>
                                <TouchableOpacity onLongPress={() => {
                                    Vibration.vibrate(this.duration)
                                    this.setState({
                                        showTime: !this.state.showTime
                                    })
                                }}>
                                    <Text styles={{
                                        justifyContent: 'center',
                                        backgroundColor: this.state.sender ? '#FFBFB2' : '#C1FFF2',
                                    }}>
                                        {this.state.text.slice(0, this.state.splicer)}{this.state.text.length >=
                                            this.state.splicer ?
                                            this.state.splicer == 500 ? "  ... " : null : null}
                                    </Text>
                                    {this.state.text.length >= this.state.splicer ?
                                        <TouchableOpacity onPress={() => this.setState({ splicer: this.state.splicer == this.state.text.length ? 500 : this.state.text.length })}>
                                            <Text style={{ color: 'blue', margin: "2%" }} note>{this.state.splicer == this.state.text.length ? "read less" : "read more"}
                                            </Text></TouchableOpacity> : null}</TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </View>
                {this.state.showTime ? <Text note style={{ marginLeft: "5%", }}>{this.state.time}</Text> : false}
            </View>
        );
    }
}