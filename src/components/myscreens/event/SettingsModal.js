import React, { Component } from 'react';
import ModalBox from 'react-native-modalbox';
import { View, PermissionsAndroid, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Item, Button, Icon, Spinner, Label } from 'native-base'
import { Dropdown } from 'react-native-material-dropdown';
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import NumericInput from 'react-native-numeric-input'
import moment from 'moment';
import stores from '../../../stores';
import { find } from 'lodash';
import SelectDays from './SelectDaysModal';
import { uniq } from 'lodash';
import { frequencyType, daysOfWeeksDefault, nameToDataMapper, FrequencyReverser } from '../../../services/recurrenceConfigs';
import { getDayMonth, getMonthDay } from '../../../services/datesWriter';
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
var event = null
export default class SettingsModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mode: "time",
            show: false,
            loaded: false,
            showDate: false,
            recurrent: false,
            recurrence: this.props.event.period ? this.props.event.period : moment().format(),
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
                recurrent: !(this.props.event.interval === 1 && this.props.event.frequency === 'yearly'),
                frequency: this.props.event.frequency ? this.props.event.frequency : 'yearly',
                recurrence: this.props.event.recurrence ? this.props.event.recurrence : moment().format(),
                public: this.props.event.public,
                notes: this.props.event.notes ? this.props.event.notes : [],
                mode: "time",
                daysOfWeek: this.props.event.days_of_week ? this.props.event.days_of_week : null,
                weekStart: this.props.event.week_start ? this.props.event.week_start : null,
                closed: this.props.event.closed,
                whoCanUpdate: this.props.event.who_can_update,
                loaded: true
            })
        }, 200)
    }
    showTimePicker() {
        this.setState({
            show: true,
            mode: "time",
            display: null,
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
            let newTime = moment(date).format().split("T")[1]
            let newDate = this.state.date ? moment(this.state.date).format().split("T")[0] :
                moment().format().split("T")[0]
            this.setState({
                show: false,
                date: newDate + "T" + newTime,
                newThing: !this.state.newThing
            })
        }
    }
    resetDate() {
        this.setState({
            date: null,
            newThing: !this.state.newThing
        })
    }
    resetTime() {
        let time = moment().startOf('day').add(moment.duration(1, 'hours')).toISOString().split("T")[1]
        let newDate = this.state.date ?
            moment(this.state.date).format().split("T")[0] :
            moment().format().split("T")[0]
        let dateTime = newDate + "T" + time
        console.warn(dateTime)
        this.setState({ date: dateTime, newThing: !this.state.newThing });
    }
    getDay(date) {
        return moment(date).format("dddd")
    }
    changeActivityDate(e, date) {
        if (date === undefined) {
            this.setState({
                showDate: false,
                newThing: !this.state.newThing
            })
        } else {
            let newDate = moment(date).format().split("T")[0]
            let newTime = this.state.date ? moment(this.state.date).format().split("T")[1] :
                moment().startOf("day").add(moment.duration(1, 'hours')).toISOString().split("T")[1]
            let newDateTime = newDate + "T" + newTime
            this.setState({
                showDate: false,
                date: newDateTime,
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
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.frequency === "weekly" && this.state.frequency !== prevState.frequency) {
            this.setState({
                startOfWeek: [find(daysOfWeeksDefault, { day: this.getDay(this.state.date) }).code],
                daysOfWeek: this.state.daysOfWeek ? this.state.daysOfWeek : [find(daysOfWeeksDefault, { day: this.getDay(this.state.date) }).code],
                newThing: !this.state.newThing
            })
        } else if (this.state.frequency !== prevState.frequency) {
            this.setState({
                daysOfWeek: null,
                weekStart: null,
                newThing: !this.newThing
            })
        } else if (this.state.date !== prevState.date) {
            this.setState({
                startOfWeek: [find(daysOfWeeksDefault, { day: this.getDay(this.state.date) }).code],
                daysOfWeek: this.state.daysOfWeek ? this.state.daysOfWeek : [find(daysOfWeeksDefault, { day: this.getDay(this.state.date) }).code],
                newThing: !this.state.newThing
            })
        }
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
            let period = this.state.date
            let newConfig = {
                period_new: period,
                title_new: this.state.activityName ? this.state.activityName : null,
                public_new: this.state.public,
                interval_new: this.state.interval,
                recurrent_new: this.props.event.recurrent,
                recurrence_new: this.state.recurrence,
                frequency_new: this.state.frequency,
                days_of_week: this.state.daysOfWeek,
                week_start: this.state.weekStart,
                who_can_update_new: this.state.whoCanUpdate,
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
    updatePossibilities = [{ value: 'master' }, { value: 'anybody' }, { value: 'creator' }]
    showEndatePiker() {
        this.setState({
            showEndatePiker: true,
            mode: "date",
            display: 'calendar',
            newThing: !this.state.newThing
        })
    }
    changeEndDate(e, date) {
        if (date === undefined) {
            this.setState({
                showEndatePiker: false,
                newThing: !this.state.newThing
            })
        } else {
            let newDate = moment(date).format().split("T")[0]
            let newTime = this.state.date ? moment(this.state.date).format().split("T")[1] :
                moment().startOf("day").add(moment.duration(1, 'hours')).toISOString().split("T")[1]
            this.setState({
                showEndatePiker: false,
                recurrence: newDate + "T" + newTime,
                newThing: !this.state.newThing
            })
        }
    }
    setRecursiveFrequency(val) {
        this.setState({
            frequency: nameToDataMapper[val],
            newThing: !this.state.newThing
        })
    }
    setWhoCanUpdate(val) {
        this.setState({
            whoCanUpdate: val,
            newThing: !this.state.newThing
        })
    }
    getCode(day) {
        return find(daysOfWeeksDefault, { day: day }).code
    }
    render() {
        return (
            <ModalBox
                coverScreen={true}
                entry={'bottom'}
                position={'bottom'}
                backdropOpacity={0.7}
                backButtonClose={true}
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
                    height: "90%",
                    width: "100%",
                    backgroundColor: "#FEFFDE",
                }}>
                {!this.state.loaded ? <Spinner size={'small'}></Spinner> : <View>
                    <View style={{ height: 50 }}>
                        <View style={{ flexDirection: 'row', ...bleashupHeaderStyle, padding: '2%', }}>
                            <View style={{ width: '70%' }}>
                                <Text
                                    style={{ fontSize: 20, fontWeight: 'bold', width: '100%', }}>Activity Settings</Text>
                            </View>
                            <View style={{ width: '30%' }}>
                                {this.props.computedMaster ? <Button onPress={() => this.saveConfigurations()} transparent><Icon
                                    style={{ color: "#1FABAB", }}
                                    type="AntDesign"
                                    name="checkcircle"
                                /><Text style={{ fontWeight: 'bold', fontStyle: 'italic', }} >Save</Text></Button> : null}
                            </View>
                        </View>
                    </View>
                    {!this.state.loaded ? <Spinner size={"small"}></Spinner> : <ScrollView style={{ height: '90%' }} showsVerticalScrollIndicator={false}>
                        <View style={{ marginLeft: '4%', flexDirection: 'column', }}>
                            <View>
                                {this.state.emptyNameError ? <Text style={{ color: '#A91A84' }} note>{'name cannot be empty'}</Text> : null}
                                {this.state.tooLongNameError ? <Text style={{ color: '#A91A84' }} note>{'name is too long; the name should not be morethan 30 characters'}</Text> : null}
                                <Item style={{ width: '100%' }}>
                                    <TextInput
                                        disabled={this.computedMaster}
                                        maxLength={20}
                                        style={{ width: '100%', fontSize: 18, fontWeight: 'bold', }}
                                        onChangeText={e => this.changeActivityName(e)}
                                        value={this.state.activityName} placeholder={"Activity Name"}>
                                    </TextInput>
                                </Item>
                            </View>
                            <View style={{ flexDirection: 'row', }} pointerEvents={this.props.computedMaster ? null : 'none'}>
                                <Item style={{ width: "100%" }}>
                                    <Button style={{ width: "90%" }} onPress={() => this.showDatePicker()} transparent>
                                        <Text>{this.state.date ? `Starts On: ${moment(this.state.date).format('dddd, MMMM Do YYYY')}` : "select activity time"}</Text>
                                    </Button>
                                    {this.state.date ? <Icon style={{ color: "red" }}
                                        onPress={() => this.resetDate()} name={"close"} type={"EvilIcons"}></Icon> : null}
                                    {this.state.showDate ? <DateTimePicker
                                        value={this.state.date ? parseInt(moment(this.state.date).format('x')) : new Date()}
                                        display={this.state.display}
                                        mode={this.state.mode}
                                        onChange={(e, date) => this.changeActivityDate(e, date)}></DateTimePicker> : null}
                                </Item>
                            </View>
                            <View pointerEvents={this.props.computedMaster ? null : 'none'}>
                                <Item>
                                    <Button style={{ width: "90%" }} onPress={() => this.showTimePicker()} transparent>
                                        <Text>{this.state.date ? `At: ${moment(this.state.date).format('hh:mm:s a')}` : "select activity time"}</Text>
                                    </Button>
                                    {this.state.date ? <Icon style={{ color: "red" }} onPress={() => this.resetTime()}
                                        name={"close"} type={"EvilIcons"}></Icon> : null}
                                    {this.state.show ? <DateTimePicker
                                        mode={this.state.mode}
                                        value={this.state.date ? parseInt(moment(this.state.date).format('x')) : new Date()}
                                        is24Hour={true} display={this.state.display}
                                        onChange={(e, date) => this.changeActivityTime(e, date)}></DateTimePicker> : null}
                                </Item>
                            </View>
                            <View pointerEvents={this.props.computedMaster ? null : 'none'}>
                                <Item style={{ width: "100%" }}>
                                    <Button onPress={() => this.setRecurrencyState()}
                                        transparent>
                                        <Icon name={
                                            this.state.recurrent ? "radio-button-checked" :
                                                "radio-button-unchecked"
                                        } type={"MaterialIcons"}></Icon>
                                        <Text style={{ fontWeight: 'bold', }}>Recurrence Configurations</Text>
                                    </Button>
                                </Item>
                            </View>
                            {this.state.recurrent ?
                                <View style={{ marginLeft: '1%', }}>
                                    <View style={{ flexDirection: 'column', marginLeft: "4%", }}>
                                        <Item style={{ width: "100%", margin: '1%', height: 37 }}>
                                            <View style={{ flexDirection: 'column', marginTop: '-1%', }}>
                                                <View style={{ marginLeft: '1%', flexDirection: 'row', }}>
                                                    <Text style={{ fontStyle: 'italic', marginTop: 3, }}>Every  </Text>
                                                    <View pointerEvents={this.props.computedMaster ? null : 'none'}>
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
                                                    </View>
                                                    <View style={{ flexDirection: 'row', width: "50%", }}>
                                                        <View pointerEvents={this.props.computedMaster ? null : 'none'}
                                                            style={{
                                                                width: '60%',
                                                                marginTop: '-10%',
                                                                marginLeft: 3,
                                                            }}>
                                                            <Dropdown
                                                                data={frequencyType}
                                                                baseColor={"#1FABAB"}
                                                                selectedItemColor={"#1FABAB"}
                                                                labelFontSize={0}
                                                                value={this.state.frequency ?
                                                                    FrequencyReverser[this.state.frequency] : 'none'}
                                                                onChangeText={(val) => this.setRecursiveFrequency(val)}
                                                                pickerStyle={{ width: "40%", borderRadius: 5, backgroundColor: "#FEFFDE", borderWidth: 0, borderColor: "#1FABAB" }}
                                                                containerStyle={{ borderWidth: 0, borderColor: "gray", borderRadius: 6, justifyContent: "center", padding: 2, height: 38 }}
                                                            />
                                                        </View>
                                                        {this.state.frequency === 'weekly' ? <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                                                            this.setState({
                                                                isSelectDaysModalOpened: true,
                                                                newThing: !this.state.newThing
                                                            })
                                                        })}><Text>{this.props.computedMaster ? "select days" : "view days"}</Text></TouchableOpacity> : this.state.frequency === 'monthly' ?
                                                                <View pointerEvents={this.props.computedMaster ? null : 'none'}><TouchableOpacity onPress={() => requestAnimationFrame(() => {
                                                                    this.showDatePicker()
                                                                })}>
                                                                    <Text>{`on the ${getDayMonth(this.state.date)}`}</Text>
                                                                </TouchableOpacity></View> : this.state.frequency === 'yearly' ? <View pointerEvents={this.props.computedMaster ? null : 'none'}><TouchableOpacity onPress={() => requestAnimationFrame(() => {
                                                                    this.showDatePicker()
                                                                })}><Text>{`on ${getMonthDay(this.state.date)}`}</Text></TouchableOpacity></View> : <Text>{'(all days)'}</Text>}
                                                        {this.state.isSelectDaysModalOpened ? <SelectDays ownership={this.props.computedMaster} isOpen={this.state.isSelectDaysModalOpened} addCode={(code) => {
                                                            this.setState({
                                                                daysOfWeek: uniq([code, ...this.state.daysOfWeek]),
                                                                newThing: !this.state.newThing
                                                            })
                                                        }}
                                                            removeCode={(code) => {
                                                                this.setState({
                                                                    daysOfWeek: uniq([...this.state.daysOfWeek.filter(ele => ele !== code)]),
                                                                    newThing: !this.state.newThing
                                                                })
                                                            }}
                                                            daysSelected={this.state.daysOfWeek}
                                                            daysOfWeek={daysOfWeeksDefault}
                                                            onClosed={() => {
                                                                this.setState({
                                                                    isSelectDaysModalOpened: false,
                                                                    newThing: !this.state.newThing
                                                                })
                                                            }}></SelectDays> : null}
                                                    </View>
                                                </View>
                                            </View>
                                        </Item>
                                        <View pointerEvents={this.props.computedMaster ? null : 'none'}>
                                            <Item>
                                                <Label>
                                                    Ends
                                        </Label>
                                                <Button style={{ width: "90%" }} onPress={() => this.showEndatePiker()} transparent>
                                                    <Text>{this.state.recurrence ? `On ${moment(this.state.recurrence).format('dddd, MMMM Do YYYY')}` : "Select Activity End Date"}</Text>
                                                </Button>
                                                {this.state.showEndatePiker ? <DateTimePicker value={this.state.recurrence ? parseInt(moment(this.state.recurrence).format('x')) : new Date()}
                                                    display={this.state.display}
                                                    mode={this.state.mode}
                                                    onChange={(e, date) => this.changeEndDate(e, date)}></DateTimePicker> : null}
                                            </Item>
                                        </View>
                                    </View>
                                </View> : null}
                            <Item style={{ width: "100%" }}>
                                <View pointerEvents={this.props.master ? null : 'none'}>
                                    <Button onPress={() => this.setPublic()} transparent>
                                        <Icon name={
                                            this.state.public ? "radio-button-checked" :
                                                "radio-button-unchecked"
                                        } type={"MaterialIcons"}></Icon>
                                        <Text>Public</Text></Button>
                                </View>
                            </Item>
                            <View pointerEvents={this.props.computedMaster ? null : 'none'}>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ fontWeight: 'bold', fontStyle: 'italic', marginTop: '3%', }}>Notes</Text>
                                    <Button onPress={() => this.addNewNote()} transparent><Icon name="pluscircle" type={"AntDesign"}></Icon></Button></View>
                                <View style={{ marginLeft: '2%', }}>
                                    {this.renderNotes()}
                                </View>
                            </View>
                        </View>
                        <View pointerEvents={this.props.creator ? null : 'none'} style={{ margin: '5%', width: '70%' }}>
                            <Dropdown
                                label="Who Can Manage"
                                data={this.updatePossibilities}
                                baseColor={"#1FABAB"}
                                selectedItemColor={"#1FABAB"}
                                labelFontSize={15}
                                value={this.state.whoCanUpdate}
                                onChangeText={(val) => this.setWhoCanUpdate(val)}
                                pickerStyle={{ width: "40%", borderRadius: 5, backgroundColor: "#FEFFDE", borderWidth: 0, borderColor: "#1FABAB" }}
                                containerStyle={{ borderWidth: 0, borderColor: "gray", borderRadius: 6, justifyContent: "center", padding: 2, height: 40 }}
                            />
                        </View>
                        <View pointerEvents={this.props.creator ? null : 'none'} style={{ marginTop: "10%", }}>
                            <Button onPress={() => this.closeActiviy()} transparent><Icon name={this.state.closed ? 'door-open' :
                                'poweroff'} type={this.state.closed ? 'FontAwesome5' :
                                    'AntDesign'} style={{ color: this.state.closed ? '#1FABAB' : 'red' }}>
                            </Icon><Text style={{ fontWeight: 'bold', }}>{this.state.closed ? "Open" : "Close"} Activiy</Text></Button>
                        </View>
                    </ScrollView>}
                </View>}
            </ModalBox >
        );
    }
}