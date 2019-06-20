import { observable, action, extendObservable, autorun, computed } from "mobx";
import UserSevices from "../services/userHttpServices";
import storage from "./Storage";

export default class TempLoginStore {
  constructor() {}
  @observable phonenumber = "";
  @observable resetCode = "2525256";

  @observable user = {
    phone: "0666406835",
    name: "cornelius",
    status: "one step ahead the world",
    email:'ndeffocornelius@gmail.com',
    age:"17/12/1996",
    profile: require('../../Images/8.jpg'),
    profile_ext:require('../../Images/7.jpg'),
    password: "cornelius"
  };

                  //Please check this commented code

  
  @action  deleteData(userKey) {
    return new Promise((resolve, reject) => {
      storage.remove({
        key: userKey,       
      });

      resolve();
    }).catch(error => {
      reject(error);
    });

  }




  @action  saveData(data,key) {
    return new Promise((resolve, reject) => {
      storage.save({
        key: key, 
        data: data      
      });

      resolve();

    }).catch(error => {
      reject(error);
    });

  }

  @action  loadSaveData(dataname,key) {
    return new Promise((resolve, reject) => {
      
        storage
          .load({
            key: key,
            autoSync: true
          })
          .then(data => {
            this.dataname = data
            resolve(this.dataname);
            
          })
          .catch(error => {
            reject(error)
          });

        
        });
  }


  @action  getUser() {
    return new Promise((resolve, reject) => {
      if (this.user.phone == "" || this.user.password == "") {
        storage
          .load({
            key: "temploginStore",
            autoSync: true
          })
          .then(data => {
            this.user = {
              phone: data.phone,
              name: data.name,
              status: data.status,
              age:data.age,
              password: data.password,
              profile: data.profile,
              profile_ext: data.profile_ext
            };
            resolve(this.user);
            
          })
          .catch(error => {
            //TODO: redirection to the login page occurs here
            //reject()
            //this.props.navigation.navigate("SignUp")
            
            resolve(this.user);
          });
      } else {
        resolve(this.user);
      }
    });
  }

  @action  setUser(newUser) {
    return new Promise((resolve, reject) => {
      this.user = {
        phone: newUser.phone,
        name: newUser.name,
        status: newUser.status,
        age:newUser.age,
        password: newUser.password,
        profile: newUser.profile,
        profile_ext: newUser.profile_ext
      };

      deleteUser("temploginStore");

      storage.save({
        key: "temploginStore",
        data: this.user
      });
      resolve();
    }).catch(error => {
      reject(error);
    });

  }



}




