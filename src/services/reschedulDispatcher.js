import stores from "../stores";
import GState from "../stores/globalState";
import { forEach } from "lodash";
class RescheduleDispatcher {
  dispatchReschedules(Reschedules) {
    forEach(Reschedules, Reschedule => {
      this.applyReschedule(Reschedule).then(() => {});
    });
  }
  applyReschedule(Reschedule) {
    return new Promise((resolve, reject) => {
      let Change = {
        event_id: Reschedule.event_id,
        changed: "Event Rescheduled",
        updater: Reschedule.rescheduler,
        new_data: Reschedule.new_date,
        dat: Reschedule.date,
        time: Reschedule.time
      };
      stores.ChangeLogs.addChanges(Change).then(() => {
        stores.Events.RescheduleEvent(Reschedule).then(() => {
          GState.eventUpdated = true;
          resolve();
        });
      });
    });
  }
}

const RescheduleDispatch = new RescheduleDispatcher();
export default RescheduleDispatch;
