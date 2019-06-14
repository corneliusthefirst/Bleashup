import { observable, action, extendObservable, autorun, computed } from "mobx";
import UserSevices from "../services/userHttpServices";
import storage from "./Storage";

export default class LoginStore {
  constructor() {}
  @observable phonenumber = "";
  

  @observable user = {
    phone: "",
    name: "",
    status: "",
    profile: "",
    profile_ext: "",
    password: ""
  };
  @action getUser() {
    return new Promise((resolve, reject) => {
      if (this.user.phone == "" || this.user.password == "") {
        storage
          .load({
            key: "loginStore",
            autoSync: true
          })
          .then(data => {
            this.user = {
              phone: data.phone,
              name: data.name,
              status: data.status,
              password: data.password,
              profile: data.profile,
              profile_ext: data.profile_ext
            };
            resolve(this.user);
            
          })
          .catch(error => {
            //TODO: redirection to the login page occurs here
            //reject()
            this.props.navigation.navigate("SignUp")
            
            resolve(this.user);
          });
      } else {
        resolve(this.user);
      }
    });
  }

  @action setUser(newUser) {
    return new Promise((resolve, reject) => {
      this.user = {
        phone: newUser.phone,
        name: newUser.name,
        status: newUser.status,
        password: newUser.password,
        profile: newUser.profile,
        profile_ext: newUser.profile_ext
      };
      storage.save({
        key: "loginStore",
        data: this.user
      });
      resolve();
    }).catch(error => {
      reject(error);
    });
    
  }

  @action updateName(newName) {
    return new Promise((resolve, reject) => {
      storage
        .load({
          key: "loginStore",
          autoSync: true
        })
        .then(data => {
          UserSevices.changeNickname(data.phone, data.password, newName)
            .then(() => {
              data.name = newName;
              storage
                .save({
                  key: "loginStore",
                  data: data
                })
                .then(() => {
                  this.user = data;
                  resolve();
                });
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  @action updateStatus(newStatus) {
    return new Promise((resolve, reject) => {
      storage
        .load({
          key: "loginStore",
          autoSync: true
        })
        .then(data => {
          UserSevices.changeStatus(data.phone, data.password, newStatus)
            .then(() => {
              data.status = newStatus;
              storage
                .save({
                  key: "loginStore",
                  data: data
                })
                .then(() => {
                  this.user = data;
                  resolve();
                });
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  @action updateProfile(newProfile) {
    return new Promise((resolve, reject) => {
      storage
        .load({
          key: "loginStore",
          autoSync: true
        })
        .then(data => {
          UserSevices.changeProfile(data.phone, data.password, newProfile)
            .then(() => {
              data.profile = newProfile;
              storage
                .save({
                  key: "loginStore",
                  data: data
                })
                .then(() => {
                  this.user = data;
                  resolve();
                });
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  @action updateProfileExt(newProfileExt) {
    return new Promise((resolve, reject) => {
      storage
        .load({
          key: "loginStore",
          autoSync: true
        })
        .then(data => {
          UserSevices.changeProfileExt(data.phone, data.password, newProfileExt)
            .then(() => {
              data.profile_ext = newProfileExt;
              storage
                .save({
                  key: "loginStore",
                  data: data
                })
                .then(() => {
                  this.user = data;
                  resolve();
                });
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  @action updatePassword(newPassword) {
    return new Promise((resolve, reject) => {
      storage
        .load({
          key: "loginStore",
          autoSync: true
        })
        .then(data => {
          UserSevices.changePassword(data.phone, data.password, newPassword)
            .then(() => {
              data.password = newPassword;
              storage
                .save({
                  key: "loginStore",
                  data: data
                })
                .then(() => {
                  this.user = data;
                  resolve();
                });
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
