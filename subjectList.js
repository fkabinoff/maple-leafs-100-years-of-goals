import qlikapp from "./qlikapp";
import Filter from "./filter";

let subjectList = {};

subjectList.element = "#subject-filter";
subjectList.label = "Players";

subjectList.init = () => {
  return qlikapp.then((app) => {
    return app.createSessionObject({
      qInfo: {
        qType: "visualization",
      },
      qListObjectDef: {
        qStateName: "PlayerState",
        qDef: {
          qFieldDefs: ["[Player Name]"]
        },
        qAutoSortByState: {
          qDisplayNumberOfRows: 1
        },
        qShowAlternatives: true,
        qInitialDataFetch: [{
          qWidth: 1,
          qHeight: 1000
        }]
      }
    });
  }).then((object) => {
    subjectList.object = object;
    subjectList.filter = new Filter(subjectList);
    const update = () => object.getLayout().then((layout) => {
      subjectList.filter.update(layout);
    });
    object.on('changed', update);
    update();
  });
}

subjectList.changeState = (state) => {
  if(state === "PlayerState") {
    return subjectList.object.applyPatches([
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qStateName",
          qValue: JSON.stringify("PlayerState")
      },
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qDef/qFieldDefs/0",
          qValue: JSON.stringify("[Player Name]")
      }
    ]);
  } else if (state === "OpponentState") {
    return subjectList.object.applyPatches([
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qStateName",
          qValue: JSON.stringify("OpponentState")
      },
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qDef/qFieldDefs/0",
          qValue: JSON.stringify("[Opponent]")
      }
    ]);
  }
}

export default subjectList;