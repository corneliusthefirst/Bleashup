export const frequencyType = [{
    value: 'Day(s)',
}, {
    value: 'Week(s)'
}, {
    value: 'Month(s)',
}, {
    value: 'Year(s)',
}];
export const  daysOfWeeksDefault = [
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