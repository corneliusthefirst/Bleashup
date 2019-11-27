import moment from "moment"

export default function dateDisplayer(date){
    let statDate = moment(date, "YYYY/MM/DD")
    let end = moment()
    let daysDiff = moment.duration(end.diff(statDate)).asDays()
    switch (Math.floor(daysDiff)) {
        case 0:
            return "Today";
        case 1:
            return "Yesterday"
        case 2:
            return "2 Days Ago"
        case 3:
            return "3 Days Ago"
        case 4:
            return "4 Days Ago"
        case 5:
            return "5 Days Ago"
        case 6:
            return "6 Days Ago"
        case 7:
            return "7 Days Ago"
        default:
            return moment(date, "YYYY/MM/DD").format("dddd, MMMM Do YYYY")
    }
}