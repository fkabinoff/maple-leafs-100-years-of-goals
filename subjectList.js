let subjectList = {};

subjectList.init = () => {
  return app.createSessionObject({
    qInfo: {
      qType: "visualization",
    },
    qListObjectDef: {
      qStateName: "PlayerState",
      qDef: {
        qFieldDefs: ["[Player Name]"]
      },
      qShowAlternatives: true,
      qInitialDataFetch: [{
        qWidth: 1,
        qHeight: 1000
      }]
    }
  }).then((object) => {
    subjectList.object = object;
    const update = () => object.getLayout().then((layout) => {
      //todo
    });
    object.on('changed', update);
    update();
  });
}

subjectList.changeState = (state) => {
  if(state === "PlayerState") {
    return subjectList.object.applyPatches([
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qStateName",
          qValue: JSON.stringify("PlayerState")
      },
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qDef/qFieldDefs/0",
          qValue: JSON.stringify("[Player Name]")
      }
    ]);
  } else if (state === "OpponentState") {
    return subjectList.object.applyPatches([
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qStateName",
          qValue: JSON.stringify("OpponentState")
      },
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qDef/qFieldDefs/0",
          qValue: JSON.stringify("[Opponent]")
      }
    ]);
  }
}

export default subjectList;