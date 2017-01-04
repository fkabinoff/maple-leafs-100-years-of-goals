let decadeList = {};

decadeList.init = () => {
  return app.createSessionObject({
    qInfo: {
      qType: 'visualization',
    },
    qListObjectDef: {
      qStateName: "PlayerState",
      qDef: {
        qFieldDefs: ['[Player Season Decade]']
      },
      qShowAlternatives: true,
      qInitialDataFetch: [{
        qWidth: 1,
        qHeight: 1000
      }]
    }
  }).then((object) => {
    decadeList.object = object;
    const update = () => object.getLayout().then((layout) => {
      //todo
    });
    object.on('changed', update);
    update();
  });
}

decadeList.changeState = (state) => {
  if(state === "PlayerState") {
    return decadeList.object.applyPatches([
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qStateName",
          qValue: JSON.stringify("PlayerState")
      },
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qDef/qFieldDefs/0",
          qValue: JSON.stringify("[Player Season Decade]")
      }
    ]);
  } else if (state === "OpponentState") {
    return decadeList.object.applyPatches([
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qStateName",
          qValue: JSON.stringify("OpponentState")
      },
      {
          qOp: "replace",
          qPath: "/qListObjectDef/qDef/qFieldDefs/0",
          qValue: JSON.stringify("[Opponent Season Decade]")
      }
    ]);
  }
}

export default decadeList;