import qlikapp from "./qlikapp";

let seasonCube = {};

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
            qFieldDefs: ["[Season]"]
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
            qDef: "Sum([Post-season Even Strength Goals])"
          }
        }, {
          qDef: {
            qDef: "Sum([Power Play Goals])"
          }
        }, {
          qDef: {
            qDef: "Sum([Post-season Power Play Goals])"
          }
        }, {
          qDef: {
            qDef: "Sum([Short Handed Goals])"
          }
        }, {
          qDef: {
            qDef: "sum([Post-season Short Handed Goals])"
          }
        }],
        qInitialDataFetch: [{
          qWidth: 10,
          qHeight: 1000
        }]
      }
    });
  }).then((object) => {
    seasonCube.object = object;
    const update = () => object.getLayout().then((layout) => {
      //todo
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