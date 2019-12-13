import RNCalendarEvents from 'react-native-calendar-events';
import { PermissionsAndroid } from 'react-native';
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
    saveEvent(Bevent, alarms) {
        let calendarEvent = this.translateToCalendar(Bevent, alarms)
        return RNCalendarEvents.saveEvent(Bevent.about.title, calendarEvent)
    }
    translateToCalendar(Bevent, alarms) {
        console.warn(alarms, this.calendarID)
        return {
            id: Bevent.calendar_id ? Bevent.calendar_id : undefined,
            //calendarID: this.calendarID,
            title: Bevent.about.title,
            startDate: moment(Bevent.period).utc().format(UTCFormat),
            endDate: moment(Bevent.period).add(1, 'hours').utc().format(UTCFormat),
            allDay: false,
            recurrence: Bevent.recurrent ? Bevent.frequency : undefined,
            occurrenceDate: moment(Bevent.period).utc().format(UTCFormat),
            recurrentRule: Bevent.recurrent ? {
                frequency: Bevent.frequency,
                interval: Bevent.interval,
                occurrence: Bevent.occurrence,
            } : null,
            alarms: alarms,
            location: Bevent.location.string,
            notes: Bevent.notes,
            description:  GState.DeepLinkURL + "event/" + Bevent.id
        }
    }

}

const CalendarServe = new CalendarService()
export default CalendarServe
