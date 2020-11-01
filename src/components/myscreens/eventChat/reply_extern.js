import ActivityPages from './chatPages';
import getRelation from '../Contacts/Relationer';
import GState from '../../../stores/globalState/index';
import BeNavigator from '../../../services/navigationServices';

class reply_extern {
    posts = 'Posts'
    post = 'Post'
    remind = "Remind"
    reminds = ActivityPages.reminds
    votes = 'Votes'
    vote = 'Vote'
    description = 'description'
    activity_photo="activity-photo"
    changes = 'Updates'
    committees = 'Commitees'
    committee  = "Committee"
    confirmed = "confirmed"
    done = "done"
    member = "member"
    replyWith(phone) {
        getRelation(phone).then((relation) => {
            GState.reply.activity_id = relation.id;
            setTimeout(() => {
                BeNavigator.pushToChat(relation);
            })
        });
    }
}
const replies = new reply_extern()
export default replies 