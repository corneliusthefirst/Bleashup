import {
    sendPresence
} from "./bleashup-services";
let net = require("@hawkingnetwork/react-native-tcp");

export default function request() {
    let client = net.createConnection(5555, "192.168.43.192", () => {
        sendPresence("650594616", client)
            .then((XMLData) => {
                client.write(XMLData)
                client.on("error", error => {
                    console.error(error, "***************");
                });
                client.on("data", data => {
                    console.error(data.toString(), "**********************", "data");
                });
                client.on("timeout", data => {
                    console.error(data, "**********************");
                });

                client.on("closed", data => {
                    console.error(data, "**********************");
                });
            })
            .catch(err => {
                console.error(err, "**************************");
            });
    });
}
