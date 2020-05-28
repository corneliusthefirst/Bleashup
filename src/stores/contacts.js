import storage from "./Storage";
import { observable, action } from "mobx";
import { find, findIndex, uniq, sortBy, reject } from "lodash";
import tcpRequest from "../services/tcpRequestData";
import serverEventListener from "../services/severEventListener";
import moment from 'moment';
export default class contacts {
  constructor() {
    //storage.remove(this.saveKey).then(() =>{})
    this.initializeStore()
    this.intervaler = setInterval(() => {
      this.currentTime !== this.previousTime ? this.save() : null
    }, this.saveInterval)
  }

  @observable contacts = {};
  saveKey = {
    key: "contacts",
    data: {},
  };
  saveInterval = 2000
  intervaler
  @action addContact(NewContact) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Contacts) => {
        Contacts.contacts = uniq(Contacts.contacts.concat([NewContact]), "phone");
        this.setProperties(Contacts)
        resolve();
      });
    });
  }

  @action removeContact(phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Contacts) => {
        Contacts.contacts = reject(Contacts.contacts, ["phone", phone]);
        this.setProperties(Contacts)
        resolve();
      });
    });
  }
  save() {
    this.saveKey.data = this.contacts
    storage.save(this.saveKey).then(() => {
      console.warn("saving contacts")
      this.previousTime = this.currentTime
    })
  }
  currentTime = moment().format()
  previousTime = moment().format()
  setProperties(newValue) {
    this.currentTime = moment().format()
    this.contacts = newValue
  }
  getContacts(phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((contacts) => {
        if (!contacts || !contacts.contacts || contacts.contacts.length == 0) {
          tcpRequest.getContacts(phone + "_contacts").then((JSONData) => {
            serverEventListener
              .sendRequest(JSONData, phone + "_contacts")
              .then((conts) => {
                contacts.contacts = conts
                this.setProperties(contacts)
                resolve(contacts.contacts)
              })
              .catch((error) => {
                resolve("empty");
              });
          });
        } else {
          resolve(contacts.contacts);
        }
      });
    });
  }

  getContact(phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Contacts) => {
        resolve(
          find(Contacts.contact, {
            phone: phone,
          })
        );
        // it return an object of the contact or undefined if the contact doesnot exits
      });
    });
  }

  @action updateName(Newcontact) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Contacts) => {
        let Contact = find(Contacts.contacts, {
          phone: Newcontact.phone,
        });
        let index = findIndex(Contacts, {
          phone: phone,
        });
        Contact.name = Newcontact.name;
        Contacts.contacts.splice(index, 1, Contact);
        this.setProperties(Contacts)
        resolve();
      });
    });
  }
  @action updateHost(Newcontact) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Contacts) => {
        let Contact = find(Contacts.contacts, {
          phone: Newcontact.phone,
        });
        let index = findIndex(Contacts.contacts, {
          phone: phone,
        });
        Contact.host = Newcontact.host;
        Contacts.contacts.splice(index, 1, Contact);
        this.setProperties(Contacts)
        resolve();
      });
    });
  }
  addFollower(phone, host) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((contact) => {
        contact.followers =
          contact.followers && contact.followers.length > 0
            ? uniq(
              contact.followers.unsift({ phone: phone, host: host }),
              "phone"
            )
            : [{ phone, host }];
        this.setProperties(contact)
        resolve()
      });
    });
  }
  addFollowing(phone, host) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((contact) => {
        contact.following =
          contact.following && contact.following.length > 0
            ? uniq(
              contact.following.unsift({ phone: phone, host: host }),
              "phone"
            )
            : [{ phone, host }];
            this.setProperties(contact)
           resolve()
      });
    });
  }
  removeFollowing(phone) {
    return new Promise((resolve, rejec) => {
      this.readFromStore().then((contacts) => {
        contacts.following = reject(contacts.following, { phone })
        this.setProperties(contacts)
         resolve()
      })
    })
  }
  removeFollower(phone) {
    return new Promise((resolve, rejec) => {
      this.readFromStore().then((contacts) => {
        contacts.followers = reject(contacts.followers, { phone })
        this.setProperties(contacts)
         resolve()
      })
    })
  }
  @action updateProfile(Newcontact) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then((Contacts) => {
        let Contact = find(Contacts.contacts, {
          phone: Newcontact.phone,
        });
        let index = findIndex(Contacts, {
          phone: phone,
        });
        Contact.profile = Newcontact.profile;
        Contacts.contacts.splice(index, 1, Contact);
        this.setProperties(Contacts)
             resolve();
      });
    });
  }
  initializeStore() {
    return new Promise((resolve, rejevt) => {
      storage
        .load({
          key: "contacts",
          autoSync: true,
        })
        .then((Contacts) => {
          this.contacts = Contacts
          resolve()
        })
        .catch((error) => {
          resolve({});
        });
    });
  }
  readFromStore() {
    return new Promise((resolve, reject) => {
      resolve(this.contacts)
    })
  }
}
