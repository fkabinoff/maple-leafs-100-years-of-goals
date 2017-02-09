import qlikapp from "./qlikapp";
import qObjects from "./qObjects";
import subjectCube from "./subjectCube";

let state = "PlayerState";

//Radio buttons
qObjects.then((qObjects) => {
  $("input[type=radio][name=state]").change((event) => {
    state = event.currentTarget.value;
    if (state === "PlayerState") {
      $(".player-state").show();
      $(".opponent-state").hide();
    } else if (state === "OpponentState") {
      $(".opponent-state").show();
      $(".player-state").hide();
    }
    qObjects.forEach((qObject) => {
      if (qObject.changeState) {
        qObject.changeState(state);
      }
    });
  });
});

//Checkboxes
qlikapp.then((qlikapp) => {
  $("input[type=checkbox][id=total-checkbox]").change((event) => {
    $(".data-warning").hide();
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
    $("input[type=checkbox][id='total-checkbox']").prop('checked', false);
    qlikapp.getVariableByName("vTotal").then((variable) => {
      if(!$("#ev-checkbox").prop("checked") && !$("#pp-checkbox").prop("checked") && !$("#sh-checkbox").prop("checked")) {
        $(".data-warning").hide();
        $("input[type=checkbox][id='total-checkbox']").prop('checked', true);
        variable.setNumValue(1);
      } else {
        $(".data-warning").show();
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

//Player measure dropdown
qObjects.then((qObjects) => {
  $("#player-measure-dropdown + ul").click((event) => {
    let $target = $(event.target);
    $("#player-measure-dropdown .label").html($target.html());
    subjectCube.changeMeasure($target.attr("value"));
  });
});

//Clear selections
qlikapp.then((qlikapp) => {
  $(".clear-selections button").click(() => {
    if (state === "PlayerState") {
      qlikapp.clearAll(true, "PlayerState");
    } else if (state === "OpponentState") {
      qlikapp.clearAll(true, "OpponentState");
    }
  });
});