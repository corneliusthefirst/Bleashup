import React, { Component } from "react";
import { View, Animated, TouchableWithoutFeedback } from 'react-native';
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import UpdateStateIndicator from "../currentevents/components/updateStateIndicator";
import { List, Icon, Label, Card, CardItem, Text, Header, Thumbnail, Title } from 'native-base';
import InvitationModal from "../currentevents/components/InvitationModal";
import autobind from "autobind-decorator";
import { observer } from "mobx-react";
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import stores from "../../../stores";
import CacheImages from "../../CacheImages";
import { Image } from 'react-native-svg';
import RouteView from "./RouteView";
import ActionsView from "./ActionsView";
import Commitee from "./Commitee";
const HEADER_MAX_HEIGHT = 160;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
export default class SWView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scrollY: new Animated.Value(0),
        }
    }
    width = "9%"
    padding = "9%"
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
                this.props.navigation.navigate("ChangeLogs", { ...this.props })
            } else {
                this.setState({ isDetailsModalOpened: true })
            }
            this.props.seen()
        })
    }
    invite() {
        this.setState({
            openInviteModal: true
        })
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
    actionColor = "#1FABAB"
    fontSize = 18
    textSize = 14
    actionHeight = "14.5%"
    height = "16%"
    original = "#1FABAB"
    transparent = "rgba(52, 52, 52, 0.0)";
    blinkerSize = 26;
    render() {
        return (
            <View>
                <ScrollView showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
                    )}>
                    <View style={{
                        marginTop: HEADER_MAX_HEIGHT,
                        height: 1000, width: "100%", backgroundColor: "#FEFFDE",
                    }}>
                    </View>
                    <View style={{paddingTop:200+300}}>
                    <Commitee></Commitee>
                    </View>
                </ScrollView>
                <Animated.View style={[{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#1FABAB',
                    overflow: 'hidden',
                }, {
                    height: this.state.scrollY.interpolate({
                        inputRange: [0, HEADER_SCROLL_DISTANCE],
                        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
                        extrapolate: 'clamp',
                    })
                }]}>
                    <View style={{
                        height: "100%",
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}><CacheImages thumbnails square style={{ width: this.props.width, height: "100%" }}
                        source={{ uri: this.props.event.background }}></CacheImages>
                    </View>
                </Animated.View>
                <Animated.View style={[{ display: 'flex', flexDirection: 'column', paddingTop: "-2.5%", position: "absolute" }, {
                    marginTop: this.state.scrollY.interpolate({
                        inputRange: [0, HEADER_SCROLL_DISTANCE],
                        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
                        extrapolate: 'clamp',
                    }),
                }]}>
                    <View style={{ display: "flex", flexDirection: 'row', }}>
                        <View style={{ marginTop: "2%", width: "25%", borderWidth: 2, borderColor: this.actionColor, borderRadius: 12, }}>
                           <ActionsView></ActionsView>
                        </View>
                        <View style={{ width: "5%", }}></View>
                        <View style={{ width: "70%" }}>
                           <RouteView currentPage={this.props.currentPage} setCurrentPage={(page)=> this.props.setCurrentPage(page)}></RouteView>
                        </View>
                    </View>
                    <View style={{ borderTopRightRadius: 15, borderBottomRightRadius: 15, marginTop: "15%", backgroundColor: "#1FABAB", height: 30, width: "100%" }}>
                        <Text style={{ marginTop: "1.5%", alignSelf: 'center', }}>Commitees</Text>
                    </View>
                </Animated.View>
            </View>
        );
    }
}