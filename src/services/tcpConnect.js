import TcpRequestData from "./tcpRequestData";
let net = require("react-native-tcp");
import * as config from "../config/bleashup-server-config.json";
import stores from "../stores";
//import { Session } from "../stores";

class Connection {
  client = null;
  constructor() {}
  init() {
    return new Promise((resolve, reject) => {
      let socket = net.createConnection(
        config.bleashup_tcp.port,
        config.bleashup_tcp.host,
        () => {
          stores.Session.updateSocket(socket).then(session => {
            TcpRequestData.Presence().then(JSONData => {
              socket.write(JSONData);
              resolve(socket);
            });
          });
        }
      );
    });
  }
  sendRequest(socket, data) {
    return new Promise((resolve, reject) => {
      socket.write(data);
      resolve();
    });
  }
}

const connect = new Connection();
export default connect;
