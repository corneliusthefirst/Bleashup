import emitter from "./eventEmiter";
import stores from "../stores";
import tcpRequest from "./tcpRequestData";
import requestObject from "./requestObjects";
import UpdatesDispatcher from "./updatesDispatcher";
import InvitationDispatcher from "./invitationDispatcher";
import RescheduleDispatcher from "./reschedulDispatcher";
import GState from "../stores/globalState";
import { forEach } from "lodash";
import moment from "moment";
import connect from "./tcpConnect";
import BeBackground from './backgroundSync';

class ServerEventListener {
  events = {
    unsuccessful_: "unsuccessful_",
    unsuccessful: "unsuccessful",
    current_events: "current-events",
    cleared_: "cleared_",
    successful: "successful",
    events: "events",
    successful_: "successful_",
    current_event: "current_event",
    cleared: "cleared",
  };
  socketEvents = {
    data: "data",
    timeout: "timeout",
    closed: "closed",
    end: "end",
  };
  splitter = {
    end: "_end_",
    start: "_start_",
    end_start: "_end__start_",
  };
  responseCases = {
    not_eligible: "not_eligible",
    cleared: "cleared",
    wrong_json: "wrong_json",
    all_updates: "all_updates",
    current_events: "current_events",
    presence: "presence",
    event_changes: "event_changes",
    current_event: "current_event",
    events: "events",
    invitation: "invitation",
    reschedule: "reschedule",
    denied_invitation: "denied_invitation",
    accepted_invitation: "accepted_invitation",
    seen_invitation: "seen_invitation",
    received_invitation: "received_invitation",
    current_event_field: "current_event_field",
    contacts: "contacts",
    add_as_contacts: "add_as_contact",
  };
  constructor() { }
  socket = () => { };
  clearUpdates() {
    console.warn("trying to clean all", this.infoDispatched, this.invitationsDispatched, this.updatesDispatched)
    if (this.invitationsDispatched &&
      this.updatesDispatched &&
      this.infoDispatched) {
      tcpRequest.clear().then((JSONData) => {
        emitter.once(this.events.cleared, (data) => {
          console.warn(this.sayClearAll);
          this.updatesDispatched = false
          this.invitationsDispatched = false
          this.infoDispatched = false
        });
        this.writeToSocket(JSONData);
      });
    }
  }
  returnReqeustFromString(data) {
    let request = JSON.parse(data.
      replace(this.splitter.start, "").
      replace(this.splitter.end, ""))
    return request
  }
  returnRequestData(data) {
    const request = this.returnReqeustFromString(data)
    return request.data
  }
  infoDispatched = false
  updatesDispatched = false
  invitationsDispatched = false
  dispatch(data) {
    //console.warn("data from dispatcher: ",data)
    if (data.response) {
      switch (data.response) {
        case this.responseCases.wrong_json:
          console.warn("wrong json data was sent to the server: ", data.data)
          break;
        case this.responseCases.not_eligible:
          emitter.emit(
            this.events.unsuccessful_ + data.message.id,
            data.message.data
          );
          break;
        case this.responseCases.cleared:
          console.warn("clearing.....");
          if (stores.States.requestsExists()) {
            console.warn("persisted request existing")
            Object.keys(stores.States.states.requests).forEach(ele => {
              this.writeToSocketFresh(stores.States.getRequest(ele), ele)
            })
          }
          emitter.emit(this.events.cleared, data.data);
          this.informWaiters();

          break;
        case this.responseCases.all_updates:
          let sorter = (a, b) =>
            moment(a.date).format("x") < moment(b.date).format("x")
              ? 1
              : moment(a.date).format("x") > moment(b.date).format("x")
                ? -1
                : 0;
          const sortedUpdates = data.updated.sort(sorter)
          UpdatesDispatcher.dispatchUpdates(sortedUpdates, () => {
            console.warn("done Dispaching !")
            this.updatesDispatched = true
            this.clearUpdates()
          });
          InvitationDispatcher.dispatchUpdates(
            data.new_events,
            "invitation"
            , () => {
              console.warn("invitations completely dispachd")
              this.invitationsDispatched = true
              this.clearUpdates()
            });
          if (data.reschedules)
            RescheduleDispatcher.dispatchReschedules(data.reschedules);
          if (data.info)
            InvitationDispatcher.dispatchInvitationsUpdates(data.info, () => {
              this.infoDispatched = true
              this.clearUpdates()
            });
          break;
        case this.responseCases.current_events:
          emitter.emit(this.events.current_events, data.body);
          break;
        case this.responseCases.presence:
          console.warn(data.reference);
          GState.initialized = true;
          stores.Session.updateReference(data.reference).then((sessios) => {
            tcpRequest.get_all_update().then((JSONData) => {
              this.writeToSocket(JSONData, true);
            });
          });
          break;
        case this.responseCases.event_changes:
          UpdatesDispatcher.dispatchUpdate(data.updated, () => {
            console.warn(this.sayDispatchingDone)
          })
          break;
        case this.responseCases.current_event:
          emitter.emit(
            this.events.successful_ + data.body.id,
            this.events.current_event,
            data.body
          );
          break;
        case this.responseCases.events:
          emitter.emit(this.events.events, data.body);
          break;
        case this.responseCases.invitation:
          InvitationDispatcher.dispatcher(
            data.body,
            this.responseCases.invitation
          ).then(() => { });
          break;
        case this.responseCases.reschedule:
          RescheduleDispatcher.applyReschedule(body).then(() => { });
          break;
        case this.responseCases.denied_invitation:
          InvitationDispatcher.dispatcher(
            data.body,
            this.responseCases.denied_invitation
          ).then(() => { });
          break;
        case this.responseCases.accepted_invitation:
          InvitationDispatcher.dispatcher(
            data.body,
            this.responseCases.accepted_invitation
          ).then(() => { });
          break;
        case this.responseCases.seen_invitation:
          InvitationDispatcher.dispatcher(
            data.body,
            this.responseCases.seen_invitation
          ).then(() => { });
          break;

        case this.responseCases.received_invitation:
          InvitationDispatcher.dispatcher(
            data.body,
            this.responseCases.received_invitation
          ).then(() => { });
          break;
        case this.responseCases.current_event_field:
          emitter.emit(
            this.responseCases.current_event_field,
            data.field_name,
            data.data,
            data.event_id
          );
          break;
        case this.responseCases.contacts:
          emitter.emit(this.events.successful_ + data.body.id, data.body.data);
          break;
        case this.responseCases.add_as_contacts:
        /*case "event_changes":
          emitter.emit("event_changes", data.updated);
          break;*/
      }
    }
    if (data.status) {
      switch (data.status) {
        case this.events.successful:
          if (data.data)
            emitter.emit(this.events.successful_ + data.id, "data", data.data);
          if (data.message)
            emitter.emit(
              this.events.successful_ + data.message.id,
              data.message
            );
          break;
        case this.events.unsuccessful:
          if (data.data)
            emitter.emit(
              this.events.unsuccessful_ + data.id,
              "data",
              data.data
            );
          if (data.message)
            emitter.emit(
              this.events.unsuccessful_ + data.message.id,
              data.message
            );
          break;
      }
    }
    if (data.error) {
      //emitter.emit(this.events.unsuccessful_+data.id,data.error)
      //console.warn(this.sayReconnectionAttempt, " deu to ", data);
      //this.initPresence();
      //emitter.emit("unsuccessful", data.message);
    }
  }
  informWaiters() {
    this.requestUnprocessed &&
      Object.keys(this.requestUnprocessed).length > 0 &&
      Object.keys(this.requestUnprocessed).forEach((ele) => {
        emitter.emit(this.events.cleared_ + ele);
      });
    this.initializing = false;

  }
  initPresence() {
    tcpRequest.Presence().then((JSONData) => {
      this.writeToSocket(JSONData, true);
    });
  }
  stopConnection() {
    this.socket && this.socket.destroy && this.socket.destroy();
    this.socket = null;
  }
  initializing = false;
  accumulator = "";
  listen(socket) {
    //socket.setTimeout(10000);
    this.socket = socket;
    GState.socket = socket;
    socket.on("error", (error) => {
      console.warn(error.toString(), "error");
      this.reconnect();
    });
    socket.on(this.socketEvents.data, (datar) => {
      let data = datar.toString();
      console.warn(data);
      if (data.includes(this.splitter.end_start)) {
        let dataX = data.split(this.splitter.end_start);
        if (dataX[0].includes(this.splitter.start)) {
          this.dispatch(JSON.parse(dataX[0].replace(this.splitter.start, "")));
        } else {
          console.warn("this is part of the request, ", data);
          this.accumulator += dataX[0];
          this.dispatch(JSON.parse(this.accumulator));
          this.accumulator = "";
        }
        for (i = 1; i < dataX.length; i++) {
          if (i == dataX.length - 1) {
            if (dataX[i].includes(this.splitter.end)) {
              this.dispatch(
                JSON.parse(dataX[i].replace(this.splitter.end, ""))
              );
              this.accumulator = "";
            } else {
              this.accumulator += dataX[i];
            }
          } else {
            this.dispatch(JSON.parse(dataX[i]));
          }
        }
      } else {
        if (data.includes(this.splitter.start)) {
          let dataSub = data.replace(this.splitter.start, "");
          if (dataSub.includes(this.splitter.end)) {
            this.dispatch(JSON.parse(dataSub.replace(this.splitter.end, "")));
          } else {
            this.accumulator += dataSub;
          }
        } else if (data.includes(this.splitter.end)) {
          let dataSub = data.replace(this.splitter.end, "");
          this.accumulator += dataSub;
          this.dispatch(JSON.parse(this.accumulator));
          this.accumulator = "";
        } else {
          this.accumulator += data;
        }
      }
    });
    socket.on(this.socketEvents.timeout, (data) => {
      this.socket = () => { };
      console.warn("connection timed out", data);
    });
    socket.on(this.socketEvents.closed, (data) => {
      console.warn("connection closed by pear");
      console.error(data.toString(), "closed");
    });
    socket.on(this.socketEvents.closed, () => {
      console.error("onEnd says nothing");
    });
  }
  requestUnprocessed = {};
  requestWaitTimeout = 7000;
  sayReconnectionAttempt = "reconnection attempted"
  sayClearAll = "cleared all"
  sayDispatchingDone = "done dispaching !"
  noConnectionResponse = "not connected";
  requestTimedOutResponse = "requestTimeout";
  get_data(data, id) {
    return new Promise((resolve, reject) => {
      emitter.once(this.events.successful_ + id, (response, dataResponse) => {
        this.clearRetriesFinal(id)
        resolve(dataResponse.data);
      });
      emitter.once(this.events.unsuccessful_ + id, (response, dataError) => {
        this.clearRetriesFinal(id)
        reject(dataError);
      });
      //console.warn(this.requestUnprocessed[id])
      this.startDataSending(data, id, reject)
    });
  }
  startDataSending(data, id, reject, persist) {
    if (!this.requestUnprocessed[id]) {
      this.writeToSocket(data);
      if (this.shouldReconnect) {
        this.startRetryer(data, id, reject)
        this.shouldReconnect = false
      }
      this.requestUnprocessed[id] = true;
      this.startClearListener(id, data, persist)
    }
  }
  writeToSocket(data, init) {
    if (this.socket && this.socket.write) {
      init ? (this.initializing = true) : null;
      this.socket.write(data);
    }
  }
  writeToSocketFresh(data, id) {
    let request = JSON.parse(data.
      replace(this.splitter.start, "").
      replace(this.splitter.end, ""))
    tcpRequest.sendData(request.action, request.data, request.id).then(JSONData => {
      if (id) {
        this.startClearPersistedRequest(id)
      }
      this.writeToSocket(JSONData)
    })
  }
  startClearPersistedRequest(id) {
    emitter.once(this.events.successful_ + id, () => {
      stores.States.unPersistRequest(id)
    })
    emitter.once(this.events.unsuccessful_ + id, () => {
      stores.States.unPersistRequest(id)
    })
  }
  connectionCheck() { }
  reconnect() {
    if (!this.reconnecting && !this.initializing) {
      this.reconnecting = true;
      connect.connect().then(() => {
        this.reconnecting = false
        this.initPresence();
      });
      setTimeout(() => {
        console.warn(this.sayReconnectionTimeout);
        this.reconnecting = false;
      }, this.reconnectionTimeout);
    }
  }
  shouldReconnect = true
  sayReconnectionTimeout = "reconnection timeout reached";
  reconnectionTimeout = 5000;
  reconnectionMessage = "recconnection was successful";
  reconnecting = false;
  sayConnectionTimedout = "connection timed out";
  sayEnteringReconnectionTimmer = "entering reconnection timmier"
  reconnectAfterTimeout() {
    console.warn(this.sayEnteringReconnectionTimmer);
    this.reconnect();
  }
  collectRetriesTimeout = 5000
  collectRetries = null
  working = false;
  unsentRequest = {};
  sendRequest(data, id, persist) {
    //console.warn("sending ...", data)
    return new Promise((resolve, reject) => {
      emitter.once(this.events.successful_ + id, (response) => {
        this.clearRetriesFinal(id)
        console.warn("result response", response);
        resolve(response);
      });
      emitter.once(this.events.unsuccessful_ + id, (response) => {
        this.clearRetriesFinal(id)
        console.warn("unsuccessful, " + response);
        reject(response);
      });
      this.startDataSending(data, id, reject, persist)
    });
  }
  startClearListener(id, data, persist) {
    if (persist) {
      stores.States.PersistRequest(data, id)
    } else {
      emitter.once(this.events.cleared_ + id, () => {
        this.requestUnprocessed[id] && this.handleRerequest(data, id)
      });
    }
  }
  clearRetries(id) {
    clearInterval(this.retries[id]);
    delete this.retries[id]
  }
  clearRetriesFinal(id) {
    this.clearRetries(id);
    stores.States.unPersistRequest(id)
    this.shouldReconnect = true
    emitter.off(this.events.cleared_ + id)
    delete this.retries[id];
    delete this.retriesCounter[id];
    delete this.requestUnprocessed[id];
  }
  allowableTrials = 50
  startRetryer(data, id, reject) {
    this.retries[id] = setInterval(() => {
      //emitter.off(this.events.cleared_ + id);
      if (
        this.retriesCounter[id] &&
        this.retriesCounter[id] > this.allowableTrials &&
        this.requestUnprocessed[id]
      ) { // handling when total number of retries for a request atained
        console.warn("completing retries")
        this.clearRetriesFinal(id)
        reject();
      } else { // new trial waiter
        this.retriesCounter[id] = this.retriesCounter[id] > 0
          ? this.retriesCounter[id] + 1
          : 1;
        this.reconnectAfterTimeout();
      }
    }, this.retryInterval);
  }
  handleRerequest(data, id) {
    console.warn("clear message received for ", id)
    this.writeToSocketFresh(data)
    this.clearRetries(id)
  }
  retryInterval = 7000;
  retriesCounter = {};
  retries = {};
  GetData(EventId) {
    return new Promise((resolve, reject) => {
      let EventID = requestObject.EventID();
      EventID.event_id = EventId;
      tcpRequest.getCurrentEvent(EventID, EventId).then((JSONData) => {
        this.get_data(JSONData, EventId).then((Event) => {
          resolve(Event);
        });
      });
    });
  }
}

const EventListener = new ServerEventListener();
export default EventListener;
