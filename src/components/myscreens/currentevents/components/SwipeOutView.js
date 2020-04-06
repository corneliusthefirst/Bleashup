import React, { Component } from "react";
import { View } from 'react-native';
import { TouchableOpacity } from "react-native-gesture-handler";
import UpdateStateIndicator from "./updateStateIndicator";
import { List, ListItem, Icon, Label } from 'native-base';
import InvitationModal from "./InvitationModal";
import autobind from "autobind-decorator";
import { findIndex } from "lodash"
import { observer } from "mobx-react";
import stores from "../../../../stores";
import shadower from "../../../shadower";
import colorList from "../../../colorList";


export default class SwipeOutView extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    width = "24%"
    padding = "8%"
    indicatorMargin = {
        marginLeft: "5%",
        marginTop: "-7%",
        position: 'absolute',

    };

    @autobind navigateToEventChat() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate("Event", {
                    Event: this.props.Event,
                    tab: "EventChat"
                });
            } else {
                Toast.show({
                    text: "please join the event to see the updates about !",
                    buttonText: "ok"
                })
            }
            this.props.seen()
        })
    }
    @autobind navigateToLogs() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate("Event", {
                    ...this.props,
                    Event: this.props.Event,
                    tab: "ChangeLogs"
                })
            } else {
                this.setState({ isDetailsModalOpened: true })
            }
            this.props.seen()
        })
    }
    color = "#0A4E52"
    invite() {
        this.props.openInvitationModal()
    }
    @autobind navigateToEventDetails() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate("Event", {
                    Event: this.props.Event,
                    tab: "EventDetails"
                });
            } else {
                this.setState({ isDetailsModalOpened: true })
            }
            this.props.seen()
        })
    }
    transparent = "rgba(52, 52, 52, 0.0)";
    blinkerSize = 26;
    render() {
        return (
            <View style={{ width: "99%", borderRadius: 4,...shadower(2) ,height:'99.5%',backgroundColor:colorList.bodyBackground,alignItems:"center"}}>
                <View style={{ flex:1, flexDirection: 'column',justifyContent:"space-between" }}>
                   
                    <View style={{ height: this.width,alignItems:"center" }}>
                        <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                            this.props.publish()
                        })
                        } style={{ flexDirection:"column",alignItems:"center" }}>
                            <Icon style={{ fontSize: 35, color: this.props.Event.public || this.props.master ? colorList.bodyIcon : "#bfc6ea" }} name="share-outline" type="MaterialCommunityIcons">
                            </Icon>
                            <Label style={{ fontSize: 14, color: this.props.Event.public || this.props.master ? colorList.bodySubtext : "#bfc6ea"}}>Share</Label>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: this.width,flexDirection:"column",alignItems:"center" }}>
                        {<TouchableOpacity onPress={() => requestAnimationFrame(() => {
                            this.invite()
                        })
                        } style={{flexDirection:"column",alignItems:"center" }}>
                            <Icon style={{ fontSize: 40, color: this.props.Event.public || this.props.master ? colorList.bodyIcon : "#bfc6ea" }} name="sc-telegram" type="EvilIcons"></Icon>
                            <Label style={{ fontSize: 14, color: this.props.master || this.props.Event.public ? colorList.bodySubtext : "#bfc6ea" }}>Invite</Label>
                        </TouchableOpacity>}
                    </View>


                    <View style={{ height: this.width,flexDirection:"column",alignItems:"center" }}>
                        {<TouchableOpacity onPress={() => {
                            this.props.join()
                        }}>
                            <Icon style={{alignSelf:"center", fontSize: 30, color: findIndex(this.props.Event.participant, { phone: stores.LoginStore.user.phone }) >= 0 ? "#1FABAB" : colorList.bodyIcon }} name="account-group-outline"
                                type="MaterialCommunityIcons">
                            </Icon>
                            <Label style={{
                                color: findIndex(this.props.Event.participant, { phone: stores.LoginStore.user.phone }) >= 0 ? "#1FABAB" :  colorList.bodyIcon ,
                                fontSize: 14,
                            }}
                            >
                                {findIndex(this.props.Event.participant, { phone: stores.LoginStore.user.phone }) >= 0 ? "Joined" : "Join"}
                            </Label>
                        </TouchableOpacity>}

                    </View>

                    <View style={{ height: this.width,flexDirection:"column",alignItems:"center"}}>
                        <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                            this.navigateToLogs()
                        })
                        }>
                            <Icon style={{ fontSize: 30, color:colorList.bodyIcon}} name="clockcircleo" type="AntDesign"></Icon>
                            {this.props.Event.upated ? (
                                <View style={this.indicatorMargin}>
                                    <UpdateStateIndicator size={this.blinkerSize} />
                                </View>
                            ) : (
                                    <View style={this.indicatorMargin}>
                                        <UpdateStateIndicator
                                            size={this.blinkerSize}
                                            color={this.transparent}
                                        />
                                    </View>
                                )}
                            <Label style={{ fontSize: 14, color:colorList.bodySubtext,marginLeft:2 }}>{"Logs"}</Label>
                        </TouchableOpacity>
                    </View >
                    {/*<View style={{ height: this.width, marginBottom: "9%", alignSelf: 'flex-start' }}>
                        <TouchableOpacity onPress={() => {
                            return this.props.hide()
                        }}>
                            <Icon style={{ fontSize: 20, color: "#1FABAB" }} name="archive" type="EvilIcons">
                            </Icon>
                            <Label style={{ fontSize: 14, color: "#1FABAB" }}>Hide</Label>
                        </TouchableOpacity>
                    </View>*/}
                    {/*<View style={{ height: this.width, marginBottom: "9%", marginLeft: '10%' }}>
                        <TouchableOpacity onPress={() => {
                            return this.props.delete()
                        }}>
                            <Icon name="trash" style={{ fontSize: 30, color: "red" }} type="EvilIcons">
                            </Icon>
                            <Label style={{ fontSize: 14, color: "red" }} >Delete</Label>
                        </TouchableOpacity>
                    </View>*/}
                </View>
            </View>
        );
    }
}