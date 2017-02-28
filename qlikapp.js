const enigma = require('enigma.js');
const qixSchema = require('json-loader!./node_modules/enigma.js/schemas/qix/3.1/schema.json');

// const config = {
//   schema: qixSchema,
//   session: {
//     host: 'sense-demo-staging.qlik.com',
// 		prefix: '',
// 		port: 443,
// 		unsecure: false
//   }
// };

const config = {
  schema: qixSchema,
  session: {
    host: 'localhost',
		prefix: '',
		port: 4848,
		unsecure: true
  }
};

export default enigma.getService('qix', config).then((qix) => {
  //return qix.global.openApp('bde082fa-6317-4b87-9e71-48933d434954').then((app) => {
  return qix.global.openApp('National Post - Toronto Maple Leafs(1).qvf').then((app) => {
    return app.getAppLayout().then((layout) => {
      let playerState, opponentState;
      if (layout.qStateNames.indexOf("PlayerState") == -1) {
        playerState = app.addAlternateState("PlayerState");
      }
      if (layout.qStateNames.indexOf("OpponentState") == -1) {
        opponentState = app.addAlternateState("OpponentState");
      }
      return Promise.all([playerState, opponentState]);
    }).then(() => {
      window.app = app;
      return app;
    });
  });
});

