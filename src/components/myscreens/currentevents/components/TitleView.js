import React, { Component } from "react"
import { View, TouchableOpacity, Text } from 'react-native';
import { Left, Title } from 'native-base';
import autobind from "autobind-decorator";
import stores from "../../../../stores";
import DetailsModal from "../../invitations/components/DetailsModal";
import { forEach, find } from "lodash"
import moment from "moment";
import { writeInterval, writeDateTime, dateDiff } from '../../../../services/datesWriter';
import Highlighter from 'react-native-highlight-words';
import BeNavigator from '../../../../services/navigationServices';
import ColorList from "../../../colorList";
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
                    BeNavigator.navigateToActivity("EventChat", 
                    find(stores.Events.events, { id: this.props.Event.id }))
                } else {
                    this.props.openDetail && this.props.openDetail()
                }
                this.props.seen && this.props.seen()
            })
    }
    render() {
        return (<View style={{ flex: 1, marginTop: "2.5%" }}>
            <TouchableOpacity style={{
                height:"100%"
            }} onPress={() => requestAnimationFrame(() => {
                this.navigateToEventDetails()
            })}>
                <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
                    {this.props.searching ? <Highlighter
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        searchWords={[this.props.searchString]}
                        autoEscape={true}
                        textToHighlight={this.props.Event.about.title}
                        highlightStyle={{
                            backgroundColor: ColorList.iconInactive,
                            fontWeight: 'bold',
                            color: ColorList.bodyBackground
                        }}
                    ></Highlighter> : <Text
                        adjustsFontSizeToFit={true}
                        ellipsizeMode={'tail'}
                        numberOfLines={1}
                        style={{
                            fontSize: 14,
                            fontWeight: "500",
                            textTransform: "capitalize",
                            color: "black",
                            fontFamily: "Roboto",
                        }}
                    >
                            {this.props.Event.about.title}
                        </Text>}
                </View>
            </TouchableOpacity>
        </View>)

    }
}























/**

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
 */