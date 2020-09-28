import React, { Component } from "react"
import { View, TouchableOpacity, Text } from 'react-native';
import UpdateStateIndicator from "./updateStateIndicator";
import stores from "../../../../stores";
import Toaster from "../../../../services/Toaster";
import ActivityPages from '../../eventChat/chatPages';

export default class Options extends Component {
    constructor(props) {
        super(props)
    }
    navigateToContributions() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate("Event", {
                    Event: this.props.Event,
                    tab: "Contributions"
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
    blinkerSize = 26;
    transparent = "rgba(52, 52, 52, 0.0)";
    indicatorMargin = {
        marginLeft: "5%",
        marginTop: "-7%",
        position: 'absolute',

    };
    others = {
        alignSelf: 'center',
    }

    width = "50%"
    navigateToReminds() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate("Event", {
                    Event: this.props.Event,
                    tab: ActivityPages.reminds
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
    render() {
        return (

            <View style={{
                flexDirection: "row",
                width: '100%',
                height: "100%",
            }}>
                <TouchableOpacity style={{ width: "50%", height: "100%", justifyContent: "center" }} onPress={() => requestAnimationFrame(() => this.navigateToReminds())}>

                    <View style={{ alignSelf: 'flex-end', }}>
                        <Text style={{
                            color: "#1FABAB",
                            fontSize: 17,
                            fontWeight: 'bold',
                            alignSelf: 'center',
                        }} note>reminds</Text>

                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}
