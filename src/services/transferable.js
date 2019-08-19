class Transferable {
  formTransferableData(session, action, data, id) {
    return new Promise((resolve, reject) => {
      DataToSend = {
        phone: session.phone,
        reference: session.reference,
        password: session.password,
        action: action,
        data: data,
        id: id,
        host: session.host
      };
      resolve(JSON.stringify(DataToSend));
    });
  }
}

const transferable = new Transferable();
export default transferable;
