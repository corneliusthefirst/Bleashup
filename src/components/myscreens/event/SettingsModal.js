import React, { Component } from 'react';
import ModalBox from 'react-native-modalbox';
import { View, PermissionsAndroid } from 'react-native';
import { Text, Item, Button, Icon, Spinner } from 'native-base';
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import NumericInput from 'react-native-numeric-input'
import moment from 'moment';
import stores from '../../../stores';
var event = null
export default class SettingsModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mode: "time",
            show: false,
            loaded: false,
            showDate: false,
            display: 'clock'
        }
    }
    state = {

    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.loaded !== nextState.loaded ||
            this.state.newThing !== nextState.newThing ||
            this.props.isOpen !== nextProps.isOpen
    }
    changeActivityName(e) {
        this.setState({
            activityName: e,
            newThing: !this.state.newThing
        })
        this.validateName()
    }
    validateName() {
        this.updated = true
        if (this.state.activityName.length > 30) {
            this.setState({
                tooLongNameError: true,
                newThing: !this.state.newThing
            })
            return false
        } else if (this.state.activityName === '' ||
            this.state.activityName === null ||
            this.state.activityName === undefined) {
            this.setState({
                emptyNameError: true,
                newThing: !this.state.newThing
            })
            return false
        } else {
            this.setState({
                emptyNameError: false,
                tooLongNameError: false,
                newThing: !this.state.newThing
            })
            return true
        }
    }
    componentDidMount() {
        setTimeout(() => {
            event = JSON.stringify(this.props.event)
            this.setState({
                activityName: this.props.event.about.title,
                activityTime: this.props.event.period,
                date: this.props.event.period,
                interval: this.props.event.interval ? this.props.event.interval : 1,
                recurrent: this.props.event.recurrent ? this.props.event.recurrent : false,
                frequency: this.props.event.frequency ? this.props.event.frequency : 'daily',
                occurrence: this.props.event.recurrence ? this.props.event.recurrence : 100,
                public: this.props.event.public,
                notes: this.props.event.notes ? this.props.event.notes : [],
                mode: "time",
                closed: this.props.event.closed,
                loaded: true
            })
        }, 30)
    }
    showTimePicker() {
        this.setState({
            show: true,
            newThing: !this.state.newThing
        })
    }
    changeActivityTime(e, date) {
        if (date === undefined) {
            this.setState({
                show: false,
                newThing: !this.state.newThing
            })
        } else {
            this.setState({
                show: false,
                activityTime: date,
                newThing: !this.state.newThing
            })
        }
    }
    changeActivityDate(e, date) {
        if (date === undefined) {
            this.setState({
                showDate: false,
                newThing: !this.state.newThing
            })
        } else {
            this.setState({
                showDate: false,
                date: date,
                newThing: !this.state.newThing
            })
        }
    }
    showDatePicker() {
        this.setState({
            mode: 'date',
            display: 'calendar',
            showDate: true,
            newThing: !this.state.newThing
        })
    }
    setRecurrencyState() {
        this.setState({
            recurrent: !this.state.recurrent,
            newThing: !this.state.newThing
        })
    }
    changeFrequency(freq) {
        this.setState({
            frequency: freq,
            newThing: !this.state.newThing
        })
    }
    setInterval(value) {
        this.setState({
            interval: value,
            newThing: !this.state.newThing
        })
    }
    writeInterval() {
        switch (this.state.frequency) {
            case 'daily':
                return '   day(s)';
            case 'weekly':
                return '   week(s)';
            case 'monthly':
                return '   month(s)';
            case 'yearly':
                return '   year(s)';
            default:
                return ''
        }
    }
    setNotes(value, index) {
        let notes = this.state.notes
        notes[index] = value
        this.setState({
            notes: notes,
            newThing: !this.state.newThing
        })
    }
    removeNote(index) {
        this.state.notes.splice(index, 1)
        let notes = this.state.notes
        this.setState({
            notes: notes,
            newThing: !this.state.newThing
        })
    }
    Itemer(index) {
        return (<Item>
            <TextInput
                placeholder={'enter new note here'}
                value={this.state.notes[index]}
                onChangeText={val => this.setNotes(val, index)}
                style={{ width: '70%' }} ></TextInput>
            <Button onPress={() => this.removeNote(index)}
                transparent>
                <Icon name='minus'
                    type='EvilIcons'>
                </Icon></Button>
        </Item>)
    }
    renderNotes() {
        return this.state.notes.map((item, index) => this.Itemer(index))
    }
    computeMax() {
        switch (this.state.frequency) {
            case 'daily':
                return 365;
            case 'weekly':
                return 63;
            case 'monthly':
                return 12;
            case 'yearly':
                return 2;
            default:
                return ''
        }
    }
    setPublic() {
        this.setState({
            public: !this.state.public,
            newThing: !this.state.newThing
        })
    }
    addNewNote() {
        this.state.notes.unshift('')
        let notes = this.state.notes
        this.setState({
            notes: notes,
            newThing: !this.state.newThing
        })
    }
    saveConfigurations() {
        if (this.validateName()) {
            let period = moment(this.state.date).format().split("T")[0] + "T" +
                moment(this.state.activityTime).format().split("T")[1]
            let newConfig = {
                period_new: period,
                title_new: this.state.activityName,
                public_new: this.state.public,
                interval_new: this.state.interval,
                recurrent_new: this.state.recurrent,
                recurrence_new: this.state.occurrence,
                frequency_new: this.state.frequency,
                notes_new: this.state.notes
            }
            this.props.saveSettings(event, newConfig)
        }
    }
    componentWillMount() {

    }
    closeActiviy() {
        this.props.closeActivity()
    }
    render() {
        return (
            <ModalBox
                coverScreen={true}
                entry={'bottom'}
                position={'bottom'}
                backdropOpacity={0.7}
                onClosed={() => {
                    this.props.onClosed()
                    this.setState({
                        loaded: false,

                    })
                    this.name = null
                    this.updated = null
                }}
                isOpen={this.props.isOpen}
                onOpened={() => {
                }}
                style={{
                    borderRadius: 8,
                    height: "97%",
                    width: "100%",
                    backgroundColor: "#FEFFDE",
                }}>
                <View>
                    <View style={{ margin: '2%', flexDirection: 'row', }}>
                        <Text
                            style={{ fontSize: 23, fontWeight: 'bold', fontStyle: 'italic', width: '60%', }}>Activity Settings</Text>
                        <Button onPress={() => this.saveConfigurations()} transparent><Icon
                            style={{ color: "#1FABAB", }}
                            type="AntDesign"
                            name="checkcircle"
                        /><Text style={{ fontWeight: 'bold', fontStyle: 'italic', }} >Save</Text></Button>
                    </View>
                    {!this.state.loaded ? <Spinner size={"small"}></Spinner> : <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ marginLeft: '4%', flexDirection: 'column', }}>
                            <View>
                                {this.state.emptyNameError ? <Text style={{ color: '#A91A84' }} note>{'name cannot be empty'}</Text> : null}
                                {this.state.tooLongNameError ? <Text style={{ color: '#A91A84' }} note>{'name is too long; the name should not be morethan 30 characters'}</Text> : null}
                                <Item style={{ width: '100%' }}>
                                    <TextInput
                                        style={{ width: '100%', fontSize: 18, fontWeight: 'bold', }}
                                        onChangeText={e => this.changeActivityName(e)}
                                        value={this.state.activityName} placeholder={"Activity Name"}>
                                    </TextInput>
                                </Item>
                            </View>
                            <Item>
                                <Button onPress={() => this.showTimePicker()} transparent><Text>At: {moment(this.state.activityTime).format('hh:mm:s a')}</Text></Button>
                                {this.state.show ? <DateTimePicker
                                    mode={this.state.mode}
                                    value={new Date()}
                                    is24Hour={true} display={this.state.display}
                                    onChange={(e, date) => this.changeActivityTime(e, date)}></DateTimePicker> : null}
                            </Item>
                            <Item style={{ width: "100%" }}>
                                <Button onPress={() => this.showDatePicker()} transparent>
                                    <Text>On {moment(this.state.date).format('dddd, MMMM Do YYYY')}</Text>
                                </Button>
                                {this.state.showDate ? <DateTimePicker
                                    value={new Date()}
                                    display={this.state.display}
                                    mode={this.state.mode}
                                    onChange={(e, date) => this.changeActivityDate(e, date)}></DateTimePicker> : null}
                            </Item>
                            <Item style={{ width: "100%" }}>
                                <Button onPress={() => this.setRecurrencyState()} transparent>
                                    <Icon name={
                                        this.state.recurrent ? "radio-button-checked" :
                                            "radio-button-unchecked"
                                    } type={"MaterialIcons"}></Icon>
                                    <Text>Recurrent</Text>
                                </Button>
                            </Item>

                            {this.state.recurrent ?
                                <View style={{ marginLeft: '3%', }}>
                                    <View style={{ flexDirection: 'column', marginLeft: "4%", }}>
                                        <Text style={{ fontWeight: 'bold', }}>Repeat Frequency</Text>
                                        <View style={{ marginLeft: '2%', }}>
                                            <Item style={{ width: "100%" }}>
                                                <Button onPress={() => this.changeFrequency('daily')} transparent>
                                                    <Icon name={
                                                        this.state.frequency === 'daily' ? "radio-button-checked" :
                                                            "radio-button-unchecked"
                                                    } type={"MaterialIcons"}></Icon>
                                                    <Text>Daily</Text>
                                                </Button>
                                            </Item>
                                            <Item style={{ width: "100%" }}>
                                                <Button onPress={() => this.changeFrequency('weekly')} transparent>
                                                    <Icon name={
                                                        this.state.frequency === 'weekly' ? "radio-button-checked" :
                                                            "radio-button-unchecked"
                                                    } type={"MaterialIcons"}></Icon>
                                                    <Text>Weekly</Text>
                                                </Button>
                                            </Item>
                                            <Item style={{ width: "100%" }}>
                                                <Button onPress={() => this.changeFrequency('monthly')} transparent>
                                                    <Icon name={
                                                        this.state.frequency === 'monthly' ? "radio-button-checked" :
                                                            "radio-button-unchecked"
                                                    } type={"MaterialIcons"}></Icon>
                                                    <Text>Monthly</Text>
                                                </Button>
                                            </Item>
                                            <Item style={{ width: "100%" }}>
                                                <Button onPress={() => this.changeFrequency('yearly')} transparent>
                                                    <Icon name={
                                                        this.state.frequency === 'yearly' ? "radio-button-checked" :
                                                            "radio-button-unchecked"
                                                    } type={"MaterialIcons"}></Icon>
                                                    <Text>Yearly</Text>
                                                </Button>
                                            </Item>
                                        </View>
                                        <Item style={{ width: "100%" }}>
                                            <View style={{ flexDirection: 'column', }}>
                                                <Text style={{ fontWeight: 'bold', }}>Interval</Text>
                                                <View style={{ marginLeft: '5%', flexDirection: 'row', }}>
                                                    <Text style={{ fontStyle: 'italic', marginTop: 3, }}>Every  </Text>
                                                    <NumericInput value={this.state.interval}
                                                        onChange={value => this.setInterval(value)}
                                                        totalWidth={70}
                                                        rounded
                                                        borderColor={'#FEFFDE'}
                                                        maxValue={this.computeMax()}
                                                        initValue={this.state.interval}
                                                        reachMaxIncIconStyle={{ color: 'red' }}
                                                        reachMinDecIconStyle={{ color: 'red' }}
                                                        minValue={1}
                                                        sepratorWidth={0}
                                                        iconStyle={{ color: '#FEFFDE' }}
                                                        rightButtonBackgroundColor='#1FABAB'
                                                        leftButtonBackgroundColor='#1FABAB'
                                                        totalHeight={30}
                                                    ></NumericInput>
                                                    <Text style={{ marginTop: 3, }}>{this.writeInterval()}</Text>
                                                </View>
                                            </View>
                                        </Item>
                                    </View>
                                </View> : null}
                            <Item style={{ width: "100%" }}>
                                <Button onPress={() => this.setPublic()} transparent>
                                    <Icon name={
                                        this.state.public ? "radio-button-checked" :
                                            "radio-button-unchecked"
                                    } type={"MaterialIcons"}></Icon>
                                    <Text>Public</Text></Button>
                            </Item>
                            <View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ fontWeight: 'bold', fontStyle: 'italic', marginTop: '3%', }}>Notes</Text>
                                    <Button onPress={() => this.addNewNote()} transparent><Icon name="pluscircle" type={"AntDesign"}></Icon></Button></View>
                                <View style={{ marginLeft: '2%', }}>
                                    {this.renderNotes()}
                                </View>
                            </View>
                        </View>
                        <View style={{ marginTop: "10%", }}>
                            <Button onPress={() => this.closeActiviy()} transparent><Icon name={this.state.closed ? 'door-open' :
                                'poweroff'} type={this.state.closed ? 'FontAwesome5' :
                                    'AntDesign'} style={{ color: this.state.closed ? '#1FABAB' : 'red' }}>
                            </Icon><Text style={{ fontWeight: 'bold', }}>{this.state.closed ? "Open" : "Close"} Activiy</Text></Button>
                        </View>
                    </ScrollView>}
                </View>
            </ModalBox >
        );
    }
}