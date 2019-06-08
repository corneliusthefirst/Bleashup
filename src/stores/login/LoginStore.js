import { observable, action,extendObservable,autorun , computed } from 'mobx'

import functions from '../StorageFunctions';
import storage from '../Storage';



class LoginStore {
  
  //loading
  @observable loading = false;
  
  /**observable */
  @observable phoneNumber = "";
  @observable password = "";


  @observable user = { phone:"695527603",name: "cornelius",status: "One step ahead the worlthis.d",profile: "../../Images/myPhoto.jpg",profile_ext: "../../Images/myPhoto1.jpg",password: "jugal"}
    

@action returnUser(phonenumber){
 /**QUERY User from DATABASE by phone number*/
 const userdb = null
 /**but for testing*/
  if(userdb != null){
    this.user.phone = userdb.phone
    this.user.name = userdb.name
    this.user.status = userdb.status
    this.user.profile = userdb.profile
    this.user.profile_ext = userdb.profile_ext
    this.user.password = userdb.password
  }
 
  return  this.user
}

@action checkUser(phonenumber) {
    
        functions.loadData('user','1').then(ret=>{
          
          if(ret.phone == phonenumber){
            //take from asynstorage if exist
            this.user = ret
          }else{
            //take the one from  the database
            this.user = this.returnUser(phonenumber)
            console.error(this.user)
            /**insert to local storage */
            functions.saveData('user','1',this.user,1000*60)
          }
          //if data exist return locally or in database
          if(this.user != null){
             return true
          }

       })

        return false 
 
  }


  




  //SignIn ##########################################################
  @action
  async login(){
    this.loading = true;

    try {
      if (this.password === "") {
        throw new Error("Please provide password.");
      }
      //check the password to that of our local storage
      if (this.password != this.user.password) {
      console.warn(this.password)
      console.warn(this.user.password)
      throw new Error("Invalid password.");
      }

      this.loading = false;

    } catch (e) {
      this.loading = false;
      throw e;
    }
  }
























}


export default LoginStore

























  /*@computed get loading(){ return this._loading; }
  set loading(loading) { this._loading = loading; }*/

//this.user = null;
 //console.error(this.user)

/* 
/* 
 
  @action insert(name,value) {
    this.props.user.name = value;
}

@computed get phonenumber() { return this._phonenumber}
@computed set phonenumber(phonenumber) { this._phonenumber = phonenumber}



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
   /**but for testing*//*
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
