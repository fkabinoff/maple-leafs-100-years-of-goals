import qlikapp from "./qlikapp";
import Filter from "./filter";

let decadeList = {};

decadeList.element = "#decade-filter";

decadeList.init = () => {
  return qlikapp.then((app) => {
    return app.createSessionObject({
      qInfo: {
        qType: "visualization",
      },
      qListObjectDef: {
        qStateName: "PlayerState",
        qDef: {
          qFieldDefs: ["[Player Season Decade]"],
          qFieldLabels: ["Decades"]
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
    decadeList.object = object;
    decadeList.filter = new Filter(decadeList);
    const update = () => object.getLayout().then((layout) => {
      decadeList.filter.update(layout);
    });
    object.on('changed', update);
    update();
  });
}

decadeList.changeState = (state) => {
  if(state === "PlayerState") {
    return decadeList.object.applyPatches([
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qStateName",
          qValue: JSON.stringify("PlayerState")
      },
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qDef/qFieldDefs/0",
          qValue: JSON.stringify("[Player Season Decade]")
      }
    ]);
  } else if (state === "OpponentState") {
    return decadeList.object.applyPatches([
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qStateName",
          qValue: JSON.stringify("OpponentState")
      },
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qDef/qFieldDefs/0",
          qValue: JSON.stringify("[Opponent Season Decade]")
      }
    ]);
  }
}

export default decadeList;