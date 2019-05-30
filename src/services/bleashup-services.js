import {
    Request
} from "./request-object"
import transfer from './transfer-data'
request = new Request()
export function sendPresence(phone) {
    return sendData(phone, "presence", request.None())
}

export function UpdateCurrentEvent(client, phone, eventID, action, data) {
    let UpdateData = () => {
        if (action === "title") {
            let Update = request.Update()
            Update.action = "about"
            Update.phone = phone
            Update.event_id = eventID
            Update.about_update.action = action
            Update.about_update.title = data
            return Update
        } else if (action == "description") {
            let Update = request.Update()
            Update.action = "about"
            Update.phone = phone
            Update.event_id = eventID
            Update.about_update.action = action
            Update.about_update.description = data
            return Update
        } else if (action == "string") {
            let Update = request.Update()
            Update.action = "location"
            Update.phone = phone
            Update.event_id = eventID
            Update.location_update.action = action
            Update.location_update.string = data
            return Update
        } else if (action == "url") {
            let Update = request.Update()
            Update.action = "location"
            Update.phone = phone
            Update.event_id = eventID
            Update.location_update.action = action
            Update.location_update.url = data
            return Update
        } else if (action == "time") {
            let Update = request.Update()
            Update.action = "period"
            Update.phone = phone
            Update.event_id = eventID
            Update.period_update.action = action
            Update.period_update.time = data
            return Update
        } else if (action == "date") {
            let Update = request.Update()
            Update.action = "period"
            Update.phone = phone
            Update.event_id = eventID
            Update.period_update.action = action
            Update.period_update.date = data
            return Update
        } else if (action == "add") {
            let Update = request.Update()
            Update.action = "participant"
            Update.phone = phone
            Update.event_id = eventID
            Update.participant_update.action = action
            Update.participant_update.phone = data.phone
            Update.participant_update.master = data.master
            Update.participant_update.status = data.status
            Update.participant_update.host = data.host
            return Update
        } else if (action == "remove") {
            let Update = request.Update()
            Update.action = "participant"
            Update.phone = phone
            Update.event_id = eventID
            Update.participant_update.action = action
            Update.participant_update.phone = data.phone
            return Update
        } else if (action == "master") {
            let Update = request.Update()
            Update.action = "participant"
            Update.phone = phone
            Update.event_id = eventID
            Update.participant_update.action = action
            Update.participant_update.phone = data.phone
            Update.participant_update.master = data.master
            return Update
        } else if (action == "host") {
            let Update = request.Update()
            Update.action = "participant"
            Update.phone = phone
            Update.event_id = eventID
            Update.participant_update.action = action
            Update.participant_update.phone = data.phone
            Update.participant_update.host = data.host
            return Update
        } else if (action == "background") {
            let Update = request.Update()
            Update.action = "background"
            Update.phone = phone
            Update.event_id = eventID
            Update.background = data
            return Update
        }
    }
    UpdateString = JSON.stringify(UpdateData())
    transfer.Transferable(phone, "update", UpdateString).then((XMLData) => {
        client.write(XMLData)
    })
}

export function createEvent(phone, event, client) {
    return sendData(phone, "create_event", event, client)
}

export function sendData(phone, action, data) {
    return new Promise((resolve, reject) => {
        dataJSON = JSON.stringify(data)
        transfer(phone, action, dataJSON).
        then((XMLData) => {
            resolve(XMLData)
        })
    })
}

//My data is request.Invitation()
export function acceptInvtation(phone, invitation, client) {
    return sendData(phone, "accept_invitation", invitation, client)
}

//My data is request.Invitation()
export function denieInvitation(phone, invitation, client) {
    return sendData(phone, "denie_invitation", invitation, client)
}
//My data is request.Invite()
export function invite(phone, invite, client) {
    return sendData(phone, "invite", data, client)
}

//My data is {"phone":phoneToLeave}
export function leaveEvent(phone, data, client) {
    return sendData(phone, "leave_event", data, client)
}

//My data is request.EventID()
export function postponeEvent(phone, data, client) {
    return sendData(phone, "postpone_event", data, client)
}
//My data is request.EventID()
export function pastEvent(phone, data, client) {
    return sendData(phone, "past_event", data, client)
}

//My data is request.EventID()
export function likeEvent(phone, data, client) {
    return sendData(phone, "like_event", data, client)
}

//My data is request.EventID()
export function unlikeEvent(phone, data, client) {
    return sendData(phone, "unlike_event", data, client)
}

//My data is request.None()
export function getContacts(phone, data, client) {
    return sendData(phone, "get_contacts", data, client)
}

//My data is request.Contact()
export function addContact(phone, data, client) {
    return sendData(phone, "add_contact", data, client)
}
//My data is request.Contact()
export function removeContact(phone, data, client) {
    return sendData(phone, "remove_contact", data, client)
}

//My data is request.EventID()
export function publishEvent(phone, data, client) {
    return sendData(phone, "publish", data, client)
}

//My data is request.EventID()
export function unpublishEvent(phone, data, client) {
    return sendData(phone, "unpublish", data, client)
}

//My data is request.EventID()
export function addToPublic(phone, data, client) {
    return sendData(phone, "add_to_public", data, client)
}

//My data is request.EventID()
export function removeFromPublic(phone, data, client) {
    return sendData(phone, "remove_from_public", data, client)
}

//My data is request.EventID()
export function joinEvent(phone, data, client) {
    return sendData(phone, "join_event", data, client)
}

//My data is request.None()
export function getEvents(phone, data, client) {
    return sendData(phone, "get_events", data, client)
}


//My data is request.EventID()
export function getCurrentEvent(phone, data, client) {
    return sendData(phone, "get_current_event", data, client)
}

//My data is request.None()
export function collectCurrentEvents(phone, data, client) {
    return sendData(phone, "collect_current_events", data, client)
}

//My data is request.Field()
export function getFromCurrentEvent(phone, data, client) {
    return sendData(phone, "get_from_current_event", data, client)
}

//My data is request.Vote()
export function CreateVote(phone, data, client) {
    return sendData(phone, "create_vote", data, client)
}

//My data is request.Voter()
export function Vote(phone, data, client) {
    return sendData(phone, "vote", data, client)
}

//My data is request.VEID()
export function deleteVote(phone, data, client) {
    return sendData(phone, "delete_vote", data, client)
}

//My data is request.VEID()
export function publishVote(phone, data, client) {
    return sendData(phone, "publish_vote", data, client)
}

//My data is request.VotePeriod()
export function changeVotePeriod(phone, data, client) {
    return sendData(phone, "change_vote_period", data, client)
}

//My data is request.VID()
export function getVote(phone, data, client) {
    return sendData(phone, "get_vote", data, client)
}

//My data is request.EID()
export function getVotes(phone, data, client) {
    return sendData(phone, "get_votes", data, client)
}
// My data is request.VEID()
export function likeVote(phone, data, client) {
    return sendData(phone, "like_vote", data, client)
}

// My data is request.VEID()
export function unlikeVote(phone, data, client) {
    return sendData(phone, "unlike_vote", data, client)
}

//My data is request.Contribution()
export function createContribution(phone, data, client) {
    return sendData(phone, "create_contribution", data, client)
}

//My Data is request.ContributionState()
export function changeContributionState(phone, data, client) {
    return sendData(phone, "change_contribution_state", data, client)
}

//My Data is request.ContributionPeriod()
export function changeContributionPeriod(phone, data, client) {
    return sendData(phone, "change_contribution_period", data, client)
}

//My Data is request.Contribute()
export function contribute(phone, data, client) {
    return sendData(phone, "contribute", data, client)
}

//My Data is request.CID()
export function getContribution(phone, data, client) {
    return sendData(phone, "get_contribution", data, client)
}

//My Data is request.EID()
export function getContributions(phone, data, client) {
    return sendData(phone, "get_contributions", data, client)
}

//My Data is request.CEID()
export function publishContribution(phone, data, client) {
    return sendData(phone, "publish_contribution", data, client)
}

//My Data is request.CEID()
export function likeContribution(phone, data, client) {
    return sendData(phone, "like_contribution", data, client)
}

//My Data is request.CEID()
export function unlikeContribution(phone, data, client) {
    return sendData(phone, "unlike_contribution", data, client)
}

//My Data is request.CEID()
export function UpdateMustContribute(phone, data, client) {
    return sendData(phone, "update_must_contribute", data, client)
}

//My Data is request.Highlight()
export function addHighlight(phone, data, client) {
    return sendData(phone, "add_highlight", data, client)
}

//My Data is request.HID()
export function getHighlight(phone, data, client) {
    return sendData(phone, "get_highlight", data, client)
}

//My Data is request.EID()
export function getHighlights(phone, data, client) {
    return sendData(phone, "get_highlights", data, client)
}

//My Data is request.HUpdate()
export function updateHighlight(phone, data, client) {
    return sendData(phone, "update_highlight", data, client)
}

//My Data is request.HEID()
export function deleteHighlight(phone, data, client) {
    return sendData(phone, "delete_highlight", data, client)
}
