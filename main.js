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

qlikapp.then((qlikapp) => {
  $("input[type=checkbox][id=total-checkbox]").change((event) => {
    $("input[type=checkbox][class='type checkbox']").prop('checked', false);
    qlikapp.getVariableByName("vTotal").then((variable) => {
      variable.setNumValue(1);
    });
    qlikapp.getVariableByName("vEV").then((variable) => {
      variable.setNumValue(0);
    });
    qlikapp.getVariableByName("vPP").then((variable) => {
      variable.setNumValue(0);
    });
    qlikapp.getVariableByName("vSH").then((variable) => {
      variable.setNumValue(0);
    });
  });
  $("input[type=checkbox][class='type checkbox']").change((event) => {
    $("input[type=checkbox][id='total checkbox']").prop('checked', false);
    qlikapp.getVariableByName("vTotal").then((variable) => {
      if(!$("#ev-checkbox").prop("checked") && !$("#pp-checkbox").prop("checked") && !$("#sh-checkbox").prop("checked")) {
        variable.setNumValue(1);
      } else {
        variable.setNumValue(0);
      }
    });
    qlikapp.getVariableByName("vEV").then((variable) => {
      if ($("#ev-checkbox").prop("checked")) {
        variable.setNumValue(1);
      } else {
        variable.setNumValue(0);
      }
    });
    qlikapp.getVariableByName("vPP").then((variable) => {
      if ($("#pp-checkbox").prop("checked")) {
        variable.setNumValue(1);
      } else {
        variable.setNumValue(0);
      }
    });
    qlikapp.getVariableByName("vSH").then((variable) => {
      if ($("#sh-checkbox").prop("checked")) {
        variable.setNumValue(1);
      } else {
        variable.setNumValue(0);
      }
    });
  });
});