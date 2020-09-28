import React, { Component } from 'react';
import { View, TouchableOpacity } from "react-native"
import BleashupFlatList from '../../BleashupFlatList';
import IntervalSeparator from './IntervalSeparator';
import ProfileView from '../invitations/components/ProfileView';
import Swipeout from '../eventChat/Swipeout';
import BePureComponent from '../../BePureComponent';
import BeComponent from '../../BeComponent';
import ColorList from '../../colorList';
import { format } from '../../../services/recurrenceConfigs';
import moment from 'moment';
import Spinner from '../../Spinner';


export default class ConcerneeList extends BeComponent {
    constructor(props) {
        super(props)
    }
    state = {
        index: null,
        mounted: false
    }
    _keyExtractor = (item, index) => index.toString()
    delay = 0
    getItemLayout(tem, index) {
        return { length: 60, offset: index * 60, index }
    }
    highlightItem(index) {
            this.setStatePure({
                index,
            })
            setTimeout(() => {
                this.setStatePure({
                    index: null,
                })
            }, 2000)
    }
    componentDidMount() {
        setTimeout(() => {
            if (this.props.currentRemindUser) {
                let index = this.props.contacts.findIndex(ele => ele === this.props.currentRemindUser.phone)
                index>= 0 && this.refs.flatlist && this.refs.flatlist.scrollToIndex(index)
            }
            this.setStatePure({
                mounted: true
            })
        })
    }
    render() {
        return this.state.mounted ? <View>
            <BleashupFlatList
                firstIndex={0}
                ref={"flatlist"}
                renderPerBatch={5}
                initialRender={20}
                getItemLayout={this.getItemLayout.bind(this)}
                numberOfItems={this.props.contacts.length}
                keyExtractor={this._keyExtractor}
                dataSource={this.props.contacts}
                renderItem={(item, index) => {
                    let isCurrentIndex = index == this.state.index
                    this.delay = this.delay >= 20 ? 0 : this.delay + 1
                    return (this.props.complexReport ? <View key={index.toString()}>
                        {item.type === 'interval' ? <IntervalSeparator to={item.to}
                            actualInterval={this.props.actualInterval &&
                                item.from === this.props.actualInterval.start &&
                                item.to === this.props.actualInterval.end}
                            first={index === 0 ? true : false}
                            from={item.from}>
                            </IntervalSeparator> :
                            <View style={{
                                width: '90%',
                                alignSelf: 'center',
                                minHeight: 53,
                            }}
                                key={index.toString()}>
                                <View style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}>
                                    <View style={{ alignSelf: 'center', }}>
                                        <ProfileView
                                            delay={this.delay}
                                            phone={item.data.phone}>
                                        </ProfileView>
                                    </View>
                                </View></View>}
                    </View> :
                        <View
                            style={{
                                margin: '1%',
                                minHeight: 53,
                                padding: "1%",
                                backgroundColor: isCurrentIndex ? ColorList.remindsTransparent : ColorList.bodyBackground,
                                borderRadius: 15,
                                flexDirection: 'row',
                                width: "90%"
                            }}
                            key={index.toString()}><Swipeout swipeRight={() => {
                                this.props.reply({ phone: item, type: this.props.type, status: { date: moment(this.props.initDate, format).format() } })
                            }}
                                disableLeftSwipe={true}>
                                <View
                                    style={{
                                        margin: '2%',
                                        width: "100%",
                                        alignSelf: 'center',
                                    }}><ProfileView
                                        showHighlighter={() => this.props.currentRemindUser &&
                                            this.props.currentRemindUser.phone == item &&
                                            this.highlightItem(index)}
                                    delay={this.delay} phone={item}></ProfileView>
                                </View>
                            </Swipeout></View>)

                }}
            />
        </View> : <Spinner></Spinner>
    }
}