let ls = require("react-native-local-storage");
const xmldom = require('xmldom')
const DOMParser = xmldom.DOMParser;
const XMLSerializer = xmldom.XMLSerializer;
export default function Transferable(Phone, Action, Data) {
    return new Promise((resolve, reject) => {
      DataToSend = exportToXmlDoc(Data,Phone,"aaaaa","#Ref<0.2340125382.930086913.52239>",Action)
        resolve(DataToSend);
    });

}

// Append a child element
function appendChild(xmlDoc, parentElement, name, text) {
  let childElement = xmlDoc.createElement(name);
  if (typeof text !== 'undefined') {
    let textNode = xmlDoc.createTextNode(text);
    childElement.appendChild(textNode);
  }
  parentElement.appendChild(childElement);
  return childElement;
}

 function exportToXmlDoc(Data,phone,password,refference,action) {

  // documentElement always represents the root node
  const xmlDoc = new DOMParser().parseFromString("<Transferable></Transferable>");
  let rootElement = xmlDoc.documentElement;
  xmlDoc.documentElement.setAttribute("password",password)
  xmlDoc.documentElement.setAttribute("phone",phone)
  appendChild(xmlDoc, rootElement, 'data',Data);
  appendChild(xmlDoc, rootElement, 'reference', refference);
  appendChild(xmlDoc, rootElement, 'action',action)
  appendChild(xmlDoc, rootElement, 'host',"192.168.43.192")
  const xmlSerializer = new XMLSerializer();
  const xmlOutput = xmlSerializer.serializeToString(xmlDoc);
  return xmlOutput;
}
