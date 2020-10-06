import { format } from "./recurrenceConfigs";
import moment from 'moment';
import { getcurrentDateIntervalsNoneAsync } from "./getCurrentDateInterval";
export function mapper(ele) {
    ele.intervals = getcurrentDateIntervalsNoneAsync({
        start: moment(ele.period).format(format),
        end: moment(ele.recursive_frequency.recurrence).
            format(format)
    }, ele.recursive_frequency.interval, ele.recursive_frequency.frequency, ele.recursive_frequency.days_of_week);
    return ele;
}

export function confirmedChecker(ele,phone,correspondingDate){
    return ele && ele.phone === phone &&
        moment(ele.status.date).format('X') >
        moment(correspondingDate.start, format).format('X') &&
        moment(ele.status.date).format('X') <=
        moment(correspondingDate.end, format).format('X')
}