import LoginStore from '../../stores/login/LoginStore';
import NewLoginStore from '../../stores/login/NewLoginStore';
import StatusStore from '../../stores/status/StatusStore';
import NewStatusStore from '../../stores/status/NewStatusStore';

import ChatStore from '../../stores/chat/ChatStore';
import NewChatStore from '../../stores/chat/NewChatStore';
import CurrentEventStore from '../../stores/event/CurrentEventStore';
import NewCurrentEventStore from '../../event/event/NewCurrentEventStore';

import SendInviteStore from '../../stores/invitation/SendInviteStore';
import NewSendInviteStore from '../../stores/invitation/NewSendInviteStore';
import ReceivedInviteStore from '../../stores/invitation/ReceivedInviteStore';
import NewReceivedInviteStore from '../../stores/invitation/NewReceivedInviteStore';


export default function() {
  return function() {
    const getAllStores = () => ({
      'login.login': new LoginStore(),
      'login.newlogin': new NewLoginStore(),

      'status.login': new StatusStore(),
      'status.newstatus': new NewStatusStore(),

      'chat.chat': new ChatStore(),
      'chat.newchat': new NewChatStore(),

      'event.currentevent': new CurrentEventStore(),
      'event.newcurrentevent': new NewCurrentEventStore(),
      'event.pastevent': new PastEventStore(),
      'event.newpastevent': new NewPastEventStore(),

      'invitation.sendinvite': new SendInviteStore(),
      'invitation.newsendinvite': new NewSendInviteStore(),
      'invitation.receivedinvite': new ReceivedInviteStore(),
      'invitation.newreceivedinvite': new NewReceivedInviteStore(),
    });

    return {
      getAllStores,
    };
  }

} 
