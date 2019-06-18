import { observable, action, extendObservable, autorun, computed } from "mobx";
import UserSevices from "../services/userHttpServices";
import storage from "./Storage";

export default class LoginStore {
  constructor() {}
  @observable phonenumber = "";
  @observable resetCode = "2525256";

  @observable user = {
    phone: "0666406835",
    name: "cornelius",
    status: "one step ahead the world",
    email: "ndeffocornelius@gmail.com",
    age: "17/12/1996",
    profile: require("../../Images/8.jpg"),
    profile_ext: require("../../Images/7.jpg"),
    password: "cornelius"
  };
  @action async getUser() {
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
              age: data.age,
              password: data.password,
              profile: data.profile,
              profile_ext: data.profile_ext
            };
            resolve(this.user);
          })
          .catch(error => {
            //TODO: redirection to the login page occurs here
            //reject()
            this.props.navigation.navigate("SignUp");

            resolve(this.user);
          });
      } else {
        resolve(this.user);
      }
    });
  }

  @action async setUser(newUser) {
    return new Promise((resolve, reject) => {
      this.user = {
        phone: newUser.phone,
        name: newUser.name,
        status: newUser.status,
        age: newUser.age,
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

  @action async updateName(newName) {
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

  @action async updateStatus(newStatus) {
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
  @action async updateProfile(newProfile) {
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

  @action async updateProfileExt(newProfileExt) {
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

  @action async updateEmail(newEmail) {
    return new Promise((resolve, reject) => {
      storage
        .load({
          key: "loginStore",
          autoSync: true
        })
        .then(data => {
          UserSevices.changePassword(data.phone, data.email, newEmail)
            .then(() => {
              data.email = newEmail;
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

  @action async updateAge(newAge) {
    return new Promise((resolve, reject) => {
      storage
        .load({
          key: "loginStore",
          autoSync: true
        })
        .then(data => {
          UserSevices.changeAge(data.phone, data.age, newAge)
            .then(() => {
              data.age = newAge;
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
