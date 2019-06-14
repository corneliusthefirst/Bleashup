import * as configs from "../config/bleashup-server-config.json"
class UserHttpServices {
    constructor(host, domainType, port) {
        this.domain = domainType;
        this.host = host;
        this.port = port;
    }
    domain = ""
    host = ""
    port = ""
    //this method is used to test for a user to if the account exists
    checkUser(phone) {
        return new Promise((resolve, reject) => {
            fetch(`${this.domainame()}auth/check_user?phone=${phone}`, {
                method: "GET",
            }).then(result => {
                result.json().then(data => {
                    resolve(data)
                })
            }).catch(error => {
                reject(error)
            })
        })
    }
    //this method resovles true if the login was successful and false otherwise
    login(phone, password) {
        return new Promise((resolve, reject) => {
            fetch(`${this.domainame()}auth/login?phone=${phone}&password=${password}`, {
                method: "GET"
            }).then(response => {
                response.json().then(data => {
                    resolve(data)
                })
            }).catch(error => {
                reject(error)
            })
        })
    }
    //this method resolves ok if the account was successfull created
    //and "This is account is already taken if there account already exists"
    register(phone, password) {
        return new Promise((resolve, reject) => {
            fetch(`${this.domainame()}auth/register?phone=${phone}&password=${password}`, {
                method: "POST"
            }).then(result => {
                result.json().then(data => {
                    if (data.message) {
                        resolve(data.message)
                    } else {
                        resolve(data)
                    }
                })
            }).catch(error => {
                reject(error)
            })
        })
    }
    //this method is used to change the password  it resolves "ok" on success and "wrong password on error"
    changePassword(phone, currentPassword, newPasword) {
        return new Promise((resolve, reject) => {
            fetch(`${this.domainame()}auth/change_password?phone=${phone}&password=${newPasword}&previous_password=${currentPassword}`, {
                method: "POST"
            }).then(result => {
                result.json().then(data => {
                    if (data.message) {
                        resolve(data.message)
                    } else {
                        resolve(data)
                    }
                })
            }).catch(error => {
                reject(error)
            })
        })
    }
    //same return values as the method above
    changeStatus(phone, password, newStatus) {
        return new Promise((resolve, reject) => {
            fetch(`${this.domainame()}user/change_status?phone=${phone}&password=${password}&status=${newStatus}`, {
                method: "POST"
            }).then(result => {
                result.json().then(data => {
                    if (data.message) {
                        resolve(data.message)
                    } else {
                        resolve(data)
                    }
                })
            }).catch(error => {
                reject(error)
            })
        })
    }

    //same return values as the method above
    changeNickname(phone, password, newNickname) {
        return new Promise((resolve, reject) => {
            fetch(`${this.domainame()}user/change_nickname?phone=${phone}&password=${password}&nick_name=${newNickname}`, {
                method: "POST"
            }).then(result => {
                result.json().then(data => {
                    if (data.message) {
                        resolve(data.message)
                    } else {
                        resolve(data)
                    }
                })
            }).catch(error => {
                reject(error)
            })
        })
    }
    //same return values as the method above
    changeProfile(phone, password, newProfile) {
        return new Promise((resolve, reject) => {
            fetch(`${this.domainame()}user/change_profile?phone=${phone}&password=${password}&profile=${newProfile}`, {
                method: "POST"
            }).then(result => {
                result.json().then(data => {
                    if (data.message) {
                        resolve(data.message)
                    } else {
                        resolve(data)
                    }
                })
            }).catch(error => {
                reject(error)
            })
        })
    }

    //same return values as the method above
    changeProfileExt(phone, password, newProfileExt) {
        return new Promise((resolve, reject) => {
            fetch(`${this.domainame()}user/change_profile_ext?phone=${phone}&password=${password}&profile_ext=${newProfileExt}`, {
                method: "POST"
            }).then(result => {
                result.json().then(data => {
                    if (data.message) {
                        resolve(data.message)
                    } else {
                        resolve(data)
                    }
                })
            }).catch(error => {
                reject(error)
            })
        })
    }
    // this method is used to fetch data from the store and the backend
    // if the oreation was successful the method resolves the data 
    getProfile(phone) {
        return new Promise((resolve, reject) => {
            fetch(`${this.domainame()}user/profile?phone=${phone}`, {
                method: "GET"
            }).then(response => {
                response.json().then(data => {
                    if (data.message) {
                        resolve(data.message)
                    } else {
                        resolve(data)
                    }
                }).catch(error => {
                    resolve(error)
                })
            })
        })
    }
    // this method is used to fetch data from the store and the backend
    // if the oreation was successful the method resolves the data 
    getProfileExt(phone) {
        return new Promise((resolve, reject) => {
            fetch(`${this.domainame()}user/profile_ext?phone=${phone}`, {
                method: "GET"
            }).then(response => {
                response.json().then(data => {
                    if (data.message) {
                        resolve(data.message)
                    } else {
                        resolve(data)
                    }
                }).catch(error => {
                    resolve(error)
                })
            })
        })
    }
    getUser(phone, password) {
        return new Promise((resolve, reject) => {
            fetch(`${this.domainame()}user?phone=${phone}&password=${password}`, {
                method: "GET"
            }).then(result => {
                result.json().then(data => {
                    if (data.message) {
                        resolve(data.message)
                    } else {
                        resolve(data)
                    }
                })
            }).catch(error => {
                reject(error)
            })
        })
    }
    getSession(phone) {
        return new Promise((resolve, reject) => {
            fetch(`${this.domainame()}user/session?phone=${phone}`, {
                method: "GET"
            }).then(result => {
                result.json().then(data => {
                    if (data.message) {
                        resolve(data.message)
                    } else {
                        resolve(data)
                    }
                })
            })
        })
    }
    domainame() {
        return this.domain + "://" + this.host + ":" + this.port + "/"
    }

}



const UserService = new UserHttpServices(configs.bleashup_http.host, "http", configs.bleashup_http.port)
export default UserService
