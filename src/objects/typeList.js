import qlikapp from "../qlikapp";

let typeList = {};

typeList.init = () => {
  return qlikapp.then((app) => {
    return app.createSessionObject({
      qInfo: {
        qType: "visualization",
      },
      qListObjectDef: {
        qStateName: "PlayerState",
        qDef: {
          qFieldDefs: ["[Regular/Post Season Flag]"]
        },
        qShowAlternatives: true,
        qInitialDataFetch: [{
          qWidth: 1,
          qHeight: 2
        }]
      }
    });
  }).then((object) => {
    typeList.object = object;
    const update = () => object.getLayout().then((layout) => {
      if (layout.qListObject.qDataPages[0].qMatrix[1][0].qState === "S") {
        $(".regular").css("opacity", 1);
        $(".post").css("opacity", .4);
      } else if (layout.qListObject.qDataPages[0].qMatrix[0][0].qState === "S") {
        $(".regular").css("opacity", .4);
        $(".post").css("opacity", 1);
      } else {
        $(".regular, .post").css("opacity", 1);
      }
    });
    object.on('changed', update);
    update();
  });
}

typeList.changeState = (state) => {
  if(state === "PlayerState") {
    return typeList.object.applyPatches([
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qStateName",
          qValue: JSON.stringify("PlayerState")
      },
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qDef/qFieldDefs/0",
          qValue: JSON.stringify("[Regular/Post Season Flag]")
      }
    ]);
  } else if (state === "OpponentState") {
    return typeList.object.applyPatches([
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qStateName",
          qValue: JSON.stringify("OpponentState")
      },
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qDef/qFieldDefs/0",
          qValue: JSON.stringify("[Regular/Post Season]")
      }
    ]);
  }
}

export default typeList;