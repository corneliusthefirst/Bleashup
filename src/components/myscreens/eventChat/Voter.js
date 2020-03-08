import React, { Component } from 'react';
import { View } from 'react-native';
import TextContent from './TextContent';
import { Text, Icon } from 'native-base';
import labler from './labler';
import shadower from '../../shadower';
import { findIndex, uniqBy } from 'lodash';
import stores from '../../../stores';

export default class Voter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            totalVotes: this.props.message.vote.options.reduce((acc, item) => acc + item.vote_count, 0)
        }
    }
    state = {}
    renderOptions() {
        return this.props.message.vote.options.map((item, index) => {
            return this.returnOption(item, index)
        })
    }
    calculateVotePercentage(item, dir) {
        let percent = (dir >= 0 ? (item / this.state.totalVotes) * 100 : (100 - (item / this.state.totalVotes) * 100)).toFixed(2)
        return isNaN(percent) ? dir >= 0 ? 0 : 100 : isFinite(percent) ? percent : dir >= 0 ? 100 : 0
    }
    vote(index) {
        let message = {
            ...this.props.message,
            vote: {
                ...this.props.message.vote,
                options: this.props.message.vote.options.map(ele => {
                    return { ...ele, vote_count: ele.index === index ? ele.vote_count + 1 : ele.vote_count }
                }),
                voters: uniqBy([...this.props.message.vote.voters, { phone: stores.LoginStore.user.phone, index: index }])
            }
        }
        this.props.voteItem(message)
    }
    returnOption(item, index) {
        return this.props.message.vote.always_show || !this.hasVoted() ? this.returnOptionWithCount(item, index) : this.returnOptionWithoutCount(item, index)
    }
    hasVoted() {
        return findIndex(this.props.message.vote.voters, (ele) => ele.phone === stores.LoginStore.user.phone) < 0
    }
    returnOptionWithCount(item, index) {
        return <View style={{ flexDirection: 'row', width: '100%', height: 40, marginBottom: '8%', alignSelf: 'center',}}>
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
                    <Text style={{ color: 'darkGray', fontSize: 14 }} note>{`${item.name}    ${this.calculateVotePercentage(item.vote_count, 0)}%`}</Text>
                    <View style={{ flexDirection: 'row', height: '60%' }}>
                        <View style={{
                            height: '110%', ...shadower(2),
                            backgroundColor: '#1FABAB',
                            width: `${this.calculateVotePercentage(item.vote_count, 0)}%`,
                            borderTopRightRadius: this.calculateVotePercentage(item.vote_count, 0) >= 99 ? 8 :
                                0,
                            borderBottomRightRadius: this.calculateVotePercentage(item.vote_count, 0) >= 99 ? 8 : 0,
                        }}>
                        </View>
                        <View style={{
                            width: `${this.calculateVotePercentage(item.vote_count, -1)}%`,
                            height: '100%', ...shadower(2),
                            marginTop: '.4%',
                            borderTopRightRadius: 8, borderBottomRightRadius: 8,
                            backgroundColor: '#fff',
                        }}></View>
                    </View>
                </View>
            </View>
            <View style={{ width: '11%', justifyContent: 'center', alignSelf: 'center', marginLeft: '1%', }}>
                {this.hasVoted() ? <Icon onPress={() => this.vote(item.index)} name="vote-yea"
                    style={{ alignSelf: 'flex-end', marginTop: '25%', color: 'darkGray' }}
                    type={"FontAwesome5"}></Icon> : null}
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
            <View style={{ width: '80%', height: '100%', flexDirection: 'row', }}>
                <View style={{ width: '100%', justifyContent: 'center' }}>
                    <Text style={{ color: '#1FABAB', fontWight: 'bold', fontSize: 24 }} >{`${item.name} `}</Text>
                </View>
            </View>
            <View style={{ width: '8%', justifyContent: 'center', alignItems: 'center', }}>
                {this.hasVoted() ? <Icon onPress={() => this.vote(item.index)} name="vote-yea"
                    style={{ alignSelf: 'center', marginTop: '50%', color: 'darkGray' }}
                    type={"FontAwesome5"}></Icon> : null}
            </View>
        </View>
    }
    render() {
        console.warn(this.state.totalVotes)
        return <View style={{ margin: '1%', backgroundColor: '#FEFFDE', }}>
            <View style={{ alignSelf: 'center', margin: '2%', flexDirection: 'row', }}>
                <View style={{ width: '80%' }}>
                    <Text style={{
                        alignSelf: 'center',
                        fontWeight: 'bold',
                        fontSize: 21,
                    }}>{this.props.message.vote.title}</Text>
                </View>
                <View><Icon
                    style={{ alignSelf: 'center', color: 'darkGray' }}
                    onPress={() => {
                        this.props.showVoters(this.props.message.vote.voters)
                    }}
                    name={'ios-people'} type={"Ionicons"}></Icon></View>
            </View>
            <View style={{ margin: '2%', }}>
                <TextContent
                    handleLongPress={() => this.props.handleLongPress ? this.props.handleLongPress() : null}
                    pressingIn={() => this.props.pressingIn ? this.props.pressingIn() : null}
                    text={this.props.message.vote.description}></TextContent>
            </View>
            <View>
                {this.renderOptions()}
            </View>
        </View>
    }
}