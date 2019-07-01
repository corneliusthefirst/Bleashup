import emitter from "./eventEmiter";
import stores from "../stores";
import tcpRequest from "./tcpRequestData";
import requestObject from "./requestObjects";
import UpdatesDispatcher from "./updatesDispatcher";
import InvitationDispatcher from "./invitationDispatcher";
import RescheduleDispatcher from "./reschedulDispatcher";

class ServerEventListener {
  constructor() {}
  listen(socket) {
    socket.on("error", error => {
      console.error(error.toString(), "error");
    });
    socket.on("data", datar => {
      data = JSON.parse(datar.toString());
      if (data.response) {
        switch (data.response) {
          case "current_events":
            emitter.emit("current-events", data.body);
            break;
          case "news":
            stores.Session.updateReference(data.reference).then(sessios => {
              let EventID = requestObject.EventID();
              if (data.updated) UpdatesDispatcher.dispatchUpdates(data.updated);
              if (data.new_events) {
                InvitationDispatcher.dispatchUpdates(
                  data.new_events,
                  "invitation"
                ).then(() => {
                  console.warn("ok !");
                });
              }
              if (data.reschedules)
                RescheduleDispatcher.dispatchReschedules(data.reschedules);
              if (data.info)
                InvitationDispatcher.dispatchInvitationsUpdates(data.info);
            });
            break;
          case "event_changes":
            UpdatesDispatcher.dispatchUpdate(data.updated).then(() => {});
            break;
          case "current_event":
            emitter.emit("successful", "current_event", data.body);
            break;
          case "events":
            emitter.emit("events", data.body);
            break;
          case "invitation":
            InvitationDispatcher.dispatcher(data.body, "invitation").then(
              () => {}
            );
            break;
          case "reschedule":
            RescheduleDispatcher.applyReschedule(body).then(() => {});
            break;
          case "denied_invitation":
            InvitationDispatcher.dispatcher(
              data.body,
              "denied_invitation"
            ).then(() => {});
            break;
          case "accepted_invitation":
            InvitationDispatcher.dispatcher(
              data.body,
              "accepted_invitation"
            ).then(() => {});
            break;
          case "sent_invitation":
            InvitationDispatcher.dispatcher(data.body, "sent_invitation").then(
              () => {}
            );
            break;

          case "received_invitation":
            InvitationDispatcher.dispatcher(
              data.body,
              "received_invitation"
            ).then(() => {});
            break;
          case "current_event_field":
            emitter.emit(
              "current_event-field",
              data.field_name,
              data.data,
              data.event_id
            );
            break;
          case "event_changes":
            emitter.emit("event_changes", data.updated);
            break;
        }
      }
      if (data.status) {
        switch (data.status) {
          case "successful":
            if (data.data) emitter.emit("successful", "data", data.data);
            if (data.message) emitter.emit("successful", data.message);
            break;
          case "unsuccessful":
            if (data.data) emitter.emit("unsuccessful", "data", data.data);
            if (data.message) emitter.emit("unsuccessful", data.message);
            break;
        }
      }
      if (data.error) {
        console.error(data.message);
      }
    });
    socket.on("timeout", data => {
      console.error(data.toString(), "timeout");
    });
    socket.on("closed", data => {
      console.error(error.toString(), "closed");
    });
  }
  sampleGetData() {
    EventID.event_id = "AnGfyncazIZnFoZCL7FPYfZOiGxUkjiLXhz3";
    tcpRequest.getCurrentEvent(EventID).then(JSONData => {
      UpdatesDispatcher.get_data(JSONData).then(Event => {
        console.warn(Event, "1");
        EventID.event_id = "VoLIk0izYUYWFd5IvafwwHxXfMGU36hd3iOX";
        tcpRequest.getContributions(EventID).then(JSONData => {
          UpdatesDispatcher.get_data(JSONData).then(Event => {
            console.warn(Event, "2");
            EventID.event_id = "wb1IjaiJ4cEmu8mCnEsOJhnliqpTVLfXyFvY";
            tcpRequest.getCurrentEvent(EventID).then(JSONData => {
              UpdatesDispatcher.get_data(JSONData).then(Event => {
                console.warn(Event, "3");
              });
            });
          });
        });
      });
    });
  }
}

const EventListener = new ServerEventListener();
export default EventListener;
