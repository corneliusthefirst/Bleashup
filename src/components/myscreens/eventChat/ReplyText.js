import React, { Component } from "react"
import { TouchableOpacity, View, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';
import { Text, Icon, Thumbnail } from "native-base"
import Image from 'react-native-scalable-image';
import CacheImages from "../../CacheImages";
import moment from "moment";
import converToHMS from '../highlights_details/convertToHMS';
import shadower from "../../shadower";
import testForURL from '../../../services/testForURL';
import ProfileModal from "../invitations/components/ProfileModal";
import buttoner from "../../../services/buttoner";
import ColorList from '../../colorList';
let stores = null
export default class ReplyText extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    state = {}
    showReplyer() {
        this.props.showProfile(this.props.reply.replyer_phone || this.props.reply.sender.phone.replace("+", "00"))
    }
    render() {
        return (
            <TouchableWithoutFeedback
                onPressIn={() => this.props.pressingIn()}
                onLongPress={() => this.props.handLongPress ? this.props.handLongPress() : null}
                onPress={() => this.props.openReply(this.props.reply)}>
                <View style={{
                    display: 'flex', flexDirection: 'row', 
                    borderBottomWidth: 0,
                    backgroundColor: this.props.color,
                     backgroundColor: "rgba(34, 0, 0, 0.1)",
                    padding: "1%",//margin: '1%',
                    minHeight: 50,
                    maxHeight: 350,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                }}>
                    {
                        /*<View style={{ /*width: "5%" }}><Icon type="FontAwesome"
                            style={{ fontSize: 12, color: "#1FABAB" }} name="quote-left"></Icon>
                        </View>*/
                    }
                    <View style={{/* width: "90%",*/
                        width: this.props.compose ? '100%' : null,
                    }}>
                        <View style={{ margin: "1%", }}>
                            <TouchableOpacity onLongPress={this.props.handLongPress} onPressIn={() => this.props.pressingIn()} onPress={() => requestAnimationFrame(() => {
                                this.props.reply.replyer_name && (this.props.reply.replyer_phone ||
                                    this.props.reply.sender.phone) ? this.showReplyer() : this.props.openReply(this.props.reply)
                            })
                            }>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text note ellipsizeMode={'tail'} numberOfLines={1} style={{ marginBottom: "1%",fontWeight: 'bold', color: ColorList.indicatorColor,maxWidth: '25%' }}>{`${this.props.reply.replyer_name ? this.props.reply.replyer_name : this.props.reply.type_extern}: `}</Text>
                                    {this.props.reply.type_extern ? <View style={{ flexDirection: 'row',minWidth: '75%',maxWidth:'80%', }}>
                                        <Text ellipsizeMode={'tail'} numberOfLines={3}  style={{ fontWeight: 'bold',fontSize: 12, width:'100%'}}>{`${this.props.reply.replyer_name ?
                                            this.props.reply.type_extern : this.props.reply.title.split(': \n')[0]}`}</Text>
                                    </View> : null}
                                </View>
                            </TouchableOpacity>
                            <View>
                            </View>
                            {this.props.reply.audio || this.props.reply.file ? <View style={{ display: "flex", flexDirection: 'row', }}>
                                <Icon type={this.props.reply.audio ? "MaterialIcons" : "MaterialCommunityIcons"}
                                    name={this.props.reply.audio ? "audiotrack" : "file-document-box"} style={{ width: "14%", color: ColorList.indicatorColor }}></Icon>
                                {this.props.reply.type_extern && this.props.reply.audio ?
                                    <Text ellipsizeMode={'tail'} numberOfLines={4}
                                        style={{ fontWeight: 'bold', fontSize: 12, color: "#1F4237", width: '83%' }}>
                                        {this.props.reply.replyer_name ? this.props.reply.title : this.props.reply.title.split(': \n')[1]}</Text>
                                    : <View style={{ marginTop: this.props.reply.audio ? "2%" : "0%", width: '83%' }}>{this.props.reply.audio ?
                                        <Text ellipsizeMode={'tail'} numberOfLines={1}>{(this.props.reply.url && this.props.reply.url.duration) || this.props.reply.duration ? converToHMS(this.props.reply.type_extern === 'Posts' ?
                                            this.props.reply.url.duration : this.props.reply.duration) : null}</Text> :
                                        <Text ellipsizeMode={'tail'} numberOfLines={1} style={{ fontSize: 30, }}>{"."}{this.props.reply.typer.toUpperCase()}</Text>}</View>}
                            </View> : <View><View style={{ display: 'flex', flexDirection: 'row', }}>
                                <View style={{ /*width: this.props.reply.sourcer ? "20%" : "0%",*/ marginRight: "1%", }}>
                                    {this.props.reply.sourcer ? <View>{testForURL(this.props.reply.sourcer) ? <CacheImages thumbnails square style={{
                                        width: 70,
                                        minHeight: this.state.currentHeight > 50 ? this.state.currentHeight : 60,
                                        maxHeight: this.state.currentHeight > 50 ? this.state.currentHeight : 60,
                                        borderBottomRightRadius: 5, borderTopRightRadius: 5,
                                    }} source={{ uri: this.props.reply.sourcer }}></CacheImages> : <Thumbnail thumbnails square style={{
                                        width: 70,
                                        minHeight: this.state.currentHeight > 50 ? this.state.currentHeight : 60,
                                        maxHeight: this.state.currentHeight > 50 ? this.state.currentHeight : 60,
                                        borderBottomRightRadius: 5, borderTopRightRadius: 5,
                                        height: this.state.currentHeight, borderRadius: 5,
                                    }} source={{ uri: this.props.reply.sourcer }}></Thumbnail>}
                                            {this.props.reply.video ? <View style={{ ...buttoner, position: "absolute", marginTop: "7%", marginLeft: "18%",}}><Icon type={"EvilIcons"} name={"play"} style={{
                                             color: ColorList.bodyBackground,
                                        }}></Icon></View> : null}</View> : null}

                                </View>
                                <View onLayout={(e) => {
                                    this.setState({
                                        currentHeight: e.nativeEvent.layout.height
                                    })
                                }} style={{ /*width: this.props.reply.sourcer ? "79%" : "100%",*/ alignSelf: 'center',
                                    marginLeft: this.props.reply.sourcer ? '1%' : null,
                                    width: this.props.reply.sourcer ? '74%' : '94%'
                                }}>
                                    {this.props.reply.title ? <Text ellipsizeMode='tail' numberOfLines={this.props.reply.sourcer ?
                                            this.props.reply.replyer_name ? 13 : 15 : 15} style={{ fontSize: 12, color: "#1F4237", }}>{this.props.reply.replyer_name ? this.props.reply.title : this.props.reply.title.split(': \n')[1]}</Text>
                                        : this.props.reply.text ? <Text ellipsizeMode='tail' numberOfLines={this.props.reply.sourcer ?
                                            this.props.reply.replyer_name ? 13 : 14 : 14} style={{ fontSize: 12, }}>{this.props.reply.text}</Text> : null}
                                </View>
                            </View>
                                    {this.props.reply.change_date ? <Text note>{`On: ${moment(this.props.reply.change_date).format("dddd, MMMM Do YYYY, h:mm:ss a")}`}</Text> : null}
                                </View>}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}