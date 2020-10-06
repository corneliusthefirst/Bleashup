import { returnAllIntervals, cleanupResult, datesIntervalflaterner, format } from "./recurrenceConfigs";
import moment from 'moment';
import { find } from "lodash"

// This function checks if a particular date , currentDate is withing any interval of time found
// in period . it return the interval if there exist any interval.
// The interval is of the type {round_parent,round,start,end}
export function getCurrentDateInterval(intervals, currentDate) {
    return new Promise((resolve, reject) => {
        resolve(find(intervals, (ele => ele && moment(currentDate, format).format("x") >= moment(ele.start,
            format).format("x") &&
            moment(currentDate, format).format("x") < moment(ele.end, format).format("x"))))
    })
}
export function getCurrentDateIntervalNonAsync(intervals, currentDate) {
    return find(intervals, (ele => ele && moment(currentDate, format).format("x") >= moment(ele.start,
        format).format("x") &&
        moment(currentDate, format).format("x") < moment(ele.end, format).format("x")))
}
export function getcurrentDateIntervals(period, interval, frequency, daysOfWeek) {
    return new Promise((resolve, reject) => {
        let intervals = returnAllIntervals(period, interval, frequency, daysOfWeek)
        let final = datesIntervalflaterner(period, cleanupResult(intervals, period.end), [], 0)
        if(final && final[final.length-1] && final[final.length-1].end) 
        final[final.length-1].end = period.end
        resolve(final)
    })
}
export function getcurrentDateIntervalsNoneAsync(period, interval, frequency, daysOfWeek) {
    let intervals = returnAllIntervals(period, interval, frequency, daysOfWeek)
    return datesIntervalflaterner(period, cleanupResult(intervals,period.end), [], 0)
}
