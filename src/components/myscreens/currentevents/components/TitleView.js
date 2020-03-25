import React, { Component } from "react"
import { View, TouchableOpacity, Text } from 'react-native';
import { Left, Title } from 'native-base';
import autobind from "autobind-decorator";
import stores from "../../../../stores";
import DetailsModal from "../../invitations/components/DetailsModal";
import { forEach, find } from "lodash"
import moment from "moment";
import { writeInterval, writeDateTime, dateDiff } from '../../../../services/datesWriter';
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
        stores.Events.isParticipant(
            this.props.Event.id, 
            stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate("Event", {
                    Event: find(stores.Events.events, { id: this.props.Event.id }),
                    tab: "EventDetails"
                });
            } else {
               this.props.openDetail && this.props.openDetail()
            }
            this.props.seen && this.props.seen()
        })
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
                            <Text
                                adjustsFontSizeToFit={true}
                                ellipsizeMode={'tail'}
                                numberOfLines={1}
                                style={{
                                    fontSize: 20,
                                    fontWeight: "500",
                                    color: "#696969",
                                    fontFamily: "Roboto",
                                }}
                            >
                                {this.props.Event.about.title}{/*{" "}{this.props.Event.id}*/}
                            </Text>
                            {this.props.Event.period ? <Text
                                adjustsFontSizeToFit={true}
                                ellipsizeMode={'tail'}
                                numberOfLines={1}
                                style={{
                                    fontSize: 12,
                                    color: this.props.Event.closed ? "red" : dateDiff(this.props.Event) > 0 ? "gray" : "#1FABAB",
                                    fontWeight: this.props.Event.closed ? "bold" : '400',
                                }}
                                note
                            >
                                {this.props.Event.closed ? "Closed" : writeDateTime(this.props.Event)}
                            </Text> : null}

                            {this.props.Event.interval === 1 && this.props.Event.frequency === 'yearly'
                                ? null :
                                    <View>
                                        <Text ellipsizeMode={'tail'} numberOfLines={1} style={{
                                            color: "#696969",
                                            fontSize:12
                                        }} note>
                                            {`Every${this.props.Event.interval > 1 ? " " + this.props.Event.interval : ''} ${writeInterval(this.props.Event.frequency)} till ${moment(this.props.Event.recurrence ? this.props.Event.recurrence : null).format("dddd, MMMM Do YYYY")}`}
                                        </Text>
                                    </View>
                                }
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    }
}