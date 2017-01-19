import qlikapp from "./qlikapp";
import qObjects from "./qObjects";

qObjects.then((qObjects) => {
  $("input[type=radio][name=state]").change((event) => {
    let state = event.currentTarget.value;
    qObjects.forEach((qObject) => {
      if (qObject.changeState) {
        qObject.changeState(state);
      }
    });
  });
});