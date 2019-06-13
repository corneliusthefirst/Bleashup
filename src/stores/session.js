import storage from "./BigStorage";
import { LoginStore } from "./";
import { observable, action, extendObservable, autorun, computed } from "mobx";
require("json-circular-stringify"); // !! This is added to solve the problem TypeError: JSON.stringify cannot serialize cyclic structures
export default class Session {
  @observable SessionStore = {
    socket: null,
    phone: "",
    password: "",
    reference: "#Ref<0.3996024962.2836135937.9226>",
    host: "bleashup.com"
  };
  constructor() {
    storage
      .load({
        key: "session",
        autoSync: true
      })
      .then(ses => {
        this.SessionStore = {
          socket: ses.socket,
          phone: ses.phone,
          password: ses.password,
          reference: ses.reference,
          host: ses.host
        };
      })
      .catch(error => {
        this.initialzeStore().then(session => {});
      });
  }
  initialzeStore() {
    return new Promise((resolve, reject) => {
      LoginStore.getUser()
        .then(user => {
          let session = {
            socket: null,
            phone: user.phone,
            password: user.password,
            reference: "#Ref<0.3996024962.2836135937.9226>",
            host: "bleashup.com"
          };
          storage
            .save({
              key: "session",
              data: session
            })
            .then(() => {
              this.SessionStore = session;
              resolve(session);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  @action getSession() {
    return new Promise((resolve, reject) => {
      if (this.SessionStore.phone === "" || this.SessionStore === "") {
        storage
          .load({
            key: "session",
            autoSync: true
          })
          .then(data => {
            this.SessionStore = data;
            resolve(data);
          })
          .catch(error => {
            this.initialzeStore()
              .then(data => {
                resolve(data);
              })
              .catch(error => {
                reject(error);
              });
          });
      } else {
        resolve(this.SessionStore);
      }
    });
  }
  initialzeStoreAndUpdate(key, newValue) {
    return new Promise((resolve, reject) => {
      LoginStore.getUser()
        .then(user => {
          let session = {
            socket: null,
            phone: user.phone,
            password: user.password,
            reference: "#Ref<0.3996024962.2836135937.9226>",
            host: "bleashup.com"
          };
          session[key] = newValue;
          storage
            .save({
              key: "session",
              data: session
            })
            .then(() => {
              this.SessionStore = session;
              resolve(session);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  @action updateReference(newReference) {
    return new Promise((resolve, reject) => {
      storage
        .load({
          key: "session",
          autoSync: true
        })
        .then(session => {
          session.reference = newReference;
          this.SessionStore = session;
          storage
            .save({
              key: "session",
              data: session
            })
            .then(() => {
              resolve(session);
            });
        })
        .catch(error => {
          this.initialzeStoreAndUpdate("reference", newReference)
            .then(session => {
              this.SessionStore = session;
              resolve(session);
            })
            .catch(error => {
              reject(error);
            });
        });
    });
  }

  @action updateSocket(newSocket) {
    return new Promise((resolve, reject) => {
      storage
        .load({
          key: "session",
          autoSync: true
        })
        .then(session => {
          session.socket = newSocket;
          //session.host = "192.168.43.192";
          storage
            .save({
              key: "session",
              data: session
            })
            .then(() => {
              this.SessionStore = session;
              resolve(session);
            });
        })
        .catch(error => {
          this.initialzeStoreAndUpdate("socket", newSocket)
            .then(session => {
              this.SessionStore = session;
              resolve(session);
            })
            .catch(error => {
              reject(error);
            });
        });
    });
  }
  @action updateHost(newHost) {
    return new Promise((resolve, reject) => {
      storage
        .load({
          key: "session",
          autoSync: true
        })
        .then(session => {
          session.host = newHost;
          this.SessionStore = session;
          storage
            .save({
              key: "session",
              data: session
            })
            .then(() => {
              resolve(session);
            });
        })
        .catch(error => {
          this.initialzeStoreAndUpdate("socket", newHost)
            .then(session => {
              this.SessionStore = session;
              resolve(session);
            })
            .catch(error => {
              reject(error);
            });
        });
    });
  }
}
