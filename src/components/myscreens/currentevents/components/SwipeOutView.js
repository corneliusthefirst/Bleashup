import React, { Component } from "react";
import { View, TouchableOpacity} from 'react-native';
import UpdateStateIndicator from "./updateStateIndicator";
import InvitationModal from "./InvitationModal";
import stores from "../../../../stores";
import shadower from "../../../shadower";
import colorList from "../../../colorList";
import Toaster from "../../../../services/Toaster";
import MaterialIconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import ActivityPages from '../../eventChat/chatPages';


export default class SwipeOutView extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    width = "50%"
    padding = "8%"
    indicatorMargin = {
        marginLeft: "5%",
        marginTop: "-7%",
        position: 'absolute',

    };

     navigateToEventChat() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate("Event", {
                    Event: this.props.Event,
                    tab: ActivityPages.chat
                });
            } else {
                Toaster({
                    text: "please join the event to see the updates about !",
                    buttonText: "ok"
                })
            }
            this.props.seen()
        })
    }
    navigateToLogs() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate("Event", {
                    ...this.props,
                    Event: this.props.Event,
                    tab: ActivityPages.logs
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
    navigateToEventDetails() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate("Event", {
                    Event: this.props.Event,
                    tab: ActivityPages.starts
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
            <View style={{ width: "99%", 
            borderRadius: 4,
            ...shadower(2) ,
            height:'99.5%',
            backgroundColor:colorList.bodyBackground,
            alignItems:"center"
        }}>
                <View style={{flexDirection: 'column',justifyContent:"space-around" }}>
                    <View style={{ height: this.width,alignItems:"center" }}>
                        <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                            this.props.publish()
                        })
                        } style={{ flexDirection:"column",alignItems:"center" }}>
                            <MaterialIconCommunity style={{ fontSize: 35, color: this.props.Event.public || this.props.master ? colorList.bodyIcon : "#bfc6ea" }} name="share-outline" type="MaterialCommunityIcons"/>
                            <Text style={{ fontSize: 14, color: this.props.Event.public || this.props.master ? colorList.bodySubtext : "#bfc6ea"}}>Share</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: this.width,flexDirection:"column",alignItems:"center" }}>
                        {<TouchableOpacity onPress={() => requestAnimationFrame(() => {
                            this.invite()
                        })
                        } style={{flexDirection:"column",alignItems:"center" }}>
                            <EvilIcons style={{ fontSize: 40, color: this.props.Event.public || this.props.master ? colorList.bodyIcon : "#bfc6ea" }} name="sc-telegram" type="EvilIcons"/>
                            <Text style={{ fontSize: 14, color: this.props.master || this.props.Event.public ? colorList.bodySubtext : "#bfc6ea" }}>Invite</Text>
                        </TouchableOpacity>}
                    </View>
                </View>
            </View>
        );
    }
}