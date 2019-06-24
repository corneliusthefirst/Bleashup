import emitter from "./eventEmiter";
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
            if (data.updated) emmitter.emit("updated-news", data.updated);
            if (data.new_events)
              emitter.emit("new-events-news", data.new_events);
            if (data.reschedules)
              emitter.emit("reschedules-news", data.reschedules);
            if (data.info) emitter.emit("info-news", data.info);
            break;
          case "current_event":
            emitter.emit("current_event", data.body);
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
            emitter.emit("denied_invitation", data.body);
            break;
          case "accepted_invitation":
            emitter.emit("accepted_invitation", data.body);
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
              if (data.response) emitter.emit("successful", data.response);
              if (data.message) emitter.emit("successful", data.message);
              break;
            case "unsuccessful":
              emitter.emit("unsuccessful", data.message);
          }
        }
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
