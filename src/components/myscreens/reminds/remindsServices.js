import { AlarmPatterns, format, frequencies, timeFormat, daysOfWeeksDefault, frequencyType } from "../../../services/recurrenceConfigs";
import { getCurrentDateInterval } from '../../../services/getCurrentDateInterval';
import stores from "../../../stores";
import { dateDiff, getDayMonth, getMonthDay } from "../../../services/datesWriter";
import moment from 'moment';
import { findIndex, find } from 'lodash';
import { confirmedChecker } from "../../../services/mapper";
import messagePreparer from '../eventChat/messagePreparer';
import Requester from '../eventChat/Requester';
import Texts from '../../../meta/text';
import public_states from './public_states';

export function returnStoredIntervalsKey(key){
    this.item = this.item || this.props.item
    return stores.Reminds.remindsIntervals && 
    stores.Reminds.remindsIntervals[this.item.event_id] && 
    stores.Reminds.remindsIntervals[this.item.event_id][this.item.id] && 
    stores.Reminds.remindsIntervals[this.item.event_id][this.item.id][key]
}
export function returnCurrentPatterns(remind) {
    return remind && remind.extra && remind.extra.alarms
        ? [
            ...AlarmPatterns()
                .map((ele) => {
                    return { ...ele, autoselected: false };
                })
                .filter(
                    (ele) => remind.extra.alarms.findIndex((e) => e.id == ele.id) < 0
                ),
            ...remind.extra.alarms.map((ele) => {
                return {
                    ...ele,
                    autoselected: true,
                };
            }),
        ]
        : AlarmPatterns();
}
export function loadStates(isThisProgram, fresh) {
    this.loadIntervals(isThisProgram, fresh).then(
        ({ currentDateIntervals, correspondingDateInterval }) => {
            this.calculateCurrentStates(
                currentDateIntervals,
                correspondingDateInterval
            ).then(() => {
                this.currentDateIntervals = currentDateIntervals
                this.correspondingDateInterval = correspondingDateInterval
                this.setStatePure({
                    mounted: true,
                    newing: !this.state.newing,
                });
            });
        }
    );
}
export function loadIntervals(canCheck, fresh) {
    this.item = this.item || this.props.item
    return new Promise((resolve, reject) => {
        const callback = (currentDateIntervals, correspondingDateInterval) => {
            canCheck &&
                this.showActions(
                    currentDateIntervals,
                    correspondingDateInterval,
                    true
                );
            canCheck && this.props.showReport &&
                this.props.showReport(currentDateIntervals, correspondingDateInterval);
            resolve({ currentDateIntervals, correspondingDateInterval });
        }
        stores.Reminds.getRemindsIntervals(this.item, fresh).then(
            ({ currentDateIntervals, correspondingDateInterval }) => {
                if (correspondingDateInterval) {
                    callback(currentDateIntervals, correspondingDateInterval)
                } else {
                    stores.Reminds.getCurrentInterval(
                        this.item,
                        currentDateIntervals,
                    ).then(({ correspondingDateInterval }) => {
                        callback(currentDateIntervals, correspondingDateInterval)
                    });
                }
            }
        );
    });
}

export function calculateCurrentStates(currentDateIntervals, correspondingDateInterval) {
    return new Promise((resolve) => {
        this.item = this.props.item || this.item
        this.hasDoneForThisInterval = find(
            this.item.donners,
            (ele) =>
                ele.status.date &&
                correspondingDateInterval &&
                moment(ele.status.date).format("x") >
                moment(correspondingDateInterval.start, format).format("x") &&
                moment(ele.status.date).format("x") <=
                moment(correspondingDateInterval.end, format).format("x") &&
                ele.phone === stores.LoginStore.user.phone
        )
            ? true
            : false;

        this.actualInterval = this.returnActualDatesIntervals(
            currentDateIntervals,
            correspondingDateInterval
        );
        if (!moment(this.actualInterval.period).isValid() || 
        !moment(this.actualInterval.recurrence).isValid()){
            this.loadIntervals(false,true)
        }
        this.realActualIntervals = this.returnRealActualIntervals(
            currentDateIntervals,
            correspondingDateInterval
        );
        this.dateDiff = dateDiff({
            recurrence: correspondingDateInterval
                ? moment(
                    correspondingDateInterval.end,
                    format
                ).format()
                : (this.item.recursive_frequency.recurrence || this.item.period),
        })
        this.lastIndex = 0;
        this.lastInterval = {};
        this.isLastInterval = false;
        if (currentDateIntervals && currentDateIntervals.length > 0) {
            this.lastIndex = currentDateIntervals.length - 1;
            this.lastInterval = currentDateIntervals[this.lastIndex];
            this.isLastInterval =
                this.realActualIntervals.start == this.lastInterval.start &&
                this.realActualIntervals.end == this.lastInterval.end && !this.notYetStarted;
        }

        this.canBeDone = correspondingDateInterval ? true : false;

        this.missed =
            dateDiff({
                recurrence: correspondingDateInterval
                    ? moment(correspondingDateInterval.end, format).format()
                    : (this.item.recursive_frequency.recurrence || this.item.period),
            }) > 0 && !this.hasDoneForThisInterval;
        this.status =
            this.item.confirmed &&
            correspondingDateInterval &&
            findIndex(this.item.confirmed, (ele) =>
                confirmedChecker(
                    ele,
                    stores.LoginStore.user.phone,
                    correspondingDateInterval
                )
            ) >= 0;
        this.cannotAssign =
            dateDiff({
                recurrence: correspondingDateInterval
                    ? moment(correspondingDateInterval.end, format).format()
                    : (this.item.recursive_frequency.recurrence
                        || this.item.period),
            }) > 0 || this.item.status === public_states.private_;
        this.member =
            findIndex(this.item.members, {
                phone: stores.LoginStore.user.phone,
            }) >= 0;
        this.membersCount = (this.item.members && this.item.members.length) > 0 ? `${this.item.members.length} ${Texts.members}` : ""
        this.remindTimeDetails = `${sayInitialDate(this.item.period)}.\n${returnFrequency(this.item.recursive_frequency.frequency,
            this.item.recursive_frequency.days_of_week,
            this.item.period,
            this.item.recursive_frequency.recurrence, this.item.recursive_frequency.interval)}`
        this.canShare = this.item.status == public_states.public_
        resolve();
    });
}

function returnFrequency(frequency, dayOfWeek, date, enddate, interval) {

    const returnDays = () => dayOfWeek.reduce((prev, day) => prev +
        daysOfWeeksDefault.find(ele => ele.code == day).day + ", ", "")
    const occursOnce = frequency == frequencies['yearly'] && interval == 1
    const hasPassed = moment(enddate).format("x") < moment().format("x")
    const final = `${occursOnce ? hasPassed ? Texts.past_since :
        Texts.ends : (' ' + Texts.until)} ${moment(enddate).calendar()}`
    const getFrequency = () => {
        switch (frequency) {
            case frequencies.daily:
                return `${Texts.every_day_at} ${moment(date).format(timeFormat)}`
            case frequencies.monthly:
                return `${Texts.every_month_on_the} ${getDayMonth(date)}`
            case frequencies.weekly:
                return `${Texts.every} ${returnDays()} ${Texts.at} ${moment(date).format(timeFormat)}`
            case frequencies.yearly:
                return occursOnce ? "" : `${Texts.yearly_on} ${getMonthDay(date)}`
        }
    }
    return getFrequency() + final
}

function sayInitialDate(date) {
    let isPast = moment(date).format("x") < moment().format("x")

    let calendarDate = moment(date).calendar()
    return isPast ? `${Texts.started} ${calendarDate}` : `${Texts.starts} ${calendarDate}`
}

export function returnActualDatesIntervals(currentDateIntervals, correspondingDateInterval) {
    this.item = this.props.item || this.item
    if (correspondingDateInterval) {
        let correspondingStartDate = moment(correspondingDateInterval.start, format).format()
        const correspondingEndDate = moment(correspondingDateInterval.end, format).format()
        const fistIntervalStart = moment(currentDateIntervals[0].start, format).format()
        if (fistIntervalStart == correspondingStartDate) {
            correspondingStartDate = moment(correspondingStartDate).add(1, 'year')
        }
        this.notYetStarted = moment(correspondingStartDate).isAfter(moment().format())
        const date = this.notYetStarted ? correspondingStartDate : correspondingEndDate
        return {
            period: date,
            recurrence: date,
            title: this.item.title,
        }
    } else {
        const currentEndDate = moment(currentDateIntervals[currentDateIntervals.length - 1].end, format).format()
        const currentStartDate = moment(currentDateIntervals[currentDateIntervals.length - 1].start, format).format()
        const isAboveStart = moment().format("x") > moment(currentStartDate).format("x")
        const date = isAboveStart ? currentEndDate : currentStartDate
        return {
            period: date,
            recurrence: date,
            title: this.item.title,
        }
    }
}
export function returnRealActualIntervals(currentDateIntervals, correspondingDateInterval) {
    return correspondingDateInterval
        ? {
            start: correspondingDateInterval.start,
            end: correspondingDateInterval.end,
        }
        : {
            period: currentDateIntervals[currentDateIntervals.length - 1].start,
            recurrence: currentDateIntervals[currentDateIntervals.length - 1].end,
        };
}

export function sendRemindAsMessage(remind, activity_name) {
    let message = messagePreparer.formMessageFromRemind(remind)
    return Requester.sendMessage(message, remind.event_id, remind.event_id, true, activity_name)
}

export function intervalFilterFunc(el, ele) {
    return (
        moment(el.status.date).format("x") >
        (ele && moment(ele.start, format).format("x")) &&
        moment(el.status.date).format("x") <= (ele && moment(ele.end, format).format("x"))
    );
}
export function returnActualDonners(member,report,url){
    return {
        ...(this.state.currentDonner || member),
        status: {
            date: moment().format(),
            status: member.status,
            ...(this.state.currentDonner && this.state.currentDonner.status),
            latest_edit: this.state.currentDonner && moment().format(),
            report: report,
            url
        },
    }
}
