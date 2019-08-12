import requestObject from "./requestObjects";
import transfer from "./transferable";
import stores from "../stores";
import GState from "../stores/globalState";

class tcpRequestData {
  Presence() {
    return this.sendData("presence", requestObject.None());
  }

  UpdateCurrentEvent(phone, eventID, action, data) {
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
    return this.sendData(action, data);
  }

  createEvent(event) {
    return this.sendData("create_event", event);
  }

  sendData(action, data) {
    return new Promise((resolve, reject) => {
      stores.Session.getSession().then(session => {
        session.reference = GState.writing ? GState.writing : session.reference
        transfer.formTransferableData(session, action, data).then(JSONData => {
          resolve(JSONData);
        });
      });
    });
  }

  //My data is requestObject.Invitation()
  acceptInvtation(invitation) {
    return this.sendData("accept_invitation", invitation);
  }

  //My data is requestObject.Invitation()
  denieInvitation(invitation) {
    return this.sendData("denie_invitation", invitation);
  }
  //My data is requestObject.Invite()
  invite(invite) {
    return this.sendData("invite", data);
  }

  //My data is {"phone":phoneToLeave}
  leaveEvent(data) {
    return this.sendData("leave_event", data);
  }

  //My data is requestObject.EventID()
  postponeEvent(data) {
    return this.sendData("postpone_event", data);
  }
  //My data is requestObject.EventID()
  pastEvent(data) {
    return this.sendData("past_event", data);
  }

  //My data is requestObject.EventID()
  likeEvent(data) {
    return this.sendData("like_event", data);
  }

  //My data is requestObject.EventID()
  unlikeEvent(data) {
    return this.sendData("unlike_event", data);
  }

  //My data is requestObject.None()
  getContacts(phone, data) {
    return this.sendData("get_contacts", data);
  }

  //My data is requestObject.Contact()
  addContact(data) {
    return this.sendData("add_contact", data);
  }
  //My data is requestObject.Contact()
  removeContact(data) {
    return this.sendData("remove_contact", data);
  }

  //My data is requestObject.EventID()
  publishEvent(data) {
    return this.sendData("publish", data);
  }

  //My data is requestObject.EventID()
  unpublishEvent(data) {
    return this.sendData("unpublish", data);
  }

  //My data is requestObject.EventID()
  addToPublic(data) {
    return this.sendData("add_to_public", data);
  }

  //My data is requestObject.EventID()
  removeFromPublic(data) {
    return this.sendData("remove_from_public", data);
  }

  //My data is requestObject.EventID()
  joinEvent(data) {
    return this.sendData("join_event", data);
  }

  //My data is requestObject.None()
  getEvents(data) {
    return this.sendData("get_events", data);
  }

  //My data is requestObject.EventID()
  getCurrentEvent(data) {
    return this.sendData("get_current_event", data);
  }

  //My data is requestObject.None()
  collectCurrentEvents(data) {
    return this.sendData("collect_current_events", data);
  }

  //My data is requestObject.Field()
  getFromCurrentEvent(data) {
    return this.sendData("get_from_current_event", data);
  }

  //My data is requestObject.Vote()
  CreateVote(data) {
    return this.sendData("create_vote", data);
  }

  //My data is requestObject.Voter()
  Vote(data) {
    return this.sendData("vote", data);
  }

  //My data is requestObject.VEID()
  deleteVote(data) {
    return this.sendData("delete_vote", data);
  }

  //My data is requestObject.VEID()
  publishVote(data) {
    return this.sendData("publish_vote", data);
  }

  //My data is requestObject.VotePeriod()
  changeVotePeriod(data) {
    return this.sendData("change_vote_period", data);
  }

  //My data is requestObject.VID()
  getVote(data) {
    return this.sendData("get_vote", data);
  }

  //My data is requestObject.EID()
  getVotes(data) {
    return this.sendData("get_votes", data);
  }
  // My data is requestObject.VEID()
  likeVote(data) {
    return this.sendData("like_vote", data);
  }

  // My data is requestObject.VEID()
  unlikeVote(data) {
    return this.sendData("unlike_vote", data);
  }

  //My data is requestObject.Contribution()
  createContribution(data) {
    return this.sendData("create_contribution", data);
  }

  //My Data is requestObject.ContributionState()
  changeContributionState(data) {
    return this.sendData("change_contribution_state", data);
  }

  //My Data is requestObject.ContributionPeriod()
  changeContributionPeriod(data) {
    return this.sendData("change_contribution_period", data);
  }

  //My Data is requestObject.Contribute()
  contribute(data) {
    return this.sendData("contribute", data);
  }

  //My Data is requestObject.CID()
  getContribution(data) {
    return this.sendData("get_contribution", data);
  }

  //My Data is requestObject.EID()
  getContributions(data) {
    return this.sendData("get_contributions", data);
  }

  //My Data is requestObject.CEID()
  publishContribution(data) {
    return this.sendData("publish_contribution", data);
  }

  //My Data is requestObject.CEID()
  likeContribution(data) {
    return this.sendData("like_contribution", data);
  }

  //My Data is requestObject.CEID()
  unlikeContribution(data) {
    return this.sendData("unlike_contribution", data);
  }

  //My Data is requestObject.CEID()
  UpdateMustContribute(data) {
    return this.sendData("update_must_contribute", data);
  }

  //My Data is requestObject.Highlight()
  addHighlight(data) {
    return this.sendData("add_highlight", data);
  }

  //My Data is requestObject.HID()
  getHighlight(data) {
    return this.sendData("get_highlight", data);
  }

  //My Data is requestObject.EID()
  getHighlights(data) {
    return this.sendData("get_highlights", data);
  }

  //My Data is requestObject.HUpdate()
  updateHighlight(data) {
    return this.sendData("update_highlight", data);
  }

  //My Data is requestObject.HEID()
  deleteHighlight(data) {
    return this.sendData("delete_highlight", data);
  }
  udateContribution(data) {
    return this.sendData("update_contribution", data);
  }
  addContributionMean(data) {
    return this.sendData("add_contribution_mean", data);
  }
  removeContributionMean(data) {
    return this.sendData("remove_contribution_mean", data);
  }
  updateContributionMeanName(data) {
    return this.sendData("update_contribution_mean_name", data);
  }
  updateContributionMeanCredential(data) {
    return this.sendData("update_contribution_mean_credential", data);
  }
  updateVote(data) {
    return this.sendData("update_vote", data);
  }
  addVoteOption(data) {
    return this.sendData("add_vote_option", data);
  }
  removeVoteOption(data) {
    return this.sendData("remove_vote_option", data);
  }
  updateVoteOptionName(data) {
    return this.sendData("update_vote_option_name", data);
  }
  addRemind(data) {
    return this.sendData("add_remind", data);
  }
  getReminds(data) {
    return this.sendData("get_reminds", data);
  }
  getRemind(data) {
    return this.sendData("get_remind", data);
  }
  deleteRemind(data) {
    return this.sendData("delete_remind", data);
  }
  updateRemind(data) {
    return this.sendData("update_remind", data);
  }
}

const tcpRequest = new tcpRequestData();
export default tcpRequest;
