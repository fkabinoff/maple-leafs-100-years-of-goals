const enigma = require('enigma.js');
const qixSchema = require('json-loader!./node_modules/enigma.js/schemas/qix/3.1/schema.json');
//import create_qObjects from "./qObjects";
import subjectList from "./subjectList";
import seasonCube from "./seasonCube";

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

enigma.getService('qix', config).then((qix) => {
  // qix.global.openApp('bde082fa-6317-4b87-9e71-48933d434954').then((app) => {
    qix.global.openApp('National Post - Toronto Maple Leafs.qvf').then((app) => {
    window.app = app;
    // create_qObjects().then((qObjects) => { 
    //   window.qObjects = qObjects;
    // });
    subjectList.init().then(() => { 
      return subjectList.changeState("OpponentState");
    }).then(() => {
      subjectList.object.getLayout().then((layout) => {
        console.log(layout);
      });
    });
    seasonCube.init().then(() => {
      return seasonCube.changeState("PlayerState");
    }).then(() => {
      seasonCube.object.getLayout().then((layout) => {
        console.log(layout);
      })
    })

  });
});