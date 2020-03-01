var moment = require("moment")
var _ = require("lodash")
export const frequencyType = [{
    value: 'Day(s)',
}, {
    value: 'Week(s)'
}, {
    value: 'Month(s)',
}, {
    value: 'Year(s)',
}];
export const daysOfWeeksDefault = [
    { code: "SU", day: 'Sunday' },
    { code: "MO", day: 'Monday' },
    { code: "TU", day: 'Tuesday' },
    { code: "WE", day: 'Wednesday' },
    { code: "TH", day: 'Thursday' },
    { code: "FR", day: 'Friday' },
    { code: "SA", day: 'Saturday' },
]

export const FrequencyReverser = {
    'weekly': 'Week(s)',
    'daily': 'Day(s)',
    'monthly': 'Month(s)',
    'yearly': 'Year(s)'
}
export const nameToDataMapper = {
    'Week(s)': 'weekly',
    'Day(s)': 'daily',
    'Month(s)': 'monthly',
    'Year(s)': 'yearly'
}
const CorrectDays = {
    'SU': 0,
    'MO': 1,
    'TU': 2,
    'WE': 3,
    'TH': 4,
    'FR': 5,
    'SA': 6
}
const wrongDays = {
    'SU': 6,
    'MO': 0,
    'TU': 1,
    'WE': 2,
    'TH': 3,
    'FR': 4,
    'SA': 5
}
function daysOffseter(day) {
    if (moment().startOf('week').format("dddd, MMMM Do YYYY, h:mm:ss a").split(",")[0] === "Monday") {
        return wrongDays[day]
    } else {
        return CorrectDays[day]
    }
}
const intervaler = {
    'weekly': 'w',
    'daily': 'd',
    'monthly': 'months',
    'yearly': 'y'
}
export const format = "dddd, MMMM Do YYYY, h:mm:ss a"

// returnAllIntervals function is used to get all the possible date intervals in a given period
// given the frequency:{weekly,daily,monthly.tearly} ,interval:1,2,3,4 etc and daysOfWeek if provided

export function returnAllIntervals(period, interval, frequency, daysOfWeek) {
    let i = 0
    period.end = moment(period.start, format).format('X') >
        moment(period.end, format).format('X') ? moment(period.start, format).add(1, 'h').format(format) :
        period.end
    function returnFutureDate(count, interval) {
        return moment(period.start, format).add(count, intervaler[interval]).format("X")
    }
    let date = returnFutureDate(i, frequency)
    let endDate = returnFutureDate(i + interval, frequency)
    let end = moment(period.end, format).format('X')
    let dates = []
    for (let p = 0; p <= 366; p++) {
        date = returnFutureDate(i, frequency)
        endDate = returnFutureDate(i + interval, frequency)
        if (date > end) {
            break
        }
        let formatedDate = moment(date, "X").format(format)
        let formatedEndDate = moment(endDate, "X").format(format)
        dates[dates.length] = {
            start: formatedDate, round: dates.length + 1,
            weeks_interval: daysOfWeek && daysOfWeek.length && frequency === 'weekly' > 0 ? formWeekIntervals(daysOfWeek,
                {
                    start: formatedDate,
                    end: formatedEndDate
                },
                i > 0 ? (dates[dates.length - 1].weeks_interval[dates[dates.length - 1].weeks_interval.length - 1].end) :
                    formatedDate).
                filter(ele =>
                    moment(ele.start, format).format("X") >= moment(period.start, format).format("X") &&
                    moment(ele.start, format).format("X") < moment(period.end, format).format("X") &&
                    true //moment(el.end, format).format("X") <= moment(period.start, format).format("X")
                ) : null,
            end: formatedEndDate
        }
        i = i + interval
    } //while ();
    return dates
}
// This function is use to form the week's date intervals if withing a given period. 
export function formWeekIntervals(daysOfWeek, period, start) {
    return formWeekIntervaler(daysOfWeek, period, start)
}


function formWeekIntervaler(daysOfWeek, period, start) {
    let previousStart = JSON.stringify(start)
    let i = 0
    let sorter = (a, b) => (a > b ? 1 : a < b ? -1 : 0)
    let daysOffset = daysOfWeek.map(ele => daysOffseter(ele))
    let startDateOffseset = daysOffseter(daysOfWeeksDefault.filter(ele => ele.day === period.start.split(",")[0])[0].code)
    let daysOfWeekRelativeOffset = daysOffset.map((ele) => {
        return ele - startDateOffseset
    }).sort(sorter) // relative offset is very important for calculating 
    let currentResult = {}
    return daysOfWeekRelativeOffset.map(ele => {
        currentResult = {
            start: JSON.parse(previousStart),
            round: i + 1,
            end: moment(period.start, format).add(ele,
                'days').format(format)
        }
        previousStart = JSON.stringify(currentResult.end)
        i = i + 1;
        return currentResult
    })
}
export function filterWeekInervals(daysOfWeek, period, start) {
    let weeksIntervals = formWeekIntervaler(daysOfWeek, period, start);
    return weeksIntervals.filter(ele =>
        moment(ele.end, format).format("X") <= moment(period.start, format).format("X") &&
        moment(ele.end, format).format("X") <= moment(period.end, format).format("X")).
        map(ele => _.find(daysOfWeeksDefault, { day: ele.end.split(",")[0] }).code)
}
// This function is used to remove the error noticed that whenever the there is a day in weeks_interval of 
// a main interval, in the first array, this date is going  to be out of the main interval start and enddate, 
// this function solves that problem by assigning the end date of that erronous entry the 
// start date of  the next entry if any or the start date of it self.
export function cleanupResult(datesInterval) {
    let temp = ""
    let i = 0
    datesInterval[0].weeks_interval = datesInterval[0].weeks_interval ? datesInterval[0].weeks_interval.map(ele => {
        temp = moment(ele.end, format).format("X") < moment(ele.start, format).format("X") &&
            datesInterval[0].weeks_interval.length === 1 ?
            {
                start: ele.start,
                round: ele.round,
                end: datesInterval[1].weeks_interval && datesInterval[1].weeks_interval.length > 0 ?
                    datesInterval[1].weeks_interval[0].start : ele.start
            } :
            moment(ele.end, format).format("X") < moment(ele.start,
                format).format("X") ? {
                    start: ele.start,
                    round: ele.round,
                    end: datesInterval[0].weeks_interval[i + 1].start
                } : ele;
        i = i + 1
        return temp
    }) : null
    return datesInterval

}
// This function takes an array of object dates intervals 
// which might contain a week_interval property which is also an array of days intervals .
// this function returns a flatten version of the param datesInterval . a flaten version means
// mixing the week_interval with the main datesInterval array to form one array .
// The return data type is of the type {round_parent,round,start,end}

export function datesIntervalflaterner(period, datesInterval, result, i) {
    //console.warn(result.length,i)
    if (i === datesInterval.length) {
        !result[0] ? console.error(result, datesInterval, i) : null
        let sorter = (a, b) => (a.parent_round > b.parent_round ? 1 : a.parent_round < b.parent_round ? -1 : 0)
        let sorterx = (a, b) => (a.round > b.round ? 1 : a.round < b.round ? -1 : 0)
        if (result.length > 0 && result[0].start === result[0].end) {
            console.warn("entring here")
            result[0] = {
                ...result[0],
                start: moment(result[0].start, format).subtract(1, 'year').format(format)
            }
            return result.sort(sorterx).sort(sorter)
        } else {
            return result && [{
                round: 0, parent_round: 0, start: moment(result[0].start,
                    format).subtract(1, 'year').format(format), end: result[0].start
            },
            ...result].filter(ele => moment(ele.end, format).format('X') <=
                moment(period.end, format).format('X')).sort(sorterx).sort(sorter)
        }
    }
    else {
        result = [...result, ...datesInterval[i].weeks_interval && datesInterval[i].weeks_interval.length > 0 ?
            datesInterval[i].weeks_interval.map(ele => {
                return {
                    round: ele.round,
                    start: ele.start,
                    end: ele.end,
                    parent_round: datesInterval[i].round
                }
            }) :
            [{
                ...datesInterval[i],
                parent_round: datesInterval[i].round
            }]]
        return datesIntervalflaterner(period, datesInterval, result, i + 1)
    }
}