import { returnAllIntervals } from "./recurrenceConfigs"

let frequency = 'monthly'
let interval = 1
let format = "dddd, MMMM Do YYYY, h:mm:ss a"
let daysOfWeek = null//["SA", "FR", "WE", "TH", "MO"]
let period = {
    start: moment("2020-02-26 18:21:12",
        "YYYY-MM-DD HH:mm:ss").format(format),
    end: moment("2020-3-29 14:21:12",
        "YYYY-MM-DD HH:mm:ss").format(format)
}

let allIntervals = returnAllIntervals(period,interval,frequency,daysOfWeek)
console.warn(allIntervals)