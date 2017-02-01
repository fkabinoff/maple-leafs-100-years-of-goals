import qlikapp from "./qlikapp";
import GoalChart from "./goal-chart";

let seasonCube = {};

seasonCube.element = "#season-chart";

seasonCube.init = () => {
  return qlikapp.then((app) => {
    return app.createSessionObject({
      qInfo: {
        qType: "visualization",
      },
      qHyperCubeDef: {
        qStateName: "PlayerState",
        qDimensions: [{
          qDef: {
            qFieldDefs: ["[Season]"],
            qSortCriterias: [{
              qSortByAscii: 1
            }]
          },
          qSortCriterias: [{
            qSortByNumeric: 1
          }]
        }],
        qMeasures: [{
          qDef: {
            qDef: "Sum(Goals)"
          }
        }, {
          qDef: {
            qDef: "Sum([Post-season Goals])"
          }
        }, {
          qDef: {
            qDef: "Sum([Even Strength Goals])"
          }
        }, {
          qDef: {
            qDef: "Sum([Power Play Goals])"
          }
        }, {
          qDef: {
            qDef: "Sum([Short Handed Goals])"
          }
        }, {
          qDef: {
            qDef: "Sum([Post-season Even Strength Goals])"
          }
        }, {
          qDef: {
            qDef: "Sum([Post-season Power Play Goals])"
          }
        }, {
          qDef: {
            qDef: "sum([Post-season Short Handed Goals])"
          }
        }],
        qSuppressMissing: true,
        qInitialDataFetch: [{
          qWidth: 10,
          qHeight: 1000
        }]
      }
    });
  }).then((object) => {
    seasonCube.object = object;
    seasonCube.chart = new GoalChart(seasonCube);
    const update = () => object.getLayout().then((layout) => {
      seasonCube.chart.draw(layout);
    });
    object.on('changed', update);
    update();
  });
}

seasonCube.changeState = (state) => {
  if(state === "PlayerState") {
    return seasonCube.object.applyPatches([
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qStateName",
        qValue: JSON.stringify("PlayerState")
      },
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qMeasures",
        qValue: JSON.stringify([{qDef:{qDef:"Sum(Goals)"}},{qDef:{qDef:"Sum([Post-season Goals])"}},{qDef:{qDef:"Sum([Even Strength Goals])"}},{qDef:{qDef:"Sum([Post-season Even Strength Goals])"}},{qDef:{qDef: "Sum([Power Play Goals])"}},{qDef:{qDef: "Sum([Post-season Power Play Goals])"}},{qDef:{qDef: "Sum([Short Handed Goals])"}},{qDef:{qDef:"sum([Post-season Short Handed Goals])"}}])
      }
    ]);
  } else if (state === "OpponentState") {
    return seasonCube.object.applyPatches([
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qStateName",
        qValue: JSON.stringify("OpponentState")
      },
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qMeasures",
        qValue: JSON.stringify([{qDef:{qDef:"Sum({<[Regular/Post Season]={'Regular season'}>} [Opponent Goals])"}},{qDef:{qDef:"Sum({<[Regular/Post Season]={'Post-season'}>} [Opponent Goals])"}}])
      }
    ]);
  }
}

export default seasonCube;