let subjectCube = {};

subjectCube.init = () => {
  return app.createSessionObject({
    qInfo: {
      qType: "visualization",
    },
    qHyperCubeDef: {
      qStateName: "PlayerState",
      qDimensions: [{
        qDef: {
          qFieldDefs: ["[Player Name]"]
        },
        qSortCriterias: [{
          qSortByAscii: -1
        }]
      }],
      qMeasures: [{
        qDef: {
          qDef: "Sum(Goals) + Sum([Post-season Goals])"
        }
      }],
      qInitialDataFetch: [{
        qWidth: 2,
        qHeight: 1000
      }]
    }
  }).then((object) => {
    subjectCube.object = object;
    const update = () => object.getLayout().then((layout) => {
      //todo
    });
    object.on('changed', update);
    update();
  });
}

subjectCube.changeState = (state) => {
  if(state === "PlayerState") {
    return subjectCube.object.applyPatches([
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qStateName",
        qValue: JSON.stringify("PlayerState")
      },
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qDimensions/0/qDef/qFieldDefs/0",
        qValue: JSON.stringify("[Player Name]")
      },
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qMeasures/0/qDef/qDef",
        qValue: JSON.stringify("Sum(Goals) + Sum([Post-season Goals])")
      }
    ]);
  } else if (state === "OpponentState") {
    return subjectCube.object.applyPatches([
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qStateName",
        qValue: JSON.stringify("OpponentState")
      },
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qDimensions/0/qDef/qFieldDefs/0",
        qValue: JSON.stringify("[Opponent]")
      },
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qMeasures/0/qDef/qDef",
        qValue: JSON.stringify("Sum({<[Regular/Post Season]={'Regular season'}>} [Opponent Goals]) + Sum({<[Regular/Post Season]={'Post-season'}>} [Opponent Goals])")
      }
    ]);
  }
}

export default subjectCube;