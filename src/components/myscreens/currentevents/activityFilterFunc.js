
import { findIndex } from 'lodash';
import stores from '../../../stores';
export default function actFilterFunc(event) {
  return (
    (findIndex(event.participant, { phone: stores.LoginStore.user.phone }) >=
      0 &&
      event.id !== "newEventId" &&
      !event.hiden) ||
    (event.public && !event.hiden && event.id !== "newEventId")
  );
}
