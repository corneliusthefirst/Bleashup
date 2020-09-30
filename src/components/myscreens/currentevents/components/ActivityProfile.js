import React, { Component } from "react";

import { TouchableOpacity, View } from "react-native";
import TitleView from "./TitleView";
import CacheImages from "../../../CacheImages";
import ColorList from '../../../colorList';
import rounder from "../../../../services/rounder";
import BePureComponent from '../../../BePureComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BeComponent from '../../../BeComponent';
import testForURL from '../../../../services/testForURL';
import active_types from "../../eventChat/activity_types";
export default class ActivityProfile extends BeComponent {
    constructor(props) {
        super(props);
    }
    render() {
        let isRelation = this.props.Event.type == active_types.relation
        return (
            <View
                style={{ flexDirection: "row",  alignSelf: 'flex-start', }}
            >
                {isRelation ? null : <TouchableOpacity
                    style={{
                        alignSelf: "flex-start",
                        width: "15%",
                        alignItems: "center",
                    }}
                    onPress={() =>
                       this.props.onPress||( this.props.Event.background &&
                        this.props.showPhoto &&
                        this.props.showPhoto(this.props.Event.background))
                    }
                >
                    <View
                        style={{
                            alignSelf: "flex-start",
                            width: "100%",
                            flexDirection: 'row',
                            alignItems: "center",
                        }}
                    >
                        {testForURL(this.props.Event.background) ? (
                            <CacheImages
                                staySmall
                                dim={this.props.dim}
                                small={this.props.small ? true : false}
                                thumbnails
                                source={{ uri: this.props.Event.background }}

                            ></CacheImages>
                        ) : (<View style={{
                            ...rounder(40, ColorList.photoPlaceHolderColor)
                        }}>
                            <AntDesign name={"calendar"} style={{
                                alignSelf: 'center',
                                color: ColorList.bodyBackground,
                                fontSize: ColorList.profilePlaceHolderHeight - 10,
                            }} />
                        </View>
                            )}
                    </View>
                </TouchableOpacity>}
                <View
                    style={{
                        width: isRelation?"90%": "75%",
                        flexDirection: 'column',
                        height:isRelation? 50:null,
                        justifyContent: 'center',
                        paddingLeft: 10,
                    }}
                >
                    <TitleView
                        onPress={this.props.onPress}
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
