import Highlights from "./highlights"
import Contributions from "./contributions"
import Session from "./session"
import Votes from "./votes"
import Contacts from "./contacts"
import Likes from "./likes"
import Invitations from "./Invitations"
import Events from "./events"
import LoginStore from "./LoginStore"
import TempLoginStore from "./TempLoginStore"
import ChatStore from "./ChatStore"
import ChangeLogs from "./changelogs"
import Reminds from "./reminds"
import Publishers from "./publishers"
import TemporalUsersStore from "./temporalUsersStore"

export default {

  ChatStore: new ChatStore(),
  Reminds: new Reminds(),
  LoginStore: new LoginStore(),
  TempLoginStore: new TempLoginStore(),
  Highlights: new Highlights(),
  Events: new Events(),
  Contributions: new Contributions(),
  Session: new Session(),
  Contacts: new Contacts(),
  Votes: new Votes(),
  Invitations: new Invitations(),
  ChangeLogs: new ChangeLogs(),
  Likes: new Likes(),
  Publishers: new Publishers(),
  TemporalUsersStore: new TemporalUsersStore()


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
