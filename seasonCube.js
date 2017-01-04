let seasonCube = {};

seasonCube.init = () => {
  return app.createSessionObject({
    qInfo: {
      qType: 'visualization',
    },
    qHyperCubeDef: {
      qStateName: "PlayerState",
      qDimensions: [{
        qDef: {
          qFieldDefs: ['[Season]']
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
  }).then((object) => {
    qObjects.seasonCube = object;
    const update = () => object.getLayout().then((layout) => {
      //todo
    });
    object.on('changed', update);
    update();
  });
}

seasonCube.changeState = (state) => {
  if(state === "PlayerState") {
    return subjectList.object.applyPatches([
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qStateName",
        qValue: JSON.stringify("PlayerState")
      }
    ]);
  } else if (state === "OpponentState") {
    return subjectList.object.applyPatches([
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qStateName",
        qValue: JSON.stringify("OpponentState")
      }
    ]);
  }
}

export default seasonCube;