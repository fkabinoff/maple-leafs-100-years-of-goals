let expressions = {};

expressions.init = () => {
  return app.createSessionObject({
    qInfo: {
      qType: 'expressions',
    },
    totalGoals: {
      qStringExpression: {
        qExpr: "Sum(Goals) + Sum([Post-season Goals])"
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
  }).then((object) => {
    expressions.object = object;
    const update = () => object.getLayout().then((layout) => {
      //todo
    });
    object.on('changed', update);
    update();
  });
}