import React, { Component } from 'react';
import Modal from "react-native-modalbox"
import { View, TextInput } from 'react-native';
import { Text, Item, Button, Icon, Content } from 'native-base';
import Textarea from 'react-native-textarea';
import labler from './labler';
import { ScrollView } from 'react-native-gesture-handler';
import shadower from '../../shadower';
export default class VoteCreation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            vote: this.emptyVote
        }
    }
    emptyVote = {
        title: '',
        always_show: false,
        description: '',
        options: ['yes', 'no']
    }
    renderOptions() {
        return this.state.vote.options.map((item, index) => this.Itemer(index))
    }
    setOption(value, index) {
        let options = this.state.vote.options
        options[index] = value
        this.setState({
            vote: { ...this.state.vote, options: options },
            //newThing: !this.state.newThing
        })
    }
    removeNote(index) {
        this.state.vote.options.splice(index, 1)
        let options = this.state.vote.options
        this.setState({
            vote: { ...this.state.vote, options: options },
            showVoteOptionError: options.length <= 1 ? true : false
        })
    }
    Itemer(index) {
        return (<Item>
            <Text style={{ fontWeight: 'bold', color: '#1FABAB' }}>{`${labler(index)} .`}</Text><TextInput
                placeholder={'enter new note here'}
                value={this.state.vote.options[index]}
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
    addVote() {
        let vote = this.state.vote
        if (vote.options.length <= 1) {
            this.showVoteOptionError()
        } else if (!vote.description && !vote.title) {
            this.showVoteContentError()
        } else {
            vote.options = vote.options.map((ele, index) => {
                return {
                    name: ele,
                    vote_count: 0,
                    index: index
                }
            })
            this.props.takeVote({ ...vote, voters: [] })
            setTimeout(() => {
                this.setState({
                    vote: this.emptyVote
                })
            }, 1000)
        }
    }
    changeAlwaysShowState() {
        this.setState({
            vote: { ...this.state.vote, always_show: !this.state.vote.always_show }
        })
    }
    addOptions() {
        this.state.vote.options.unshift('')
        let options = this.state.vote.options
        this.setState({
            vote: {
                ...this.state.vote,
                options: options,
            },
            showVoteOptionError: options.length <= 1 ? true : false
            //newThing: !this.state.newThing
        })
    }
    state = {}
    render() {
        return <Modal
            position={'bottom'}
            backdropPressToClose={true}
            backButtonClose={true}
            coverScreen={true}
            isOpen={this.props.isOpen}
            onClosed={() => {
                this.props.onClosed()
            }}
            entry={'top'}
            style={{
                height: '60%',
                width: '100%',
                backgroundColor: '#FEFFDE',
                borderTopRightRadius: 8,
                borderTopLeftRadius: 8,
            }}
        >
            <View style={{ height: '100%', flexDirection: 'column', }}>
                <View style={{ margin: '3%', flexDirection: 'row', width: '95%', height: '6%',...shadower() }}>
                    <View style={{ width: '80%' }}>
                        <Text style={{
                            fontWeight: '400',
                            fontSize: 22,
                            alignSelf: 'center',
                            margin: '2%'
                        }}>{"New Poll"}</Text>
                    </View>
                    <View style={{ width: '20%' }}>
                        <Icon onPress={() => this.addVote()} name="sc-telegram" style={{ color: '#1FABAB', fontSize: 45, }} type={"EvilIcons"}>
                        </Icon>
                    </View>
                </View>
                <View style={{ height: '94%', }}>
                    <ScrollView style={{ height: '100%' }}>
                        <View style={{ margin: '3%', }}>
                            {this.state.showVoteContentError ? <Text style={{ color: "#A91A84", fontWeight: 'bold', }} note>{"vote should at least have a title or a detail"}</Text> : null}
                            {this.state.showVoteOptionError ? <Text style={{ color: "#A91A84", fontWeight: 'bold', }} note>{"vote should have at least a 2 options"}</Text> : null}
                            <Item>
                                <TextInput maxLength={25} value={this.state.vote.title} style={{ width: "100%" }}
                                    onChangeText={(text) => {
                                        this.setState({
                                            vote: { ...this.state.vote, title: text },
                                            showVoteContentError: (!text || text.length <= 0) && !this.state.vote.description ? true : false
                                        })
                                        //this.validator(text)
                                    }} placeholder="Poll title" />
                            </Item>
                            <Item>
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
                                    placeholder="Poll details" value={this.state.vote.description} keyboardType="default"
                                    onChangeText={(value) => {
                                        this.setState({
                                            vote: { ...this.state.vote, description: value },
                                            showVoteContentError: (!value || value.length <= 0) &&
                                             !this.state.vote.title ? true : false
                                        })
                                    }} />
                            </Item>
                            <Item>
                                <Button onPress={() => this.changeAlwaysShowState()} transparent>
                                    <Icon name={this.state.vote.always_show ? "radio-button-checked" :
                                        "radio-button-unchecked"} type={"MaterialIcons"}></Icon><Text>{"always show vote percentages"}</Text></Button>
                            </Item>
                            <Item>
                                <View style={{ flexDirection: 'column', }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Button onPress={() => this.addOptions()} transparent>
                                            <Text style={{ fontWeight: 'bold', fontStyle: 'italic', }}>{"Options"}</Text>
                                            <Icon name="pluscircle" type={"AntDesign"}></Icon></Button>
                                    </View>
                                    <View style={{ marginLeft: '2%',}}>
                                        {this.renderOptions()}
                                    </View>
                                </View>
                            </Item>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    }
}