export default () => {
  let qObjects = {};
  return new Promise((resolve, reject) => { 
    //create alternate states
    app.getAppLayout().then((layout) => {
      let playerState, opponentState;
      if (layout.qStateNames.indexOf("PlayerState") == -1) {
        playerState = app.addAlternateState("PlayerState");
      }
      if (layout.qStateNames.indexOf("OpponentState") == -1) {
        opponentState = app.addAlternateState("OpponentState");
      }
      return Promise.all([playerState, opponentState]);
    }).then(() => {
      //create lists and cubes
      //Subject list
      let subjectList = app.createSessionObject({
        qInfo: {
          qType: 'visualization',
        },
        qListObjectDef: {
          qStateName: "PlayerState",
          qDef: {
            qFieldDefs: ['[Player Name]']
          },
          qShowAlternatives: true,
          qInitialDataFetch: [{
            qWidth: 1,
            qHeight: 1000
          }]
        }
      }).then((object) => {
        qObjects.subjectList = object;
        const update = () => object.getLayout().then((layout) => {
          //todo
        });
        object.on('changed', update);
        update();
      });
      //Season list
      let seasonList = app.createSessionObject({
        qInfo: {
          qType: 'visualization',
        },
        qListObjectDef: {
          qStateName: "PlayerState",
          qDef: {
            qFieldDefs: ['[Season]']
          },
          qShowAlternatives: true,
          qInitialDataFetch: [{
            qWidth: 1,
            qHeight: 1000
          }]
        }
      }).then((object) => {
        qObjects.seasonList = object;
        const update = () => object.getLayout().then((layout) => {
          //todo
        });
        object.on('changed', update);
        update();
      });
      //Decade list
      let decadeList = app.createSessionObject({
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
        qObjects.decadeList = object;
        const update = () => object.getLayout().then((layout) => {
          //todo
        });
        object.on('changed', update);
        update();
      });
      //Season cube
      let seasonCube = app.createSessionObject({
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
      //Subject cube
      let subjectCube = app.createSessionObject({
        qInfo: {
          qType: 'visualization',
        },
        qHyperCubeDef: {
          qStateName: "PlayerState",
          qDimensions: [{
            qDef: {
              qFieldDefs: ['[Player Name]']
            },
            qSortCriterias: [{
              qSortByAscii: -1
            }]
          }],
          qMeasures: [{
            qDef: {
              qDef: "Sum(Goals) + Sum([Post-season Goals])"
            }
          }],
          qInitialDataFetch: [{
            qWidth: 2,
            qHeight: 1000
          }]
        }
      }).then((object) => {
        qObjects.subjectCube = object;
        const update = () => object.getLayout().then((layout) => {
          //todo
        });
        object.on('changed', update);
        update();
      });
      //Expressions
      let expressions = app.createSessionObject({
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
        qObjects.expressions = object;
        const update = () => object.getLayout().then((layout) => {
          //todo
        });
        object.on('changed', update);
        update();
      });
      return Promise.all([subjectList, seasonList, decadeList, seasonCube, subjectCube, expressions]);
    }).then(() => {
       resolve(qObjects);
    });
  });
}