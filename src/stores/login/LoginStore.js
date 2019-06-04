import {
    observable,
    action,
    extendObservable,
    autorun,
    computed
} from 'mobx'
//import { filter, map, sortBy, take, toUpper } from 'lodash/fp'
//import { create, persist } from 'mobx-persist'
//import {AsyncStorage} from 'react-native';
//import 'react-native-polyfill';
//import localStorage from 'mobx-localstorage';

import storage from '../BigStorage'


class LoginStore {


    @observable _phonenumber = "";
    @computed get phonenumber() {
        return this._phonenumber
    }
    set phonenumber(phonenumber) {
        this._phonenumber = phonenumber
    }

    @observable user = {
        phone: "695527603",
        name: "cornelius",
        status: "One step ahead the world",
        profile: "../../Images/myPhoto.jpg",
        profile_ext: "../../Images/myPhoto1.jpg",
        password: "jugal"
    }


    /* 
  @action insert(name,value) {
    this.props.user.name = value;
}
*/
    @action returnUser(phonenumber) {
        /**QUERY User from DATABASE by phone number*/
        const userdb = null
        /**but for testing*/
        if (userdb != null) {
            this.user.phone = userdb.phone
            this.user.name = userdb.name
            this.user.status = userdb.status
            this.user.profile = userdb.profile
            this.user.profile_ext = userdb.profile_ext
            this.user.password = userdb.password
        }
        console.log(this.user)
        return this.user
    }

    @action checkUser(phonenumber) {
        user = this.returnUser(phonenumber)
        if (user != null) {
            /**insert to local storage */
            storage.save({
                key: 'user',
                id: '1',
                data: user,
                expires: 1000 * 60 //shall be changed to null after
            });
            return true;
        }

        return false;

    }






}

export default LoginStore







/* 
  constructor(props:Object) {
     super(props)
  }
  
  @observable counter = 0;
  
  @action increment() { this.counter++; 
  console.log("increment", this.counter); 
  }

  @action decrement() { this.counter--;
  console.log("decrement", this.counter); 
  }
  */



/* 
  @action storageHandeler() {

  
storage.save({
  key: 'loginState', 
  data: {
    from: 'some other site',
    userid: 'some userid',
    token: 'some token'
  }
})

  storage.load({
    key: 'loginState',
 
    autoSync: true,
    syncInBackground: true,
 
    syncParams: {
      extraFetchOptions: {
        // blahblah
      },
      someFlag: true
    }
  })
  .then(ret => {
    // found data go to then()
    console.log(ret.userid);
    console.error(ret.userid);
  })
  .catch(err => {
    // any exception including data not found
    // goes to catch()
    console.warn(err.message);
    switch (err.name) {
      case 'NotFoundError':
        // TODO;
        break;
      case 'ExpiredError':
        // TODO
        break;
    }
  })

 */






/*
  // Create empty store and initialize later
  @observable store = mobxstore('users', [])
  
*/
//@observable store = mobxstore({ numbers: [] })
//store('numbers') // read current value of store -- []
//store('numbers').replace([1, 2, 3]) // write [1, 2, 3] to store


/*
  @observable user = { phone: "",name: "",status: "",profile: "",
  profile_ext: "",password: ""};*/



/*
  @observable user = { phone: "",name: "",status: "",profile: "",
  profile_ext: "",password: ""};

  @action insert(name,value) {
      this.props.user.name = value;
  }


 @computed returnUser(phone){
   /**QUERY To DATABASE */
/**but for testing*/
/*
   return { phone: 695527603,name: "cornelius",status: "One step ahead the world",profile: "../../Images/myPhoto.jpg",profile_ext: "../../Images/myPhoto1.jpg",password: ""} ;
 }

 @computed checkUser(phonenumber) {
   user = returnUser(phonenumber)
   if(user != null){
      /**insert to local storage */
/* }
  /*
  return user.phone = phonenumber ;
}


   */








/*
private _loading: boolean = false;
  @computed get loading(): boolean { return this._loading; }
  set loading(loading: boolean) { this._loading = loading; }

  @observable
  private _name: string = "";
  @computed get name(): string { return this._name; }
  set name(name: string) { this._name = name; }

  @observable
  private _email: string = "";
  @computed get email(): string { return this._email; }
  set email(email: string) { this._email = email; }

  @observable
  private _password: string = "";
  @computed get password(): string { return this._password; }
  set password(password: string) { this._password = password; }*/

















/*
//configure({enforceActions: true})
//let index = 0

extendObservable(this, {
  	super(prop)
  } 
  )*/







































/* @observable list = []
   
  addListItem(item){
    this.list.push({
      name: item, 
      items: [],
      index
    })
    index++
  }
  removeListItem(item){
    this.list = this.list.filter((l) => {
      return l.index !== item.index
    })
  }


  addItem(item, name){
    this.list.forEach((l) => {
      if (l.index === item.index) {
        l.items.push(name)
      }
    })
  }
*/
