import React, { PureComponent } from "react";
import Modal from "react-native-modalbox";
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import CacheImages from "../../CacheImages";
import testForURL from "../../../services/testForURL";
import ProfileView from "../invitations/components/ProfileView";
import ColorList from "../../colorList";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import rounder from "../../../services/rounder";
import shadower from "../../shadower";
import GState from "../../../stores/globalState";
import moment from "moment"
import { writeChange } from '../changelogs/change.services';
export default class NotificationModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            members: [],
            opened: false,
        };
        this.writeChange  = writeChange.bind(this)
    }
    state = {};
    componentDidMount() { }
    _keyExtractor = (item, index) => {
        return item ? item.phone : null;
    };
    render() {
        return (
            <View
                style={{
                    position: "absolute",
                    width: "100%",
                    height: 300,
                    flexDirection: "row",
                    paddingRight: "2%",
                    paddingTop: "2%",
                    justifyContent: "flex-end",
                }}
            >
                <TouchableWithoutFeedback
                    onPress={() =>
                        requestAnimationFrame(() => {
                            this.props.onPress();
                        })
                    }
                >
                    <View style={{
                        maxHeight: 250,
                        borderRadius: 10,
                        ...shadower(2),
                        backgroundColor: ColorList.bodyBackground,
                        width: "70%",
                        padding: "1%",
                        alignSelf: "flex-start",
                    }}>
                        <View style={{ flexDirection: "column" }}>
                            <View style={{
                                flexDirection: "row",
                                alignSelf: 'center',
                                justifyContent: 'space-between', height: 50, alignItems: 'center',
                            }}>
                                <View style={{ flex: 1, }}>
                                    <ProfileView phone={this.props.change.updater}></ProfileView>
                                </View>
                                <View style={{ marginRight: '3%', }}>
                                    <TouchableOpacity
                                        style={{
                                            ...rounder(35, ColorList.bodyDarkWhite)
                                        }}
                                        onPress={() =>
                                            requestAnimationFrame(() => {
                                                console.warn("pressing !!!");
                                                this.props.close();
                                            })
                                        }
                                    >
                                        <EvilIcons style={{
                                            ...GState.defaultIconSize
                                        }} name={"close"} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: "column",
                                }}
                            >
                                <View style={{ flexDirection: "row", marginBottom: "2%" }}>
                                    <Text
                                        ellipsizeMode="tail"
                                        numberOfLines={1}
                                        style={{ fontWeight: "bold", ...GState.defaultTextStyle }}
                                    >
                                        {this.props.change && this.props.change.changed}
                                    </Text>
                                </View>
                                <Text
                                    ellipsizeMode="tail"
                                    style={{
                                        fontSize: 12,
                                        fontStyle: "italic",
                                        ...GState.defaultTextStyle
                                    }}
                                    numberOfLines={1}
                                >
                                    {this.writeChange()}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    smallthumbnail: {
        ...rounder(20, ColorList.bodyBackground),
        ...shadower(2),
    },
});
