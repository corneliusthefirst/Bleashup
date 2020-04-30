
import moment from 'moment';
import { format } from './recurrenceConfigs';
export function writeDateTime(event) {
    let date = event.period
    let statDate = moment(date)
    let currentDate = moment()
    let end = moment(typeof event.recurrence === "string" ? event.recurrence : null)
    let mathDiff = moment.duration(statDate.diff(currentDate)).asDays()
    let endMathdiff = moment.duration(end.diff(currentDate)).asDays()
    return mathDiff >= 0 ? `${mathDiff >= 0 ? "Starting" : "Ended"} ${moment(event.period).calendar()}` :
        `${endMathdiff >= 0 ? "Ends" : "Ended"} ${moment(event.recurrence).calendar()}`
}
export function dateDiff(event) {
    let currentDate = moment()
    let end = moment(event.recurrence ? event.recurrence : null)
    return daysDiff = moment.duration(currentDate.diff(end)).asDays()
}

export function writeInterval(frequency) {
    switch (frequency) {
        case 'daily':
            return 'day(s)';
        case 'weekly':
            return 'week(s)';
        case 'monthly':
            return 'month(s)';
        case 'yearly':
            return 'year(s)';
        default:
            return ''
    }
}
export function getDayMonth(date) {
    return moment(date, format).format(format) === date ?
        moment(date, format).format('Do') :moment(date).format("Do")
}

export function getMonthDay(date) {
    return moment(date, format).format(format) === date ?
        moment(date, format).format('MM Do') :moment(date).format("MMMM Do")
}
export function getDay(date) {
    return moment(date, format,true).isValid() ?
        moment(date, format).format('dddd') : moment(date).format('dddd')
}   