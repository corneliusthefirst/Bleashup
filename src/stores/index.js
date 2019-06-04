import LoginStore from "./login/LoginStore";
import NewLoginStore from "./login/NewLoginStore";
import StatusStore from "./status/StatusStore";
import NewStatusStore from "./status/NewStatusStore";

import ChatStore from "./chat/ChatStore";
import NewChatStore from "./chat/NewChatStore";

import CurrentEventStore from "./event/CurrentEventStore";
import NewCurrentEventStore from "./event/NewCurrentEventStore";
import PastEventStore from "./event/PastEventStore";
import NewPastEventStore from "./event/NewPastEventStore";

import SendInviteStore from "./invitation/SendInviteStore";
import NewSendInviteStore from "./invitation/NewSendInviteStore";
import ReceivedInviteStore from "./invitation/ReceivedInviteStore";
import NewReceivedInviteStore from "./invitation/NewReceivedInviteStore";


export default  {

      loginStore: new LoginStore(),
      newLoginStore: new NewLoginStore(),

      statusStore: new StatusStore(),
      newStatusStore: new NewStatusStore(),

      chatStore: new ChatStore(),
      newChatStore: new NewChatStore(),

      currentEventStore: new CurrentEventStore(),
      newCurrentEventStore: new NewCurrentEventStore(),
      pastEventStore: new PastEventStore(),
      newPastEventStore: new NewPastEventStore(),

      sendInvite: new SendInviteStore(),
      newSendInviteStore: new NewSendInviteStore(),
      receivedInviteStore: new ReceivedInviteStore(),
      newReceivedInviteStore: new NewReceivedInviteStore()

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