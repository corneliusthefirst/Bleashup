import emitter from "./eventEmiter";
import stores from "../stores";
import tcpRequest from "./tcpRequestData";
import requestObject from "./requestObjects";
import UpdatesDispatcher from "./updatesDispatcher";
import InvitationDispatcher from "./invitationDispatcher";
import RescheduleDispatcher from "./reschedulDispatcher";
import GState from "../stores/globalState";
import { forEach } from "lodash"
import moment from 'moment';
import connect from "./tcpConnect";

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
            emitter.once("cleared", data => {
              console.warn("cleared all")
            })
           this.socket && this.socket.write && this.socket.write(JSONData)
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
             this.socket && this.socket.write && this.socket.write(JSONData)
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
      tcpRequest.Presence().then((JSONData) => {
        this.socket && this.socket.write && this.socket.write(JSONData)
      })
      emitter.emit("unsuccessful", data.message)
    }

  }
  stopConnection() {
    this.socket && this.socket.destroy && this.socket.destroy()
    this.socket = null
  }
  accumulator = ""
  listen(socket) {
    //socket.setTimeout(10000);
    this.socket = socket
    GState.socket = socket
    socket.on("error", error => {
      console.warn(error.toString(), "error");
      this.reconnect()      
    });
    socket.on("data", datar => {
      let data = datar.toString()
      console.warn(data)
      if (data.includes("_end__start_")) {
        let dataX = data.split("_end__start_")
        if (dataX[0].includes("_start_")) {
          this.dispatch(JSON.parse(dataX[0].replace("_start_", "")))
        } else {
          console.warn("this is part of the request, ", data);
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
      console.warn("connection timed out", data)
    });
    socket.on("closed", data => {
      console.warn("connection closed by pear")
      console.error(data.toString(), "closed");
    });
    socket.on("end", () => {
      console.error("onEnd says nothing");
    });
  }
  requestUnprocessed = {}
  requestWaitTimeout = 7000
  noConnectionResponse = "not connected"
  requestTimedOutResponse = "requestTimeout"
  get_data(data, id) {
    return new Promise((resolve, reject) => {
      emitter.on("successful", (response, dataResponse) => {
        this.requestUnprocessed[id] = null
        if (dataResponse) {
          if (dataResponse.id == id) {
            resolve(dataResponse.data)
          }
        }
      });
      emitter.on("unsuccessful", (response, dataError) => {
        this.requestUnprocessed[id] = null
        reject(dataError);
      });
      if (this.socket && this.socket.write) {
        this.requestUnprocessed[id] = true
        this.socket.write(data)
      }
     this.cancelAfterTimeout(id,reject)
    });
  }
  connectionCheck(){

  }
  reconnect(){
    console.warn("entering reconnection function")
    if(!this.reconnecting){
      this.reconnecting = true
      connect.connect().then(() => {
        console.warn(this.reconnectionMessage)
        this.reconnecting = false
      })
      setTimeout(() => {
        console.warn(this.sayReconnectionTimeout)
        if(this.reconnecting){
          this.reconnecting = false 
        }
      },this.reconnectionTimeout)
    }
  }
  sayReconnectionTimeout = "reconnection timeout reached"
  reconnectionTimeout = 5000
  reconnectionMessage = "recconnection was successful"
  reconnecting = false
  sayConnectionTimedout="connection timed out"
  cancelAfterTimeout(id,reject){
    console.warn("entering reconnection timmier")
    setTimeout(() => {
      if (this.requestUnprocessed[id]) {
        console.warn(this.sayConnectionTimedout)
        this.requestUnprocessed[id] = null
        reject(this.requestTimedOutResponse)
        this.reconnect()
      }
    }, this.requestWaitTimeout)
  }
  unsentRequest = {}
  sendRequest(data, id) {
    return new Promise((resolve, reject) => {
      this.requestUnprocessed[id] = true
      emitter.once("successful_" + id, (response) => {
        this.requestUnprocessed[id] = null
        console.warn("result response", response)
        resolve(response);
      });
      emitter.once("unsuccessful_" + id, (response) => {
        this.requestUnprocessed[id] = null
        console.warn("unsuccessful, " + response)
        reject(response);
      });
      if (this.socket && this.socket.write) {
        console.warn("writing socket", data)
        this.socket.write(data)
      }
      this.cancelAfterTimeout(id,reject)
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
