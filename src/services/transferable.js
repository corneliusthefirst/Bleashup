class Transferable {
  formTransferableData(session, action, data) {
    return new Promise((resolve, reject) => {
      DataToSend = {
        phone: session.phone,
        reference: session.reference,
        password: session.password,
        action: action,
        data: data,
        host: session.host
      };
      resolve(JSON.stringify(DataToSend));
    });
  }
}

const transferable = new Transferable();
export default transferable;
