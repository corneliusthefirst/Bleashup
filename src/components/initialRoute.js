import stores from "../stores";

const loginStore = stores.LoginStore;
const temploginStore = stores.TempLoginStore;

class InitialRouteName {
  constructor() {
    this.initialRoute().then(route => {
      this.routeName = route;
    });
  }

  routeName = "";

  initialRoute() {
    return new Promise((resolve, reject) => {
      loginStore
        .getUser()
        .then(user => {
          if (user.password == "") {
            resolve("SignIn");
          } else {
            resolve("Home");
          }
        })
        .catch(error => {
          temploginStore
            .getUser()
            .then(user => {
              resolve("EmailVerification");
            })
            .catch(error => {
              resolve("Login");
            });
        });
    });
  }
}

const initialRoute = new InitialRouteName();
export default initialRoute;
