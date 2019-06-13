import Highlights from "./highlights"
import Contributions from "./contributions"
import Session from "./session"
import Votes from "./votes"
import Contacts from "./contacts"
import Likes from "./likes"
import Invitations from "./Invitations"
import Events from "./events"
import LoginStore from "./LoginStore"
import ChangeLogs from "./changelogs"

export default {

    LoginStore: new LoginStore(),
    Highlights: new Highlights(),
    Events: new Events(),
    Contributions: new Contributions(),
    Session: new Session(),
    Contacts: new Contacts(),
    Votes: new Votes(),
    Invitations: new Invitations(),
    ChangeLogs: new ChangeLogs(),
    Likes: new Likes(),


};





































/*

export default function() {
  return function() {
    const getAllStores = () => ({
      'loginStore': new LoginStore(),
      'newLoginStore': new NewLoginStore(),

      'statusStore': new StatusStore(),
      'newStatusStore': new NewStatusStore(),

      'chatStore': new ChatStore(),
      'newChatStore': new NewChatStore(),

      'currentEventStore': new CurrentEventStore(),
      'newCurrentEventStore': new NewCurrentEventStore(),
      'pastEventStore': new PastEventStore(),
      'newPastEventStore': new NewPastEventStore(),

      'sendInvite': new SendInviteStore(),
      'newSendInviteStore': new NewSendInviteStore(),
      'receivedInviteStore': new ReceivedInviteStore(),
      'newReceivedInviteStore': new NewReceivedInviteStore(),
    });

    return {
      getAllStores,
    };
  }

} 
 */
