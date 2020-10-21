import moment from "moment"
import Texts from '../meta/text';

export default function dateDisplayer(date){
    let statDate = moment(date, "YYYY/MM/DD")
    let end = moment()
    let daysDiff = moment.duration(end.diff(statDate)).asDays()
    switch (Math.floor(daysDiff)) {
        case 0:
            return Texts.today;
        case 1:
            return Texts.yesterday
        case 2:
            return Texts.two_days_ago
        case 3:
            return Texts.three_days_ago
        case 4:
            return Texts.four_days_ago
        case 5:
            return Texts.five_day_ago
        case 6:
            return Texts.six_days_ago
        case 7:
            return Texts.seven_days_ago
        default:
            return moment(date, "YYYY/MM/DD").calendar()
    }
}