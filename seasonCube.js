import qlikapp from "./qlikapp";
import * as d3 from "d3";

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

    let margin = {top: 0, right: 0, bottom: 30, left: 40},
        width = 500 - margin.left - margin.right,
        height = 100 - margin.top - margin.bottom,
        svg = d3.select("#season-chart").append("svg")
          .attr("viewbox", "0 0 500 1000")
          .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("width", "100%")
          .attr("height", "100%")
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const update = () => object.getLayout().then((layout) => {
      let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
          y = d3.scaleLinear().rangeRound([height, 0]);
      x.domain(layout.qHyperCube.qDataPages[0].qMatrix.length);
      y.domain([0, Math.max(...layout.qHyperCube.qDataPages[0].qMatrix.map((year) => { return year[1].qNum + year[2].qNum }))]);
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