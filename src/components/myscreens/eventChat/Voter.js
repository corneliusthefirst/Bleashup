import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import TextContent from './TextContent';
import { Text, Icon, Spinner, Toast } from 'native-base';
import labler from './labler';
import shadower from '../../shadower';
import stores from '../../../stores';
import { isEqual, findIndex, uniqBy } from 'lodash';
import sayAppBusy from '../votes/sayAppBusy';
import Creator from '../reminds/Creator';
import { writeDateTime, dateDiff } from '../../../services/datesWriter';
import VoteOptionPreviwer from './VoteOptionMediaPreviewer';
import PickersMenu from '../event/createEvent/components/PickerMenu';
import ColorList from '../../colorList';
import rounder from '../../../services/rounder';
import BeComponent from '../../BeComponent';

export default class Voter extends BeComponent {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
       this.mountTimeout = setTimeout(() => {
            this.setStatePure({
                totalVotes: (this.props.message.vote && 
                    this.props.message.vote.voter && 
                    this.props.message.vote.voter.length) || 0,
                loaded: true
            })
        }, this.props.delay)
    }
    shouldComponentUpdate(nextProps, nextState, nextContex) {
        return !isEqual(JSON.parse(this.previousVote), nextProps.message.vote) ||
            this.state.newing !== nextState.newing ||
            this.state.loaded !== nextState.loaded

    }
    previousVote = JSON.stringify({ temp: 'temper' })
    state = {}
    componentDidUpdate(prevProps, preState, preContx) {
        this.previousVote = JSON.stringify(this.props.message.vote)
    }
    renderOptionMedia(url, index, name) {
        return <VoteOptionPreviwer optionName={name} url={url} vote={() => this.vote(index)} votable></VoteOptionPreviwer>
    }
    renderOptions() {
        return this.props.message.vote.option && this.props.message.vote.option.map((item, index) => {
            return this.returnOption(item, index)
        })
    }
    calculateVotePercentage(item, dir) {
        let percent = (dir >= 0 ? (item / this.state.totalVotes) * 100 : (100 - (item / this.state.totalVotes) * 100)).toFixed(2)
        return isNaN(percent) ? dir >= 0 ? 0 : 100 : isFinite(percent) ? percent : dir >= 0 ? 100 : 0
    }
    vote(index) {
        this.props.vote(index, this.props.message.vote)
    }
    returnOption(item, index) {
        return this.props.message.vote.always_show ||
            !this.hasVoted() || (this.props.message.vote.period && dateDiff({ recurrence: this.props.message.vote.period }) > 0) ? this.returnOptionWithCount(item, index) :
            this.returnOptionWithoutCount(item, index)
    }
    creator = stores.LoginStore.user.phone === this.props.message.vote.creator
    hasVoted() {
        return findIndex(this.props.message.vote.voter, (ele) => ele.phone === stores.LoginStore.user.phone) < 0
    }
    returnOptionCount(index) {
        return (this.props.message.vote && 
            this.props.message.vote.voter && 
            this.props.message.vote.voter.filter(ele => ele.index === index).length) || 0
    }
    returnOptionWithCount(item, index) {
        let optionCount = this.returnOptionCount(index);
        let votPercent = this.calculateVotePercentage(optionCount, 0)
        let previousVotePercent = this.calculateVotePercentage(optionCount, -1)
        return <View style={{
            flexDirection: 'row',
            width: '100%',
            height: 40,
            marginBottom: '8%',
            alignSelf: 'center',
        }}>
            <View style={{
                width: '10%',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}><Text
                style={{ color: ColorList.bodyText, fontSize: 23, fontWeight: '400', }}
            >{`${labler(index)}.`}</Text></View>
            <View style={{ width: '75%', height: '80%', }}>
                <View style={{ width: '100%' }}>
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={{ color: '#555756', fontSize: 14 }} note>{`${item.name && item.name !== 'undefined' ? item.name : "none"}    ${votPercent}%  `}</Text>
                        {this.renderOptionMedia(item.option_url, index, item.name)}
                    </View>
                    <View style={{ flexDirection: 'row', height: '60%' }}>
                        <View style={{
                            height: '110%', ...shadower(1),
                            backgroundColor: ColorList.indicatorColor,
                            width: `${votPercent}%`,
                            borderTopRightRadius: votPercent >= 99 ? 8 :
                                0,
                            borderBottomRightRadius: votPercent >= 99 ? 8 : 0,
                        }}>
                        </View>
                        <View style={{
                            width: `${previousVotePercent}%`,
                            height: '100%', 
                            ...shadower(1),
                            marginTop: '.4%',
                            borderTopRightRadius: 8, borderBottomRightRadius: 8,
                            backgroundColor: ColorList.indicatorInverted,
                        }}></View>
                    </View>
                </View>
            </View>
            <View style={{ width: '14%', justifyContent: 'center', alignSelf: 'center', marginLeft: '1%', }}>
                {!this.hasVoted() || 
                    dateDiff({ recurrence: this.props.message.vote.period }) > 0 ? null : this.optionVoter(item.index, true)}
            </View>
        </View>
    }
    optionVoter(index, toper) {
        return <TouchableOpacity onPress={() => requestAnimationFrame(() => this.vote(index))} style={{
            ...rounder(20, ColorList.indicatorColor),
            marginTop: '20%',
            alignSelf: 'flex-end',
            textAlign: 'center'
        }} ><Text style={{
            fontWeight: 'bold',
            fontSize: 10,
            alignSelf: 'center',
            color: ColorList.bodyBackground
        }} >Vote</Text></TouchableOpacity>

    }
    returnOptionWithoutCount(item, index) {
        return <View style={{ flexDirection: 'row', width: '100%', height: 40, marginBottom: '8%', }}>
            <View style={{
                width: '10%',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}><Text
                style={{ color: '#1FABAB', fontWeight: '400', }}
            >{`${labler(index)}.`}</Text></View>
            <View style={{ width: '75%', height: '100%', flexDirection: 'row', }}>
                <View style={{ width: '100%', justifyContent: 'flex-start', flexDirection: 'row', marginTop: 'auto', marginBottom: 'auto', }}>
                    <Text style={{ color: '#1FABAB', fontWeight: '400', }} >{`${item.name && item.name !== 'undefined' ? item.name : 'none'} `}</Text>
                    {this.renderOptionMedia(item.option_url, index, item.name)}
                </View>
            </View>
            <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center', }}>
                {!this.hasVoted() || dateDiff({ recurrence: this.props.message.vote.period }) > 0 ? null : this.optionVoter(item.index)}
            </View>
        </View>
    }
    crerator = null
    reply() {
        this.props.mention(this.props.message.vote, this.creator)
    }
    takeCreator(creator) {
        this.creator = creator
    }
    render() {
        return !this.state.loaded ? <View style={{
            width: 300, height: 300,
            ...this.props.placeHolder
        }}></View> :
            <View style={{ margin: '1%', }}>
                <View style={{  flexDirection: 'row', justifyContent: 'space-between', }}>
                    <View style={{ width: '90%', }}>
                        <Text style={{
                            alignSelf: 'flex-start',
                            fontWeight: 'bold',
                            fontSize: 16,
                        }}>{this.props.message.vote.title}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: '5%', alignSelf: 'flex-end', }}>
                        <PickersMenu fontSize={20} color={ColorList.darkGrayText}
                            icon={{
                                name: 'dots-three-vertical', type: 'Entypo' }} menu={[
                                {
                                    title: 'Reply',
                                    callback: () => this.reply(),
                                    condition: this.props.configurable
                                }, {
                                    title: 'View Voters',
                                    callback: () => this.props.showVoters(this.props.message.vote.voter),
                                    condition: this.props.computedMaster
                                }, {
                                    title: 'Update',
                                    callback: () => this.props.updateVote(this.props.message.vote),
                                    condition: this.props.configurable && this.creator
                                }
                            ]} ></PickersMenu>
                    </View>
                </View>
                {this.props.message.vote.period ? <View style={{ alignItems: 'flex-start', }}><Text style={{ 
                    color: dateDiff({ recurrence: this.props.message.vote.period }) > 0 ? 
                    "gray" : "#1FABAB",
                    fontSize:15
                }}>{`${writeDateTime({
                    period: this.props.message.vote.period,
                    recurrence: this.props.message.vote.period
                }).replace("Starting", "Ends")}`}</Text></View> : null}
                <View style={{ margin: '1%', }}>
                    <TextContent
                        pressingIn={() => this.props.pressingIn ? this.props.pressingIn() : null}
                        handleLongPress={() => this.props.handleLongPress ? this.props.handleLongPress() : null}
                        pressingIn={() => this.props.pressingIn ? this.props.pressingIn() : null}
                        text={this.props.message.vote.description}></TextContent>
                </View>
                <View>
                    {this.renderOptions()}
                </View>
                {this.props.configurable && <View><Creator created_at={this.props.message.vote.created_at} pressingIn={() => this.props.pressingIn ? this.props.pressingIn() : null} giveCreator={(creator) => {
                    this.props.takeCreator ? this.props.takeCreator(creator) : this.takeCreator(creator)
                }} creator={this.props.message.vote.creator}></Creator></View>}
            </View>
    }
}