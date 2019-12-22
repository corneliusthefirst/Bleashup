import React, { Component } from "react"
import { TouchableOpacity, View, TouchableNativeFeedback } from 'react-native';
import { Text, Icon } from "native-base"
import Image from 'react-native-scalable-image';
import CacheImages from "../../CacheImages";
import moment from "moment";
export default class ReplyText extends Component {
    constructor(props) {
        super(props)
    }
    convertToHMS(secs) {
        var sec_num = parseInt(secs, 10)
        var hours = Math.floor(sec_num / 3600)
        var minutes = Math.floor(sec_num / 60) % 60
        var seconds = sec_num % 60

        return [hours, minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v, i) => v !== "00" || i > 0)
            .join(":")

    }
    render() {
        return (
            <TouchableNativeFeedback
                onPressIn={() => this.props.pressingIn()}
                onPress={() => this.props.openReply(this.props.reply)}>
                <View style={{
                    display: 'flex', flexDirection: 'row', borderBottomWidth: 0,
                    backgroundColor: "rgba(34, 0, 0, 0.1)", marginLeft: "1%",
                    marginBottom: "1%", padding: "3%",
                    height: 75,
                    borderRadius: 9, borderWidth: 1, borderColor: "#1FABAF",
                }}>
                    {/*<View style={{ /*width: "5%" }}><Icon type="FontAwesome"
                        style={{ fontSize: 12, color: "#1FABAB" }} name="quote-left"></Icon>
            </View>*/}
                    <View style={{/* width: "90%",*/marginLeft: "2%",
                        borderLeftColor: "#1FABAF", borderLeftWidth: 5,
                        borderBottomLeftRadius: 8, borderTopLeftRadius: 8,
                        height: 60
                    }}>
                        <View style={{ marginLeft: "7%" }}>
                            <View style={{ flexDirection: 'row', marginTop: '-2%', }}>
                                <Text note style={{ marginBottom: "1%", color: "#81A8A0" }}>{this.props.reply.replyer_name}</Text>
                                {this.props.reply.type_extern ? <View style={{ flexDirection: 'row', }}>
                                    <Icon type={"Entypo"} name={'dot-single'} style={{ color: '#1FABAB', marginTop: '-9%' }}></Icon>
                                    <Text note style={{ fontWeight: 'bold', fontStyle: 'italic', }}>{` ${this.props.reply.type_extern}`}</Text>
                                </View> : null}
                            </View>
                            {this.props.reply.type_extern && this.props.reply.audio ? <Text style={{ fontWeight: 'bold', fontSize: 12, color:"#A91A84" }}>{this.props.reply.title.length > 26 ? this.props.reply.title.slice(0, 26) + " ..." : this.props.reply.title}</Text> : null}
                            {this.props.reply.audio || this.props.reply.file ? <View style={{ display: "flex", flexDirection: 'row', }}>
                                <Icon type={this.props.reply.audio ? "MaterialIcons" : "MaterialCommunityIcons"}
                                    name={this.props.reply.audio ? "audiotrack" : "file-document-box"} style={{ marginRight: "30%", color: "#1FABAF" }}></Icon>
                                <View style={{ marginTop: this.props.reply.audio ? "2%" : "0%" }}>{this.props.reply.audio ?
                                    <Text>{this.convertToHMS(this.props.reply.type_extern === "HighLights" ? this.props.reply.url.duration : this.props.reply.duration)}</Text> :
                                    <Text style={{ fontSize: 30, }}>{this.props.reply.typer.toUpperCase()}</Text>}</View>
                            </View> : <View style={{ display: 'flex', flexDirection: 'row', }}>
                                    <View style={{ /*width: this.props.reply.sourcer ? "20%" : "0%",*/ marginRight: "1%", }}>
                                        {this.props.reply.sourcer ? <View><Image width={100} height={40} thumbnails square style={{
                                            // width: "100%",
                                            height: 40, borderRadius: 5,
                                        }} source={{ uri: this.props.reply.sourcer }}></Image>
                                            {this.props.reply.video ? <Icon type={"EvilIcons"} name={"play"} style={{
                                                position: "absolute", color: "#1FABAF",
                                                marginTop: "15%", marginLeft: "30%",
                                            }}></Icon> : null}</View> : null}

                                    </View>
                                    <View style={{ /*width: this.props.reply.sourcer ? "79%" : "100%",*/ alignSelf: 'center',
                                        marginLeft: this.props.reply.sourcer ? 10 : null,
                                    }}>
                                        {this.props.reply.title ? <Text style={{ fontWeight: 'bold', fontSize: 12, color: "#A91A84"}}>{this.props.reply.title.length > 26 ? this.props.reply.title.slice(0, 26) + " ..." : this.props.reply.title}</Text> : <Text style={{ color: "#81A8A0" }}>{this.props.reply.text.slice(0,
                                            this.props.reply.sourcer ? 20 : 25)} {this.props.reply.text.length > 25 ? this.props.reply.text.length > 25 ? '...' : '' : ''}</Text>}
                                    </View>
                                </View>}
                        </View>
                        {/*<View style={{ /*width: "5%" }}><Icon type="FontAwesome"
                                    style={{ fontSize: 12, color: "#1FABAB" }} name="quote-right"></Icon></View>*/}
                    </View>
                </View>
            </TouchableNativeFeedback>
        )
    }
}