const enigma = require('enigma.js');
const qixSchema = require('json-loader!./node_modules/enigma.js/schemas/qix/3.1/schema.json');
import create_qObjects from "./qObjects";

const config = {
  schema: qixSchema,
  session: {
    host: 'sense-demo-staging.qlik.com',
		prefix: '',
		port: 443,
		unsecure: false
  }
};

enigma.getService('qix', config).then((qix) => {
  qix.global.openApp('bde082fa-6317-4b87-9e71-48933d434954').then((app) => {
    window.app = app;
    let qObjects = create_qObjects();
    window.qObjects = qObjects;

  });
});