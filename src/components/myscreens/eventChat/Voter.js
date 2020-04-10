import React, { Component } from 'react';
import { View } from 'react-native';
import TextContent from './TextContent';
import { Text, Icon, Spinner, Toast } from 'native-base';
import labler from './labler';
import shadower from '../../shadower';
import stores from '../../../stores';
import { isEqual, findIndex, uniqBy } from 'lodash';
import sayAppBusy from '../votes/sayAppBusy';
import Creator from '../reminds/Creator';
import { writeDateTime, dateDiff } from '../../../services/datesWriter';

export default class Voter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            totalVotes: (this.props.message.vote && this.props.message.vote.voter && this.props.message.vote.voter.length) || 0
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                loaded: true
            })
        }, this.props.delay * 20)
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
        return this.props.message.vote.always_show || !this.hasVoted() || (this.props.message.vote.period && dateDiff({ recurrence: this.props.message.vote.period }) > 0) ? this.returnOptionWithCount(item, index) : this.returnOptionWithoutCount(item, index)
    }
    creator = stores.LoginStore.user.phone === this.props.message.vote.creator
    hasVoted() {
        return findIndex(this.props.message.vote.voter, (ele) => ele.phone === stores.LoginStore.user.phone) < 0
    }
    returnOptionCount(index){
        return (this.props.message.vote && this.props.message.vote.voter && this.props.message.vote.voter.filter(ele => ele.index === index).length) || 0
    }
    returnOptionWithCount(item, index) {
        return <View style={{ flexDirection: 'row', width: '100%', height: 40, marginBottom: '8%', alignSelf: 'center', }}>
            <View style={{
                width: '10%',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}><Text
                style={{ color: '#1FABAB', fontSize: 23, fontWeight: '400', }}
            >{`${labler(index)}.`}</Text></View>
            <View style={{ width: '78%', height: '80%', }}>
                <View style={{ width: '100%' }}>
                    <Text style={{ color: '#555756', fontSize: 14 }} note>{`${item.name && item.name !== 'undefined' ? item.name : "none"}    ${this.calculateVotePercentage(this.returnOptionCount(index), 0)}%`}</Text>
                    <View style={{ flexDirection: 'row', height: '60%' }}>
                        <View style={{
                            height: '110%', ...shadower(2),
                            backgroundColor: '#1FABAB',
                            width: `${this.calculateVotePercentage(this.returnOptionCount(index), 0)}%`,
                            borderTopRightRadius: this.calculateVotePercentage(this.returnOptionCount(index), 0) >= 99 ? 8 :
                                0,
                            borderBottomRightRadius: this.calculateVotePercentage(this.returnOptionCount(index), 0) >= 99 ? 8 : 0,
                        }}>
                        </View>
                        <View style={{
                            width: `${this.calculateVotePercentage(this.returnOptionCount(index), -1)}%`,
                            height: '100%', ...shadower(2),
                            marginTop: '.4%',
                            borderTopRightRadius: 8, borderBottomRightRadius: 8,
                            backgroundColor: '#fff',
                        }}></View>
                    </View>
                </View>
            </View>
            <View style={{ width: '11%', justifyContent: 'center', alignSelf: 'center', marginLeft: '1%', }}>
                {!this.hasVoted() || dateDiff({ recurrence: this.props.message.vote.period }) > 0 ? null : <Icon onPress={() => this.vote(item.index)} name="vote-yea"
                    style={{ alignSelf: 'flex-end', marginTop: '25%', color: '#555756' }}
                    type={"FontAwesome5"}></Icon>}
            </View>
        </View>
    }
    returnOptionWithoutCount(item, index) {
        return <View style={{ flexDirection: 'row', width: '100%', height: 40, marginBottom: '8%', }}>
            <View style={{
                width: '10%',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}><Text
                style={{ color: '#1FABAB', fontSize: 23, fontWeight: '400', }}
            >{`${labler(index)}.`}</Text></View>
            <View style={{ width: '75%', height: '100%', flexDirection: 'row', }}>
                <View style={{ width: '100%', justifyContent: 'center' }}>
                    <Text style={{ color: '#1FABAB', fontWeight: 'bold', fontSize: 24 }} >{`${item.name && item.name !== 'undefined' ? item.name : 'none'} `}</Text>
                </View>
            </View>
            <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center', }}>
                {!this.hasVoted() || dateDiff({ recurrence: this.props.message.vote.period }) > 0 ? null : <Icon onPress={() => this.vote(item.index)} name="vote-yea"
                    style={{ alignSelf: 'center', marginTop: '50%', color: '#555756' }}
                    type={"FontAwesome5"}></Icon>}
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
        return !this.state.loaded ? <View style={{width:300,height:300}}></View> : <View style={{ margin: '1%', backgroundColor: '#FEFFDE', }}>
            <View style={{ alignSelf: 'center', margin: '2%', flexDirection: 'row', }}>
                <View style={{ width: '70%',marginLeft: '2%', }}>
                    <Text style={{
                        alignSelf: 'flex-start',
                        fontWeight: 'bold',
                        fontSize: 21,
                    }}>{this.props.message.vote.title}</Text>
                </View>
                <View style={{ flexDirection: 'row', width: '30%' }}>
                    <View style={{ width: '33.33%', padding: '1%', }}><Icon onPress={() => this.reply()} name={"reply"}
                        type={"Entypo"} style={{ color: '#555756',alignSelf:'flex-start',marginRight: '15%', }}></Icon></View>
                    {this.props.computedMaster ? <View style={{ width: '38.33%' }}><Icon
                        style={{ color: '#555756', padding: '1%' }}
                        onPress={() => {
                            this.props.showVoters(this.props.message.vote.voter)
                        }}
                        name={'ios-people'} type={"Ionicons"}></Icon></View> : null}
                    {this.props.configurable && this.creator && <View><Icon onPress={() => this.props.updateVote(this.props.message.vote)}
                        style={{ color: '#555756', marginTop: '13%', }} name="gear"
                        type="EvilIcons"></Icon></View>}</View>
            </View>
            {this.props.message.vote.period ? <View style={{ margin: '4%', alignItems: 'flex-start', }}><Text style={{ color: dateDiff({ recurrence: this.props.message.vote.period }) > 0 ? "gray" : "#1FABAB" }}>{`${writeDateTime({
                period: this.props.message.vote.period,
                recurrence: this.props.message.vote.period
            }).replace("Starting", "Ends")}`}</Text></View> : null}
            <View style={{ margin: '4%', }}>
                <TextContent
                    pressingIn={() => this.props.pressingIn ? this.props.pressingIn() : null}
                    handleLongPress={() => this.props.handleLongPress ? this.props.handleLongPress() : null}
                    pressingIn={() => this.props.pressingIn ? this.props.pressingIn() : null}
                    text={this.props.message.vote.description}></TextContent>
            </View>
            <View>
                {this.renderOptions()}
            </View>
            <View><Creator created_at={this.props.message.vote.created_at} pressingIn={() => this.props.pressingIn ? this.props.pressingIn() : null} giveCreator={(creator) => {
                this.props.takeCreator ? this.props.takeCreator(creator) : this.takeCreator(creator)
            }} creator={this.props.message.vote.creator}></Creator></View>
        </View>
    }
}