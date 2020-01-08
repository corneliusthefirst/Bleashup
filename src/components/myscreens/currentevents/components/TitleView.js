import React, { Component } from "react"
import { View, TouchableOpacity } from 'react-native';
import { Text, Left, Title } from 'native-base';
import autobind from "autobind-decorator";
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient'
import Svg, { Circle, Rect } from 'react-native-svg'
import stores from "../../../../stores";
import DetailsModal from "../../invitations/components/DetailsModal";
import { forEach, find } from "lodash"
import moment from "moment";
export default class TitleView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isDetailsModalOpened: false,
            isJoining: false

        }
    }
    componentDidMount() {
    }
    navigateToEventDetails() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate("Event", {
                    Event: find(stores.Events.events, { id: this.props.Event.id }),
                    tab: "EventDetails"
                });
            } else {
                this.props.openDetail()
            }
            this.props.seen()
        })
    }
    dateDiff(date) {
        let statDate = moment(date)
        let end = moment()
        return daysDiff = Math.floor(moment.duration(end.diff(statDate)).asDays())
    }
    writeDateTime(date) {
        let statDate = moment(date)
        let end = moment()
        let daysDiff = Math.floor(moment.duration(end.diff(statDate)).asDays())
        if (daysDiff == 0) {
            return "Ongoing Today from " + moment(date).format("h:mm a");
        } else if (daysDiff == 1) {
            return "Past Since Yesterday at " + moment(date).format("h:mm a")
        } else if (daysDiff > 1 && daysDiff < 7) {
            return `Past Since ${Math.abs(daysDiff)} Days Ago at ` + moment(date).format("h:mm a")
        } else if (daysDiff == 7) {
            return "Past Since 1 Week Ago at " + moment(date).format("h:mm a")
        } else if (daysDiff == -1) {
            return "Upcoming Tomorrow at " + moment(date).format("h:mm a");
        }
        else if (daysDiff < -1) {
            return `Upcoming in ${Math.abs(daysDiff)} Days at ` + moment(date).format("h:mm a");
        } else {
            return `Past since ${moment(date).format("dddd, MMMM Do YYYY")} at ${moment(date).format("h:mm a")}`
        }
    }
    render() {
        return <View>
            <View style={{

            }}>
                <View>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                        this.navigateToEventDetails()
                    }
                    )}>
                        <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
                            <Title
                                adjustsFontSizeToFit={true}
                                style={{
                                    fontSize: 20,
                                    color: "#0A4E52",
                                    fontWeight: "500",
                                    fontFamily: "Roboto",
                                }}
                            >
                                {this.props.Event.about.title}{/*{" "}{this.props.Event.id}*/}
                            </Title>
                            {this.props.Event.period ? <Title
                                style={{
                                    fontSize: 12,
                                    color: this.props.Event.closed ? "red" : this.dateDiff(this.props.Event.period) > 0 ? "gray" : "#1FABAB",
                                    fontStyle: 'italic',
                                    fontWeight: this.props.Event.closed ? "bold" : '400',
                                }}
                                note
                            >
                                {this.props.Event.closed ? "Closed" : this.writeDateTime(this.props.Event.period)}
                            </Title> : null}
                        </View>
                        <View>
                            <Left>
                                {this.props.Event.recursive ? <View style={
                                    {
                                        flexDirection: "column"
                                    }
                                }>
                                    <View>
                                        <Text style={{
                                            color: "#1FABAB"
                                        }} note>
                                            {this.props.Event.recursion.type}
                                        </Text>
                                    </View>

                                    <View>
                                        <Text note>
                                            {this.props.Event.recursion.days}
                                        </Text>
                                    </View>
                                </View> : null}
                            </Left>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    }
}