import React, { Component } from "react"
import { View, TouchableOpacity } from 'react-native';
import { Text, Left, Title } from 'native-base';
import autobind from "autobind-decorator";
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
    writeInterval(frequency) {
        switch (frequency) {
            case 'daily':
                return 'day(s)';
            case 'weekly':
                return 'week(s)';
            case 'monthly':
                return 'month(s)';
            case 'yearly':
                return 'year(s)';
            default:
                return ''
        }
    }
    dateDiff(event) {
        let statDate = moment(event.period)
        let end = moment(event.recurrence?event.recurrence:null)
        return daysDiff = Math.floor(moment.duration(end.diff(statDate)).asDays())
    }
    writeDateTime(event) {
        let date = event.period
        let statDate = moment(date)
        let end = moment(typeof event.recurrence === "string" ? event.recurrence : null)
        let daysDiff = Math.floor(moment.duration(end.diff(statDate)).asDays())
        if (daysDiff == 0) {
            return "Started Today At " + moment(date).format("h:mm a");
        } else if (daysDiff == 1) {
            return "Ended Yesterday at " + moment(date).format("h:mm a")
        } else if (daysDiff > 1 && daysDiff < 7) {
            return `Ended ${Math.abs(daysDiff)} Days Ago at ` + moment(date).format("h:mm a")
        } else if (daysDiff == 7) {
            return "Ended 1 Week Ago at " + moment(date).format("h:mm a")
        } else if (daysDiff == -1) {
            return "Starting Tomorrow at " + moment(date).format("h:mm a");
        }
        else if (daysDiff < -1) {
            return `Starting in ${Math.abs(daysDiff)} Days at ` + moment(date).format("h:mm a");
        } else {
            return `Ended on ${moment(date).format("dddd, MMMM Do YYYY")} at ${moment(date).format("h:mm a")}`
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
                                    color: this.props.Event.closed ? "red" : this.dateDiff(this.props.Event) > 0 ? "gray" : "#1FABAB",
                                    fontStyle: 'italic',
                                    fontWeight: this.props.Event.closed ? "bold" : '400',
                                }}
                                note
                            >
                                {this.props.Event.closed ? "Closed" : this.writeDateTime(this.props.Event)}
                            </Title> : null}
                        </View>
                        <View style={{marginLeft: '-5.5%',}}>
                            <Left>
                                {this.props.Event.interval > 1 && this.props.Event.frequency !== 'yearly' && this.dateDiff(this.props.Event) < 0? <View style={
                                    {
                                        flexDirection: "column"
                                    }
                                }>
                                    <View>
                                        <Text style={{
                                            //color: "#1FABAB"
                                            fontStyle: 'italic',
                                        }} note>
                                            {`after every ${this.props.Event.interval > 1 ? this.props.Event.interval : null} ${this.writeInterval(this.props.Event.frequency)} till ${moment(this.props.Event.recurrence ? this.props.Event.recurrence : null).format("dddd, MMMM Do YYYY")}`}
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