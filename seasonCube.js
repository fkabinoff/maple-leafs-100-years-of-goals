import qlikapp from "./qlikapp";
import SeasonChart from "./seasonChart";

let seasonCube = {};

seasonCube.element = "#season-chart";
seasonCube.currentState = "PlayerState";

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
            qDef: "Sum(Goals) * vTotal",
            qLabel: "Regular Season Goals"
          }
        }, {
          qDef: {
            qDef: "Sum([Post-season Goals]) * vTotal",
            qLabel: "Post-season Goals"
          }
        }, {
          qDef: {
            qDef: "Sum([Even Strength Goals]) * vEV",
            qLabel: "Regular Season Even Strength Goals"
          }
        }, {
          qDef: {
            qDef: "Sum([Power Play Goals]) * vPP",
            qLabel: "Regular Season Power-Play Goals"
          }
        }, {
          qDef: {
            qDef: "Sum([Short Handed Goals]) * vSH",
            qLabel: "Regular Season Shorthanded Goals"
          }
        }, {
          qDef: {
            qDef: "Sum([Post-season Even Strength Goals]) * vEV",
            qLabel: "Post-season Even Strength Goals"
          }
        }, {
          qDef: {
            qDef: "Sum([Post-season Power Play Goals]) * vPP",
            qLabel: "Post-season Power-Play Goals"
          }
        }, {
          qDef: {
            qDef: "sum([Post-season Short Handed Goals]) * vSH",
            qLabel: "Post-season Shorthanded Goals"
          }
        }],
        qSuppressMissing: true,
        qSuppressZero: true,
        qInitialDataFetch: [{
          qWidth: 10,
          qHeight: 1000
        }]
      }
    });
  }).then((object) => {
    seasonCube.object = object;
    seasonCube.chart = new SeasonChart(seasonCube);
    const update = () => object.getLayout().then((layout) => {
      seasonCube.chart.draw(layout);
    });
    object.on('changed', update);
    update();
  });
}

seasonCube.changeState = (state) => {
  if(state === "PlayerState") {
    seasonCube.currentState = "PlayerState";
    return seasonCube.object.applyPatches([
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qStateName",
        qValue: JSON.stringify("PlayerState")
      },
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qMeasures",
        qValue: JSON.stringify([{qDef:{qDef:"Sum(Goals)*vTotal",qLabel:"Regular Season Goals"}},{qDef:{qDef: "Sum([Post-season Goals])*vTotal",qLabel:"Post-season Goals"}},{qDef:{qDef: "Sum([Even Strength Goals])*vEV",qLabel:"Regular Season Even Strength Goals"}},{qDef:{qDef:"Sum([Power Play Goals])*vPP",qLabel:"Regular Season Power-Play Goals"}},{qDef:{qDef:"Sum([Short Handed Goals])*vSH",qLabel:"Regular Season Shorthanded Goals"}},{qDef:{qDef:"Sum([Post-season Even Strength Goals])*vEV",qLabel:"Post-season Even Strength Goals"}},{qDef:{qDef:"Sum([Post-season Power Play Goals])*vPP",qLabel:"Post-season Power-Play Goals"}},{qDef:{qDef:"sum([Post-season Short Handed Goals])*vSH",qLabel:"Post-season Shorthanded Goals"}}])
      }
    ]);
  } else if (state === "OpponentState") {
    seasonCube.currentState = "OpponentState";
    return seasonCube.object.applyPatches([
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qStateName",
        qValue: JSON.stringify("OpponentState")
      },
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qMeasures",
        qValue: JSON.stringify([{qDef:{qDef:"If(GetSelectedCount([Regular/Post Season])=1 and GetFieldSelections([Regular/Post Season])='Post-season', 0, Sum({<[Regular/Post Season]={'Regular season'}>} [Opponent Goals]))",qLabel:"Regular Season Goals"}},{qDef:{qDef:"If(GetSelectedCount([Regular/Post Season])=1 and GetFieldSelections([Regular/Post Season])='Regular season', 0, Sum({<[Regular/Post Season]={'Post-season'}>} [Opponent Goals]))",qLabel:"Post-season Goals"}}])
      }
    ]);
  }
}

export default seasonCube;