import Texts from "../meta/text";

var moment = require("moment")
var _ = require("lodash")
const UTCFormat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
export const frequencyType = [{
    value: 'Day(s)',
}, {
    value: 'Week(s)'
}, {
    value: 'Month(s)',
}, {
    value: 'Year(s)',
}];

export function AlarmPatterns() {
    return [{
        id: 1,
        offset: 604800,
        text: Texts.a_week_before
    }, {
        id: 2,
        offset: 172800,
        text: Texts.two_days_before
    }, {
        id: 3,
        offset: 86400,
        text: Texts.one_day_before

    }, {

        id: 4,
        offset: 72000,
        text: Texts.twenty_hours_before

    }, {

        id: 5,
        offset: 68400,
        text: Texts.nineteen_hours_before

    }, {

        id: 6,
        offset: 64800,
        text: Texts.eighteen_hours_before

    }, {

        id: 7,
        offset: 61200,
        text: Texts.seventeen_hours_before

    }, {

        id: 8,
        offset: 57600,
        text: Texts.sixteen_hours_before

    }, {

        id: 9,
        offset: 54000,
        text: Texts.fifteen_hours_before

    }, {

        id: 10,
        offset: 50400,
        text: Texts.fourteen_hours_before

    }, {

        id: 11,
        offset: 46800,
        text: Texts.thirteen_hours_before

    }, {

        id: 12,
        offset: 43200,
        text: Texts.twelve_hours_before

    }, {

        id: 13,
        offset: 39600,
        text: Texts.eleven_hours_before

    }, {

        id: 14,
        offset: 36000,
        text: Texts.ten_hours_before

    }, {

        id: 15,
        offset: 32400,
        text: Texts.nine_hours_before

    }, {

        id: 16,
        offset: 28800,
        text: Texts.eight_hours_before

    }, {

        id: 17,
        offset: 25200,
        text: Texts.seven_hours_before

    }, {

        id: 18,
        offset: 21600,
        text: Texts.six_hours_before

    }, {

        id: 19,
        offset: 18000,
        text: Texts.five_hours_before,

    }, {

        id: 20,
        offset: 14400,
        text: Texts.four_hours_before,

    }, {

        id: 21,
        offset: 10800,
        text: Texts.three_hours_before,

    }, {
        id: 22,
        offset: 7200,
        text: Texts.two_hours_before,
    }, {
        id: 23,
        offset: 3600,
        text: Texts.one_hour_before,
    }, {
        id: 24,
        offset: 1800,
        text: Texts.thirty_mins_before,
    }, {
        id: 25,
        autoselected: true,
        offset: 600,
        text: Texts.ten_minutes_before
    }, {
        id: 26,
        offset: 300,
        text: Texts.five_minutes_before
    }, {
        id: 27,
        autoselected: true,
        offset: 120,
        text: Texts.two_minuts_before
    }, {
        id: 28,
        offset: 0,
        text: Texts.on_time
    }]
}
export function callculateAlarmOffset(offset) {
    return offset ? moment().subtract(offset, 'seconds') : moment().utc().format(UTCFormat)
}
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
    period.end = moment(period.start, format).format('x') >
        moment(period.end, format).format('x') ? moment(period.start, format).add(1, 'h').format(format) :
        period.end
    function returnFutureDate(count, interval) {
        return moment(period.start, format).add(count, intervaler[interval]).format("x")
    }
    function calculatePreviousWeekIntervalEndDate(previousInterval) {
        return previousInterval.weeks_interval[previousInterval.weeks_interval.length - 1].end
    }
    let date = returnFutureDate(i, frequency)
    let compareDate = date
    let endDate = returnFutureDate(i + interval, frequency)
    let end = moment(period.end, format).format('x')
    let dates = []
    for (let p = 0; p <= 366; p++) {
        date = returnFutureDate(i, frequency)
        compareDate = dates[dates.length - 1] && dates[dates.length - 1].end ?
            moment(dates[dates.length - 1].end, format).format("x") :
            returnFutureDate(i, frequency)
        endDate = returnFutureDate(i + interval, frequency)
        if (compareDate >= end) {
            break
        }
        let formatedDate = moment(date, "x").format(format)
        let formatedEndDate = moment(endDate, "x").format(format)
        let isWeekIntervaling = daysOfWeek && daysOfWeek.length > 0 && frequency === 'weekly'
        let weeksIntervals = isWeekIntervaling ? formWeekIntervals(daysOfWeek,
            {
                start: formatedDate,
                end: formatedEndDate
            },
            i > 0 ? calculatePreviousWeekIntervalEndDate(dates[dates.length - 1]) :
                formatedDate).
            filter(ele =>
                moment(ele.start, format).format("x") >= moment(period.start, format).format("x") &&
                moment(ele.start, format).format("x") < moment(period.end, format).format("x") &&
                true //moment(el.end, format).format("x") <= moment(period.start, format).format("x")
            ) : null
        dates[dates.length] = {
            start: formatedDate, round: dates.length + 1,
            weeks_interval: weeksIntervals,
            end: isWeekIntervaling && weeksIntervals && weeksIntervals.length > 0 ? weeksIntervals[weeksIntervals.length - 1].end : formatedEndDate
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
        moment(ele.end, format).format("x") <= moment(period.start, format).format("x") &&
        moment(ele.end, format).format("x") <= moment(period.end, format).format("x")).
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
        temp = moment(ele.end, format).format("x") < moment(ele.start, format).format("x") &&
            datesInterval[0].weeks_interval.length === 1 ?
            {
                start: ele.start,
                round: ele.round,
                end: datesInterval[1].weeks_interval && datesInterval[1].weeks_interval.length > 0 ?
                    datesInterval[1].weeks_interval[0].start : ele.start
            } :
            moment(ele.end, format).format("x") < moment(ele.start,
                format).format("x") ? {
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
    //console.error(result.length,i)
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
            ...result].filter(ele => moment(ele.end, format).format('x') <=
                moment(period.end, format).format('x')).sort(sorterx).sort(sorter)
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

    function convertDate(data, newDate) {
        newDate.start_date = parseInt(this.getUnixTimeStamp(newDate.start_date), 10)
        newDate.end_date = parseInt(this.getUnixTimeStamp(newDate.end_date), 10)
        let newDateDifference = parseInt(newDate.end_date - newDate.start_date, 10);
        data.start_date = parseInt(this.getUnixTimeStamp(data.start_date), 10);
        data.end_date = parseInt(this.getUnixTimeStamp(data.end_date), 10);
        let dateDifference = parseInt(data.end_date - data.start_date, 10);

        let mapper = (date) => {
            let date1 = (parseInt(this.getUnixTimeStamp(date.start_date), 10) -
                parseInt(this.getUnixTimeStamp(data.start_date), 10)) / dateDifference;

            let newDate1 = Math.floor(date1 * newDateDifference)
            newDate1 = moment(newDate1 + newDate.start_date).format()
            let date2 = (parseInt(this.getUnixTimeStamp(date.end_date), 10) -
                parseInt(this.getUnixTimeStamp(data.start_date), 10)) / dateDifference;
            let newDate2 = Math.floor(date2 * newDateDifference)
            newDate2 = moment(newDate2 + newDate.start_date).format()
            date.start_date = newDate1
            date.end_date = newDate2
            return date
        }
        let GsystemMapper = (dataParam) => {
            if (!dataParam.configurations) return dataParam
            if (dataParam.configurations.includes("timeline")) {
                dataParam.configurations = JSON.parse(dataParam.configurations)
                let date = {
                    start_date: dataParam.configurations.timeline[0],
                    end_date: dataParam.configurations.timeline[1]
                }
                date = mapper(date, newDate);
                dataParam.configurations.timeline = [date.start_date, date.end_date]
                dataParam.configurations = JSON.stringify(dataParam.configurations)
                return dataParam
            } else {
                return dataParam
            }
        }
        data.rounds = data.rounds.map(mapper);
        data.grading_systems = data.grading_systems.map(GsystemMapper)
        return {
            ...data, start_date: moment(newDate.start_date).format(),
            end_date: moment(newDate.end_date).format()
        };
    }
    function getUnixTimeStamp(dateTime) {
        return moment(dateTime).format("x");
    }
}