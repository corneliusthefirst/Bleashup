import emitter from "./eventEmiter";
import stores from "../stores";
import tcpRequest from "./tcpRequestData";
import requestObject from "./requestObjects";
import UpdatesDispatcher from "./updatesDispatcher";
import InvitationDispatcher from "./invitationDispatcher";
import RescheduleDispatcher from "./reschedulDispatcher";
import tcpConnect from "./tcpConnect"
import GState from "../stores/globalState";

class ServerEventListener {
  constructor() { }
  socket = () => { }
  listen(socket) {
    this.socket = socket
    socket.on("error", error => {
      console.warn(error.toString(), "error");
      tcpConnect.init().then(socket => {
      })
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
              if (data.updated.length !== 0) UpdatesDispatcher.dispatchUpdates(data.updated);
              if (data.new_events.length !== 0) {
                InvitationDispatcher.dispatchUpdates(
                  data.new_events,
                  "invitation"
                ).then(() => {
                });
              }
              if (data.reschedules)
                RescheduleDispatcher.dispatchReschedules(data.reschedules);
              if (data.info)
                InvitationDispatcher.dispatchInvitationsUpdates(data.info);
            });
            break;
          case "event_changes":
            UpdatesDispatcher.dispatchUpdate(data.updated).then(() => { });
            break;
          case "current_event":
            emitter.emit("successful", "current_event", data.body);
            break;
          case "events":
            emitter.emit("events", data.body);
            break;
          case "invitation":
            InvitationDispatcher.dispatcher(data.body, "invitation").then(
              () => {
              }
            );
            break;
          case "reschedule":
            RescheduleDispatcher.applyReschedule(body).then(() => { });
            break;
          case "denied_invitation":
            InvitationDispatcher.dispatcher(
              data.body,
              "denied_invitation"
            ).then(() => { });
            break;
          case "accepted_invitation":
            InvitationDispatcher.dispatcher(
              data.body,
              "accepted_invitation"
            ).then(() => { });
            break;
          case "seen_invitation":
            InvitationDispatcher.dispatcher(data.body, "seen_invitation").then(
              () => { }
            );
            break;

          case "received_invitation":
            InvitationDispatcher.dispatcher(
              data.body,
              "received_invitation"
            ).then(() => { });
            break;
          case "current_event_field":
            emitter.emit(
              "current_event-field",
              data.field_name,
              data.data,
              data.event_id
            );
            break;
          /*case "event_changes":
            emitter.emit("event_changes", data.updated);
            break;*/
        }
      }
      if (data.status) {
        console.warn(data.status)
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
        console.warn("reconnection attempted", "deu to ", data.error)
        tcpConnect.init().then(() => {
          console.warn("ok! reconnected !");
        })
      }
    });
    socket.on("timeout", data => {
      console.error(data.toString(), "timeout");
    });
    socket.on("closed", data => {
      console.error(error.toString(), "closed");
    });
  }
  get_data(data, id) {
    return new Promise((resolve, reject) => {
      emitter.on("successful", (response, dataResponse) => {
        if (dataResponse.id == id) {
          resolve(dataResponse)
        }
      });
      emitter.on("unsuccessful", (response, dataError) => {
        reject(dataError);
      });
      if (this.socket.write) {
        this.socket.write(data)
      } else {
        reject("not connected");
      }
    });
  }
  sendRequest(data, id) {
    let exit = false;
    do {
      if (!GState.writing) {
        GState.writing = true
        return new Promise((resolve, reject) => {
          emitter.once("successful", (response) => {
            GState.writing = false
            exit = true
            resolve(response);
          });
          emitter.once("unsuccessful", (response) => {
            GState.writing = false
            exit = true
            reject(response);
          });
          if (this.socket.write) {
            this.socket.write(data)
          } else {
            exit = true
            GState.writing = false
            reject("not connected to server")
          }
        })
      }
    } while (!GState.writing || exit)
  }
  GetData(EventId) {
    return new Promise((resolve, reject) => {
      let EventID = requestObject.EventID()
      EventID.event_id = EventId;
      tcpRequest.getCurrentEvent(EventID).then(JSONData => {
        this.get_data(JSONData, EventId).then(Event => {
          resolve(Event)
        });
      });
    })
  }
}

const EventListener = new ServerEventListener();
export default EventListener;
