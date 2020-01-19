import RNCalendarEvents from 'react-native-calendar-events';
import RNCalendarReminders from 'react-native-calendar-reminders';
import { PermissionsAndroid, Platform } from 'react-native';
import moment from 'moment';
import { findIndex } from 'lodash'
import stores from '../stores';
import GState from '../stores/globalState';

const BleashupCalendarID = "Bleashup-2018-bleashurs"
const UTCFormat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
class CalendarService {
    constructor() {
        RNCalendarEvents.authorizationStatus().then(status => {
            if (status === 'authorized') {
                RNCalendarEvents.findCalendars().then(calendars => {
                    let index = findIndex(calendars, { title: this.calendarTitle })
                    RNCalendarReminders.authorizeEventStore().then(status => {
                        console.warn(status, "ppppppp")
                    }).catch(e => {
                        console.warn(e)
                    })
                    if (index < 0) {
                        console.warn('creating calendar')
                        this.createBleashupCalendar()
                    } else {
                        this.calendarID = calendars[index].id
                    }
                })
            } else {
                this.requestCalendarPermission().then(() => {

                })
            }
        })

    }
    calendarID = null
    calendarTitle = "Bleashup Activities Manager"
    calendarName = "Bleashup"
    createBleashupCalendar() {
        let Bcalendar = {
            name: this.calendarName,
            title: this.calendarTitle,
            entityType: 'event',
            accessLevel: 'freeebusy',
            ownerAccount: `Bleashup( ${stores.LoginStore.user.phone.replace('00', '+')})`,
            source: {
                name: `Bleashup( ${stores.LoginStore.user.phone.replace('00', '+')})`,
                type: "Mobile Phone"
            },

            //isPrimary: false,
            //allowsModifications: false,
            color: "#1FABAB",
        }
        RNCalendarEvents.saveCalendar(Bcalendar).then((id) => {
            console.warn(id)
            this.calendarID = id
        })
    }
    async requestCalendarPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
                {
                    title: 'Bleashup App Calendar Permission',
                    message:
                        'Calendar Wants to Access Calendar' +
                        'So as to ease Management',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Permission to calendar granted');
            } else {
                console.log('Permission To Calendar denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }
    fetchAllCalendarEvents() {
        return RNCalendarEvents.fetchAllEvents(moment().subtract(8, 'months').utc().format(UTCFormat),
            moment().add(1, 'years').utc().format(UTCFormat))
    }
    saveEvent(Bevent, alarms, type) {
        if (Bevent.period && Bevent.period.includes("T")) {
            let calendarEvent = type === 'reminds' ? this.translateRemindToCalendar(Bevent) : this.translateToCalendar(Bevent, alarms)
            console.warn(calendarEvent)
            /*let calendarEvent = {   
                title : "test",
                startDate: (new Date()).toISOString(),
                recurrence: 'weekly',
                recurrenceRule: {
                    frequency: 'weekly',
                    interval: 2,
                    endDate: (new Date()).toISOString(),
                }
            }*/
            return RNCalendarEvents.saveEvent(type === 'reminds' ? `${Bevent.title} reminder` : Bevent.about.title, calendarEvent)
        } else {
            return new Promise((resolve, reject) => {
                if (Bevent.calendar_id) {
                    RNCalendarEvents.removeEvent(Bevent.calendar_id, { futureEvents: true }).then((res) => {
                        resolve()
                    })
                } else {
                    resolve()
                }
            })
        }
    }
    translateRemindToCalendar(Bevent, alarms) {
        console.warn('translating to reminder',Bevent.calendar_id)
        return Platform.OS === 'android' ? {
            id: Bevent.calendar_id ? Bevent.calendar_id : undefined,
            //calendarID: this.calendarID,
            title: `${Bevent.title} reminder`,
            startDate: moment(Bevent.period).utc().format(UTCFormat),
            allDay: false,
            recurrence: Bevent.recursive_frequency.frequency,
            //occurrenceDate: Platform.OS !== "ios" ? null : moment(Bevent.period).utc().format(UTCFormat),
            recurrenceRule: {
                frequency: Bevent.recursive_frequency.frequency,
                interval: Bevent.recursive_frequency.interval,
                //occurrence: Bevent.recurrence,
                endDate: moment(Bevent.recursive_frequency.recurrence).utc().format(UTCFormat)
            },
            //recurrenceInterval:Bevent.recurrent? parseInt(Bevent.interval):null,
            alarms: alarms,
            //location: Bevent.location.string,
            notes: Bevent.description,
            description: GState.DeepLinkURL + "event/" + Bevent.event_id
        } : {
                id: Bevent.calendar_id ? Bevent.calendar_id : undefined,
                //calendarID: this.calendarID,
                title: Bevent.title + ' reminder',
                startDate: moment(Bevent.period).utc().format(UTCFormat),
                endDate: Platform.OS === "ios" ? null : moment(Bevent.period).add(1, 'hours').utc().format(UTCFormat),
                allDay: false,
                recurrence: Bevent.recursive_frequency.frequency,
                occurrenceDate: Platform.OS !== "ios" ? null : moment(Bevent.period).utc().format(UTCFormat),
                recurrenceRule: {
                    frequency: Bevent.recursive_frequency.frequency,
                    interval: Bevent.recursive_frequency.interval,
                    //occurrence: Bevent.recurrence,
                    endDate: moment(Bevent.recursive_frequency.recurrence).add(1, 'hours').utc().format(UTCFormat)
                },
                //recurrenceInterval:Bevent.recurrent? parseInt(Bevent.interval):null,
                alarms: alarms,
                notes: Bevent.description,
                description: GState.DeepLinkURL + "event/" + Bevent.event_id
            }
    }
    translateToCalendar(Bevent, alarms) {
        return Platform.OS === "android" ? {
            id: Bevent.calendar_id ? Bevent.calendar_id : undefined,
            //calendarID: this.calendarID,
            title: Bevent.about.title,
            startDate: moment(Bevent.period).utc().format(UTCFormat),
            endDate: Bevent.recurrent ? undefined : moment(Bevent.period).add(1, 'hours').utc().format(UTCFormat),
            allDay: false,
            recurrence: Bevent.recurrent ? Bevent.frequency : undefined,
            //occurrenceDate: Platform.OS !== "ios" ? null : moment(Bevent.period).utc().format(UTCFormat),
            recurrenceRule: {
                frequency: Bevent.recurrent ? Bevent.frequency : undefined,
                interval: Bevent.interval,
                //occurrence: Bevent.recurrence,
                endDate: moment(Bevent.recurrence).utc().format(UTCFormat)
            },
            //recurrenceInterval:Bevent.recurrent? parseInt(Bevent.interval):null,
            alarms: alarms,
            location: Bevent.location.string,
            notes: Bevent.notes,
            description: GState.DeepLinkURL + "event/" + Bevent.id
        } : {
                id: Bevent.calendar_id ? Bevent.calendar_id : undefined,
                //calendarID: this.calendarID,
                title: Bevent.about.title,
                startDate: moment(Bevent.period).utc().format(UTCFormat),
                endDate: Platform.OS === "ios" ? null : moment(Bevent.period).add(1, 'hours').utc().format(UTCFormat),
                allDay: false,
                recurrence: Bevent.recurrent ? Bevent.frequency : null,
                occurrenceDate: Platform.OS !== "ios" ? null : moment(Bevent.period).utc().format(UTCFormat),
                recurrenceRule: {
                    frequency: Bevent.recurrent ? Bevent.frequency : null,
                    interval: Bevent.interval,
                    //occurrence: Bevent.recurrence,
                    endDate: moment(Bevent.recurrence).add(1, 'hours').utc().format(UTCFormat)
                },
                //recurrenceInterval:Bevent.recurrent? parseInt(Bevent.interval):null,
                alarms: alarms,
                location: Bevent.location.string,
                notes: Bevent.notes,
                description: GState.DeepLinkURL + "event/" + Bevent.id
            }
    }

}

const CalendarServe = new CalendarService()
export default CalendarServe
