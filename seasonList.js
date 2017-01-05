let seasonList = {};

seasonList.init = () => {
  return app.createSessionObject({
    qInfo: {
      qType: "visualization",
    },
    qListObjectDef: {
      qStateName: "PlayerState",
      qDef: {
        qFieldDefs: ["[Season]"]
      },
      qShowAlternatives: true,
      qInitialDataFetch: [{
        qWidth: 1,
        qHeight: 1000
      }]
    }
  }).then((object) => {
    seasonList.object = object;
    const update = () => object.getLayout().then((layout) => {
      //todo
    });
    object.on('changed', update);
    update();
  });
}

seasonList.changeState = (state) => {
  if(state === "PlayerState") {
    return seasonList.object.applyPatches([
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qStateName",
          qValue: JSON.stringify("PlayerState")
      }
    ]);
  } else if (state === "OpponentState") {
    return seasonList.object.applyPatches([
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qStateName",
          qValue: JSON.stringify("OpponentState")
      }
    ]);
  }
}

export default seasonList;