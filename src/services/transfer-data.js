let ls = require("react-native-local-storage");
const xmldom = require('xmldom')
const DOMParser = xmldom.DOMParser;
const XMLSerializer = xmldom.XMLSerializer;
export default function Transferable(Phone, Action, Data) {
    return new Promise((resolve, reject) => {
        DataToSend = {
            phone: Phone,
            reference: "",
            password: "00000",
            action: Action,
            data: Data,
            host: "192.168.43.192"
        }
        resolve(JSON.stringify(DataToSend));
    });

}
