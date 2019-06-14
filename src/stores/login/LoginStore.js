import {
    observable,
    action,
    extendObservable,
    autorun,
    computed
} from 'mobx'

import functions from '../StorageFunctions';
import storage from '../Storage';



class LoginStore {

    //loading
    @observable loading = false;

    /**observable */
    @observable phoneNumber = "";
    @observable password = "";


    @observable user = {
        phone: "695527603",
        name: "cornelius",
        status: "One step ahead the worlthis.d",
        profile: "../../Images/myPhoto.jpg",
        profile_ext: "../../Images/myPhoto1.jpg",
        password: "jugal"
    }


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

        return this.user
    }

    @action checkUser(phonenumber) {

        functions.loadData('user', '1').then(ret => {

            if (ret.phone == phonenumber) {
                //take from asynstorage if exist
                this.user = ret
            } else {
                //take the one from  the database
                this.user = this.returnUser(phonenumber)
                console.error(this.user)
                /**insert to local storage */
                functions.saveData('user', '1', this.user, 1000 * 60)
            }
            //if data exist return locally or in database
            if (this.user != null) {
                return true
            }

        })

        return false

    }

    //SignIn ##########################################################
    @action
    async login() {
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
