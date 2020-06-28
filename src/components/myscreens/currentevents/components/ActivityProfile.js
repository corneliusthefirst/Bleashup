import React, { Component } from "react";

import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import TitleView from "./TitleView";
import CacheImages from "../../../CacheImages";
import { Thumbnail } from "native-base";
export default class ActivityProfile extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View
                style={{ flexDirection: "row", flexWrap: "wrap", }}
            >
                <TouchableOpacity
                    style={{
                        alignSelf: "flex-start",
                        width: "15%",
                        alignItems: "center",
                        paddingTop: "2%",
                    }}
                    onPress={() =>
                        this.props.Event.background &&
                        this.props.showPhoto &&
                        this.props.showPhoto(this.props.Event.background)
                    }
                >
                    <View
                        style={{
                            alignSelf: "flex-start",
                            width: "100%",
                            alignItems: "center",
                            paddingTop: "2%",
                        }}
                    >
                        {this.props.Event.background ? (
                            <CacheImages
                                staySmall
                                small={this.props.small ? true : false}
                                thumbnails
                                source={{ uri: this.props.Event.background }}

                            ></CacheImages>
                        ) : (
                                <Thumbnail
                                    small={this.props.small?true:false}
                                    source={require("../../../../../assets/default_event_image.jpeg")}
                                ></Thumbnail>
                            )}
                    </View>
                </TouchableOpacity>

                <View
                    style={{
                        width: "75%",
                        paddingLeft: 6,
                        marginTop: "4.75%",
                        paddingLeft: "6%",
                    }}
                >
                    <TitleView
                        searchString={this.props.searchString}
                        searching={this.props.searching}
                        Event={this.props.Event || {}}
                        openDetail={() =>
                            this.props.openDetails && this.props.openDetails(this.props.Event)
                        }
                        join={() => this.props.join && this.props.join()}
                        joint={this.props.joint}
                        seen={() => this.props.markAsSeen && this.props.markAsSeen()}
                    ></TitleView>
                </View>
            </View>
        );
    }
}
