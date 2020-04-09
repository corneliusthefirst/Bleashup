import React, { Component } from 'react';
import Modal from "react-native-modalbox"
import { View, TextInput, Dimensions } from 'react-native';
import { Text, Item, Button, Icon, Content } from 'native-base';
import Textarea from 'react-native-textarea';
import labler from './labler';
import { ScrollView } from 'react-native-gesture-handler';
import shadower from '../../shadower'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { format } from '../../../services/recurrenceConfigs';
import stores from '../../../stores';
import { isEqual } from 'lodash';
import request from '../../../services/requestObjects';

let { height, width } = Dimensions.get('window');
export default class VoteCreation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            vote: this.emptyVote,
            vote_id: ""
        }
    }
    emptyVote = {
        title: '',
        always_show: false,
        published: 'public',
        description: '',
        period: null,
        option: ['yes', 'no']
    }
    componentDidMount() {
        //if (!this.props.update) {
        if (this.props.update) {
            this.setState({
                vote: this.props.vote
            })
        } else {
            this.setState({
                vote_id: this.props.vote_id
            })
        }
        //  }
    }
    renderOptions() {
        return this.state.vote.option.map((item, index) => this.Itemer(index))
    }
    setOption(value, index) {
        let options = this.state.vote.option
        options[index] = { name: value, index, vote_count: 0 }
        this.setState({
            vote: { ...this.state.vote, option: options },
        })
        this.updateVoteOtions(options)
    }
    updateVoteOtions(options) {
        if (!this.props.update) {
            stores.Votes.updateVoteOptions({
                vote_id: this.state.vote.id,
                new_option: options
            }).then(() => { })
        }
    }
    initializeVote() {
        stores.Votes.loadVote(request.Vote().id).then(vote => {
            console.warn(vote, "voter vote")
            this.setState({
                vote: !vote ? request.Vote() : vote
            })
        })
    }
    previousVote = JSON.stringify({ name: "" })
    componentDidUpdate(prevProps, prevState, contex) {
        if (this.props.update !== prevProps.update && !this.props.update) {
            this.initializeVote()
        }
        if (!this.props.update) {
            if (this.state.vote.title !== prevState.vote.title) {
                stores.Votes.updateVoteTitle({
                    new_title: this.state.vote.title,
                    vote_id: this.state.vote.id
                }).then(() => { })
            }
            if (this.state.vote.description !== prevState.vote.description) {
                stores.Votes.UpdateVoteDescription({
                    new_description: this.state.vote.description,
                    vote_id: this.state.vote.id
                }).then(() => { })
            }
            if (this.state.vote.published !== prevState.vote.published) {
                stores.Votes.PublishVote({
                    vote_id: this.state.vote.id,
                    new_public_state: this.state.vote.published
                }).then(() => { })
            }
            if (this.state.vote.period !== prevState.vote.period) {
                stores.Votes.UpdateVotePeriod({
                    new_period: this.state.vote.period,
                    vote_id: this.state.vote.id
                }).then(() => { })
            }
            if (this.state.vote.always_show !== prevState.vote.always_show) {
                stores.Votes.updateAlwayShowPercentage({
                    vote_id: this.state.vote.id,
                    new_always_show:
                        this.state.vote.always_show
                }).then(() => { })
            }
            if (this.props.vote_id !== prevProps.vote_id ||
                this.state.vote_id !== prevState.vote_id) {
                this.initializeVote()
            }
        } else {
            if (!isEqual(JSON.parse(this.previousVote), this.props.vote)) {
                this.setState({
                    vote: this.props.vote
                })
                this.previousVote = JSON.stringify(this.props.vote)
            }

        }
    }
    removeNote(index) {
        this.state.vote.option.splice(index, 1)
        let options = this.state.vote.option
        this.setState({
            vote: { ...this.state.vote, option: options },
            showVoteOptionError: options.length <= 1 ? true : false
        })
        this.updateVoteOtions(options)
    }
    Itemer(index) {
        return (<Item>
            <Text style={{ fontWeight: 'bold', color: '#1FABAB' }}>{`${labler(index)} .`}</Text><TextInput
                placeholder={'enter option name here'}
                value={this.state.vote.option[index].name}
                onChangeText={val => this.setOption(val, index)}
                style={{ width: '70%' }} ></TextInput>
            <Button onPress={() => this.removeNote(index)}
                transparent>
                <Icon name='minus'
                    type='EvilIcons'>
                </Icon></Button>
        </Item>)
    }
    showVoteOptionError() {
        this.setState({
            showVoteOptionError: true
        })
    }
    showVoteContentError() {
        this.setState({
            showVoteContentError: true
        })
    }
    showMustSpecifyVotePeriodError() {
        this.setState({
            nowVotePeriod: true
        })
    }
    addVote() {
        let vote = this.state.vote
        if (vote.option.length <= 1) {
            this.showVoteOptionError()
        } else if (!vote.description && !vote.title) {
            this.showVoteContentError()
        } if (!vote.period) {
            this.showMustSpecifyVotePeriodError()
        } else {
            this.props.takeVote({ ...vote, voter: [] })
            setTimeout(() => {
                // this.setState({
                //     vote: request.Vote()
                // })
            }, 1000)
        }
    }
    changeAlwaysShowState() {
        this.setState({
            vote: { ...this.state.vote, always_show: !this.state.vote.always_show }
        })
    }
    addOptions() {
        let options = this.state.vote.option.map(ele => {
            return {
                ...ele,
                index: ele.index + 1
            }
        })
        options.unshift({ name: '', index: 0, vote_count: 0 })
        this.setState({
            vote: {
                ...this.state.vote,
                option: options,
            },
            showVoteOptionError: options.length <= 1 ? true : false
            //newThing: !this.state.newThing
        })
        this.updateVoteOtions(options)
    }
    changeEndTime(e, date) {
        if (date === undefined) {
            this.setState({
                showDatePicker: false
            })
        } else {
            let newDate = moment(date).format().split("T")[0]
            let newTime = this.state.vote.period ? moment(this.state.vote.period).format().split("T")[1] :
                moment().startOf("day").add(moment.duration(1, 'hours')).toISOString().split("T")[1]
            let newDateTime = newDate + "T" + newTime
            this.setState({
                nowVotePeriod: false,
                vote: { ...this.state.vote, period: newDateTime, },
                showDatePicker: false,
                showTimePicker: true
            })
        }
    }
    changeTime(e, date) {
        if (date === undefined) {
            this.setState({
                showTimePicker: false
            })
        } else {
            let newTime = moment(date).format().split("T")[1]
            let newDate = this.state.vote.period ? moment(this.state.vote.period).format().split("T")[0] :
                moment().format().split("T")[0]
            this.setState({
                nowVotePeriod: false,
                showTimePicker: false,
                vote: { ...this.state.vote, period: newDate + "T" + newTime, },
                //newThing: !this.state.newThing
            })
        }
    }
    updateVote() {
        this.props.updateVote(this.previousVote, this.state.vote)
    }
    state = {}
    render() {
        return <Modal
            position={'bottom'}
            backdropPressToClose={true}
            backButtonClose={true}
            coverScreen={true}
            swipeToClose={false}
            isOpen={this.props.isOpen}
            onClosed={() => {
                this.props.onClosed()
            }}
            entry={'top'}
            style={{
                height: height*.95,
                width: '100%',
                backgroundColor: '#FEFFDE',
                borderTopRightRadius: 8,
                borderTopLeftRadius: 8,
            }}
        >
            <View style={{ height: '100%', flexDirection: 'column', }}>
                <View style={{ width: '98%', height: '6%', ...shadower(), margin: '1%', flexDirection: 'row', }}>
                    <View style={{ width: '35%' }}><Text note style={{
                        fontWeight: 'bold',
                        color: '#A91A84',
                        //margin: '2%'
                    }}>{"new vote"}</Text></View>
                    {this.props.update ? <View style={{ width: '65%' }}><Text note style={{
                        fontWeight: 'bold',
                        color: '#555756',
                        //margin: '2%'
                    }}>{"ony the voting end date is updated"}</Text></View> : null}
                </View>
                <View style={{ height: '94%', }}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ height: '100%' }}>
                        <View style={{ margin: '3%', }}>
                            {this.state.showVoteContentError ? <Text style={{ color: "#A91A84", fontWeight: 'bold', }} note>{"vote should at least have a title or a detail"}</Text> : null}
                            {this.state.showVoteOptionError ? <Text style={{ color: "#A91A84", fontWeight: 'bold', }} note>{"vote should have at least a 2 options"}</Text> : null}
                            {this.state.nowVotePeriod ? <Text style={{ color: "#A91A84", fontWeight: 'bold', }} note>{"you must specify the voting endate"}</Text> : null}
                            <View style={{ height: height / 14, alignItems: 'center', margin: '2%', }}>
                                <Item style={{ borderColor: '#1FABAB', width: "95%", margin: '2%', height: height / 17 }} rounded>
                                    <TextInput maxLength={20} style={{ width: "100%", height: "100%", margin: '2%', marginBottom: '5%', }}
                                        value={this.state.vote.title ? this.state.vote.title : ""}
                                        maxLength={40} placeholder="Vote title" keyboardType='email-address' autoCapitalize="none" returnKeyType='next' inverse last
                                        onChangeText={(text) =>
                                            this.setState({
                                                vote: { ...this.state.vote, title: text },
                                                showVoteContentError: (!text || text.length <= 0) && !this.state.vote.description ? true : false
                                            })
                                        } />
                                </Item>
                            </View>
                            <Textarea containerStyle={{
                                width: "95%", margin: "1%",
                                height: 150,
                                borderRadius: 6, borderWidth: .7,
                                borderColor: "#1FABAB", alignSelf: 'center',
                                backgroundColor: "#f5fffa"
                            }} maxLength={1000} style={{
                                margin: 1,
                                backgroundColor: "#f5fffa",
                                height: "95%", width: "98%"
                            }}
                                placeholder="Vote details" value={this.state.vote.description} keyboardType="default"
                                onChangeText={(value) => {
                                    this.setState({
                                        vote: { ...this.state.vote, description: value },
                                        showVoteContentError: (!value || value.length <= 0) &&
                                            !this.state.vote.title ? true : false
                                    })
                                }} />
                            <Button onPress={() => this.changeAlwaysShowState()} transparent>
                                <Icon name={this.state.vote.always_show ? "radio-button-checked" :
                                    "radio-button-unchecked"} type={"MaterialIcons"}></Icon>
                                <Text>{"always show vote percentages"}</Text></Button>
                            {/*<Button transparent onPress={() => {
                                this.setState({
                                    vote: { ...this.state.vote, published: this.state.vote.published === 'public' ? 'private' : 'public' }
                                })
                            }}><Icon name={this.state.vote.published === 'public' ? "radio-button-checked" :
                                "radio-button-unchecked"} type={"MaterialIcons"}></Icon>
                        <Text>{`${this.state.vote.published}`}</Text></Button>*/}
                            <Item>
                                <View style={{ width: '90%' }}>
                                    <Button onPress={() => {
                                        this.setState({
                                            showDatePicker: true
                                        })
                                    }} transparent><Text style={{ fontWeight: 'bold', }}>{"Ends: "}</Text><Text>{this.state.vote.period ?
                                        moment(this.state.vote.period).format(format) :
                                        'select voting end date'}</Text></Button>
                                </View>{/*<View><Icon
                                    type={"EvilIcons"} name={"close"} onPress={() => {
                                        this.setState({
                                            vote: { ...this.state.vote, period: null }
                                        })
                                    }} style={{ color: 'red' }}></Icon></View>*/}</Item>
                            {this.state.showDatePicker ? <DateTimePicker
                                value={this.state.period ? parseFloat(moment(this.state.vote.period).format('x')) : new Date()}
                                is24Hour={true}
                                mode={"default"}
                                onChange={(e, date) => this.changeEndTime(e, date)}
                            >
                            </DateTimePicker> : null}
                            {this.state.showTimePicker ? <DateTimePicker
                                display={'clock'} value={this.state.period ? parseFloat(moment(this.state.vote.period).format('x')) : new Date()} onChange={(e, date) => this.changeTime(e, date)}
                                mode={"time"} is24Hour={true}></DateTimePicker> : null}
                            <View style={{ flexDirection: 'column', }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <Button onPress={() => this.addOptions()} transparent>
                                        <Text style={{ fontWeight: 'bold', fontStyle: 'italic', }}>{"Options"}</Text>
                                        <Icon name="pluscircle" type={"AntDesign"}></Icon></Button>
                                </View>
                                <View style={{ marginLeft: '2%', }}>
                                    {this.renderOptions()}
                                </View>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                marginTop: '4%',
                            }}>
                                <View style={{ width: '80%' }}>
                                </View>
                                <View style={{ width: '20%' }}>
                                    {this.props.update ? <Button onPress={() => this.updateVote()} rounded><Text
                                        style={{ color: '#FEFFDE', fontWeight: 'bold', }} rounded>{"Update"}</Text></Button> : <Button onPress={() => this.addVote()} rounded><Text
                                            style={{ color: '#FEFFDE', fontWeight: 'bold', }}>{"Add"}</Text></Button>}
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    }
}