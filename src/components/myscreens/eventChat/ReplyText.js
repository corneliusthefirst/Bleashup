import React, { Component } from "react"
import { TouchableOpacity, View } from 'react-native';
import { Text, Icon } from "native-base"
import CacheImages from "../../CacheImages";
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
            <TouchableOpacity onPress={() => this.props.openReply(this.props.reply)}>
                <View style={{
                    display: 'flex', flexDirection: 'row', borderBottomWidth: 0,
                    backgroundColor: "rgba(34, 0, 0, 0.1)", marginLeft: "1%",
                    marginBottom: "1%", padding: "3%",
                    height:75,
                    borderRadius: 15, borderWidth: 1, borderColor: "#1FABAF",
                }}>
                    <View style={{ width: "5%" }}><Icon type="FontAwesome"
                        style={{ fontSize: 12, color: "#1FABAB" }} name="quote-left"></Icon>
                    </View>
                    <View style={{ width: "90%", }}>
                        <Text note style={{ marginBottom: "1%", color: "#81A8A0" }}>{"@"}{this.props.reply.replyer_name}</Text>
                        {this.props.reply.audio || this.props.reply.file ? <View style={{ display: "flex", flexDirection: 'row', }}>
                            <Icon type={this.props.reply.audio ? "MaterialIcons" : "MaterialCommunityIcons"}
                                name={this.props.reply.audio ? "audiotrack" : "file-document-box"} style={{ marginRight: "50%", color: "#1FABAF" }}></Icon>
                            <View style={{ marginTop: this.props.reply.audio ? "2%" : "0%" }}>{this.props.reply.audio ?
                                <Text>{this.convertToHMS(this.props.reply.duration)}</Text> : <Text style={{ fontSize: 30, }}>{this.props.reply.typer.toUpperCase()}</Text>}</View>
                        </View> : <View style={{ display: 'flex', flexDirection: 'row', }}>
                                <View style={{ width: this.props.reply.sourcer ? "20%" : "0%", marginRight: "1%", }}>
                                    {this.props.reply.sourcer ? <View><CacheImages thumbnails square style={{
                                        width: "100%",
                                        height: 40, borderRadius: 5,
                                    }} source={{ uri: this.props.reply.sourcer }}></CacheImages>
                                        {this.props.reply.video ? <Icon type={"EvilIcons"} name={"play"} style={{
                                            position: "absolute", color: "#1FABAF",
                                            marginTop: "15%", marginLeft: "30%",
                                        }}></Icon> : null}</View> : null}

                                </View>
                                <View style={{ width: this.props.reply.sourcer ? "79%" : "100%" }}>
                                    <Text note style={{ color: "#81A8A0" }}>{this.props.reply.text.slice(0, 
                                        this.props.reply.sourcer ? 100 : 200)} {this.props.reply.text.length > 100 ? '...' : ''}</Text>
                                </View>
                            </View>}
                    </View>
                    <View style={{ width: "5%" }}><Icon type="FontAwesome"
                        style={{ fontSize: 12, color: "#1FABAB" }} name="quote-right"></Icon></View>
                </View>
            </TouchableOpacity>
        )
    }
}