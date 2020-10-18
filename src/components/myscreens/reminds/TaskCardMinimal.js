import React from "react"


import BeComponent from '../../BeComponent';
import { View, TouchableOpacity } from 'react-native';
import { remindTime, remindTitle, remindCreator ,remindMembers} from './taskCardParts';
import {
    loadStates,
    loadIntervals,
    calculateCurrentStates,
    returnRealActualIntervals,
    returnActualDatesIntervals,
    returnStoredIntervalsKey
} from './remindsServices';
import ColorList from '../../colorList';
import shadower from '../../shadower';
import BeNavigator from '../../../services/navigationServices';
import AnimatedComponent from '../../AnimatedComponent';

export default class TaskCardminimal extends BeComponent {
    constructor(props) {
        super(props)
        this.item = this.props.item
        this.state = {
            newing: false,
            mounted: false
        }
        this.loadStates = loadStates.bind(this)
        this.loadIntervals = loadIntervals.bind(this)
        this.remindTime = remindTime.bind(this)
        this.calculateCurrentStates = calculateCurrentStates.bind(this)
        this.returnRealActualIntervals = returnRealActualIntervals.bind(this)
        this.returnActualDatesIntervals = returnActualDatesIntervals.bind(this)
        this.remindTitle = remindTitle.bind(this)
        this.returnStoredIntervalsKey = returnStoredIntervalsKey.bind(this)
        this.correspondingDateInterval = this.returnStoredIntervalsKey("correspondingDateInterval");
        this.currentDateIntervals = this.returnStoredIntervalsKey("currentDateIntervals")
        this.goToRemindDetail = this.goToRemindDetail.bind(this)
        this.onPressTitle = this.onPressTitle.bind(this)
        this.remindMembers = remindMembers.bind(this)
        this.remindCreator = remindCreator.bind(this)

    }
    canLoadFirst() {
        return this.currentDateIntervals && !this.state.mounted
    }
    showMembers(){
        this.goToRemindDetail()
    }
    commponentDidMount() {
        this.loadStates()
    }
    shouldComponentUpdate(nextProps, nextState) {
        this.props.animate()
        return nextState.newing !== this.state.newing ||
            this.props.searchString !== nextProps.searchString ||
            nextState.mounted !== this.state.mounted ? true : false
    }
    onPressTitle(){
        this.props.goToRemindDetail(this.item.id, this.item.event_id)
    }
    goToRemindDetail() {
        this.props.goToRemindDetail(this.item.id, this.item.event_id)
    }
    render() {
        if (this.canLoadFirst()) {
            this.calculateCurrentStates(this.currentDateIntervals, this.correspondingDateInterval)
        }
        return <View style={{
            margin: '2%',
            borderRadius: 5,
            ...shadower(1),
            padding: '1%',
            backgroundColor: ColorList.bodyBackground,
        }}>
            <TouchableOpacity onPress={this.goToRemindDetail}>
                {this.remindTime()}
                {this.remindTitle()}
                {this.remindMembers()}
                {this.remindCreator()}
            </TouchableOpacity>
        </View>
    }
}