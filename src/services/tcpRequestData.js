import requestObject from "./requestObjects";
import transfer from "./transferable";
import stores from "../stores";
import GState from "../stores/globalState";

class tcpRequestData {
  Presence() {
    return this.sendData("presence", requestObject.None(), "presence");
  }

  UpdateCurrentEvent(phone, eventID, action, data, id) {
    let UpdateData = () => {
      if (action === "title") {
        let Update = requestObject.Update();
        Update.action = "about";
        Update.phone = phone;
        Update.event_id = eventID;
        Update.about_update.action = action;
        Update.about_update.title = data;
        return Update;
      } else if (action == "description") {
        let Update = requestObject.Update();
        Update.action = "about";
        Update.phone = phone;
        Update.event_id = eventID;
        Update.about_update.action = action;
        Update.about_update.description = data;
        return Update;
      } else if (action == "string") {
        let Update = requestObject.Update();
        Update.action = "location";
        Update.phone = phone;
        Update.event_id = eventID;
        Update.location_update.action = action;
        Update.location_update.string = data;
        return Update;
      } else if (action == "url") {
        let Update = requestObject.Update();
        Update.action = "location";
        Update.phone = phone;
        Update.event_id = eventID;
        Update.location_update.action = action;
        Update.location_update.url = data;
        return Update;
      } else if (action == "time") {
        let Update = requestObject.Update();
        Update.action = "period";
        Update.phone = phone;
        Update.event_id = eventID;
        Update.period_update.action = action;
        Update.period_update.time = data;
        return Update;
      } else if (action == "date") {
        let Update = requestObject.Update();
        Update.action = "period";
        Update.phone = phone;
        Update.event_id = eventID;
        Update.period_update.action = action;
        Update.period_update.date = data;
        return Update;
      } else if (action == "add") {
        let Update = requestObject.Update();
        Update.action = "participant";
        Update.phone = phone;
        Update.event_id = eventID;
        Update.participant_update.action = action;
        Update.participant_update.phone = data.phone;
        Update.participant_update.master = data.master;
        Update.participant_update.status = data.status;
        Update.participant_update.host = data.host;
        return Update;
      } else if (action == "remove") {
        let Update = requestObject.Update();
        Update.action = "participant";
        Update.phone = phone;
        Update.event_id = eventID;
        Update.participant_update.action = action;
        Update.participant_update.phone = data.phone;
        return Update;
      } else if (action == "master") {
        let Update = requestObject.Update();
        Update.action = "participant";
        Update.phone = phone;
        Update.event_id = eventID;
        Update.participant_update.action = action;
        Update.participant_update.phone = data.phone;
        Update.participant_update.master = data.master;
        return Update;
      } else if (action == "host") {
        let Update = requestObject.Update();
        Update.action = "participant";
        Update.phone = phone;
        Update.event_id = eventID;
        Update.participant_update.action = action;
        Update.participant_update.phone = data.phone;
        Update.participant_update.host = data.host;
        return Update;
      } else if (action == "background") {
        let Update = requestObject.Update();
        Update.action = "background";
        Update.phone = phone;
        Update.event_id = eventID;
        Update.background = data;
        return Update;
      }
    };
    return this.sendData(action, data, id);
  }

  createEvent(event, id) {
    return this.sendData("create_event", event, id);
  }

  sendData(action, data, id) {
    return new Promise((resolve, reject) => {
      stores.Session.getSession().then(session => {
        session.reference = session.reference
        transfer.formTransferableData(session, action, data, id).then(JSONData => {
          resolve(JSONData);
        });
      });
    });
  }

  //My data is requestObject.Invitation()
  acceptInvtation(invitation, id) {
    return this.sendData("accept_invitation", invitation, id);
  }

  //My data is requestObject.Invitation()
  denieInvitation(invitation, id) {
    return this.sendData("denie_invitation", invitation, id);
  }
  //My data is requestObject.Invite()
  invite(invite,id) {
    return this.sendData("invite", invite, id);
  }
  invite_many(invites,id){
    return this.sendData('invite_many',invites,id)
  }
  // My data is requestObject.Invite()
  received_invitation(data, id) {
    return this.sendData("received_invitation", data, id);
  }

  // My data is requestObject.Invite()
  seen_invitation(data, id) {
    return this.sendData("seen_invitation", data, id);
  }
  //My data is {"phone":phoneToLeave}
  leaveEvent(data, id) {
    return this.sendData("leave_event", data, id);
  }

  //My data is requestObject.EventID()
  postponeEvent(data, id) {
    return this.sendData("postpone_event", data, id);
  }
  //My data is requestObject.EventID()
  pastEvent(data, id) {
    return this.sendData("past_event", data, id);
  }

  //My data is requestObject.EventID()
  likeEvent(data, id) {
    return this.sendData("like_event", data, id);
  }

  //My data is requestObject.EventID()
  unlikeEvent(data, id) {
    return this.sendData("unlike_event", data, id);
  }

  //My data is requestObject.None()
  getContacts(phone, data, id) {
    return this.sendData("get_contacts", data, id);
  }

  //My data is requestObject.Contact()
  addContact(data, id) {
    return this.sendData("add_contact", data, id);
  }
  //My data is requestObject.Contact()
  removeContact(data, id) {
    return this.sendData("remove_contact", data, id);
  }

  //My data is requestObject.EventID()
  publishEvent(data, id) {
    return this.sendData("publish", data, id);
  }

  getPublishers(data, id) {
    return this.sendData("get_publishers", data, id);
  }

  //My data is requestObject.EventID()
  unpublishEvent(data, id) {
    return this.sendData("unpublish", data, id);
  }

  //My data is requestObject.EventID()
  addToPublic(data, id) {
    return this.sendData("add_to_public", data, id);
  }

  //My data is requestObject.EventID()
  removeFromPublic(data, id) {
    return this.sendData("remove_from_public", data, id);
  }

  //My data is requestObject.EventID()
  joinEvent(data, id) {
    return this.sendData("join_event", data, id);
  }

  //My data is requestObject.None()
  getEvents(data, id) {
    return this.sendData("get_events", data, id);
  }

  //My data is requestObject.EventID()
  getCurrentEvent(data, id) {
    return this.sendData("get_current_event", data, id);
  }

  //My data is requestObject.None()
  collectCurrentEvents(data, id) {
    return this.sendData("collect_current_events", data, id);
  }

  //My data is requestObject.Field()
  getFromCurrentEvent(data, id) {
    return this.sendData("get_from_current_event", data, id);
  }

  //My data is requestObject.Vote()
  CreateVote(data, id) {
    return this.sendData("create_vote", data, id);
  }

  //My data is requestObject.Voter()
  Vote(data, id) {
    return this.sendData("vote", data, id);
  }

  //My data is requestObject.VEID()
  deleteVote(data, id) {
    return this.sendData("delete_vote", data, id);
  }

  //My data is requestObject.VEID()
  publishVote(data, id) {
    return this.sendData("publish_vote", data, id);
  }

  //My data is requestObject.VotePeriod()
  changeVotePeriod(data, id) {
    return this.sendData("change_vote_period", data, id);
  }

  //My data is requestObject.VID()
  getVote(data, id) {
    return this.sendData("get_vote", data, id);
  }

  //My data is requestObject.EID()
  getVotes(data, id) {
    return this.sendData("get_votes", data, id);
  }
  // My data is requestObject.VEID()
  likeVote(data, id) {
    return this.sendData("like_vote", data, id);
  }

  // My data is requestObject.VEID()
  unlikeVote(data, id) {
    return this.sendData("unlike_vote", data, id);
  }

  //My data is requestObject.Contribution()
  createContribution(data, id) {
    return this.sendData("create_contribution", data, id);
  }

  //My Data is requestObject.ContributionState()
  changeContributionState(data, id) {
    return this.sendData("change_contribution_state", data, id);
  }

  //my dada here is requestObject.EventID()
  getLikes(data, id) {
    return this.sendData("get_likes", data, id);
  }
  //My Data is requestObject.ContributionPeriod()
  changeContributionPeriod(data, id) {
    return this.sendData("change_contribution_period", data, id);
  }

  //My Data is requestObject.Contribute()
  contribute(data, id) {
    return this.sendData("contribute", data, id);
  }

  //My Data is requestObject.CID()
  getContribution(data, id) {
    return this.sendData("get_contribution", data, id);
  }

  //My Data is requestObject.EID()
  getContributions(data, id) {
    return this.sendData("get_contributions", data, id);
  }

  //My Data is requestObject.CEID()
  publishContribution(data, id) {
    return this.sendData("publish_contribution", data, id);
  }

  //My Data is requestObject.CEID()
  likeContribution(data, id) {
    return this.sendData("like_contribution", data, id);
  }

  //My Data is requestObject.CEID()
  unlikeContribution(data, id) {
    return this.sendData("unlike_contribution", data, id);
  }

  //My Data is requestObject.CEID()
  UpdateMustContribute(data, id) {
    return this.sendData("update_must_contribute", data, id);
  }

  //My Data is requestObject.Highlight()
  addHighlight(data, id) {
    return this.sendData("add_highlight", data, id);
  }

  //My Data is requestObject.HID()
  getHighlight(data, id) {
    return this.sendData("get_highlight", data, id);
  }

  //My Data is requestObject.EID()
  getHighlights(data, id) {
    return this.sendData("get_highlights", data, id);
  }

  //My Data is requestObject.HUpdate()
  updateHighlight(data, id) {
    return this.sendData("update_highlight", data, id);
  }

  //My Data is requestObject.HEID()
  deleteHighlight(data, id) {
    return this.sendData("delete_highlight", data, id);
  }
  udateContribution(data, id) {
    return this.sendData("update_contribution", data, id);
  }
  addContributionMean(data, id) {
    return this.sendData("add_contribution_mean", data, id);
  }
  removeContributionMean(data, id) {
    return this.sendData("remove_contribution_mean", data, id);
  }
  updateContributionMeanName(data, id) {
    return this.sendData("update_contribution_mean_name", data, id);
  }
  updateContributionMeanCredential(data, id) {
    return this.sendData("update_contribution_mean_credential", data, id);
  }
  updateVote(data, id) {
    return this.sendData("update_vote", data, id);
  }
  addVoteOption(data, id) {
    return this.sendData("add_vote_option", data, id);
  }
  removeVoteOption(data, id) {
    return this.sendData("remove_vote_option", data, id);
  }
  updateVoteOptionName(data, id) {
    return this.sendData("update_vote_option_name", data, id);
  }
  addRemind(data, id) {
    return this.sendData("add_remind", data, id);
  }
  getReminds(data) {
    return this.sendData("get_reminds", data);
  }
  getRemind(data, id) {
    return this.sendData("get_remind", data, id);
  }
  deleteRemind(data, id) {
    return this.sendData("delete_remind", data, id);
  }
  updateRemind(data, id) {
    return this.sendData("update_remind", data, id);
  }
}

const tcpRequest = new tcpRequestData();
export default tcpRequest;
