import emitter from "./eventEmiter";
import stores from "../stores";
import tcpRequest from "./tcpRequestData";
import requestObject from "./requestObjects";
import UpdatesDispatcher from "./updatesDispatcher";

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
              stores.Session.getSession().then(session => {
                let EventID = requestObject.EventID();
                EventID.event_id = "AnGfyncazIZnFoZCL7FPYfZOiGxUkjiLXhz3";
                tcpRequest.getCurrentEvent(EventID).then(JSONData => {
                  UpdatesDispatcher.get_data(JSONData).then(Event => {
                    console.warn(Event);
                  });
                });
              });
              if (data.updated) emitter.emit("updated_news", data.updated);
              if (data.new_events)
                emitter.emit("new_events_news", data.new_events);
              if (data.reschedules)
                emitter.emit("reschedules_news", data.reschedules);
              if (data.info) emitter.emit("info_news", data.info);
            });
            break;
          case "current_event":
            emitter.emit("successful", "current_event", data.body);
            break;
          case "events":
            emitter.emit("events", data.body);
            break;
          case "invitation":
            emitter.emit("invitation", data.body);
            break;
          case "reschedule":
            emitter.emit("reschedule", data.body);
            break;
          case "denied_invitation":
            emitter.emit("denied_invitation", data.body, data.invitee);
            break;
          case "accepted_invitation":
            emitter.emit("accepted_invitation", data.body, data.invitee);
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
}

const EventListener = new ServerEventListener();
export default EventListener;
