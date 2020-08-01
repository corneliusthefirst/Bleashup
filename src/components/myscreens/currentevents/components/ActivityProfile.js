import React, { Component } from "react";

import { TouchableOpacity, View } from "react-native";
import TitleView from "./TitleView";
import CacheImages from "../../../CacheImages";
import ColorList from '../../../colorList';
import rounder from "../../../../services/rounder";
import BePureComponent from '../../../BePureComponent';
import  AntDesign  from 'react-native-vector-icons/AntDesign';
export default class ActivityProfile extends BePureComponent {
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
                                dim={this.props.dim}
                                small={this.props.small ? true : false}
                                thumbnails
                                source={{ uri: this.props.Event.background }}

                            ></CacheImages>
                        ) : (<View style={{
                            ...rounder(50,ColorList.photoPlaceHolderColor)
                        }}>
                                <AntDesign name={"calendar"} style={{
                                    alignSelf: 'center',
                                    color:ColorList.bodyBackground,
                                    fontSize: ColorList.profilePlaceHolderHeight - 10,
                                }}/>
                            </View>
                            )}
                    </View>
                </TouchableOpacity>

                <View
                    style={{
                        width: "75%",
                        paddingLeft: 6,
                        marginTop: "4.75%",
                        paddingLeft: "3%",
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
