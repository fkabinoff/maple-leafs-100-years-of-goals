import qlikapp from "./qlikapp";

let expressions = {};

expressions.init = () => {
  return qlikapp.then((app) => {
    return app.createSessionObject({
      qInfo: {
        qType: 'expressions',
      },
      totalGoals: {
        qStringExpression: {
          qExpr: "Sum({PlayerState} Goals) + Sum({PlayerState} [Post-season Goals])"
        }
      },
      evGoals: {
        qStringExpression: {
          qExpr: "Sum([Even Strength Goals]) + Sum([Post-season Even Strength Goals])"
        }
      },
      ppGoals: {
        qStringExpression: {
          qExpr: "Sum([Power Play Goals]) + Sum([Post-season Power Play Goals])"
        }
      },
      shGoals: {
        qStringExpression: {
          qExpr: "Sum([Short Handed Goals]) + Sum([Post-season Short Handed Goals])"
        }
      }
    });
  }).then((object) => {
    expressions.object = object;
    const update = () => object.getLayout().then((layout) => {
      
    });
    object.on('changed', update);
    update();
  });
}

expressions.changeState = (state) => {
  if(state === "PlayerState") {
    return expressions.object.applyPatches([
      {
          qOp: "replace",
          qPath: "/totalGoals/qStringExpression/qExpr",
          qValue: JSON.stringify("Sum({PlayerState} Goals) + Sum({PlayerState} [Post-season Goals])")
      }
    ]);
  } else if (state === "OpponentState") {
    return expressions.object.applyPatches([
      {
          qOp: "replace",
          qPath: "/totalGoals/qStringExpression/qExpr",
          qValue: JSON.stringify("Sum({OpponentState} Goals) + Sum({OpponentState} [Post-season Goals])")
      }
    ]);
  }
}

export default expressions;