
import request from '../../../services/requestObjects';
import IDMaker from '../../../services/IdMaker';
import testForURL from '../../../services/testForURL';
import message_types from './message_types';
class preparer {
    formMessageFromRemind(remind) {
        let message = request.Message();
        message.text = remind.title
        message.sent = true
        message.type = message_types.remind_message
        message.activity_id = remind.event_id
        message.forwarded = true
        message.from_activity = remind.event_id
        message.remind_id = remind.id
        message.committee_id = remind.event_id
        message.remind_date = remind.period
        message.end_date = remind.recursive_frequency.recurrence
        message.tags = remind.extra ? remind.extra.tags : null
        message.id = IDMaker.make()
        return message
    }
    formMessagefromStar(start) {
        let message = request.Message()
        message.text = start.title
        message.sent = true
        message.forwarded = true
        message.from_activity = start.event_id
        message.committee_id = start.event_id
        message.type = message_types.star_message
        message.tags = start.extra && start.extra.tags
        message.activity_id = start.event_id
        message.star_id = start.id
        message.id = IDMaker.make()
        return message
    }
    splitRegexp = /[\n|.|\r]/
    formURL(message) {
        return message.type === message_types.photo || message.type === message_types.image ? {
            photo: testForURL(message.photo) ? message.photo : message.source
        } : message.type === message_types.video ? {
            photo: message.thumbnailSource,
            video: testForURL(message.source) ? message.source : message.temp,
        } : message.type === message_types.audio ? {
            source: testForURL(message.source) ? message.source : message.temp,
            duration: message.duration,
        } : message.type == message_types.file ? {
            source: testForURL(message.source) ? message.source : message.temp,
            file_name: message.file_name
        } : null;
    }
    formRemindFromMessage(message, activity_id) {
        let start = request.Remind()
        start.event_id = activity_id
        start.title = message.text && message.text.split(this.splitRegexp)[0]
        start.description = message.text && message.text.split(this.splitRegexp).length > 1 ? message.text : ""
        start.remind_url = this.formURL(message)
        start.extra.tags = message.tags
        return start
    }
    formStarFromMessage(message, activity_id) {
        let start = request.Highlight()
        start.event_id = activity_id
        start.title = message.text && message.text.split(this.splitRegexp)[0]
        start.description = message.text && message.text.split(this.splitRegexp).length > 1 ? message.text : ""
        start.url = this.formURL(message)
        start.extra.tags = message.tags
        return start
    }
}
const messagePreparer = new preparer()
export default messagePreparer