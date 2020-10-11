import Highlights from "./highlights"
import Session from "./session"
import Contacts from "./contacts"
import Likes from "./likes"
import Events from "./events"
import LoginStore from "./LoginStore"
import TempLoginStore from "./TempLoginStore"
import ChatStore from "./ChatStore"
import ChangeLogs from "./changelogs"
import Reminds from "./reminds"
import TemporalUsersStore from "./temporalUsersStore"
import PrivacyStore from './PrivacyStore';
import States from './states';

export default { 

  Reminds: new Reminds(),
  LoginStore: new LoginStore(),
  TempLoginStore: new TempLoginStore(),
  Highlights: new Highlights(),
  Events: new Events(),
  Session: new Session(),
  Contacts: new Contacts(),
  ChangeLogs: new ChangeLogs(),
  Likes: new Likes(),
  TemporalUsersStore: new TemporalUsersStore(),
  Privacy:new PrivacyStore(),
  States: new States(),
  Messages : new ChatStore(),


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
