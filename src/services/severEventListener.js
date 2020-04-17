import emitter from "./eventEmiter";
import stores from "../stores";
import tcpRequest from "./tcpRequestData";
import requestObject from "./requestObjects";
import UpdatesDispatcher from "./updatesDispatcher";
import InvitationDispatcher from "./invitationDispatcher";
import RescheduleDispatcher from "./reschedulDispatcher";
import tcpConnect from "./tcpConnect"
import GState from "../stores/globalState";
import { forEach } from "lodash"
import  moment  from 'moment';

class ServerEventListener {
  constructor() { }
  socket = () => { }
  dispatch(data) {
    //console.error(data)
    if (data.response) {
      // console.warn('eligible_response 1')
      switch (data.response) {
        case "not_eligible":
          // console.warn('eligible_response')
          emitter.emit("unsuccessful_" + data.message.id, data.message.data);
          break;
        case "cleared":
          console.warn("clearing.....")
          emitter.emit("cleared", data.data);
          break;
        case "all_updates":
          let sorter = (a, b) => (moment(a.date).format("x") < moment(b.date).format("x") ? 1 : moment(a.date).format("x") > moment(b.date).format("x") ? -1 : 0)
          if (data.updated.length !== 0) UpdatesDispatcher.dispatchUpdates(data.updated.sort(sorter));
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
          tcpRequest.clear().then(JSONData => {
            emitter.once("cleared",data =>{
              console.warn("cleared all")
            })
            this.socket.write(JSONData)
          })
          break;
        case "current_events":
          emitter.emit("current-events", data.body);
          break;
        case "presence":
          console.warn(data.reference)
          GState.initialized = true
          stores.Session.updateReference(data.reference).then(sessios => {
            tcpRequest.get_all_update().then(JSONData => {
              this.socket.write(JSONData)
            })
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
        case "contacts":
          emitter.emit("successful_" + data.body.id, data.body.data);
          break;
        case "add_as_contact":
        /*case "event_changes":
          emitter.emit("event_changes", data.updated);
          break;*/
      }
    }
    if (data.status) {
      switch (data.status) {
        case "successful":
          if (data.data) emitter.emit("successful_" + data.id, "data", data.data);
          if (data.message) emitter.emit("successful_" + data.message.id, data.message);
          break;
        case "unsuccessful":
          if (data.data) emitter.emit("unsuccessful_" + data.id, "data", data.data);
          if (data.message) emitter.emit("unsuccessful_" + data.message.id, data.message);
          break;
      }
    }
    if (data.error) {
      console.warn("reconnection attempted", "deu to ", data)
      emitter.emit("unsuccessful", data.message)
    }

  }
  accumulator = ""
  listen(socket) {
    //socket.setTimeout(10000);
    this.socket = socket
    GState.socket = socket
    socket.on("error", error => {
      console.warn(error.toString(), "error");
      this.socket.write = undefined
      tcpConnect.init().then(socket => {
        this.socket = socket
      })
    });
    socket.on("data", datar => {
     let data = datar.toString()
      console.warn(data)
      if (data.includes("_end__start_")) {
        let dataX = data.split("_end__start_")
        if (dataX[0].includes("_start_")) {
          this.dispatch(JSON.parse(dataX[0].replace("_start_", "")))
        } else {
          this.accumulator += dataX[0]
          this.dispatch(JSON.parse(this.accumulator))
          this.accumulator = ''
        }
        for (i = 1; i < dataX.length; i++) {
          if (i == dataX.length - 1) {
            if (dataX[i].includes("_end_")) {
              this.dispatch(JSON.parse(dataX[i].replace("_end_", "")))
              this.accumulator = ''
            } else {
              this.accumulator += dataX[i]
            }
          } else {
            this.dispatch(JSON.parse(dataX[i]))
          }
        }
      } else {
        if (data.includes("_start_")) {
          let dataSub = data.replace("_start_", "")
          if (dataSub.includes("_end_")) {
            this.dispatch(JSON.parse(dataSub.replace("_end_", "")))
          } else {
            this.accumulator += dataSub
          }
        } else if (data.includes("_end_")) {
          let dataSub = data.replace("_end_", "")
          this.accumulator += dataSub
          this.dispatch(JSON.parse(this.accumulator))
          this.accumulator = ""
        } else {
          this.accumulator += data
        }

      }
    });
    socket.on("timeout", data => {
      this.socket = () => { }
      tcpConnect.connect().then(socket => {
        this.socket = socket
      })
    });
    socket.on("closed", data => {
      console.error(error.toString(), "closed");
      this.socket = () => { }
      tcpConnect.connect().then(socket => {
        this.socket = socket
      })
    });
    socket.on("end", () => {
      console.error("onEnd says nothing");
    });
  }
  get_data(data, id) {
    return new Promise((resolve, reject) => {
      emitter.on("successful", (response, dataResponse) => {
        if (dataResponse) {
          if (dataResponse.id == id) {
            resolve(dataResponse.data)
          }
        }
      });
      emitter.on("unsuccessful", (response, dataError) => {
        reject(dataError);
      });
      if (this.socket.write) {
        this.socket.write(data)
      } else {
        this.socket = () => { }
        reject("not connected");
      }
    });
  }
  sendRequest(data, id) {
    return new Promise((resolve, reject) => {
      //setTimeout(()=>{
      //  reject("request timedout!")
      // },6000)
      emitter.once("successful_" + id, (response) => {
        resolve(response);
      });
      emitter.once("unsuccessful_" + id, (response) => {
        console.warn("unsuccessful, " + response)
        reject(response);
      });
      console.warn("writing socket",data)
      if (this.socket.write) {
        this.socket.write(data)
      } else {
        this.socket.write = tcpConnect.socket.write
        reject("not connected to server")
      }
    })
  }
  GetData(EventId) {
    return new Promise((resolve, reject) => {
      let EventID = requestObject.EventID()
      EventID.event_id = EventId;
      tcpRequest.getCurrentEvent(EventID, EventId).then(JSONData => {
        this.get_data(JSONData, EventId).then(Event => {
          resolve(Event)
        });
      });
    })
  }
}

const EventListener = new ServerEventListener();
export default EventListener;
