
import moment from 'moment';
export function writeDateTime(event) {
    let date = event.period
    let statDate = moment(date)
    let currentDate = moment()
    let end = moment(typeof event.recurrence === "string" ? event.recurrence : null)
    let daysDiff = Math.floor(moment.duration(currentDate.diff(statDate)).asDays())
    let endDiff = Math.floor(moment.duration(currentDate.diff(end)).asDays())
    if (daysDiff < 0) {
        if (daysDiff === -1) {
            return "Starting Tomorrow at " + moment(date).format("h:mm a");
        } else {
            return `Starting in ${Math.abs(daysDiff)} Days at ` + moment(date).format("h:mm a");
        }
    } else if (daysDiff === 0) {
        return "Started Today At " + moment(date).format("h:mm a");
    } else if (endDiff > 0) {
        if (endDiff == 1) {
            return "Ended Yesterday at " + moment(end).format("h:mm a")
        } else if (endDiff > 1 && endDiff < 7) {
            return `Ended ${Math.abs(daysDiff)} Days Ago at ` + moment(end).format("h:mm a")
        } else if (endDiff == 7) {
            return "Ended 1 Week Ago at " + moment(end).format("h:mm a")
        }
        else {
            return `Ended on ${moment(end).format("dddd, MMMM Do YYYY")} at ${moment(end).format("h:mm a")}`
        }
    } else if (endDiff === 0) {
        return `Ends today at ${moment(end).format("h:mm a")}`
    } else if (endDiff < 0) {
        return `Started ${Math.abs(daysDiff)} Days Ago at ` + moment(end).format("h:mm a")
    }
}
export function dateDiff(event) {
    let currentDate = moment()
    let end = moment(event.recurrence ? event.recurrence : null)
    return daysDiff = Math.floor(moment.duration(currentDate.diff(end)).asDays())
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
    return moment(date).format("Do")
}

export function getMonthDay(date){
    return moment(date).format("MMMM Do")
}
export function getDay(date) {
    return moment(date).format('dddd')
}