import qlikapp from "./qlikapp";
import Filter from "./filter";

let seasonList = {};

seasonList.element = "#season-filter";

seasonList.init = () => {
  return qlikapp.then((app) => {
    return app.createSessionObject({
      qInfo: {
        qType: "visualization",
      },
      qListObjectDef: {
        qStateName: "PlayerState",
        qDef: {
          qFieldDefs: ["[Season]"],
          qFieldLabels: ["Seasons"]
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
    seasonList.object = object;
    seasonList.filter = new Filter(seasonList);
    const update = () => object.getLayout().then((layout) => {
      seasonList.filter.update(layout);
    });
    object.on('changed', update);
    update();
  });
}

seasonList.changeState = (state) => {
  if(state === "PlayerState") {
    return seasonList.object.applyPatches([
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qStateName",
          qValue: JSON.stringify("PlayerState")
      }
    ]);
  } else if (state === "OpponentState") {
    return seasonList.object.applyPatches([
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qStateName",
          qValue: JSON.stringify("OpponentState")
      }
    ]);
  }
}

export default seasonList;