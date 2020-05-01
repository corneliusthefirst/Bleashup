import storage from "./Storage";
import { observable, action } from "mobx";
import { find, findIndex, uniq, sortBy, reject } from "lodash";
import tcpRequest from "../services/tcpRequestData";
import serverEventListener from "../services/severEventListener";
export default class contacts {
  constructor() {
    /*
    storage.remove({
      key: "contacts",
      autoSync: true
    }).then(()=>{})
    */
    this.readFromStore().then(Contacts => {
      if (Contacts) this.contacts = Contacts;
      else this.contacts = [];
    });
  }

  @observable contacts = [];
  saveKey = {
    key: "contacts",
    data: [] 
  };

  @action addContact(NewContact) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contacts => {
        Contacts = uniq(Contacts.concat([NewContact]), "phone");
        this.saveKey.data = Contacts;
        storage.save(this.saveKey).then(() => {
          this.contacts = this.saveKey.data;
          resolve();
        });
      });
    });
  }

  @action removeContact(phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contacts => {
        Contacts = reject(Contacts, ["phone", phone]);
        this.saveKey.data = Contacts
        storage.save(this.saveKey).then(() => {
          this.contacts = this.saveKey.data;
          resolve();
        });
      });
    }); 
  }
  getContacts(phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(contacts => {
        if (contacts.length == 0) {
          tcpRequest.getContacts(phone + "_contacts").then(JSONData => {
              serverEventListener.sendRequest(JSONData, phone + "_contacts").then(conts => {
                this.saveKey.data = conts;
                storage.save(this.saveKey).then(() => {
                  resolve(conts);
                });
              }).catch(error => {
                serverEventListener.socket.write = undefined
                resolve('empty')
              });
            });
        } else {
          resolve(contacts);
        }
      });
    });
  }

  getContact(phone) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contacts => {
        resolve(
          find(Contacts, {
            phone: phone
          })
        );
        // it return an object of the contact or undefined if the contact doesnot exits
      });
    });
  }

  @action updateName(Newcontact) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contacts => {
        let Contact = find(Contacts, {
          phone: Newcontact.phone
        });
        let index = findIndex(Contacts, {
          phone: phone
        });
        Contact.name = Newcontact.name;
        Contacts.splice(index, 1, Contact);
        this.saveKey.data = Contacts
        storage.save(this.saveKey).then(() => {
          this.contacts = this.saveKey.data;
          resolve();
        });
      });
    });
  }
  @action updateHost(Newcontact) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contacts => {
        let Contact = find(Contacts, {
          phone: Newcontact.phone
        });
        let index = findIndex(Contacts, {
          phone: phone
        });
        Contact.host = Newcontact.host;
        Contacts.splice(index, 1, Contact);
        this.saveKey.data = Contacts
        storage.save(this.saveKey).then(() => {
          this.contacts = this.saveKey.data;
          resolve();
        });
      });
    });
  }
  @action updateProfile(Newcontact) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contacts => {
        let Contact = find(Contacts, {
          phone: Newcontact.phone
        });
        let index = findIndex(Contacts, {
          phone: phone
        });
        Contact.profile = Newcontact.profile;
        Contacts.splice(index, 1, Contact);
        this.saveKey.data = Contacts
        storage.save(this.saveKey).then(() => {
          this.contacts = this.saveKey.data;
          resolve();
        });
      });
    });
  }
  readFromStore() {
    return new Promise((resolve, rejevt) => {
      storage
        .load({
          key: "contacts",
          autoSync: true
        })
        .then(Contacts => {
          resolve(Contacts);
        })
        .catch(error => {
          resolve([]);
        });
    });
  }
}
