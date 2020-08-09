import React, { PureComponent } from "react";
import Modal from "react-native-modalbox";
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import CacheImages from "../../CacheImages";
import testForURL from "../../../services/testForURL";
import ProfileView from "../invitations/components/ProfileView";
import ColorList from "../../colorList";
import EvilIcons  from 'react-native-vector-icons/EvilIcons';
import rounder from '../../../services/rounder';
import shadower from "../../shadower";
export default class NotificationModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            members: [],
            opened: false,
        };
    }
    state = {};
    componentDidMount() { }
    _keyExtractor = (item, index) => {
        return item ? item.phone : null;
    };
    render() {
        return (
            <Modal
                backdropPressToClose={true}
                backdropOpacity={0}
                swipeToClose={true}
                backButtonClose={true}
                position={"top"}
                entry={"top"}
                //coverScreen={false}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.setState({
                        members: [],
                        checked: [],
                        opened: false,
                        check: true,
                    });
                }}
                onOpened={() => {
                    setTimeout(() => {
                        this.setState({
                            opened: true,
                            checked: this.props.members,
                            members: this.props.members,
                            check: this.props.notcheckall ? false : true,
                        });
                        this.props.close();
                    }, 50);
                }}
                style={{
                    height: "128%",
                    borderRadius: 10,
                    borderWidth: 1.5,
                    marginLeft: "14%",
                    borderColor: ColorList.bodyDarkWhite,
                    borderBottomRightRadius: 8,
                    backgroundColor: ColorList.indicatorInverted,
                    width: "70%",
                }}
            >
                {this.state.opened ? (
                    <TouchableWithoutFeedback
                        onPress={() =>
                            requestAnimationFrame(() => {
                                this.props.onPress();
                            })
                        }
                    >
                        <View style={{ margin: "2%" }}>
                            <View style={{ flexDirection: "column" }}>
                                <View style={{ margin: "2%" }}>
                                    <Text style={{ fontStyle: "italic" }} note>
                                        New Update
                  </Text>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ width: "90%" }}>
                                        <ProfileView
                                            phone={this.props.change.updater}
                                        ></ProfileView>
                                    </View>
                                    <View style={{ width: "10%" }}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                requestAnimationFrame(() => {
                                                    console.warn("pressing !!!");
                                                    this.props.close();
                                                })
                                            }
                                        >
                                            <EvilIcons name={"close"}/>
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
                                            style={{ fontWeight: "bold" }}
                                        >
                                            {this.props.change && this.props.change.changed}
                                        </Text>
                                    </View>
                                    <Text
                                        ellipsizeMode="tail"
                                        style={{ fontSize: 12, fontStyle: "italic" }}
                                        numberOfLines={1}
                                    >
                                        {this.props.change.new_value && 
                                            this.props.change.new_value.new_value && 
                                            typeof this.props.change.new_value.new_value === "string"
                                            ? this.props.change.new_value.new_value
                                            : ""}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                ) : null}
            </Modal>
        );

    }
}

const styles = StyleSheet.create({
    smallthumbnail:{
        ...rounder(20,ColorList.bodyBackground),
        ...shadower(2)
    }   
})