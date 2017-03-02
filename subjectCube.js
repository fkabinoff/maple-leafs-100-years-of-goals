import qlikapp from "./qlikapp";
import SubjectChart from "./subjectChart";

let subjectCube = {};
subjectCube.element = "#subject-chart";
subjectCube.currentState = "PlayerState";
let playerMeasures = ["Sum(Goals)", "Sum([Post-season Goals])", "Sum(Goals) + Sum([Post-season Goals])"];
let playerLabels = ["Regular Season Goals", "Post-season Goals"];
let opponentMeasures = ["If(GetSelectedCount([Regular/Post Season])=1 and GetFieldSelections([Regular/Post Season])='Post-season', 0, Sum({<[Regular/Post Season]={'Regular season'}>} [Opponent Goals]))", "If(GetSelectedCount([Regular/Post Season])=1 and GetFieldSelections([Regular/Post Season])='Regular season', 0, Sum({<[Regular/Post Season]={'Post-season'}>} [Opponent Goals]))" , "Sum([Opponent Goals])"];
let opponentLabels = ["Regular Season Goals", "Post-season Goals"];

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
            qDef: "Sum(Goals)",
            qLabel: playerLabels[0]
          }
        }, {
          qDef: {
            qDef: "Sum([Post-season Goals])",
            qLabel: playerLabels[1]
          }
        }, {
          qDef: {
            qDef: "Sum(Goals) + Sum([Post-season Goals])"
          },
          qSortBy: {
            qSortByNumeric: -1
          }
        }],
        qSuppressMissing: true,
        qSuppressZero: true,
        qInterColumnSortOrder: [3,0],
        qInitialDataFetch: [{
          qWidth: 4,
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
    subjectCube.currentState = "PlayerState";
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
        qValue: JSON.stringify(playerMeasures[0])
      },
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qMeasures/0/qDef/qLabel",
        qValue: JSON.stringify(playerLabels[0])
      },
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qMeasures/1/qDef/qDef",
        qValue: JSON.stringify(playerMeasures[1])
      },
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qMeasures/1/qDef/qLabel",
        qValue: JSON.stringify(playerLabels[1])
      },
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qMeasures/2/qDef/qDef",
        qValue: JSON.stringify(playerMeasures[2])
      },
    ]);
  } else if (state === "OpponentState") {
    subjectCube.currentState = "OpponentState";
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
        qValue: JSON.stringify(opponentMeasures[0])
      },
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qMeasures/0/qDef/qLabel",
        qValue: JSON.stringify(opponentLabels[0])
      },
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qMeasures/1/qDef/qDef",
        qValue: JSON.stringify(opponentMeasures[1])
      },
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qMeasures/1/qDef/qLabel",
        qValue: JSON.stringify(opponentLabels[1])
      },
      {
        qOp: "replace",
        qPath: "/qHyperCubeDef/qMeasures/2/qDef/qDef",
        qValue: JSON.stringify(opponentMeasures[2])
      },
    ]);
  }
}

subjectCube.changeMeasure = (measure) => {
  if (measure === "Total") {
    playerMeasures = ["Sum(Goals)", "Sum([Post-season Goals])", "Sum(Goals) + Sum([Post-season Goals])"];
    playerLabels = ["Regular Season Goals", "Post-season Goals"];
  } else if (measure === "EV") {
    playerMeasures = ["Sum([Even Strength Goals])", "Sum([Post-season Even Strength Goals])", "Sum([Even Strength Goals]) + Sum([Post-season Even Strength Goals])"];
    playerLabels = ["Regular Season Even Strength Goals", "Post-season Even Strength Goals"];
  } else if (measure === "PP") {
    playerMeasures = ["Sum([Power Play Goals])", "Sum([Post-season Power Play Goals])", "Sum([Power Play Goals]) + Sum([Post-season Power Play Goals])"];
    playerLabels = ["Regular Season Power-Play Goals", "Post-season Power-Play Goals"];
  } else if (measure === "SH") {
    playerMeasures = ["Sum([Short Handed Goals])", "Sum([Post-season Short Handed Goals])", "Sum([Short Handed Goals]) + Sum([Post-season Short Handed Goals])"];
    playerLabels = ["Regular Season Shorthanded Goals", "Post-season Shorthanded Goals"];
  } else if (measure === "GW") {
    playerMeasures = ["Sum([Game Winning Goals])", "Sum([Post-season Game Winning Goals])", "Sum([Game Winning Goals]) + Sum([Post-season Game Winning Goals])"];
    playerLabels = ["Regular Season Game Winning Goals", "Post-season Game Winning Goals"];
  }
  return subjectCube.object.applyPatches([
    {
      qOp: "replace",
      qPath: "/qHyperCubeDef/qMeasures/0/qDef/qDef",
      qValue: JSON.stringify(playerMeasures[0])
    },
    {
      qOp: "replace",
      qPath: "/qHyperCubeDef/qMeasures/0/qDef/qLabel",
      qValue: JSON.stringify(playerLabels[0])
    },
    {
      qOp: "replace",
      qPath: "/qHyperCubeDef/qMeasures/1/qDef/qDef",
      qValue: JSON.stringify(playerMeasures[1])
    },
    {
      qOp: "replace",
      qPath: "/qHyperCubeDef/qMeasures/1/qDef/qLabel",
      qValue: JSON.stringify(playerLabels[1])
    },
    {
      qOp: "replace",
      qPath: "/qHyperCubeDef/qMeasures/2/qDef/qDef",
      qValue: JSON.stringify(playerMeasures[2])
    },
  ]);
}

export default subjectCube;