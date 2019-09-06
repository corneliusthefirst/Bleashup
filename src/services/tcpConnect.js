import TcpRequestData from "./tcpRequestData";
let net = require("react-native-tcp");
import ServerEventListener from "./severEventListener";
import * as config from "../config/bleashup-server-config.json";
import stores from "../stores";

class Connection {
  client = null;
  socket = null;
  constructor() { }
  init() {
    return new Promise((resolve, reject) => {
      let socket = net.createConnection(
        config.bleashup_tcp.port,
        config.bleashup_tcp.host,
        () => {
          ServerEventListener.listen(socket);
          stores.Session.updateSocket(socket).then(session => {
            TcpRequestData.Presence().then(JSONData => {
                socket.write(JSONData)
                this.socket = socket;
                resolve(socket);
            });
          });
        }
      );
    });
  }
  connect(){
    return new Promise((resolve,reject)=>{
      let socket = net.createConnection(
        config.bleashup_tcp.port,
        config.bleashup_tcp.host,
        () => {
          stores.Session.updateSocket(socket).then(session => {
            this.socket = socket
          resolve(socket)
          })
        })
    })
  }
  sendRequest(data) {
    return new Promise((resolve, reject) => {
      this.socket.write(data);
      resolve();
    });
  }
}

const connect = new Connection();
export default connect;
