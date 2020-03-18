import { observable, action, extendObservable, autorun, computed } from "mobx";
import UserSevices from "../services/userHttpServices";
import storage from "./Storage";

export default class LoginStore {
  constructor() {}
  @observable phonenumber = "";
  @observable resetCode = "2525256";

  @observable user = {
    phone: "",
    name: "",
    status: "",
    age: "",
    nickname: "",
    email: "",
    created_at: "",
    updated_at: "",
    password:"",
    profile:"",
    profile_ext:""
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
              nickname: data.nickname,
              status: data.status,
              age: data.age,
              created_at: data.created_at,
              email: data.email,
              updated_at: data.updated_at,
              password: data.password,
              profile: "https://www.whatsappprofiledpimages.com/wp-content/uploads/2019/01/Profile-Pic-Images-4-300x300.jpg", //data.profile,
              profile_ext: data.profile_ext
            };
            resolve(this.user);
          })
          .catch(error => {
            reject(error);
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
        nickname: newUser.nickname,
        email: newUser.email,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
        password: newUser.password,
        profile: newUser.profile,
        profile_ext: newUser.profile_ext
      };
      storage
        .save({
          key: "loginStore",
          data: this.user
        })
        .then(() => {
          resolve(this.user);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  @action updateName(newName) {
    console.warn("here1",newName)
    return new Promise((resolve, reject) => {
      storage
        .load({
          key: "loginStore",
          autoSync: true
        })
        .then(data => {
          console.warn("here2",data)
         // UserSevices.changeNickname(data.phone, data.password, newName)
           // .then(() => {
              console.warn("here3",newName)
              data.nickname = newName;
              storage
                .save({
                  key: "loginStore",
                  data: data
                })
                .then(() => {
                  this.user = data;
                  resolve();
                });
           // })
           // .catch(error => {
           //   reject(error);
          //  });
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

  @action updateEmail(newEmail) {
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

  @action updateAge(newAge) {
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
