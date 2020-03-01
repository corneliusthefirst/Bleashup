import { returnAllIntervals, cleanupResult, datesIntervalflaterner, format } from "./recurrenceConfigs";
import moment from 'moment';
import { find } from "lodash"
// This function checks if a particular date , currentDate is withing any interval of time found
// in period . it return the interval if there exist any interval.
// The interval is of the type {round_parent,round,start,end}
export function getCurrentDateInterval(intervals, currentDate) {
    return new Promise((resolve, reject) => {
        resolve(find(intervals, (ele => moment(currentDate, format).format("X") >= moment(ele.start,
            format).format("X") &&
            moment(currentDate, format).format("X") < moment(ele.end, format).format("X"))))
    })
}
export function getCurrentDateIntervalNonAsync(intervals, currentDate) {
    return find(intervals, (ele => moment(currentDate, format).format("X") >= moment(ele.start,
        format).format("X") &&
        moment(currentDate, format).format("X") < moment(ele.end, format).format("X")))
}
export function getcurrentDateIntervals(period, interval, frequency, daysOfWeek) {
    return new Promise((resolve, reject) => {
        let intervals = returnAllIntervals(period, interval, frequency, daysOfWeek)
        resolve(datesIntervalflaterner(period, cleanupResult(intervals), [], 0)
        )
    })
}
export function getcurrentDateIntervalsNoneAsync(period, interval, frequency, daysOfWeek) {
    let intervals = returnAllIntervals(period, interval, frequency, daysOfWeek)
    return datesIntervalflaterner(period, cleanupResult(intervals), [], 0)
}
