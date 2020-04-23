import React, { Component } from "react";
import { View } from "react-native";
import Like from "../../../currentevents/components/Like";
import { Icon, Text } from "native-base";
import ColorList from "../../../../colorList";

export default class Social extends Component {
    constructor(props) {
        super(props);
        this.state = {
            likesCount:0,
            commentCount:0,
            supportCount: 0
        }
    }
    state = {}
    itemStyle = {
        flex: 1,
        marginBottom: "auto",
        marginTop: "auto",
        alignSelf: "center",
        justifyContent: "center",
    };
    render() {
        return (
            <View style={{ width: "100%", margin: 3,}}>
            <View style={{margin:'2%'}}>
            <Text note>{`${this.state.likesCount} like(s), ${this.state.commentCount} comment(s), ${this.state.supportCount} supports`}</Text>
            </View>
                <View style={{  flexDirection: "row" }}>
                    <View style={{ flex: 3, flexDirection: "row" }}>
                        <View style={this.itemStyle}>
                            <Like setLikesCount={(count) => {
                                this.setState({
                                    likesCount: this.state.likesCount + count
                                })
                            }} id={this.props.id}></Like>
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                        <View style={this.itemStyle}>
                            <Icon
                                name="reply"
                                type="Entypo"
                                onPress={this.props.reply}
                                style={{ color: ColorList.headerIcon }}
                            ></Icon>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
