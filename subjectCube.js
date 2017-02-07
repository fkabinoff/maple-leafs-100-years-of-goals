import qlikapp from "./qlikapp";
import SubjectChart from "./subjectChart";

let subjectCube = {};
subjectCube.element = "#subject-chart";
let playerMeasure = "Sum(Goals) + Sum([Post-season Goals])";
let playerLabel = "Goals";
let opponentMeasure = "Sum({<[Regular/Post Season]={'Regular season'}>} [Opponent Goals]) + Sum({<[Regular/Post Season]={'Post-season'}>} [Opponent Goals])";

subjectCube.init = () => {
  return qlikapp.then((app) => {
    return app.createSessionObject({
      qInfo: {
        qType: "visualization",
      },
      qHyperCubeDef: {
        qStateName: "PlayerState",
        qDimensions: [{
          qDef: {
            qFieldDefs: ["[Player Name]"],
          },
          qSortCriterias: [{
            qSortByAscii: -1
          }]
        }],
        qMeasures: [{
          qDef: {
            qDef: "Sum(Goals) + Sum([Post-season Goals])",
            qLabel: playerLabel
          },
          qSortBy: {
            qSortByNumeric: -1
          }
        }],
        qSuppressMissing: true,
        qSuppressZero: true,
        qInterColumnSortOrder: [1,0],
        qInitialDataFetch: [{
          qWidth: 2,
          qHeight: 100
        }]
      }
    });
  }).then((object) => {
    subjectCube.object = object;
    subjectCube.chart = new SubjectChart(subjectCube);
    const update = () => object.getLayout().then((layout) => {
      subjectCube.chart.draw(layout);
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
        qValue: JSON.stringify(playerMeasure)
      },
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qMeasures/0/qDef/qLabel",
        qValue: JSON.stringify(playerLabel)
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
      },
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qMeasures/0/qDef/qLabel",
        qValue: JSON.stringify("Goals")
      }
    ]);
  }
}

subjectCube.changeMeasure = (measure) => {
  if (measure === "Total") {
    playerMeasure = "Sum(Goals) + Sum([Post-season Goals])";
    playerLabel = "Goals";
  } else if (measure === "EV") {
    playerMeasure = "Sum([Even Strength Goals]) + Sum([Post-season Even Strength Goals])";
    playerLabel = "Even Strength Goals";
  } else if (measure === "PP") {
    playerMeasure = "Sum([Power Play Goals]) + Sum([Post-season Power Play Goals])";
    playerLabel = "Power Play Goals";
  } else if (measure === "SH") {
    playerMeasure = "Sum([Short Handed Goals]) + Sum([Post-season Short Handed Goals])";
    playerLabel = "Short Handed Goals";
  } else if (measure === "GW") {
    playerMeasure = "Sum([Game Winning Goals]) + Sum([Post-season Game Winning Goals])";
    playerLabel = "Game Winning Goals";
  }
  return subjectCube.object.applyPatches([
    {
      qOp: "replace",
      qPath: "/qHyperCubeDef/qMeasures/0/qDef/qDef",
      qValue: JSON.stringify(playerMeasure)
    },
    {
      qOp: "replace",
      qPath: "/qHyperCubeDef/qMeasures/0/qDef/qLabel",
      qValue: JSON.stringify(playerLabel)
    }
  ]);
}

export default subjectCube;