import React, { Component } from 'react';
import { View } from 'react-native';
import { Card, CardItem, Text, Button, Icon, Spinner } from 'native-base';
import moment from 'moment';
import HomeRequest from './HomeRequester';
import request from '../../../services/requestObjects';
import stores from '../../../stores';
import Mailer from 'react-native-mail';

export default class ForeignEvent extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    state = {

    }
    inviteConcernee() {
        Mailer.mail({
            subject: 'Invitation To Join Our Event On Bleashup App',
            recipients: this.props.event.attendees.map(ele => ele.email).filter(el => el !== stores.LoginStore.user.email),
            body: `<h2>Hello Guys</h2><br/><br/>
            <P>I Have Just Setup Our "${this.props.event.title}"  Event  On Bleashup App So That we should Manage it more Interactively</p>
            <br/><br/><p> You Can Download Bleashup App from </p> <a href="${this.bleashupAppLink}"> Here (Bleashup)</a>
            <br/><br/> <h3>Thank You Guys</h3>`,
            isHTML: true,
            attachment: {
                path: '',  // The absolute path of the file from which to read data.
                type: '',   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
                name: '',   // Optional: Custom filename for attachment
            }
        }, (error, event) => {
            Alert.alert(
                error,
                event,
                [
                    { text: 'Ok', onPress: () => console.log('OK: Email Error Response') },
                    { text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response') }
                ],
                { cancelable: true }
            )
        });
    }
    componentDidMount() {
    }
    manageHere() {
        this.setState({
            managing: true
        })
        let event = request.Event()
        let e = this.props.event
        event.about.title = e.title
        event.about.description = e.description
        event.creator_phone = stores.LoginStore.user.phone
        event.period = e.startDate
        event.recurrent = e.recurrence ? true : false
        event.interval = e.recurrenceRule && e.recurrenceRule.interval ? e.recurrenceRule.interval : 1
        event.frequency = e.recurrenceRule && e.recurrenceRule.frequency ? e.recurrenceRule.frequency : "yearly"
        event.recurrence = e.recurrenceRule && e.recurrenceRule.endDate ? e.recurrenceRule.endDate : moment(e.startDate).add(1, 'h').format()
        event.notes = e.notes ? [e.notes] : event.notes
        event.location.string = e.location
        event.calendar_id = e.id
        console.warn(event)
        event.participant = [{ phone: stores.LoginStore.user.phone, master: true, status: 'creator', host: stores.Session.SessionStore.host }]
        HomeRequest.createEvent(event).then((URL) => {
            CalendarServe.saveEvent({ ...event, about: { ...event.about, description: URL } }, event.alarms).then(() => { })
            this.setState({
                managed: true,
                managing: false
            })
            this.props.event.attendees.length > 0 ? this.inviteConcernee() : null
        })
    }
    render() {
        return (this.state.managed && this.state.invited || this.state.managed && this.props.event.attendees.length <= 0 ? null :
            <Card>
                <CardItem>
                    <View>
                        <Text style={{ fontWeight: 'bold', }}>{this.props.event.title}</Text>
                    </View>
                </CardItem>
                <CardItem>
                    <Text note style={{ fontStyle: 'italic', }}>
                        {`${moment(this.props.event.startDate).format("dddd, MMMM Do YYYY")} at ${moment(this.props.event.startDate).format("h:mm a")}`}
                    </Text>
                </CardItem>
                <CardItem>
                    <View style={{ width: '75%' }}>
                        {this.props.event.attendees.length > 0 ?
                            <Button onPress={() => this.inviteConcernee()} rounded>
                                <Icon type={"EvilIcons"} style={{ fontSize: 50, }} name={"sc-telegram"}></Icon>
                                <Text>{"Invite Attendees"}</Text>
                            </Button> : null}
                    </View>
                    <View style={{alignSelf: 'flex-end',margin: '2%',}}>{
                        !this.state.managed ? this.state.managing ? <Spinner></Spinner> :
                            <Button onPress={() => this.manageHere()} style={{
                                borderRadius: 8,
                            }}>
                                <Text style={{ fontWeight: '400', }}>
                                    {"Manage"}
                                </Text>
                            </Button> : null}
                    </View>
                </CardItem>
            </Card>
        );
    }
}
